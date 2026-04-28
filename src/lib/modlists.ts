import {
  AddModlist,
  GetAllModlistsStruture,
  Mod,
  Modlist,
  ModlistInfo,
  Plugin,
  UpdateModlist,
} from '@/types/modlists';
import { axiosBase } from './axios';

export async function getAllModlistsByUserEmail(
  cookieHeader?: string
): Promise<ModlistInfo[]> {
  const { data } = await axiosBase.get<ModlistInfo[]>('/api/v1/modlists/user', {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export async function getAllModlists(pageNumber: number, name?: string) {
  try {
    const { data } = await axiosBase.get<GetAllModlistsStruture>(
      '/api/v1/modlists',
      {
        params: {
          page: pageNumber,
          ...(name ? { name } : {}),
        },
      }
    );
    return data;
  } catch (error) {
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

export async function updateModlist(
  modlistId: string,
  request: UpdateModlist
): Promise<Modlist> {
  const { data } = await axiosBase.patch<Modlist>(
    `/api/v1/modlists/${modlistId}`,
    request
  );
  return data;
}

export async function updateModlistVisibility(
  modlistId: string,
  isPublic: boolean
): Promise<void> {
  await axiosBase.patch(`/api/v1/modlists/${modlistId}`, {
    isPublic,
  });
}

export async function deleteModlist(modlistId: string): Promise<void> {
  await axiosBase.delete(`/api/v1/modlists/${modlistId}`);
}

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

export async function addMetaBuilderInfoToModlist(
  modlistId: string,
  file: File
): Promise<Modlist> {
  const formData = new FormData();
  formData.append('modDataFile', file);

  const { data } = await axiosBase.post<Modlist>(
    `/api/v1/modlists/${modlistId}/meta`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data;
}
