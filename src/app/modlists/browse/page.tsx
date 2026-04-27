import Link from 'next/link';
import { getAllModlists } from '@/lib/modlists';
import { ModlistPagedInfo } from '@/types/modlists';
import { formatDate } from '@/util/util';

interface BrowseProps {
  searchParams: Promise<{
    name?: string | string[];
    page?: string | string[];
  }>;
}

function getPageParam(pageParam?: string | string[]) {
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsedPage = Number.parseInt(pageValue ?? '0', 10);

  if (Number.isNaN(parsedPage) || parsedPage < 0) {
    return 0;
  }

  return parsedPage;
}

function getBrowseHref(pageNumber: number, searchName: string) {
  const params = new URLSearchParams({ page: pageNumber.toString() });

  if (searchName) {
    params.set('name', searchName);
  }

  return `/modlists/browse?${params.toString()}`;
}

export default async function Browse({ searchParams }: BrowseProps) {
  const params = await searchParams;
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const searchName = nameParam?.trim() ?? '';
  const pageNumber = getPageParam(params.page);
  let modlistsArr: ModlistPagedInfo[] = [];

  const { content: modlists, page: page } = await getAllModlists(
    pageNumber,
    searchName || undefined
  );
  modlistsArr = modlists;
  const pageDetails = page;
  const hasPreviousPage = pageDetails.number > 0;
  const hasNextPage = pageDetails.number + 1 < pageDetails.totalPages;
  const pageNumbers = Array.from(
    { length: pageDetails.totalPages },
    (_, index) => index
  );

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
          <div className="space-y-4 border-b border-(--line) pb-4">
            <form
              action="/modlists/browse"
              method="get"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="name" className="sr-only">
                Search modlists by name
              </label>
              <input type="hidden" name="page" value="0" />
              <input
                id="name"
                name="name"
                type="search"
                defaultValue={searchName}
                placeholder="Search by modlist name"
                className="min-w-0 flex-1 rounded-xs border border-(--line) bg-gray-800 px-3 py-2 text-sm transition outline-none focus:border-gray-500 focus:bg-gray-700"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xs bg-(--accent) px-4 py-2 text-sm font-semibold text-[#1b1410] transition hover:bg-(--accent-strong)"
                >
                  Search
                </button>
                {searchName && (
                  <Link
                    href="/modlists/browse"
                    className="rounded-xs border border-(--line) px-4 py-2 text-sm text-(--muted) transition hover:border-[rgba(184,154,104,0.4)] hover:text-(--accent-strong)"
                  >
                    Clear
                  </Link>
                )}
              </div>
            </form>

            <div className="flex justify-between">
              <p className="text-sm text-(--muted)">
                {modlistsArr.length} modlist
                {modlistsArr.length !== 1 ? 's' : ''}
              </p>
              <p>
                {pageDetails.number + 1} / {pageDetails.totalPages}
              </p>
            </div>
          </div>

          {modlistsArr.length === 0 ? (
            <div className="py-16 text-center">
              <p className="forge-title text-3xl font-semibold">
                {searchName
                  ? 'No modlists match that search.'
                  : 'No modlists have been shared yet.'}
              </p>
              {!searchName && (
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
              )}
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {modlistsArr.map((modlist) => (
                <BrowseCard key={modlist.id} modlist={modlist} />
              ))}
            </ul>
          )}

          {pageDetails.totalPages > 1 && (
            <nav
              aria-label="Browse modlist pages"
              className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-(--line) pt-5"
            >
              {hasPreviousPage ? (
                <Link
                  href={getBrowseHref(pageDetails.number - 1, searchName)}
                  className="rounded-xs border border-(--line) px-3 py-2 text-sm text-(--muted) transition hover:border-[rgba(184,154,104,0.4)] hover:text-(--accent-strong)"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-xs border border-(--line) px-3 py-2 text-sm text-(--muted) opacity-45">
                  Previous
                </span>
              )}

              {pageNumbers.map((number) =>
                number === pageDetails.number ? (
                  <span
                    key={number}
                    aria-current="page"
                    className="rounded-xs bg-(--accent) px-3 py-2 text-sm font-semibold text-[#1b1410]"
                  >
                    {number + 1}
                  </span>
                ) : (
                  <Link
                    key={number}
                    href={getBrowseHref(number, searchName)}
                    className="rounded-xs border border-(--line) px-3 py-2 text-sm text-(--muted) transition hover:border-[rgba(184,154,104,0.4)] hover:text-(--accent-strong)"
                  >
                    {number + 1}
                  </Link>
                )
              )}

              {hasNextPage ? (
                <Link
                  href={getBrowseHref(pageDetails.number + 1, searchName)}
                  className="rounded-xs border border-(--line) px-3 py-2 text-sm text-(--muted) transition hover:border-[rgba(184,154,104,0.4)] hover:text-(--accent-strong)"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-xs border border-(--line) px-3 py-2 text-sm text-(--muted) opacity-45">
                  Next
                </span>
              )}
            </nav>
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
