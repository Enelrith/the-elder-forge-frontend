'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addModlist, addModsByFile, addPluginsByFile } from '@/lib/modlists';
import type { ErrorResponse } from '@/types/api';
import FormButton from './ui/form-button';
import FormInput from './ui/form-input';
import ToggleSwitch from './ui/toggle-switch';

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
  done: 'Done',
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
      className="surface-panel flex w-full flex-col gap-6 p-5 sm:p-6"
    >
      <div className="space-y-2 border-b border-stone-700 pb-5">
        <p className="forge-kicker">New Entry</p>
        <h2 className="forge-title text-3xl font-semibold">Create Modlist</h2>
        <p className="text-muted text-sm leading-6">
          Give the archive a name, choose its visibility, and optionally upload
          your Mod Organizer 2 exports.
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

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={5000}
            rows={4}
            placeholder="Describe your load order, goals, or notes for viewers..."
            className="field-input min-h-28 resize-none leading-6"
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xs border border-stone-700 bg-stone-900 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Visibility</p>
            <p className="text-muted text-xs">
              {isPublic
                ? 'Anyone can view this modlist.'
                : 'Only you can view this modlist.'}
            </p>
          </div>
          <ToggleSwitch
            checked={isPublic}
            disabled={isPending}
            label="Toggle modlist visibility"
            onChange={() => setIsPublic((value) => !value)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4" disabled={isPending}>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            MO2 Files{' '}
            <span className="forge-kicker text-[0.6rem]">Optional</span>
          </p>
          <p className="text-muted text-xs">
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
        <div className="flex items-center gap-2 text-sm text-amber-200">
          <span className="inline-block h-3 w-3 animate-spin rounded-xs border-2 border-amber-400 border-t-transparent" />
          {STEP_LABELS[step]}
        </div>
      )}

      {error && (
        <div className="rounded-xs border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? null);
  }

  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xs border border-dashed border-stone-700 px-4 py-3 transition-colors hover:border-amber-600 hover:bg-stone-900 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-semibold text-amber-200">
          {label}
        </p>
        <p className="text-muted mt-0.5 text-xs">{hint}</p>
        {fileName && (
          <p className="mt-1 truncate text-xs text-stone-100">{fileName}</p>
        )}
      </div>
      <span className="text-muted shrink-0 rounded-xs border border-stone-700 bg-stone-950 px-3 py-1.5 text-xs transition-colors group-hover:border-amber-600 group-hover:text-amber-200">
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
