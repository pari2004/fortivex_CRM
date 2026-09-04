'use client';

import React, { useState } from 'react';
import { useCRM, Deal } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Edit, Trash2, Eye, Copy } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

export function OpportunitiesDealsTabular() {
  const { deals, updateDeal, addDeal } = useCRM();
  const [filteredData, setFilteredData] = useState<Deal[]>(deals);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleAction = (action: string, deal: Deal) => {
    setActiveMenuId(null);
    if (action === 'delete') {
      if(confirm(`Are you sure you want to delete deal ${deal.id}?`)) {
        setFilteredData(d => d.filter(x => x.id !== deal.id));
      }
    } else if (action === 'duplicate') {
      addDeal({
        ...deal,
        leadName: `${deal.leadName} (Copy)`,
        stage: 'Discovery',
        status: 'Open'
      });
    }
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', padding: '24px' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Deals Tabular View</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Spreadsheet-style view for bulk operations and exporting.</p>
      </div>

      <DataToolbar 
        data={deals} 
        onFilteredDataChange={(f) => { setFilteredData(f); setPage(1); }} 
        searchKeys={['id', 'leadName', 'dealOwner', 'program']}
        searchPlaceholder="Search deals..."
        exportFilename="Deals_Tabular_Export"
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Won', 'Lost'] },
          { key: 'stage', label: 'Stage', type: 'select', options: ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] }
        ]}
        selectedItems={currentData.filter(d => selectedRows.has(d.id))}
        exportMapping={[
          { key: 'id', label: 'Deal ID' },
          { key: 'leadName', label: 'Student' },
          { key: 'program', label: 'Program' },
          { key: 'revenue', label: 'Deal Value' },
          { key: 'stage', label: 'Stage' },
          { key: 'dealOwner', label: 'Owner' },
          { key: 'closeDate', label: 'Expected Close' },
          { key: 'status', label: 'Status' }
        ]}
      />

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Deal ID</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Program</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Deal Value</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Stage</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Owner</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Expected Close</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(deal => (
              <tr key={deal.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>{deal.id}</td>
                <td style={{ padding: '10px 16px' }}>{deal.leadName}</td>
                <td style={{ padding: '10px 16px' }}>{deal.program}</td>
                <td style={{ padding: '10px 16px', fontWeight: 600 }}>{formatCurrency(deal.revenue)}</td>
                <td style={{ padding: '10px 16px' }}>{deal.stage}</td>
                <td style={{ padding: '10px 16px' }}>{deal.dealOwner}</td>
                <td style={{ padding: '10px 16px' }}>{new Date(deal.closeDate).toLocaleDateString()}</td>
                <td style={{ padding: '10px 16px' }}>{deal.status}</td>
                <td style={{ padding: '10px 16px', position: 'relative' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === deal.id}
                    onToggle={() => setActiveMenuId(activeMenuId === deal.id ? null : deal.id)}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'View Details', icon: <Eye size={16} />, onClick: () => handleAction('view', deal) },
                      { label: 'Edit', icon: <Edit size={16} />, onClick: () => handleAction('edit', deal) },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => handleAction('duplicate', deal) },
                      { label: 'Delete', icon: <Trash2 size={16} />, color: '#dc2626', onClick: () => handleAction('delete', deal) },
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
