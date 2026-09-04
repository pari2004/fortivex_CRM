'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Check, X, ExternalLink, Volume2 } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Reminder } from '@/lib/types/reminder';
import Link from 'next/link';

function parseDueDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    if (!dateStr) return null;
    let hours = 9;
    let minutes = 0;
    if (timeStr) {
      const timeLower = timeStr.toLowerCase();
      const isPM = timeLower.includes('pm');
      const isAM = timeLower.includes('am');
      const cleanTime = timeStr.replace(/(am|pm)/i, '').trim();
      const parts = cleanTime.split(':');
      hours = parseInt(parts[0], 10) || 9;
      minutes = parseInt(parts[1], 10) || 0;
      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }
    const parts = dateStr.split('-').map(Number);
    if (parts.length < 3) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0);
  } catch (e) {
    return null;
  }
}

export function ReminderPopupManager() {
  const { reminders, toggleCompleteReminder, snoozeReminder } = useCRM();
  const [activeAlerts, setActiveAlerts] = useState<Reminder[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Request browser notification permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const checkDueReminders = () => {
      const now = new Date();
      const newlyDue: Reminder[] = [];

      reminders.forEach(reminder => {
        if (reminder.isCompleted || reminder.status === 'COMPLETED' || dismissedIds.has(reminder.id)) {
          return;
        }

        const dueDateTime = parseDueDateTime(reminder.dueDate, reminder.dueTime);
        if (dueDateTime) {
          // If current time is past or equal to due time
          const diffMs = now.getTime() - dueDateTime.getTime();
          // Alert if due now or due within the last 12 hours and not yet dismissed
          if (diffMs >= 0 && diffMs <= 12 * 60 * 60 * 1000) {
            newlyDue.push(reminder);
          }
        }
      });

      setActiveAlerts(prev => {
        const prevIds = new Set(prev.map(r => r.id));
        
        // Trigger desktop notifications for items newly added to alerts
        newlyDue.forEach(r => {
          if (!prevIds.has(r.id)) {
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`🔔 Reminder Due: ${r.title}`, {
                  body: `${r.relatedEntityName ? `Related to: ${r.relatedEntityName}\n` : ''}${r.description || 'Time to take action!'}`,
                  icon: '/images/fortivex-logo.png'
                });
              } catch (e) {}
            }
          }
        });

        // If newly due IDs match current active alert IDs, do not update state
        if (prev.length === newlyDue.length && prev.every((r, idx) => r.id === newlyDue[idx].id)) {
          return prev;
        }

        return newlyDue;
      });
    };

    checkDueReminders();
    const interval = setInterval(checkDueReminders, 5000); // Check every 5 seconds for exact timing
    return () => clearInterval(interval);
  }, [reminders, dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    setActiveAlerts(prev => prev.filter(r => r.id !== id));
  };

  const handleDone = (id: string) => {
    toggleCompleteReminder(id);
    handleDismiss(id);
  };

  const handleSnooze15 = (id: string) => {
    const future = new Date(Date.now() + 15 * 60000);
    const newDate = future.toISOString().split('T')[0];
    const newTime = future.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    snoozeReminder(id, newDate, newTime);
    handleDismiss(id);
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: 'calc(100vw - 48px)'
      }}
    >
      <AnimatePresence>
        {activeAlerts.slice(0, 3).map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1)',
              padding: '18px',
              overflow: 'hidden'
            }}
          >
            {/* Top Banner Alert Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <Bell size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  ⏰ REMINDER DUE NOW ({reminder.dueTime})
                </span>
              </div>

              <button
                onClick={() => handleDismiss(reminder.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Reminder Details */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {reminder.title}
              </h4>
              {reminder.relatedEntityName && (
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-color, #3b82f6)', marginTop: '2px' }}>
                  👤 {reminder.relatedEntityName} ({reminder.relatedEntityType})
                </div>
              )}
              {reminder.description && (
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                  {reminder.description}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handleDone(reminder.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Check size={14} /> Done
              </button>

              <button
                onClick={() => handleSnooze15(reminder.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#d97706',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Clock size={13} /> Snooze 15m
              </button>

              <Link
                href="/tasks/my-tasks"
                onClick={() => handleDismiss(reminder.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(0, 0, 0, 0.04)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ExternalLink size={13} /> Open
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
