import { Modlist, ModlistInfo } from '@/types/modlists';
import { axiosBase } from './axios';

export async function getAllModlistsByUserEmail(
  cookieHeader?: string
): Promise<ModlistInfo[]> {
  try {
    const { data } = await axiosBase.get<ModlistInfo[]>('/api/v1/modlists', {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return data;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error.status === 401 || error.status === 403)
    ) {
      return [];
    }

    throw error;
  }
}

export async function getModlistById(
  modlistId: string,
  cookieHeader?: string
): Promise<Modlist | null> {
  try {
    const { data } = await axiosBase.get<Modlist>(`/api/v1/modlists/${modlistId}`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return data;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error.status === 401 || error.status === 403 || error.status === 404)
    ) {
      return null;
    }

    throw error;
  }
}
