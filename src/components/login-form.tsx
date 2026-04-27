'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './ui/form-input';
import FormButton from './ui/form-button';
import { ErrorResponse } from '@/types/api';
import { loginUser, persistAuthenticatedEmail } from '@/lib/auth';

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
      persistAuthenticatedEmail(email);
      router.push('/modlists');
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
      className="surface-panel flex w-full flex-col gap-4 p-5 sm:p-6"
    >
      <div className="space-y-2 border-b border-stone-700 pb-4">
        <p className="forge-kicker">Account</p>
        <h2 className="forge-title text-3xl font-semibold">Login</h2>
        <p className="text-muted text-sm leading-6">
          Return to your vault and manage your load orders.
        </p>
      </div>
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
        <p className="text-sm text-red-300">{error.message}</p>
      )}
      <FormButton
        buttonValue={isPending ? 'Logging in...' : 'Login'}
        disabled={isPending}
      />
    </form>
  );
}
