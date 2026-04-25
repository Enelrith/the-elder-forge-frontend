import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-frame flex-1 py-4">
      <div className="page-shell flex flex-col gap-2">
        <main className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="forge-panel overflow-hidden rounded-xs p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold">
                  Welcome to the Elder Forge!
                </h1>
                <p className="text-lg">
                  The Elder Forge is a place where you can put your modlists up
                  for display so others can see and appreciate your work.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/auth/register"
                  className="rounded-xs bg-gray-300 px-6 py-3 font-semibold text-gray-900"
                >
                  Create Your Account
                </Link>
                <Link
                  href="/modlists"
                  className="rounded-xs bg-gray-300 px-6 py-3 font-semibold text-gray-900"
                >
                  Browse Your Modlists
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    'Organized Mods and Plugins',
                    'Easily scroll through your installed mods and plugins.',
                  ],
                  [
                    'Advanced Features',
                    'Your installed mods can be directly linked to their nexus page. Their category can also be automatically displayed',
                  ],
                  [
                    'Notes',
                    'Want to leave a message for people that view your modlist? You can easily write a note for your modlist, or any mod separately.',
                  ],
                ].map(([title, copy]) => (
                  <article key={title} className="forge-outline rounded-xs p-4">
                    <h2 className="forge-title text-2xl font-semibold">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-(--muted)">
                      {copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="forge-panel rounded-xs p-6">
              <p className="forge-kicker">How it works</p>
              <div className="mt-5 space-y-5">
                {[
                  [
                    '1. Upload your files',
                    'You can very easily get the basic mods and plugins view by uploading your modlist.txt and loadorder.txt These can be found in your Mod Organizer 2 profile folder',
                  ],
                  [
                    '2. Download the meta builder tool (Optional)',
                    'If you want advanced features such as links to nexus or automatic category mapping, you can download this lightweight tool.',
                  ],
                  [
                    '3. Thats it!',
                    'Now you can go to your modlist tab and check out your newly created modlist!',
                  ],
                ].map(([step, copy]) => (
                  <div key={step} className="border-l border-(--line) pl-4">
                    <Link
                      href={
                        'https://github.com/Enelrith/the-elder-forge-meta-builder/releases/latest/download/TheElderForge-MetaBuilder.exe'
                      }
                      className="mt-2 text-sm leading-7 text-(--muted)"
                    >
                      <h2 className="font-semibold tracking-[0.08em] text-(--accent-strong) uppercase">
                        {step}
                      </h2>
                      {copy}
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="forge-outline rounded-xs p-6">
              <p className="forge-kicker">Purpose</p>
              <h2 className="forge-title mt-4 text-3xl font-semibold">
                Why use The Elder Forge?
              </h2>
              <p className="mt-4 text-sm leading-7 text-(--muted)">
                The purpose of The Elder Forge is to be a way for mod
                enthusiasts to easily share their modlists with others, while
                also offering tools such as modlist versioning and nexus links
                to the table.
              </p>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}
