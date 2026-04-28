import PageContainer from '@/components/layout/page-container';
import ButtonLink from '@/components/ui/button-link';

const META_BUILDER_DOWNLOAD_URL =
  'https://github.com/Enelrith/the-elder-forge-meta-builder/releases/latest/download/TheElderForge-MetaBuilder.exe';
const META_BUILDER_GITHUB_URL =
  'https://github.com/Enelrith/the-elder-forge-meta-builder';

const features = [
  {
    title: 'Load Order Clarity',
    copy: 'Show mods and plugins in compact tables that are easy to scan, compare, and share.',
  },
  {
    title: 'Public or Private',
    copy: 'Keep a work-in-progress private, or publish a finished modlist for other players to inspect.',
  },
  {
    title: 'MO2 Friendly',
    copy: 'Start from the familiar modlist.txt and loadorder.txt exports from Mod Organizer 2.',
  },
];

const steps = [
  {
    title: 'Upload your files',
    copy: 'Create a modlist, then add the MO2 exports that populate the mods and plugins tables.',
  },
  {
    title: 'Add richer metadata',
    copy: 'Use the optional meta builder to add Nexus links and category information when needed.',
  },
  {
    title: 'Share the archive',
    copy: 'Open the visibility toggle when the list is ready for other Skyrim players to browse.',
  },
];

export default function Home() {
  return (
    <PageContainer>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="surface-panel p-5 sm:p-8">
          <div className="max-w-3xl space-y-5">
            <p className="forge-kicker">Skyrim Load Order Archive</p>
            <h1 className="forge-title text-4xl leading-tight font-semibold text-stone-100 sm:text-6xl">
              The Elder Forge
            </h1>
            <p className="text-muted max-w-2xl text-base leading-7 sm:text-lg">
              A focused place to document, inspect, and share modlists without
              burying the important details behind screenshots or forum posts.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/modlists/browse" variant="primary">
                Browse Public Lists
              </ButtonLink>
              <ButtonLink href="/modlists" variant="secondary">
                Open Your Vault
              </ButtonLink>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="surface-card p-4">
                <h2 className="forge-title text-xl font-semibold">
                  {feature.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-6">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="surface-panel p-5">
            <p className="forge-kicker">How It Works</p>
            <div className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="border-l border-stone-700 pl-4"
                >
                  <p className="text-xs font-semibold tracking-wide text-amber-200 uppercase">
                    {index + 1}. {step.title}
                  </p>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-5">
            <p className="forge-kicker">Meta Builder</p>
            <h2 className="forge-title mt-3 text-2xl font-semibold">
              Optional Nexus metadata
            </h2>
            <p className="text-muted mt-3 text-sm leading-6">
              The companion tool can enrich exports with Nexus links and
              categories for players who want a more complete archive.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <ButtonLink
                href={META_BUILDER_DOWNLOAD_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Tool
              </ButtonLink>
              <ButtonLink
                href={META_BUILDER_GITHUB_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </ButtonLink>
            </div>
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}
