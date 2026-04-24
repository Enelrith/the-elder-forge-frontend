'use client';

import { useEffect, useState } from 'react';
import { initializeAuth } from '@/lib/axios';
import { getAllModlistsByUserEmail } from '@/lib/modlists';
import { ModlistInfo } from '@/types/modlists';
import ModlistCard from '@/components/modlist-card';

export default function Modlists() {
  const [modlists, setModlists] = useState<ModlistInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModlists() {
      const token = await initializeAuth();

      if (!token) {
        setError('You must be logged in to view modlists.');
        return;
      }

      try {
        const fetchedModlists = await getAllModlistsByUserEmail();
        setModlists(fetchedModlists);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Failed to load modlists.'
        );
      }
    }

    void loadModlists();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ul className="mt-40 mr-auto ml-auto flex gap-10">
      {modlists.map((modlist) => (
        <ModlistCard modlistInfo={modlist} key={modlist.id} />
      ))}
    </ul>
  );
}
