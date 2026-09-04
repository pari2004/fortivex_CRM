import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';

interface Props {
  onClose: () => void;
  onProceed: () => void;
}

export function QuoteSetupModal({ onClose, onProceed }: Props) {
  const [formData, setFormData] = useState({
    numbering: 'QT-[YYYY]-[0000]',
    template: 'Standard Professional',
    taxes: 'GST 18%',
    currency: 'INR (₹)'
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Settings size={32} color="var(--primary-color)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Set up quotation defaults</h2>
          <p style={{ color: 'var(--text-tertiary)' }}>Configure standard settings for your new quotes. You can always change these later in settings.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Quote Numbering Format</label>
            <input type="text" value={formData.numbering} onChange={e => setFormData({...formData, numbering: e.target.value})} className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Default Template</label>
            <select value={formData.template} onChange={e => setFormData({...formData, template: e.target.value})} className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <option>Standard Professional</option>
              <option>Modern Minimal</option>
              <option>Detailed Breakdown</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Default Taxes</label>
              <select value={formData.taxes} onChange={e => setFormData({...formData, taxes: e.target.value})} className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <option>GST 18%</option>
                <option>VAT 5%</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Currency</label>
              <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button type="button" onClick={onProceed} className="primary-btn" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Proceed to set up</button>
        </div>
      </div>
    </div>
  );
}
