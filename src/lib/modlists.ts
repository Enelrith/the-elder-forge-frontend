import { ModlistInfo } from '@/types/modlists';
import { axiosAuth } from './axios';

export async function getAllModlistsByUserEmail(): Promise<ModlistInfo[]> {
  const { data } = await axiosAuth.get<ModlistInfo[]>('/api/v1/modlists');
  return data;
}
