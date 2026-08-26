'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, Lightbulb } from 'lucide-react';
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
        <Link 
          href="/customize" 
          className={styles.iconButton}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5a6 6 0 0 0-12 0c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
            <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
            <line x1="2" y1="11" x2="4" y2="11"/>
            <line x1="20" y1="11" x2="22" y2="11"/>
          </svg>
        </Link>
        <QuickActions />
        <NotificationsDropdown />
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
        <ProfileDropdown />
      </div>
    </motion.header>
  );
}

