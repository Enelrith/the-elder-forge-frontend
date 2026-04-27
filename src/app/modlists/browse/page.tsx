import PageContainer from '@/components/layout/page-container';
import PageHeading from '@/components/layout/page-heading';
import BrowseModlistCard from '@/components/modlists/browse-modlist-card';
import ModlistSearchForm from '@/components/modlists/modlist-search-form';
import Pagination from '@/components/modlists/pagination';
import EmptyState from '@/components/ui/empty-state';
import ButtonLink from '@/components/ui/button-link';
import { getAllModlists } from '@/lib/modlists';

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

export default async function Browse({ searchParams }: BrowseProps) {
  const params = await searchParams;
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const searchName = nameParam?.trim() ?? '';
  const pageNumber = getPageParam(params.page);
  const { content: modlists, page } = await getAllModlists(
    pageNumber,
    searchName || undefined
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeading
          eyebrow="Community"
          title="Browse Modlists"
          description="Find public Skyrim load orders, compare plugin structure, and inspect the work other players have shared."
        />

        <section className="surface-panel p-4 sm:p-5">
          <div className="space-y-4 border-b border-stone-700 pb-4">
            <ModlistSearchForm searchName={searchName} />

            <div className="text-muted flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p>
                {page.totalElements} modlist
                {page.totalElements !== 1 ? 's' : ''}
              </p>
              <p>
                Page {page.number + 1} of {Math.max(page.totalPages, 1)}
              </p>
            </div>
          </div>

          {modlists.length === 0 ? (
            <EmptyState
              title={
                searchName
                  ? 'No modlists match that search.'
                  : 'No public modlists have been shared yet.'
              }
              description={
                searchName
                  ? 'Try a shorter name or clear the search to browse everything.'
                  : 'Start the archive by publishing a load order from your vault.'
              }
              action={
                !searchName ? (
                  <ButtonLink href="/modlists/add" variant="primary">
                    Create a Modlist
                  </ButtonLink>
                ) : undefined
              }
            />
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {modlists.map((modlist) => (
                <BrowseModlistCard key={modlist.id} modlist={modlist} />
              ))}
            </ul>
          )}

          <Pagination page={page} searchName={searchName} />
        </section>
      </div>
    </PageContainer>
  );
}
