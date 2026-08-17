import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
}

export function CustomDateRangeModal({ isOpen, onClose, onApply }: Props) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useGlobalEscape(!!isOpen, () => { onClose() });

  if (!isOpen) return null;

  const handleApply = () => {
    if (start && end) {
      onApply(start, end);
    }
  };

  const handleReset = () => {
    setStart('');
    setEnd('');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel"
        style={{ width: '400px', background: 'var(--bg-primary)', borderRadius: '16px', overflow: 'hidden', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-primary)' }}>
            <CalendarIcon size={20} color="var(--primary-color)" /> Custom Range
          </h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: 'var(--text-secondary)' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Start Date</label>
            <input 
              type="date" 
              className="glass-input" 
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>End Date</label>
            <input 
              type="date" 
              className="glass-input" 
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)' }}>
          <button onClick={handleReset} className="secondary-btn" style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>Reset</button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="secondary-btn" style={{ padding: '8px 16px' }}>Cancel</button>
            <button onClick={handleApply} className="primary-btn" style={{ padding: '8px 16px' }} disabled={!start || !end}>Apply</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
