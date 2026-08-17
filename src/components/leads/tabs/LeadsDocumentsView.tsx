'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, RefreshCw, MoreVertical, FileText, Image as ImageIcon, Download, Trash2, Edit2, Clock, UploadCloud, X, CheckSquare, Calendar, PhoneCall, Mail, MessageCircle, FileDown, Eye } from 'lucide-react';
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

// --- Mock Data Generators ---
const names = ['Rahul Sharma', 'Priya Nair', 'Arjun Kumar', 'Sneha Patel', 'Pavan Sadanand', 'Ananya Rao', 'Vikram Singh', 'Neha Verma', 'Amit Joshi'];
const docTypes = ['Identity Proof', 'PAN Card', 'Address Proof', 'Education Certificate', 'Application Form', 'Admission Documents', 'Payment Receipt', 'Offer Letter', 'Supporting Documents', 'Profile Photo'];
const statuses = ['Verified', 'Pending Review', 'Rejected', 'Missing', 'Expired'];

const generateActiveLeads = () => {
  return names.map((name, i) => ({
    id: `L-${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    mobile: `+91 98${String(10000000 + i * 12345).substring(0, 8)}`,
    owner: names[(i + 2) % names.length],
    leadStage: ['New Lead', 'Working', 'Qualified', 'Converted', 'Lost'][i % 5],
    status: ['Active', 'Inactive', 'Closed'][i % 3],
    leadPriority: ['High', 'Medium', 'Low'][i % 3],
    leadSource: ['Website', 'Referral', 'Social Media', 'Direct'][i % 4],
    campaign: ['Q1 Marketing', 'Summer Promo', 'Google Ads', 'None'][i % 4],
    primaryTeam: ['Sales North', 'Sales South', 'Enterprise', 'SMB'][i % 4],
    leadType: ['B2B', 'B2C', 'Enterprise'][i % 3],
    businessAddress: `${100 + i} Main Street, Tech Park`,
    city: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'][i % 4],
    state: 'Karnataka',
    area: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout'][i % 4],
    country: 'India',
    zipCode: `5600${String(i % 99).padStart(2, '0')}`,
    lastEngagement: `2024-04-${String(10 + (i % 15)).padStart(2, '0')}`,
    lastCall: '10:00 AM today',
    lastEmail: 'Yesterday',
    lastWhatsApp: '2 days ago',
    lastVisit: 'Never',
    nextFollowUp: `2024-05-${String(1 + (i % 28)).padStart(2, '0')}`,
    lastPaymentStatus: ['Paid', 'Pending', 'Overdue'][i % 3],
    lastPaymentAmount: `$${((i % 10) + 1) * 1000}`,
    totalPayment: `$${((i % 10) + 1) * 5000}`,
    profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  }));
};

const generateDocumentsForLead = (leadId: string, leadName: string) => {
  const docs = [];
  // Ensure profile photo exists
  docs.push({
    id: `DOC-${leadId}-0`,
    leadId,
    leadName,
    name: `${leadName.replace(' ', '_')}_Profile.jpg`,
    type: 'Profile Photo',
    uploadDate: '2024-04-01',
    fileType: 'image/jpeg',
    fileSize: '245 KB',
    uploadedBy: leadName,
    status: 'Verified',
    notes: 'Primary profile photo.'
  });
  
  if (leadName === 'Rahul Sharma') {
    docs.push({
      id: `DOC-${leadId}-resume`,
      leadId,
      leadName,
      name: `Resume_Rahul_Sharma.pdf`,
      type: 'Resume',
      uploadDate: `2024-05-10`,
      fileType: 'application/pdf',
      fileSize: `1.2 MB`,
      uploadedBy: 'Current User',
      status: 'Verified',
      notes: `Standard upload for Resume.`
    });
  }
  
  // Random other docs
  const numDocs = 3 + (parseInt(leadId.split('-')[1]) % 5);
  for(let i = 1; i <= numDocs; i++) {
    const type = docTypes[(i + parseInt(leadId.split('-')[1])) % docTypes.length];
    const isPdf = type !== 'Profile Photo';
    docs.push({
      id: `DOC-${leadId}-${i}`,
      leadId,
      leadName,
      name: `${type.replace(' ', '_')}_${leadName.replace(' ', '_')}.${isPdf ? 'pdf' : 'jpg'}`,
      type,
      uploadDate: `2024-04-${String(5 + i).padStart(2, '0')}`,
      fileType: isPdf ? 'application/pdf' : 'image/jpeg',
      fileSize: `${(i * 1.5).toFixed(1)} MB`,
      uploadedBy: names[(i + 3) % names.length],
      status: statuses[(i + parseInt(leadId.split('-')[1])) % statuses.length],
      notes: `Standard upload for ${type}.`
    });
  }
  return docs;
};

// --- Modals & Popovers ---
const ActionDropdown = ({ isUp, onClose, onAction, doc }: any) => {
  const renderBtn = (label: string, icon: any, action: string) => (
    <button
      onClick={(e) => { e.stopPropagation(); onAction(action, doc); }}
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
        position: 'absolute',
        right: '10px',
        top: isUp ? 'auto' : '30px',
        bottom: isUp ? '30px' : 'auto',
        width: '200px',
        zIndex: 99,
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: 'var(--shadow-lg)',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderBtn('View / Preview', <Eye size={16} />, 'preview')}
      {renderBtn('Download', <Download size={16} />, 'download')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Edit Details', <Edit2 size={16} />, 'edit')}
      {renderBtn('Rename', <FileText size={16} />, 'rename')}
      {renderBtn('Replace Document', <RefreshCw size={16} />, 'replace')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('View Timeline', <Clock size={16} />, 'timeline')}
      {renderBtn('Delete', <Trash2 size={16} />, 'delete')}
    </motion.div>
  );
};

const GenericModal = ({ title, onClose, onSave, children }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width: '500px', maxWidth: '90vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="secondary-btn">Cancel</button>
          <button onClick={onSave} className="primary-btn">Save</button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const PreviewModal = ({ doc, onClose }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        style={{ background: 'var(--bg-primary)', display: 'flex', width: '900px', height: '600px', maxWidth: '95vw', maxHeight: '90vh', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 2, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--glass-border)' }}>
          {doc.fileType.includes('image') ? (
            <img src={doc.name.includes('Profile') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.leadName)}&background=random&size=300` : `https://placehold.co/600x400/e2e8f0/475569?text=${encodeURIComponent(doc.name)}`} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <FileText size={80} style={{ margin: '0 auto 16px' }} />
              <p>PDF Preview not available.</p>
              <button className="primary-btn" style={{ marginTop: '16px' }} onClick={() => showToast('Downloading file...')}>Download File</button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Document Details</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Document Name</span><br/><b>{doc.name}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Related Lead</span><br/><b>{doc.leadName}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type</span><br/><b>{doc.type}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</span><br/><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600 }}>{doc.status}</span></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>File Size</span><br/><b>{doc.fileSize}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upload Date</span><br/><b>{doc.uploadDate}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Uploaded By</span><br/><b>{doc.uploadedBy}</b></div>
            <div><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notes</span><br/><p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>{doc.notes || 'No notes provided.'}</p></div>
          </div>
          
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
             <button className="primary-btn" style={{ flex: 1 }} onClick={() => showToast('Document Downloaded')}><Download size={16} /> Download</button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// --- Main Component ---
export function LeadsDocumentsView() {
  const [leads] = useState(generateActiveLeads());


  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  
  // Document state
  const [allDocs, setAllDocs] = useState<any[]>([]);
  
  // Initialization: Generate docs for all leads
  useMemo(() => {
    let docs: any[] = [];
    leads.forEach(l => {
      docs = [...docs, ...generateDocumentsForLead(l.id, l.name)];
    });
    setAllDocs(docs);
  }, [leads]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  
  // Modals
  const [newDocLeadId, setNewDocLeadId] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState(docTypes[0]);
  const [newDocStatus, setNewDocStatus] = useState(statuses[0]);
  const [newDocNotes, setNewDocNotes] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);

  // Sync newDocLeadId with selectedLeadId if it changes
  useMemo(() => {
    if (selectedLeadId) setNewDocLeadId(selectedLeadId);
  }, [selectedLeadId]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  useGlobalEscape(!!filterOpen, () => { setFilterOpen(false) });
  const [filters, setFilters] = useState<{ type: string, status: string }>({ type: '', status: '' });
  
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  useGlobalEscape(!!previewDoc, () => { setPreviewDoc(null) });
  const [editDoc, setEditDoc] = useState<any>(null);
  const [timelineDoc, setTimelineDoc] = useState<any>(null);
  const [replaceDoc, setReplaceDoc] = useState<any>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const displayedDocs = useMemo(() => {
    let result = allDocs;
    if (selectedLeadId) {
      result = result.filter(d => d.leadId === selectedLeadId);
    }
    if (filters.type) {
      result = result.filter(d => d.type === filters.type);
    }
    if (filters.status) {
      result = result.filter(d => d.status === filters.status);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.type.toLowerCase().includes(q) || 
        d.status.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.leadName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allDocs, selectedLeadId, searchQuery, filters]);

  const handleAction = (action: string, doc: any) => {
    setActiveMenuId(null);
    if (action === 'preview' || action === 'view') setPreviewDoc(doc);
    else if (action === 'download') {
      const link = document.createElement('a');
      const content = `Mock Document Content for: ${doc.name}\n\nType: ${doc.type}\nStatus: ${doc.status}\nLead: ${doc.leadName}`;
      const blob = new Blob([content], { type: doc.fileType || 'text/plain' });
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${doc.name}`, 'success');
    }
    else if (action === 'edit' || action === 'rename') setEditDoc({...doc});
    else if (action === 'replace') setReplaceDoc(doc);
    else if (action === 'timeline') setTimelineDoc(doc);
    else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${doc.name}?`)) {
        setAllDocs(prev => prev.filter(d => d.id !== doc.id));
        showToast('Document deleted', 'success');
      }
    }
  };

  const handleAddDocSave = () => {
    if (!newDocLeadId) {
      showToast('Please select a person.', 'error');
      return;
    }
    if (!newDocFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    const targetLead = leads.find(l => l.id === newDocLeadId);
    const newDoc = {
      id: `DOC-${newDocLeadId}-${Date.now()}`,
      leadId: newDocLeadId,
      leadName: targetLead?.name || '',
      name: newDocName || newDocFile.name,
      type: newDocType,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: newDocFile.type || 'application/octet-stream',
      fileSize: (newDocFile.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadedBy: 'Current User',
      status: newDocStatus,
      notes: newDocNotes
    };
    setAllDocs([newDoc, ...allDocs]);
    setAddModalOpen(false);
    showToast('Document Added Successfully', 'success');
    
    // Reset state
    setNewDocLeadId('');
    setNewDocName('');
    setNewDocType(docTypes[0]);
    setNewDocStatus(statuses[0]);
    setNewDocNotes('');
    setNewDocFile(null);
  };

  const handleEditSave = () => {
    setAllDocs(prev => prev.map(d => d.id === editDoc.id ? editDoc : d));
    setEditDoc(null);
    showToast('Details Updated', 'success');
  };

  const handleRefresh = () => {
    showToast('Refreshing documents...', 'success');
    setTimeout(() => {
      showToast('Updated just now', 'success');
    }, 500);
  };  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
      
      {/* State A: No Lead Selected */}
      {!selectedLead && (
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
             <FileText size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>Document Management</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '32px' }}>Please select a lead to view and manage their documents. You can upload, verify, and organize files for specific individuals.</p>
          
          <div style={{ width: '300px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Select Lead</label>
            <select 
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-primary)', fontSize: '1rem', cursor: 'pointer' }}
            >
              <option value="">-- Choose a Lead --</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* State B: Lead Selected */}
      {selectedLead && (
        <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
          
          {/* Left Panel: Lead Profile */}
          <div className="glass-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Viewing Documents For</label>
              <select 
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 }}
              >
                <option value="">-- Clear Selection --</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
               <img src={selectedLead.profilePhoto} alt={selectedLead.name} style={{ width: '90px', height: '90px', borderRadius: '45px', objectFit: 'cover', border: '3px solid var(--bg-card)', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }} />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedLead.name}</h3>
               <p style={{ color: 'var(--text-secondary)' }}>ID: {selectedLead.id}</p>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Personal</h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Mobile:</span> <b>{selectedLead.mobile}</b></div>
                <div style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Email:</span> <b>{selectedLead.email}</b></div>
              </div>
              
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Lead Details</h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Owner:</span> <b>{selectedLead.owner}</b></div>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Stage:</span> <b>{selectedLead.leadStage}</b></div>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Source:</span> <b>{selectedLead.leadSource}</b></div>
                <div style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Team:</span> <b>{selectedLead.primaryTeam}</b></div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Location</h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Address:</span> <b>{selectedLead.businessAddress}</b></div>
                <div style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>City:</span> <b>{selectedLead.city}, {selectedLead.state}</b></div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Activity & Payment</h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Last Call:</span> <b>{selectedLead.lastCall}</b></div>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Follow-up:</span> <b>{selectedLead.nextFollowUp}</b></div>
                <div style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)', display: 'inline-block', width: '80px' }}>Payment:</span> <b style={{ color: selectedLead.lastPaymentStatus === 'Paid' ? '#10b981' : '#f59e0b' }}>{selectedLead.lastPaymentStatus} ({selectedLead.lastPaymentAmount})</b></div>
              </div>
            </div>
          </div>

          {/* Right Panel: Document Grid */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', flex: 1, maxWidth: '400px' }}>
                <Search size={18} color="var(--text-tertiary)" />
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginRight: '8px' }}>{displayedDocs.length} Docs</span>
                <button onClick={handleRefresh} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}><RefreshCw size={18} /></button>
                
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setFilterOpen(!filterOpen)} style={{ padding: '10px', background: (filters.type || filters.status) ? 'var(--primary-light)' : 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: (filters.type || filters.status) ? 'var(--primary-color)' : 'var(--text-secondary)' }}><Filter size={18} /></button>
                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: 'var(--shadow-md)', zIndex: 100, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Filters</h4>
                          {(filters.type || filters.status) && (
                            <button onClick={() => setFilters({ type: '', status: '' })} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All</button>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Document Type</label>
                          <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                            <option value="">All Types</option>
                            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                          <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }}>
                            <option value="">All Statuses</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={() => setAddModalOpen(true)} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={18} /> Add Document
                </button>
              </div>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {displayedDocs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)' }}>
                   <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                   <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>No documents found</h3>
                   <p>Try adjusting your search or add a new document.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {displayedDocs.map(doc => (
                    <div key={doc.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                         onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                         onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                         onClick={() => handleAction('preview', doc)}>
                      
                      {/* Thumbnail Area */}
                      <div style={{ height: '140px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--glass-border)' }}>
                        {doc.fileType.includes('image') ? (
                          <img src={doc.name.includes('Profile') ? `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.leadName)}&background=random&size=200` : `https://placehold.co/300x200/e2e8f0/475569?text=${encodeURIComponent(doc.name)}`} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FileText size={48} color="var(--text-tertiary)" />
                        )}
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                        
                        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                          <button className="icon-btn" onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                          }} style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                            <MoreVertical size={16} color="var(--text-primary)" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === doc.id && (
                              <ActionDropdown isUp={false} onClose={() => setActiveMenuId(null)} onAction={handleAction} doc={doc} />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Info Area */}
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.name}>{doc.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                           <span>{doc.type}</span>
                           <span>{doc.fileSize}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                           <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{doc.uploadDate}</span>
                           <span style={{ padding: '2px 8px', borderRadius: '4px', background: doc.status === 'Verified' ? '#dcfce7' : doc.status === 'Rejected' ? '#fee2e2' : 'var(--bg-secondary)', color: doc.status === 'Verified' ? '#166534' : doc.status === 'Rejected' ? '#991b1b' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>{doc.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Modals Rendering --- */}
      <AnimatePresence>
        {previewDoc && <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
        
        {addModalOpen && (
          <GenericModal title="Add New Document" onClose={() => setAddModalOpen(false)} onSave={handleAddDocSave}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Person *</label>
              <select value={newDocLeadId} onChange={e => setNewDocLeadId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="">-- Choose a Person --</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Document Name</label><input type="text" value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="e.g. Identity Proof (Optional)" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Document Type</label><select value={newDocType} onChange={e => setNewDocType(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{docTypes.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload File</label>
               <div 
                 onDragOver={e => e.preventDefault()} 
                 onDrop={e => { e.preventDefault(); if(e.dataTransfer.files && e.dataTransfer.files.length > 0) setNewDocFile(e.dataTransfer.files[0]); }}
                 onClick={() => document.getElementById('file-upload')?.click()}
                 style={{ marginTop: '4px', padding: '32px', border: '2px dashed var(--primary-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: newDocFile ? 'var(--primary-light)' : 'var(--bg-secondary)' }}
               >
                 <input type="file" id="file-upload" style={{ display: 'none' }} onChange={e => { if(e.target.files && e.target.files.length > 0) setNewDocFile(e.target.files[0]); }} />
                 {newDocFile ? (
                   <>
                     <FileText size={32} color="var(--primary-color)" style={{ margin: '0 auto 8px' }} />
                     <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>{newDocFile.name}</p>
                   </>
                 ) : (
                   <>
                     <UploadCloud size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 8px' }} />
                     <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Drag & drop file here, or click to select</p>
                   </>
                 )}
               </div>
            </div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</label><select value={newDocStatus} onChange={e => setNewDocStatus(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes</label><textarea rows={3} value={newDocNotes} onChange={e => setNewDocNotes(e.target.value)} placeholder="Optional notes..." style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} /></div>
          </GenericModal>
        )}

        {editDoc && (
          <GenericModal title="Edit Document Details" onClose={() => setEditDoc(null)} onSave={handleEditSave}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Document Name</label><input type="text" value={editDoc.name} onChange={e => setEditDoc({...editDoc, name: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} /></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Document Type</label><select value={editDoc.type} onChange={e => setEditDoc({...editDoc, type: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{docTypes.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</label><select value={editDoc.status} onChange={e => setEditDoc({...editDoc, status: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes</label><textarea rows={3} value={editDoc.notes} onChange={e => setEditDoc({...editDoc, notes: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} /></div>
          </GenericModal>
        )}

        {replaceDoc && (
          <GenericModal title="Replace Document" onClose={() => setReplaceDoc(null)} onSave={() => { 
            if(newDocFile) {
              setAllDocs(prev => prev.map(d => d.id === replaceDoc.id ? { ...d, name: newDocFile.name, fileSize: (newDocFile.size / 1024 / 1024).toFixed(2) + ' MB', fileType: newDocFile.type || 'application/octet-stream', uploadDate: new Date().toISOString().split('T')[0] } : d));
              setNewDocFile(null);
            }
            setReplaceDoc(null); 
            showToast('Document Replaced Successfully', 'success'); 
          }}>
            <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '8px', marginBottom: '16px' }}>
               <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>You are replacing <b>{replaceDoc.name}</b> for lead <b>{replaceDoc.leadName}</b>. The file type and metadata will be updated upon upload.</p>
            </div>
            <div>
               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload Replacement File</label>
               <div 
                 onDragOver={e => e.preventDefault()} 
                 onDrop={e => { e.preventDefault(); if(e.dataTransfer.files && e.dataTransfer.files.length > 0) setNewDocFile(e.dataTransfer.files[0]); }}
                 onClick={() => document.getElementById('replace-file-upload')?.click()}
                 style={{ marginTop: '4px', padding: '32px', border: '2px dashed var(--primary-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: newDocFile ? 'var(--primary-light)' : 'var(--bg-secondary)' }}
               >
                 <input type="file" id="replace-file-upload" style={{ display: 'none' }} onChange={e => { if(e.target.files && e.target.files.length > 0) setNewDocFile(e.target.files[0]); }} />
                 {newDocFile ? (
                   <>
                     <FileText size={32} color="var(--primary-color)" style={{ margin: '0 auto 8px' }} />
                     <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>{newDocFile.name}</p>
                   </>
                 ) : (
                   <>
                     <RefreshCw size={32} color="var(--primary-color)" style={{ margin: '0 auto 8px' }} />
                     <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select new file or drag and drop</p>
                   </>
                 )}
               </div>
            </div>
          </GenericModal>
        )}

        {timelineDoc && (
          <GenericModal title="Document Timeline" onClose={() => setTimelineDoc(null)} onSave={() => setTimelineDoc(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--text-tertiary)' }}><UploadCloud size={20} /></div>
                <div><div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Document Uploaded</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>by {timelineDoc.uploadedBy} on {timelineDoc.uploadDate}</div></div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--text-tertiary)' }}><Eye size={20} /></div>
                <div><div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Document Viewed</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>by Current User on 2024-05-01 10:23 AM</div></div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: 'var(--text-tertiary)' }}><Edit2 size={20} /></div>
                <div><div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Status updated to {timelineDoc.status}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>by Administrator on 2024-05-02 02:45 PM</div></div>
              </div>
            </div>
          </GenericModal>
        )}
      </AnimatePresence>

    </div>
  );
}
