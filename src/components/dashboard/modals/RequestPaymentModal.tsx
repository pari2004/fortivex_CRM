import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, Banknote, Building, Check } from 'lucide-react';
import { useCRM, Payment } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'IRR', name: 'Iranian Rial' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', name: 'Omani Rial' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'KRW', name: 'South Korean Won' }
];

export function RequestPaymentModal({ isOpen, onClose, lead }: Props) {
  const { addPayment, updateLead, quotationDefaults } = useCRM();

  const [method, setMethod] = useState<'Razorpay' | 'Cashfree Payments' | 'Record Offline' | null>(null);
  const [currency, setCurrency] = useState('INR');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'Request New Payment' | 'Mark as Paid'>('Request New Payment');
  const [note, setNote] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-set currency to default from quotation defaults if available
  useEffect(() => {
    if (isOpen && quotationDefaults?.baseCurrency) {
      setCurrency(quotationDefaults.baseCurrency);
    }
  }, [isOpen, quotationDefaults]);

  const handleReset = () => {
    setMethod(null);
    setCurrency(quotationDefaults?.baseCurrency || 'INR');
    setAmount('');
    setStatus('Request New Payment');
    setNote('');
    setIsSuccess(false);
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const isFormValid = method && currency && amount && !isNaN(Number(amount)) && Number(amount) > 0;

  const handleSubmit = () => {
    if (!isFormValid || !lead) return;

    const numAmount = Number(amount);
    const generatedId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString();

    const newPayment: Payment = {
      id: generatedId,
      leadId: lead.id,
      leadName: lead.name,
      leadPhone: lead.phone,
      leadEmail: lead.email,
      amount: numAmount,
      currency: currency,
      status: status === 'Request New Payment' ? 'Requested' : 'Paid',
      channel: method,
      createdAt: nowStr,
      collectedBy: 'Current User', // Contextual
      notes: note
    };

    if (status === 'Mark as Paid') {
      newPayment.paidAt = nowStr;
    }

    addPayment(newPayment);

    // Update Lead timeline activity
    const activityTitle = status === 'Request New Payment' ? 'Payment request created' : 'Payment marked as paid';
    const activityDesc = `${currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : '')}${numAmount.toLocaleString()} ${currency}
${method}
Status: ${status === 'Request New Payment' ? 'Requested' : 'Paid'}
${note ? `Note: ${note}` : ''}`;
    
    const updatedLead = { ...lead };
    if (!updatedLead.activities) updatedLead.activities = [];
    updatedLead.activities.unshift({
      id: `ACT-${Date.now()}`,
      title: activityTitle,
      description: activityDesc,
      date: nowStr,
      type: 'Note' // or mapped custom type if payment activity is supported
    });
    
    updateLead(updatedLead);

    setIsSuccess(true);
    setTimeout(() => {
      handleReset();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={handleCancel} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '750px', maxHeight: '90vh',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>New Payment Request for {lead?.name || 'Contact'}</h3>
          <button onClick={handleCancel} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Payment Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <PaymentMethodCard 
              name="Razorpay" 
              icon={<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" style={{ height: '24px' }} />} 
              isSelected={method === 'Razorpay'} 
              onClick={() => setMethod('Razorpay')} 
            />
            <PaymentMethodCard 
              name="Cashfree Payments" 
              icon={<img src="https://cashfreelogo.cashfree.com/website/NavFooter/Cashfree-Dark.svg" alt="Cashfree" style={{ height: '24px' }} />} 
              isSelected={method === 'Cashfree Payments'} 
              onClick={() => setMethod('Cashfree Payments')} 
            />
            <PaymentMethodCard 
              name="Record Offline" 
              icon={<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f3e6.svg" alt="Offline" style={{ height: '28px' }} />} 
              isSelected={method === 'Record Offline'} 
              onClick={() => setMethod('Record Offline')} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {/* Currency */}
            <div>
              <label style={labelStyle}>Select Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label style={labelStyle}>Enter Requested Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 500 }}>
                  {currency}
                </span>
                <input 
                  type="number" 
                  min="0" step="0.01" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="0.00"
                  style={{ ...inputStyle, paddingLeft: '56px' }} 
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Set the status of this payment:</label>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
              <StatusCard 
                name="Request New Payment" 
                isSelected={status === 'Request New Payment'} 
                onClick={() => setStatus('Request New Payment')} 
              />
              <StatusCard 
                name="Mark as Paid" 
                isSelected={status === 'Mark as Paid'} 
                onClick={() => setStatus('Mark as Paid')} 
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={labelStyle}>Add any note</label>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Initial payment request for course enrollment."
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <button onClick={handleReset} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            Reset
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isSuccess && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 500 }}>
                <CheckCircle size={18} /> Payment request created successfully.
              </motion.div>
            )}
            
            <button 
              onClick={handleSubmit} 
              disabled={!isFormValid || isSuccess} 
              style={{ 
                padding: '12px 28px', background: isFormValid ? (isSuccess ? '#16a34a' : '#4f46e5') : '#94a3b8', 
                border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', 
                cursor: isFormValid && !isSuccess ? 'pointer' : 'not-allowed', transition: 'background 0.2s' 
              }}
            >
              {isSuccess ? 'Saved' : 'Submit'}
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

// Subcomponents

function PaymentMethodCard({ name, icon, isSelected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
        background: isSelected ? '#eff6ff' : 'white',
        borderRadius: '12px', padding: '24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
      }}
    >
      <div style={{ color: isSelected ? '#4f46e5' : '#64748b' }}>{icon}</div>
      <div style={{ fontWeight: 600, color: isSelected ? '#1e293b' : '#475569', textAlign: 'center' }}>{name}</div>
      {isSelected && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#4f46e5' }}>
          <CheckCircle size={18} fill="#eff6ff" />
        </div>
      )}
    </div>
  );
}

function StatusCard({ name, isSelected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        border: `1px solid ${isSelected ? '#4f46e5' : '#cbd5e1'}`,
        background: isSelected ? '#4f46e5' : 'white',
        color: isSelected ? 'white' : '#475569',
        padding: '12px 20px', borderRadius: '30px', cursor: 'pointer',
        fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s'
      }}
    >
      {isSelected && <Check size={16} strokeWidth={3} />}
      {name}
    </div>
  )
}

// Helpers
const labelStyle = { display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '10px' };
const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#1e293b', boxSizing: 'border-box' as const, background: 'white', fontFamily: 'inherit' };
