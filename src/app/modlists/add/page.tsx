import AddModlistForm from '@/components/add-modlist-form';
import PageContainer from '@/components/layout/page-container';
import PageHeading from '@/components/layout/page-heading';
import ButtonLink from '@/components/ui/button-link';
import { requireCookieHeader } from '@/lib/server-auth';

export default async function AddModlist() {
  await requireCookieHeader();

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeading
          eyebrow="New Archive"
          title="Forge a Modlist"
          description="Create the public or private record first, then attach the exported MO2 files that populate the tables."
          actions={
            <ButtonLink href="/modlists" variant="ghost">
              Back to Vault
            </ButtonLink>
          }
        />
        <AddModlistForm />
      </div>
    </PageContainer>
  );
}
