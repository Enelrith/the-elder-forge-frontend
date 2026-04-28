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
      className="surface-panel flex w-full flex-col gap-4 p-5 sm:p-6"
    >
      <div className="space-y-2 border-b border-stone-700 pb-4">
        <p className="forge-kicker">Sign Up</p>
        <h2 className="forge-title text-3xl font-semibold">
          Create Your Account
        </h2>
        <p className="text-muted text-sm leading-6">
          Start a vault for your Skyrim load orders and share them when they are
          ready.
        </p>
      </div>

      <FormInput
        label="username"
        labelValue="Username:"
        type="text"
        required={true}
        max={20}
      />
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
      <FormInput
        label="confirmPassword"
        labelValue="Confirm Password:"
        type="password"
        required={true}
        min={8}
        max={72}
      />

      {state.errors?.validationErrors ? (
        <ul className="space-y-1 text-sm text-red-300">
          {Object.entries(state.errors.validationErrors).map(
            ([field, message]) => (
              <li key={field}>{message}</li>
            )
          )}
        </ul>
      ) : state.errors?.message ? (
        <p className="text-sm text-red-300" role="alert">
          {state.errors.message}
        </p>
      ) : null}

      {state.errors?.message && state.errors.validationErrors && (
        <p className="sr-only" role="alert">
          {state.errors.message}
        </p>
      )}

      <FormButton buttonValue="Sign Up" />
    </form>
  );
}
