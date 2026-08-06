'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login');
    } else if (isAuthenticated && isAuthPage) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  // If not authenticated and not on an auth page, render nothing while redirecting
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
    return null;
  }

  return <>{children}</>;
}
