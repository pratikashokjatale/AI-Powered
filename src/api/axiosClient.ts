import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { ApiError } from '../types/common';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach headers, request correlation IDs, or auth tokens
axiosClient.interceptors.request.use(
  (config) => {
    // Add client timestamp and tracing header
    config.headers['X-Client-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Normalize errors into standardized ApiError shape
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Backend returned 4xx or 5xx
      const backendError = error.response.data;
      return Promise.reject(
        backendError?.message
          ? backendError
          : {
              status: error.response.status,
              error: error.response.statusText,
              message: backendError?.message || 'Server returned an error',
              timestamp: new Date().toISOString(),
            }
      );
    } else if (error.request) {
      // Network error or backend not running
      return Promise.reject({
        status: 0,
        error: 'NETWORK_ERROR',
        message: `Unable to connect to backend at ${baseURL}. Check if Spring Boot is running.`,
        timestamp: new Date().toISOString(),
      });
    }

    return Promise.reject({
      status: 500,
      error: 'CLIENT_ERROR',
      message: error.message || 'An unexpected client error occurred',
      timestamp: new Date().toISOString(),
    });
  }
);

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await axiosClient.get('/actuator/health', { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
};
