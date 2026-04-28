'use server';
import { redirect } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { ActionState, ErrorResponse } from '@/types/api';

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return {
      errors: {
        timestamp: new Date().toISOString(),
        status: 400,
        message: 'Passwords do not match.',
        error: 'Bad Request',
        path: '/auth/register',
        validationErrors: {
          confirmPassword: 'Passwords do not match.',
        },
      },
    };
  }

  try {
    await registerUser(email, password, username);
  } catch (error) {
    return { errors: error as ErrorResponse };
  }
  redirect('/auth/login');
}
