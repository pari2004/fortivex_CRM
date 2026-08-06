'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DynamicBackground } from './DynamicBackground';
import { AiAssistantOrb } from './AiAssistantOrb';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { CRMProvider } from '@/contexts/CRMContext';
import styles from './layout.module.css';
import { AuthGuard } from './AuthGuard';
import { Breadcrumbs } from './Breadcrumbs';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <SettingsProvider>
      <AuthProvider>
        <CRMProvider>
          <div className={styles.appLayout}>
          <DynamicBackground />
          {!isAuthPage && <Sidebar />}
          <div className={styles.mainContent}>
            {!isAuthPage && <Header />}
            <main className={styles.pageContainer} style={isAuthPage ? { padding: 0 } : {}}>
              {!isAuthPage && <Breadcrumbs />}
              <AuthGuard>{children}</AuthGuard>
            </main>
          </div>
          {!isAuthPage && <AiAssistantOrb />}
          </div>
        </CRMProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
