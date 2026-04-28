'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { addMetaBuilderInfoToModlist } from '@/lib/modlists';
import type { ErrorResponse } from '@/types/api';
import type { Mod, Modlist, Plugin } from '@/types/modlists';
import { formatDate } from '@/util/util';

const META_BUILDER_DOWNLOAD_URL =
  'https://github.com/Enelrith/the-elder-forge-meta-builder/releases/latest/download/TheElderForge-MetaBuilder.exe';
const META_BUILDER_GITHUB_URL =
  'https://github.com/Enelrith/the-elder-forge-meta-builder';

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

export default function ModlistTables({
  modlist,
  isOwner = false,
}: {
  modlist: Modlist;
  isOwner?: boolean;
}) {
  const [hoveredModKeys, setHoveredModKeys] = useState<string[] | null>(null);
  const [hoveredPluginModKeys, setHoveredPluginModKeys] = useState<
    string[] | null
  >(null);
  const [isMetadataMenuOpen, setIsMetadataMenuOpen] = useState(false);
  const [isMetadataUploaded, setIsMetadataUploaded] = useState(false);
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
          {isOwner && (
            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center">
              {isMetadataUploaded && (
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 bg-emerald-950 text-xs"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  metadata uploaded
                </div>
              )}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsMetadataMenuOpen((open) => !open)}
              >
                Add Metadata
              </button>
              <Link
                href={`/modlists/${modlist.id}/edit`}
                className="btn-primary w-fit"
              >
                Edit Modlist
              </Link>
              {isMetadataMenuOpen && (
                <MetadataUploadMenu
                  modlistId={modlist.id}
                  onClose={() => setIsMetadataMenuOpen(false)}
                  onSuccess={() => setIsMetadataUploaded(true)}
                />
              )}
            </div>
          )}
        </header>

        <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="h-fit space-y-4">
            <section className="surface-panel p-4">
              <dl className="space-y-4 text-sm">
                <DetailItem
                  label="Made by"
                  value={modlist.user.username || modlist.user.email}
                />
                <DetailItem
                  label="Created"
                  value={formatDate(modlist.createdAt)}
                />
                <DetailItem
                  label="Visibility"
                  value={modlist.isPublic ? 'Public' : 'Private'}
                />
              </dl>
            </section>
            {isOwner && <MetaBuilderCard />}
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

function useOverflowTitle<T extends HTMLElement>(text: string) {
  const ref = useRef<T | null>(null);
  const [title, setTitle] = useState<string | undefined>();

  function updateTitle() {
    const element = ref.current;
    setTitle(
      element && element.scrollWidth > element.clientWidth ? text : undefined
    );
  }

  return {
    ref,
    title,
    onFocus: updateTitle,
    onMouseEnter: updateTitle,
  };
}

function TruncatedName({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  const overflowTitle = useOverflowTitle<HTMLSpanElement>(text);

  return (
    <span {...overflowTitle} className={className}>
      {text}
    </span>
  );
}

function TruncatedNameLink({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className: string;
}) {
  const overflowTitle = useOverflowTitle<HTMLAnchorElement>(text);

  return (
    <a
      {...overflowTitle}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {text}
    </a>
  );
}

function MetaBuilderCard() {
  return (
    <section className="surface-card p-4">
      <p className="forge-kicker text-xs">Meta Builder</p>
      <h2 className="forge-title mt-2 text-xl font-semibold">
        Add Nexus metadata
      </h2>
      <p className="text-muted mt-2 text-xs leading-5">
        Run the tool against your MO2 profile, then upload the generated{' '}
        <span className="font-mono text-amber-100">mod_data.txt</span> when
        creating or updating this modlist.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={META_BUILDER_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex w-full items-center justify-center px-3 py-2 text-xs"
        >
          Download Tool
        </Link>
        <Link
          href={META_BUILDER_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex w-full items-center justify-center px-3 py-2 text-xs"
        >
          GitHub
        </Link>
      </div>
    </section>
  );
}

function MetadataUploadMenu({
  modlistId,
  onClose,
  onSuccess,
}: {
  modlistId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError('Choose mod_data.txt before uploading metadata.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      await addMetaBuilderInfoToModlist(modlistId, file);
      onSuccess();
      onClose();
      router.refresh();
    } catch (caughtError) {
      const response = caughtError as Partial<ErrorResponse>;
      setError(response.message ?? 'Failed to upload metadata.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="surface-panel absolute top-full right-0 z-20 mt-3 w-[min(24rem,calc(100vw-2rem))] p-4 text-left shadow-2xl">
      <div className="space-y-3">
        <div>
          <p className="forge-kicker text-xs">Metadata Import</p>
          <h2 className="forge-title mt-1 text-xl font-semibold">
            Upload mod_data.txt
          </h2>
        </div>

        <p className="text-muted text-xs leading-5">
          This file is generated by the{' '}
          <a
            href={META_BUILDER_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-200 hover:text-amber-100"
          >
            meta builder
          </a>{' '}
          tool and is created in your MO2 mods folder.
        </p>

        <a
          href={META_BUILDER_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="forge-link inline-flex text-xs font-semibold text-amber-200"
        >
          Download tool
        </a>

        <label htmlFor="modDataFile" className="block space-y-2">
          <span className="text-sm font-medium">mod_data.txt</span>
          <input
            id="modDataFile"
            type="file"
            accept=".txt"
            disabled={isUploading}
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setError(null);
            }}
            className="field-input text-xs"
          />
        </label>

        {error && (
          <p className="text-xs leading-5 text-red-300" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="btn-ghost px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={handleUpload}
            className="btn-primary px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? 'Uploading...' : 'Upload Metadata'}
          </button>
        </div>
      </div>
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
                          <TruncatedNameLink
                            href={nexusLink}
                            text={mod.name}
                            className="block truncate font-semibold text-stone-100 hover:text-amber-200"
                          />
                        ) : (
                          <TruncatedName
                            text={mod.name}
                            className="block truncate font-semibold text-stone-100"
                          />
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
                        <TruncatedName
                          text={plugin.name}
                          className="block truncate font-semibold text-stone-100"
                        />
                      </td>
                      <td>
                        {plugin.mod && nexusLink ? (
                          <TruncatedNameLink
                            href={nexusLink}
                            text={plugin.mod.name}
                            className="text-muted block truncate hover:text-amber-200"
                          />
                        ) : plugin.mod ? (
                          <TruncatedName
                            text={plugin.mod.name}
                            className="text-muted block truncate"
                          />
                        ) : (
                          <span className="text-muted">No Mod</span>
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
