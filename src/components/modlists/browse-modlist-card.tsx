import Link from 'next/link';
import StatusPill from '@/components/ui/status-pill';
import type { ModlistPagedInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';

export default function BrowseModlistCard({
  modlist,
}: {
  modlist: ModlistPagedInfo;
}) {
  return (
    <li>
      <Link
        href={`/modlists/${modlist.id}`}
        className="surface-card group flex h-full min-h-44 flex-col p-4"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <StatusPill>Shared</StatusPill>
          <p className="text-muted text-right text-xs">
            {formatDate(modlist.updatedAt)}
          </p>
        </div>

        <h3 className="forge-title line-clamp-2 text-2xl font-semibold text-stone-100 transition-colors group-hover:text-amber-200">
          {modlist.name}
        </h3>

        <div className="mt-auto border-t border-stone-700 pt-4">
          <p className="text-muted truncate text-xs tracking-wide uppercase">
            Made by {modlist.user.email}
          </p>
        </div>
      </Link>
    </li>
  );
}
