import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, Flag, AlignLeft } from 'lucide-react';

import { useCRM } from '@/contexts/CRMContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  dashboardData?: any;
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  onSuccess?: (msg: string) => void;
}

export function AssignTaskModal({ isOpen, onClose, recordId, onSuccess }: Props) {
  const { addTask } = useCRM();
  const [employee, setEmployee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: description,
      description: `Task for record ${recordId}. Priority: ${priority}`,
      dueDate: dueDate,
      status: 'Pending',
      assignedTo: employee,
      priority: priority,
      type: 'Follow Up'
    });
    if (onSuccess) onSuccess(`Task successfully assigned to ${employee}`);
    onClose();
  };


  useGlobalEscape(!!isOpen, () => { onClose() });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel"
        style={{ width: '95%', maxWidth: '500px', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Assign Task</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Assign a task for record {recordId}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <User size={14} /> Assign To Employee
            </label>
            <select required value={employee} onChange={(e) => setEmployee(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px 14px' }}>
              <option value="">Select Employee...</option>
              <option value="John Doe">John Doe</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Jane Roe">Jane Roe</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Calendar size={14} /> Due Date
              </label>
              <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px 14px', colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Flag size={14} /> Priority
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px 14px' }}>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <AlignLeft size={14} /> Description
            </label>
            <textarea 
              required
              rows={4} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Task details and instructions..."
              className="glass-input" 
              style={{ width: '100%', padding: '12px 14px', resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Save Assignment</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
