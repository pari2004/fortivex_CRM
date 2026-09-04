'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DynamicBackground } from './DynamicBackground';
import { AiAssistantOrb } from './AiAssistantOrb';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { CRMProvider } from '@/contexts/CRMContext';
import { InboxProvider } from '@/contexts/InboxContext';
import styles from './layout.module.css';
import { AuthGuard } from './AuthGuard';
import { Breadcrumbs } from './Breadcrumbs';
import { SharedInbox } from '@/components/inbox/SharedInbox';

import { ReminderPopupManager } from '@/components/reminders/ReminderPopupManager';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <SettingsProvider>
      <AuthProvider>
        <CRMProvider>
          <InboxProvider>
            <div className={styles.appLayout}>
            <DynamicBackground />
            {!isAuthPage && <Suspense fallback={<div>Loading Sidebar...</div>}><Sidebar /></Suspense>}
            <div className={styles.mainContent}>
              {!isAuthPage && <Header />}
              <main className={styles.pageContainer} style={isAuthPage ? { padding: 0 } : {}}>
                {!isAuthPage && <Breadcrumbs />}
                <AuthGuard>{children}</AuthGuard>
              </main>
            </div>
            {!isAuthPage && <AiAssistantOrb />}
            {!isAuthPage && <ReminderPopupManager />}
            <SharedInbox />
            </div>
          </InboxProvider>
        </CRMProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
