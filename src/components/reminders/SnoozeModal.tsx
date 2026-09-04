'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Reminder } from '@/lib/types/reminder';

interface SnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
}

export function SnoozeModal({ isOpen, onClose, reminder }: SnoozeModalProps) {
  const { snoozeReminder } = useCRM();
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('10:00 AM');
  const [showCustom, setShowCustom] = useState(false);

  if (!isOpen || !reminder) return null;

  const handleSnooze = (option: string) => {
    const now = new Date();
    let newDate = now.toISOString().split('T')[0];
    let newTime = '10:00 AM';

    if (option === '15m') {
      const future = new Date(now.getTime() + 15 * 60000);
      newDate = future.toISOString().split('T')[0];
      newTime = future.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (option === '30m') {
      const future = new Date(now.getTime() + 30 * 60000);
      newDate = future.toISOString().split('T')[0];
      newTime = future.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (option === '1h') {
      const future = new Date(now.getTime() + 60 * 60000);
      newDate = future.toISOString().split('T')[0];
      newTime = future.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (option === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      newDate = tomorrow.toISOString().split('T')[0];
      newTime = '09:00 AM';
    } else if (option === 'custom') {
      if (!customDate) return;
      newDate = customDate;
      newTime = customTime;
    }

    snoozeReminder(reminder.id, newDate, newTime);
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            width: '100%', maxWidth: '400px',
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
            padding: '24px'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Snooze Reminder</h3>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            "{reminder.title}"
          </p>

          {!showCustom ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleSnooze('15m')}
                style={{
                  padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.6)', cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>15 Minutes</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>+15m</span>
              </button>

              <button
                onClick={() => handleSnooze('30m')}
                style={{
                  padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.6)', cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>30 Minutes</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>+30m</span>
              </button>

              <button
                onClick={() => handleSnooze('1h')}
                style={{
                  padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.6)', cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>1 Hour</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>+1h</span>
              </button>

              <button
                onClick={() => handleSnooze('tomorrow')}
                style={{
                  padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.6)', cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>Tomorrow</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>9:00 AM</span>
              </button>

              <button
                onClick={() => setShowCustom(true)}
                style={{
                  padding: '12px 16px', borderRadius: '12px', border: '1px dashed var(--primary-color)',
                  background: 'rgba(59, 130, 246, 0.05)', color: 'var(--primary-color)', cursor: 'pointer',
                  textAlign: 'left', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>Custom Date & Time</span>
                <Calendar size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>New Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>New Time</label>
                <select
                  value={customTime}
                  onChange={e => setCustomTime(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)', outline: 'none' }}
                >
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={() => setShowCustom(false)}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => handleSnooze('custom')}
                  className="primary-btn"
                  style={{ padding: '8px 20px', borderRadius: '10px', fontWeight: 600 }}
                >
                  Save Snooze
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
