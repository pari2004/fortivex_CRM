import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export function AddNewDealModal({ onClose, onSuccess }: Props) {
  const { addDeal } = useCRM();
  const [formData, setFormData] = useState({
    leadName: '',
    program: 'Full Stack Development',
    revenue: 0,
    stage: 'Discovery',
    dealOwner: 'Unassigned',
    closeDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      ...formData,
      status: 'Open'
    });
    onSuccess?.(formData.leadName);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Deal</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Student Name</label>
            <input required type="text" value={formData.leadName} onChange={e => setFormData({...formData, leadName: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Program</label>
            <input required type="text" value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expected Revenue (₹)</label>
            <input required type="number" value={formData.revenue} onChange={e => setFormData({...formData, revenue: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Stage</label>
            <select required value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
              <option value="Discovery">Discovery</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expected Close Date</label>
            <input required type="date" value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create Deal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
