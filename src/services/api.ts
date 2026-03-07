import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { ENV } from '../config/env';

// API Base URL from environment configuration
const BASE_URL = ENV.API_BASE_URL;
console.log(BASE_URL)
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, {
            refresh: refreshToken
          });

          const newAccess = response.data.access;

          // Save new access token
          useAuthStore.getState().setTokens(newAccess, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed (token expired/invalid), logout user
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
