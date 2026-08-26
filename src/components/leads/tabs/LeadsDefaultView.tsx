'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ListPlus, Copy, Send, Mail as MailIcon, ChevronRight, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Trash2, Edit2, CheckCircle, Clock, UploadCloud, RefreshCw, MoreVertical, Search, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAgentModal } from '../modals/AIAgentModal';
import { CustomizeColumnsModal } from '../modals/CustomizeColumnsModal';
import { LeadFiltersPanel } from '../modals/LeadFiltersPanel';
import { ALL_LEADS_COLUMNS, DEFAULT_VISIBLE_COLUMNS } from '@/lib/data/leadsColumns';
import { Settings, Sparkles, Filter, Tag, UserPlus, Trash2 as TrashIcon } from 'lucide-react';
import { ActionMenu } from '@/components/common/ActionMenu';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { LeadProfileModal } from '@/components/dashboard/modals/LeadProfileModal';
import { LeadPreviewModal } from '@/components/dashboard/modals/LeadPreviewModal';
import { EditLeadModal } from '@/components/dashboard/modals/EditLeadModal';
import { useCRM } from '@/contexts/CRMContext';
import { useAuth } from '@/contexts/AuthContext';

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
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

const ActionModal = ({ title, children, onClose, onSave }: any) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', width: '400px', position: 'relative', zIndex: 10001, border: '1px solid var(--glass-border)' }}
    >
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>{title}</h3>
      {children}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button onClick={onClose} className="secondary-btn">Cancel</button>
        <button onClick={onSave} className="primary-btn" style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}>Save</button>
      </div>
    </motion.div>
  </div>
);

