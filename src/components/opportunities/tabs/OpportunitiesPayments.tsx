'use client';

import React, { useState } from 'react';
import { useCRM, Payment } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { CreditCard, DollarSign, CheckCircle, XCircle, RotateCcw, AlertCircle, Edit, Trash2, Download, Printer } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesPayments() {
  const { payments, updatePayment } = useCRM();
  const [filteredData, setFilteredData] = useState<Payment[]>(payments);
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 15;
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // KPIs
  const totalPayments = payments.length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const completedPayments = payments.filter(p => p.status === 'Paid').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;
  const refunds = payments.filter(p => p.status === 'Refunded').length;
  const monthlyRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Failed': case 'Refunded': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': case 'Partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAction = (action: string, payment: Payment) => {
    setActiveMenuId(null);
    if (action === 'delete') {
      if(confirm('Delete payment?')) {
        setFilteredData(d => d.filter(x => x.id !== payment.id));
      }
    } else if (action === 'refund') {
      const updated = { ...payment, status: 'Refunded' };
      updatePayment(updated);
      setFilteredData(d => d.map(x => x.id === payment.id ? updated : x));
    }
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px' }}>
      
      {/* KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Payments', value: totalPayments, icon: <CreditCard size={20}/>, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Pending', value: pendingPayments, icon: <AlertCircle size={20}/>, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
          { label: 'Completed', value: completedPayments, icon: <CheckCircle size={20}/>, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Failed', value: failedPayments, icon: <XCircle size={20}/>, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Refunds', value: refunds, icon: <RotateCcw size={20}/>, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: <DollarSign size={20}/>, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Outstanding Amount', value: formatCurrency(outstandingAmount), icon: <DollarSign size={20}/>, color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ padding: '12px', background: kpi.bg, color: kpi.color, borderRadius: '12px' }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <DataToolbar 
        data={payments} 
        onFilteredDataChange={(f) => { setFilteredData(f); setPage(1); }} 
        searchKeys={['id', 'invoiceNumber', 'studentName']}
        searchPlaceholder="Search payments..."
        exportFilename="Payments_Dashboard"
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Failed', 'Refunded', 'Overdue'] },
          { key: 'method', label: 'Method', type: 'select', options: ['Credit Card', 'Bank Transfer', 'UPI', 'Cash'] }
        ]}
        selectedItems={[]}
        exportMapping={[
          { key: 'id', label: 'Receipt ID' },
          { key: 'invoiceNumber', label: 'Invoice No' },
          { key: 'studentName', label: 'Student' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' }
        ]}
      />

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Receipt & Invoice</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Amount</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Date</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(pay => (
              <tr key={pay.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 'bold' }}>{pay.id}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{pay.invoiceNumber}</div>
                </td>
                <td style={{ padding: '16px 12px', fontWeight: 500 }}>{pay.studentName}</td>
                <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--primary-color)' }}>{formatCurrency(pay.amount)}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(pay.status)}`}>
                    {pay.status}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{pay.method}</div>
                </td>
                <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>{new Date(pay.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === pay.id}
                    onToggle={() => setActiveMenuId(activeMenuId === pay.id ? null : pay.id)}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'Edit Payment', icon: <Edit size={16} />, onClick: () => {} },
                      { label: 'Download Receipt', icon: <Download size={16} />, onClick: () => {} },
                      { label: 'Print', icon: <Printer size={16} />, onClick: () => window.print() },
                      { label: 'Refund', icon: <RotateCcw size={16} />, color: '#d97706', onClick: () => handleAction('refund', pay) },
                      { label: 'Delete', icon: <Trash2 size={16} />, color: '#dc2626', onClick: () => handleAction('delete', pay) }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
