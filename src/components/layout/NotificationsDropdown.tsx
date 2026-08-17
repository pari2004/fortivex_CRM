'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, FileText, CheckSquare, MessageCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import styles from './layout.module.css';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

const NOTIFICATIONS = [
  { id: 1, title: 'New Application', desc: 'Sarah Jenkins applied for B.Tech CS', time: '5m ago', icon: <FileText size={16} />, color: '#10b981', unread: true },
  { id: 2, title: 'Task Reminder', desc: 'Follow up call with Michael scheduled in 30 mins', time: '1h ago', icon: <CheckSquare size={16} />, color: '#f59e0b', unread: true },
  { id: 3, title: 'Message Received', desc: 'New WhatsApp message from Lead #1024', time: '2h ago', icon: <MessageCircle size={16} />, color: '#2563eb', unread: false },
  { id: 4, title: 'Payment Overdue', desc: 'David Chen missed the semester fee deadline', time: '1d ago', icon: <AlertTriangle size={16} />, color: '#ef4444', unread: false },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useGlobalEscape(!!isOpen, () => { setIsOpen(false) });
  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-tertiary)' }} 
        whileTap={{ scale: 0.9 }} 
        className={styles.iconButton}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--status-rejected)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></div>
        )}
      </motion.button>

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
              width: '320px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 100
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</div>
              {unreadCount > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px' }}>
                  {unreadCount} New
                </span>
              )}
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {NOTIFICATIONS.map((notif) => (
                <div 
                  key={notif.id} 
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid var(--border-color)', 
                    display: 'flex', 
                    gap: '12px',
                    backgroundColor: notif.unread ? 'var(--bg-secondary)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = notif.unread ? 'var(--bg-secondary)' : 'transparent'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: `${notif.color}15`, color: notif.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {notif.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{notif.time}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {notif.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
              <Link href="/activity" style={{ display: 'inline-block', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
                View All Activity
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
