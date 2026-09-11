'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM, Payment } from '@/contexts/CRMContext';
import { CreditCard, CheckCircle, XCircle, X, Download, Trash2, Edit, FileText, ChevronLeft, ChevronRight, Eye, MoreVertical, Settings, Menu, Search, Filter } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

// Column Definition
type ColumnDef = { id: string; label: string; defaultVisible: boolean };

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'leadName', label: 'Lead Name', defaultVisible: true },
  { id: 'currency', label: 'Currency', defaultVisible: true },
  { id: 'amount', label: 'Amount', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'leadOwner', label: 'Lead Owner', defaultVisible: true },
  { id: 'requestedBy', label: 'Requested By', defaultVisible: true },
  { id: 'paymentAttempt', label: 'Payment Attempt', defaultVisible: true },
  { id: 'paymentAmount', label: 'Payment Amount', defaultVisible: true },
  { id: 'paymentType', label: 'Payment Type', defaultVisible: true },
  { id: 'paymentLink', label: 'Payment Link', defaultVisible: true },
  { id: 'note', label: 'Note', defaultVisible: true },
  { id: 'credited', label: 'Credited', defaultVisible: true },
  { id: 'updated', label: 'Updated', defaultVisible: true },
  { id: 'finalPaymentOn', label: 'Final Payment On', defaultVisible: true },
  { id: 'leadSource', label: 'Lead Source', defaultVisible: true },
];

