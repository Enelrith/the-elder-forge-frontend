import { ErrorResponse } from '@/types/api';
import { AccessJwtResponse } from '@/types/auth';
import { getBackendUrl } from '@/util/util';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let initializePromise: Promise<string | null> | null = null;
let hasRefreshFailed = false;

const baseConfig: AxiosRequestConfig = {
  baseURL: getBackendUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export const axiosNoAuth = axios.create(baseConfig);
export const axiosAuth = axios.create(baseConfig);

function normalizeAxiosError(error: AxiosError<ErrorResponse>) {
  if (error.response) {
    const data = error.response.data;

    if (!data || typeof data !== 'object') {
      return Promise.reject(new Error(`HTTP error ${error.response.status}`));
    }

    return Promise.reject(data);
  }

  return Promise.reject(new Error('Network error'));
}

axiosNoAuth.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => normalizeAxiosError(error)
);

axiosAuth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      const refreshedToken = await refreshAccessToken();

      if (refreshedToken) {
        originalRequest.headers.set(
          'Authorization',
          `Bearer ${refreshedToken}`
        );
        return axiosAuth(originalRequest);
      }
    }

    return normalizeAxiosError(error);
  }
);

export function setAccessToken(token: string | null) {
  accessToken = token;

  if (token) {
    axiosAuth.defaults.headers.common.Authorization = `Bearer ${token}`;
    hasRefreshFailed = false;
    return;
  }

  delete axiosAuth.defaults.headers.common.Authorization;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (hasRefreshFailed) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = axiosNoAuth
      .post<AccessJwtResponse>('/api/v1/auth/refresh', undefined, {
        skipAuthRefresh: true,
      } as RetryableRequestConfig)
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch(() => {
        hasRefreshFailed = true;
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function initializeAuth(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (accessToken) {
    return accessToken;
  }

  if (!initializePromise) {
    initializePromise = refreshAccessToken().finally(() => {
      initializePromise = null;
    });
  }

  return initializePromise;
}
