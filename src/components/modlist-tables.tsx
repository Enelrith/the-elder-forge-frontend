'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Mod, Modlist, Plugin } from '@/types/modlists';
import { formatDate } from '@/util/util';

function getModLinkKeys(mod: Pick<Mod, 'id' | 'name'> | null | undefined) {
  if (!mod) {
    return [];
  }

  return [mod.id, `name:${mod.name.toLowerCase()}`].filter(Boolean);
}

function isActiveMod(
  mod: Pick<Mod, 'id' | 'name'> | null | undefined,
  activeKeys: string[] | null
) {
  if (!activeKeys) {
    return false;
  }

  return getModLinkKeys(mod).some((key) => activeKeys.includes(key));
}

function getNexusLink(mod: Pick<Mod, 'nexusId'> | null | undefined) {
  if (!mod?.nexusId) {
    return null;
  }

  return `https://www.nexusmods.com/skyrimspecialedition/mods/${mod.nexusId}`;
}

function matchesName(name: string, search: string) {
  return name.toLowerCase().includes(search.trim().toLowerCase());
}

export default function ModlistTables({ modlist }: { modlist: Modlist }) {
  const [hoveredModKeys, setHoveredModKeys] = useState<string[] | null>(null);
  const [hoveredPluginModKeys, setHoveredPluginModKeys] = useState<
    string[] | null
  >(null);
  const [modSearch, setModSearch] = useState('');
  const [pluginSearch, setPluginSearch] = useState('');

  const activeModKeys = hoveredModKeys ?? hoveredPluginModKeys;
  const sortedMods = useMemo(
    () =>
      modlist.mods
        .filter((mod) => matchesName(mod.name, modSearch))
        .sort((a, b) => a.priority - b.priority),
    [modSearch, modlist.mods]
  );
  const sortedPlugins = useMemo(
    () =>
      modlist.plugins
        .filter((plugin) => matchesName(plugin.name, pluginSearch))
        .sort((a, b) => a.priority - b.priority),
    [pluginSearch, modlist.plugins]
  );

  return (
    <main className="page-frame flex-1 py-6 sm:py-8">
      <div className="page-shell space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-3">
            <Link
              href="/modlists"
              className="forge-kicker hover:text-amber-100"
            >
              Back to Modlists
            </Link>
            <h1 className="forge-title text-4xl font-semibold sm:text-5xl">
              {modlist.name}
            </h1>
            <p className="text-muted max-w-3xl text-sm leading-6">
              {modlist.description ||
                'No description has been written for this modlist yet.'}
            </p>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="surface-panel h-fit p-4">
            <dl className="space-y-4 text-sm">
              <DetailItem label="Made by" value={modlist.user.email} />
              <DetailItem
                label="Created"
                value={formatDate(modlist.createdAt)}
              />
              <DetailItem
                label="Visibility"
                value={modlist.isPublic ? 'Public' : 'Private'}
              />
            </dl>
          </aside>

          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <ModsTable
              mods={sortedMods}
              search={modSearch}
              activeModKeys={activeModKeys}
              onSearchChange={setModSearch}
              onHoverMod={setHoveredModKeys}
            />
            <PluginsTable
              plugins={sortedPlugins}
              search={pluginSearch}
              activeModKeys={activeModKeys}
              onSearchChange={setPluginSearch}
              onHoverPluginMod={setHoveredPluginModKeys}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="forge-kicker text-xs">{label}</dt>
      <dd className="mt-1 wrap-break-word text-stone-100">{value}</dd>
    </div>
  );
}

interface ModsTableProps {
  mods: Mod[];
  search: string;
  activeModKeys: string[] | null;
  onSearchChange: (value: string) => void;
  onHoverMod: (keys: string[] | null) => void;
}

