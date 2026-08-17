import React from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ActionModal({ title, text, onConfirm, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px', background: 'var(--bg-primary)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{text}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
          <button type="button" onClick={onConfirm} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
