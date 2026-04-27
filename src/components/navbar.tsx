'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  clearAuthenticatedEmail,
  getAuthEmailEventName,
  getAuthEmailStorageKey,
  getPersistedAuthenticatedEmail,
  logoutUser,
} from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const authEmailStorageKey = getAuthEmailStorageKey();
    const authEmailEventName = getAuthEmailEventName();

    function syncEmail() {
      setAuthEmail(getPersistedAuthenticatedEmail());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === authEmailStorageKey) {
        syncEmail();
      }
    }

    syncEmail();
    window.addEventListener('storage', handleStorage);
    window.addEventListener(authEmailEventName, syncEmail);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(authEmailEventName, syncEmail);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
    } finally {
      clearAuthenticatedEmail();
      setAuthEmail(null);
      setIsMenuOpen(false);
      setIsLoggingOut(false);
      router.push('/');
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-950/95">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="group min-w-0">
          <p className="forge-title truncate text-xl font-semibold text-stone-100 group-hover:text-amber-200">
            The Elder Forge
          </p>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link className="nav-link" href="/modlists/browse">
            Browse
          </Link>
          <Link className="nav-link" href="/modlists">
            Modlists
          </Link>

          {authEmail ? (
            <div className="relative" ref={menuRef}>
              <button
                className="nav-link flex max-w-52 items-center gap-2 text-left"
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <span className="truncate">{authEmail}</span>
                <span className="text-muted">{isMenuOpen ? '^' : 'v'}</span>
              </button>
              {isMenuOpen && (
                <div className="surface-panel absolute top-full right-0 mt-2 min-w-40 p-2">
                  <button
                    className="text-muted w-full rounded-xs px-3 py-2 text-left text-sm transition-colors hover:bg-stone-800 hover:text-amber-200 disabled:opacity-60"
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="nav-link" href="/auth/login">
                Login
              </Link>
              <Link
                className="btn-primary px-3 py-2 text-sm"
                href="/auth/register"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
