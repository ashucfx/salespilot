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

// Mutex lock and request queue for token refresh concurrency
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for auto token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Only attempt token refresh on 401 — and only once per request
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(
            `${getBaseUrl()}/auth/refresh`,
            { refreshToken }
          );
          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;
          
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          // Refresh failed — session truly expired, logout
          useAuthStore.getState().logout();
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token at all — likely just not logged in yet
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
