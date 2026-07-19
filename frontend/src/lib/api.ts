import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
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
    
    // Auto-refresh token if 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/refresh`,
            { refreshToken }
          );
          
          useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          toast.error('Session expired. Please log in again.');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } else {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    
    // Global error handler
    const message = error.response?.data?.message || 'An unexpected error occurred';
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);
