import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ChevronDown, Check, Search } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LogCallOutcomeDrawer({ isOpen, onClose, lead }: Props) {
  const { updateLead } = useCRM();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState('Outgoing 1 hour ago (Connected)');
  
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const callLogs = [
    'Outgoing 1 hour ago (Connected)',
    'Outgoing 24 hours ago (Connected)'
  ];

  const outcomes = [
    { label: 'Session Scheduled', color: '#10b981', bgColor: '#ecfdf5' },
    { label: 'Call Back Later', color: '#3b82f6', bgColor: '#eff6ff' },
    { label: 'Follow UP', color: '#3b82f6', bgColor: '#eff6ff' },
    { label: 'Not Interested', color: '#d97706', bgColor: '#fffbeb' }, 
    { label: 'Fee Too High', color: '#d97706', bgColor: '#fffbeb' }, 
    { label: 'Not Eligible', color: '#ef4444', bgColor: '#fef2f2' },
  ];

  const handleReset = () => {
    setSelectedOutcome('');
    setTagSearch('');
    setSelectedCall('Outgoing 1 hour ago (Connected)');
  };

  const handleSave = () => {
    if (!selectedOutcome) return;
    
    // Log the outcome as an activity
    const CURRENT_USER = 'Abhay';
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityTime: new Date().toISOString(),
      lifecycle: lead.status || 'Contacted',
      activityType: 'Call Outcome',
      category: 'Activity',
      description: `Logged call outcome: ${selectedOutcome} for ${selectedCall.split('(')[0].trim()}`,
      activityBy: CURRENT_USER
    };
    
    const updatedLead = {
      ...lead,
      activities: [newActivity, ...(lead.activities || [])]
    };
    
    updateLead(updatedLead);
    onClose();
    setTimeout(() => {
      handleReset();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 100004,
              backdropFilter: 'blur(2px)'
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-4px 0 15px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '500px',
              backgroundColor: '#f8fafc',
              zIndex: 100005,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 20px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  CALL OUTCOME
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {lead?.phone || '+918028567358'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    OUTGOING &bull; 1h ago &bull; 0h:2m:49s
                  </span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: '#dcfce7', 
                    color: '#166534', 
                    fontSize: '0.75rem', 
                    fontWeight: 600 
                  }}>
                    Connected
                  </span>
                </div>
              </div>

              {/* Dropdown Button */}
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid #8b5cf6', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Phone size={14} color="#64748b" />
                  <span style={{ flex: 1 }}>{selectedCall === 'Outgoing 1 hour ago (Connected)' ? 'OUTGOING • 1h ago • Connected' : 'OUTGOING • 24h ago • Connected'}</span>
                  <ChevronDown size={14} color="#64748b" />
                </div>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        width: '280px',
                        zIndex: 10,
                        overflow: 'hidden'
                      }}
                    >
                      {callLogs.map(log => (
                        <div 
                          key={log}
                          onClick={() => {
                            setSelectedCall(log);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: selectedCall === log ? '#f8fafc' : 'white',
                            color: '#0f172a'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCall === log ? '#f8fafc' : 'white'}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={14} color="#64748b" />
                            {log.replace('Outgoing 1 hour ago (Connected)', 'OUTGOING • 1h ago • Connected').replace('Outgoing 24 hours ago (Connected)', 'OUTGOING • 24h ago • Connected')}
                          </span>
                          {selectedCall === log && <Check size={14} color="#8b5cf6" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#94a3b8',
                  marginLeft: '16px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              
              {/* Lead Tags Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  LEAD TAGS
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search tags..." 
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '20px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '0.9rem',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              {/* Select Outcome Card */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' 
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0' }}>Select Outcome</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {outcomes.map((outcome, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedOutcome(outcome.label)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${selectedOutcome === outcome.label ? outcome.color : '#e2e8f0'}`,
                        backgroundColor: selectedOutcome === outcome.label ? outcome.bgColor : 'white',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: outcome.color }}></div>
                      {outcome.label}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ 
              padding: '16px 24px', 
              backgroundColor: 'white', 
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px'
            }}>
              <button 
                onClick={handleReset}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: 'white',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              
              <button 
                onClick={handleSave}
                disabled={!selectedOutcome}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedOutcome ? '#10b981' : '#e2e8f0',
                  color: selectedOutcome ? 'white' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: selectedOutcome ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Save outcome
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
