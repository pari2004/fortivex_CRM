'use client';

import React, { useState } from 'react';
import { useCRM, Deal } from '@/contexts/CRMContext';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Target, TrendingUp, CheckCircle, XCircle, DollarSign, Eye, Edit, UserCheck, Trash2, Copy, FileText, Download, Printer } from 'lucide-react';
import { kpiDemoData } from '@/lib/data/mockData';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesDeals() {
  const { deals, updateDeal, addDeal } = useCRM();
  const [data, setData] = useState<Deal[]>(deals);
  const [filteredData, setFilteredData] = useState<Deal[]>(deals);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleFilteredDataChange = (filtered: Deal[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleAction = (action: string, deal: Deal) => {
    setActiveMenuId(null);
    if (action === 'delete') {
      if(confirm(`Are you sure you want to delete deal ${deal.id}?`)) {
        setData(d => d.filter(x => x.id !== deal.id));
        setFilteredData(d => d.filter(x => x.id !== deal.id));
      }
    } else if (action === 'won') {
      const updated = { ...deal, status: 'Won', stage: 'Closed Won' };
      updateDeal(updated);
      setData(d => d.map(x => x.id === deal.id ? updated : x));
      setFilteredData(d => d.map(x => x.id === deal.id ? updated : x));
    } else if (action === 'lost') {
      const updated = { ...deal, status: 'Lost', stage: 'Closed Lost' };
      updateDeal(updated);
      setData(d => d.map(x => x.id === deal.id ? updated : x));
      setFilteredData(d => d.map(x => x.id === deal.id ? updated : x));
    } else if (action === 'duplicate') {
      addDeal({
        ...deal,
        leadName: `${deal.leadName} (Copy)`,
        stage: 'Discovery',
        status: 'Open'
      });
    }
  };

  // KPIs
  const totalDeals = data.length;
  const openDeals = data.filter(d => d.status === 'Open').length;
  const wonDeals = data.filter(d => d.status === 'Won').length;
  const lostDeals = data.filter(d => d.status === 'Lost').length;
  const revenuePipeline = data.filter(d => d.status === 'Open').reduce((acc, curr) => acc + curr.revenue, 0);
  const avgDealSize = totalDeals > 0 ? data.reduce((acc, curr) => acc + curr.revenue, 0) / totalDeals : 0;
  const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
  const closingThisMonth = data.filter(d => {
    const closeDate = new Date(d.closeDate);
    const now = new Date();
    return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
  }).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Negotiation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed Won': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed Lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px' }}>
      
      {/* KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Deals', value: totalDeals, icon: <Target size={20}/>, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Open Deals', value: openDeals, icon: <TrendingUp size={20}/>, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Won Deals', value: wonDeals, icon: <CheckCircle size={20}/>, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Lost Deals', value: lostDeals, icon: <XCircle size={20}/>, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Revenue Pipeline', value: formatCurrency(revenuePipeline), icon: <DollarSign size={20}/>, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: <DollarSign size={20}/>, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
          { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, icon: <CheckCircle size={20}/>, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Closing This Month', value: closingThisMonth, icon: <Target size={20}/>, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
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

      {/* Toolbar */}
      <DataToolbar 
        data={data} 
        onFilteredDataChange={handleFilteredDataChange} 
        searchKeys={['id', 'leadName', 'dealOwner', 'program']}
        searchPlaceholder="Search deals by ID, student, owner..."
        exportFilename="Deals_Dashboard"
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Won', 'Lost'] },
          { key: 'stage', label: 'Stage', type: 'select', options: ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] }
        ]}
        selectedItems={currentData.filter(d => selectedRows.has(d.id))}
        exportMapping={[
          { key: 'id', label: 'Deal ID' },
          { key: 'leadName', label: 'Student Name' },
          { key: 'program', label: 'Program' },
          { key: 'revenue', label: 'Value' },
          { key: 'stage', label: 'Stage' },
          { key: 'status', label: 'Status' }
        ]}
      />

      {/* Grid */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Deal ID</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student & Program</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Value</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Owner</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Stage</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Expected Close</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(deal => (
              <tr key={deal.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary-color)' }}>{deal.id}</td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{deal.leadName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{deal.program}</div>
                </td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{formatCurrency(deal.revenue)}</td>
                <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>{deal.dealOwner}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStageColor(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>{new Date(deal.closeDate).toLocaleDateString()}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === deal.id}
                    onToggle={() => setActiveMenuId(activeMenuId === deal.id ? null : deal.id)}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'View Details', icon: <Eye size={16} />, onClick: () => handleAction('view', deal) },
                      { label: 'Edit Deal', icon: <Edit size={16} />, onClick: () => handleAction('edit', deal) },
                      { label: 'Mark as Won', icon: <CheckCircle size={16} />, color: 'var(--status-admitted)', onClick: () => handleAction('won', deal) },
                      { label: 'Mark as Lost', icon: <XCircle size={16} />, color: 'var(--status-rejected)', onClick: () => handleAction('lost', deal) },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => handleAction('duplicate', deal) },
                      { divider: true, label: '' },
                      { label: 'Delete', icon: <Trash2 size={16} />, color: 'var(--status-rejected)', onClick: () => handleAction('delete', deal) }
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
