'use client';

import { Mod, Modlist } from '@/types/modlists';
import { formatDate } from '@/util/util';
import Link from 'next/link';
import { useState } from 'react';

function getNexusLink(mod: Mod) {
  return mod.nexusId
    ? 'https://www.nexusmods.com/skyrimspecialedition/mods/' + mod.nexusId
    : '#';
}

export default function ModlistTables({ modlist }: { modlist: Modlist }) {
  const [hoveredModId, setHoveredModId] = useState<string | null>(null);
  const [hoveredPluginModId, setHoveredPluginModId] = useState<string | null>(
    null
  );

  const activeMod = hoveredModId ?? hoveredPluginModId;

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
            {/* Mods table */}
            <section className="forge-panel min-w-0 rounded-xs p-3">
              <div className="mb-3 flex items-end justify-between border-b border-(--line) px-1 pb-2">
                <h2 className="forge-title mt-1 text-xl font-semibold">Mods</h2>
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
                          .sort((a, b) => a.priority - b.priority)
                          .map((mod) => {
                            const isHighlighted = activeMod === mod.id;
                            const nexusLink = getNexusLink(mod);
                            return (
                              <tr
                                key={mod.id}
                                onMouseEnter={() => setHoveredModId(mod.id)}
                                onMouseLeave={() => setHoveredModId(null)}
                                className={
                                  isHighlighted
                                    ? 'bg-[rgba(184,154,104,0.28)]!'
                                    : ''
                                }
                              >
                                <td>
                                  <Link
                                    href={nexusLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground block truncate font-semibold hover:cursor-pointer"
                                  >
                                    {mod.name}
                                  </Link>
                                </td>
                                <td className="truncate text-(--muted)">
                                  {mod.category
                                    ? mod.category.name
                                    : 'Unsorted'}
                                </td>
                                <td className="font-mono text-xs font-semibold tracking-[0.12em] text-(--accent-strong) uppercase">
                                  {mod.priority}
                                </td>
                                <td className="truncate text-(--muted)">
                                  {mod.notes || 'No notes'}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            <section className="forge-panel min-w-0 rounded-xs p-3">
              <div className="mb-3 flex items-end justify-between border-b border-(--line) px-1 pb-2">
                <h2 className="forge-title mt-1 text-xl font-semibold">
                  Plugins
                </h2>
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
                          .sort((a, b) => a.priority - b.priority)
                          .map((plugin) => {
                            const isHighlighted =
                              activeMod !== null &&
                              plugin.mod?.id === activeMod;
                            console.log(
                              `Plugin: ${plugin.name} | mod.id: ${plugin.mod?.id} | activeMod: ${activeMod} | match: ${isHighlighted}`
                            );
                            return (
                              <tr
                                key={plugin.id}
                                onMouseEnter={() =>
                                  setHoveredPluginModId(plugin.mod?.id ?? null)
                                }
                                onMouseLeave={() => setHoveredPluginModId(null)}
                                className={
                                  isHighlighted
                                    ? 'bg-[rgba(184,154,104,0.28)]!'
                                    : ''
                                }
                              >
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
                            );
                          })}
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
