'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './layout.module.css';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleAction = (path: string) => {
    setIsOpen(false);
    if (path === 'logout') {
      logout();
    } else {
      router.push(path);
    }
  };


  useGlobalEscape(!!isOpen, () => { setIsOpen(false) });
  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <motion.div 
        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(37,99,235,0.4)' }} 
        whileTap={{ scale: 0.9 }} 
        className={styles.profileAvatar} 
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), #1d4ed8)', 
          color: 'white', 
          border: '2px solid rgba(255,255,255,0.8)',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {(user as any)?.photo || user?.avatar ? <img src={(user as any)?.photo || user?.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(user?.name)}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '240px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 100
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.mobile || '9876543210'}</div>
              <div style={{ marginTop: '8px', display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                {user?.role || 'Role'}
              </div>
            </div>

            <div style={{ padding: '8px' }}>
              <button onClick={() => handleAction('/settings?tab=profile')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <User size={16} /> My Profile
              </button>
              <button onClick={() => handleAction('/settings')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Settings size={16} /> Settings
              </button>
              {user?.role === 'admin' && (
                <button onClick={() => handleAction('/roles')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <ShieldCheck size={16} /> Permissions
                </button>
              )}
            </div>

            <div style={{ padding: '8px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => handleAction('logout')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px', color: 'var(--status-rejected)', textAlign: 'left', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ef444415'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
