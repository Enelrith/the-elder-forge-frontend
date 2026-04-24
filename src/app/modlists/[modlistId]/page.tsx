import { cookies } from 'next/headers';
import Link from 'next/link';
import { getModlistById } from '@/lib/modlists';
import { formatDate } from '@/util/util';

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

  return (
    <section className="page-frame flex-1">
      <div className="page-shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Link
              href="/modlists"
              className="forge-link forge-kicker inline-flex items-center gap-2"
            >
              Back To Vault
            </Link>
            <h1 className="forge-title text-3xl font-semibold sm:text-4xl">
              {modlist.name}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-(--muted)">
              {modlist.description ||
                'No description has been written for this modlist yet.'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.24fr_1.76fr]">
          <aside className="space-y-4">
            <section className="forge-panel rounded-xs p-3 py-0.5">
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="forge-kicker text-[0.65rem]">Made by:</dt>
                  <dd className="text-foreground mt-1 text-sm">
                    {modlist.user.email}
                  </dd>
                </div>
                <div>
                  <dt className="forge-kicker text-[0.65rem]">
                    Creation Date:
                  </dt>
                  <dd className="text-foreground mt-1 pb-3 text-sm">
                    {formatDate(modlist.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="forge-kicker text-[0.65rem]">Visibility</dt>
                  <dd className="text-foreground mt-1 pb-3 text-sm">
                    {modlist.isPublic ? 'Public' : 'Private'}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>

          <div className="grid min-w-0 gap-3 lg:grid-cols-2">
            <section className="forge-panel min-w-0 rounded-xs p-3">
              <div className="mb-3 flex items-end justify-between border-b border-(--line) px-1 pb-2">
                <div>
                  <h2 className="forge-title mt-1 text-xl font-semibold">
                    Mods
                  </h2>
                </div>
                <p className="text-xs text-(--muted)">{modlist.mods.length}</p>
              </div>
              {modlist.mods.length === 0 ? (
                <p className="px-1 pb-1 text-xs leading-6 text-(--muted)">
                  No mods are listed for this modlist yet.
                </p>
              ) : (
                <div className="forge-table-shell">
                  <div className="forge-table-scroll">
                    <table className="forge-table">
                      <thead>
                        <tr>
                          <th className="w-[36%]">Mod Name</th>
                          <th className="w-[19%]">Category</th>
                          <th className="w-[15%]">Priority</th>
                          <th className="w-[34%]">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modlist.mods
                          .slice()
                          .sort((left, right) => left.priority - right.priority)
                          .map((mod) => (
                            <tr key={mod.id}>
                              <td>
                                <div className="text-foreground truncate font-semibold hover:cursor-pointer">
                                  {mod.name}
                                </div>
                              </td>
                              <td className="truncate text-(--muted)">
                                {mod.category ? mod.category.name : 'Unsorted'}
                              </td>
                              <td className="font-mono text-xs font-semibold tracking-[0.12em] text-(--accent-strong) uppercase">
                                {mod.priority}
                              </td>
                              <td className="truncate text-(--muted)">
                                {mod.notes || 'No notes'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <section className="forge-panel min-w-0 rounded-xs p-3">
              <div className="mb-3 flex items-end justify-between border-b border-(--line) px-1 pb-2">
                <div>
                  <h2 className="forge-title mt-1 text-xl font-semibold">
                    Plugins
                  </h2>
                </div>
                <p className="text-xs text-(--muted)">
                  {modlist.plugins.length}
                </p>
              </div>
              {modlist.plugins.length === 0 ? (
                <p className="px-1 pb-1 text-xs leading-6 text-(--muted)">
                  No plugins have been recorded for this modlist yet.
                </p>
              ) : (
                <div className="forge-table-shell">
                  <div className="forge-table-scroll">
                    <table className="forge-table">
                      <thead>
                        <tr>
                          <th className="w-[42%]">Plugin</th>
                          <th className="w-[29%]">Mod</th>
                          <th className="w-[12%]">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modlist.plugins
                          .slice()
                          .sort((left, right) => left.priority - right.priority)
                          .map((plugin) => (
                            <tr key={plugin.id}>
                              <td>
                                <div className="text-foreground truncate font-semibold">
                                  {plugin.name}
                                </div>
                              </td>
                              <td className="truncate text-(--muted)">
                                {plugin.mod ? plugin.mod.name : 'No Mod'}
                              </td>
                              <td className="font-mono text-xs font-semibold tracking-[0.12em] text-(--accent-strong) uppercase">
                                {plugin.priority}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
