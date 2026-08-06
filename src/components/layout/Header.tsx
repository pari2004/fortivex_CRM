'use client';

import { motion } from 'framer-motion';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { QuickActions } from './QuickActions';
import styles from './layout.module.css';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      className={`${styles.header} glass-panel`}
      style={{ margin: '16px 16px 0 0', borderRadius: 'var(--radius-lg)', borderBottom: '1px solid var(--glass-border)' }}
    >
      <GlobalSearch />
      
      <div className={styles.headerRight} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <QuickActions />
        <NotificationsDropdown />
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
        <ProfileDropdown />
      </div>
    </motion.header>
  );
}
