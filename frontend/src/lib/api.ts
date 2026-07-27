import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const getBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auto token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Only attempt token refresh on 401 — and only once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${getBaseUrl()}/auth/refresh`,
            { refreshToken }
          );
          useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — session truly expired, logout
          useAuthStore.getState().logout();
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined') window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        // No refresh token at all — likely just not logged in yet
        // Don't call logout() here to avoid clearing partial auth state
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // For non-401 errors, show toast but do NOT logout
    if (status !== 401) {
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
      // Don't show toast for network errors on initial load (no response at all)
      if (error.response) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);