export function LeadsDefaultView({ activeTab, newLeadEvent }: any) {
  const { leads, users, updateLead, deleteLead } = useCRM();
  const { user: authUser } = useAuth();
  
  const [data, setData] = useState<any[]>(leads || []);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New States for Sub-tabs and Toggles
  const [subTab, setSubTab] = useState<'Active Leads' | 'Inactive Leads' | 'Lead Owner'>('Active Leads');
  const [ownershipFilter, setOwnershipFilter] = useState<'MY' | 'ALL'>('ALL');
  
  // Dropdown States
  const [statusFilter, setStatusFilter] = useState('All Active');
  const [dateFilter, setDateFilter] = useState('Today');
  const [teamFilter, setTeamFilter] = useState('FA Sales Team');
  
  const [aiQuery, setAiQuery] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterState, setFilterState] = useState<any>({});
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [showBulkTag, setShowBulkTag] = useState(false);
  const [globalMenuOpen, setGlobalMenuOpen] = useState(false);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);
  const [activeColumns, setActiveColumns] = useState<{ id: string; visible: boolean }[]>([]);

  // Load columns
  useEffect(() => {
    const saved = localStorage.getItem('leadsColumnsConfig');
    if (saved) {
      setActiveColumns(JSON.parse(saved));
    } else {
      setActiveColumns(ALL_LEADS_COLUMNS.map(col => ({ id: col, visible: DEFAULT_VISIBLE_COLUMNS.includes(col) })));
    }
  }, []);

  const handleSaveColumns = (cols: { id: string; visible: boolean }[]) => {
    setActiveColumns(cols);
    localStorage.setItem('leadsColumnsConfig', JSON.stringify(cols));
  };

  
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const [viewLead, setViewLead] = useState<any | null>(null);
  const [fullViewLead, setFullViewLead] = useState<any | null>(null);
  const [editLead, setEditLead] = useState<any | null>(null);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);
  const [menuLead, setMenuLead] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useGlobalEscape(!!(activeMenuId || activeModal || viewLead || editLead), () => {
    setActiveMenuId(null);
    if (!activeModal) setViewLead(null);
    setEditLead(null);
  });

  useEffect(() => {
    setData(leads || []);
  }, [leads]);

  useEffect(() => {
    if (newLeadEvent) {
      setData(prev => [newLeadEvent, ...prev]);
    }
  }, [newLeadEvent]);

  const handleAiSearch = (query: string) => {
    if (!query.trim()) return;
    setAiQuery(query);
    showToast(`AI applied filter: "${query}"`, 'success');
    
    // Improved basic NLP parsing
    const q = query.toLowerCase();
    
    // Team/Owner Filters
    if (q.includes('my') || q.includes('pavan') || q.includes('pawan')) setOwnershipFilter('MY');
    else if (q.includes('all')) setOwnershipFilter('ALL');
    
    // Stage/Status Filters
    if (q.includes('active')) setSubTab('Active Leads');
    else if (q.includes('inactive')) setSubTab('Inactive Leads');
    
    // Date Filters
    if (q.includes('today')) setDateFilter('Today');
    else if (q.includes('yesterday')) setDateFilter('Yesterday');
    else if (q.includes('this week')) setDateFilter('This Week');
    else if (q.includes('this month')) setDateFilter('This Month');
    else if (q.includes('last 7 days')) setDateFilter('Last 7 Days');
    else if (q.includes('last 30 days')) setDateFilter('Last 30 Days');
  };

  const filteredData_preSearch = useMemo(() => {
    let result = data;
    
    // SubTab Filter
    if (subTab === 'Active Leads') result = result.filter(l => l.status === 'Active' || l.status === 'New');
    

    // Advanced Panel Filters
    if (filterState.user) result = result.filter(l => l.counselor === filterState.user || l.owner === filterState.user);
    if (filterState.team) result = result.filter(l => l.team === filterState.team);
    if (filterState.source) result = result.filter(l => l.source === filterState.source || l.leadSource === filterState.source);
    if (filterState.stage) result = result.filter(l => l.stage === filterState.stage || l.leadStage === filterState.stage);
    if (filterState.priority) result = result.filter(l => l.priority === filterState.priority || l.leadPriority === filterState.priority);
    // Apply textual AI Query filtering (for names, owners, exact matches)
    if (aiQuery) {
      const q = aiQuery.toLowerCase();
      // Only do textual filtering if it contains specific names that wasn't caught by the basic Date/SubTab handlers above
      if (q.includes('abhishek')) { result = result.filter(l => l.owner?.toLowerCase() === 'abhishek' || l.counselor?.toLowerCase() === 'abhishek'); }
      else if (q.includes('padmesh')) { result = result.filter(l => l.owner?.toLowerCase() === 'padmesh' || l.counselor?.toLowerCase() === 'padmesh'); }
      else if (q.includes('parikshit')) { result = result.filter(l => l.owner?.toLowerCase() === 'parikshit' || l.counselor?.toLowerCase() === 'parikshit'); }
      else if (q.includes('spoorthi')) { result = result.filter(l => l.owner?.toLowerCase() === 'spoorthi' || l.counselor?.toLowerCase() === 'spoorthi'); }
      else if (q.includes('thanushree')) { result = result.filter(l => l.owner?.toLowerCase() === 'thanushree br' || l.counselor?.toLowerCase() === 'thanushree br'); }
      else if (q.includes('yashwanth')) { result = result.filter(l => l.owner?.toLowerCase() === 'yashwanth' || l.counselor?.toLowerCase() === 'yashwanth'); }
      else if (q.includes('follow-up') || q.includes('follow up') || q.includes('followup')) { result = result.filter(l => !!l.nextFollowUp); }
      else if (q.includes('attempted')) { result = result.filter(l => l.stage?.toLowerCase().includes('attempted') || l.status?.toLowerCase().includes('attempted')); }
      else if (q.includes('interested')) { result = result.filter(l => l.stage?.toLowerCase().includes('interested') || l.status?.toLowerCase().includes('interested')); }
    }

    else if (subTab === 'Inactive Leads') result = result.filter(l => l.status !== 'Active' && l.status !== 'New');
    
    // Ownership Filter
    if (ownershipFilter === 'MY') {
      const myName = authUser?.name;
      result = result.filter(l => l.counselor === myName || l.owner === myName || l.assignedTo === myName);
    }
    
    // Status Dropdown Filter
    if (statusFilter !== 'All Active' && statusFilter !== 'All') {
      if (statusFilter === 'New Inquiry Lead') result = result.filter(l => l.status === 'New');
      else if (statusFilter === 'Interested Lead') result = result.filter(l => l.priority === 'High' || l.status === 'Interested');
      else if (statusFilter === 'Unassigned') result = result.filter(l => !l.counselor && !l.owner);
      // Add other conditions dynamically based on statusFilter if needed
    }

return result;
  }, [data, searchTerm, subTab, ownershipFilter, statusFilter, dateFilter, teamFilter, authUser]);

  useGlobalEscape(globalMenuOpen, () => setGlobalMenuOpen(false));
  useGlobalEscape(!!activeRowMenu, () => setActiveRowMenu(null));
  useGlobalEscape(bulkMenuOpen, () => setBulkMenuOpen(false));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleAll = () => {
    if (selectedRows.size === paginatedData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginatedData.map(r => r.id)));
  };

  const handleAction = (action: string, row: any) => {
    setActiveMenuId(null);
    setMenuLead(row);
    if (action === 'view') setViewLead(row);
    else if (action === 'edit') setEditLead(row);
    else setActiveModal(action);
  };
  
  const handleSaveEdit = (updatedLead: any) => {
    setData(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setEditLead(null);
    showToast('Lead updated successfully');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', position: 'relative' }}>
      
      {/* Ask AI & Top Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        {/* AI Agent and Customize Columns Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <button 
            onClick={() => setShowAIModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', transition: 'transform 0.1s' }}
            className="hover-scale"
          >
            <Sparkles size={18} /> AI Agent
          </button>
          
          <button 
            onClick={() => setShowColumnsModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            className="hover-bg-card"
          >
            <Settings size={18} /> Customize Table Columns
          </button>
          
          {aiQuery && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              AI Filter: "{aiQuery}"
              <button onClick={() => setAiQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--primary-color)' }}><X size={14}/></button>
            </div>
          )}
        </div>

        {/* Filters Panel Trigger */}
        <button 
          onClick={() => setShowFilterPanel(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: Object.keys(filterState).length > 0 ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)', color: Object.keys(filterState).length > 0 ? 'var(--primary-color)' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          className="hover-bg-card"
        >
          <Filter size={18} /> Filters {Object.keys(filterState).length > 0 && `(${Object.keys(filterState).length})`}
        </button>
        

      </div>

      {/* Sub-tabs and MY/ALL Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Active Leads', 'Inactive Leads', 'Lead Owner'].map(tab => (
            <div 
              key={tab} 
              onClick={() => setSubTab(tab as any)}
              style={{ padding: '12px 0', borderBottom: subTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent', color: subTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: subTab === tab ? 600 : 500, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px', border: '1px solid var(--glass-border)' }}>
          <button 
            onClick={() => setOwnershipFilter('MY')}
            style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: ownershipFilter === 'MY' ? 'white' : 'transparent', color: ownershipFilter === 'MY' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: ownershipFilter === 'MY' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
          >
            MY
          </button>
          <button 
            onClick={() => setOwnershipFilter('ALL')}
            style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: ownershipFilter === 'ALL' ? 'white' : 'transparent', color: ownershipFilter === 'ALL' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: ownershipFilter === 'ALL' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none' }}
          >
            ALL
          </button>
        </div>
      </div>

      {/* Data Table Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        
        <DataToolbar 
          data={filteredData_preSearch} 
          onFilteredDataChange={setFilteredData} 
          searchKeys={['name', 'email', 'phone', 'mobile']} 
          searchPlaceholder="Search leads..." 
        />


        {/* Bulk Actions Toolbar */}
        {selectedRows.size > 0 && (
          <div style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeIn 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-color)', marginRight: '8px' }}>{selectedRows.size} selected</span>
              <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)', marginRight: '8px' }}></div>
              
              <button onClick={() => {
                const firstId = Array.from(selectedRows)[0];
                const lead = data.find(l => l.id === firstId);
                if(lead) setEditLead(lead);
              }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><Edit2 size={14}/> Edit</button>
              
              <button onClick={() => { showToast("Re-engagement initiated"); setSelectedRows(new Set()); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><RefreshCw size={14}/> Re-engage</button>
              
              <button onClick={() => setShowBulkAssign(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><UserPlus size={14}/> Assign</button>
              
              <button onClick={() => setShowBulkTag(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><Tag size={14}/> Tag</button>
              
              <button onClick={() => showToast("Added to list successfully")} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>Add to List</button>
              
              <button onClick={() => showToast("Exporting selected leads...")} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><UploadCloud size={14}/> Export</button>

              <div style={{ position: 'relative' }}>
                <button onClick={(e) => { e.stopPropagation(); setBulkMenuOpen(!bulkMenuOpen); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}><MoreVertical size={14}/> More</button>
                {bulkMenuOpen && (
                  <div style={{position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '240px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 9999, padding: '8px'}}>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>View Details</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>View Activity / Timeline</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>View Analytics</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Duplicate Lead</div>
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Add Note</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Create Task</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Create Opportunity</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Create Ticket</div>
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Send Email</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Send WhatsApp</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Export</div>
                    <div className="action-item" onClick={() => setBulkMenuOpen(false)}>Refresh</div>
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }}></div>
                    <div className="action-item" onClick={() => {
                      if(window.confirm(`Delete ${selectedRows.size} selected leads?`)) {
                        deleteLead(Array.from(selectedRows));
                        setSelectedRows(new Set());
                      }
                      setBulkMenuOpen(false);
                    }} style={{ color: 'var(--error-color)' }}><TrashIcon size={14}/> Close Lead</div>
                  </div>
                )}
              </div>
              
              <button onClick={() => setSelectedRows(new Set())} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}><X size={14}/> Close</button>
            </div>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: '16px 24px', width: '40px', borderBottom: '1px solid var(--glass-border)' }}><input type="checkbox" checked={selectedRows.size > 0 && selectedRows.size === paginatedData.length} onChange={toggleAll} style={{ cursor: 'pointer' }}/></th>
                {activeColumns.filter(c => c.visible).map(col => (
                  <th key={col.id} style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid var(--glass-border)' }}>{col.id}</th>
                ))}
                <th style={{ padding: '16px 24px', width: '50px', borderBottom: '1px solid var(--glass-border)', position: 'sticky', right: 0, background: 'var(--bg-secondary)', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => {
                const ownerName = row.counselor || row.owner || 'Unassigned';
                return (
                  <tr key={row.id || idx} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(row.id) ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.2s' }} className="hover-bg-secondary">
                    <td style={{ padding: '16px 24px' }}>
                      <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => { const next = new Set(selectedRows); if (next.has(row.id)) next.delete(row.id); else next.add(row.id); setSelectedRows(next); }} style={{ cursor: 'pointer' }} />
                    </td>
                    {activeColumns.filter(c => c.visible).map(col => {
                      // Render logic for each column
                      let content: React.ReactNode = '—';
                      
                      switch (col.id) {
                        case 'Lead Name': 
                          content = <div style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => setViewLead(row)}>{row.name}</div>; break;
                        case 'Lead Owner': 
                          content = (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', minWidth: '180px' }} className="lead-owner-badge-container">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ position: 'relative' }}>
                                  {row.ownerPhoto ? (
                                    <img src={row.ownerPhoto} alt={ownerName} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                                      {ownerName?.[0] || '?'}
                                    </div>
                                  )}
                                  
                                </div>
                                <select 
                                  value={ownerName} 
                                  onChange={(e) => {
                                    const newOwner = e.target.value;
                                    if (updateLead) {
                                      updateLead({ ...row, owner: newOwner, counselor: newOwner, assignedTo: newOwner });
                                    }
                                  }}
                                  style={{ background: 'transparent', border: '1px solid transparent', fontWeight: 500, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', maxWidth: '120px' }}
                                >
                                  {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].includes(ownerName) ? null : <option value={ownerName}>{ownerName}</option>}
                                  {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                  ))}
                                </select>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }} className="owner-action-btns">
                                <a href={`tel:${row.mobile || row.phone}`} onClick={(e) => e.stopPropagation()} style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', textDecoration: 'none', transition: 'all 0.2s' }} className="owner-action-btn" title="Call Lead">
                                  <Phone size={12} />
                                </a>
                                <a href={`https://wa.me/${(row.mobile || row.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', textDecoration: 'none', transition: 'all 0.2s' }} className="owner-action-btn" title="Message Lead">
                                  <MessageCircle size={12} />
                                </a>
                              </div>
                            </div>
                          ); break;
                        case 'Lead Stage': content = <div style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'inline-flex', fontSize: '0.8rem', fontWeight: 500 }}>{row.leadStage || row.stage || 'New Lead'}</div>; break;
                        case 'Next Followup': content = row.nextFollowUp || '—'; break;
                        case 'Mobile Number': 
                          content = (
                            <a href={`tel:${row.phone || row.mobile}`} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 500 }}>
                              <Phone size={14} color="var(--text-secondary)" /> {row.phone || row.mobile || '—'}
                            </a>
                          ); break;
                        case 'Email': 
                          content = row.email ? (
                            <a href={`mailto:${row.email}`} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                              <Mail size={14} color="var(--text-secondary)" /> {row.email}
                            </a>
                          ) : '—'; break;
                        case 'Lead Priority': content = row.priority || row.leadPriority || '—'; break;
                        case 'Lead Source': content = row.source || row.leadSource || '—'; break;
                        case 'Primary Team': content = row.team || 'FA Sales Team'; break;
                        case 'Created': content = row.createdAt || row.createdDate || row.date || '—'; break;
                        case 'Last Updated': content = row.updatedAt || '—'; break;
                        case 'Address': content = row.address || '—'; break;
                        case 'City': content = row.city || '—'; break;
                        case 'State': content = row.state || '—'; break;
                        case 'Country': content = row.country || '—'; break;
                        case 'Zipcode': content = row.zipcode || row.zip || '—'; break;
                        case 'Last User Remark': content = row.remark || '—'; break;
                        case 'Designation': content = row.designation || '—'; break;
                        case 'Business': content = row.business || row.company || '—'; break;
                        case 'Attempts': content = row.attempts ? String(row.attempts) : '—'; break;
                        default:
                          // Fallback for all other 50+ columns that don't exist in mock data
                          content = (row as any)[col.id.toLowerCase().replace(/\s+/g, '')] || '—';
                          break;
                      }
                      
                      return (
                        <td key={col.id} style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {content}
                        </td>
                      );
                    })}
                    <td style={{ padding: '16px 24px', textAlign: 'right', position: 'sticky', right: 0, background: selectedRows.has(row.id) ? 'var(--bg-secondary)' : 'var(--bg-primary)', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)', transition: 'background 0.2s' }}>
                      <div style={{ position: 'relative' }}>
                        <ActionMenu 
                          items={[
                            { label: 'View Profile', onClick: () => { setViewLead(row); } },
                            { label: 'Edit Lead', onClick: () => { setEditLead(row); } },
                            { divider: true, label: '' },
                            { label: 'Change Stage', onClick: () => { setMenuLead(row); setActiveModal('stage'); } },
                            { label: 'Assign Owner', onClick: () => { setMenuLead(row); setActiveModal('owner'); } },
                            { divider: true, label: '' },
                            { label: 'Log Call', onClick: () => { setMenuLead(row); setActiveModal('call'); } },
                            { label: 'Send Email', onClick: () => { setMenuLead(row); setActiveModal('email'); } }
                          ]} 
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found. Try adjusting your filters.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} leads
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="secondary-btn">Previous</button>
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="secondary-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for hover actions */}
      <style dangerouslySetInnerHTML={{__html: `
        .owner-action-btns {
          opacity: 0.4;
          transition: opacity 0.2s;
        }
        .hover-bg-secondary:hover .owner-action-btns {
          opacity: 1;
        }
        .owner-action-btn:hover {
          transform: scale(1.1);
        }
        .lead-owner-badge:hover .owner-actions { opacity: 1 !important; }
      `}} />

      {/* Modals */}
      <AnimatePresence>
        {viewLead && <LeadPreviewModal key="lead-preview" isOpen={true} onClose={() => setViewLead(null)} lead={viewLead} onViewLead={(l) => { setViewLead(null); setFullViewLead(l); }} />}
        {fullViewLead && <LeadProfileModal key="lead-profile" isOpen={true} onClose={() => setFullViewLead(null)} lead={fullViewLead} />}
        {editLead && <EditLeadModal key="edit-lead" lead={editLead} onClose={() => setEditLead(null)} onSave={handleSaveEdit} />}
        {activeModal === 'timeline' && <ActionModal key="timeline-modal" title="View Timeline" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Timeline updated'); }}><div style={{color: 'var(--text-secondary)'}}>Chronological timeline...</div></ActionModal>}
        
        {(activeModal === 'owner' || activeModal === 'bulk_owner') && (
          <ActionModal key="owner-modal" title="Assign Owner" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Owner assigned'); }}>
            <select id="owner-select" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>
              {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </ActionModal>
        )}
        
        {(activeModal === 'stage' || activeModal === 'bulk_stage') && (
          <ActionModal key="stage-modal" title="Change Stage" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Stage updated'); }}>
            <select id="stage-select" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>
              {['New Lead', 'Contacted', 'Working', 'Qualified', 'Opportunity', 'Converted', 'Lost'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </ActionModal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAIModal && <AIAgentModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onApplyFilter={handleAiSearch} />}
        {showColumnsModal && <CustomizeColumnsModal isOpen={showColumnsModal} onClose={() => setShowColumnsModal(false)} savedColumns={activeColumns} onSave={handleSaveColumns} />}

        {showFilterPanel && <LeadFiltersPanel isOpen={showFilterPanel} onClose={() => setShowFilterPanel(false)} currentFilters={filterState} onApply={setFilterState} />}
        
        {showBulkAssign && (
          <ActionModal title="Assign Leads" onClose={() => setShowBulkAssign(false)} onSave={() => {
             const user = (document.getElementById('bulk-assign-user') as HTMLSelectElement).value;
             const arr = Array.from(selectedRows);
             arr.forEach(id => {
               const lead = leads.find(l => l.id === id);
               if(lead) updateLead({ ...lead, owner: user, counselor: user, assignedTo: user });
             });
             setShowBulkAssign(false);
             setSelectedRows(new Set());
          }}>
            <label style={{ fontSize:'0.85rem', fontWeight:600, display:'block', marginBottom:'8px' }}>Select User</label>
            <select id="bulk-assign-user" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--border-color)'}}>
              {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </ActionModal>
        )}

        {showBulkTag && (
          <ActionModal title="Apply Tag" onClose={() => setShowBulkTag(false)} onSave={() => {
             const tag = (document.getElementById('bulk-tag-input') as HTMLInputElement).value;
             const arr = Array.from(selectedRows);
             arr.forEach(id => {
               const lead = leads.find(l => l.id === id);
               if(lead) {
                  const tags = lead.tags ? lead.tags.split(',').map((t:string) => t.trim()) : [];
                  if(!tags.includes(tag)) tags.push(tag);
                  updateLead({ ...lead, tags: tags.join(', ') });
               }
             });
             setShowBulkTag(false);
          }}>
            <label style={{ fontSize:'0.85rem', fontWeight:600, display:'block', marginBottom:'8px' }}>Tag Name</label>
            <input type="text" id="bulk-tag-input" placeholder="e.g. VIP, Urgent" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid var(--border-color)'}} />
          </ActionModal>
        )}
      </AnimatePresence>
    </div>
  );
}
