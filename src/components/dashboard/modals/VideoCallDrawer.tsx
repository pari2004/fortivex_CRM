import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronDown, User as UserIcon } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function VideoCallDrawer({ isOpen, onClose, lead }: Props) {
  const { updateLead, systemUsers } = useCRM();

  const [title, setTitle] = useState('Connecting for Demo');
  const [meetingDateTime, setMeetingDateTime] = useState('');
  const [assignment, setAssignment] = useState<'Yourself' | 'Assign Later' | 'Employee'>('Yourself');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [notes, setNotes] = useState('');

  const CURRENT_USER = 'Abhay'; // Or from auth context

  const handleReset = () => {
    setTitle('Connecting for Demo');
    setMeetingDateTime('');
    setAssignment('Yourself');
    setSelectedEmployeeId('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!title || !meetingDateTime) return;
    if (assignment === 'Employee' && !selectedEmployeeId) return;

    let assigneeName = CURRENT_USER;
    if (assignment === 'Assign Later') {
      assigneeName = 'Unassigned';
    } else if (assignment === 'Employee') {
      const emp = systemUsers.find(u => u.id === selectedEmployeeId);
      assigneeName = emp ? emp.name : 'Unknown Employee';
    }

    const desc = `Scheduled for: ${new Date(meetingDateTime).toLocaleString()}\nAssigned to: ${assigneeName}${notes ? `\nNotes: ${notes}` : ''}`;

    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityTime: new Date().toISOString(),
      lifecycle: lead.status || 'Contacted',
      activityType: 'Video Call',
      category: 'Meeting',
      title: title,
      description: desc,
      activityBy: CURRENT_USER
    };

    const updatedLead = {
      ...lead,
      activities: [newActivity, ...(lead.activities || [])]
    };

    updateLead(updatedLead);
    handleReset();
    onClose();
  };

  const isValid = title.trim() !== '' && meetingDateTime !== '' && (assignment !== 'Employee' || selectedEmployeeId !== '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div key="video-call-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
          <motion.div 
            key="video-call-drawer"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ 
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', 
              background: '#f8fafc', zIndex: 100005, display: 'flex', flexDirection: 'column', 
              boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  Scheduling Video Call for Contact {lead?.phone || lead?.mobile || ''}
                </h3>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* Meeting Title */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Meeting Title <span style={{ color: '#ef4444' }}>*</span></h4>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Connecting for Demo"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                />
              </div>

              {/* Date & Time */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Date & Time <span style={{ color: '#ef4444' }}>*</span></h4>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="datetime-local" 
                    value={meetingDateTime}
                    onChange={e => setMeetingDateTime(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Assignment Dropdown */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Assignment <span style={{ color: '#ef4444' }}>*</span></h4>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select 
                    value={assignment}
                    onChange={e => {
                      setAssignment(e.target.value as any);
                      if (e.target.value !== 'Employee') {
                        setSelectedEmployeeId('');
                      }
                    }}
                    style={{ width: '100%', padding: '12px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: 'white', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="Yourself">Yourself</option>
                    <option value="Assign Later">Assign Later</option>
                    <option value="Employee">Employee</option>
                  </select>
                  <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {assignment === 'Employee' && (
                  <div style={{ marginTop: '16px', position: 'relative' }}>
                    <select 
                      value={selectedEmployeeId}
                      onChange={e => setSelectedEmployeeId(e.target.value)}
                      style={{ width: '100%', padding: '12px 38px 12px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: 'white', appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select Employee</option>
                      {systemUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                )}
              </div>

              {/* Detailed Note */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Detailed Note</h4>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add detailed note"
                  style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleReset} style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                Reset
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!isValid}
                style={{ padding: '10px 20px', background: isValid ? '#4f46e5' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
