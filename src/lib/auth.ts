import { axiosNoAuth, setAccessToken } from './axios';
import { LoginResponse, User } from '@/types/auth';

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const { data } = await axiosNoAuth.post<User>('/api/v1/users', {
    email,
    password,
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await axiosNoAuth.post<LoginResponse>('/api/v1/auth', {
    email,
    password,
  });

  setAccessToken(data.accessToken);
  return data;
}
