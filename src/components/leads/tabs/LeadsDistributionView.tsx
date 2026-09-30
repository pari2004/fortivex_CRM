'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, X as XIcon, Edit2, Copy, Eye, Download, Users, Trash2, Printer, BarChart2, RefreshCw, ChevronRight, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';

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

// --- Action Dropdown ---
const ActionDropdown = ({ isUp, onClose, onAction, record, targetRect }: any) => {
  useEffect(() => {
    const handleOutsideInteraction = () => onClose();
    window.addEventListener('wheel', handleOutsideInteraction, { passive: true });
    window.addEventListener('mousedown', handleOutsideInteraction);
    window.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleOutsideInteraction);
      window.removeEventListener('mousedown', handleOutsideInteraction);
      window.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [onClose]);

  const renderBtn = (label: string, icon: any, action: string) => (
    <button
      onMouseDown={(e) => { e.stopPropagation(); onAction(action, record); onClose(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
        background: 'transparent', border: 'none', borderRadius: '6px',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        color: action === 'delete' ? 'var(--status-lost)' : 'var(--text-primary)',
        transition: 'background 0.2s', fontSize: '0.85rem'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </button>
  );

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: isUp ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed', 
        right: Math.max(10, window.innerWidth - targetRect.right), 
        top: isUp ? 'auto' : targetRect.bottom + 8, 
        bottom: isUp ? window.innerHeight - targetRect.top + 8 : 'auto',
        width: '200px', zIndex: 99999, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px',
        boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)',
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {renderBtn('View Details', <Eye size={16} />, 'view')}
      {renderBtn('Edit Distribution', <Edit2 size={16} />, 'edit')}
      {renderBtn('Duplicate Distribution', <Copy size={16} />, 'duplicate')}
      {renderBtn('Manage Leads', <Users size={16} />, 'manage')}
      {renderBtn('View Analytics', <BarChart2 size={16} />, 'analytics')}
      {renderBtn('Refresh', <RefreshCw size={16} />, 'refresh')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Delete Distribution', <Trash2 size={16} />, 'delete')}
    </motion.div>,
    document.body
  );
};

// --- Modals ---
const GenericModal = ({ title, onClose, onSave, children, saveText = 'Save', width = '500px' }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><XIcon size={20} /></button>
        </div>
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
        {onSave && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={onClose} className="secondary-btn">Cancel</button>
            <button onClick={onSave} className="primary-btn">{saveText}</button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

// --- KPI Card ---
const KPICard = ({ title, value, onClick, active }: any) => (
  <div 
    onClick={onClick}
    style={{
      background: active ? 'var(--primary-color)' : 'var(--bg-secondary)', 
      color: active ? 'white' : 'var(--text-primary)',
      padding: '20px', 
      borderRadius: '12px', 
      border: '1px solid var(--glass-border)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: active ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
    }}
  >
    <div style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

// --- Main View ---
export function LeadsDistributionView() {
  const { lists, distributions, addDistribution, updateDistribution, deleteDistribution, leads, updateLead, users, addList } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Dropdown States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);
  const [menuIsUp, setMenuIsUp] = useState(false);
  
  // Column Filters
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [filterMenuTarget, setFilterMenuTarget] = useState<HTMLElement | null>(null);
  const [colFilters, setColFilters] = useState<{ [key: string]: string }>({});

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveFilterCol(null);
      setFilterMenuTarget(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modals / Modifiers
  const [viewRecord, setViewRecord] = useState<any>(null);
  useGlobalEscape(!!viewRecord, () => { setViewRecord(null) });

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  // Wizard Form State
  const [distName, setDistName] = useState('');
  const [distSourceType, setDistSourceType] = useState('list');
  const [distConnectedSource, setDistConnectedSource] = useState('');
  const [distListId, setDistListId] = useState('');
  const [distAssignMethod, setDistAssignMethod] = useState('Assign to Employee');
  const [distAssignUser, setDistAssignUser] = useState('');
  const [distAssignTeam, setDistAssignTeam] = useState('');

  // Diagnostics State
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagInput, setDiagInput] = useState('');
  const [diagResult, setDiagResult] = useState<any>(null);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let res = distributions || [];
    
    // KPI Filters
    if (activeFilter === 'Active') res = res.filter(d => d.status === 'Active');
    if (activeFilter === 'Assigned') res = res.filter(d => d.type !== 'Catch-All');
    if (activeFilter === 'Unassigned') res = res.filter(d => d.type === 'Catch-All');
    if (activeFilter === 'HasLeads') res = res.filter(d => d.totalLeads > 0);

    // Column Filters
    if (colFilters.name) res = res.filter(d => d.name.toLowerCase().includes(colFilters.name.toLowerCase()));
    if (colFilters.summary) res = res.filter(d => d.summary.toLowerCase().includes(colFilters.summary.toLowerCase()));
    if (colFilters.entityType) res = res.filter(d => d.entityType.toLowerCase() === colFilters.entityType.toLowerCase());
    if (colFilters.type) res = res.filter(d => d.type.toLowerCase() === colFilters.type.toLowerCase());
    if (colFilters.createdOn) res = res.filter(d => d.createdOn === colFilters.createdOn);

    // Global Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.summary.toLowerCase().includes(q) || 
        d.entityType.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    }
    return res;
  }, [distributions, searchQuery, activeFilter, colFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Stats for KPIs
  const stats = useMemo(() => {
    const totalLeads = distributions?.reduce((acc, curr) => acc + (curr.totalLeads || 0), 0) || 0;
    return {
      total: distributions?.length || 0,
      active: distributions?.filter(d => d.status === 'Active').length || 0,
      leadsDistributed: totalLeads,
      assigned: distributions?.filter(d => d.type !== 'Catch-All').length || 0,
      unassigned: distributions?.filter(d => d.type === 'Catch-All').length || 0,
      average: distributions?.length ? Math.round(totalLeads / distributions.length) : 0
    };
  }, [distributions]);

  const handleAction = (action: string, record: any) => {
    setActiveMenuId(null);
    if (action === 'view') setViewRecord(record);
    else if (action === 'edit') showToast(`Edit Distribution is currently restricted.`, 'error');
    else if (action === 'manage') showToast(`Opening Lead Manager for ${record.name}`);
    else if (action === 'analytics') showToast(`Loading Analytics Dashboard for ${record.name}`);
    else if (action === 'refresh') showToast(`Refreshed ${record.name} rules successfully`);
    else if (action === 'duplicate') {
      const copy = { ...record, name: `${record.name} - Copy`, totalLeads: 0 };
      addDistribution(copy);
      showToast('Distribution duplicated successfully');
    }
    else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${record.name}?`)) {
        deleteDistribution(record.id);
        showToast('Distribution deleted', 'error');
      }
    }
  };

  const handleCreateDistribution = () => {
    // Determine summary based on setup
    const assignTarget = distAssignMethod === 'Assign to Employee' ? (users.find(u=>u.id===distAssignUser)?.name || 'User') : (distAssignMethod === 'Send to Team' ? distAssignTeam : distAssignMethod);
    const summary = `Routes from ${distSourceType === 'list' ? 'List' : distConnectedSource} to ${assignTarget}`;
    
    // Simulate updating leads matching the list
    let matchedLeads = 0;
    if (distSourceType === 'list' && distListId) {
      // For demo, we update up to 10 active leads as "matched"
      const leadsToUpdate = leads.filter(l => l.status !== 'Closed Won' && l.status !== 'Closed Lost').slice(0, 10);
      matchedLeads = leadsToUpdate.length;
      
      const targetUser = users.find(u => u.id === distAssignUser)?.name || 'Assigned User';

      leadsToUpdate.forEach(lead => {
         updateLead({ ...lead, counselor: targetUser });
      });
    }

    addDistribution({
      name: distName || 'New Distribution',
      summary: summary,
      entityType: 'Lead',
      type: distAssignMethod,
      createdOn: new Date().toISOString().split('T')[0],
      totalLeads: matchedLeads,
      status: 'Active',
      sourceListId: distListId,
      assignmentConfig: {
         method: distAssignMethod,
         targetUser: distAssignUser,
         targetTeam: distAssignTeam
      }
    } as any);

    setWizardOpen(false);
    setWizardStep(1);
    setDistName('');
    showToast(`Distribution created and applied to ${matchedLeads} leads.`);
  };

  const runDiagnostics = () => {
    if (!diagInput) {
       setDiagResult({ error: 'Please enter a valid Lead ID or search term.' });
       return;
    }
    const matchedLead = leads.find(l => l.id.toLowerCase() === diagInput.toLowerCase() || l.name.toLowerCase().includes(diagInput.toLowerCase()) || l.mobile?.includes(diagInput));
    
    if (matchedLead) {
       const matchedDist = distributions?.find(d => d.assignmentConfig?.targetUser === matchedLead.counselor) || distributions?.[0];
       setDiagResult({
          found: true,
          leadName: matchedLead.name,
          owner: matchedLead.counselor,
          stage: matchedLead.status,
          distName: matchedDist?.name || 'Unknown Distribution',
          ruleOrder: 1,
          reason: `Lead matched filters for distribution "${matchedDist?.name || 'Default'}" and was assigned to ${matchedLead.counselor}.`
       });
    } else {
       setDiagResult({ found: false, error: `No CRM Lead found matching "${diagInput}"` });
    }
  };

  const [newListModal, setNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListTrigger, setNewListTrigger] = useState('When Lead is Created');

  const handleCreateListFromWizard = () => {
     addList({
       name: newListName || 'New Distribution List',
       sourceCategory: 'External Lead Sources',
       allowDuplicates: false,
       disallowAutoRechain: false,
       description: `Trigger: ${newListTrigger}`,
       owner: 'Current User',
       contains: Math.floor(Math.random() * 500) + 10,
       distribution: 'Kept Unassigned',
       createdDate: new Date().toISOString().split('T')[0],
       lastUpdated: new Date().toISOString().split('T')[0],
       listType: 'Distribution Trigger',
       listCreationType: 'Manual',
       bulkUploadSource: 'N/A',
       listStatus: 'Active',
       createdOn: new Date().toISOString().split('T')[0]
     } as any);
     showToast('List created successfully and available for distribution.');
     setNewListModal(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* KPI Cards Grid */}
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <KPICard title="Total Distributions" value={stats.total} active={activeFilter === 'All'} onClick={() => {setActiveFilter('All'); setPage(1);}} />
          <KPICard title="Active Distributions" value={stats.active} active={activeFilter === 'Active'} onClick={() => {setActiveFilter('Active'); setPage(1);}} />
          <KPICard title="Total Leads Distributed" value={stats.leadsDistributed.toLocaleString()} active={activeFilter === 'HasLeads'} onClick={() => {setActiveFilter('HasLeads'); setPage(1);}} />
          <KPICard title="Assigned Distributions" value={stats.assigned} active={activeFilter === 'Assigned'} onClick={() => {setActiveFilter('Assigned'); setPage(1);}} />
          <KPICard title="Unassigned Distributions" value={stats.unassigned} active={activeFilter === 'Unassigned'} onClick={() => {setActiveFilter('Unassigned'); setPage(1);}} />
          <KPICard title="Avg Leads / Distribution" value={stats.average.toLocaleString()} active={false} onClick={() => {setActiveFilter('HasLeads'); setPage(1);}} />
        </div>
      </div>

      {/* Top Header / Toolbar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', zIndex: 11 }}>
        
        {/* Left: Global Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', width: '400px', border: '1px solid var(--border-color)' }}>
            <Search size={20} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search across Distributions..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '1rem', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           <button onClick={() => setDiagnosticsOpen(true)} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
             <Activity size={18} /> Diagnosis
           </button>
           <button onClick={() => {setWizardOpen(true); setWizardStep(1);}} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
             <Plus size={18} /> New Distribution
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1300px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Distribution Name 
                  <button onClick={(e) => { e.stopPropagation(); setActiveFilterCol('name'); setFilterMenuTarget(e.currentTarget); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Filter size={14} color="var(--text-tertiary)" /></button>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Summary 
                  <button onClick={(e) => { e.stopPropagation(); setActiveFilterCol('summary'); setFilterMenuTarget(e.currentTarget); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Filter size={14} color="var(--text-tertiary)" /></button>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Entity Type 
                  <button onClick={(e) => { e.stopPropagation(); setActiveFilterCol('entityType'); setFilterMenuTarget(e.currentTarget); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Filter size={14} color="var(--text-tertiary)" /></button>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Type 
                  <button onClick={(e) => { e.stopPropagation(); setActiveFilterCol('type'); setFilterMenuTarget(e.currentTarget); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Filter size={14} color="var(--text-tertiary)" /></button>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Created On 
                  <button onClick={(e) => { e.stopPropagation(); setActiveFilterCol('createdOn'); setFilterMenuTarget(e.currentTarget); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Filter size={14} color="var(--text-tertiary)" /></button>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>No distributions found.</td></tr>
            ) : currentData.map((row, idx) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', height: '64px' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }} title={row.name}>{row.name}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', maxWidth: '400px' }} title={row.summary}>{row.summary}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 500 }}>
                    {row.entityType}
                  </span>
                </td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{row.type}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-tertiary)', maxWidth: '150px' }}>{row.createdOn}</td>
                <td style={{ padding: '16px', maxWidth: '100px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeMenuId === row.id) {
                          setActiveMenuId(null);
                          setMenuTarget(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuIsUp(window.innerHeight - rect.bottom < 250);
                          setActiveMenuId(row.id);
                          setMenuTarget(e.currentTarget);
                        }
                      }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      onMouseOver={e => e.currentTarget.style.background='var(--border-color)'} 
                      onMouseOut={e => e.currentTarget.style.background='transparent'}
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === row.id && menuTarget && (
                        <ActionDropdown isUp={menuIsUp} onAction={handleAction} record={row} targetRect={menuTarget.getBoundingClientRect()} onClose={() => { setActiveMenuId(null); setMenuTarget(null); }} />
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <b>{filteredData.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}</b>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            Previous
          </button>
          <div style={{ display: 'flex', gap: '4px', margin: '0 8px' }}>
             {Array.from({length: Math.min(totalPages, 5)}).map((_, i) => {
               const p = i + 1;
               return (
                 <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: page === p ? 'var(--primary-color)' : 'transparent', color: page === p ? 'white' : 'var(--text-primary)', border: page === p ? 'none' : '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                   {p}
                 </button>
               )
             })}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            Next
          </button>
        </div>
      </div>

      {/* --- View Details Modal --- */}
      <AnimatePresence>
        {viewRecord && (
          <GenericModal title="Distribution Details" onClose={() => setViewRecord(null)}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Distribution Name</span><br/><b style={{ fontSize: '1.1rem' }}>{viewRecord.name}</b></div>
                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Logic Summary</span><br/>
                   <span style={{ color: 'var(--text-primary)' }}>{viewRecord.summary}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Entity Type</span><br/><b>{viewRecord.entityType}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Routing Type</span><br/><b>{viewRecord.type}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Leads Processed</span><br/><b>{viewRecord.totalLeads?.toLocaleString() || 0}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Created On</span><br/><b>{viewRecord.createdOn}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</span><br/>
                     <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '12px', background: viewRecord.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: viewRecord.status === 'Active' ? '#166534' : '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
                        {viewRecord.status}
                     </span>
                   </div>
                </div>
             </div>
          </GenericModal>
        )}
      </AnimatePresence>

      {/* --- Diagnostics Modal --- */}
      <AnimatePresence>
         {diagnosticsOpen && (
            <GenericModal title="Distribution Diagnostics" onClose={() => {setDiagnosticsOpen(false); setDiagResult(null); setDiagInput('');}} width="600px">
               <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Let's trace the assignment using current CRM data. I will only inspect configuration and lead state — nothing will be changed.
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <button className="secondary-btn" style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--primary-color)', color: 'white', padding: '6px', borderRadius: '6px' }}><Search size={16}/></div>
                     <div><div style={{ fontWeight: 600 }}>Start with a lead number</div><div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Paste one lead number that was not assigned as expected.</div></div>
                  </button>
                  <button className="secondary-btn" style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--status-won)', color: 'white', padding: '6px', borderRadius: '6px' }}><Cpu size={16}/></div>
                     <div><div style={{ fontWeight: 600 }}>Check a distribution rule</div><div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Inspect rule order, AND/OR logic, and assignees.</div></div>
                  </button>
                  <button className="secondary-btn" style={{ padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ background: 'var(--status-warn)', color: 'white', padding: '6px', borderRadius: '6px' }}><Filter size={16}/></div>
                     <div><div style={{ fontWeight: 600 }}>Select a list to diagnose</div><div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Verify list criteria and linked distributions.</div></div>
                  </button>
               </div>

               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Paste a lead ID or name to trace..." value={diagInput} onChange={e=>setDiagInput(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                  <button onClick={runDiagnostics} className="primary-btn" style={{ padding: '10px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Analyze</button>
               </div>

               {diagResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', padding: '16px', background: diagResult.found ? '#f0fdf4' : '#fef2f2', border: `1px solid ${diagResult.found ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px' }}>
                     {diagResult.found ? (
                        <>
                           <h4 style={{ color: '#166534', marginBottom: '8px' }}>✓ Match Found</h4>
                           <div style={{ fontSize: '0.85rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><b>Lead Name:</b> {diagResult.leadName}</div>
                              <div><b>Current Owner:</b> {diagResult.owner}</div>
                              <div><b>Stage:</b> {diagResult.stage}</div>
                              <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                                 <b>Diagnostics Result:</b><br/>{diagResult.reason}
                              </div>
                           </div>
                        </>
                     ) : (
                        <div style={{ color: '#991b1b', fontSize: '0.85rem' }}><b>Error:</b> {diagResult.error}</div>
                     )}
                  </motion.div>
               )}
            </GenericModal>
         )}
      </AnimatePresence>

      {/* --- New Distribution Wizard --- */}
      <AnimatePresence>
        {wizardOpen && (
          <GenericModal title={wizardStep === 1 ? "Which leads should be distributed?" : wizardStep === 2 ? "Send them to..." : "Review & Save"} width="600px" onClose={() => setWizardOpen(false)}>
             
             {wizardStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   
                   <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Distribution Name</label>
                      <input type="text" placeholder="e.g. Website Referrals" value={distName} onChange={e=>setDistName(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input type="radio" name="source" checked={distSourceType === 'connected'} onChange={() => setDistSourceType('connected')} />
                         <span style={{ fontWeight: 600 }}>Leads from a connected source</span>
                      </label>
                      {distSourceType === 'connected' && (
                         <select value={distConnectedSource} onChange={e=>setDistConnectedSource(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', marginLeft: '24px', width: 'calc(100% - 24px)' }}>
                            <option value="">Select a source...</option>
                            <option value="Website Forms">Website Forms</option>
                            <option value="Facebook Campaigns">Facebook Campaigns</option>
                            <option value="Google Ads">Google Ads</option>
                         </select>
                      )}

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                         <input type="radio" name="source" checked={distSourceType === 'list'} onChange={() => setDistSourceType('list')} />
                         <span style={{ fontWeight: 600 }}>Leads matching a list or filter</span>
                      </label>
                      {distSourceType === 'list' && (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '24px' }}>
                            <select value={distListId} onChange={e=>setDistListId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                               <option value="">Select an existing CRM list...</option>
                               {lists?.map(l => (
                                  <option key={l.id} value={l.id}>{l.name} ({l.contains || 0} leads)</option>
                                ))}
                            </select>
                            <div style={{ textAlign: 'right' }}>
                               <button onClick={() => setNewListModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                  Need a new list? Create one
                               </button>
                            </div>
                         </div>
                      )}
                   </div>

                   <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button onClick={() => setWizardStep(2)} disabled={!distName || (distSourceType === 'list' && !distListId) || (distSourceType === 'connected' && !distConnectedSource)} className="primary-btn" style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: (!distName || (distSourceType === 'list' && !distListId) || (distSourceType === 'connected' && !distConnectedSource)) ? 0.5 : 1 }}>
                         Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                      </button>
                   </div>
                </motion.div>
             )}

             {wizardStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   
                   <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Distribution Method</label>
                      <select value={distAssignMethod} onChange={e=>setDistAssignMethod(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                         <option>Assign to Employee</option>
                         <option>Send to Team</option>
                         <option>Round Robin</option>
                         <option>Even Distribution</option>
                         <option>Assign to Selected Owner</option>
                         <option>Keep Unassigned</option>
                      </select>
                   </div>

                   {['Assign to Employee', 'Assign to Selected Owner'].includes(distAssignMethod) && (
                      <div>
                         <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select CRM User</label>
                         <select value={distAssignUser} onChange={e=>setDistAssignUser(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                            <option value="">Select User...</option>
                            {users?.map(u => (
                               <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                         </select>
                      </div>
                   )}

                   {distAssignMethod === 'Send to Team' && (
                      <div>
                         <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select CRM Team</label>
                         <select value={distAssignTeam} onChange={e=>setDistAssignTeam(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                            <option value="">Select Team...</option>
                            <option value="Sales Team Alpha">Sales Team Alpha</option>
                            <option value="Marketing Outreach">Marketing Outreach</option>
                         </select>
                      </div>
                   )}

                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <button onClick={() => setWizardStep(1)} className="secondary-btn" style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                      <button onClick={() => setWizardStep(3)} className="primary-btn" style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Review <ChevronRight size={16} style={{ marginLeft: '4px' }} /></button>
                   </div>
                </motion.div>
             )}

             {wizardStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   
                   <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Distribution Name</span>
                         <span style={{ fontWeight: 600 }}>{distName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lead Source / List</span>
                         <span style={{ fontWeight: 600 }}>{distSourceType === 'list' ? (lists?.find(l=>l.id===distListId)?.name || 'Unknown List') : distConnectedSource}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Distribution Method</span>
                         <span style={{ fontWeight: 600 }}>{distAssignMethod}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Target Assignment</span>
                         <span style={{ fontWeight: 600 }}>
                            {distAssignMethod === 'Send to Team' ? distAssignTeam : (users?.find(u=>u.id===distAssignUser)?.name || 'N/A')}
                         </span>
                      </div>
                      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Created By</span>
                         <span style={{ fontWeight: 600 }}>Current User</span>
                      </div>
                   </div>

                   <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                      Clicking "Save & Apply" will run this rule and update any matching leads in your CRM immediately.
                   </div>

                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <button onClick={() => setWizardStep(2)} className="secondary-btn" style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                      <button onClick={handleCreateDistribution} className="primary-btn" style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save & Apply</button>
                   </div>
                </motion.div>
             )}
          </GenericModal>
        )}
      </AnimatePresence>

      {/* --- List Creation Modal --- */}
      <AnimatePresence>
         {newListModal && (
            <GenericModal title="Create New Target List" onClose={() => setNewListModal(false)} saveText="Create & Use This List" onSave={handleCreateListFromWizard}>
               <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Name</label>
                  <input type="text" placeholder="e.g. Hot Website Leads" value={newListName} onChange={e=>setNewListName(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
               </div>
               <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>What kind of changes should trigger this list?</label>
                  <select value={newListTrigger} onChange={e=>setNewListTrigger(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                     <option>When Lead is Created</option>
                     <option>When Lead is Modified</option>
                     <option>When Lead is Deleted</option>
                     <option>When a Lead Property is Modified</option>
                  </select>
               </div>
               <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter which changes qualify</label>
                  <div style={{ padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '8px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                        <option>Lead Name</option>
                        <option>Lead Owner</option>
                        <option>Lead Stage</option>
                        <option>Lead Source</option>
                        <option>Lead Status</option>
                     </select>
                     <button style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}>+ Add Another Trigger (OR Condition)</button>
                  </div>
               </div>
            </GenericModal>
         )}
      </AnimatePresence>

      {/* Column Filter Dropdown */}
      {activeFilterCol && filterMenuTarget && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: filterMenuTarget.getBoundingClientRect().bottom + 8,
            left: filterMenuTarget.getBoundingClientRect().left,
            background: 'var(--bg-primary)',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid var(--glass-border)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '220px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Filter by {activeFilterCol}</div>
          <input 
            type="text"
            placeholder={`Enter ${activeFilterCol}...`}
            value={colFilters[activeFilterCol] || ''}
            onChange={(e) => {
              setColFilters(prev => ({ ...prev, [activeFilterCol]: e.target.value }));
              setPage(1);
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button onClick={() => { setColFilters(prev => { const newFilters = {...prev}; delete newFilters[activeFilterCol]; return newFilters; }); setActiveFilterCol(null); setFilterMenuTarget(null); setPage(1); }} style={{ flex: 1, padding: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
            <button onClick={() => { setActiveFilterCol(null); setFilterMenuTarget(null); }} style={{ flex: 1, padding: '6px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Apply</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
