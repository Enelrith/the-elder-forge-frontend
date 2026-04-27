import { axiosBase } from './axios';
import { User } from '@/types/auth';

const AUTH_EMAIL_STORAGE_KEY = 'elder-forge.auth.email';
const AUTH_EMAIL_EVENT_NAME = 'auth-email-changed';

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const { data } = await axiosBase.post<User>('/api/v1/users', {
    email,
    password,
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  await axiosBase.post('/api/v1/auth', {
    email,
    password,
  });
}

export async function logoutUser(): Promise<void> {
  await axiosBase.post('/api/v1/auth/logout');
}

export function persistAuthenticatedEmail(email: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email);
  window.dispatchEvent(
    new CustomEvent(AUTH_EMAIL_EVENT_NAME, {
      detail: email,
    })
  );
}

export function clearAuthenticatedEmail(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(AUTH_EMAIL_EVENT_NAME, {
      detail: null,
    })
  );
}

export function getPersistedAuthenticatedEmail(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_EMAIL_STORAGE_KEY);
}

export function getAuthEmailStorageKey(): string {
  return AUTH_EMAIL_STORAGE_KEY;
}

export function getAuthEmailEventName(): string {
  return AUTH_EMAIL_EVENT_NAME;
}
