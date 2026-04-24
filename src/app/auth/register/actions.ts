'use server';
import { redirect } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { ActionState, ErrorResponse } from '@/types/api';

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await registerUser(email, password);
  } catch (error) {
    return { errors: error as ErrorResponse };
  }
  redirect('/auth/login');
}
