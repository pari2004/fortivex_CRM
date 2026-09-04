'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ListPlus, Copy, Send, Mail as MailIcon, ChevronRight, ChevronDown, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Trash2, Edit2, CheckCircle, Clock, UploadCloud, RefreshCw, MoreVertical, Search, Bot, Mic, Eye, MoreHorizontal, Briefcase, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAgentModal } from '../modals/AIAgentModal';
import { CustomizeColumnsModal } from '../modals/CustomizeColumnsModal';
import { LeadFiltersPanel } from '../modals/LeadFiltersPanel';
import { ALL_LEADS_COLUMNS, DEFAULT_VISIBLE_COLUMNS } from '@/lib/data/leadsColumns';
import { Settings, Sparkles, Filter, Tag, UserPlus, Trash2 as TrashIcon } from 'lucide-react';
import { ActionMenu } from '@/components/common/ActionMenu';
import { AssignLeadsModal } from '@/components/dashboard/modals/AssignLeadsModal';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { LeadProfileModal } from '@/components/dashboard/modals/LeadProfileModal';
import { LeadPreviewModal } from '@/components/dashboard/modals/LeadPreviewModal';
import { EditLeadModal } from '@/components/dashboard/modals/EditLeadModal';
import { CreateUpdateDealModal } from '@/components/dashboard/modals/CreateUpdateDealModal';
import { AddToListDrawer } from '@/components/dashboard/modals/AddToListDrawer';
import { ChangeCategoryModal } from '@/components/dashboard/modals/ChangeCategoryModal';
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

