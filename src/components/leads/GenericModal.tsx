import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export function GenericModal({ title, children, onClose, onSave, saveText = 'Save', width = '500px' }: any) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ background: '#fff', borderRadius: '16px', width, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)' }}>
        
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--text-tertiary)' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px' }}>
          {children}
        </div>

        {onSave && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc', position: 'sticky', bottom: 0 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onSave} className="primary-btn" style={{ padding: '10px 20px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>{saveText}</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
