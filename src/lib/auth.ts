import { axiosBase } from './axios';
import { User } from '@/types/auth';

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

export async function loginUser(email: string, password: string): Promise<void> {
  await axiosBase.post('/api/v1/auth', {
    email,
    password,
  });
}
