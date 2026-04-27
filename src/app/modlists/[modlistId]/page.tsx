import { getModlistById } from '@/lib/modlists';
import ModlistTables from '@/components/modlist-tables';
import { getCookieHeader } from '@/lib/server-auth';
import PageContainer from '@/components/layout/page-container';
import EmptyState from '@/components/ui/empty-state';
import ButtonLink from '@/components/ui/button-link';

async function getModlist(modlistId: string) {
  const cookieHeader = await getCookieHeader();
  return getModlistById(modlistId, cookieHeader || undefined);
}

export default async function ModlistDetail({
  params,
}: {
  params: Promise<{ modlistId: string }>;
}) {
  const { modlistId } = await params;
  const modlist = await getModlist(modlistId);

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

  return <ModlistTables modlist={modlist} />;
}
