'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SourceData } from './SourceReportDetailsModal';

interface AddSourceModalProps {
  onClose: () => void;
  onSave: (source: any) => void;
}

export function AddSourceModal({ onClose, onSave }: AddSourceModalProps) {
  const [formData, setFormData] = useState({
    sourceName: '',
    sourceType: 'Social Media',
    campaignName: '',
    description: '',
    leadTarget: '',
    marketingBudget: '',
    status: 'Active',
    startDate: '',
    endDate: '',
    assignedManager: 'Alice',
    notes: ''
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSave = () => {
    let newErrors: any = {};
    if (!formData.sourceName) newErrors.sourceName = "Source Name is required";
    if (!formData.sourceType) newErrors.sourceType = "Source Type is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: formData.sourceName.toLowerCase().replace(/\s+/g, '-'),
      source: formData.sourceName,
      leads: parseInt(formData.leadTarget || '0') || Math.floor(Math.random() * 500) + 100,
      applications: Math.floor(Math.random() * 200) + 50,
      admissions: Math.floor(Math.random() * 100) + 20,
      revenue: parseFloat(formData.marketingBudget || '0') * 2.5 || 2.5,
      convRate: (Math.random() * 10 + 5).toFixed(1),
      marketingCost: parseFloat(formData.marketingBudget || '0') || 1.2,
      costPerLead: '150',
      manager: formData.assignedManager,
      leadStatus: formData.status,
      campaign: formData.campaignName,
      status: formData.status, // Ensure status matches for compatibility
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel"
        style={{ position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', borderRadius: '16px', overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Add Source</h2>
          <button onClick={onClose} className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Source Name *</label>
              <input type="text" name="sourceName" value={formData.sourceName} onChange={handleChange} className="glass-input" placeholder="e.g. Instagram" style={{ width: '100%', padding: '10px 14px' }} />
              {errors.sourceName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.sourceName}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Source Type *</label>
              <select name="sourceType" value={formData.sourceType} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }}>
                <option>Social Media</option>
                <option>Search Engine</option>
                <option>Email</option>
                <option>Referral</option>
                <option>Walk-in</option>
                <option>Campaign</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Campaign Name</label>
            <input type="text" name="campaignName" value={formData.campaignName} onChange={handleChange} className="glass-input" placeholder="Optional" style={{ width: '100%', padding: '10px 14px' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="glass-input" placeholder="Optional" rows={3} style={{ width: '100%', padding: '10px 14px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lead Target</label>
              <input type="number" name="leadTarget" value={formData.leadTarget} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Marketing Budget</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>₹</span>
                <input type="number" name="marketingBudget" value={formData.marketingBudget} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px 10px 28px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assigned Manager</label>
              <select name="assignedManager" value={formData.assignedManager} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 14px' }}>
                <option>Alice</option>
                <option>Bob</option>
                <option>Charlie</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="glass-input" placeholder="Optional" rows={2} style={{ width: '100%', padding: '10px 14px', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="secondary-btn" style={{ padding: '10px 24px' }}>Cancel</button>
          <button onClick={handleSave} className="primary-btn" style={{ padding: '10px 24px' }}>Save Source</button>
        </div>
      </motion.div>
    </div>
  );
}
