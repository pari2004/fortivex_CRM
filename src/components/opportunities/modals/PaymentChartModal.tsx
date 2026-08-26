'use client';

import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { Payment } from '@/contexts/CRMContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PaymentChartModalProps {
  payment: Payment;
  allPayments: Payment[]; // We pass all payments to filter for this specific lead
  onClose: () => void;
}

export function PaymentChartModal({ payment, allPayments, onClose }: PaymentChartModalProps) {
  useGlobalEscape(true, onClose);

  // Filter payments for this specific lead
  const leadPayments = allPayments.filter(p => p.leadName === payment.leadName || p.studentName === payment.studentName);

  // Analytics
  const totalAmount = leadPayments.reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);
  const paidAmount = leadPayments.filter(p => p.status === 'Paid Already').reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);
  const pendingAmount = leadPayments.filter(p => p.status === 'Requested' || p.status === 'Open').reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);
  const failedAmount = leadPayments.filter(p => p.status === 'Failed Attempts').reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);
  
  const attempts = leadPayments.reduce((sum, p) => sum + (p.paymentAttempt || 1), 0);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: payment.currency || 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  // Chart Data
  const breakdownData = [
    { name: 'Paid', value: paidAmount, color: '#16a34a' },
    { name: 'Pending', value: pendingAmount, color: '#d97706' },
    { name: 'Failed', value: failedAmount, color: '#dc2626' },
  ].filter(d => d.value > 0);

  const historyData = leadPayments.map((p, idx) => ({
    name: `Attempt ${idx + 1}`,
    Amount: p.paymentAmount || p.amount || 0,
    status: p.status
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} 
        onClick={onClose}
      />
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Payment Analytics: {payment.leadName || payment.studentName || 'Lead'}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Financial overview and history for this lead.</p>
          </div>
          <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14}/> Total Volume</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '8px' }}>{formatCurrency(totalAmount)}</div>
            </div>
            <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '16px', border: '1px solid #bbf7d0' }}>
              <div style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14}/> Paid Amount</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a', marginTop: '8px' }}>{formatCurrency(paidAmount)}</div>
            </div>
            <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '16px', border: '1px solid #fde68a' }}>
              <div style={{ color: '#92400e', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14}/> Pending Amount</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706', marginTop: '8px' }}>{formatCurrency(pendingAmount)}</div>
            </div>
            <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '16px', border: '1px solid #fecaca' }}>
              <div style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14}/> Failed Amount</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626', marginTop: '8px' }}>{formatCurrency(failedAmount)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Breakdown Chart */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Status Breakdown</h3>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={breakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Chart */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Payment Attempts ({attempts})</h3>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="Amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
