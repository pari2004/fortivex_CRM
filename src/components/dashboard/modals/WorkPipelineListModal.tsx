'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Filter, RefreshCw, LayoutTemplate, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { LeadWorkspaceModal } from './LeadWorkspaceModal';
import { LeadPreviewModal } from './LeadPreviewModal';

// --- Toast Utility ---
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '999999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

// --- Columns ---
const ALL_COLUMNS = [
  'Lead Name', 'Lead Owner', 'Lead Stage', 'Sub Stage / Closed', 'Closed On', 
  'Awaiting First Two Attempts', 'Last Worked', 'Started Working On', 'Speed To First', 
  'Next Follow-up', 'Became Opportunity', 'Tags', 'Product / Service', 'Recent Actions', 
  'Unanswered Calls', 'Unanswered After Calls', 'Missed Calls From', 'Last User', 'Remark', 
  'Next Open Task', 'Open Ticket', 'Last Closed Task', 'Deal Stage', 'Time Re-engaged', 
  'Lead Disposition', 'Last Disposition', 'Business', 'Mobile Number', 'Email', 'Address', 
  'State', 'City', 'Area', 'Country', 'Zip Code', 'Primary Type', 'Designation', 'Lead Type', 
  'Lead Priority', 'Lead Source', 'Source Level 2', 'Source Level 3', 'Source Level 4', 
  'Last Engagement', 'Last Payment', 'Last Payment Amount', 'Total Payment', 'Last Call Time', 
  'Last Call Duration', 'Last Call Direction', 'Last Call Outcome', 'Last Call Nature', 
  'Last Called By', 'Last Visit', 'Last Visit Outcome', 'Last Visit Nature', 'Last Visit By', 
  'Last Email', 'Last Email By', 'Last WhatsApp', 'Last WhatsApp By', 'Last WABA', 
  'Last Broadcast', 'Last Broadcast Reply', 'Last Note', 'Last Note By', 'Last Task Done', 
  'Last Task By', 'Lead Added By', 'Assigned Status', 'Assigned On', 'Last Repeat Inquiry', 
  'Created', 'Last Updated', 'Is Duplicate', 'Interested In', 'Current Company', 
  'Experience Level', 'What You Do', 'Career Goal', 'Enrollment Time', 'Technical Background'
];

const DEFAULT_VISIBLE_COLUMNS = [
  'Lead Name', 'Mobile Number', 'Lead Stage', 'Lead Owner', 'Next Follow-up', 'Lead Priority', 'Created'
];

