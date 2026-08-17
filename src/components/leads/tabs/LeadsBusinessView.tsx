'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Download, ChevronLeft, ChevronRight, CheckSquare, Square, MoreVertical, Eye, Edit2, Clock, MessageCircle, UserPlus, Trash2, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
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
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

// --- Mock Data Generator ---
const businessNames = ['TechNova Solutions', 'BrightPath Education', 'GreenLeaf Healthcare', 'Apex Digital Systems', 'Horizon Learning Hub', 'Vertex Consulting', 'PrimeTech Innovations', 'BlueSky Enterprises', 'NextGen Academy', 'UrbanEdge Solutions'];
const locations = ['Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Pune, Maharashtra', 'Delhi, India'];
const industries = ['Education', 'Technology', 'Healthcare', 'Finance', 'Consulting', 'Retail'];
const addedByList = ['Admin User', 'Sales Team', 'Marketing Team', 'Rahul Sharma', 'Priya Nair'];
const priorities = ['High', 'Medium', 'Low'];
const dates = ['Today', 'Yesterday', '2 days ago', '4 days ago', '1 week ago'];

const generateBusinessData = (count = 50) => {
  return Array.from({ length: count }).map((_, i) => {
    const bName = businessNames[i % businessNames.length];
    return {
      id: `B-${1000 + i}`,
      name: `${bName} ${i > 9 ? i : ''}`.trim(),
      address: locations[i % locations.length],
      website: `www.${bName.toLowerCase().replace(/\s+/g, '')}.com`,
      industry: industries[i % industries.length],
      priority: priorities[i % priorities.length],
      addedBy: addedByList[i % addedByList.length],
      createdOn: dates[i % dates.length],
      // Details fields
      contactPerson: ['Amit Kumar', 'Neha Sharma', 'Rohan Das', 'Kavita Singh'][i % 4],
      mobile: `+91 98${String(10000000 + i * 12345).substring(0, 8)}`,
      email: `contact@${bName.toLowerCase().replace(/\s+/g, '')}.com`,
      leadSource: ['Website', 'Referral', 'LinkedIn', 'Cold Call'][i % 4],
      assignedTeam: ['Sales North', 'Sales South', 'Enterprise'][i % 3],
      notes: 'Initial contact established.',
    };
  });
};

