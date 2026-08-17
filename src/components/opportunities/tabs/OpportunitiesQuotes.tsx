'use client';

import React, { useState } from 'react';
import { useCRM, Quote } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { FileText, Clock, CheckCircle, Send, XCircle, Copy, Printer, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesQuotes() {
  const { quotes, updateQuote, addQuote } = useCRM();
  const [data, setData] = useState<Quote[]>(quotes);
  const [filteredData, setFilteredData] = useState<Quote[]>(quotes);
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 15;
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // KPIs
  const totalQuotes = data.length;
  const draftQuotes = data.filter(q => q.status === 'Draft').length;
  const sentQuotes = data.filter(q => q.status === 'Sent').length;
  const approvedQuotes = data.filter(q => q.status === 'Approved').length;
  const expiredQuotes = data.filter(q => q.status === 'Expired').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAction = (action: string, quote: Quote) => {
    setActiveMenuId(null);
    if (action === 'delete') {
      if(confirm('Delete quote?')) {
        setData(d => d.filter(x => x.id !== quote.id));
        setFilteredData(d => d.filter(x => x.id !== quote.id));
      }
    } else if (action === 'duplicate') {
      addQuote({
        ...quote,
        status: 'Draft'
      });
    } else if (action === 'send') {
      const updated = { ...quote, status: 'Sent' as any };
      updateQuote(updated);
      setData(d => d.map(x => x.id === quote.id ? updated : x));
      setFilteredData(d => d.map(x => x.id === quote.id ? updated : x));
    }
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px' }}>
      
      {/* KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Quotes', value: totalQuotes, icon: <FileText size={20}/>, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Draft', value: draftQuotes, icon: <Edit size={20}/>, color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
          { label: 'Sent', value: sentQuotes, icon: <Send size={20}/>, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
          { label: 'Approved', value: approvedQuotes, icon: <CheckCircle size={20}/>, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Expired', value: expiredQuotes, icon: <XCircle size={20}/>, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        ].map((kpi, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
            <div style={{ padding: '12px', background: kpi.bg, color: kpi.color, borderRadius: '12px' }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <DataToolbar 
        data={data} 
        onFilteredDataChange={(f) => { setFilteredData(f); setPage(1); }} 
        searchKeys={['id', 'student', 'program']}
        searchPlaceholder="Search quotes..."
        exportFilename="Quotes"
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Sent', 'Approved', 'Expired'] },
        ]}
        selectedItems={[]}
        exportMapping={[
          { key: 'id', label: 'Quote ID' },
          { key: 'student', label: 'Student' },
          { key: 'program', label: 'Program' },
          { key: 'finalAmount', label: 'Final Amount' },
          { key: 'status', label: 'Status' }
        ]}
      />

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Quote ID</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student & Program</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Financials</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Valid Until</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(quote => (
              <tr key={quote.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary-color)' }}>{quote.id}</td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{quote.student}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{quote.program}</div>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ fontWeight: 600 }}>{formatCurrency(quote.finalAmount)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Fee: {formatCurrency(quote.feeAmount)}</div>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--text-tertiary)" />
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === quote.id}
                    onToggle={() => setActiveMenuId(activeMenuId === quote.id ? null : quote.id)}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'View Details', icon: <Eye size={16} />, onClick: () => handleAction('view', quote) },
                      { label: 'Edit Quote', icon: <Edit size={16} />, onClick: () => handleAction('edit', quote) },
                      { label: 'Send Quote', icon: <Send size={16} />, onClick: () => handleAction('send', quote) },
                      { label: 'Download PDF', icon: <Download size={16} />, onClick: () => handleAction('download', quote) },
                      { label: 'Print', icon: <Printer size={16} />, onClick: () => window.print() },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => handleAction('duplicate', quote) },
                      { divider: true, label: '' },
                      { label: 'Delete', icon: <Trash2 size={16} />, color: '#dc2626', onClick: () => handleAction('delete', quote) }
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
