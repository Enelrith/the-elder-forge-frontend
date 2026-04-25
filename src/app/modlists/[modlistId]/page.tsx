import { cookies } from 'next/headers';
import Link from 'next/link';
import { getModlistById } from '@/lib/modlists';
import ModlistTables from '@/components/modlist-tables';

async function getModlist(modlistId: string) {
  const cookieHeader = (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  if (!cookieHeader) {
    return null;
  }

  return getModlistById(modlistId, cookieHeader);
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
      <section className="page-frame flex py-10">
        <div className="page-shell">
          <div className="forge-panel rounded-xs p-10 text-center">
            <p className="forge-kicker">Modlist Missing</p>
            <h1 className="forge-title mt-4 text-5xl font-semibold">
              That record could not be opened.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-(--muted)">
              The modlist may not belong to the current session, may not exist,
              or the backend may not have returned it yet.
            </p>
            <Link
              href="/modlists"
              className="mt-8 inline-flex rounded-xs bg-(--accent) px-5 py-3 font-semibold text-[#1b1410]"
            >
              Return to vault
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <ModlistTables modlist={modlist} />;
}
