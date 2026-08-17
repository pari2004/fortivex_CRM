'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Check, X as XIcon, Trash2, Edit2, Copy, Eye, Download, Users } from 'lucide-react';
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

// --- Demo Data ---
const initialLists = [
  {
    id: 'L-001',
    name: 'New Inquiry Leads',
    allowDuplicates: false,
    disallowAutoRechain: false,
    description: 'New inquiry leads collected from website and campaigns',
    owner: 'Admin User',
    contains: 1250,
    distribution: 'Assigned',
    createdDate: '2024-05-01',
    lastUpdated: '2024-05-10'
  },
  {
    id: 'L-002',
    name: 'High Priority Leads',
    allowDuplicates: true,
    disallowAutoRechain: false,
    description: 'High-priority leads requiring immediate follow-up',
    owner: 'Rahul Sharma',
    contains: 325,
    distribution: 'Assigned',
    createdDate: '2024-04-15',
    lastUpdated: '2024-05-09'
  },
  {
    id: 'L-003',
    name: 'Unworked Leads',
    allowDuplicates: false,
    disallowAutoRechain: true,
    description: 'Leads that have not received their first call',
    owner: 'Priya Nair',
    contains: 540,
    distribution: 'Kept Unassigned',
    createdDate: '2024-04-20',
    lastUpdated: '2024-05-08'
  },
  {
    id: 'L-004',
    name: 'Admissions Follow-up',
    allowDuplicates: false,
    disallowAutoRechain: true,
    description: 'Leads requiring admission follow-up',
    owner: 'Sales Team',
    contains: 280,
    distribution: 'Assigned',
    createdDate: '2024-03-10',
    lastUpdated: '2024-05-11'
  },
  {
    id: 'L-005',
    name: 'Marketing Campaign Leads',
    allowDuplicates: true,
    disallowAutoRechain: false,
    description: 'Leads generated through active marketing campaigns',
    owner: 'Marketing Team',
    contains: 875,
    distribution: 'Assigned',
    createdDate: '2024-02-15',
    lastUpdated: '2024-04-22'
  }
];

// Generate extra demo data to allow pagination
const generateExtraLists = () => {
  const owners = ['Admin User', 'Rahul Sharma', 'Priya Nair', 'Sales Team', 'Marketing Team'];
  const dist = ['Assigned', 'Kept Unassigned'];
  return Array.from({length: 20}).map((_, i) => ({
    id: `L-10${i}`,
    name: `Target Segment ${i + 1}`,
    allowDuplicates: i % 2 === 0,
    disallowAutoRechain: i % 3 === 0,
    description: `Auto-generated segment for demographic group ${i + 1}`,
    owner: owners[i % owners.length],
    contains: 100 + (i * 25),
    distribution: dist[i % dist.length],
    createdDate: '2024-05-01',
    lastUpdated: '2024-05-01'
  }));
};

const allMockLists = [...initialLists, ...generateExtraLists()];

// --- Reusable Toggle ---
const Toggle = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => {
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        width: '40px', height: '22px', background: isOn ? 'var(--primary-color)' : 'var(--border-color)',
        borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
      }}
    >
      <div style={{
        width: '18px', height: '18px', background: 'white', borderRadius: '50%',
        position: 'absolute', top: '2px', left: isOn ? '20px' : '2px', transition: 'left 0.3s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
      }} />
    </div>
  );
};

