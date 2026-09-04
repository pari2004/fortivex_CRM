'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Filter, LayoutTemplate, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

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
  'Lead Name', 'Phone Number', // Added these two for searchability since search needs name/phone
  'Lead Recording', 'AI Topic', 'Lead Source', 'Tags', 'Call With', 'Call Through', 
  'Team', 'Call Outcome', 'Note', 'Call Direction', 'Call Connected', 'Call Start Time', 
  'Duration', 'Total Duration', 'Last Updated', 'Interested In', 'Country', 
  'Current Company Type', 'Experience Level', 'What Are You Looking For', 'Career Goal', 
  'Enrollment Time', 'Technical Background'
];

const DEFAULT_VISIBLE_COLUMNS = [
  'Lead Name', 'Phone Number', 'Lead Source', 'Call Outcome', 'Duration', 'Call Start Time', 'Last Updated'
];

interface Props {
  title: string;
  onClose: () => void;
  dashboardData?: any;
  onLeadClick?: (leadName: string) => void;
}

export function OverallActivitiesDetailsModal({ title, onClose, dashboardData, onLeadClick }: Props) {
  const data = useMemo(() => {
    if (!dashboardData) return [];
    
    // We map the KPI title strictly to the generated arrays in dashboardData
    switch(title) {
      case 'Call With Lead Logged':
      case 'Total Call Duration':
      case 'Call Outcome Logged':
        return dashboardData.callActivities || [];
      case 'Connected Calls Logged':
        return dashboardData.connectedActivities || [];
      case 'Outgoing Call Logged':
      case 'Outgoing Call Duration':
        return dashboardData.outgoingActivities || [];
      case 'Connected Outgoing':
        return dashboardData.connectedOutgoingActivities || [];
      case 'Incoming Call Logged':
      case 'Incoming Call Duration':
        return dashboardData.incomingActivities || [];
      case 'Connected Incoming':
        return dashboardData.connectedIncomingActivities || [];
      case 'Positive Call Outcome':
        return dashboardData.positiveOutcomeActivities || [];
      case 'Negative Call Outcome':
        return dashboardData.negativeOutcomeActivities || [];
      case 'Added a Note':
        return dashboardData.noteActivities || [];
      default:
        return dashboardData.allActivities || [];
    }
  }, [dashboardData, title]);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization & Views
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(DEFAULT_VISIBLE_COLUMNS));
  const [showCustomize, setShowCustomize] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Global Esc
  useGlobalEscape(!!showCustomize, () => setShowCustomize(false));
  useGlobalEscape(!!filterOpen, () => setFilterOpen(false));
  useGlobalEscape(!showCustomize && !filterOpen, onClose);

  // Load saved view from localStorage (Mock implementation)
  useEffect(() => {
    const saved = localStorage.getItem(`crm_view_activity_${title}`);
    if (saved) {
      try {
        const { cols, filter } = JSON.parse(saved);
        if (cols) setVisibleColumns(new Set(cols));
        if (filter) setActiveFilter(filter);
      } catch (e) {}
    }
  }, [title]);

  const handleSaveView = () => {
    localStorage.setItem(`crm_view_activity_${title}`, JSON.stringify({
      cols: Array.from(visibleColumns),
      filter: activeFilter
    }));
    showToast('View configuration saved successfully');
  };

  const filteredData = useMemo(() => {
    let result = data;
    
    // Search (needs >= 3 chars)
    if (searchQuery.length >= 3) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d: any) => 
        String(d['Lead Name']).toLowerCase().includes(q) || 
        String(d['Phone Number']).toLowerCase().includes(q)
      );
    }
    
    // Filter
    if (activeFilter !== 'All') {
      result = result.filter((d: any) => d['Call Outcome'] === activeFilter || d['Lead Source'] === activeFilter);
    }
    
    return result;
  }, [data, searchQuery, activeFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(paginatedData.map((d: any) => d.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title} Details</h2>
            <div style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              {filteredData.length} Records Found
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)', position: 'relative', zIndex: 30 }}>
          <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', width: '280px', border: '1px solid var(--border-color)' }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: 'var(--text-primary)' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setFilterOpen(!filterOpen)} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
                <Filter size={16} /> Filter
              </button>
              {filterOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '250px', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                  <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Filter {title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select 
                      value={activeFilter}
                      onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="All">All Records</option>
                      <option value="Positive">Positive Outcome</option>
                      <option value="No Answer">No Answer</option>
                      <option value="Website">Source: Website</option>
                    </select>
                    <button onClick={() => { setActiveFilter('All'); setFilterOpen(false); setCurrentPage(1); }} className="secondary-btn" style={{ padding: '8px', borderRadius: '6px' }}>Clear Filter</button>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCustomize(!showCustomize)} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
                <LayoutTemplate size={16} /> Customize Columns
              </button>
              {showCustomize && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                  <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Visible Columns</h4>
                  {ALL_COLUMNS.map(col => (
                    <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.has(col)}
                        onChange={(e) => {
                          const newSet = new Set(visibleColumns);
                          if (e.target.checked) newSet.add(col);
                          else newSet.delete(col);
                          setVisibleColumns(newSet);
                        }}
                      />
                      <span style={{ fontSize: '0.85rem' }}>{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button className="primary-btn" onClick={handleSaveView} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}>
              <Save size={16} /> Save View
            </button>
          </div>
          
          {selectedIds.size > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--primary-color)', padding: '8px 16px', borderRadius: '8px', color: 'white' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedIds.size} Selected</span>
              <button onClick={() => { showToast('Actions triggered'); setSelectedIds(new Set()); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '6px 12px', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Clear Selection</button>
            </div>
          )}
        </div>

        {/* Scrollable Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${visibleColumns.size * 160}px` }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1, boxShadow: '0 1px 0 var(--glass-border)' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', width: '50px', position: 'sticky', left: 0, background: 'var(--bg-secondary)', zIndex: 2 }}>
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size === paginatedData.length && paginatedData.length > 0} />
                </th>
                {ALL_COLUMNS.filter(c => visibleColumns.has(c)).map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.size + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No records found for the current search/filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row: any) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.has(row.id) ? 'var(--hover-bg)' : 'transparent' }} className="hover-row">
                    <td style={{ padding: '12px 16px', position: 'sticky', left: 0, background: selectedIds.has(row.id) ? 'var(--hover-bg)' : 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)' }}>
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => handleSelectOne(row.id)} />
                    </td>
                    {ALL_COLUMNS.filter(c => visibleColumns.has(c)).map(col => (
                      <td key={col} style={{ padding: '12px 16px', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', borderBottom: '1px solid var(--glass-border)' }}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing {paginatedData.length} records on page {currentPage} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="secondary-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16}/> Previous
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="secondary-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
            >
              Next <ChevronRight size={16}/>
            </button>
          </div>
        </div>

      </motion.div>
    </div>,
    document.body
  );
}
