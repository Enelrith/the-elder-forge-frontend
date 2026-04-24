// src/components/modlist-card.tsx
import { ModlistInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';
import Link from 'next/link';

export default function ModlistCard({
  modlistInfo,
}: {
  modlistInfo: ModlistInfo;
}) {
  return (
    <li>
      <Link
        href={`/modlists/${modlistInfo.id}`}
        className="forge-panel flex h-full min-h-45 flex-col rounded-xs p-5 transition-all hover:-translate-y-1 hover:border-[rgba(247,198,126,0.28)]"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs text-(--muted) uppercase">
            {modlistInfo.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        <h3 className="forge-title text-foreground line-clamp-2 text-2xl font-semibold">
          {modlistInfo.name}
        </h3>
        <div className="mt-8 flex items-center justify-between border-t border-(--line) pt-4">
          <p className="text-xs tracking-[0.18em] text-(--muted) uppercase">
            {formatDate(modlistInfo.createdAt)}
          </p>
        </div>
      </Link>
    </li>
  );
}
