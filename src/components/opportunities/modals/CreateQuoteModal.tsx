import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export function CreateQuoteModal({ onClose, onSuccess }: Props) {
  const { addQuote } = useCRM();
  const [formData, setFormData] = useState({
    student: '',
    program: 'Full Stack Development',
    feeAmount: 0,
    discount: 0,
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  });

  const tax = (formData.feeAmount - formData.discount) * 0.18;
  const finalAmount = formData.feeAmount - formData.discount + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuote({
      ...formData,
      tax,
      finalAmount,
      createdBy: 'Current User',
      status: 'Draft'
    });
    onSuccess?.(formData.student);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Quote</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Student Name</label>
              <input required type="text" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Program</label>
              <input required type="text" value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Base Fee Amount (₹)</label>
              <input required type="number" value={formData.feeAmount} onChange={e => setFormData({...formData, feeAmount: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Discount Amount (₹)</label>
              <input required type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span>
              <span>₹{(formData.feeAmount - formData.discount).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-tertiary)' }}>
              <span>GST (18%):</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '8px' }}>
              <span>Total Amount:</span>
              <span style={{ color: 'var(--primary-color)' }}>₹{finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Valid Until</label>
            <input required type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Generate Quote</button>
          </div>
        </form>
      </div>
    </div>
  );
}