// --- Action Dropdown ---
const ActionDropdown = ({ isUp, onAction, list }: any) => {
  const renderBtn = (label: string, icon: any, action: string) => (
    <button
      onClick={(e) => { e.stopPropagation(); onAction(action, list); }}
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
        position: 'absolute', right: '30px', top: isUp ? 'auto' : '15px', bottom: isUp ? '30px' : 'auto',
        width: '180px', zIndex: 99, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px',
        boxShadow: 'var(--shadow-lg)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderBtn('View List', <Eye size={16} />, 'view')}
      {renderBtn('Edit List', <Edit2 size={16} />, 'edit')}
      {renderBtn('View Leads', <Users size={16} />, 'leads')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Duplicate List', <Copy size={16} />, 'duplicate')}
      {renderBtn('Export List', <Download size={16} />, 'export')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Delete List', <Trash2 size={16} />, 'delete')}
    </motion.div>
  );
};

// --- Modals ---
const GenericModal = ({ title, onClose, onSave, children, saveText = 'Save', width = '500px' }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
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


const CreateListModal = ({ onClose, onSave }: { onClose: () => void, onSave: (list: any) => void }) => {
  const [name, setName] = useState('');


  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [disallowAutoRechain, setDisallowAutoRechain] = useState(false);
  const [owner, setOwner] = useState('Admin User');
  const [contains, setContains] = useState(0);
  const [distribution, setDistribution] = useState('Assigned');

  const handleSave = () => {
    if (!name.trim()) {
      showToast('List Name is required', 'error');
      return;
    }
    const newList = {
      id: `L-${Date.now()}`,
      name,
      description: '', // Removing description as per instructions but keeping the field if needed by table
      allowDuplicates,
      disallowAutoRechain,
      owner,
      contains: Number(contains),
      distribution,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSave(newList);
  };

  return (
    <GenericModal title="Create List" saveText="Create List" onClose={onClose} onSave={handleSave}>
       <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter list name" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
       
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Owner</label><select value={owner} onChange={e => setOwner(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Admin User</option><option>Rahul Sharma</option><option>Priya Nair</option><option>Sales Team</option><option>Marketing Team</option></select></div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Distribution</label><select value={distribution} onChange={e => setDistribution(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Assigned</option><option>Kept Unassigned</option></select></div>
       </div>

       <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Contains (Number of Leads)</label><input type="number" value={contains} onChange={e => setContains(Number(e.target.value))} placeholder="0" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>

       <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={allowDuplicates} onChange={e => setAllowDuplicates(e.target.checked)} /> Allow Duplicates</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={disallowAutoRechain} onChange={e => setDisallowAutoRechain(e.target.checked)} /> Disallow Auto Rechain</label>
       </div>
    </GenericModal>
  );
};

export function LeadsSegmentsView() {
  const [lists, setLists] = useState(allMockLists);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown States
  const [allListsOpen, setAllListsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modals Data
  const [createModal, setCreateModal] = useState(false);
  const [editList, setEditList] = useState<any>(null);
  const [viewList, setViewList] = useState<any>(null);
  useGlobalEscape(!!viewList, () => { setViewList(null) });
  const [leadsList, setLeadsList] = useState<any>(null);
  
  const [listFilter, setListFilter] = useState('All Lists');

  // Header Filters
  const [filterMenu, setFilterMenu] = useState<string | null>(null);
  const [headerFilters, setHeaderFilters] = useState({
    name: '',
    allowDuplicates: '',
    disallowAutoRechain: '',
    owner: ''
  });

  // Filter & Search
  const filteredLists = useMemo(() => {
    let res = lists;
    
    // Apply List Filter
    if (listFilter === 'My Assigned Lists') {
      res = res.filter(l => l.owner === 'Admin User');
    } else if (listFilter === 'Recent Activity') {
      res = res.filter(l => l.lastUpdated.includes('2024-05'));
    }

    // Apply Header Filters
    if (headerFilters.name) {
      const q = headerFilters.name.toLowerCase();
      res = res.filter(l => l.name.toLowerCase().includes(q));
    }
    if (headerFilters.allowDuplicates !== '') {
      res = res.filter(l => l.allowDuplicates === (headerFilters.allowDuplicates === 'ON'));
    }
    if (headerFilters.disallowAutoRechain !== '') {
      res = res.filter(l => l.disallowAutoRechain === (headerFilters.disallowAutoRechain === 'ON'));
    }
    if (headerFilters.owner) {
      res = res.filter(l => l.owner === headerFilters.owner);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) || 
        l.owner.toLowerCase().includes(q)
      );
    }
    return res;
  }, [lists, searchQuery, listFilter, headerFilters]);

  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
  const currentData = filteredLists.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleToggleDuplicates = (id: string) => {
    setLists(lists.map(l => l.id === id ? { ...l, allowDuplicates: !l.allowDuplicates } : l));
  };

  const handleToggleRechain = (id: string) => {
    setLists(lists.map(l => l.id === id ? { ...l, disallowAutoRechain: !l.disallowAutoRechain } : l));
  };

  const handleAction = (action: string, list: any) => {
    setActiveMenuId(null);
    if (action === 'view') setViewList(list);
    else if (action === 'edit') setEditList(list);
    else if (action === 'leads') setLeadsList(list);
    else if (action === 'export') showToast(`Exporting ${list.name}...`);
    else if (action === 'duplicate') {
      const copy = { ...list, id: `L-${Date.now()}`, name: `${list.name} - Copy`, contains: 0 };
      setLists([copy, ...lists]);
      showToast('List duplicated successfully');
    }
    else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${list.name}?`)) {
        setLists(lists.filter(l => l.id !== list.id));
        showToast('List deleted', 'error');
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Top Header / Toolbar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', zIndex: 11 }}>
        
        {/* Left: Dropdown & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setAllListsOpen(!allListsOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {listFilter} <ChevronDown size={18} />
            </button>
            <AnimatePresence>
              {allListsOpen && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '250px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => { setListFilter('All Lists'); setAllListsOpen(false); }} style={{ padding: '10px 12px', background: listFilter === 'All Lists' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'All Lists' ? 600 : 400, cursor: 'pointer' }}>All Lists</button>
                  <button onClick={() => { setListFilter('My Assigned Lists'); setAllListsOpen(false); }} style={{ padding: '10px 12px', background: listFilter === 'My Assigned Lists' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'My Assigned Lists' ? 600 : 400, cursor: 'pointer' }}>My Assigned Lists</button>
                  <button onClick={() => { setListFilter('Recent Activity'); setAllListsOpen(false); }} style={{ padding: '10px 12px', background: listFilter === 'Recent Activity' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'Recent Activity' ? 600 : 400, cursor: 'pointer' }}>Recent Activity</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', width: '350px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search across Lists..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           <button onClick={() => setCreateModal(true)} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
             <Plus size={18} /> Create List
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1100px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '220px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  List Name <Filter size={14} color={headerFilters.name ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'name' ? null : 'name')} />
                  <AnimatePresence>
                    {filterMenu === 'name' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '200px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '12px', zIndex: 20, textTransform: 'none' }}>
                        <input type="text" placeholder="Filter by name..." value={headerFilters.name} onChange={e => setHeaderFilters({...headerFilters, name: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Allow Duplicates <Filter size={14} color={headerFilters.allowDuplicates ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'allowDuplicates' ? null : 'allowDuplicates')} />
                  <AnimatePresence>
                    {filterMenu === 'allowDuplicates' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '120px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {['', 'ON', 'OFF'].map(opt => (
                          <button key={opt} onClick={() => { setHeaderFilters({...headerFilters, allowDuplicates: opt}); setFilterMenu(null); }} style={{ padding: '8px', background: headerFilters.allowDuplicates === opt ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '4px', textAlign: 'left', cursor: 'pointer' }}>{opt || 'All'}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '180px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Disallow Auto Rechain <Filter size={14} color={headerFilters.disallowAutoRechain ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'disallowAutoRechain' ? null : 'disallowAutoRechain')} />
                  <AnimatePresence>
                    {filterMenu === 'disallowAutoRechain' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '120px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {['', 'ON', 'OFF'].map(opt => (
                          <button key={opt} onClick={() => { setHeaderFilters({...headerFilters, disallowAutoRechain: opt}); setFilterMenu(null); }} style={{ padding: '8px', background: headerFilters.disallowAutoRechain === opt ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '4px', textAlign: 'left', cursor: 'pointer' }}>{opt || 'All'}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Owner <Filter size={14} color={headerFilters.owner ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'owner' ? null : 'owner')} />
                  <AnimatePresence>
                    {filterMenu === 'owner' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '160px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                        <button onClick={() => { setHeaderFilters({...headerFilters, owner: ''}); setFilterMenu(null); }} style={{ padding: '8px', background: headerFilters.owner === '' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '4px', textAlign: 'left', cursor: 'pointer' }}>All Owners</button>
                        {Array.from(new Set(allMockLists.map(l => l.owner))).map(owner => (
                          <button key={owner} onClick={() => { setHeaderFilters({...headerFilters, owner}); setFilterMenu(null); }} style={{ padding: '8px', background: headerFilters.owner === owner ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '4px', textAlign: 'left', cursor: 'pointer' }}>{owner}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>List Contains</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Distribution</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>No lists found.</td></tr>
            ) : currentData.map((row, idx) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', height: '64px' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }} title={row.name}>{row.name}</td>
                <td style={{ padding: '16px' }}><Toggle isOn={row.allowDuplicates} onToggle={() => handleToggleDuplicates(row.id)} /></td>
                <td style={{ padding: '16px' }}><Toggle isOn={row.disallowAutoRechain} onToggle={() => handleToggleRechain(row.id)} /></td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }} title={row.owner}>{row.owner}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}><button onClick={() => handleAction('leads', row)} style={{ background: 'var(--primary-light)', border: 'none', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>{row.contains} Leads</button></td>
                <td style={{ padding: '16px' }}>
                   <span style={{ padding: '4px 8px', borderRadius: '4px', background: row.distribution === 'Assigned' ? '#dcfce7' : '#fef9c3', color: row.distribution === 'Assigned' ? '#166534' : '#854d0e', fontSize: '0.8rem', fontWeight: 600 }}>
                     {row.distribution}
                   </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                  <button onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', borderRadius: '4px' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {activeMenuId === row.id && (
                      <ActionDropdown isUp={idx > itemsPerPage - 4} onAction={handleAction} list={row} />
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <b>{filteredLists.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to {Math.min(page * itemsPerPage, filteredLists.length)} of {filteredLists.length}</b>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            Previous
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
            Next
          </button>
        </div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {createModal && (
          <CreateListModal 
            onClose={() => setCreateModal(false)} 
            onSave={(newList: any) => {
              setLists([newList, ...lists]);
              setCreateModal(false);
              showToast('List created successfully');
            }}
          />
        )}

        {editList && (
          <GenericModal title="Edit List" saveText="Save Changes" onClose={() => setEditList(null)} onSave={() => { setEditList(null); showToast('List updated successfully'); }}>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Name</label><input type="text" defaultValue={editList.name} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Owner</label><select defaultValue={editList.owner} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Admin User</option><option>Rahul Sharma</option><option>Priya Nair</option><option>Sales Team</option><option>Marketing Team</option></select></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Distribution</label><select defaultValue={editList.distribution} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Assigned</option><option>Kept Unassigned</option></select></div>
             </div>
          </GenericModal>
        )}

        {viewList && (
          <GenericModal title="List Details" onClose={() => setViewList(null)}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>List Name</span><br/><b>{viewList.name}</b></div>
                <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</span><br/><b>{viewList.description}</b></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Owner</span><br/><b>{viewList.owner}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Distribution</span><br/><b>{viewList.distribution}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Allow Duplicates</span><br/><b>{viewList.allowDuplicates ? 'ON' : 'OFF'}</b></div>
                   <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Disallow Rechain</span><br/><b>{viewList.disallowAutoRechain ? 'ON' : 'OFF'}</b></div>
                </div>
             </div>
          </GenericModal>
        )}

        {leadsList && (
          <GenericModal title={`Leads in ${leadsList.name}`} width="800px" onClose={() => setLeadsList(null)}>
             <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                 <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                   <tr>
                     <th style={{ padding: '12px' }}>Lead Name</th>
                     <th style={{ padding: '12px' }}>Mobile</th>
                     <th style={{ padding: '12px' }}>Stage</th>
                     <th style={{ padding: '12px' }}>Owner</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Array.from({length: 5}).map((_, i) => (
                     <tr key={i} style={{ borderTop: '1px solid var(--glass-border)' }}>
                       <td style={{ padding: '12px', fontWeight: 600 }}>Demo Lead {i + 1}</td>
                       <td style={{ padding: '12px' }}>+91 98000{1000 + i}</td>
                       <td style={{ padding: '12px' }}>Working</td>
                       <td style={{ padding: '12px' }}>{leadsList.owner}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '12px' }}>Showing 5 of {leadsList.contains} leads. Open full Leads view for all records.</p>
          </GenericModal>
        )}
      </AnimatePresence>
    </div>
  );
}
