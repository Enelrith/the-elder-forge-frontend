import { ErrorResponse } from '@/types/api';
import { getBackendUrl } from '@/util/util';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const baseConfig: AxiosRequestConfig = {
  baseURL: getBackendUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export const axiosBase = axios.create(baseConfig);

axiosBase.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    if (match) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
  }
  return config;
});

axiosBase.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const data = error.response.data;

      if (!data || typeof data !== 'object') {
        return Promise.reject(new Error(`HTTP error ${error.response.status}`));
      }

      return Promise.reject(data);
    }

    return Promise.reject(new Error('Network error'));
  }
);
