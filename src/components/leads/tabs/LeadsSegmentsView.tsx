'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, MessageCircle, Share2, CheckSquare, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Check, X as XIcon, Trash2, Edit2, Copy, Eye, Download, Users, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';
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


// --- Specific Upload Data (Student Performance Prediction) ---
const studentPerformanceData = [
  { id: 'SPP-01', name: 'Aarav Patel', owner: 'Rahul Sharma', stage: 'New', priority: 'High', mobile: '+91 9876543210', email: 'aarav.p@example.com', created: '2026-08-18', active: true, duplicate: false },
  { id: 'SPP-02', name: 'Diya Singh', owner: 'Priya Nair', stage: 'Attempted', priority: 'Medium', mobile: '+91 9876543211', email: 'diya.s@example.com', created: '2026-08-18', active: true, duplicate: false },
  { id: 'SPP-03', name: 'Vihaan Kumar', owner: 'Rahul Sharma', stage: 'Contacted', priority: 'High', mobile: '+91 9876543212', email: 'vihaan.k@example.com', created: '2026-08-18', active: true, duplicate: false },
  { id: 'SPP-04', name: 'Ananya Gupta', owner: 'Admin User', stage: 'Closed Won', priority: 'High', mobile: '+91 9876543213', email: 'ananya.g@example.com', created: '2026-08-17', active: false, duplicate: false },
  { id: 'SPP-05', name: 'Aditya Reddy', owner: 'Admin User', stage: 'Closed Lost', priority: 'Low', mobile: '+91 9876543214', email: 'aditya.r@example.com', created: '2026-08-16', active: false, duplicate: false },
  { id: 'SPP-06', name: 'Aarav Patel', owner: 'Rahul Sharma', stage: 'Duplicate', priority: 'High', mobile: '+91 9876543210', email: 'aarav.p@example.com', created: '2026-08-18', active: false, duplicate: true, dupReason: 'Exact Match (Mobile)' }
];

