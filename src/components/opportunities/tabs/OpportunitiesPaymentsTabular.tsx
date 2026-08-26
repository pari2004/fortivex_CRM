'use client';

import React, { useState, useMemo } from 'react';
import { useCRM, Payment } from '@/contexts/CRMContext';
import { CreditCard, CheckCircle, XCircle, X, Download, Trash2, Edit, FileText, ChevronLeft, ChevronRight, Eye, MoreVertical } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesPaymentsTabular() {
  const { payments, updatePayment } = useCRM();
  
  // State
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Simple search for demonstration
  const [searchQuery, setSearchQuery] = useState('');

  useGlobalEscape(!!activeMenuId, () => setActiveMenuId(null));

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Requested': return { bg: '#dbeafe', color: '#2563eb' };
      case 'Open': return { bg: '#fef3c7', color: '#d97706' };
      case 'Paid Already': return { bg: '#dcfce7', color: '#16a34a' };
      case 'Failed Attempts': return { bg: '#fee2e2', color: '#dc2626' };
      case 'Partially Paid': return { bg: '#f3e8ff', color: '#9333ea' };
      case 'Request Cancelled': return { bg: '#f1f5f9', color: '#475569' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const filteredData = useMemo(() => {
    return payments.filter(p => {
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      return (
        (p.leadName && p.leadName.toLowerCase().includes(q)) ||
        (p.studentName && p.studentName.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      );
    });
  }, [payments, searchQuery]);

  const itemsPerPage = 15;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredData.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedRows);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedRows(newSet);
  };

  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;

  // Individual Actions
  const handleAction = (action: string, payment: Payment) => {
    setActiveMenuId(null);
    let updated = { ...payment };
    switch (action) {
      case 'view':
        alert(`Opening details for ${payment.id}`);
        break;
      case 'edit':
        alert('Edit functionality not fully implemented in demo.');
        break;
      case 'mark_paid':
        updated.status = 'Paid Already';
        updated.paidAt = new Date().toISOString();
        updatePayment(updated);
        break;
      case 'mark_failed':
        updated.status = 'Failed Attempts';
        updatePayment(updated);
        break;
      case 'cancel':
        updated.status = 'Request Cancelled';
        updatePayment(updated);
        break;
      case 'note':
        const note = prompt('Enter note:');
        if (note) {
          updated.notes = updated.notes ? `${updated.notes}\n${note}` : note;
          updatePayment(updated);
        }
        break;
    }
  };

  // Bulk Actions
  const handleBulkAction = (action: string) => {
    if (selectedRows.size === 0) return;
    
    if (action === 'delete') {
      if (confirm(`Delete ${selectedRows.size} payments?`)) {
        // Since deletePayment is not in context, we only simulate or we map status to Cancelled.
        alert(`Bulk delete simulated for ${selectedRows.size} records.`);
        setSelectedRows(new Set());
      }
      return;
    }

    selectedRows.forEach(id => {
      const payment = payments.find(p => p.id === id);
      if (payment) {
        let updated = { ...payment };
        if (action === 'mark_paid') {
          updated.status = 'Paid Already';
          updated.paidAt = new Date().toISOString();
        } else if (action === 'mark_failed') {
          updated.status = 'Failed Attempts';
        } else if (action === 'cancel') {
          updated.status = 'Request Cancelled';
        }
        updatePayment(updated);
      }
    });
    
    if (action === 'export') {
      alert(`Exporting ${selectedRows.size} records to CSV.`);
    }

    setSelectedRows(new Set());
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>Payments Tabular</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comprehensive spreadsheet view of all payment requests.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search payments..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', width: '250px' }}
          />
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedRows.size > 0 && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e40af' }}>
            {selectedRows.size} {selectedRows.size === 1 ? 'record' : 'records'} selected
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleBulkAction('mark_paid')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14}/> Mark Paid
            </button>
            <button onClick={() => handleBulkAction('mark_failed')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={14}/> Mark Failed
            </button>
            <button onClick={() => handleBulkAction('cancel')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <X size={14}/> Cancel Request
            </button>
            <button onClick={() => handleBulkAction('export')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14}/> Export
            </button>
            <button onClick={() => handleBulkAction('delete')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
              <Trash2 size={14}/> Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1800px' }}>
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                  Lead Name
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Currency</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Lead Owner</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Requested By</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Payment Attempt</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Payment Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Payment Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Payment Link</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Note</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Credited</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Updated</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Final Payment On</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>Lead Source</th>
                
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map(payment => {
                const statusStyle = getStatusColor(payment.status);
                const isSelected = selectedRows.has(payment.id);
                
                return (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSelected ? '#f8fafc' : 'white' }}>
                    
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#0f172a', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={(e) => handleSelectRow(payment.id, e.target.checked)} 
                          style={{ cursor: 'pointer' }} 
                        />
                        {payment.leadName || payment.studentName || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>
                      {payment.currency || 'INR'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{payment.leadOwner || payment.collectedBy || '-'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{payment.requestedBy || '-'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{payment.paymentAttempt || 1}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                      {payment.paymentAmount ? formatCurrency(payment.paymentAmount, payment.currency) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{payment.paymentType || payment.channel || '-'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#2563eb', whiteSpace: 'nowrap' }}>
                      {payment.paymentLink && payment.paymentLink !== '-' ? (
                        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>{payment.paymentLink}</a>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {payment.notes || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>
                      {payment.credited ? <CheckCircle size={14} color="#16a34a"/> : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {payment.updatedAt ? new Date(payment.updatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {payment.finalPaymentOn ? new Date(payment.finalPaymentOn).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>
                      {payment.leadSource || '-'}
                    </td>
                    
                    
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={17} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No payments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', background: page === 1 ? '#f1f5f9' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page >= totalPages}
                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', background: page >= totalPages ? '#f1f5f9' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