export function OpportunitiesPaymentsTabular() {
  const { payments, updatePayment } = useCRM();
  
  // State
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization State
  const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_COLUMNS.map(c => c.id));
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(DEFAULT_COLUMNS.map(c => c.id)));
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>([]);
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Set<string>>(new Set());
  const [columnSearch, setColumnSearch] = useState('');

  // Filtering State
  const [paymentFilter, setPaymentFilter] = useState('All Payments');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  useGlobalEscape(!!activeMenuId, () => setActiveMenuId(null));
  
  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return payments.filter(p => {
      // 1. Dropdown Filter
      if (paymentFilter !== 'All Payments') {
        const d = p.createdAt ? new Date(p.createdAt) : new Date();
        const now = new Date();
        
        if (paymentFilter === 'All Payments This Month') {
          if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
        } else if (paymentFilter === 'Requested and Open') {
          if (p.status !== 'Requested' && p.status !== 'Open') return false;
        } else if (paymentFilter === 'Paid Already') {
          if (p.status !== 'Paid Already') return false;
        } else if (paymentFilter === 'Failed Attempts') {
          if (p.status !== 'Failed Attempts') return false;
        } else if (paymentFilter === 'Partially Paid') {
          if (p.status !== 'Partially Paid') return false;
        } else if (paymentFilter === 'Request Canceled' || paymentFilter === 'Request Cancelled') {
          if (p.status !== 'Request Cancelled' && p.status !== 'Request Canceled') return false;
        }
      }

      // 2. Quick Filter
      if (quickFilter) {
        if (quickFilter === 'Pending Payments' && p.status !== 'Requested' && p.status !== 'Open') return false;
        if (quickFilter === 'Paid Already' && p.status !== 'Paid Already') return false;
        if (quickFilter === 'Requested Canceled' && p.status !== 'Request Cancelled' && p.status !== 'Request Canceled') return false;
      }

      // 3. Search Query
      const q = searchQuery.toLowerCase();
      if (q) {
        const matchesSearch = (p.leadName && p.leadName.toLowerCase().includes(q)) ||
                              (p.studentName && p.studentName.toLowerCase().includes(q)) ||
                              (p.id && p.id.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [payments, searchQuery, paymentFilter, quickFilter]);

  // --- Summary Metrics ---
  const summaryMetrics = useMemo(() => {
    let pending = 0;
    let paid = 0;
    let requested = 0;
    let canceled = 0;

    payments.forEach(p => {
      if (p.status === 'Requested' || p.status === 'Open') {
        pending++;
        requested++;
      }
      if (p.status === 'Paid Already') paid++;
      if (p.status === 'Request Cancelled' || p.status === 'Request Canceled') canceled++;
    });

    return { pending, paid, requested, canceled };
  }, [payments]);

  // --- Resizing state ---
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizingCol = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const th = (e.target as HTMLElement).closest('th');
    if (th) {
      resizingCol.current = {
        key,
        startX: e.pageX,
        startWidth: th.offsetWidth
      };
      document.body.style.cursor = 'col-resize';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingCol.current) return;
      const { key, startX, startWidth } = resizingCol.current;
      const diff = e.pageX - startX;
      const newWidth = Math.max(80, startWidth + diff);
      setColumnWidths(prev => ({ ...prev, [key]: newWidth }));
    };

    const handleMouseUp = () => {
      if (resizingCol.current) {
        resizingCol.current = null;
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // --- Modal Helpers ---
  const openCustomizeModal = () => {
    setTempColumnOrder([...columnOrder]);
    setTempVisibleColumns(new Set(visibleColumns));
    setColumnSearch('');
    setIsCustomizeModalOpen(true);
  };

  const closeCustomizeModal = () => setIsCustomizeModalOpen(false);

  const applyCustomization = () => {
    setColumnOrder([...tempColumnOrder]);
    setVisibleColumns(new Set(tempVisibleColumns));
    setIsCustomizeModalOpen(false);
  };

  const handleToggleColumn = (colId: string) => {
    const next = new Set(tempVisibleColumns);
    if (next.has(colId)) next.delete(colId);
    else next.add(colId);
    setTempVisibleColumns(next);
  };

  // Drag and drop sorting in modal
  const [draggingColId, setDraggingColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingColId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`col-item-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggingColId || draggingColId === id) return;

    const currentIdx = tempColumnOrder.indexOf(draggingColId);
    const targetIdx = tempColumnOrder.indexOf(id);

    const newOrder = [...tempColumnOrder];
    newOrder.splice(currentIdx, 1);
    newOrder.splice(targetIdx, 0, draggingColId);
    setTempColumnOrder(newOrder);
  };

  const handleDragEnd = (id: string) => {
    setDraggingColId(null);
    const el = document.getElementById(`col-item-${id}`);
    if (el) el.style.opacity = '1';
  };


  // Helpers
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
      case 'Request Cancelled': 
      case 'Request Canceled': return { bg: '#f1f5f9', color: '#475569' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

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
    const next = new Set(selectedRows);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedRows(next);
  };

  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;

  const handleBulkAction = (action: string) => {
    if (selectedRows.size === 0) return;
    
    if (action === 'delete') {
      if (confirm(`Delete ${selectedRows.size} payments?`)) {
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

  // Cell Renderer
  const renderCell = (payment: Payment, colId: string) => {
    switch(colId) {
      case 'leadName':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="checkbox" 
              checked={selectedRows.has(payment.id)} 
              onChange={(e) => handleSelectRow(payment.id, e.target.checked)} 
              style={{ cursor: 'pointer' }} 
            />
            {payment.leadName || payment.studentName || 'Unknown'}
          </div>
        );
      case 'currency':
        return payment.currency || 'INR';
      case 'amount':
        return <span style={{ fontWeight: 600 }}>{formatCurrency(payment.amount, payment.currency)}</span>;
      case 'status':
        const statusStyle = getStatusColor(payment.status);
        return (
          <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {payment.status}
          </span>
        );
      case 'leadOwner':
        return payment.leadOwner || payment.collectedBy || '-';
      case 'requestedBy':
        return payment.requestedBy || '-';
      case 'paymentAttempt':
        return payment.paymentAttempt || 1;
      case 'paymentAmount':
        return <span style={{ fontWeight: 500 }}>{payment.paymentAmount ? formatCurrency(payment.paymentAmount, payment.currency) : '-'}</span>;
      case 'paymentType':
        return payment.paymentType || payment.channel || '-';
      case 'paymentLink':
        return payment.paymentLink && payment.paymentLink !== '-' ? (
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>{payment.paymentLink}</a>
        ) : '-';
      case 'note':
        return <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{payment.notes || '-'}</div>;
      case 'credited':
        return payment.credited ? <CheckCircle size={14} color="#16a34a"/> : '-';
      case 'updated':
        return payment.updatedAt ? new Date(payment.updatedAt).toLocaleDateString() : '-';
      case 'finalPaymentOn':
        return payment.finalPaymentOn ? new Date(payment.finalPaymentOn).toLocaleDateString() : '-';
      case 'leadSource':
        return payment.leadSource || '-';
      default:
        return '-';
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
      
      {/* Header and Top Filters */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>Payments Tabular</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Main Dropdown */}
          <select 
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
          >
            <option>All Payments</option>
            <option>All Payments This Month</option>
            <option>Requested and Open</option>
            <option>Paid Already</option>
            <option>Failed Attempts</option>
            <option>Partially Paid</option>
            <option>Request Canceled</option>
          </select>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => { setQuickFilter(quickFilter === 'Pending Payments' ? null : 'Pending Payments'); setPage(1); }}
              style={{ padding: '8px 16px', borderRadius: '20px', border: quickFilter === 'Pending Payments' ? '1px solid #3b82f6' : '1px solid var(--border-color)', background: quickFilter === 'Pending Payments' ? '#eff6ff' : 'white', color: quickFilter === 'Pending Payments' ? '#1d4ed8' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Pending Payments
            </button>
            <button 
              onClick={() => { setQuickFilter(quickFilter === 'Paid Already' ? null : 'Paid Already'); setPage(1); }}
              style={{ padding: '8px 16px', borderRadius: '20px', border: quickFilter === 'Paid Already' ? '1px solid #22c55e' : '1px solid var(--border-color)', background: quickFilter === 'Paid Already' ? '#f0fdf4' : 'white', color: quickFilter === 'Paid Already' ? '#15803d' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Paid Already
            </button>
            <button 
              onClick={() => { setQuickFilter(quickFilter === 'Requested Canceled' ? null : 'Requested Canceled'); setPage(1); }}
              style={{ padding: '8px 16px', borderRadius: '20px', border: quickFilter === 'Requested Canceled' ? '1px solid #64748b' : '1px solid var(--border-color)', background: quickFilter === 'Requested Canceled' ? '#f8fafc' : 'white', color: quickFilter === 'Requested Canceled' ? '#334155' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Requested Canceled
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Pending Payments</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{summaryMetrics.pending}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Paid Already</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>{summaryMetrics.paid}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Requested / Open</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706' }}>{summaryMetrics.requested}</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Request Canceled</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#475569' }}>{summaryMetrics.canceled}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search payments..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', width: '250px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleBulkAction('export')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16}/> Export
          </button>
          <button onClick={openCustomizeModal} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={16}/> Customize Table Columns
          </button>
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
            <button onClick={() => handleBulkAction('delete')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
              <Trash2 size={14}/> Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {columnOrder.filter(id => visibleColumns.has(id)).map(colId => {
                  const colDef = DEFAULT_COLUMNS.find(c => c.id === colId);
                  if (!colDef) return null;
                  
                  return (
                    <th key={colId} style={{ position: 'relative', width: columnWidths[colId] || 'auto', minWidth: columnWidths[colId] || (colId === 'leadName' ? '180px' : 'auto'), padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {colId === 'leadName' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                          {colDef.label}
                        </div>
                      ) : (
                        colDef.label
                      )}
                      <div onMouseDown={(e) => handleMouseDown(e, colId)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent' }} className="resizer-handle" />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map(payment => {
                const isSelected = selectedRows.has(payment.id);
                
                return (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSelected ? '#f8fafc' : 'white' }}>
                    {columnOrder.filter(id => visibleColumns.has(id)).map(colId => (
                      <td key={colId} style={{ padding: '12px 16px', fontSize: '0.85rem', color: colId === 'leadName' || colId === 'amount' ? '#0f172a' : '#475569' }}>
                        {renderCell(payment, colId)}
                      </td>
                    ))}
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={visibleColumns.size} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No payments found matching your search and filters.
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

      {/* Customize Table Columns Modal */}
      {isCustomizeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={closeCustomizeModal} />
          
          <div style={{ background: 'white', borderRadius: '12px', width: '500px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Customize Table Columns</h3>
              <button onClick={closeCustomizeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="text" 
                  placeholder="Search columns..." 
                  value={columnSearch}
                  onChange={e => setColumnSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setTempVisibleColumns(new Set(DEFAULT_COLUMNS.map(c => c.id)))}
                  style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                  Select All
                </button>
                <button 
                  onClick={() => setTempVisibleColumns(new Set())}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                  Clear All
                </button>
                <button 
                  onClick={() => {
                    setTempColumnOrder(DEFAULT_COLUMNS.map(c => c.id));
                    setTempVisibleColumns(new Set(DEFAULT_COLUMNS.map(c => c.id)));
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                >
                  Reset to Default
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tempColumnOrder.filter(id => {
                  const label = DEFAULT_COLUMNS.find(c => c.id === id)?.label || '';
                  return label.toLowerCase().includes(columnSearch.toLowerCase());
                }).map(colId => {
                  const colDef = DEFAULT_COLUMNS.find(c => c.id === colId);
                  if (!colDef) return null;
                  
                  return (
                    <div 
                      key={colId}
                      id={`col-item-${colId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, colId)}
                      onDragOver={(e) => handleDragOver(e, colId)}
                      onDragEnd={() => handleDragEnd(colId)}
                      style={{ 
                        display: 'flex', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', 
                        border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'grab', transition: 'opacity 0.2s'
                      }}
                    >
                      <Menu size={16} color="var(--text-tertiary)" style={{ marginRight: '12px', cursor: 'grab' }} />
                      <input 
                        type="checkbox"
                        id={`chk-${colId}`}
                        checked={tempVisibleColumns.has(colId)}
                        onChange={() => handleToggleColumn(colId)}
                        style={{ marginRight: '12px', cursor: 'pointer' }}
                      />
                      <label htmlFor={`chk-${colId}`} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                        {colDef.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={closeCustomizeModal}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={applyCustomization}
                style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
