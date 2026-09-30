'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM, Quote } from '@/contexts/CRMContext';
import { ActionMenu } from '@/components/common/ActionMenu';
import { FileText, Send, XCircle, Copy, Printer, Download, Eye, Edit, Trash2, Search, ChevronDown, CheckCircle, Plus } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { AnimatePresence, motion } from 'framer-motion';
import { QuoteSetupModal } from '../modals/QuoteSetupModal';
import { QuotationDefaultsWorkspaceModal } from '../../dashboard/modals/QuotationDefaultsWorkspaceModal';
import { CreateQuoteModal } from '../modals/CreateQuoteModal';
import { QuoteDetailsModal } from '../modals/QuoteDetailsModal';


export type QuoteBusiness = {
  id: string;
  name: string;
  gstin: string;
  quotePrefix: string;
  currency: string;
  bank: string;
  isDefault?: boolean;
};

export function OpportunitiesQuotes() {
  const { quotes, updateQuote, addQuote, deleteQuote } = useCRM();
  const [viewMode, setViewMode] = useState<'My' | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Column Sizing State
  const defaultWidths: { [key: string]: number } = {
    quoteNumber: 150,
    customer: 200,
    leadName: 200,
    leadStage: 150,
    recentAction: 150,
    status: 120,
    quoteAmount: 150,
    paymentAmount: 150,
    paymentMode: 150,
    paymentStatus: 150,
    paymentLink: 120,
    quoteDate: 120,
    expiredDate: 120,
    owner: 150,
    subject: 250,
    subtotal: 120,
    tax: 120,
    discount: 120,
    shipping: 120,
    total: 120,
    actions: 100
  };
  const [colWidths, setColWidths] = useState<{ [key: string]: number }>(defaultWidths);
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingCol(colKey);
    setStartX(e.clientX);
    setStartWidth(colWidths[colKey] || 150);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingCol) return;
      const diff = e.clientX - startX;
      const newWidth = Math.max(80, startWidth + diff);
      setColWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingCol(null);
    };

    if (resizingCol) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [resizingCol, startX, startWidth]);

  // Quote Workspace Modals and State
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isWorkspaceDefaultsOpen, setIsWorkspaceDefaultsOpen] = useState(false);
  const [isDefaultBusinessConfigOpen, setIsDefaultBusinessConfigOpen] = useState(false);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [newBusinessLabel, setNewBusinessLabel] = useState('');
  const [quoteBusinesses, setQuoteBusinesses] = useState<QuoteBusiness[]>([
    {
      id: 'default',
      name: 'Not set',
      gstin: 'Not set',
      quotePrefix: 'Not set',
      currency: 'INR',
      bank: 'Not set',
      isDefault: true
    }
  ]);

  const currentUser = 'Current User'; // Mock current user

  const filteredData = useMemo(() => {
    return quotes.filter(q => {
      const matchOwner = viewMode === 'All' || q.owner === currentUser;
      const matchStatus = statusFilter === 'All' || q.status === statusFilter || (statusFilter === 'In Draft' && q.status === 'Draft');
      const searchStr = searchQuery.toLowerCase();
      const matchSearch = !searchStr || 
        q.quoteNumber?.toLowerCase().includes(searchStr) || 
        q.customer?.toLowerCase().includes(searchStr) || 
        q.leadName?.toLowerCase().includes(searchStr) || 
        q.owner?.toLowerCase().includes(searchStr) || 
        q.subject?.toLowerCase().includes(searchStr);
      return matchOwner && matchStatus && matchSearch;
    });
  }, [quotes, viewMode, statusFilter, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft': return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Draft</span>;
      case 'Sent': return <span style={{ background: '#dbeafe', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Sent</span>;
      case 'Paid': return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Paid</span>;
      case 'Cancelled': return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Cancelled</span>;
      default: return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (!status) return '-';
    if (status.includes('Paid')) return <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    if (status.includes('Requested')) return <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    if (status.includes('Fail')) return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
  };

  const handleAction = (action: string, quote: Quote) => {
    setActiveMenuId(null);
    let updated = { ...quote };
    switch (action) {
      case 'view':
        setSelectedQuote(quote);
        break;
      case 'edit':
        alert('Edit Quote modal opening soon');
        break;
      case 'send':
        updated.status = 'Sent';
        updated.recentAction = 'Quote Sent';
        updateQuote(updated);
        break;
      case 'mark_paid':
        updated.status = 'Paid';
        updated.paymentStatus = 'Paid Already';
        updated.paymentAmount = updated.total;
        updated.recentAction = 'Payment Received';
        updateQuote(updated);
        break;
      case 'cancel':
        updated.status = 'Cancelled';
        updated.recentAction = 'Quote Cancelled';
        updateQuote(updated);
        break;
      case 'duplicate':
        addQuote({
          ...quote,
          quoteNumber: `QT-2026-${Math.floor(Math.random()*10000)}`,
          status: 'Draft',
          paymentStatus: 'Unpaid',
          paymentAmount: 0
        });
        break;
      case 'download':
        alert(`Downloading PDF for ${quote.quoteNumber}...`);
        break;
      case 'delete':
        if(confirm('Delete quote?')) {
          deleteQuote(quote.id);
        }
        break;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStatusDropdown]);

  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px', background: 'var(--bg-secondary)' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* My / All Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('My')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'My' ? 'var(--primary-color)' : 'transparent',
                color: viewMode === 'My' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              My
            </button>
            <button
              onClick={() => setViewMode('All')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'All' ? 'var(--primary-color)' : 'transparent',
                color: viewMode === 'All' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All
            </button>
          </div>

          {/* Status Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}
            >
              {statusFilter === 'All' ? 'All Statuses' : statusFilter}
              <ChevronDown size={16} color="var(--text-tertiary)" />
            </button>
            <AnimatePresence>
              {showStatusDropdown && (
                <motion.div 
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)' }}
                >
                  {['All', 'In Draft', 'Sent', 'Paid', 'Cancelled'].map(status => (
                    <button 
                      key={status} 
                      onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
                      style={{ padding: '8px 12px', textAlign: 'left', background: statusFilter === status ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#0f172a', fontWeight: statusFilter === status ? 600 : 400 }}
                    >
                      {status}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search quotes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '300px', fontSize: '0.9rem' }}
            />
          </div>

        </div>

        <button 
          onClick={() => setIsPermissionModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> New Quote
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {filteredData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <FileText size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No quotes yet</h3>
            <p>Try adjusting your filters or create a new quote.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              <tr>
                {Object.entries({
                  quoteNumber: '1. Quote',
                  customer: '2. Customer',
                  leadName: '3. Lead Name',
                  leadStage: '4. Lead Stage',
                  recentAction: '5. Recent Action',
                  status: '6. Status',
                  quoteAmount: '7. Quote Amount',
                  paymentAmount: '8. Payment Amount',
                  paymentMode: '9. Payment Mode',
                  paymentStatus: '10. Payment Status',
                  paymentLink: '11. Payment Link',
                  quoteDate: '12. Quote Date',
                  expiredDate: '13. Expired Date',
                  owner: '14. Owner',
                  subject: '15. Subject',
                  subtotal: '16. Subtotal',
                  tax: '17. Tax',
                  discount: '18. Discount',
                  shipping: '19. Shipping',
                  total: '20. Total'
                }).map(([key, label]) => (
                  <th key={key} style={{ width: colWidths[key], minWidth: colWidths[key], padding: '12px 16px', borderBottom: '1px solid var(--border-color)', position: 'relative', userSelect: 'none' }}>
                    {label}
                    <div 
                      onMouseDown={(e) => handleMouseDown(e, key)}
                      style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: resizingCol === key ? 'var(--primary-color)' : 'transparent', zIndex: 1 }}
                      onMouseEnter={(e) => { if (!resizingCol) e.currentTarget.style.background = 'rgba(0,0,0,0.1)' }}
                      onMouseLeave={(e) => { if (resizingCol !== key) e.currentTarget.style.background = 'transparent' }}
                    />
                  </th>
                ))}
                <th style={{ width: colWidths.actions, minWidth: colWidths.actions, padding: '12px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', right: 0, background: '#f8fafc', zIndex: 11 }}>21. Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(quote => (
                <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ width: colWidths.quoteNumber, minWidth: colWidths.quoteNumber, padding: '12px 16px', fontWeight: 600, color: 'var(--primary-color)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.quoteNumber || quote.id}</td>
                  <td style={{ width: colWidths.customer, minWidth: colWidths.customer, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.customer || '-'}</td>
                  <td style={{ width: colWidths.leadName, minWidth: colWidths.leadName, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.leadName || '-'}</td>
                  <td style={{ width: colWidths.leadStage, minWidth: colWidths.leadStage, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.leadStage || '-'}</td>
                  <td style={{ width: colWidths.recentAction, minWidth: colWidths.recentAction, padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.recentAction || '-'}</td>
                  <td style={{ width: colWidths.status, minWidth: colWidths.status, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getStatusBadge(quote.status)}</td>
                  <td style={{ width: colWidths.quoteAmount, minWidth: colWidths.quoteAmount, padding: '12px 16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.quoteAmount)}</td>
                  <td style={{ width: colWidths.paymentAmount, minWidth: colWidths.paymentAmount, padding: '12px 16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.paymentAmount)}</td>
                  <td style={{ width: colWidths.paymentMode, minWidth: colWidths.paymentMode, padding: '12px 16px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.paymentMode || '-'}</td>
                  <td style={{ width: colWidths.paymentStatus, minWidth: colWidths.paymentStatus, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getPaymentStatusBadge(quote.paymentStatus)}</td>
                  <td style={{ width: colWidths.paymentLink, minWidth: colWidths.paymentLink, padding: '12px 16px', color: 'var(--primary-color)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.paymentLink ? <a href="#" style={{textDecoration:'none', color:'inherit'}}>View Link</a> : '-'}</td>
                  <td style={{ width: colWidths.quoteDate, minWidth: colWidths.quoteDate, padding: '12px 16px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.quoteDate}</td>
                  <td style={{ width: colWidths.expiredDate, minWidth: colWidths.expiredDate, padding: '12px 16px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.expiredDate}</td>
                  <td style={{ width: colWidths.owner, minWidth: colWidths.owner, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.owner || '-'}</td>
                  <td style={{ width: colWidths.subject, minWidth: colWidths.subject, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.subject || '-'}</td>
                  <td style={{ width: colWidths.subtotal, minWidth: colWidths.subtotal, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.subtotal)}</td>
                  <td style={{ width: colWidths.tax, minWidth: colWidths.tax, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.tax)}</td>
                  <td style={{ width: colWidths.discount, minWidth: colWidths.discount, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.discount)}</td>
                  <td style={{ width: colWidths.shipping, minWidth: colWidths.shipping, padding: '12px 16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.shipping)}</td>
                  <td style={{ width: colWidths.total, minWidth: colWidths.total, padding: '12px 16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatCurrency(quote.total)}</td>
                  <td style={{ width: colWidths.actions, minWidth: colWidths.actions, padding: '12px 16px', position: 'sticky', right: 0, background: 'white', borderLeft: '1px solid #f1f5f9' }}>
                    <ActionMenu 
                      isOpen={activeMenuId === quote.id}
                      onToggle={() => setActiveMenuId(activeMenuId === quote.id ? null : quote.id)}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        { label: 'View Quote', icon: <Eye size={16} />, onClick: () => handleAction('view', quote) },
                        { label: 'Edit Quote', icon: <Edit size={16} />, onClick: () => handleAction('edit', quote) },
                        { label: 'Send Quote', icon: <Send size={16} />, onClick: () => handleAction('send', quote) },
                        { label: 'Duplicate Quote', icon: <Copy size={16} />, onClick: () => handleAction('duplicate', quote) },
                        { label: 'Download PDF', icon: <Download size={16} />, onClick: () => handleAction('download', quote) },
                        { divider: true, label: '' },
                        { label: 'Mark as Sent', icon: <Send size={16} />, onClick: () => handleAction('send', quote) },
                        { label: 'Mark as Paid', icon: <CheckCircle size={16} />, onClick: () => handleAction('mark_paid', quote) },
                        { label: 'Cancel Quote', icon: <XCircle size={16} />, color: '#d97706', onClick: () => handleAction('cancel', quote) },
                        { label: 'Delete Quote', icon: <Trash2 size={16} />, color: '#dc2626', onClick: () => handleAction('delete', quote) }
                      ].filter(item => {
                        // Filter actions based on status
                        if (item.label === 'Mark as Sent' && quote.status !== 'Draft') return false;
                        if (item.label === 'Mark as Paid' && quote.status === 'Paid') return false;
                        if (item.label === 'Cancel Quote' && (quote.status === 'Cancelled' || quote.status === 'Paid')) return false;
                        return true;
                      })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {isSetupModalOpen && (
        <QuoteSetupModal 
          onClose={() => setIsSetupModalOpen(false)} 
          onProceed={() => { setIsSetupModalOpen(false); setIsCreateModalOpen(true); }} 
        />
      )}
      {isCreateModalOpen && (
        <CreateQuoteModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => alert('Quote created successfully!')} 
          businesses={quoteBusinesses}
        />
      )}
      {selectedQuote && (
        <QuoteDetailsModal 
          quote={selectedQuote} 
          onClose={() => setSelectedQuote(null)} 
          onSend={(q) => handleAction('send', q)} 
          onMarkPaid={(q) => handleAction('mark_paid', q)} 
        />
      )}

      {/* Advanced Permission Modal */}
      {isPermissionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }} onClick={() => setIsPermissionModalOpen(false)} />
          <div style={{ background: 'white', borderRadius: '12px', width: '400px', maxWidth: '90vw', position: 'relative', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>Advanced Permission</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', textAlign: 'center', lineHeight: 1.5 }}>
              Creating quotes requires the required quotation/business permission.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', textAlign: 'center', lineHeight: 1.5 }}>
              Please confirm that you have the required access to continue.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsPermissionModalOpen(false)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsPermissionModalOpen(false);
                  setIsWorkspaceDefaultsOpen(true);
                }}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Workspace Defaults Modal */}
      {isWorkspaceDefaultsOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,250,252,0.95)' }} />
          
          <div style={{ background: 'white', borderRadius: '16px', width: '900px', maxWidth: '90vw', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '32px 32px 24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quotation Workspace Defaults</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.5 }}>
                  Every quote is issued by one of the businesses below. Each business has its own quote numbering, GSTIN, addresses, bank details, signature and logo.
                </p>
              </div>
              <button onClick={() => setIsWorkspaceDefaultsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '8px' }}><XCircle size={24} /></button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignContent: 'flex-start', background: '#f8fafc' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {quoteBusinesses.map((business, index) => (
                  <div 
                    key={business.id}
                    onClick={() => business.isDefault ? setIsDefaultBusinessConfigOpen(true) : null}
                    style={{ width: '300px', background: 'white', borderRadius: '12px', border: business.isDefault ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', boxShadow: business.isDefault ? '0 4px 12px rgba(79, 70, 229, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: business.isDefault ? 'pointer' : 'default' }}
                  >
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{index === 0 && business.isDefault ? 'Default business' : business.name}</h4>
                        {business.isDefault && (
                          <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>DEFAULT</span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>Business name</div>
                          <div style={{ fontSize: '0.9rem', color: business.name === 'Not set' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{business.name}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>GSTIN</div>
                          <div style={{ fontSize: '0.9rem', color: business.gstin === 'Not set' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{business.gstin}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>Quote numbers</div>
                          <div style={{ fontSize: '0.9rem', color: business.quotePrefix === 'Not set' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>Prefix {business.quotePrefix.toLowerCase()}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>Currency</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{business.currency}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: '2px' }}>Bank</div>
                          <div style={{ fontSize: '0.9rem', color: business.bank === 'Not set' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{business.bank}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '16px 20px', background: '#fafafa', marginTop: 'auto' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Edit settings <span style={{ fontSize: '1.1rem' }}>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                onClick={() => setIsAddBusinessModalOpen(true)}
                style={{ width: '300px', minHeight: '350px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1', cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '24px', transition: 'all 0.2s', alignContent: 'flex-start' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                    <Plus size={18} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)' }}>Add another business</h4>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Issue quotes from a second company or branch with its own GSTIN, bank details, logo and quote numbering.
                </p>
              </div>

            </div>

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: 'white' }}>
              <button 
                onClick={() => {
                  setIsWorkspaceDefaultsOpen(false);
                  setIsSetupModalOpen(true);
                }}
                style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Proceed to Quote Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add a Business Modal */}
      {isAddBusinessModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setIsAddBusinessModalOpen(false)} />
          
          <div style={{ background: 'white', borderRadius: '12px', width: '500px', maxWidth: '90vw', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Add a business</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Quotes can be issued from this business with its own numbering, business details, bank details, signature and logo.
              </p>
            </div>
            
            <div style={{ padding: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Business label (shown in the "Quote from" selector)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Acme Exports FZE" 
                value={newBusinessLabel}
                onChange={(e) => setNewBusinessLabel(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none' }}
                autoFocus
              />
            </div>
            
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button 
                onClick={() => setIsAddBusinessModalOpen(false)}
                style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newBusinessLabel.trim()) {
                    setQuoteBusinesses(prev => [
                      ...prev, 
                      {
                        id: `biz-${Date.now()}`,
                        name: newBusinessLabel.trim(),
                        gstin: 'Not set',
                        quotePrefix: 'Not set',
                        currency: 'INR',
                        bank: 'Not set',
                        isDefault: false
                      }
                    ]);
                    setNewBusinessLabel('');
                    setIsAddBusinessModalOpen(false);
                  }
                }}
                disabled={!newBusinessLabel.trim()}
                style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: newBusinessLabel.trim() ? 'var(--primary-color)' : '#94a3b8', color: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: newBusinessLabel.trim() ? 'pointer' : 'not-allowed' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Business Config Modal */}
      <QuotationDefaultsWorkspaceModal 
        isOpen={isDefaultBusinessConfigOpen} 
        onClose={() => setIsDefaultBusinessConfigOpen(false)} 
        onProceedAfterSave={() => setIsDefaultBusinessConfigOpen(false)} 
      />

    </div>
  );
}