// --- Demo Data ---
const initialLists = [
  {
    id: 'L-001',
    name: 'New Inquiry Leads',
    sourceCategory: 'External Lead Sources',
    allowDuplicates: false,
    disallowAutoRechain: false,
    description: 'New inquiry leads collected from website and campaigns',
    owner: 'Admin User',
    contains: 1250,
    distribution: 'Assigned',
    createdDate: '2024-05-01',
    lastUpdated: '2024-05-10',
    listType: 'Marketing',
    listCreationType: 'API',
    bulkUploadSource: 'N/A',
    listStatus: 'Active',
    createdOn: '2024-05-01'
  },
  {
    id: 'L-002',
    name: 'High Priority Leads',
    sourceCategory: 'Others - Created By Users',
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
    sourceCategory: 'Bulk Uploads',
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
    sourceCategory: 'External Lead Sources',
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
    sourceCategory: 'Bulk Uploads',
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
    sourceCategory: ['Bulk Uploads', 'External Lead Sources', 'Others - Created By Users'][i % 3],
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
        width: '56px', height: '30px', background: isOn ? '#2563eb' : '#e2e8f0',
        borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        width: '26px', height: '26px', background: 'white', borderRadius: '50%',
        position: 'absolute', top: '2px', left: isOn ? '28px' : '2px', transition: 'left 0.3s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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
  const [listType, setListType] = useState('Marketing');
  const [listCreationType, setListCreationType] = useState('Manual');
  const [bulkUploadSource, setBulkUploadSource] = useState('N/A');
  const [listStatus, setListStatus] = useState('Active');
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
    const newList: Omit<any, 'id'> = {
      
      name,
      description: '', 
      listType,
      listCreationType,
      bulkUploadSource,
      listStatus,
      createdOn: new Date().toISOString().split('T')[0],
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

export function LeadsSegmentsView({ newUploadEvent }: { newUploadEvent?: any }) {
  const { lists, addList, updateList, deleteList } = useCRM();  
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
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [distributeModal, setDistributeModal] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [genericActionModal, setGenericActionModal] = useState<{title: string, message: string, action: string} | null>(null);
  
  // Detailed Leads View State
  const [viewLeadsModal, setViewLeadsModal] = useState<{title: string, type: 'active' | 'inactive' | 'duplicate'} | null>(null);

  const handleGenericAction = (action: string) => {
    if (action === 'View Leads') {
      setViewLeadsModal({ title: 'View Leads', type: 'active' });
      return;
    }
    if (action === 'View Active Leads') {
      setViewLeadsModal({ title: 'View Active Leads', type: 'active' });
      return;
    }
    if (action === 'View Inactive Leads') {
      setViewLeadsModal({ title: 'View Inactive Leads', type: 'inactive' });
      return;
    }
    if (action === 'View Duplicates') {
      setViewLeadsModal({ title: 'View Duplicates', type: 'duplicate' });
      return;
    }
    
    let title = '';
    let message = '';
    if (action === 'Download') { title = 'Download Leads'; message = `Ready to export Excel file for ${selectedIds.length} list(s) containing only associated leads.`; }
    else if (action === 'Delete') { title = 'Delete List & Leads'; message = `Are you sure you want to permanently delete ${selectedIds.length} list(s) and all associated leads? This action cannot be undone.`; }
    
    setGenericActionModal({ title, message, action });
  };

  
  const confirmGenericAction = () => {
    if (genericActionModal?.action === 'Delete') {
      deleteList(selectedIds);
      showToast(`${selectedIds.length} list(s) deleted successfully.`);
      setSelectedIds([]);
    } else {
      showToast(`${genericActionModal?.title} action completed successfully.`);
      setSelectedIds([]);
    }
    setGenericActionModal(null);
  };

  const [confirmAllowDupModal, setConfirmAllowDupModal] = useState(false);
  const [confirmRechurnModal, setConfirmRechurnModal] = useState(false);
  const [targetActionId, setTargetActionId] = useState<string | null>(null);
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
    if (listFilter !== 'All Lists') {
      res = res.filter(l => l.sourceCategory === listFilter);
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


  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentData.map(d => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const selectedCount = selectedIds.length;

  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
  const currentData = filteredLists.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleToggleDuplicates = (id: string) => {
    const list = lists.find(l => l.id === id);
    if (!list) return;
    if (list.allowDuplicates) {
       // if turning off, just turn off without modal as per common UX
       const target = lists.find(l => l.id === id); if (target) updateList({ ...target, allowDuplicates: false });
    } else {
       setTargetActionId(id);
       setConfirmAllowDupModal(true);
    }
  };

  const handleToggleRechain = (id: string) => {
    const list = lists.find(l => l.id === id);
    if (!list) return;
    if (list.disallowAutoRechain) {
       // if turning off, just turn off
       const target = lists.find(l => l.id === id); if (target) updateList({ ...target, disallowAutoRechain: false });
    } else {
       setTargetActionId(id);
       setConfirmRechurnModal(true);
    }
  };

  const handleAction = (action: string, list: any) => {
    setActiveMenuId(null);
    if (action === 'view') setViewList(list);
    else if (action === 'edit') setEditList(list);
    else if (action === 'leads') setLeadsList(list);
    else if (action === 'export') showToast(`Exporting ${list.name}...`);
    else if (action === 'duplicate') {
      const { id: _id, ...copyData } = list;
      addList({ ...copyData, name: `${list.name} - Copy`, contains: 0 } as any);
      showToast('List duplicated successfully');
    }
    else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${list.name}?`)) {
        deleteList([list.id]);
        showToast('List deleted', 'error');
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Top Header / Toolbar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedCount > 0 ? '#e0e7ff' : 'var(--bg-card)', transition: 'background 0.3s ease', zIndex: 11 }}>
        {selectedCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 600 }}>
               <CheckCircle size={20} /> {selectedCount} List{selectedCount > 1 ? 's' : ''} Selected
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <button onClick={() => setLeadsList(lists.find(l => l.id === selectedIds[0]))} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Users size={16} /> View Leads
               </button>
               <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }} />
               <button onClick={() => setDistributeModal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Share2 size={16} /> Distribution
               </button>
               <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }} />
               <button onClick={() => setWhatsappModal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <MessageCircle size={16} /> Create WhatsApp Campaign
               </button>
               <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }} />
               <button onClick={() => setConfirmAllowDupModal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <CheckSquare size={16} /> Allow Duplicates
               </button>
               <div style={{ width: '1px', height: '16px', background: 'var(--glass-border)' }} />
               <button onClick={() => setConfirmRechurnModal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <ShieldAlert size={16} /> Disallow Auto Rechurn
               </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setAllListsOpen(!allListsOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              {listFilter} <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>{listFilter === 'All Lists' ? lists.length : lists.filter(l => l.sourceCategory === listFilter).length}</span> <ChevronDown size={18} />
            </button>
              <AnimatePresence>
              {allListsOpen && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '250px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => { setListFilter('All Lists'); setAllListsOpen(false); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: listFilter === 'All Lists' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'All Lists' ? 600 : 400, cursor: 'pointer', color: 'var(--text-primary)' }}><span>All Lists</span> <span style={{ color: 'var(--text-tertiary)' }}>{lists.length}</span></button>
                  <button onClick={() => { setListFilter('Bulk Uploads'); setAllListsOpen(false); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: listFilter === 'Bulk Uploads' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'Bulk Uploads' ? 600 : 400, cursor: 'pointer', color: 'var(--text-primary)' }}><span>Bulk Uploads</span> <span style={{ color: 'var(--text-tertiary)' }}>{lists.filter(l => l.sourceCategory === 'Bulk Uploads').length}</span></button>
                  <button onClick={() => { setListFilter('External Lead Sources'); setAllListsOpen(false); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: listFilter === 'External Lead Sources' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'External Lead Sources' ? 600 : 400, cursor: 'pointer', color: 'var(--text-primary)' }}><span>External Lead Sources</span> <span style={{ color: 'var(--text-tertiary)' }}>{lists.filter(l => l.sourceCategory === 'External Lead Sources').length}</span></button>
                  <button onClick={() => { setListFilter('Others - Created By Users'); setAllListsOpen(false); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: listFilter === 'Others - Created By Users' ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: listFilter === 'Others - Created By Users' ? 600 : 400, cursor: 'pointer', color: 'var(--text-primary)' }}><span>Others - Created By Users</span> <span style={{ color: 'var(--text-tertiary)' }}>{lists.filter(l => l.sourceCategory === 'Others - Created By Users').length}</span></button>
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
        )}
        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           {selectedCount === 0 && <button onClick={() => setCreateModal(true)} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
             <Plus size={18} /> Create List
           </button>}
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1800px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ width: '48px', padding: '16px', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={currentData.length > 0 && selectedIds.length === currentData.length} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
              </th>
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
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>List Type</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>List Creation Type</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Bulk Upload Source</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>List Status</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>Created On</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Allow Duplicates <Filter size={14} color={headerFilters.allowDuplicates ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'allowDuplicates' ? null : 'allowDuplicates')} />
                  <AnimatePresence>
                    {filterMenu === 'allowDuplicates' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '150px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none' }}>
                        <select value={headerFilters.allowDuplicates} onChange={e => setHeaderFilters({...headerFilters, allowDuplicates: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}>
                          <option value="">All</option><option value="ON">ON</option><option value="OFF">OFF</option>
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Disallow Rechurn <Filter size={14} color={headerFilters.disallowAutoRechain ? "var(--primary-color)" : "var(--text-tertiary)"} cursor="pointer" onClick={() => setFilterMenu(filterMenu === 'disallowAutoRechain' ? null : 'disallowAutoRechain')} />
                  <AnimatePresence>
                    {filterMenu === 'disallowAutoRechain' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, width: '150px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none' }}>
                        <select value={headerFilters.disallowAutoRechain} onChange={e => setHeaderFilters({...headerFilters, disallowAutoRechain: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}>
                          <option value="">All</option><option value="ON">ON</option><option value="OFF">OFF</option>
                        </select>
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
                        style={{ position: 'absolute', top: '100%', left: 0, width: '180px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', padding: '8px', zIndex: 20, textTransform: 'none' }}>
                        <select value={headerFilters.owner} onChange={e => setHeaderFilters({...headerFilters, owner: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}>
                          <option value="">All Owners</option><option value="Admin User">Admin User</option><option value="Rahul Sharma">Rahul Sharma</option><option value="Priya Nair">Priya Nair</option><option value="Sales Team">Sales Team</option><option value="Marketing Team">Marketing Team</option>
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>List Contains</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>Distribution</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row: any) => (
              <tr key={row.id} onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('input') || target.closest('.toggle-container') || target.closest('select')) return;
                  handleSelectRow(row.id, { target: { checked: !selectedIds.includes(row.id) } } as any);
                }} 
                style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.includes(row.id) ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseOver={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                onMouseOut={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: '16px', textAlign: 'center' }}><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={(e) => handleSelectRow(row.id, e)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} /></td>
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }} title={row.name}>{row.name}</td>
                <td style={{ padding: '16px' }}>{row.listType || '-'}</td>
                <td style={{ padding: '16px' }}>{row.listCreationType || '-'}</td>
                <td style={{ padding: '16px' }}>{row.bulkUploadSource || '-'}</td>
                <td style={{ padding: '16px' }}>
                   <span style={{ padding: '4px 8px', borderRadius: '4px', background: row.listStatus === 'Active' ? '#dcfce7' : '#f1f5f9', color: row.listStatus === 'Active' ? '#166534' : '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
                     {row.listStatus || '-'}
                   </span>
                </td>
                <td style={{ padding: '16px' }}>{row.createdOn || '-'}</td>
                <td style={{ padding: '16px' }}>
                  <div className="toggle-container">
                    <Toggle isOn={row.allowDuplicates} onToggle={() => handleToggleDuplicates(row.id)} />
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div className="toggle-container">
                    <Toggle isOn={row.disallowAutoRechain} onToggle={() => handleToggleRechain(row.id)} />
                  </div>
                </td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }} title={row.owner}>{row.owner}</td>
                <td style={{ padding: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}><button onClick={() => handleAction('leads', row)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }}>{row.contains} Leads</button></td>
                <td style={{ padding: '16px' }}>
                   <span style={{ padding: '4px 8px', borderRadius: '4px', background: row.distribution === 'Assigned' ? '#dbeafe' : '#fef3c7', color: row.distribution === 'Assigned' ? '#1e40af' : '#b45309', fontSize: '0.8rem', fontWeight: 600 }}>
                     {row.distribution}
                   </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                  <button onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <MoreVertical size={18} color="var(--text-tertiary)" />
                  </button>
                  <AnimatePresence>
                    {activeMenuId === row.id && <ActionDropdown isUp={false} onAction={handleAction} list={row} />}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={13} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No lists found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)', zIndex: 11 }}>
         <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Showing {Math.min((page - 1) * itemsPerPage + 1, filteredLists.length)} to {Math.min(page * itemsPerPage, filteredLists.length)} of {filteredLists.length} entries</span>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
         </div>
      </div>

      <AnimatePresence>
        {confirmRechurnModal && (
          <div key="rechurn-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }} onClick={() => { setConfirmRechurnModal(false); setTargetActionId(null); }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '500px', maxWidth: '95vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
               <button onClick={() => { setConfirmRechurnModal(false); setTargetActionId(null); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#a1a1aa' }}>
                  <XIcon size={24} />
               </button>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fdba74', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c', marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 600, lineHeight: 1 }}>!</span>
               </div>
               <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#3f3f46', marginBottom: '16px' }}>Disallow automatic rechurn?</h2>
               <p style={{ color: '#52525b', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '32px', padding: '0 20px' }}>
                 Turning this on will prevent automatic lead rechurn for {targetActionId ? (lists.find(l => l.id === targetActionId)?.name || 'this source') : `${selectedIds.length} selected source(s)`}.
               </p>
               <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
                  <button onClick={() => {
                      if (targetActionId) {
                         const target = lists.find(l => l.id === targetActionId); if (target) updateList({ ...target, disallowAutoRechain: true });
                      } else {
                         lists.filter(l => selectedIds.includes(l.id)).forEach(l => updateList({ ...l, disallowAutoRechain: true }));
                      }
                      setConfirmRechurnModal(false);
                      setTargetActionId(null);
                      if (!targetActionId) setSelectedIds([]);
                      showToast('Auto Rechurn disallowed');
                  }} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 500, cursor: 'pointer' }}>
                    Yes, disallow
                  </button>
                  <button onClick={() => { setConfirmRechurnModal(false); setTargetActionId(null); }} style={{ background: '#71717a', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 500, cursor: 'pointer' }}>
                    Cancel
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {confirmAllowDupModal && (
          <div key="allow-dup-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }} onClick={() => { setConfirmAllowDupModal(false); setTargetActionId(null); }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '500px', maxWidth: '95vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
               <button onClick={() => { setConfirmAllowDupModal(false); setTargetActionId(null); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#a1a1aa' }}>
                  <XIcon size={24} />
               </button>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fdba74', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c', marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 600, lineHeight: 1 }}>!</span>
               </div>
               <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#3f3f46', marginBottom: '16px' }}>Enable Duplicate Leads?</h2>
               <p style={{ color: '#52525b', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '32px', padding: '0 20px' }}>
                 Enabling this will allow duplicate leads to be inserted for {targetActionId ? (lists.find(l => l.id === targetActionId)?.name || 'this source') : `${selectedIds.length} selected source(s)`}. This may create redundant data. Are you sure you want to proceed?
               </p>
               <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
                  <button onClick={() => {
                      if (targetActionId) {
                         const target = lists.find(l => l.id === targetActionId); if (target) updateList({ ...target, allowDuplicates: true });
                      } else {
                         lists.filter(l => selectedIds.includes(l.id)).forEach(l => updateList({ ...l, allowDuplicates: true }));
                      }
                      setConfirmAllowDupModal(false);
                      setTargetActionId(null);
                      if (!targetActionId) setSelectedIds([]);
                      showToast('Duplicates enabled');
                  }} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 500, cursor: 'pointer' }}>
                    Yes, enable
                  </button>
                  <button onClick={() => { setConfirmAllowDupModal(false); setTargetActionId(null); }} style={{ background: '#71717a', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 500, cursor: 'pointer' }}>
                    Cancel
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {distributeModal && (
          <GenericModal key="distribute-modal" title={`Distribute Leads`} onClose={() => setDistributeModal(false)} saveText="Apply Distribution" onSave={() => { setDistributeModal(false); showToast('Distribution rules applied'); setSelectedIds([]); }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Configure lead assignment routing for the selected lists.</p>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assign To Team</label><select style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Select a Team...</option><option>Sales Team</option><option>Marketing Team</option></select></div>
          </GenericModal>
        )}

        {whatsappModal && (
          <GenericModal key="whatsapp-modal" title={`Create WhatsApp Campaign`} onClose={() => setWhatsappModal(false)} saveText="Launch Campaign" onSave={() => { setWhatsappModal(false); showToast('WhatsApp Campaign launched'); setSelectedIds([]); }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Target Audience: <b>Selected List(s)</b></p>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Campaign Name</label><input type="text" placeholder="e.g. Diwali Offer 2024" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
             <div style={{ marginTop: '16px' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Message Template</label><textarea rows={4} placeholder="Type your WhatsApp message..." style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'none' }} /></div>
          </GenericModal>
        )}

        {createModal && (
          <CreateListModal 
            key="create-modal"
            onClose={() => setCreateModal(false)} 
            onSave={(newList: any) => {
              addList(newList);
              setCreateModal(false);
              showToast('List created successfully');
            }}
          />
        )}

        {editList && (
          <GenericModal key="edit-modal" title="Edit List" saveText="Save Changes" onClose={() => setEditList(null)} onSave={() => { setEditList(null); showToast('List updated successfully'); }}>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Name</label><input type="text" defaultValue={editList.name} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Owner</label><select defaultValue={editList.owner} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Admin User</option><option>Rahul Sharma</option><option>Priya Nair</option><option>Sales Team</option><option>Marketing Team</option></select></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Distribution</label><select defaultValue={editList.distribution} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}><option>Assigned</option><option>Kept Unassigned</option></select></div>
             </div>
          </GenericModal>
        )}

        {viewList && (
          <GenericModal key="view-modal" title="List Details" onClose={() => setViewList(null)}>
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
          <GenericModal key="leads-modal" title={`Leads in ${leadsList.name}`} width="800px" onClose={() => setLeadsList(null)}>
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

