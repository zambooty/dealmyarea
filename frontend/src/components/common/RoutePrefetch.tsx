'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const routesToPrefetch = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/deals',
  '/list'
];

export function RoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes when component mounts
    routesToPrefetch.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
} 