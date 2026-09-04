import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, ChevronDown, ChevronLeft, ChevronRight, 
  MoreVertical, FileUp, CheckCircle, AlertCircle, Eye, FileSpreadsheet, 
  Download, RefreshCw, RotateCcw, Trash2, Calendar, FileText, UploadCloud, Users, Mail, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenericModal } from '@/components/leads/GenericModal';
import { createPortal } from 'react-dom';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';


type UploadRecord = {
  id: string;
  listName: string;
  listStatus: string;
  success: number;
  duplicate: number;
  doNotTrack: number;
  invalidNumber: number;
  invalidEmail: number;
  failed: number;
  distribution: string;
  uploadedFile: string;
  listDescription: string;
  tags: string[];
  uploadedBy: string;
  bulkUploadSource: string;
  createdOn: string;
  totalRecords: number;
};


// --- Specific Upload Data (Student Performance Prediction) ---




export function LeadsUploadsView({ newUploadEvent }: { newUploadEvent?: any }) {
  const { uploads, deleteUpload, leads } = useCRM();

  

  
  // Header States
  const [searchQuery, setSearchQuery] = useState('');
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('All Time');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Action States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  const [viewDetails, setViewDetails] = useState<UploadRecord | null>(null);
  const [fileDetails, setFileDetails] = useState<UploadRecord | null>(null);
    const [genericActionModal, setGenericActionModal] = useState<{title: string, message: string, action: string} | null>(null);
  const [viewLeadsModal, setViewLeadsModal] = useState<{title: string, type: 'active' | 'inactive' | 'duplicate'} | null>(null);

  const handleGenericAction = (action: string) => {
    if (action === 'View Leads' || action === 'View Active Leads') { setViewLeadsModal({ title: 'View Active Leads', type: 'active' }); return; }
    if (action === 'View Inactive Leads') { setViewLeadsModal({ title: 'View Inactive Leads', type: 'inactive' }); return; }
    if (action === 'View Duplicates') { setViewLeadsModal({ title: 'View Duplicates', type: 'duplicate' }); return; }
    
    let title = '';
    let message = '';
    if (action === 'Download') { title = 'Download'; message = `Ready to export structured Excel file for ${selectedIds.length} upload(s) containing only associated leads.`; }
    else if (action === 'Delete') { title = 'Delete Upload & Leads'; message = `Are you sure you want to permanently delete ${selectedIds.length} upload(s) and all associated leads? This action cannot be undone.`; }
    else if (action === 'Create WhatsApp Campaign') { 
      const activeLeadsCount = leads.filter(l => selectedIds.includes(l.uploadId) && (l.status === 'Active' || l.active)).length;
      title = 'Create WhatsApp Campaign'; 
      message = `Launch a WhatsApp campaign specifically targeting the ${activeLeadsCount} active leads belonging to this upload.`; 
    }
    
    setGenericActionModal({ title, message, action });
  };
  
  const confirmGenericAction = () => {
    if (genericActionModal?.action === 'Delete') {
      selectedIds.forEach(id => deleteUpload(id));
      alert(`${selectedIds.length} upload(s) deleted successfully.`);
      setSelectedIds([]);
    } else {
      alert(`${genericActionModal?.title} action completed successfully.`);
      setSelectedIds([]);
    }
    setGenericActionModal(null);
  };


  


  // Close menus
  useEffect(() => {
    const handleClickOutside = () => {
      setDateMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter Logic
  const filteredUploads = useMemo(() => {
    return uploads.filter(u => {
      const matchSearch = u.listName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.uploadedFile.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchDate = true;
      const uploadDate = new Date(u.createdOn);
      const now = new Date();
      
      if (dateFilter === 'Today') {
        matchDate = uploadDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'Yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        matchDate = uploadDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchDate = uploadDate >= sevenDaysAgo;
      } else if (dateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchDate = uploadDate >= thirtyDaysAgo;
      } else if (dateFilter === 'This Week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        matchDate = uploadDate >= startOfWeek;
      } else if (dateFilter === 'This Month') {
        matchDate = uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === 'Last Month') {
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        if (lastMonth < 0) { lastMonth = 11; year--; }
        matchDate = uploadDate.getMonth() === lastMonth && uploadDate.getFullYear() === year;
      }

      return matchSearch && matchDate;
    }).sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
  }, [uploads, searchQuery, dateFilter]);

  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const currentData = filteredUploads.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(currentData.map(u => u.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

    const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Top Header / Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', background: '#ffffff', zIndex: 12 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setDateMenuOpen(!dateMenuOpen); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}
            >
              <Calendar size={18} color="var(--text-tertiary)" />
              {dateFilter} <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {dateMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Week', 'This Month', 'Last Month', 'Custom Range'].map(opt => (
                    <button key={opt} onClick={() => { setDateFilter(opt); setDateMenuOpen(false); setPage(1); }} 
                      style={{ padding: '8px 12px', background: dateFilter === opt ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: dateFilter === opt ? 600 : 400 }}>
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', width: '300px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search uploads..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

           
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '24px', zIndex: 11 }}>
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>✓ {selectedIds.length} List{selectedIds.length > 1 ? 's' : ''} Selected</span>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button onClick={() => handleGenericAction('View Active Leads')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>View Active Leads</button>
             <button onClick={() => handleGenericAction('View Inactive Leads')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>View Inactive Leads</button>
             <button onClick={() => handleGenericAction('View Duplicates')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>View Duplicates</button>
             <button onClick={() => handleGenericAction('Download')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Download</button>
             <button onClick={() => handleGenericAction('Create WhatsApp Campaign')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Create WhatsApp Campaign</button>
             <button onClick={() => handleGenericAction('Delete')} style={{ padding: '8px 16px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Delete List & Leads</button>
          </div>
        </motion.div>
      )}

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '2200px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ width: '48px', padding: '16px', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={currentData.length > 0 && selectedIds.length === currentData.length} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
              </th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '220px' }}>List Name</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>List Status</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '100px' }}>Success</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '100px' }}>Duplicate</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>Do Not Track</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>Invalid Number</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>Invalid Email</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '120px' }}>Other Failed</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>Distribution</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '200px' }}>Uploaded File</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '220px' }}>List Description</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Tags</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>Uploaded By</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Bulk Upload Source</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Created On</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.includes(row.id) ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.2s' }}
                onMouseOver={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                onMouseOut={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = 'transparent' }}>
                
                <td style={{ padding: '16px', textAlign: 'center' }}><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={(e) => handleSelectRow(row.id, e)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} /></td>
                
                <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => setViewDetails(row)}>
                  <span style={{ borderBottom: '1px dashed var(--primary-color)' }}>{row.listName}</span>
                </td>
                
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, 
                     background: row.listStatus.includes('Completed') ? '#dcfce7' : (row.listStatus === 'Processing' ? '#fef9c3' : '#fee2e2'),
                     color: row.listStatus.includes('Completed') ? '#166534' : (row.listStatus === 'Processing' ? '#854d0e' : '#991b1b') }}>
                    {row.listStatus}
                  </span>
                </td>
                
                <td style={{ padding: '16px', color: '#16a34a', fontWeight: 600 }}>{row.success}</td>
                <td style={{ padding: '16px', color: '#eab308', fontWeight: 600 }}>{row.duplicate}</td>
                <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.doNotTrack}</td>
                <td style={{ padding: '16px', color: '#dc2626', fontWeight: 600 }}>{row.invalidNumber}</td>
                <td style={{ padding: '16px', color: '#dc2626', fontWeight: 600 }}>{row.invalidEmail}</td>
                <td style={{ padding: '16px', color: '#991b1b', fontWeight: 600 }}>{row.failed}</td>
                
                <td style={{ padding: '16px' }}>{row.distribution}</td>
                <td style={{ padding: '16px' }}><div onClick={() => setFileDetails(row)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary-color)' }}><FileSpreadsheet size={16} color="var(--primary-color)"/> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px', borderBottom: '1px dashed var(--primary-color)' }} title={row.uploadedFile}>{row.uploadedFile}</span></div></td>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={row.listDescription}>
                    {row.listDescription || '-'}
                  </div>
                </td>
                
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {row.tags.map(t => <span key={t} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{t}</span>)}
                  </div>
                </td>
                
                <td style={{ padding: '16px' }}>{row.uploadedBy}</td>
                <td style={{ padding: '16px' }}>{row.bulkUploadSource}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{formatDate(row.createdOn)}</td>
              </tr>
            )) : (
              <tr><td colSpan={16} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No uploads found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)', zIndex: 11 }}>
         <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Showing {Math.min((page - 1) * itemsPerPage + 1, filteredUploads.length)} to {Math.min(page * itemsPerPage, filteredUploads.length)} of {filteredUploads.length} entries</span>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
         </div>
      </div>

      <AnimatePresence>
        



        {viewLeadsModal && (
          <GenericModal key="view-leads" title={`${viewLeadsModal.title}: ${uploads.find(l => l.id === selectedIds[0])?.listName || 'Selected List'}`} width="1000px" onClose={() => setViewLeadsModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--primary-color)' }}>
                Showing Filtered Leads — {leads.filter(l => selectedIds.includes(l.uploadId) && (viewLeadsModal.type === 'duplicate' ? l.duplicate : ((l.status === 'Active' || l.active) === (viewLeadsModal.type === 'active')))).length}
              </div>
              
              <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '12px' }}>Lead Name</th>
                      <th style={{ padding: '12px' }}>Lead Owner</th>
                      <th style={{ padding: '12px' }}>Mobile Number</th>
                      <th style={{ padding: '12px' }}>Email</th>
                      <th style={{ padding: '12px' }}>Lead Stage</th>
                      <th style={{ padding: '12px' }}>Lead Priority</th>
                      {viewLeadsModal.type === 'duplicate' && <th style={{ padding: '12px', color: '#dc2626' }}>Duplicate Reason</th>}
                      <th style={{ padding: '12px' }}>Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l => selectedIds.includes(l.uploadId) && (viewLeadsModal.type === 'duplicate' ? l.duplicate : ((l.status === 'Active' || l.active) === (viewLeadsModal.type === 'active')))).length > 0 ? (
                      leads.filter(l => selectedIds.includes(l.uploadId) && (viewLeadsModal.type === 'duplicate' ? l.duplicate : ((l.status === 'Active' || l.active) === (viewLeadsModal.type === 'active')))).map(lead => (
                        <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{lead.name}</td>
                          <td style={{ padding: '12px' }}>{lead.owner}</td>
                          <td style={{ padding: '12px' }}>{lead.mobile}</td>
                          <td style={{ padding: '12px' }}>{lead.email}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>{lead.stage}</span>
                          </td>
                          <td style={{ padding: '12px' }}>{lead.priority}</td>
                          {viewLeadsModal.type === 'duplicate' && <td style={{ padding: '12px', color: '#dc2626', fontWeight: 600 }}>{lead.dupReason}</td>}
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{lead.created}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                          No {viewLeadsModal.type} leads found for this list.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GenericModal>
        )}

        {genericActionModal && (
          <GenericModal key="generic-action" title={genericActionModal.title} onClose={() => setGenericActionModal(null)} saveText={genericActionModal.action === 'Delete' ? 'Confirm Delete' : 'Continue'} onSave={confirmGenericAction}>
             <div style={{ padding: '20px 0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
               {genericActionModal.message}
             </div>
          </GenericModal>
        )}

        {fileDetails && (
          <GenericModal key="file-details" title={`Uploaded File Details`} width="600px" onClose={() => setFileDetails(null)}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <FileSpreadsheet size={20} color="var(--primary-color)" /> {fileDetails.uploadedFile}
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px', fontSize: '0.9rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>File Type:</span> <span style={{ fontWeight: 500 }}>{fileDetails.uploadedFile.split('.').pop()?.toUpperCase()}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>File Size:</span> <span style={{ fontWeight: 500 }}>{(fileDetails.totalRecords * 1.5).toFixed(1)} KB</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Uploaded By:</span> <span style={{ fontWeight: 500 }}>{fileDetails.uploadedBy}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Uploaded On:</span> <span style={{ fontWeight: 500 }}>{formatDate(fileDetails.createdOn)}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Source:</span> <span style={{ fontWeight: 500 }}>{fileDetails.bulkUploadSource}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>List Name:</span> <span style={{ fontWeight: 500 }}>{fileDetails.listName}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Status:</span> <span style={{ fontWeight: 600, color: fileDetails.listStatus.includes('Completed') ? '#166534' : '#991b1b' }}>{fileDetails.listStatus}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Distribution:</span> <span style={{ fontWeight: 500 }}>{fileDetails.distribution}</span></div>
                   </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Processing Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f0fdf4', borderRadius: '6px' }}><span style={{ color: '#166534' }}>Total Records:</span> <span style={{ fontWeight: 600, color: '#166534' }}>{fileDetails.totalRecords}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f0fdf4', borderRadius: '6px' }}><span style={{ color: '#166534' }}>Success:</span> <span style={{ fontWeight: 600, color: '#166534' }}>{fileDetails.success}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#fefce8', borderRadius: '6px' }}><span style={{ color: '#854d0e' }}>Duplicate:</span> <span style={{ fontWeight: 600, color: '#854d0e' }}>{fileDetails.duplicate}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}><span style={{ color: '#475569' }}>Do Not Track:</span> <span style={{ fontWeight: 600, color: '#475569' }}>{fileDetails.doNotTrack}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#fef2f2', borderRadius: '6px' }}><span style={{ color: '#991b1b' }}>Invalid Number:</span> <span style={{ fontWeight: 600, color: '#991b1b' }}>{fileDetails.invalidNumber}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#fef2f2', borderRadius: '6px' }}><span style={{ color: '#991b1b' }}>Invalid Email:</span> <span style={{ fontWeight: 600, color: '#991b1b' }}>{fileDetails.invalidEmail}</span></div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#fef2f2', borderRadius: '6px' }}><span style={{ color: '#991b1b' }}>Other Failed:</span> <span style={{ fontWeight: 600, color: '#991b1b' }}>{fileDetails.failed}</span></div>
                  </div>
                </div>
             </div>
          </GenericModal>
        )}

        {viewDetails && (
          <GenericModal key="view-details" title={`Upload Details: ${viewDetails.listName}`} width="800px" onClose={() => setViewDetails(null)}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                   <div><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</span><br/><span style={{ fontWeight: 600, color: viewDetails.listStatus.includes('Completed') ? '#166534' : '#991b1b' }}>{viewDetails.listStatus}</span></div>
                   <div><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Uploaded</span><br/><span style={{ fontWeight: 600 }}>{viewDetails.totalRecords}</span></div>
                   <div><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploaded By</span><br/><span style={{ fontWeight: 600 }}>{viewDetails.uploadedBy}</span></div>
                   <div><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Created On</span><br/><span style={{ fontWeight: 600 }}>{formatDate(viewDetails.createdOn)}</span></div>
                </div>

                <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      <tr>
                        <th style={{ padding: '12px' }}>List Name</th>
                        <th style={{ padding: '12px', color: '#16a34a' }}>Success</th>
                        <th style={{ padding: '12px', color: '#eab308' }}>Duplicate</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Do Not Track</th>
                        <th style={{ padding: '12px', color: '#dc2626' }}>Invalid Number</th>
                        <th style={{ padding: '12px', color: '#dc2626' }}>Invalid Email</th>
                        <th style={{ padding: '12px', color: '#991b1b' }}>Other Failed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{viewDetails.listName}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#16a34a' }}>{viewDetails.success}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#eab308' }}>{viewDetails.duplicate}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#64748b' }}>{viewDetails.doNotTrack}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#dc2626' }}>{viewDetails.invalidNumber}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#dc2626' }}>{viewDetails.invalidEmail}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#991b1b' }}>{viewDetails.failed}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                   <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Other Details</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Uploaded File:</span> <b>{viewDetails.uploadedFile}</b></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Distribution:</span> <b>{viewDetails.distribution}</b></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bulk Source:</span> <b>{viewDetails.bulkUploadSource}</b></div>
                      </div>
                   </div>
                </div>
             </div>
          </GenericModal>
        )}
      </AnimatePresence>
    </div>
  );
}
