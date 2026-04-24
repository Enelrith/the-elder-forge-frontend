import { cookies } from 'next/headers';
import ModlistCard from '@/components/modlist-card';
import { getAllModlistsByUserEmail } from '@/lib/modlists';

async function getModlists() {
  const cookieHeader = (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  if (!cookieHeader) {
    return [];
  }

  return getAllModlistsByUserEmail(cookieHeader);
}

export default async function Modlists() {
  const modlists = await getModlists();

  return (
    <section className="page-frame py-8">
      <div className="page-shell space-y-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <h2 className="forge-title text-5xl font-semibold sm:text-6xl">
              Your Modlists
            </h2>
          </div>
        </header>

        <section className="forge-panel rounded-xs p-5">
          <div className="border-b border-(--line) pb-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-(--muted)">
              Modlists: {modlists.length}
            </p>
          </div>

          {modlists.length === 0 ? (
            <div className="py-16 text-center">
              <p className="forge-title text-3xl font-semibold">
                No modlists in the vault yet.
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {modlists.map((modlist) => (
                <ModlistCard modlistInfo={modlist} key={modlist.id} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
