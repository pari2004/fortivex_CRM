'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { SourceData } from './SourceReportDetailsModal';

interface Props {
  source: SourceData;
  onClose: () => void;
  onSave: (source: SourceData) => void;
}

export function EditSourceModal({ source, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<SourceData>({ ...source });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'var(--bg-primary)', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Edit Source: {source.source}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Source Name</label>
            <input type="text" name="source" value={formData.source} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Campaign</label>
            <input type="text" name="campaign" value={formData.campaign || ''} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manager</label>
            <input type="text" name="manager" value={formData.manager} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Marketing Cost</label>
            <input type="number" name="marketingCost" value={formData.marketingCost} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '12px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '12px' }}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="secondary-btn" onClick={onClose} style={{ padding: '10px 24px' }}>Cancel</button>
          <button className="primary-btn" onClick={() => onSave(formData)} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