export function WorkPipelineListModal({ title, count, filterState, dashboardData, onClose, filterFn }: { title: string, count: number, filterState?: any, dashboardData?: any, onClose: () => void, filterFn?: (l: any) => boolean }) {
  const { leads, tasks } = useCRM();
  
  const initialData = useMemo(() => {
    if (!dashboardData || count === 0) return [];
    
    // Create an array exactly matching the required count
    const pool = dashboardData.leads || leads || [];
    if (pool.length === 0) return [];
    
    const result = [];
    // We try to find relevant leads first, if not enough we just duplicate
    let relevantPool = [...pool];
    
    if (filterFn) {
      relevantPool = pool.filter(filterFn);
    } else if (title.includes('New Leads')) {
      relevantPool = dashboardData.newInquiryLeads || pool.filter((l: any) => l.status === 'New Lead');
    } else if (title.includes('Newly Assigned Leads')) {
      relevantPool = dashboardData.wpNewlyAssigned || pool.filter((l: any) => l.assignedTo && l.status !== 'New Lead');
    } else if (title.includes('Recent Closed Leads')) {
      relevantPool = dashboardData.closedLeads || pool.filter((l: any) => l.status === 'Lost' || l.status === 'Admitted');
    } else if (title.startsWith('Assigned to: ')) {
      const uName = title.replace('Assigned to: ', '').trim();
      relevantPool = pool.filter((l: any) => l.assignedTo === uName);
    }
    
    if (relevantPool.length === 0) relevantPool = pool;
    
    for (let i = 0; i < count; i++) {
        result.push({
            ...relevantPool[i % relevantPool.length],
            id: `wp-item-${i}-${Date.now()}` // Ensure unique keys for table rendering
        });
    }
    
    return result;
  }, [leads, title, filterState]);

  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(DEFAULT_VISIBLE_COLUMNS));
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Set<string>>(new Set(DEFAULT_VISIBLE_COLUMNS));
  const [showCustomize, setShowCustomize] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Lead Details
  const [viewLead, setViewLead] = useState<any | null>(null);
  const [fullViewLead, setFullViewLead] = useState<any | null>(null);

  // Close with ESC
  useGlobalEscape(!!viewLead, () => setViewLead(null));
  useGlobalEscape(!!showCustomize, () => setShowCustomize(false));
  useGlobalEscape(!!filterOpen, () => setFilterOpen(false));

  useEffect(() => {
    const savedCols = localStorage.getItem('fortivex_wp_columns');
    if (savedCols) {
      try {
        const parsed = JSON.parse(savedCols);
        setVisibleColumns(new Set(parsed));
        setTempVisibleColumns(new Set(parsed));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSaveColumns = () => {
    setVisibleColumns(tempVisibleColumns);
    localStorage.setItem('fortivex_wp_columns', JSON.stringify(Array.from(tempVisibleColumns)));
    setShowCustomize(false);
    showToast('Columns saved successfully');
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((d: any) => 
      String(d.name || '').toLowerCase().includes(q) || 
      String(d.phone || d.mobile || '').toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredData.map((d: any) => d.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const renderCell = (col: string, lead: any) => {
    if (col === 'Lead Name') return lead.name;
    if (col === 'Mobile Number') return lead.phone || lead.mobile;
    if (col === 'Email') return lead.email;
    if (col === 'Lead Stage') return lead.status;
    if (col === 'Lead Owner') return lead.counselor || lead.assignedTo;
    if (col === 'Next Follow-up') return lead.nextFollowUp || '-';
    if (col === 'Lead Priority') return lead.priority || '-';
    if (col === 'Created') return lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-';
    
    // Map dynamically or return placeholder
    const mapped = lead[col.replace(/\s/g, '')];
    if (mapped !== undefined) return mapped;
    return '-';
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'var(--bg-primary)', width: '95vw', height: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--glass-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h2>
            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              Showing Filtered Leads - {filteredData.length}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', width: '300px', border: '1px solid var(--border-color)' }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input 
                type="text" 
                placeholder="Search name or phone number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: 'var(--text-primary)' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setFilterOpen(!filterOpen)} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
                <Filter size={16} /> Filter
              </button>
              {filterOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>
                  <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Filters</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      <option>All Stages</option>
                      <option>New Lead</option>
                      <option>Working</option>
                    </select>
                    <button onClick={() => setFilterOpen(false)} className="primary-btn" style={{ padding: '8px', borderRadius: '6px' }}>Apply Filters</button>
                  </div>
                </div>
              )}
            </div>

            <button className="secondary-btn" onClick={() => { showToast('Data refreshed'); setData([...data]); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowCustomize(!showCustomize); setTempVisibleColumns(new Set(visibleColumns)); }} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
                <LayoutTemplate size={16} /> Customize Columns
              </button>
              {showCustomize && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                     <h4 style={{ fontWeight: 'bold' }}>Visible Columns</h4>
                     <button onClick={handleSaveColumns} className="primary-btn" style={{ padding: '4px 12px', fontSize: '12px' }}><Save size={12} style={{ marginRight: '4px' }}/> Save</button>
                  </div>
                  {ALL_COLUMNS.map(col => (
                    <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={tempVisibleColumns.has(col)}
                        onChange={(e) => {
                          const newSet = new Set(tempVisibleColumns);
                          if (e.target.checked) newSet.add(col);
                          else newSet.delete(col);
                          setTempVisibleColumns(newSet);
                        }}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <table style={{ width: 'max-content', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 2, minWidth: '50px' }}>
                  <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === filteredData.length} onChange={handleSelectAll} />
                </th>
                {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map(col => (
                  <th key={col} style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 'bold', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 2, minWidth: '150px' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d: any) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }} className="hover-bg-secondary">
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <input type="checkbox" checked={selectedIds.has(d.id)} onChange={() => handleSelectOne(d.id)} onClick={e => e.stopPropagation()} />
                  </td>
                  {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx) => (
                    <td key={col} style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                      {idx === 0 ? (
                        <div 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#8b5cf6', fontWeight: 500 }}
                          onClick={() => setFullViewLead(d)}
                        >
                          <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4f46e5' }}>
                            {String(d.name).charAt(0) || 'L'}
                          </div>
                          {renderCell(col, d)}
                        </div>
                      ) : (
                        renderCell(col, d)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.size + 1} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {viewLead && (
            <LeadPreviewModal isOpen={!!viewLead} onClose={() => setViewLead(null)} lead={viewLead} onViewLead={(l) => { setViewLead(null); setFullViewLead(l); }} />
        )}
        {fullViewLead && (
            <LeadWorkspaceModal isOpen={!!fullViewLead} onClose={() => setFullViewLead(null)} lead={fullViewLead} />
        )}
      </motion.div>
    </div>,
    document.body
  );
}
