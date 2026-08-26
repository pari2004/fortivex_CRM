'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '@/contexts/CRMContext';

interface ScheduleVideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleVideoCallModal({ isOpen, onClose }: ScheduleVideoCallModalProps) {
  const { leads, systemUsers, addVideoCall } = useCRM();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [type, setType] = useState('Demo');
  const [platform, setPlatform] = useState('Google Meet');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [assignedUser, setAssignedUser] = useState('Pavan S H');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setLeadId('');
    setType('Demo');
    setPlatform('Google Meet');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setAssignedUser('Pavan S H');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert("Please fill all required fields.");
      return;
    }

    const lead = leads.find(l => l.id === leadId);

    addVideoCall({
      title,
      description,
      leadId,
      leadName: lead?.name || '',
      type,
      platform,
      scheduledBy: 'Pavan S H',
      assignedUser,
      startDate,
      startTime,
      endDate,
      endTime,
      status: 'Scheduled Later',
      notes,
      createdAt: new Date().toISOString()
    });
    
    handleReset();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, background: 'white', zIndex: 10, borderRadius: '16px 16px 0 0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} color="#4f46e5" /> Schedule Video Call
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Meeting Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Data Science Curriculum Discussion" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Select Contact (Optional)</label>
              <select value={leadId} onChange={e => setLeadId(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                <option value="">Select a contact...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.name} {lead.email ? `(${lead.email})` : ''}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Meeting Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief statement about the meeting..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Meeting Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                <option value="Demo">Demo</option>
                <option value="Counseling">Counseling</option>
                <option value="Interview">Interview</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Start Date *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Start Time *</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>End Date *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} required style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>End Time *</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Assign User / Owner</label>
              <select value={assignedUser} onChange={e => setAssignedUser(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                {systemUsers.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Connect for demo and explain the programme details..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }} />
            </div>

          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button type="button" onClick={handleReset} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Reset
            </button>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '10px 24px', background: '#4f46e5', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Submit / Schedule Video Call
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
