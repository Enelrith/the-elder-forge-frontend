import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getCookieHeader(): Promise<string> {
  return (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

export async function requireCookieHeader(): Promise<string> {
  const cookieHeader = await getCookieHeader();

  if (!cookieHeader) {
    redirect('/auth/login');
  }

  return cookieHeader;
}
