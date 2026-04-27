'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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

    function handleAuthEmailChanged() {
      syncEmail();
    }

    syncEmail();
    window.addEventListener('storage', handleStorage);
    window.addEventListener(authEmailEventName, handleAuthEmailChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(authEmailEventName, handleAuthEmailChanged);
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
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
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
        {authEmail ? (
          <div className="relative" ref={menuRef}>
            <button
              className="forge-link forge-outline flex max-w-64 items-center gap-2 rounded-full px-4 py-2 text-left hover:cursor-pointer"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="truncate">{authEmail}</span>
              <span className="text-(--muted)">{isMenuOpen ? '^' : 'v'}</span>
            </button>
            {isMenuOpen && (
              <div className="forge-panel absolute top-full right-0 z-20 mt-2 min-w-44 rounded-xs p-2 shadow-2xl">
                <button
                  className="forge-link w-full rounded-xs px-3 py-2 text-left hover:cursor-pointer disabled:opacity-60"
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
            <Link
              className="forge-link rounded-full px-4 py-2"
              href="/auth/login"
            >
              Login
            </Link>
            <Link className="px-4 py-2" href="/auth/register">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
