'use client';
import { useActionState } from 'react';
import FormButton from './ui/form-button';
import FormInput from './ui/form-input';
import { registerAction } from '@/app/auth/register/actions';
import type { ActionState } from '@/types/api';

const initialState: ActionState = { errors: null };

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form
      action={formAction}
      className="m-auto mt-20 flex w-sm flex-col gap-y-2 rounded-md bg-gray-500 p-2"
    >
      <h2 className="text-center text-lg font-semibold">Register</h2>

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

      {state.errors?.message && (
        <p className="text-sm text-red-400">{state.errors.message}</p>
      )}

      <FormButton buttonValue="Sign Up" />
    </form>
  );
}
