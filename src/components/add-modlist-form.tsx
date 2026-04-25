'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addModlist, addModsByFile, addPluginsByFile } from '@/lib/modlists';
import { ErrorResponse } from '@/types/api';
import FormButton from './ui/form-button';
import FormInput from './ui/form-input';

type Step =
  | 'idle'
  | 'creating'
  | 'uploading-mods'
  | 'uploading-plugins'
  | 'done';

const STEP_LABELS: Record<Step, string> = {
  idle: 'Create Modlist',
  creating: 'Creating modlist...',
  'uploading-mods': 'Uploading mods...',
  'uploading-plugins': 'Uploading plugins...',
  done: 'Done!',
};

function getValidFile(formData: FormData, key: string): File | null {
  const entry = formData.get(key);
  if (entry instanceof File && entry.size > 0 && entry.name !== '') {
    return entry;
  }
  return null;
}

export default function AddModlistForm() {
  const router = useRouter();

  const [isPublic, setIsPublic] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<ErrorResponse | null>(null);

  const isPending = step !== 'idle' && step !== 'done';

  async function handleSubmit(formData: FormData) {
    setError(null);
    setStep('creating');

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const modlistFile = getValidFile(formData, 'modlistFile');
    const loadOrderFile = getValidFile(formData, 'loadOrderFile');

    try {
      const modlist = await addModlist({ name, description, isPublic });

      if (modlistFile) {
        setStep('uploading-mods');
        await addModsByFile(modlist.id, modlistFile);
      }

      if (loadOrderFile) {
        setStep('uploading-plugins');
        await addPluginsByFile(modlist.id, loadOrderFile);
      }

      setStep('done');
      router.push(`/modlists/${modlist.id}`);
    } catch (caughtError) {
      setError(caughtError as ErrorResponse);
      setStep('idle');
    }
  }

  return (
    <form
      action={handleSubmit}
      className="forge-panel flex w-full flex-col gap-y-6 rounded-xs p-8 sm:p-10"
    >
      <div className="space-y-2 border-b border-(--line) pb-6">
        <p className="forge-kicker">New Entry</p>
        <h2 className="forge-title text-3xl font-semibold">Create Modlist</h2>
        <p className="text-sm text-(--muted)">
          Give your modlist a name, then optionally upload your MO2 export files
          to populate it immediately.
        </p>
      </div>

      <fieldset className="space-y-4" disabled={isPending}>
        <FormInput
          label="name"
          labelValue="Name"
          type="text"
          required={true}
          max={255}
        />

        <div className="flex flex-col gap-y-2">
          <label htmlFor="description" className="text-sm">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={5000}
            rows={4}
            placeholder="Describe your load order, goals, or any notes for viewers…"
            className="resize-none rounded-xs border border-(--line) bg-gray-800 p-2 text-sm leading-6 transition outline-none focus:border-gray-500 focus:bg-gray-700"
          />
        </div>

        <div className="flex items-center justify-between rounded-xs border border-(--line) bg-gray-800/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Visibility</p>
            <p className="text-xs text-(--muted)">
              {isPublic
                ? 'Anyone can view this modlist.'
                : 'Only you can view this modlist.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            onClick={() => setIsPublic((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              isPublic ? 'bg-(--accent)' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isPublic ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </fieldset>

      <fieldset className="space-y-4" disabled={isPending}>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            MO2 Files{' '}
            <span className="forge-kicker text-[0.6rem]">Optional</span>
          </p>
          <p className="text-xs text-(--muted)">
            Found in your Mod Organizer 2 profile folder. Both files must be
            named exactly as shown below.
          </p>
        </div>

        <FileDropZone
          id="modlistFile"
          label="modlist.txt"
          accept=".txt"
          hint="Populates the mods table"
          disabled={isPending}
        />

        <FileDropZone
          id="loadOrderFile"
          label="loadorder.txt"
          accept=".txt"
          hint="Populates the plugins table"
          disabled={isPending}
        />
      </fieldset>

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-(--accent-strong)">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-(--accent) border-t-transparent" />
          {STEP_LABELS[step]}
        </div>
      )}

      {error && (
        <div className="rounded-xs border border-[rgba(216,139,125,0.25)] bg-[rgba(216,139,125,0.07)] px-4 py-3 text-sm text-(--danger)">
          {error.validationErrors ? (
            <ul className="space-y-1">
              {Object.entries(error.validationErrors).map(([field, msg]) => (
                <li key={field}>
                  <span className="font-semibold capitalize">{field}:</span>{' '}
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            error.message
          )}
        </div>
      )}

      <FormButton buttonValue={STEP_LABELS[step]} disabled={isPending} />
    </form>
  );
}

interface FileDropZoneProps {
  id: string;
  label: string;
  accept: string;
  hint: string;
  disabled?: boolean;
}

function FileDropZone({
  id,
  label,
  accept,
  hint,
  disabled,
}: FileDropZoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.files?.[0]?.name ?? null);
  }

  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xs border border-dashed border-(--line) px-4 py-3 transition hover:border-[rgba(184,154,104,0.4)] hover:bg-[rgba(184,154,104,0.04)] ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-semibold text-(--accent-strong)">
          {label}
        </p>
        <p className="mt-0.5 text-xs text-(--muted)">{hint}</p>
        {fileName && (
          <p className="text-foreground mt-1 truncate text-xs">✓ {fileName}</p>
        )}
      </div>
      <span className="shrink-0 rounded-xs border border-(--line) bg-gray-800 px-3 py-1.5 text-xs text-(--muted) transition group-hover:border-[rgba(184,154,104,0.3)] group-hover:text-(--accent-strong)">
        {fileName ? 'Change' : 'Choose file'}
      </span>
      <input
        id={id}
        name={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}
