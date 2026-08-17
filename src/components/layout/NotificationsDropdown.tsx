'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, FileText, CheckSquare, MessageCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import styles from './layout.module.css';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { SnoozeModal } from '@/components/reminders/SnoozeModal';
import { Reminder } from '@/lib/types/reminder';

const SYSTEM_NOTIFICATIONS = [
  { id: 'sys-1', title: 'New Application', desc: 'Sarah Jenkins applied for B.Tech CS', time: '5m ago', icon: <FileText size={16} />, color: '#10b981', unread: true },
  { id: 'sys-3', title: 'Message Received', desc: 'New WhatsApp message from Lead #1024', time: '2h ago', icon: <MessageCircle size={16} />, color: '#2563eb', unread: false },
];

export function NotificationsDropdown() {
  const { reminders } = useCRM();
  const [isOpen, setIsOpen] = useState(false);
  const [snoozeModalReminder, setSnoozeModalReminder] = useState<Reminder | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Active reminders due today or overdue
  const dueReminders = reminders.filter(r => !r.isCompleted && r.status !== 'COMPLETED' && r.dueDate <= todayStr);

  const totalUnread = dueReminders.length + SYSTEM_NOTIFICATIONS.filter(n => n.unread).length;

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
                width: '340px',
                backgroundColor: 'var(--bg-primary, #ffffff)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.15))',
                border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                overflow: 'hidden',
                zIndex: 100
              }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Notifications & Alerts</div>
                {totalUnread > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-color, #3b82f6)', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    {totalUnread} New
                  </span>
                )}
              </div>

              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {/* Due Reminders Section */}
                {dueReminders.map((rem) => {
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

                {/* System Notifications */}
                {SYSTEM_NOTIFICATIONS.map((notif) => (
                  <div 
                    key={notif.id} 
                    style={{ 
                      padding: '14px 16px', 
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', 
                      gap: '12px',
                      backgroundColor: notif.unread ? 'var(--bg-secondary, rgba(0,0,0,0.02))' : 'transparent'
                    }}
                  >
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: `${notif.color}15`, color: notif.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {notif.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{notif.title}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{notif.time}</span>
                      </div>
                      <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                        {notif.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                <Link 
                  href="/tasks/my-tasks" 
                  style={{ display: 'inline-block', color: 'var(--primary-color, #3b82f6)', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }} 
                  onClick={() => setIsOpen(false)}
                >
                  View All Reminders & Activity →
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
