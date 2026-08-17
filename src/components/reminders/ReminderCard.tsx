'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, Edit2, Trash2, Phone, Calendar, 
  FileText, CreditCard, User, AlertCircle, MoreVertical,
  Bell, ChevronRight, Check
} from 'lucide-react';
import Link from 'next/link';
import { Reminder, ReminderType } from '@/lib/types/reminder';
import { useCRM } from '@/contexts/CRMContext';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onSnooze: (reminder: Reminder) => void;
}

export function ReminderCard({ reminder, onEdit, onSnooze }: ReminderCardProps) {
  const { toggleCompleteReminder, deleteReminder } = useCRM();
  const [showMenu, setShowMenu] = useState(false);

  // Helper for priority styling
  const getPriorityBadge = (priority: string) => {
    if (priority === 'High') {
      return (
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '20px',
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          letterSpacing: '0.02em'
        }}>
          🔴 HIGH
        </span>
      );
    }
    if (priority === 'Medium') {
      return (
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '20px',
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#f59e0b',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          letterSpacing: '0.02em'
        }}>
          🟡 MEDIUM
        </span>
      );
    }
    return (
      <span style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: '20px',
        background: 'rgba(59, 130, 246, 0.12)',
        color: '#3b82f6',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        letterSpacing: '0.02em'
      }}>
        🔵 LOW
      </span>
    );
  };

  // Helper for icon based on type
  const getTypeIcon = (type: ReminderType) => {
    switch (type) {
      case 'Call': return <Phone size={14} color="#3b82f6" />;
      case 'Meeting': return <Calendar size={14} color="#8b5cf6" />;
      case 'Payment': return <CreditCard size={14} color="#10b981" />;
      case 'Document': return <FileText size={14} color="#06b6d4" />;
      case 'Follow-up': return <Bell size={14} color="#f59e0b" />;
      default: return <Bell size={14} color="#6b7280" />;
    }
  };

  // Format due display
  const formatDueDisplay = (dueDateStr: string, dueTimeStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let dayText = dueDateStr;
    if (dueDateStr === todayStr) {
      dayText = 'Today';
    } else if (dueDateStr === yesterdayStr) {
      dayText = 'Yesterday';
    } else if (dueDateStr === tomorrowStr) {
      dayText = 'Tomorrow';
    } else {
      // Format e.g. 15 Aug
      try {
        const d = new Date(dueDateStr);
        dayText = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } catch (e) {
        dayText = dueDateStr;
      }
    }

    return `${dayText}, ${dueTimeStr || '10:00 AM'}`;
  };

  // Navigation route for entity
  const getEntityHref = (type?: string, name?: string) => {
    if (!type || !name) return '#';
    const query = encodeURIComponent(name);
    switch (type) {
      case 'Lead': return `/leads?search=${query}`;
      case 'Student': return `/students?search=${query}`;
      case 'Application': return `/applications?search=${query}`;
      case 'Payment': return `/payments?search=${query}`;
      default: return `/leads?search=${query}`;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      className="glass-panel"
      style={{
        padding: '20px',
        borderRadius: '18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: reminder.isCompleted 
          ? 'rgba(255, 255, 255, 0.4)' 
          : 'rgba(255, 255, 255, 0.75)',
        border: reminder.isCompleted
          ? '1px solid rgba(16, 185, 129, 0.2)'
          : '1px solid var(--glass-border, rgba(255,255,255,0.4))',
        opacity: reminder.isCompleted ? 0.85 : 1
      }}
    >
      {/* Top Header Row: Priority & Type Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getPriorityBadge(reminder.priority)}
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.04)',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            {getTypeIcon(reminder.type)} {reminder.type}
          </span>
        </div>

        {/* Action overflow button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                width: '140px',
                background: 'var(--bg-primary, #ffffff)',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid var(--glass-border)',
                zIndex: 50,
                overflow: 'hidden'
              }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => { setShowMenu(false); onEdit(reminder); }}
                style={{
                  width: '100%', padding: '10px 14px', border: 'none', background: 'transparent',
                  textAlign: 'left', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Edit2 size={14} color="#3b82f6" /> Edit
              </button>
              <button
                onClick={() => { setShowMenu(false); deleteReminder(reminder.id); }}
                style={{
                  width: '100%', padding: '10px 14px', border: 'none', background: 'transparent',
                  textAlign: 'left', fontSize: '0.85rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Details: Title & Description */}
      <div>
        <h4 style={{
          margin: 0,
          fontSize: '1.05rem',
          fontWeight: 700,
          color: reminder.isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)',
          textDecoration: reminder.isCompleted ? 'line-through' : 'none',
          lineHeight: 1.3
        }}>
          {reminder.title}
        </h4>
        {reminder.description && (
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            {reminder.description}
          </p>
        )}
      </div>

      {/* Info Row: Entity link & Due Time */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px dashed var(--glass-border, rgba(0,0,0,0.06))',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        {reminder.relatedEntityName && (
          <Link
            href={getEntityHref(reminder.relatedEntityType, reminder.relatedEntityName)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 600,
              color: 'var(--primary-color, #3b82f6)',
              textDecoration: 'none',
              background: 'rgba(59, 130, 246, 0.08)',
              padding: '4px 10px',
              borderRadius: '8px'
            }}
          >
            <User size={13} /> {reminder.relatedEntityName}
            <ChevronRight size={12} />
          </Link>
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
          <Clock size={13} color="var(--text-tertiary)" />
          <span>{formatDueDisplay(reminder.dueDate, reminder.dueTime)}</span>
        </div>
      </div>

      {/* Footer Quick Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginTop: '4px'
      }}>
        <button
          onClick={() => toggleCompleteReminder(reminder.id)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: reminder.isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--glass-border)',
            background: reminder.isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.8)',
            color: reminder.isCompleted ? '#10b981' : 'var(--text-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Check size={14} />
          {reminder.isCompleted ? 'Done' : 'Mark Done'}
        </button>

        {!reminder.isCompleted && (
          <button
            onClick={() => onSnooze(reminder)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.8)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Clock size={14} color="#f59e0b" /> Snooze
          </button>
        )}

        <button
          onClick={() => onEdit(reminder)}
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.8)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Edit2 size={14} color="#3b82f6" /> Edit
        </button>
      </div>
    </motion.div>
  );
}