export function LeadsWorkView({ newLeadEvent }: any) {
  const { leads, users, updateLead, deleteLead } = useCRM();
  const { user: authUser } = useAuth();
  
  const [data, setData] = useState<any[]>(leads || []);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New States for Sub-tabs and Toggles
  
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
  const [campaignExpanded, setCampaignExpanded] = useState(false);
  
  // Real Modal States
  const [createDealLead, setCreateDealLead] = useState<any>(null);
  const [showAddToList, setShowAddToList] = useState(false);
  const [changeCategoryLead, setChangeCategoryLead] = useState<any>(null);
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [currentSystemView, setCurrentSystemView] = useState('All Work Leads');
  useGlobalEscape(viewDropdownOpen, () => setViewDropdownOpen(false));
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
    
    
    // Date Filters
    if (q.includes('today')) setDateFilter('Today');
    else if (q.includes('yesterday')) setDateFilter('Yesterday');
    else if (q.includes('this week')) setDateFilter('This Week');
    else if (q.includes('this month')) setDateFilter('This Month');
    else if (q.includes('last 7 days')) setDateFilter('Last 7 Days');
    else if (q.includes('last 30 days')) setDateFilter('Last 30 Days');
  };

  const filteredData_preSearch = useMemo(() => {
    let result = data.filter(l => l.counselor || l.owner || l.assignedTo || (l.stage && l.stage !== 'New Lead'));
    

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
  }, [data, searchTerm, ownershipFilter, statusFilter, dateFilter, teamFilter, authUser]);

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
      
            {/* Work Leads Custom Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* MY / ALL Toggle */}
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

          <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>

          {/* Work Leads View Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={(e) => { e.stopPropagation(); setViewDropdownOpen(!viewDropdownOpen); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer' }} 
              className="hover-bg-secondary"
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{currentSystemView} <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>{filteredData_preSearch.length}</span></span>
              <ChevronDown size={14} style={{ color: 'var(--text-secondary)', marginLeft: '4px' }} />
            </div>
            
            {viewDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '320px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '8px' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>SYSTEM</div>
                
                {[
                  'All Work Leads',
                  'All Closed',
                  'Closed Today',
                  'Closed Negative Outcome',
                  'Manually Closed',
                  'Closed Time Over',
                  'Deal Lost',
                  'Deal Won'
                ].map((viewName) => (
                  <div 
                    key={viewName}
                    onClick={() => { setCurrentSystemView(viewName); setViewDropdownOpen(false); }}
                    style={{ 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: currentSystemView === viewName ? '#fdf2f8' : 'transparent',
                      color: currentSystemView === viewName ? '#9d174d' : '#0f172a',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      marginBottom: '2px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentSystemView !== viewName) e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      if (currentSystemView !== viewName) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {viewName}
                    {viewName === 'All Closed' && (
                      <span style={{ 
                        background: '#9d174d', 
                        color: 'white', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>3413</span>
                    )}
                  </div>
                ))}

                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }}></div>
                <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Add filters, then save them here as a smart view.
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <button 
            onClick={() => setShowFilterPanel(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: Object.keys(filterState).length > 0 ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)', color: Object.keys(filterState).length > 0 ? 'var(--primary-color)' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-bg-card"
          >
            <Filter size={16} /> Filters {Object.keys(filterState).length > 0 && `(${Object.keys(filterState).length})`}
          </button>

          <button 
            onClick={() => setShowAIModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-scale"
          >
            <Sparkles size={16} /> Ask AI
          </button>
          
          <button 
            onClick={() => setShowColumnsModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            className="hover-bg-card"
          >
            <Settings size={16} /> Columns
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
          <div style={{ padding: '12px 24px', background: '#eff6ff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeIn 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #4f46e5', padding: '6px 12px', borderRadius: '8px', color: '#4f46e5', fontWeight: 600, fontSize: '0.85rem' }}>
                <CheckSquare size={16} /> {selectedRows.size} selected
              </div>
              
              <button onClick={() => {
                const firstId = Array.from(selectedRows)[0];
                const lead = data.find(l => l.id === firstId);
                if(lead) setEditLead(lead);
              }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary"><Edit2 size={16}/> Edit</button>
              
              <button onClick={() => { showToast("Re-engagement initiated"); setSelectedRows(new Set()); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary"><RefreshCw size={16}/> Re-engage</button>
              
              <button onClick={() => setShowBulkAssign(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary"><UserPlus size={16}/> Assign</button>
              
              <button onClick={() => setShowBulkTag(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary"><Tag size={16}/> Tag</button>
              
              <button onClick={() => setShowAddToList(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary">Add to List</button>
              
              <button onClick={() => showToast("Exporting selected leads...")} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }} className="hover-bg-secondary"><UploadCloud size={16}/> Export</button>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setBulkMenuOpen(!bulkMenuOpen); 
                  }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}
                  className="hover-bg-secondary"
                >
                  <MoreVertical size={16}/> More
                </button>
                {bulkMenuOpen && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      marginTop: '4px', 
                      background: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                      width: '200px', 
                      zIndex: 9999,
                      padding: '8px 0',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="hover-bg-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'rgb(51, 65, 85)', fontSize: '0.9rem', fontWeight: 500 }} onClick={() => { 
                      const lead = Array.from(selectedRows).map(id => data.find((l: any) => l.id === id)).find(Boolean);
                      if (lead) setEditLead(lead);
                      setBulkMenuOpen(false); 
                    }}>
                      <Edit2 size={16} /> Edit
                    </div>
                    
                    <div className="hover-bg-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'rgb(51, 65, 85)', fontSize: '0.9rem', fontWeight: 500 }} onClick={() => { 
                      const lead = Array.from(selectedRows).map(id => data.find((l: any) => l.id === id)).find(Boolean);
                      if (lead) setCreateDealLead(lead);
                      setBulkMenuOpen(false); 
                    }}>
                      <Briefcase size={16} /> Create Deal
                    </div>
                    
                    <div className="hover-bg-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'rgb(51, 65, 85)', fontSize: '0.9rem', fontWeight: 500 }} onClick={() => { 
                      setShowAddToList(true);
                      setBulkMenuOpen(false);
                    }}>
                      <ListPlus size={16} /> Add to list
                    </div>
                    
                    <div className="hover-bg-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'rgb(51, 65, 85)', fontSize: '0.9rem', fontWeight: 500 }} onClick={() => { 
                      const lead = Array.from(selectedRows).map(id => data.find((l: any) => l.id === id)).find(Boolean);
                      if (lead) setChangeCategoryLead(lead);
                      setBulkMenuOpen(false); 
                    }}>
                      <ArrowRightLeft size={16} /> Change category
                    </div>

                    <div 
                      className="hover-bg-secondary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCampaignExpanded(!campaignExpanded);
                      }}
                      style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#334155', fontSize: '0.9rem', fontWeight: 500 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Send size={16} /> Campaign
                      </div>
                      <ChevronDown size={14} style={{ transform: campaignExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                    
                    {campaignExpanded && (
                      <div style={{ background: '#f8fafc', margin: '4px 8px', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          className="hover-bg-secondary"
                          onClick={() => {
                            showToast("WhatsApp Campaign Initiated");
                            setBulkMenuOpen(false);
                            setCampaignExpanded(false);
                          }}
                          style={{ padding: '8px 16px', paddingLeft: '44px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </div>
                      </div>
                    )}
                    
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                    
                    <div 
                      className="hover-bg-secondary" 
                      onClick={() => {
                        if(window.confirm(`Delete ${selectedRows.size} selected leads?`)) {
                          deleteLead(Array.from(selectedRows));
                          setSelectedRows(new Set());
                        }
                        setBulkMenuOpen(false);
                        setCampaignExpanded(false);
                      }} 
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}
                    >
                      <TrashIcon size={16} /> Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={() => setSelectedRows(new Set())} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#64748b' }}><X size={16}/> Close</button>
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
                          content = (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#4f46e5', fontWeight: 'bold' }}>
                                  {String(row.name).charAt(0).toUpperCase() || 'L'}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span onClick={() => setFullViewLead(row)} style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: 600, fontSize: '0.95rem' }}>
                                    {row.name}
                                  </span>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: row.stage === 'New Lead' || row.status === 'New' ? '#ecfdf5' : row.stage === 'Interested' ? '#fffbeb' : row.nextFollowUp ? '#eff6ff' : '#f8fafc', color: row.stage === 'New Lead' || row.status === 'New' ? '#10b981' : row.stage === 'Interested' ? '#f59e0b' : row.nextFollowUp ? '#3b82f6' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid', borderColor: row.stage === 'New Lead' || row.status === 'New' ? '#a7f3d0' : row.stage === 'Interested' ? '#fde68a' : row.nextFollowUp ? '#bfdbfe' : '#e2e8f0' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                    {row.leadStage || row.stage || 'New Lead'}
                                  </div>
                                </div>
                              </div>
                              <div className="lead-name-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button title="Call" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={14} /></button>
                                <button title="WhatsApp" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MessageCircle size={14} /></button>
                                <button title="Mute/Unmute" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Mic size={14} /></button>
                                <button title="View" onClick={() => setViewLead(row)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3e8ff', color: '#a855f7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Eye size={14} /></button>
                                <div style={{ width: '1px', height: '14px', background: '#e2e8f0', margin: '0 2px' }}></div>
                                <button title="More" onClick={(e) => { e.stopPropagation(); setActiveRowMenu(row.id); }} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MoreHorizontal size={14} /></button>
                              </div>
                            </div>
                          );
                          break;
                        case 'Lead Owner': 
                          content = (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                  {row.ownerPhoto ? (
                                    <img src={row.ownerPhoto} alt={ownerName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>
                                      {ownerName?.[0] || '?'}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <select 
                                    value={ownerName} 
                                    onChange={(e) => {
                                      const newOwner = e.target.value;
                                      if (updateLead) {
                                        updateLead({ ...row, owner: newOwner, counselor: newOwner, assignedTo: newOwner });
                                      }
                                    }}
                                    style={{ background: 'transparent', border: '1px solid transparent', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', padding: '0', borderRadius: '4px', maxWidth: '120px', appearance: 'none', WebkitAppearance: 'none' }}
                                  >
                                    {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].includes(ownerName) ? null : <option value={ownerName}>{ownerName}</option>}
                                    {['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'].map(u => (
                                      <option key={u} value={u}>{u}</option>
                                    ))}
                                  </select>
                                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>{row.ownerRole || 'Sales Executive'}</span>
                                </div>
                              </div>
                              <div className="owner-action-btns" style={{ display: 'flex', gap: '8px' }}>
                                <a href={`tel:${row.mobile || row.phone}`} onClick={(e) => e.stopPropagation()} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', textDecoration: 'none', transition: 'all 0.2s' }} title="Call Lead">
                                  <Phone size={14} />
                                </a>
                                <a href={`https://wa.me/${(row.mobile || row.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', textDecoration: 'none', transition: 'all 0.2s' }} title="Message Lead">
                                  <MessageCircle size={14} />
                                </a>
                              </div>
                            </div>
                          ); 
                          break;
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
          <AssignLeadsModal 
            isOpen={true}
            onClose={() => setActiveModal(null)}
            leads={activeModal === 'owner' ? [menuLead] : filteredData.filter(l => selectedRows.has(l.id))}
          />
        )}
        
        {(activeModal === 'stage' || activeModal === 'bulk_stage') && (
          <ActionModal key="stage-modal" title="Change Stage" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Stage updated'); }}>
            <select id="stage-select" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>
              {['New Lead', 'Contacted', 'Working', 'Qualified', 'Opportunity', 'Converted', 'Lost'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </ActionModal>
        )}
        
        {/* REUSED Lead Details Modals */}
        {createDealLead && <CreateUpdateDealModal key="create-deal" isOpen={!!createDealLead} lead={createDealLead} onClose={() => setCreateDealLead(null)} />}
        
        {showAddToList && (
          <AddToListDrawer 
            key="add-to-list-drawer"
            isOpen={showAddToList}
            onClose={() => setShowAddToList(false)} 
            lead={null}
            onSave={(listName: string) => {
              if(!listName.trim()) return;
              
              const updatedLeads = Array.from(selectedRows).map(id => {
                const lead = data.find((l: any) => l.id === id);
                if (lead) {
                  return { ...lead, lists: [...(lead.lists || []), listName] };
                }
                return null;
              }).filter(Boolean);
              
              if (updatedLeads.length > 0) {
                setData(prev => prev.map(l => {
                  const updatedLead = updatedLeads.find((ul: any) => ul.id === l.id);
                  return updatedLead ? updatedLead : l;
                }));
                updatedLeads.forEach((l: any) => updateLead(l));
                showToast(`Added ${updatedLeads.length} lead(s) to ${listName}`);
              }
              
              setShowAddToList(false);
            }} 
          />
        )}
        
        {changeCategoryLead && (
          <ChangeCategoryModal 
            key="change-category-modal"
            isOpen={!!changeCategoryLead}
            onClose={() => setChangeCategoryLead(null)}
            lead={changeCategoryLead}
            onSave={(updatedLead: any, changes: string[]) => {
              const toSave = { ...updatedLead };
              setData(prev => prev.map(l => l.id === toSave.id ? toSave : l));
              updateLead(toSave);
              setChangeCategoryLead(null);
              showToast('Category updated successfully');
            }}
          />
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

      {/* CSS for hover actions */}
      <style dangerouslySetInnerHTML={{__html: `
        .owner-action-btns {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .hover-bg-secondary:hover .owner-action-btns {
          opacity: 1;
        }
        .lead-name-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .hover-bg-secondary:hover .lead-name-actions {
          opacity: 1;
        }
      `}} />
    </div>
  );
}
