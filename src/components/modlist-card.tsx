import Link from 'next/link';
import ModlistCardActions from '@/components/modlists/modlist-card-actions';
import StatusPill from '@/components/ui/status-pill';
import type { ModlistInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';

export default function ModlistCard({
  modlistInfo,
}: {
  modlistInfo: ModlistInfo;
}) {
  return (
    <li className="surface-card flex h-full min-h-48 flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <StatusPill>{modlistInfo.isPublic ? 'Public' : 'Private'}</StatusPill>
        <p className="text-muted text-right text-xs">
          Updated {formatDate(modlistInfo.updatedAt)}
        </p>
      </div>

      <Link href={`/modlists/${modlistInfo.id}`} className="group mt-5 block">
        <h3 className="forge-title line-clamp-2 text-2xl font-semibold text-stone-100 transition-colors group-hover:text-amber-200">
          {modlistInfo.name}
        </h3>
        <p className="text-muted mt-3 text-xs tracking-wide uppercase">
          Created {formatDate(modlistInfo.createdAt)}
        </p>
      </Link>

      <div className="mt-auto border-t border-stone-700 pt-4">
        <ModlistCardActions
          id={modlistInfo.id}
          name={modlistInfo.name}
          initialIsPublic={modlistInfo.isPublic}
        />
      </div>
    </li>
  );
}
