'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Bell, User, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { Reminder, ReminderType, ReminderPriority, RelatedEntityType, RepeatRule } from '@/lib/types/reminder';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Reminder | null;
  defaultRelatedEntity?: { type: RelatedEntityType; id: string; name: string };
}

export function CreateReminderModal({
  isOpen,
  onClose,
  initialData,
  defaultRelatedEntity
}: CreateReminderModalProps) {
  const { leads, students, applications, addReminder, updateReminder } = useCRM();

  const [title, setTitle] = useState('');
  const [relatedType, setRelatedType] = useState<RelatedEntityType>('Lead');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [type, setType] = useState<ReminderType>('Follow-up');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('10:00 AM');
  const [priority, setPriority] = useState<ReminderPriority>('Medium');
  const [description, setDescription] = useState('');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>('Does not repeat');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setRelatedType(initialData.relatedEntityType || 'Lead');
        setSelectedEntityId(initialData.relatedEntityId || '');
        setSelectedEntityName(initialData.relatedEntityName || '');
        setType(initialData.type);
        setDueDate(initialData.dueDate);
        setDueTime(initialData.dueTime || '10:00 AM');
        setPriority(initialData.priority);
        setDescription(initialData.description || '');
        setRepeatRule(initialData.repeatRule || 'Does not repeat');
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        setTitle('');
        setRelatedType(defaultRelatedEntity?.type || 'Lead');
        setSelectedEntityId(defaultRelatedEntity?.id || '');
        setSelectedEntityName(defaultRelatedEntity?.name || '');
        setType('Follow-up');
        setDueDate(todayStr);
        setDueTime('10:00 AM');
        setPriority('Medium');
        setDescription('');
        setRepeatRule('Does not repeat');
      }
    }
  }, [isOpen, initialData, defaultRelatedEntity]);

  if (!isOpen) return null;

  // Options for entity selection based on relatedType
  let entityOptions: { id: string; name: string }[] = [];
  if (relatedType === 'Lead') {
    entityOptions = leads.map(l => ({ id: l.id, name: l.name }));
  } else if (relatedType === 'Student') {
    entityOptions = students.map(s => ({ id: s.id, name: s.name }));
  } else if (relatedType === 'Application') {
    entityOptions = applications.map(a => ({ id: a.id, name: `${a.name} (${a.program})` }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData) {
      updateReminder(initialData.id, {
        title,
        description,
        type,
        priority,
        dueDate,
        dueTime,
        relatedEntityType: relatedType,
        relatedEntityId: selectedEntityId,
        relatedEntityName: selectedEntityName,
        repeatRule,
      });
    } else {
      addReminder({
        title,
        description,
        type,
        priority,
        dueDate,
        dueTime,
        relatedEntityType: relatedType,
        relatedEntityId: selectedEntityId,
        relatedEntityName: selectedEntityName,
        repeatRule,
        assignedTo: 'Current User',
        createdBy: 'Current User',
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
            padding: '28px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Bell size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {initialData ? 'Edit Reminder' : 'Create Reminder'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0 }}>
                  Set a reminder to ensure timely follow-ups and calls
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Reminder Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Call Priya regarding admission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                  background: 'rgba(255, 255, 255, 0.7)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Related To Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Related To
                </label>
                <select
                  value={relatedType}
                  onChange={(e) => {
                    const newType = e.target.value as RelatedEntityType;
                    setRelatedType(newType);
                    setSelectedEntityId('');
                    setSelectedEntityName('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                    background: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Lead">Lead</option>
                  <option value="Student">Student</option>
                  <option value="Application">Application</option>
                  <option value="Payment">Payment</option>
                  <option value="Task">Task</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Select {relatedType}
                </label>
                {entityOptions.length > 0 ? (
                  <select
                    value={selectedEntityId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedEntityId(id);
                      const opt = entityOptions.find(o => o.id === id);
                      setSelectedEntityName(opt ? opt.name.split(' (')[0] : '');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                      background: 'rgba(255, 255, 255, 0.7)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Choose {relatedType} --</option>
                    {entityOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={`Name/ID of ${relatedType}...`}
                    value={selectedEntityName}
                    onChange={(e) => setSelectedEntityName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                      background: 'rgba(255, 255, 255, 0.7)',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Type & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Reminder Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReminderType)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                    background: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Call">📞 Call</option>
                  <option value="Follow-up">🔔 Follow-up</option>
                  <option value="Meeting">📅 Meeting</option>
                  <option value="Payment">💳 Payment</option>
                  <option value="Document">📄 Document</option>
                  <option value="Application">📝 Application</option>
                  <option value="Custom">✨ Custom</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                    background: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                    background: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Due Time
                </label>
                <select
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                    background: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Notes / Details
              </label>
              <textarea
                rows={3}
                placeholder="Add context, call discussion points, or special instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                  background: 'rgba(255, 255, 255, 0.7)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Repeat Rule */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Repeat
              </label>
              <select
                value={repeatRule}
                onChange={(e) => setRepeatRule(e.target.value as RepeatRule)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                  background: 'rgba(255, 255, 255, 0.7)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <option value="Does not repeat">Does not repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border, rgba(0,0,0,0.1))',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={16} /> {initialData ? 'Update Reminder' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
