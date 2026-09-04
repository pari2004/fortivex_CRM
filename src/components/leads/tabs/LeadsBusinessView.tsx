'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, RefreshCw, Download, ChevronLeft, ChevronRight, CheckSquare, Square, MoreVertical, Eye, Edit2, Clock, MessageCircle, UserPlus, Trash2, X, Plus, Columns } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { CustomizeBusinessColumnsModal } from '../modals/CustomizeBusinessColumnsModal';
import { LinkLeadsModal } from '../modals/LinkLeadsModal';
import { AddNewLeadModal } from '../AddNewLeadModal';
import { EditBusinessModal } from '../modals/EditBusinessModal';
import { BusinessLead } from '@/lib/data/mockData';

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

// --- Generic Modal ---
const GenericModal = ({ title, children, onClose, onSave, saveText = "Save", maxWidth = "500px" }: any) => {
  useGlobalEscape(true, onClose);
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '90vw', maxWidth, maxHeight: '90vh', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto' }}>{children}</div>
        {onSave && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-secondary)', borderRadius: '0 0 16px 16px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={onSave} style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{saveText}</button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

const ALL_BUSINESS_COLUMNS = ['Business Name', 'Address', 'Website', 'Industry', 'Priority', 'Added By', 'Created On', 'Mobile', 'Email'];
const DEFAULT_BUSINESS_COLUMNS = ['Business Name', 'Address', 'Website', 'Industry', 'Priority', 'Added By', 'Created On'];

export function LeadsBusinessView() {
  const { leads, businessLeads, addBusinessLead, updateBusinessLead, deleteBusinessLeads, linkLeadsToBusiness } = useCRM();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);
  const [detailsRecord, setDetailsRecord] = useState<any>(null);
  const [viewLeadsRecord, setViewLeadsRecord] = useState<any>(null);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<BusinessLead>>({});
  
  const [activityRecord, setActivityRecord] = useState<any>(null);
  const [noteRecord, setNoteRecord] = useState<any>(null);
  const [assignRecord, setAssignRecord] = useState<any>(null);
  const [linkLeadsBusinessId, setLinkLeadsBusinessId] = useState<string | null>(null);
  const [addNewLeadBusinessId, setAddNewLeadBusinessId] = useState<string | null>(null);

  // Column Customization
  const [customizeColumnsOpen, setCustomizeColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_BUSINESS_COLUMNS);

  useEffect(() => {
    const saved = localStorage.getItem('crm_business_columns');
    if (saved) {
      try {
        setVisibleColumns(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const handleSaveColumns = (cols: string[]) => {
    setVisibleColumns(cols);
    localStorage.setItem('crm_business_columns', JSON.stringify(cols));
  };

  const handleResetColumns = () => {
    setVisibleColumns(DEFAULT_BUSINESS_COLUMNS);
    localStorage.removeItem('crm_business_columns');
  };

  useGlobalEscape(!!activeRowMenu, () => setActiveRowMenu(null));

  const filteredData = useMemo(() => {
    return businessLeads.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [businessLeads, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600 border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length) setSelectedIds([]);
    else setSelectedIds(currentData.map(d => d.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  
  const handleExport = () => {
    const dataToExport = selectedIds.length > 0 ? currentData.filter(d => selectedIds.includes(d.id)) : filteredData;
    if (dataToExport.length === 0) {
      showToast('No data to export', 'error');
      return;
    }
    const headers = visibleColumns.join(',');
    const rows = dataToExport.map(row => {
      return visibleColumns.map(col => {
        let val = '';
        if (col === 'Business Name') val = row.name;
        if (col === 'Address') val = row.address || '';
        if (col === 'Website') val = row.website || '';
        if (col === 'Industry') val = row.industry || '';
        if (col === 'Priority') val = row.priority || '';
        if (col === 'Added By') val = row.addedBy || '';
        if (col === 'Created On') val = row.createdOn || '';
        if (col === 'Mobile') val = row.mobile || '';
        if (col === 'Email') val = row.email || '';
        // Escape quotes and commas
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `business_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export successful');
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} business(es)?`)) {
      deleteBusinessLeads(selectedIds);
      setSelectedIds([]);
      showToast(`${selectedIds.length} business(es) deleted`);
    }
  };

  const handleSaveNewBusiness = () => {
    if (!newBusiness.name) {
      showToast('Business Name is required', 'error');
      return;
    }
    const business: Omit<BusinessLead, 'id'> = {
      name: newBusiness.name || '',
      companyName: newBusiness.name || '',
      contactPerson: newBusiness.contactPerson || '',
      designation: '',
      businessType: 'B2B',
      industry: newBusiness.industry || 'Technology',
      employees: '50-100',
      expectedAdmissions: 0,
      assignedManager: 'Admin',
      revenuePotential: 0,
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
      address: newBusiness.address || '',
      website: newBusiness.website || '',
      priority: newBusiness.priority || 'Medium',
      addedBy: 'Current User',
      createdOn: 'Today',
      mobile: newBusiness.mobile || '',
      email: newBusiness.email || '',
      notes: newBusiness.notes || '',
      associatedLeads: []
    };
    addBusinessLead(business);
    setAddRecordOpen(false);
    setNewBusiness({});
    showToast('Business added successfully');
  };

  const handleSaveEditBusiness = () => {
    if (editRecord) {
      updateBusinessLead(editRecord);
      setEditRecord(null);
      showToast('Business updated');
    }
  };

  // Render Cell based on column
  const renderCell = (col: string, row: BusinessLead) => {
    switch (col) {
      case 'Business Name': return <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{row.name}</div>;
      case 'Address': return <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{row.address || '—'}</div>;
      case 'Website': return <a href={`https://${row.website}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }} className="hover-underline" onClick={e => e.stopPropagation()}>{row.website || '—'}</a>;
      case 'Industry': return row.industry ? <span style={{ padding: '4px 10px', background: '#eff6ff', color: '#3b82f6', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #bfdbfe' }}>{row.industry}</span> : <span style={{color: '#94a3b8'}}>—</span>;
      case 'Priority': return <div><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} className={getPriorityColor(row.priority || '')}>{row.priority || '—'}</span></div>;
      case 'Added By': return <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{row.addedBy || '—'}</div>;
      case 'Created On': return <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{row.createdOn || '—'}</div>;
      case 'Mobile': return <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{row.mobile || '—'}</div>;
      case 'Email': return <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{row.email || '—'}</div>;
      default: return <span style={{color: '#94a3b8'}}>—</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', position: 'relative' }}>
      

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'white', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search business..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', color: '#1e293b', width: '250px', fontSize: '0.9rem', transition: 'border-color 0.2s, background 0.2s' }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
            />
          </div>
          
          <button 
            onClick={() => setCustomizeColumnsOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }} className="hover-bg-secondary">
            <Columns size={16} /> Customize Columns
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }} className="hover-bg-secondary">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setAddRecordOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(59,130,246,0.2)' }} onMouseOver={e => e.currentTarget.style.background = '#2563eb'} onMouseOut={e => e.currentTarget.style.background = '#3b82f6'}>
            <Plus size={16} /> Add New Business
          </button>
        </div>
      </div>

      {/* Selected Business Toolbar */}
      {selectedIds.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgb(239, 246, 255)', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgb(191, 219, 254)', boxShadow: 'rgba(59, 130, 246, 0.05) 0px 4px 15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'rgb(59, 130, 246)', borderRight: '1px solid rgb(191, 219, 254)', paddingRight: '16px' }}>
            <CheckSquare size={18} /> {selectedIds.length} Selected
          </div>
          <button onClick={() => setSelectedIds([])} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'rgb(100, 116, 139)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px' }} className="hover-bg-secondary">
            <X size={14} /> Clear Selection
          </button>
          
          <div style={{ flex: 1, minWidth: '20px' }} />

          {selectedIds.length === 1 && (
            <>
              <button onClick={() => setViewLeadsRecord(businessLeads.find(b => b.id === selectedIds[0]))} style={{ background: 'white', border: '1px solid rgb(226, 232, 240)', color: 'rgb(51, 65, 85)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }} className="hover-bg-secondary">
                <Eye size={14} /> View Associated Leads
              </button>
              <button onClick={() => setLinkLeadsBusinessId(selectedIds[0])} style={{ background: 'white', border: '1px solid rgb(226, 232, 240)', color: 'rgb(51, 65, 85)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }} className="hover-bg-secondary">
                <UserPlus size={14} /> Link Leads With Business
              </button>
              <button onClick={() => setAddNewLeadBusinessId(selectedIds[0])} style={{ background: 'white', border: '1px solid rgb(226, 232, 240)', color: 'rgb(51, 65, 85)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }} className="hover-bg-secondary">
                <Plus size={14} /> Add New Lead
              </button>
              <button onClick={() => setEditRecord(businessLeads.find(b => b.id === selectedIds[0]))} style={{ background: 'white', border: '1px solid rgb(226, 232, 240)', color: 'rgb(51, 65, 85)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }} className="hover-bg-secondary">
                <Edit2 size={14} /> Edit
              </button>
            </>
          )}
          
          <button onClick={handleDeleteSelected} style={{ background: 'white', border: '1px solid rgb(254, 226, 226)', color: 'rgb(239, 68, 68)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }} className="hover-bg-red">
            <Trash2 size={14} /> Delete {selectedIds.length} Business{selectedIds.length > 1 ? 'es' : ''}
          </button>
        </motion.div>
      )}

      {/* Main Table */}
      <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: '14px 20px', borderBottom: '2px solid #e2e8f0', borderRight: '1px solid #e2e8f0', color: '#334155', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', width: '60px' }}>
                  <div onClick={toggleSelectAll} style={{ cursor: 'pointer', color: selectedIds.length > 0 ? '#3b82f6' : '#94a3b8' }}>
                    {selectedIds.length > 0 && selectedIds.length === currentData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </th>
                {visibleColumns.map(col => (
                  <th key={col} style={{ padding: '14px 20px', borderBottom: '2px solid #e2e8f0', borderRight: '1px solid #e2e8f0', color: '#334155', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
                <th style={{ padding: '14px 20px', borderBottom: '2px solid #e2e8f0', width: '60px', position: 'sticky', right: 0, background: '#f8fafc', zIndex: 11 }}></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', background: selectedIds.includes(row.id) ? '#f8fafc' : 'white', transition: 'background 0.2s' }} className="hover-bg-secondary">
                  <td style={{ padding: '16px 20px' }}>
                    <div onClick={() => toggleSelect(row.id)} style={{ cursor: 'pointer', color: selectedIds.includes(row.id) ? '#3b82f6' : '#94a3b8' }}>
                      {selectedIds.includes(row.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  {visibleColumns.map(col => (
                    <td key={`${row.id}-${col}`} style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {renderCell(col, row)}
                    </td>
                  ))}
                  <td style={{ padding: '16px 20px', position: 'sticky', right: 0, background: selectedIds.includes(row.id) ? '#f8fafc' : 'white', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{ position: 'relative' }}>
                      <button onClick={(e) => { e.stopPropagation(); setActiveRowMenu(activeRowMenu === row.id ? null : row.id); }} style={{ background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} className="hover-bg-secondary">
                        <MoreVertical size={16} />
                      </button>
                      
                      <AnimatePresence>
                        {activeRowMenu === row.id && (
                          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} style={{ position: 'absolute', right: '100%', top: '0', marginRight: '8px', width: '220px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
                            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <button onClick={() => { setDetailsRecord(row); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><Eye size={16} color="#64748b" /> View Details</button>
                              <button onClick={() => { setViewLeadsRecord(row); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><UserPlus size={16} color="#64748b" /> View Associated Leads</button>
                              <button onClick={() => { setEditRecord(row); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><Edit2 size={16} color="#64748b" /> Edit Business</button>
                              <button onClick={() => { setLinkLeadsBusinessId(row.id); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><UserPlus size={16} color="#64748b" /> Link Leads</button>
                              <button onClick={() => { setAddNewLeadBusinessId(row.id); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><Plus size={16} color="#64748b" /> Add New Lead</button>
                              <button onClick={() => { setNoteRecord(row); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><MessageCircle size={16} color="#64748b" /> Add Note</button>
                              
                              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                              
                              <button onClick={() => { setSelectedIds([row.id]); setTimeout(handleExport, 100); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><Download size={16} color="#64748b" /> Export Business</button>
                              <button onClick={() => { showToast('Business refreshed'); setActiveRowMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-secondary"><RefreshCw size={16} color="#64748b" /> Refresh</button>
                              
                              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                              
                              <button onClick={() => { 
                                if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                                  deleteBusinessLeads([row.id]);
                                  showToast('Business deleted');
                                }
                                setActiveRowMenu(null); 
                              }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }} className="hover-bg-red"><Trash2 size={16} /> Delete Business</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length + 2} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No business records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500 }} className={currentPage === 1 ? "" : "hover-bg-secondary"}>
              <ChevronLeft size={14} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{ width: '32px', height: '32px', border: currentPage === i + 1 ? '1px solid #3b82f6' : '1px solid #e2e8f0', borderRadius: '8px', background: currentPage === i + 1 ? '#eff6ff' : 'white', color: currentPage === i + 1 ? '#3b82f6' : '#475569', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }} className={currentPage === i + 1 ? "" : "hover-bg-secondary"}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#475569', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500 }} className={currentPage === totalPages || totalPages === 0 ? "" : "hover-bg-secondary"}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <CustomizeBusinessColumnsModal key="customize-cols" 
          isOpen={customizeColumnsOpen}
          onClose={() => setCustomizeColumnsOpen(false)}
          availableColumns={ALL_BUSINESS_COLUMNS}
          currentVisibleColumns={visibleColumns}
          onSave={handleSaveColumns}
          onResetToDefault={handleResetColumns}
        />

        
        {addNewLeadBusinessId && (
          <AddNewLeadModal
            isQuickPhoneAdd={true}
            onClose={() => setAddNewLeadBusinessId(null)}
            onSuccess={(leadData) => {
              if (leadData?.id) {
                linkLeadsToBusiness(addNewLeadBusinessId, [leadData.id]);
                showToast(`Lead linked to business`);
              }
            }}
          />
        )}

        {linkLeadsBusinessId && (
          <LinkLeadsModal key="link-leads"
            isOpen={!!linkLeadsBusinessId}
            onClose={() => setLinkLeadsBusinessId(null)}
            businessId={linkLeadsBusinessId}
          />
        )}

        {/* Existing Modals Re-wired */}
        {viewLeadsRecord && (
          <GenericModal key="view-leads-modal" title={`Showing all linked leads with business ${viewLeadsRecord.name}`} onClose={() => setViewLeadsRecord(null)} maxWidth="700px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {viewLeadsRecord.associatedLeads && viewLeadsRecord.associatedLeads.length > 0 ? (
                leads.filter(l => viewLeadsRecord.associatedLeads?.includes(l.id)).map(lead => {
                  const initials = lead.name ? lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
                  const dateStr = lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : 'recently';
                  
                  return (
                    <div key={lead.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#c0a0e0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initials}</div>
                      <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{lead.name}</h3>
                            <span style={{ background: '#a080d0', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}>Contact Type : {lead.contactType || 'OTHER'}</span>
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>modified : {dateStr}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No linked leads found for this business.</div>
              )}
            </div>
          </GenericModal>
        )}

        {detailsRecord && (
          <GenericModal key="details-modal" title={`Business Details: ${detailsRecord.name}`} onClose={() => setDetailsRecord(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>Company Details</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Industry</span><b>{detailsRecord.industry}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Address</span><b>{detailsRecord.address}</b></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Website</span><a href={`https://${detailsRecord.website}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>{detailsRecord.website}</a></div>
                 
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px', marginTop: '24px' }}>Associated Leads</h4>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Count</span><b>{detailsRecord.associatedLeads?.length || 0} Linked Leads</b></div>
              </div>
              <div>
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>Contact Info</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Contact Person</span><b>{detailsRecord.contactPerson || '—'}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Mobile</span><b>{detailsRecord.mobile || '—'}</b></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Email</span><b>{detailsRecord.email || '—'}</b></div>
                 
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px', marginTop: '24px' }}>CRM Info</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Priority</span><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(detailsRecord.priority || '')}`}>{detailsRecord.priority || '—'}</span></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Added By</span><b>{detailsRecord.addedBy || '—'}</b></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Created On</span><b>{detailsRecord.createdOn || '—'}</b></div>
              </div>
            </div>
          </GenericModal>
        )}

        
        {noteRecord && (
          <GenericModal key="note-modal" title={`Add Note to ${noteRecord.name}`} onClose={() => setNoteRecord(null)} onSave={() => {
            updateBusinessLead({...noteRecord, notes: (noteRecord.notes ? noteRecord.notes + '\n' : '') + 'New Note added ' + new Date().toLocaleDateString()});
            setNoteRecord(null);
            showToast('Note added');
          }}>
            <textarea placeholder="Enter note details..." rows={5} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} />
          </GenericModal>
        )}

        {editRecord && (
          <EditBusinessModal 
            businessId={editRecord.id}
            onClose={() => setEditRecord(null)}
            onSuccess={() => {
              showToast("Business updated successfully");
              setEditRecord(null);
            }}
          />
        )}

        {addRecordOpen && (
          <GenericModal key="add-modal" title="Add New Business" onClose={() => setAddRecordOpen(false)} onSave={handleSaveNewBusiness}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Business Name <span style={{color: 'red'}}>*</span></label><input type="text" value={newBusiness.name || ''} onChange={e => setNewBusiness({...newBusiness, name: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Industry</label><select value={newBusiness.industry || ''} onChange={e => setNewBusiness({...newBusiness, industry: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                 <option value="">Select Industry</option>
                 {['Education', 'Technology', 'Healthcare', 'Finance', 'Consulting', 'Retail'].map(t=><option key={t}>{t}</option>)}
               </select></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Address</label><input type="text" value={newBusiness.address || ''} onChange={e => setNewBusiness({...newBusiness, address: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Website</label><input type="text" value={newBusiness.website || ''} onChange={e => setNewBusiness({...newBusiness, website: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Person</label><input type="text" value={newBusiness.contactPerson || ''} onChange={e => setNewBusiness({...newBusiness, contactPerson: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mobile</label><input type="text" value={newBusiness.mobile || ''} onChange={e => setNewBusiness({...newBusiness, mobile: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</label><select value={newBusiness.priority || ''} onChange={e => setNewBusiness({...newBusiness, priority: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                 <option value="">Select Priority</option>
                 {['High', 'Medium', 'Low'].map(t=><option key={t}>{t}</option>)}
               </select></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label><input type="text" value={newBusiness.email || ''} onChange={e => setNewBusiness({...newBusiness, email: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
            </div>
            <div style={{ marginTop: '16px' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes</label><textarea rows={3} value={newBusiness.notes || ''} onChange={e => setNewBusiness({...newBusiness, notes: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} /></div>
          </GenericModal>
        )}

      </AnimatePresence>
    </div>
  );
}
