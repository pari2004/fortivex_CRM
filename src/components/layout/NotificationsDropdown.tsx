'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckSquare, ExternalLink, CheckCircle2, AlertCircle, Info, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { SnoozeModal } from '@/components/reminders/SnoozeModal';
import { Reminder } from '@/lib/types/reminder';
import { CRMNotification, NotificationCategory } from '@/lib/types/notification';

const CATEGORIES: NotificationCategory[] = ['All', 'Unread', 'Leads', 'Tasks', 'Applications', 'Students', 'Engagements', 'Opportunities', 'Payments', 'Quotes', 'System'];

export function NotificationsDropdown() {
  const router = useRouter();
  const { reminders, notifications, markAsRead, markAllAsRead } = useCRM();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('All');
  const [snoozeModalReminder, setSnoozeModalReminder] = useState<Reminder | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Active reminders due today or overdue
  const dueReminders = reminders.filter(r => !r.isCompleted && r.status !== 'COMPLETED' && r.dueDate <= todayStr);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const totalUnread = dueReminders.length + unreadNotifications.length;

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

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !n.isRead;
    return n.type === activeCategory;
  });

  const getIconForSeverity = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle2 size={16} />;
      case 'error': return <AlertCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getColorForSeverity = (severity: string) => {
    switch (severity) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const handleNotificationClick = (notif: CRMNotification) => {
    markAsRead(notif.id);
    if (notif.destinationRoute) {
      setIsOpen(false);
      router.push(notif.destinationRoute);
    }
  };

  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-tertiary)' }} 
          whileTap={{ scale: 0.9 }} 
          className={styles.iconButton}
          onClick={() => setIsOpen(!isOpen)}
          style={{ position: 'relative' }}
        >
          <Bell size={20} />
          {totalUnread > 0 && (
            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--status-rejected, #ef4444)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></div>
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
                width: '380px',
                backgroundColor: 'var(--bg-primary, #ffffff)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.15))',
                border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                overflow: 'hidden',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '80vh'
              }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Notifications</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {totalUnread > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-color, #3b82f6)', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                      {totalUnread} unread
                    </span>
                  )}
                  <button onClick={markAllAsRead} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Mark all as read
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: activeCategory === cat ? 'var(--primary-color)' : 'var(--bg-secondary)',
                      color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                      transition: '0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* Due Reminders Section (Only show in All or Tasks category) */}
                {(activeCategory === 'All' || activeCategory === 'Tasks') && dueReminders.map((rem) => {
                  const isOverdue = rem.dueDate < todayStr;
                  return (
                    <div 
                      key={rem.id} 
                      style={{ 
                        padding: '14px 16px', 
                        borderBottom: '1px solid var(--border-color)', 
                        display: 'flex', 
                        gap: '12px',
                        backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isOverdue ? '#ef4444' : '#f59e0b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Bell size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            🔔 Reminder
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isOverdue ? '#ef4444' : '#f59e0b' }}>
                            {isOverdue ? 'Overdue' : rem.dueTime}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '8px' }}>
                          "{rem.title}" {rem.relatedEntityName ? `• ${rem.relatedEntityName}` : ''}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link 
                            href="/tasks/my-tasks"
                            onClick={() => setIsOpen(false)}
                            style={{
                              fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)',
                              padding: '3px 10px', borderRadius: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px'
                            }}
                          >
                            Open <ExternalLink size={10} />
                          </Link>
                          <button
                            onClick={() => setSnoozeModalReminder(rem)}
                            style={{
                              fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)',
                              padding: '3px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer'
                            }}
                          >
                            Snooze
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Notifications */}
                {filteredNotifications.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    <div style={{ marginBottom: '8px' }}><CheckSquare size={32} style={{ opacity: 0.5, margin: '0 auto' }} /></div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>No notifications</div>
                    <div style={{ fontSize: '0.85rem' }}>You're all caught up.</div>
                  </div>
                )}

                {filteredNotifications.map((notif) => {
                  const color = getColorForSeverity(notif.severity);
                  return (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif)}
                      style={{ 
                        padding: '14px 16px', 
                        borderBottom: '1px solid var(--border-color)', 
                        display: 'flex', 
                        gap: '12px',
                        backgroundColor: notif.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getIconForSeverity(notif.severity)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontWeight: notif.isRead ? 600 : 700, fontSize: '0.88rem', color: notif.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                            {notif.title}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.83rem', color: notif.isRead ? 'var(--text-tertiary)' : 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {notif.message}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', flexShrink: 0, marginTop: '6px' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <Link 
                  href="/tasks/my-tasks" 
                  style={{ display: 'inline-block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }} 
                  onClick={() => setIsOpen(false)}
                >
                  View Settings
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SnoozeModal
        isOpen={!!snoozeModalReminder}
        onClose={() => setSnoozeModalReminder(null)}
        reminder={snoozeModalReminder}
      />
    </>
  );
}
