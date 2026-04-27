'use client';

// src/components/modlist-card.tsx
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { deleteModlist } from '@/lib/modlists';
import { ErrorResponse } from '@/types/api';
import { ModlistInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';

export default function ModlistCard({
  modlistInfo,
}: {
  modlistInfo: ModlistInfo;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${modlistInfo.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      await deleteModlist(modlistInfo.id);
      setIsDeleted(true);
      router.refresh();
    } catch (caughtError) {
      const errorResponse = caughtError as Partial<ErrorResponse>;
      setError(errorResponse.message ?? 'Failed to delete modlist.');
      setIsDeleting(false);
    }
  }

  if (isDeleted) {
    return null;
  }

  return (
    <li className="forge-panel flex h-full min-h-45 flex-col rounded-xs p-5 transition-all hover:-translate-y-1 hover:border-[rgba(247,198,126,0.28)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="text-xs text-(--muted) uppercase">
          {modlistInfo.isPublic ? 'Public' : 'Private'}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-xs border border-[rgba(216,139,125,0.35)] px-3 py-1.5 text-xs font-semibold text-(--danger) uppercase transition hover:border-[rgba(216,139,125,0.65)] hover:bg-[rgba(216,139,125,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <Link
        href={`/modlists/${modlistInfo.id}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        <h3 className="forge-title text-foreground line-clamp-2 text-2xl font-semibold">
          {modlistInfo.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-(--line) pt-4">
          <p className="text-[0.6rem] tracking-[0.18em] text-(--muted) uppercase">
            Created: {formatDate(modlistInfo.createdAt)}
          </p>
          <p className="text-[0.6rem] tracking-[0.18em] text-(--muted) uppercase">
            Updated: {formatDate(modlistInfo.updatedAt)}
          </p>
        </div>
      </Link>
      {error && (
        <p className="mt-3 text-xs leading-5 text-(--danger)" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}