// --- Modals & Popovers ---
const GenericModal = ({ title, onClose, onSave, children, width = '500px' }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
        {onSave && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={onClose} className="secondary-btn">Cancel</button>
            <button onClick={onSave} className="primary-btn">Save Changes</button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

const ActionDropdown = ({ isUp, onAction, business }: any) => {
  const renderBtn = (label: string, icon: any, action: string) => (
    <button
      onClick={(e) => { e.stopPropagation(); onAction(action, business); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
        background: 'transparent', border: 'none', borderRadius: '6px',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        color: action === 'delete' ? 'var(--status-lost)' : 'var(--text-primary)',
        transition: 'background 0.2s', fontSize: '0.85rem'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: isUp ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'absolute', right: '10px', top: isUp ? 'auto' : '30px', bottom: isUp ? '30px' : 'auto',
        width: '200px', zIndex: 99, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px',
        boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderBtn('View Details', <Eye size={16} />, 'details')}
      {renderBtn('Edit Business', <Edit2 size={16} />, 'edit')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('View Activity', <Clock size={16} />, 'activity')}
      {renderBtn('Add Note', <MessageCircle size={16} />, 'note')}
      {renderBtn('Assign Owner', <UserPlus size={16} />, 'assign')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Delete', <Trash2 size={16} />, 'delete')}
    </motion.div>
  );
};


// --- Main Component ---
export function LeadsBusinessView() {
  const [data, setData] = useState(() => generateBusinessData(75));



  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  useGlobalEscape(!!filterOpen, () => { setFilterOpen(false) });
  const [filters, setFilters] = useState<{ industry: string, priority: string, addedBy: string }>({ industry: '', priority: '', addedBy: '' });
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals / Interaction State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  const [exportOpen, setExportOpen] = useState(false);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  
  const [newBusinessData, setNewBusinessData] = useState({
    name: '', address: '', website: '', industry: 'Technology', priority: 'Medium',
    addedBy: 'Admin User', createdOn: 'Today', contactPerson: '', mobile: '', email: '',
    leadSource: 'Website', assignedTeam: 'Sales North', notes: ''
  });
  
  const [detailsRecord, setDetailsRecord] = useState<any>(null);
  useGlobalEscape(!!detailsRecord, () => { setDetailsRecord(null) });
  const [editRecord, setEditRecord] = useState<any>(null);
  const [activityRecord, setActivityRecord] = useState<any>(null);
  const [noteRecord, setNoteRecord] = useState<any>(null);
  const [assignRecord, setAssignRecord] = useState<any>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let result = data;
    
    // Apply column filters
    if (filters.industry) result = result.filter(d => d.industry === filters.industry);
    if (filters.priority) result = result.filter(d => d.priority === filters.priority);
    if (filters.addedBy) result = result.filter(d => d.addedBy === filters.addedBy);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.address.toLowerCase().includes(q) || 
        d.website.toLowerCase().includes(q) ||
        d.industry.toLowerCase().includes(q) ||
        d.addedBy.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, searchQuery, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === currentData.length && currentData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentData.map(d => d.id)));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.has(id)) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set([id]));
    }
  };

  const handleAction = (action: string, record: any) => {
    setActiveMenuId(null);
    if (action === 'details') setDetailsRecord(record);
    else if (action === 'edit') setEditRecord(record);
    else if (action === 'activity') setActivityRecord(record);
    else if (action === 'note') setNoteRecord(record);
    else if (action === 'assign') setAssignRecord(record);
    else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${record.name}?`)) {
        setData(prev => prev.filter(d => d.id !== record.id));
        setSelectedIds(prev => { const n = new Set(prev); n.delete(record.id); return n; });
        showToast('Business deleted', 'error');
      }
    }
  };

  const handleAddBusiness = () => {
    if (!newBusinessData.name || !newBusinessData.address) {
      showToast('Name and Address are required', 'error');
      return;
    }
    const newRecord = {
      id: `B-${Math.floor(Math.random() * 10000)}`,
      ...newBusinessData
    };
    setData([newRecord, ...data]);
    setIsAddBusinessModalOpen(false);
    setNewBusinessData({
      name: '', address: '', website: '', industry: 'Technology', priority: 'Medium',
      addedBy: 'Admin User', createdOn: 'Today', contactPerson: '', mobile: '', email: '',
      leadSource: 'Website', assignedTeam: 'Sales North', notes: ''
    });
    showToast('New Business Added', 'success');
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Toolbar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        
        {/* Left Side: Search & Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', width: '350px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search across Business..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
            />
          </div>
          
          {selectedIds.size > 0 && (
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '6px' }}>
              {selectedIds.size} businesses selected
            </span>
          )}
        </div>

        {/* Right Side: Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => showToast('Data Refreshed', 'success')} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Refresh">
            <RefreshCw size={18} />
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              style={{ 
                padding: '10px', 
                background: Object.values(filters).some(v => v !== '') ? 'var(--primary-light)' : 'transparent', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                color: Object.values(filters).some(v => v !== '') ? 'var(--primary-color)' : 'var(--text-secondary)' 
              }} 
              title="Filter"
            >
              <Filter size={18} />
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', zIndex: 100, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Filters</h4>
                    {(Object.values(filters).some(v => v !== '') || searchQuery !== '') && (
                      <button onClick={() => { setFilters({ industry: '', priority: '', addedBy: '' }); setSearchQuery(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All</button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industry</label>
                    <select value={filters.industry} onChange={e => setFilters({...filters, industry: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                      <option value="">All Industries</option>
                      {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority</label>
                    <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                      <option value="">All Priorities</option>
                      {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Added By</label>
                    <select value={filters.addedBy} onChange={e => setFilters({...filters, addedBy: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                      <option value="">All Users</option>
                      {addedByList.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setExportOpen(!exportOpen)} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} /> Export
            </button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '150px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', zIndex: 100, padding: '4px' }}>
                  {['CSV', 'Excel', 'PDF'].map(ext => (
                    <button key={ext} onClick={() => { setExportOpen(false); showToast(`Exporting to ${ext}...`); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      Export {ext}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsAddBusinessModalOpen(true)} 
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Plus size={18} /> Add New Business
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '60px', textAlign: 'center' }}>
                <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {selectedIds.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                </button>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', minWidth: '200px' }}>Business Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', minWidth: '200px' }}>Address</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', minWidth: '180px' }}>Website</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Industry</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Priority</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Added By</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Created On</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>No business records found.</td></tr>
            ) : currentData.map((row, idx) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.has(row.id) ? 'var(--primary-light)' : 'transparent', transition: 'background 0.2s', height: '64px' }} onClick={() => handleAction('details', row)}>
                <td style={{ padding: '16px', textAlign: 'center' }} onClick={e => handleSelectRow(row.id, e)}>
                  <div style={{ cursor: 'pointer', color: selectedIds.has(row.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                    {selectedIds.has(row.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }}>{row.name}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={row.address}>{row.address}</td>
                <td style={{ padding: '16px' }} onClick={e => e.stopPropagation()}>
                  <a href={`https://${row.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.textDecoration='underline'} onMouseOut={e => e.currentTarget.style.textDecoration='none'}>
                    {row.website}
                  </a>
                </td>
                <td style={{ padding: '16px' }}>{row.industry}</td>
                <td style={{ padding: '16px' }}><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(row.priority)}`}>{row.priority}</span></td>
                <td style={{ padding: '16px' }}>{row.addedBy}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.createdOn}</td>
                <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', borderRadius: '4px' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {activeMenuId === row.id && (
                      <ActionDropdown isUp={idx > itemsPerPage - 4} onAction={handleAction} business={row} />
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddBusinessModalOpen && (
        <GenericModal title="Add New Business" onClose={() => setIsAddBusinessModalOpen(false)} onSave={handleAddBusiness} width="600px">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Business Name *</label>
              <input type="text" value={newBusinessData.name} onChange={e => setNewBusinessData({...newBusinessData, name: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }} placeholder="e.g. Acme Corp" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Industry</label>
              <select value={newBusinessData.industry} onChange={e => setNewBusinessData({...newBusinessData, industry: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Address *</label>
              <input type="text" value={newBusinessData.address} onChange={e => setNewBusinessData({...newBusinessData, address: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }} placeholder="Location/City" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Website</label>
              <input type="text" value={newBusinessData.website} onChange={e => setNewBusinessData({...newBusinessData, website: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }} placeholder="www.example.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
              <select value={newBusinessData.priority} onChange={e => setNewBusinessData({...newBusinessData, priority: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Added By</label>
              <select value={newBusinessData.addedBy} onChange={e => setNewBusinessData({...newBusinessData, addedBy: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                {addedByList.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Created On</label>
              <input type="text" value={newBusinessData.createdOn} onChange={e => setNewBusinessData({...newBusinessData, createdOn: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }} />
            </div>
          </div>
        </GenericModal>
      )}

      {/* Pagination Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <b>{(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)}</b> of <b>{filteredData.length}</b> businesses
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            <ChevronLeft size={16} /> Previous
          </button>
          
          <div style={{ display: 'flex', gap: '4px', margin: '0 8px' }}>
             {Array.from({length: Math.min(totalPages, 5)}).map((_, i) => {
               const p = i + 1;  return (
                 <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: page === p ? 'var(--primary-color)' : 'transparent', color: page === p ? 'white' : 'var(--text-primary)', border: page === p ? 'none' : '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                   {p}
                 </button>
               )
             })}
          </div>

          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* --- Modals Render --- */}
      <AnimatePresence>
        {detailsRecord && (
          <GenericModal title="Business Details" width="700px" onClose={() => setDetailsRecord(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>Business Info</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Business Name</span><b>{detailsRecord.name}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Business ID</span><b>{detailsRecord.id}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Industry</span><b>{detailsRecord.industry}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Website</span><a href={`https://${detailsRecord.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>{detailsRecord.website}</a></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Address</span><b>{detailsRecord.address}</b></div>
              </div>
              <div>
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>Contact Info</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Contact Person</span><b>{detailsRecord.contactPerson}</b></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Mobile</span><b>{detailsRecord.mobile}</b></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Email</span><b>{detailsRecord.email}</b></div>
                 
                 <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px', marginTop: '24px' }}>CRM Info</h4>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Priority</span><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(detailsRecord.priority)}`}>{detailsRecord.priority}</span></div>
                 <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Added By</span><b>{detailsRecord.addedBy}</b></div>
                 <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Created On</span><b>{detailsRecord.createdOn}</b></div>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
               <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '12px' }}>Notes</h4>
               <p style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{detailsRecord.notes}</p>
            </div>
          </GenericModal>
        )}

        {editRecord && (
          <GenericModal title="Edit Business" onClose={() => setEditRecord(null)} onSave={() => { setEditRecord(null); showToast('Business updated'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Business Name</label><input type="text" defaultValue={editRecord.name} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Industry</label><select defaultValue={editRecord.industry} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{industries.map(t=><option key={t}>{t}</option>)}</select></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Address</label><input type="text" defaultValue={editRecord.address} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Website</label><input type="text" defaultValue={editRecord.website} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Person</label><input type="text" defaultValue={editRecord.contactPerson} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mobile</label><input type="text" defaultValue={editRecord.mobile} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
               <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</label><select defaultValue={editRecord.priority} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{priorities.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes</label><textarea rows={3} defaultValue={editRecord.notes} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} /></div>
          </GenericModal>
        )}

        {activityRecord && (
          <GenericModal title={`Activity: ${activityRecord.name}`} onClose={() => setActivityRecord(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}><CheckSquare size={18} /></div>
                <div><div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Business Created</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>by {activityRecord.addedBy} on {activityRecord.createdOn}</div></div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}><MessageCircle size={18} /></div>
                <div><div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Note Added</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"Initial contact established." by System</div></div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}><UserPlus size={18} /></div>
                <div><div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Lead Assigned</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned to {activityRecord.addedBy}</div></div>
              </div>
            </div>
          </GenericModal>
        )}

        {noteRecord && (
          <GenericModal title="Add Note" onClose={() => setNoteRecord(null)} onSave={() => { setNoteRecord(null); showToast('Note added'); }}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Add Note for {noteRecord.name}</label><textarea rows={4} placeholder="Type your note here..." style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} /></div>
          </GenericModal>
        )}

        {assignRecord && (
          <GenericModal title="Assign Owner" onClose={() => setAssignRecord(null)} onSave={() => { setAssignRecord(null); showToast('Owner updated'); }}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assign New Owner for {assignRecord.name}</label><select defaultValue={assignRecord.addedBy} style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{addedByList.map(t=><option key={t}>{t}</option>)}</select></div>
          </GenericModal>
        )}
      </AnimatePresence>
    </div>
  );
}
