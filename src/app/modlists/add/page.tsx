import Link from 'next/link';
import AddModlistForm from '@/components/add-modlist-form';

export default function AddModlist() {
  return (
    <section className="page-frame flex-1 py-10">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-2">
            <Link
              href="/modlists"
              className="forge-link forge-kicker inline-flex items-center gap-2"
            >
              ← Back to Vault
            </Link>
            <h1 className="forge-title text-4xl font-semibold">
              Forge a New Modlist
            </h1>
          </div>

          <AddModlistForm />
        </div>
      </div>
    </section>
  );
}