function ModsTable({
  mods,
  search,
  activeModKeys,
  onSearchChange,
  onHoverMod,
}: ModsTableProps) {
  return (
    <section className="surface-panel min-w-0 p-3">
      <TableHeader
        id="mod-search"
        title="Mods"
        count={mods.length}
        search={search}
        placeholder="Search mods by name"
        onSearchChange={onSearchChange}
      />

      {mods.length === 0 ? (
        <TableEmpty
          message={
            search
              ? 'No mods match that search.'
              : 'No mods are listed for this modlist yet.'
          }
        />
      ) : (
        <div className="forge-table-shell">
          <div className="forge-table-scroll">
            <table className="forge-table">
              <thead>
                <tr>
                  <th className="w-[36%]">Mod Name</th>
                  <th className="w-[20%]">Category</th>
                  <th className="w-[14%]">Priority</th>
                  <th className="w-[30%]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mods.map((mod) => {
                  const modKeys = getModLinkKeys(mod);
                  const isHighlighted = isActiveMod(mod, activeModKeys);
                  const nexusLink = getNexusLink(mod);
                  return (
                    <tr
                      key={mod.id}
                      onMouseEnter={() => onHoverMod(modKeys)}
                      onMouseLeave={() => onHoverMod(null)}
                      className={isHighlighted ? 'is-linked-row' : ''}
                    >
                      <td>
                        {nexusLink ? (
                          <a
                            href={nexusLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate font-semibold text-stone-100 hover:text-amber-200"
                          >
                            {mod.name}
                          </a>
                        ) : (
                          <span className="block truncate font-semibold text-stone-100">
                            {mod.name}
                          </span>
                        )}
                      </td>
                      <td className="text-muted truncate">
                        {mod.category ? mod.category.name : 'Unsorted'}
                      </td>
                      <td className="font-mono text-xs font-semibold tracking-wide text-amber-200 uppercase">
                        {mod.priority}
                      </td>
                      <td className="text-muted truncate">
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
  );
}

interface PluginsTableProps {
  plugins: Plugin[];
  search: string;
  activeModKeys: string[] | null;
  onSearchChange: (value: string) => void;
  onHoverPluginMod: (keys: string[] | null) => void;
}

function PluginsTable({
  plugins,
  search,
  activeModKeys,
  onSearchChange,
  onHoverPluginMod,
}: PluginsTableProps) {
  return (
    <section className="surface-panel min-w-0 p-3">
      <TableHeader
        id="plugin-search"
        title="Plugins"
        count={plugins.length}
        search={search}
        placeholder="Search plugins by name"
        onSearchChange={onSearchChange}
      />

      {plugins.length === 0 ? (
        <TableEmpty
          message={
            search
              ? 'No plugins match that search.'
              : 'No plugins have been listed for this modlist yet.'
          }
        />
      ) : (
        <div className="forge-table-shell">
          <div className="forge-table-scroll">
            <table className="forge-table">
              <thead>
                <tr>
                  <th className="w-[44%]">Plugin</th>
                  <th className="w-[38%]">Mod</th>
                  <th className="w-[18%]">Priority</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map((plugin) => {
                  const pluginModKeys = getModLinkKeys(plugin.mod);
                  const isHighlighted = isActiveMod(plugin.mod, activeModKeys);
                  const nexusLink = getNexusLink(plugin.mod);
                  return (
                    <tr
                      key={plugin.id}
                      onMouseEnter={() =>
                        onHoverPluginMod(
                          pluginModKeys.length > 0 ? pluginModKeys : null
                        )
                      }
                      onMouseLeave={() => onHoverPluginMod(null)}
                      className={isHighlighted ? 'is-linked-row' : ''}
                    >
                      <td>
                        <div className="truncate font-semibold text-stone-100">
                          {plugin.name}
                        </div>
                      </td>
                      <td className="text-muted truncate">
                        {plugin.mod && nexusLink ? (
                          <a
                            href={nexusLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted truncate hover:text-amber-200"
                          >
                            {plugin.mod.name}
                          </a>
                        ) : plugin.mod ? (
                          plugin.mod.name
                        ) : (
                          'No Mod'
                        )}
                      </td>
                      <td className="font-mono text-xs font-semibold tracking-wide text-amber-200 uppercase">
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
  );
}

interface TableHeaderProps {
  id: string;
  title: string;
  count: number;
  search: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
}

function TableHeader({
  id,
  title,
  count,
  search,
  placeholder,
  onSearchChange,
}: TableHeaderProps) {
  return (
    <div className="mb-3 space-y-3 border-b border-stone-700 px-1 pb-3">
      <div className="flex items-end justify-between">
        <h2 className="forge-title text-xl font-semibold">{title}</h2>
        <p className="text-muted text-xs">{count}</p>
      </div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        className="field-input w-full"
      />
    </div>
  );
}

function TableEmpty({ message }: { message: string }) {
  return <p className="text-muted px-1 pb-1 text-xs leading-6">{message}</p>;
}
