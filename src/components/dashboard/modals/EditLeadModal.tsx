import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const stages = ['New Lead', 'Contacted', 'Working', 'Qualified', 'Opportunity', 'Converted', 'Lost', 'Not Interested', 'Duplicate', 'Invalid'];

export function EditLeadModal({ lead, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ ...lead });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Edit Lead</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Name</label><input name="name" value={formData.name || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} /></div>
          <div><label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mobile Number</label><input name="mobile" value={formData.mobile || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} /></div>
          <div><label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label><input name="email" value={formData.email || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} /></div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Stage</label>
            <select name="leadStage" value={formData.leadStage || formData.status || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lead Source</label><input name="leadSource" value={formData.leadSource || formData.source || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} /></div>
          <div><label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Remark</label><input name="remark" value={formData.remark || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} /></div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={() => onSave(formData)} style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
