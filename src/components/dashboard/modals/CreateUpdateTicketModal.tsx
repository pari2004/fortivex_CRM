import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, User as UserIcon, Users, AlertCircle, FileText, Tag, LayoutGrid } from 'lucide-react';
import { useCRM, SupportTicket } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead?: any; // Optional, pre-fills the Contact field if opened from a Lead context
}

const STATUS_OPTIONS = ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];
const PRIORITY_OPTIONS = ['VERY HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY LOW'];

export function CreateUpdateTicketModal({ isOpen, onClose, lead }: Props) {
  const { systemUsers, leads, ticketCategories, ticketStages, addSupportTicket } = useCRM();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [status, setStatus] = useState('OPEN');
  const [priority, setPriority] = useState('MEDIUM');
  
  const [assigneeId, setAssigneeId] = useState('');
  const [contactId, setContactId] = useState('');
  
  const [categoryId, setCategoryId] = useState('');
  const [stageId, setStageId] = useState('');

  // Pre-fill contact if opened from lead context
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        setContactId(lead.id);
      }
      
      // Default to first category/stage if available and none selected
      if (!categoryId && ticketCategories.length > 0) {
        setCategoryId(ticketCategories[0].id);
      }
      if (!stageId && ticketStages.length > 0) {
        setStageId(ticketStages[0].id);
      }
    }
  }, [isOpen, lead, ticketCategories, ticketStages, categoryId, stageId]);

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setStatus('OPEN');
    setPriority('MEDIUM');
    setAssigneeId('');
    setContactId(lead ? lead.id : '');
    setCategoryId(ticketCategories.length > 0 ? ticketCategories[0].id : '');
    setStageId(ticketStages.length > 0 ? ticketStages[0].id : '');
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    
    // Fallbacks if lists are empty but we need a string
    const fallbackCategory = categoryId || 'general';
    const fallbackStage = stageId || 'new';

    const newTicket: SupportTicket = {
      id: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title,
      description,
      status,
      priority,
      contactId,
      categoryId: fallbackCategory,
      stageId: fallbackStage,
      assignedTo: assigneeId || 'Unassigned',
      createdBy: 'Current User', // In a real app, this would be the logged-in user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addSupportTicket(newTicket);
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={handleCancel} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '700px', maxHeight: '90vh',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Create Ticket</h3>
          <button onClick={handleCancel} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Title*</label>
            <div style={{ position: 'relative' }}>
              <FileText size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Title*" 
                style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b' }} 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of the issue..."
              style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', color: '#1e293b' }}
            />
          </div>

          {/* 2-Column: Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Status</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={status} onChange={e => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b', fontWeight: 500 }}
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Priority</label>
              <div style={{ position: 'relative' }}>
                <AlertCircle size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={priority} onChange={e => setPriority(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b', fontWeight: 500 }}
                >
                  {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* 2-Column: Assignee & Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Assignee</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={assigneeId} onChange={e => setAssigneeId(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b' }}
                >
                  <option value="" disabled>Search teammate</option>
                  {systemUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Contact</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={contactId} onChange={e => setContactId(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b' }}
                >
                  <option value="" disabled>Link contact</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name} {l.phone ? `(${l.phone})` : ''}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* 2-Column: Category & Stage */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Category</label>
              <div style={{ position: 'relative' }}>
                <LayoutGrid size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b' }}
                >
                  <option value="" disabled>Select category</option>
                  {ticketCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Stage</label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={stageId} onChange={e => setStageId(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#1e293b' }}
                >
                  <option value="" disabled>Select stage</option>
                  {ticketStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={handleCancel} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
            Create Ticket
          </button>
        </div>

      </motion.div>
    </div>
  );
}
