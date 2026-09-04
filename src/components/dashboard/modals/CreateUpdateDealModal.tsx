import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronDown, User as UserIcon } from 'lucide-react';
import { useCRM, Deal } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

const followUpOptions = [
  { label: 'In 2 Hours', value: '2hours' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'In 2 Days', value: '2days' },
  { label: 'Later This Week', value: 'later_week' },
  { label: 'Next Week', value: 'next_week' },
  { label: 'Choose Date Time', value: 'custom' },
];

export function CreateUpdateDealModal({ isOpen, onClose, lead }: Props) {
  const { deals, dealStages, systemUsers, addDeal, updateDeal } = useCRM();

  // Find active deal if any
  const existingDeal = useMemo(() => {
    return deals.find(d => 
      (lead?.id && d.leadId === lead.id) || 
      (lead?.name && (d.leadName === lead.name || d.leadOwner === lead.name))
    );
  }, [deals, lead]);

  const isUpdating = !!existingDeal;

  // Form State
  const [selectedStage, setSelectedStage] = useState('');
  const [followUpSelection, setFollowUpSelection] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [dealNote, setDealNote] = useState('');
  const [assignType, setAssignType] = useState('Yourself');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Initialize state based on existing deal or defaults
  useEffect(() => {
    if (isOpen) {
      if (existingDeal) {
        setSelectedStage(existingDeal.stage || dealStages[0] || '');
        setDealNote(existingDeal.lastRemark || '');
        // We can't perfectly reverse-map the followUpSelection from a raw ISO date string easily,
        // so we'll just set it to custom if there's a nextFollowUp date.
        if (existingDeal.nextFollowUp) {
          setFollowUpSelection('custom');
          const d = new Date(existingDeal.nextFollowUp);
          setCustomDate(d.toISOString().split('T')[0]);
          setCustomTime(d.toTimeString().slice(0, 5));
        } else {
          setFollowUpSelection('');
          setCustomDate('');
          setCustomTime('');
        }
        
        // Assignment logic (basic match)
        if (existingDeal.dealOwner === 'Abhay' || existingDeal.dealOwner === 'System') { // Fallback standard users
          setAssignType('Yourself');
        } else {
          const u = systemUsers.find(user => user.name === existingDeal.dealOwner);
          if (u) {
            setAssignType('Employee');
            setSelectedUserId(u.id);
          } else {
            setAssignType('Yourself');
          }
        }

      } else {
        // Reset to completely fresh
        handleReset(false); // pass false to avoid closing or alerting during init
      }
    }
  }, [isOpen, existingDeal, dealStages, systemUsers]);


  const calculateFollowUpDate = () => {
    const now = new Date();
    if (followUpSelection === '2hours') {
      now.setHours(now.getHours() + 2);
      return now.toISOString();
    }
    if (followUpSelection === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    }
    if (followUpSelection === '2days') {
      now.setDate(now.getDate() + 2);
      return now.toISOString();
    }
    if (followUpSelection === 'later_week') {
      // jump 3 days or to Friday, let's just do +3 days for simplicity
      now.setDate(now.getDate() + 3);
      return now.toISOString();
    }
    if (followUpSelection === 'next_week') {
      now.setDate(now.getDate() + 7);
      return now.toISOString();
    }
    if (followUpSelection === 'custom' && customDate && customTime) {
      return `${customDate}T${customTime}:00Z`;
    }
    return undefined;
  };

  const handleReset = (manual = true) => {
    setSelectedStage(dealStages[0] || '');
    setFollowUpSelection('');
    setCustomDate('');
    setCustomTime('');
    setDealNote('');
    setAssignType('Yourself');
    setSelectedUserId('');
    if (manual) {
       // if user clicked reset, maybe we shouldn't wipe everything if it's an update, but requirement says "Reset selected stage, Reset follow up, clear notes, reset assignment"
    }
  };

  const handleSubmit = () => {
    if (!selectedStage) {
      alert("Please select a deal stage.");
      return;
    }

    let finalAssignee = 'Abhay'; // default
    if (assignType === 'Employee' && selectedUserId) {
      const user = systemUsers.find(u => u.id === selectedUserId);
      if (user) finalAssignee = user.name;
    }

    const calculatedFollowUp = calculateFollowUpDate();

    if (isUpdating && existingDeal) {
      // UPDATE
      const updatedDeal: Deal = {
        ...existingDeal,
        stage: selectedStage,
        nextFollowUp: calculatedFollowUp,
        dealOwner: finalAssignee,
        lastRemark: dealNote || existingDeal.lastRemark,
        updatedAt: new Date().toISOString()
      };
      
      // If note provided, push to recentActions
      if (dealNote) {
        updatedDeal.recentActions = [
          { id: Math.random().toString(), action: 'Note Added: ' + dealNote, date: new Date().toISOString(), by: finalAssignee },
          ...(updatedDeal.recentActions || [])
        ];
      }

      updateDeal(updatedDeal);
    } else {
      // CREATE
      const newDeal: Omit<Deal, 'id'> = {
        leadId: lead?.id,
        leadName: lead?.name || 'Unknown',
        dealOwner: finalAssignee,
        program: lead?.program || 'Standard Deal',
        revenue: lead?.revenue || 0,
        stage: selectedStage,
        status: 'Open',
        closeDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 days default
        nextFollowUp: calculatedFollowUp,
        lastRemark: dealNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recentActions: dealNote ? [{ id: Math.random().toString(), action: 'Note Added: ' + dealNote, date: new Date().toISOString(), by: finalAssignee }] : []
      };
      
      addDeal(newDeal);
    }

    onClose();
  };


  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={onClose} 
      />

      {/* Side Panel */}
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '550px', height: '100%',
          background: 'white', display: 'flex', flexDirection: 'column', 
          boxShadow: '-10px 0 25px rgba(0,0,0,0.1)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
            {isUpdating ? 'Update Deal for' : 'Deal - new for'} <span style={{ color: '#4f46e5' }}>{lead?.mobile || lead?.phone || lead?.name || 'Contact'}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Modify the deal stage and follow-up */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Modify the deal stage and follow-up</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {dealStages.map(stage => {
                const isActive = selectedStage === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                      background: isActive ? '#eff6ff' : 'white',
                      color: isActive ? '#4f46e5' : '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    {stage}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Next Follow-up */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Next Follow-up</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {followUpOptions.map(opt => {
                const isActive = followUpSelection === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFollowUpSelection(opt.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #059669' : '1px solid #cbd5e1',
                      background: isActive ? '#ecfdf5' : 'white',
                      color: isActive ? '#059669' : '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {/* Custom Date Time Picker */}
            {followUpSelection === 'custom' && (
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                </div>
              </div>
            )}
          </div>

          {/* Deal Notes */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Deal Notes</h4>
            <textarea 
              value={dealNote} onChange={e => setDealNote(e.target.value)}
              placeholder="Add any note on this deal..."
              style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Assignment */}
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Assignment</h4>
            <div style={{ position: 'relative', marginBottom: assignType === 'Employee' ? '12px' : '0' }}>
              <UserIcon size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                value={assignType} onChange={(e) => setAssignType(e.target.value)}
                style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#334155' }}
              >
                <option value="Yourself">Yourself</option>
                <option value="Employee">Employee</option>
              </select>
              <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Employee Selection */}
            {assignType === 'Employee' && (
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ width: '100%', padding: '12px 32px 12px 12px', borderRadius: '8px', border: '1px solid #4f46e5', fontSize: '0.9rem', appearance: 'none', background: '#f8fafc', cursor: 'pointer', color: '#334155' }}
                >
                  <option value="" disabled>Select an employee...</option>
                  {systemUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Helper Text */}
          <div style={{ fontSize: '0.85rem', color: isUpdating ? '#059669' : '#ca8a04', textAlign: 'center', background: isUpdating ? '#ecfdf5' : '#fef9c3', padding: '8px', borderRadius: '6px', fontWeight: 500 }}>
            {isUpdating 
              ? 'An active deal was found — submitting will update the existing deal.' 
              : 'No active deal found — submitting will create a new deal.'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => handleReset(true)} style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
              Reset
            </button>
            <button onClick={handleSubmit} style={{ padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
              Submit
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
