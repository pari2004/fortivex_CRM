'use client';

import React, { useState } from 'react';
import { useCRM, Payment } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Edit, Trash2, RotateCcw, Download } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesPaymentsTabular() {
  const { payments } = useCRM();
  const [filteredData, setFilteredData] = useState<Payment[]>(payments);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleAction = (action: string, payment: Payment) => {
    setActiveMenuId(null);
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Payment Ledger</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Detailed spreadsheet view for financial reconciliation.</p>
      </div>

      <DataToolbar 
        data={payments} 
        onFilteredDataChange={(f) => { setFilteredData(f); setPage(1); }} 
        searchKeys={['id', 'invoiceNumber', 'studentName']}
        searchPlaceholder="Search ledger..."
        exportFilename="Payment_Ledger_Export"
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Failed', 'Refunded', 'Overdue'] },
          { key: 'method', label: 'Method', type: 'select', options: ['Credit Card', 'Bank Transfer', 'UPI', 'Cash'] }
        ]}
        selectedItems={currentData.filter(d => selectedRows.has(d.id))}
        exportMapping={[
          { key: 'id', label: 'Receipt ID' },
          { key: 'studentName', label: 'Student' },
          { key: 'invoiceNumber', label: 'Admission ID' },
          { key: 'amount', label: 'Amount' },
          { key: 'method', label: 'Payment Method' },
          { key: 'date', label: 'Payment Date' },
          { key: 'status', label: 'Status' }
        ]}
      />

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Receipt ID</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Admission ID</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Program</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Amount</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Payment Method</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Payment Date</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(pay => (
              <tr key={pay.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>{pay.id}</td>
                <td style={{ padding: '10px 16px' }}>{pay.studentName}</td>
                <td style={{ padding: '10px 16px' }}>{pay.invoiceNumber}</td>
                <td style={{ padding: '10px 16px' }}>Full Stack Development</td>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>{formatCurrency(pay.amount)}</td>
                <td style={{ padding: '10px 16px' }}>{pay.method}</td>
                <td style={{ padding: '10px 16px' }}>{new Date(pay.date).toLocaleDateString()}</td>
                <td style={{ padding: '10px 16px' }}>{pay.status}</td>
                <td style={{ padding: '10px 16px' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === pay.id}
                    onToggle={() => setActiveMenuId(activeMenuId === pay.id ? null : pay.id)}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'Edit', icon: <Edit size={16} />, onClick: () => handleAction('edit', pay) },
                      { label: 'Download Receipt', icon: <Download size={16} />, onClick: () => handleAction('download', pay) },
                      { label: 'Refund', icon: <RotateCcw size={16} />, color: '#d97706', onClick: () => handleAction('refund', pay) },
                      { label: 'Delete', icon: <Trash2 size={16} />, color: '#dc2626', onClick: () => handleAction('delete', pay) },
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
