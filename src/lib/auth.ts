import { axiosBase } from './axios';
import { SessionAuth, User } from '@/types/auth';

const AUTH_DISPLAY_NAME_STORAGE_KEY = 'elder-forge.auth.display-name';
const LEGACY_AUTH_EMAIL_STORAGE_KEY = 'elder-forge.auth.email';
const AUTH_DISPLAY_NAME_EVENT_NAME = 'auth-display-name-changed';

export async function registerUser(
  email: string,
  password: string,
  username: string
): Promise<User> {
  const { data } = await axiosBase.post<User>('/api/v1/users', {
    email,
    password,
    username,
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<SessionAuth> {
  const { data } = await axiosBase.post<SessionAuth>('/api/v1/auth', {
    email,
    password,
  });

  return data;
}

export async function logoutUser(): Promise<void> {
  await axiosBase.post('/api/v1/auth/logout');
}

export async function getCurrentSession(
  cookieHeader?: string
): Promise<SessionAuth | null> {
  try {
    const { data } = await axiosBase.get<SessionAuth>('/api/v1/auth', {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    return data;
  } catch {
    return null;
  }
}

export function persistAuthenticatedDisplayName(displayName: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_DISPLAY_NAME_STORAGE_KEY, displayName);
  window.localStorage.removeItem(LEGACY_AUTH_EMAIL_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(AUTH_DISPLAY_NAME_EVENT_NAME, {
      detail: displayName,
    })
  );
}

export function clearAuthenticatedDisplayName(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_DISPLAY_NAME_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_AUTH_EMAIL_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(AUTH_DISPLAY_NAME_EVENT_NAME, {
      detail: null,
    })
  );
}

export function getPersistedAuthenticatedDisplayName(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    window.localStorage.getItem(AUTH_DISPLAY_NAME_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_AUTH_EMAIL_STORAGE_KEY)
  );
}

export function getAuthDisplayNameStorageKey(): string {
  return AUTH_DISPLAY_NAME_STORAGE_KEY;
}

export function getAuthDisplayNameEventName(): string {
  return AUTH_DISPLAY_NAME_EVENT_NAME;
}
