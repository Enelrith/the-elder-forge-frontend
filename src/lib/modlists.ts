import {
  AddModlist,
  Mod,
  Modlist,
  ModlistInfo,
  Plugin,
} from '@/types/modlists';
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
    const { data } = await axiosBase.get<Modlist>(
      `/api/v1/modlists/${modlistId}`,
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      }
    );

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

export async function addModlist(request: AddModlist): Promise<Modlist> {
  const { data } = await axiosBase.post<Modlist>('/api/v1/modlists', request);
  return data;
}

// The backend expects a multipart/form-data request with a part named
// "modlistFile" containing the modlist.txt file. Axios automatically sets
// the correct Content-Type boundary when a FormData body is provided.
export async function addModsByFile(
  modlistId: string,
  file: File
): Promise<Mod[]> {
  const formData = new FormData();
  formData.append('modlistFile', file);

  const { data } = await axiosBase.post<Mod[]>(
    `/api/v1/modlists/${modlistId}/mods/file`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data;
}

// The backend expects a multipart/form-data request with a part named
// "loadOrderFile" containing the loadorder.txt file.
export async function addPluginsByFile(
  modlistId: string,
  file: File
): Promise<Plugin[]> {
  const formData = new FormData();
  formData.append('loadOrderFile', file);

  const { data } = await axiosBase.post<Plugin[]>(
    `/api/v1/modlists/${modlistId}/plugins/file`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data;
}
