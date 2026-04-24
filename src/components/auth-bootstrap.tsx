'use client';

import { useEffect } from 'react';
import { initializeAuth } from '@/lib/axios';

export default function AuthBootstrap() {
  useEffect(() => {
    void initializeAuth();
  }, []);

  return null;
}
