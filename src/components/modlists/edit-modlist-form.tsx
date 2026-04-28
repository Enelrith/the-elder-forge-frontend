'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  addModsByFile,
  addPluginsByFile,
  updateModlist,
} from '@/lib/modlists';
import type { ErrorResponse } from '@/types/api';
import type { Modlist } from '@/types/modlists';
import FormButton from '@/components/ui/form-button';
import ToggleSwitch from '@/components/ui/toggle-switch';

type Step = 'idle' | 'saving-info' | 'uploading-mods' | 'uploading-plugins';

const STEP_LABELS: Record<Step, string> = {
  idle: 'Save Changes',
  'saving-info': 'Saving details...',
  'uploading-mods': 'Uploading mods...',
  'uploading-plugins': 'Uploading plugins...',
};

function getValidFile(formData: FormData, key: string): File | null {
  const entry = formData.get(key);
  if (entry instanceof File && entry.size > 0 && entry.name !== '') {
    return entry;
  }
  return null;
}

export default function EditModlistForm({ modlist }: { modlist: Modlist }) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(modlist.isPublic);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<ErrorResponse | null>(null);

  const isPending = step !== 'idle';

  async function handleSubmit(formData: FormData) {
    setError(null);
    setStep('saving-info');

    const name = String(formData.get('name') ?? '');
    const description = String(formData.get('description') ?? '');
    const modlistFile = getValidFile(formData, 'modlistFile');
    const loadOrderFile = getValidFile(formData, 'loadOrderFile');

    try {
      await updateModlist(modlist.id, {
        name,
        description,
        isPublic,
      });

      if (modlistFile) {
        setStep('uploading-mods');
        await addModsByFile(modlist.id, modlistFile);
      }

      if (loadOrderFile) {
        setStep('uploading-plugins');
        await addPluginsByFile(modlist.id, loadOrderFile);
      }

      router.push(`/modlists/${modlist.id}`);
      router.refresh();
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
        <p className="forge-kicker">Edit Archive</p>
        <h2 className="forge-title text-3xl font-semibold">
          Update Modlist
        </h2>
        <p className="text-muted text-sm leading-6">
          Update the visible details and optionally replace the imported MO2
          files.
        </p>
      </div>

      <fieldset className="space-y-4" disabled={isPending}>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={255}
            defaultValue={modlist.name}
            className="field-input"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={5000}
            rows={4}
            defaultValue={modlist.description ?? ''}
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
            Replace MO2 Files{' '}
            <span className="forge-kicker text-[0.6rem]">Optional</span>
          </p>
          <p className="text-muted text-xs leading-5">
            Uploading a file replaces the existing imported rows for that file
            type. Files must be named exactly as shown.
          </p>
        </div>

        <div className="rounded-xs border border-amber-800 bg-amber-950/40 px-4 py-3 text-xs leading-5 text-amber-100">
          <p>
            Uploading only one file can make mods and plugins fall out of sync.
            For the most accurate links between plugins and their parent mods,
            upload both <span className="font-mono">modlist.txt</span> and{' '}
            <span className="font-mono">loadorder.txt</span> together.
          </p>
          <p className="mt-2">
            Replacing these files also removes imported metadata such as Nexus
            ids, categories, and mod/plugin links. Run the meta builder tool
            again and upload <span className="font-mono">mod_data.txt</span> to
            restore it.
          </p>
        </div>

        <FileInput
          id="modlistFile"
          label="modlist.txt"
          hint="Replaces the mods table"
          disabled={isPending}
        />
        <FileInput
          id="loadOrderFile"
          label="loadorder.txt"
          hint="Replaces the plugins table"
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

interface FileInputProps {
  id: string;
  label: string;
  hint: string;
  disabled?: boolean;
}

function FileInput({ id, label, hint, disabled }: FileInputProps) {
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
        accept=".txt"
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}
