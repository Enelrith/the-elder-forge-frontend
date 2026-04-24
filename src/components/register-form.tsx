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
      className="forge-panel flex w-full flex-col gap-y-5 rounded-xs p-8 sm:p-10"
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-300 uppercase">Sign Up</p>
        <h2 className="forge-title text-3xl font-semibold">
          Create Your Account
        </h2>
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

      {state.errors?.message && (
        <p className="text-danger text-sm">{state.errors.message}</p>
      )}

      <FormButton buttonValue="Sign Up" />
    </form>
  );
}
