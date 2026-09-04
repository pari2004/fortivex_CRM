import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Filter, RefreshCw, LayoutTemplate, Save, User, Flag, Calendar, Phone, Star, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical, MessageCircle, Mic, Eye, MoreHorizontal, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { LeadWorkspaceModal } from './LeadWorkspaceModal';
import { LeadPreviewModal } from './LeadPreviewModal';
import { AssignLeadsModal } from './AssignLeadsModal';
import { BulkTagPopover } from './BulkTagPopover';

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

export function WorkPipelineListModal({ title, count, filterState, dashboardData, onClose, filterFn, isInline, hiddenColumns = [] }: { title: string, count: number, filterState?: any, dashboardData?: any, onClose: () => void, filterFn?: (l: any) => boolean, isInline?: boolean, hiddenColumns?: string[] }) {
  const { leads, tasks, updateLead, deleteLead, leadTagsList, updateLeadTagsList } = useCRM();
  
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  
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
      relevantPool = pool.filter((l: any) => l.assignedTo === uName || l.owner === uName);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Customization
  const initialCols = DEFAULT_VISIBLE_COLUMNS.filter(c => !hiddenColumns.includes(c));
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(initialCols));
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Set<string>>(new Set(initialCols));
  const [showCustomize, setShowCustomize] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [inlineAction, setInlineAction] = useState<'tag' | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  
  // Lead Details
  const [viewLead, setViewLead] = useState<any | null>(null);
  const [fullViewLead, setFullViewLead] = useState<any | null>(null);

  // Close with ESC
  useGlobalEscape(!!viewLead, () => setViewLead(null));
  useGlobalEscape(!!showCustomize, () => setShowCustomize(false));
  useGlobalEscape(!!filterOpen, () => setFilterOpen(false));

  useEffect(() => {
    if (isInline) return; // Don't load saved columns for inline instances
    const savedCols = localStorage.getItem('fortivex_wp_columns');
    if (savedCols) {
      try {
        const parsed = JSON.parse(savedCols).filter((c: string) => !hiddenColumns.includes(c));
        setVisibleColumns(new Set(parsed));
        setTempVisibleColumns(new Set(parsed));
      } catch (e) {
        // ignore
      }
    }
  }, [isInline, hiddenColumns]);

  const handleSaveColumns = () => {
    setVisibleColumns(tempVisibleColumns);
    if (!isInline) {
      localStorage.setItem('fortivex_wp_columns', JSON.stringify(Array.from(tempVisibleColumns)));
    }
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
    if (col === 'Lead Stage') return (
      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} />
        {lead.status}
      </span>
    );
    if (col === 'Lead Owner') return lead.counselor || lead.assignedTo || lead.owner || '-';
    if (col === 'Next Follow-up') return lead.nextFollowUp || <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
    if (col === 'Lead Priority') {
      const p = lead.priority || '-';
      if (p === '-') return <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
      const bg = p === 'High' ? '#fee2e2' : p === 'Medium' ? '#fef3c7' : '#f3f4f6';
      const color = p === 'High' ? '#991b1b' : p === 'Medium' ? '#92400e' : '#374151';
      return <span style={{ background: bg, color, padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>{p}</span>;
    }
    if (col === 'Created') return lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
    
    const mapped = lead[col.replace(/\s/g, '')];
    if (mapped !== undefined) return mapped;
    return <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
  };

  const content = (
      <motion.div 
        initial={isInline ? undefined : { opacity: 0, scale: 0.95 }} 
        animate={isInline ? undefined : { opacity: 1, scale: 1 }} 
        exit={isInline ? undefined : { opacity: 0, scale: 0.95 }}
        style={{ 
          background: 'white', 
          width: isInline ? '100%' : '95vw', 
          height: isInline ? '100%' : '90vh', 
          borderRadius: isInline ? '0' : '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          boxShadow: isInline ? 'none' : 'var(--shadow-xl)', 
          border: isInline ? 'none' : '1px solid var(--glass-border)',
          flex: isInline ? 1 : 'unset'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{title}</h2>
            <div style={{ background: '#4338ca', color: 'white', padding: '4px 16px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              Showing Filtered Leads - {filteredData.length}
            </div>
          </div>
          {!isInline && (
            <button onClick={onClose} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <X size={20} />
            </button>
          )}
        </div>
        {/* Toolbar */}
        {selectedIds.size > 0 ? (
          <div style={{ padding: '8px 24px 16px 24px', display: 'flex', gap: '12px', alignItems: 'center', background: '#eef2ff', position: 'relative', zIndex: 100 }}>
            <span style={{ fontWeight: 600, color: '#4338ca', marginRight: '8px' }}>{selectedIds.size} selected</span>
            <button onClick={() => setShowAssignModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #c7d2fe', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', color: '#3730a3' }}><User size={14}/> Assign</button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setInlineAction(inlineAction === 'tag' ? null : 'tag')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #c7d2fe', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', color: '#3730a3' }}><Flag size={14}/> Tag</button>
              {inlineAction === 'tag' && (
                <BulkTagPopover 
                  onClose={() => setInlineAction(null)} 
                  leadTagsList={leadTagsList}
                  updateLeadTagsList={updateLeadTagsList}
                  onSelect={(tagName: string) => {
                     const arr = Array.from(selectedIds);
                     setData((prev: any) => prev.map((item:any) => {
                       if(selectedIds.has(item.id)) {
                         return {...item, tags: [...(item.tags||[]).filter((t:string)=>t!==tagName), tagName]};
                       }
                       return item;
                     }));
                     showToast(`Successfully added tag to ${arr.length} leads.`);
                     setInlineAction(null);
                     setSelectedIds(new Set());
                  }} 
                />
              )}
            </div>
            <button onClick={() => {
              if (window.confirm(`Delete ${selectedIds.size} selected leads?`)) {
                deleteLead(Array.from(selectedIds));
                setData((prev: any) => prev.filter((l:any) => !selectedIds.has(l.id)));
                setSelectedIds(new Set());
                showToast(`Deleted ${selectedIds.size} leads.`);
              }
            }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #fca5a5', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>
              Delete
            </button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setBulkMenuOpen(!bulkMenuOpen); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}>
                <MoreVertical size={18} color="#4b5563" />
              </button>
              {bulkMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', zIndex: 10000, padding: '8px' }}>
                  <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => { showToast('Add to List clicked'); setBulkMenuOpen(false); }}>Add to List</div>
                  <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => { showToast('Export clicked'); setBulkMenuOpen(false); }}>Export</div>
                  <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem' }} onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => { showToast('Create Task clicked'); setBulkMenuOpen(false); }}>Create Task</div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }}></div>
                  <div style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem', color: '#ef4444' }} onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => {
                    if (window.confirm(`Delete ${selectedIds.size} selected leads?`)) {
                      deleteLead(Array.from(selectedIds));
                      setData((prev: any) => prev.filter((l:any) => !selectedIds.has(l.id)));
                      setSelectedIds(new Set());
                      showToast(`Deleted ${selectedIds.size} leads.`);
                    }
                    setBulkMenuOpen(false);
                  }}>Delete Leads</div>
                </div>
              )}
            </div>
            
            <div style={{ flex: 1 }}></div>
            
            <button onClick={() => setSelectedIds(new Set())} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}><X size={14}/> Close</button>
          </div>
        ) : (
          <div style={{ padding: '8px 24px 16px 24px', display: 'flex', gap: '12px', alignItems: 'center', background: 'white', position: 'relative', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '8px', width: '320px', border: '1px solid #e5e7eb' }}>
              <Search size={18} color="#9ca3af" />
              <input 
                type="text" 
                placeholder="Search name or phone number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: '#111827', fontSize: '0.9rem' }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setFilterOpen(!filterOpen)} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
                <Filter size={16} color="#6b7280" /> Filter
              </button>
              {filterOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', zIndex: 9999, boxShadow: 'var(--shadow-lg)' }}>
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

            <button onClick={() => { showToast('Data refreshed'); setData([...data]); }} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
              <RefreshCw size={16} color="#6b7280" /> Refresh
            </button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowCustomize(!showCustomize); setTempVisibleColumns(new Set(visibleColumns)); }} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
                <LayoutTemplate size={16} color="#6b7280" /> Customize Columns
              </button>
              {showCustomize && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 9999, boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                     <h4 style={{ fontWeight: 'bold' }}>Visible Columns</h4>
                     <button onClick={handleSaveColumns} className="primary-btn" style={{ padding: '4px 12px', fontSize: '12px' }}><Save size={12} style={{ marginRight: '4px' }}/> Save</button>
                  </div>
                  {ALL_COLUMNS.filter(c => !hiddenColumns.includes(c)).map(col => (
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
        )}

        {/* Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px', background: 'white', position: 'relative', zIndex: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 2, width: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === filteredData.length} onChange={handleSelectAll} style={{ cursor: 'pointer', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #4338ca' }} />
                    </div>
                  </th>
                  {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => {
                    let icon = null;
                    if (col === 'Lead Name') icon = <User size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Owner') icon = <User size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Stage') icon = <Flag size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Next Follow-up') icon = <Calendar size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Mobile Number') icon = <Phone size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Priority') icon = <Star size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Created') icon = <Calendar size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;

                    return (
                      <th key={col} style={{ padding: 0, textAlign: 'left', fontWeight: 600, color: '#4338ca', background: '#f8fafc', borderRight: idx === arr.length - 1 ? 'none' : '1px solid #f3f4f6', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 2 }}>
                        <div style={{ padding: '14px 24px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', resize: 'horizontal', overflow: 'hidden', minWidth: '100px', maxWidth: '100%', boxSizing: 'border-box' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {icon}
                            {col}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px', opacity: 0.3 }}>
                            <ChevronUp size={10} style={{ marginBottom: '-2px' }} />
                            <ChevronDown size={10} style={{ marginTop: '-2px' }} />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice((Math.min(currentPage, Math.ceil(filteredData.length / rowsPerPage) || 1) - 1) * rowsPerPage, (Math.min(currentPage, Math.ceil(filteredData.length / rowsPerPage) || 1)) * rowsPerPage).map((d: any, rowIdx: number) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', background: 'white' }} 
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; setHoveredRowId(d.id); }} 
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; setHoveredRowId(null); }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #f3f4f6' }}>
                      <input type="checkbox" checked={selectedIds.has(d.id)} onChange={() => handleSelectOne(d.id)} onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    </td>
                    {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => (
                      <td key={col} style={{ padding: '12px 24px', whiteSpace: 'nowrap', borderRight: idx === arr.length - 1 ? 'none' : '1px solid #f3f4f6', color: '#374151', position: col === 'Lead Name' || col === 'Lead Owner' ? 'relative' : 'static' }}>
                        {col === 'Lead Name' ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#4338ca', fontWeight: 500, cursor: 'pointer' }}
                              onClick={() => { setViewLead(null); setFullViewLead(d); }}
                            >
                              <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4338ca', fontWeight: 'bold' }}>
                                {String(d.name).charAt(0).toUpperCase() || 'M'}
                              </div>
                              {d.name}
                            </div>
                            
                            {hoveredRowId === d.id && (
                              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '4px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', zIndex: 10 }}>
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Calling ${d.name}...`); }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="Call">
                                  <Phone size={14} style={{ fill: '#3b82f6' }} />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Messaging ${d.name}...`); }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="Message">
                                  <MessageCircle size={14} style={{ fill: '#3b82f6' }} />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Muted ${d.name}`); }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="Mute">
                                  <Mic size={14} style={{ fill: '#ef4444' }} />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setViewLead(d); }} style={{ background: '#f3e8ff', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="View details">
                                  <Eye size={14} />
                                </button>
                                <div style={{ width: '1px', height: '16px', background: '#e5e7eb', margin: '0 2px' }} />
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`More options...`); }} style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="More">
                                  <MoreHorizontal size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : col === 'Lead Owner' ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.counselor || d.assignedTo || 'Owner')}&background=random&size=24`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                              </div>
                              <span style={{ fontWeight: 500 }}>{d.counselor || d.assignedTo || 'Owner'}</span>
                            </div>
                            
                            {hoveredRowId === d.id && (
                              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '4px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', zIndex: 10 }}>
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Calling ${d.counselor || d.assignedTo || 'Owner'}...`); }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="Call">
                                  <Phone size={14} style={{ fill: '#3b82f6' }} />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Messaging ${d.counselor || d.assignedTo || 'Owner'}...`); }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'} title="Message">
                                  <MessageCircle size={14} style={{ fill: '#3b82f6' }} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : col === 'Lead Stage' ? (
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                            {d.status || 'New Lead'}
                          </span>
                        ) : col === 'Lead Priority' ? (
                          <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {d.priority || '--'}
                          </span>
                        ) : col === 'Created' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                            <span style={{ color: '#111827' }}>10/05/2024</span>
                            <span style={{ color: '#6b7280' }}>10:30 AM</span>
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
                    <td colSpan={visibleColumns.size + 1} style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination Footer */}
            <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', background: 'white' }}>
              <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                {(() => {
                  const totalPgs = Math.ceil(filteredData.length / rowsPerPage) || 1;
                  const safeCurrent = Math.min(currentPage, totalPgs);
                  const startIdx = (safeCurrent - 1) * rowsPerPage + 1;
                  const endIdx = Math.min(safeCurrent * rowsPerPage, filteredData.length);
                  return `Showing ${filteredData.length === 0 ? 0 : startIdx} to ${endIdx} of ${filteredData.length} leads`;
                })()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(() => {
                  const totalPgs = Math.ceil(filteredData.length / rowsPerPage) || 1;
                  const safeCurrent = Math.min(currentPage, totalPgs);
                  
                  const getPageNumbers = () => {
                    const pages = [];
                    let start = Math.max(1, safeCurrent - 1);
                    let end = Math.min(totalPgs, safeCurrent + 1);
                    if (start === 1) end = Math.min(3, totalPgs);
                    if (end === totalPgs) start = Math.max(1, totalPgs - 2);
                    for (let i = start; i <= end; i++) pages.push(i);
                    return pages;
                  };

                  return (
                    <>
                      <button onClick={() => setCurrentPage(1)} disabled={safeCurrent === 1} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safeCurrent === 1 ? '#d1d5db' : '#6b7280', cursor: safeCurrent === 1 ? 'not-allowed' : 'pointer' }}><ChevronsLeft size={16} /></button>
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrent === 1} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safeCurrent === 1 ? '#d1d5db' : '#6b7280', cursor: safeCurrent === 1 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={16} /></button>
                      
                      {getPageNumbers().map(p => (
                        <button 
                          key={p} 
                          onClick={() => setCurrentPage(p)}
                          style={{ 
                            background: p === safeCurrent ? '#4338ca' : 'white', 
                            border: `1px solid ${p === safeCurrent ? '#4338ca' : '#e5e7eb'}`, 
                            width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: p === safeCurrent ? 'white' : '#4b5563', 
                            fontWeight: p === safeCurrent ? 600 : 500, fontSize: '0.85rem', cursor: 'pointer' 
                          }}
                        >
                          {p}
                        </button>
                      ))}
                      
                      <button onClick={() => setCurrentPage(p => Math.min(totalPgs, p + 1))} disabled={safeCurrent === totalPgs} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safeCurrent === totalPgs ? '#d1d5db' : '#6b7280', cursor: safeCurrent === totalPgs ? 'not-allowed' : 'pointer' }}><ChevronRight size={16} /></button>
                      <button onClick={() => setCurrentPage(totalPgs)} disabled={safeCurrent === totalPgs} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: safeCurrent === totalPgs ? '#d1d5db' : '#6b7280', cursor: safeCurrent === totalPgs ? 'not-allowed' : 'pointer' }}><ChevronsRight size={16} /></button>
                    </>
                  );
                })()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                <span>Rows per page:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', outline: 'none' }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {viewLead && (
            <LeadPreviewModal isOpen={!!viewLead} onClose={() => setViewLead(null)} lead={viewLead} onViewLead={(l) => { setViewLead(null); setFullViewLead(l); }} />
        )}
        {fullViewLead && (
            <LeadWorkspaceModal isOpen={!!fullViewLead} onClose={() => setFullViewLead(null)} lead={fullViewLead} />
        )}
        {showAssignModal && (
            <AssignLeadsModal 
              isOpen={true} 
              onClose={() => {
                setShowAssignModal(false);
                setSelectedIds(new Set());
                showToast('Data refreshed'); 
                // Refresh local data to reflect assignment
                setData([...data]);
              }} 
              leads={filteredData.filter((l:any) => selectedIds.has(l.id))} 
            />
        )}
      </motion.div>
  );

  if (isInline) return content;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      {content}
    </div>,
    document.body
  );
}
