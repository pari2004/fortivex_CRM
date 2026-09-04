import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export function SetupWarningModal({ isOpen, onClose, onProceed }: Props) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '400px',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'center', padding: '32px 24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ffedd5' }}>
            <AlertCircle size={32} color="#f97316" />
          </div>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Set up quotation defaults</h3>
        
        <p style={{ margin: '0 0 24px 0', fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>
          Before creating quotes, set your workspace defaults (numbering, template, taxes, currency).
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={onProceed} style={{ width: '100%', padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}>
            Proceed to set up
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer', fontSize: '0.95rem' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
