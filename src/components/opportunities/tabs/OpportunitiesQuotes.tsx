'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM, Quote } from '@/contexts/CRMContext';
import { ActionMenu } from '@/components/common/ActionMenu';
import { FileText, Send, XCircle, Copy, Printer, Download, Eye, Edit, Trash2, Search, ChevronDown, CheckCircle, Plus } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { AnimatePresence, motion } from 'framer-motion';
import { QuoteSetupModal } from '../modals/QuoteSetupModal';
import { CreateQuoteModal } from '../modals/CreateQuoteModal';
import { QuoteDetailsModal } from '../modals/QuoteDetailsModal';


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
          onClick={() => setIsSetupModalOpen(true)}
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
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>1. Quote</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>2. Customer</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>3. Lead Name</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>4. Lead Stage</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>5. Recent Action</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>6. Status</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>7. Quote Amount</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>8. Payment Amount</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>9. Payment Mode</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>10. Payment Status</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>11. Payment Link</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>12. Quote Date</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>13. Expired Date</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>14. Owner</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>15. Subject</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>16. Subtotal</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>17. Tax</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>18. Discount</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>19. Shipping</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>20. Total</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', right: 0, background: '#f8fafc', zIndex: 11 }}>21. Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(quote => (
                <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--primary-color)' }}>{quote.quoteNumber || quote.id}</td>
                  <td style={{ padding: '12px 16px' }}>{quote.customer || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{quote.leadName || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{quote.leadStage || '-'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{quote.recentAction || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{getStatusBadge(quote.status)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(quote.quoteAmount)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(quote.paymentAmount)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>{quote.paymentMode || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{getPaymentStatusBadge(quote.paymentStatus)}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--primary-color)' }}>{quote.paymentLink ? <a href="#" style={{textDecoration:'none', color:'inherit'}}>View Link</a> : '-'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>{quote.quoteDate}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-tertiary)' }}>{quote.expiredDate}</td>
                  <td style={{ padding: '12px 16px' }}>{quote.owner || '-'}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quote.subject || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{formatCurrency(quote.subtotal)}</td>
                  <td style={{ padding: '12px 16px' }}>{formatCurrency(quote.tax)}</td>
                  <td style={{ padding: '12px 16px' }}>{formatCurrency(quote.discount)}</td>
                  <td style={{ padding: '12px 16px' }}>{formatCurrency(quote.shipping)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(quote.total)}</td>
                  <td style={{ padding: '12px 16px', position: 'sticky', right: 0, background: 'white', borderLeft: '1px solid #f1f5f9' }}>
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
    </div>
  );
}
