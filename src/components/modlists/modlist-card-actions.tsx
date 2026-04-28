'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteModlist, updateModlistVisibility } from '@/lib/modlists';
import type { ErrorResponse } from '@/types/api';
import ToggleSwitch from '@/components/ui/toggle-switch';

interface ModlistCardActionsProps {
  id: string;
  name: string;
  initialIsPublic: boolean;
}

export default function ModlistCardActions({
  id,
  name,
  initialIsPublic,
}: ModlistCardActionsProps) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingVisibility, setIsSavingVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVisibilityToggle() {
    const nextVisibility = !isPublic;

    setError(null);
    setIsPublic(nextVisibility);
    setIsSavingVisibility(true);

    try {
      await updateModlistVisibility(id, nextVisibility);
      router.refresh();
    } catch (caughtError) {
      const errorResponse = caughtError as Partial<ErrorResponse>;
      setIsPublic(!nextVisibility);
      setError(errorResponse.message ?? 'Failed to update visibility.');
    } finally {
      setIsSavingVisibility(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteModlist(id);
      router.refresh();
    } catch (caughtError) {
      const errorResponse = caughtError as Partial<ErrorResponse>;
      setError(errorResponse.message ?? 'Failed to delete modlist.');
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={isPublic}
            disabled={isDeleting || isSavingVisibility}
            label={`Make ${name} ${isPublic ? 'private' : 'public'}`}
            onChange={handleVisibilityToggle}
          />
          <span className="text-muted text-xs font-semibold tracking-wide uppercase">
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/modlists/${id}/edit`}
            className={`btn-secondary px-3 py-1.5 text-xs ${
              isDeleting || isSavingVisibility
                ? 'pointer-events-none opacity-50'
                : ''
            }`}
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isSavingVisibility}
            className="btn-danger px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-xs leading-5 text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
