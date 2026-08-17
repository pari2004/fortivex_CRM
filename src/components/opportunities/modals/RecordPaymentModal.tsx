import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export function RecordPaymentModal({ onClose, onSuccess }: Props) {
  const { addPayment } = useCRM();
  const [formData, setFormData] = useState({
    studentName: '',
    invoiceNumber: '',
    amount: 0,
    method: 'Bank Transfer',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      ...formData,
      status: 'Paid'
    });
    onSuccess?.(formData.studentName);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Record Payment</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Student Name</label>
            <input required type="text" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Invoice / Reference Number</label>
            <input required type="text" value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Amount (₹)</label>
            <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Payment Method</label>
            <select required value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Payment Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
