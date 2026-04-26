import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="forge-outline flex items-center justify-between rounded-xs px-4 py-3">
      <Link href="/">
        <h2 className="font-semibold">The Elder Forge</h2>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          className="forge-link rounded-full px-4 py-2"
          href="/modlists/browse"
        >
          Browse
        </Link>
        <Link className="forge-link rounded-full px-4 py-2" href="/modlists">
          Modlists
        </Link>
        <Link className="forge-link rounded-full px-4 py-2" href="/auth/login">
          Login
        </Link>
        <Link className="px-4 py-2" href="/auth/register">
          Sign Up
        </Link>
      </nav>
    </header>
  );
}
