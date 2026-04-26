// src/app/browse/page.tsx
import Link from 'next/link';
import { getAllModlists } from '@/lib/modlists';
import { ModlistPagedInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';

export default async function Browse() {
  let modlistsArr: ModlistPagedInfo[] = [];

  const { content: modlists, page: page } = await getAllModlists(0);
  modlistsArr = modlists;
  const pageDetails = page;

  return (
    <section className="page-frame flex-1 py-8">
      <div className="page-shell space-y-8">
        <header className="space-y-2">
          <p className="forge-kicker">Community</p>
          <h1 className="forge-title text-5xl font-semibold sm:text-6xl">
            Browse Modlists
          </h1>
          <p className="text-sm text-(--muted)">
            Explore load orders shared by the community.
          </p>
        </header>

        <section className="forge-panel rounded-xs p-5">
          <div className="flex justify-between border-b border-(--line) pb-3">
            <p className="text-sm text-(--muted)">
              {modlistsArr.length} modlist{modlistsArr.length !== 1 ? 's' : ''}
            </p>
            <p>
              {pageDetails.number + 1} / {pageDetails.totalPages}
            </p>
          </div>

          {modlistsArr.length === 0 ? (
            <div className="py-16 text-center">
              <p className="forge-title text-3xl font-semibold">
                No modlists have been shared yet.
              </p>
              <p className="mt-3 text-sm text-(--muted)">
                Be the first to
                <Link
                  href="/modlists/add"
                  className="forge-link text-(--accent-strong)"
                >
                  make one.
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {modlistsArr.map((modlist) => (
                <BrowseCard key={modlist.id} modlist={modlist} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

function BrowseCard({ modlist }: { modlist: ModlistPagedInfo }) {
  return (
    <li>
      <Link
        href={`/modlists/${modlist.id}`}
        className="forge-panel flex h-full min-h-45 flex-col rounded-xs p-5 transition-all hover:-translate-y-1 hover:border-[rgba(247,198,126,0.28)]"
      >
        <h3 className="forge-title text-foreground line-clamp-2 text-2xl font-semibold">
          {modlist.name}
        </h3>

        <div className="mt-auto border-t border-(--line) pt-4">
          <p className="text-xs tracking-[0.18em] text-(--muted) uppercase">
            Made by: {modlist.user.email}
          </p>
          <p className="mt-1 text-xs tracking-[0.18em] text-(--muted) uppercase">
            Last updated at: {formatDate(modlist.updatedAt)}
          </p>
        </div>
      </Link>
    </li>
  );
}
