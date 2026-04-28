import { redirect } from 'next/navigation';
import EditModlistForm from '@/components/modlists/edit-modlist-form';
import PageContainer from '@/components/layout/page-container';
import PageHeading from '@/components/layout/page-heading';
import ButtonLink from '@/components/ui/button-link';
import { getCurrentSession } from '@/lib/auth';
import { getModlistById } from '@/lib/modlists';
import { requireCookieHeader } from '@/lib/server-auth';

export default async function EditModlist({
  params,
}: {
  params: Promise<{ modlistId: string }>;
}) {
  const { modlistId } = await params;
  const cookieHeader = await requireCookieHeader();
  const [modlist, session] = await Promise.all([
    getModlistById(modlistId, cookieHeader),
    getCurrentSession(cookieHeader),
  ]);

  if (!modlist || !session || modlist.user.email !== session.email) {
    redirect(`/modlists/${modlistId}`);
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeading
          eyebrow="Manage Archive"
          title="Edit Modlist"
          description="Update the archive details or replace the imported Mod Organizer 2 files."
          actions={
            <ButtonLink href={`/modlists/${modlist.id}`} variant="ghost">
              Back to Modlist
            </ButtonLink>
          }
        />
        <EditModlistForm modlist={modlist} />
      </div>
    </PageContainer>
  );
}
