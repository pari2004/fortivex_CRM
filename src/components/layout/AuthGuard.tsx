'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if not authenticated AND not already on the login or signup page
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render anything if we're redirecting to login
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
    return null;
  }

  return <>{children}</>;
}
