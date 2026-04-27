import PageContainer from '@/components/layout/page-container';
import PageHeading from '@/components/layout/page-heading';
import ModlistCard from '@/components/modlist-card';
import ButtonLink from '@/components/ui/button-link';
import EmptyState from '@/components/ui/empty-state';
import { getAllModlistsByUserEmail } from '@/lib/modlists';
import { requireCookieHeader } from '@/lib/server-auth';
import { ErrorResponse } from '@/types/api';
import { redirect } from 'next/navigation';

async function getModlists() {
  const cookieHeader = await requireCookieHeader();

  try {
    return await getAllModlistsByUserEmail(cookieHeader);
  } catch (caughtError) {
    const error = caughtError as Partial<ErrorResponse>;

    if (error.status === 401 || error.status === 403) {
      redirect('/auth/login');
    }

    throw caughtError;
  }
}

export default async function Modlists() {
  const modlists = await getModlists();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeading
          eyebrow="Your Vault"
          title="Modlists"
          description="Manage your personal load orders, update visibility, and open each archive for a closer inspection."
          actions={
            <ButtonLink href="/modlists/add" variant="primary">
              New Modlist
            </ButtonLink>
          }
        />

        <section className="surface-panel p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-stone-700 pb-3">
            <p className="text-muted text-sm">
              {modlists.length} modlist{modlists.length !== 1 ? 's' : ''}
            </p>
            <ButtonLink href="/modlists/browse" variant="ghost">
              Browse Public
            </ButtonLink>
          </div>

          {modlists.length === 0 ? (
            <EmptyState
              title="No modlists in your vault yet."
              description="Create your first archive, upload your MO2 files, and decide whether it stays private or goes public."
              action={
                <ButtonLink href="/modlists/add" variant="primary">
                  Create Your First Modlist
                </ButtonLink>
              }
            />
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {modlists.map((modlist) => (
                <ModlistCard modlistInfo={modlist} key={modlist.id} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
