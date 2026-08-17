import React, { useState } from 'react';
import { useCRM, Application } from '@/contexts/CRMContext';
import { X } from 'lucide-react';

interface Props {
  app: Application;
  onClose: () => void;
}

export function EditApplicationModal({ app, onClose }: Props) {
  const { updateApplication } = useCRM();
  const [formData, setFormData] = useState<Application>(app);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplication({
      ...formData,
      timeline: [
        ...(formData.timeline || []),
        { date: new Date().toISOString(), action: 'Application Edited', by: 'System User' }
      ]
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Application</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Student Name</label>
              <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Mobile</label>
              <input required type="text" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
              <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Program</label>
              <input required type="text" value={formData.program || ''} onChange={e => setFormData({...formData, program: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Qualification</label>
            <input type="text" value={formData.qualification || ''} onChange={e => setFormData({...formData, qualification: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Document Status</label>
              <select value={formData.documentStatus} onChange={e => setFormData({...formData, documentStatus: e.target.value as any})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Payment Status</label>
              <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value as any})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
