import { getModlistById } from '@/lib/modlists';
import ModlistTables from '@/components/modlist-tables';
import { getCookieHeader } from '@/lib/server-auth';
import PageContainer from '@/components/layout/page-container';
import EmptyState from '@/components/ui/empty-state';
import ButtonLink from '@/components/ui/button-link';
import { getCurrentSession } from '@/lib/auth';

export default async function ModlistDetail({
  params,
}: {
  params: Promise<{ modlistId: string }>;
}) {
  const { modlistId } = await params;
  const cookieHeader = await getCookieHeader();
  const [modlist, session] = await Promise.all([
    getModlistById(modlistId, cookieHeader || undefined),
    getCurrentSession(cookieHeader || undefined),
  ]);

  if (!modlist) {
    return (
      <PageContainer>
        <section className="surface-panel p-6">
          <EmptyState
            title="This modlist could not be opened."
            description="It may be private, removed, or unavailable from the backend right now."
            action={
              <ButtonLink href="/modlists/browse" variant="primary">
                Back to Browse
              </ButtonLink>
            }
          />
        </section>
      </PageContainer>
    );
  }

  return (
    <ModlistTables
      modlist={modlist}
      isOwner={session?.email === modlist.user.email}
    />
  );
}
