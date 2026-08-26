'use client';

import React, { useState, useMemo } from 'react';
import { useCRM, Payment } from '@/contexts/CRMContext';
import { CreditCard, DollarSign, CheckCircle, XCircle, MoreVertical, Edit, Trash2, Calendar, FileText, ChevronLeft, ChevronRight, Filter, Search, Eye, X, AlertTriangle, Send, Download, BarChart2 } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { PaymentDetailsModal } from '../modals/PaymentDetailsModal';
import { PaymentChartModal } from '../modals/PaymentChartModal';

export function OpportunitiesPayments() {
  const { payments, updatePayment, deletePayment } = useCRM();
  
  // Modals & States
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showChart, setShowChart] = useState<Payment | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [page, setPage] = useState(1);

  useGlobalEscape(!!activeMenuId, () => setActiveMenuId(null));

  // Derived Data
  const filteredData = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = !searchQuery || (p.leadName || p.studentName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchChannel = channelFilter === 'All' || p.channel === channelFilter || p.paymentType === channelFilter;
      return matchSearch && matchStatus && matchChannel;
    });
  }, [payments, searchQuery, statusFilter, channelFilter]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const collectedPayments = filteredData.filter(p => ['Paid Already', 'Successful', 'Collected'].includes(p.status) || p.status === 'Paid');
  const collectedCount = collectedPayments.length;
  const collectedSum = collectedPayments.reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);
  
  const pendingPayments = filteredData.filter(p => ['Requested', 'Open', 'Pending', 'Partially Paid'].includes(p.status));
  const pendingCount = pendingPayments.length;
  const pendingSum = pendingPayments.reduce((sum, p) => {
    if (p.status === 'Partially Paid') {
      const total = p.amount || 0;
      const paid = p.paymentAmount || 0;
      return sum + Math.max(0, total - paid);
    }
    return sum + (p.paymentAmount || p.amount || 0);
  }, 0);
  
  const failedPayments = filteredData.filter(p => ['Failed Attempts', 'Failed', 'Payment Failed'].includes(p.status));
  const failedCount = failedPayments.length;
  const failedSum = failedPayments.reduce((sum, p) => sum + (p.paymentAmount || p.amount || 0), 0);

  const formatCurrency = (amt: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amt);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Requested': return { bg: '#dbeafe', color: '#2563eb' };
      case 'Open': return { bg: '#fef3c7', color: '#d97706' };
      case 'Paid Already': return { bg: '#dcfce7', color: '#16a34a' };
      case 'Failed Attempts': return { bg: '#fee2e2', color: '#dc2626' };
      case 'Spam': return { bg: '#fef08a', color: '#854d0e' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(new Set(filteredData.map(p => p.id)));
    else setSelectedRows(new Set());
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedRows);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedRows(newSet);
  };

  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;

  // Actions
  const handleAction = (action: string, payment: Payment) => {
    setActiveMenuId(null);
    let updated = { ...payment };
    switch (action) {
      case 'view': setSelectedPayment(payment); break;
      case 'chart': setShowChart(payment); break;
      case 'mark_paid':
        updated.status = 'Paid Already';
        updated.paidAt = new Date().toISOString();
        updatePayment(updated);
        break;
      case 'mark_failed':
        updated.status = 'Failed Attempts';
        updatePayment(updated);
        break;
      case 'mark_spam':
        updated.status = 'Spam';
        updatePayment(updated);
        break;
      case 'cancel':
        updated.status = 'Request Cancelled';
        updatePayment(updated);
        break;
      case 'send_link':
        alert(`Payment link (${updated.paymentLink || 'No link'}) sent to ${updated.leadName || updated.studentName}.`);
        break;
      case 'delete':
        if (confirm('Delete this payment record?')) {
          deletePayment(updated.id);
          const newSet = new Set(selectedRows);
          newSet.delete(updated.id);
          setSelectedRows(newSet);
        }
        break;
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.size === 0) return;
    
    if (action === 'delete') {
      if (confirm(`Delete ${selectedRows.size} selected payment(s)?`)) {
        selectedRows.forEach(id => deletePayment(id));
        setSelectedRows(new Set());
      }
      return;
    }

    if (action === 'download') {
      const csvData = Array.from(selectedRows).map(id => {
        const p = payments.find(x => x.id === id);
        return p ? `${p.leadName || p.studentName},${p.currency || 'INR'},${p.amount},${p.status},${p.leadOwner || ''},${p.paymentType || ''},${p.paymentLink || ''}` : '';
      }).join('\n');
      alert(`Downloading CSV:\nLeadName,Currency,Amount,Status,LeadOwner,Type,Link\n${csvData}`);
      setSelectedRows(new Set());
      return;
    }

    if (action === 'send_link') {
      alert(`Sent payment links for ${selectedRows.size} selected records.`);
      setSelectedRows(new Set());
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
        } else if (action === 'mark_spam') {
          updated.status = 'Spam';
        }
        updatePayment(updated);
      }
    });
    
    setSelectedRows(new Set());
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: '24px', background: 'var(--bg-secondary)' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Collected</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#16a34a' }}>{collectedCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{formatCurrency(collectedSum)} collected</div>
          </div>
          <div style={{ background: '#dcfce7', color: '#16a34a', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '50%' }}><DollarSign size={24} /></div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Pending</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#d97706' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{formatCurrency(pendingSum)} pending</div>
          </div>
          <div style={{ background: '#fef3c7', color: '#d97706', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '50%' }}><CreditCard size={24} /></div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Failed Attempts</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626' }}>{failedCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{formatCurrency(failedSum)} failed</div>
          </div>
          <div style={{ background: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '50%' }}><AlertTriangle size={24} /></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Filter Sidebar */}
        <div style={{ width: '280px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Filters</h3>
          </div>
          
          <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Search Lead</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="Search name..."
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Status</label>
              <select 
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)', background: 'white' }}
              >
                <option value="All">All Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Open">Open</option>
                <option value="Paid Already">Paid Already</option>
                <option value="Failed Attempts">Failed Attempts</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Request Cancelled">Request Cancelled</option>
                <option value="Spam">Spam</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Channel / Type</label>
              <select 
                value={channelFilter}
                onChange={e => { setChannelFilter(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)', background: 'white' }}
              >
                <option value="All">All Channels</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Manual Created">Manual Created</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Selection Toolbar */}
          {selectedRows.size > 0 && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px 20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e40af' }}>
                {selectedRows.size} {selectedRows.size === 1 ? 'Payment' : 'Payments'} Selected
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => handleBulkAction('mark_paid')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14}/> Mark Paid
                </button>
                <button onClick={() => handleBulkAction('mark_failed')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={14}/> Mark Failed
                </button>
                <button onClick={() => handleBulkAction('mark_spam')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#854d0e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14}/> Mark Spam
                </button>
                <button onClick={() => handleBulkAction('send_link')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={14}/> Send Link
                </button>
                <button onClick={() => handleBulkAction('download')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={14}/> Download
                </button>
                <button onClick={() => handleBulkAction('delete')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={14}/> Delete
                </button>

                {selectedRows.size === 1 && (
                  <>
                    <div style={{ width: '1px', background: '#bfdbfe', margin: '0 4px' }} />
                    <button onClick={() => handleAction('view', payments.find(p => p.id === Array.from(selectedRows)[0])!)} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={14}/> Payment Details
                    </button>
                    <button onClick={() => handleAction('chart', payments.find(p => p.id === Array.from(selectedRows)[0])!)} style={{ padding: '6px 12px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart2 size={14}/> Graph/Chart
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ overflow: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                      Lead Name
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Amount</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Channel</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Created On</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? currentData.map(payment => {
                    const statusStyle = getStatusColor(payment.status);
                    const isSelected = selectedRows.has(payment.id);
                    
                    return (
                      <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSelected ? '#f8fafc' : 'white', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>
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
                        <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                          {formatCurrency(payment.paymentAmount || payment.amount, payment.currency || 'INR')}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {payment.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {payment.paymentType || payment.channel || 'Manual'}
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '-'}
                        </td>
                        
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                        No payments found matching your filters.
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
      </div>
      
      {/* Modals */}
      {selectedPayment && (
        <PaymentDetailsModal 
          isOpen={true}
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {showChart && (
        <PaymentChartModal
          payment={showChart}
          allPayments={payments}
          onClose={() => setShowChart(null)}
        />
      )}
    </div>
  );
}
