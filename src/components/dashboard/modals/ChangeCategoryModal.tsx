import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, ThumbsUp } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

export function ChangeCategoryModal({ isOpen, onClose, lead, onSave }: any) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleAlreadyCustomer = () => {
    const updatedLead = { ...lead, status: 'Closed - Customer', category: 'Customer' };
    const changes = [`Category changed to Customer`, `Status changed to Closed - Customer`];
    onSave(updatedLead, changes);
  };

  const handleCloseWithReason = () => {
    if (!reason.trim()) {
      alert("Please enter a closing reason.");
      return;
    }
    const updatedLead = { ...lead, status: 'Closed - Lost', category: 'Closed', closedReason: reason };
    const changes = [`Category changed to Closed`, `Status changed to Closed - Lost`, `Closing reason: ${reason}`];
    onSave(updatedLead, changes);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }} 
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        style={{ 
          background: 'white', borderRadius: '16px', padding: '32px', width: '600px', 
          maxWidth: '90vw', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#475569', textAlign: 'center', marginBottom: '32px' }}>Change Category</h2>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
            >
              {/* Close With Reason Card */}
              <div 
                onClick={() => setStep(2)}
                style={{ 
                  border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', 
                  cursor: 'pointer', transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ background: '#f97316', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px' }}>
                  <CheckSquare size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '16px' }}>Close With Reason</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  Capture a reason so you can rechurn this lead later.
                </p>
              </div>

              {/* Already a Customer Card */}
              <div 
                onClick={handleAlreadyCustomer}
                style={{ 
                  border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', 
                  cursor: 'pointer', transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ background: '#4ade80', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px' }}>
                  <ThumbsUp size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '16px' }}>Already a Customer</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  Mark the lead as closed because it is already your customer.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Please provide a reason for closing:</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Budget constraints, went with competitor, etc."
                  rows={4}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontSize: '1rem', color: '#1e293b' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  onClick={() => setStep(1)}
                  style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '10px 24px', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Back
                </button>
                <button 
                  onClick={handleCloseWithReason}
                  style={{ background: '#4f46e5', border: 'none', padding: '10px 32px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
