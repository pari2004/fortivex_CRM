'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { QuickActions } from './QuickActions';
import styles from './layout.module.css';

export function Header() {
  const pathname = usePathname();
  
  // Define paths that have their own dedicated search component
  const hasOwnSearch = [
    '/leads',
    '/users',
    '/reports',
    '/documents',
    '/campaigns',
    '/automation',
    '/pipeline',
    '/follow-ups',
    '/member-leads',
    '/social',
    '/students',
    '/student-fees',
    '/activity',
    '/tasks',
    '/calls',
    '/attendance',
    '/admissions'
  ].some(path => pathname?.startsWith(path));

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      className={`${styles.header} glass-panel`}
      style={{ margin: '16px 16px 0 0', borderRadius: 'var(--radius-lg)', borderBottom: '1px solid var(--glass-border)' }}
    >
      <div style={{ flex: 1 }}>
        {!hasOwnSearch && <GlobalSearch />}
      </div>
      
      <div className={styles.headerRight} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <QuickActions />
        <NotificationsDropdown />
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
        <ProfileDropdown />
      </div>
    </motion.header>
  );
}

