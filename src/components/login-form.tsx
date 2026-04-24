'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './ui/form-input';
import FormButton from './ui/form-button';
import { ErrorResponse } from '@/types/api';
import { loginUser } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsPending(true);
    setError(null);

    try {
      await loginUser(email, password);
      router.push('/');
      router.refresh();
    } catch (caughtError) {
      setError(caughtError as ErrorResponse);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="m-auto mt-50 flex flex-col gap-y-2 bg-gray-500 p-2"
    >
      <h2 className="m-auto text-lg font-semibold">Login</h2>
      <FormInput
        label="email"
        labelValue="Email:"
        type="email"
        required={true}
        max={255}
      />
      <FormInput
        label="password"
        labelValue="Password:"
        type="password"
        required={true}
        min={8}
        max={72}
      />
      {error?.message && (
        <p className="text-sm text-red-400">{error.message}</p>
      )}
      <FormButton
        buttonValue={isPending ? 'Logging in...' : 'Login'}
        disabled={isPending}
      />
    </form>
  );
}
