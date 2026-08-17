'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, Calendar, RefreshCw, Download, Plus, 
  Upload, FileUp, CheckCircle, AlertCircle, MoreVertical, 
  ChevronLeft, ChevronRight, X as XIcon, Eye, Trash2, RotateCcw,
  FileSpreadsheet, ArrowRight, Check, ChevronDown
} from 'lucide-react';
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
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

// --- Modals ---
const GenericModal = ({ title, onClose, children, width = '600px' }: any) => {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'white', padding: '24px', borderRadius: '16px', width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--glass-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><XIcon size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {children}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// --- Demo Data ---
type UploadRecord = {
  id: string;
  listName: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'Completed' | 'Processing' | 'Completed with Errors' | 'Failed';
  totalRecords: number;
  success: number;
  duplicate: number;
  doNotTrack: number;
  invalidNumber: number;
  invalidEmail: number;
  failed: number;
};

const initialUploads: UploadRecord[] = [
  {
    id: 'UP-1001',
    listName: 'Website Leads July',
    fileName: 'website-leads-july.xlsx',
    uploadDate: new Date().toISOString(),
    uploadedBy: 'Admin User',
    status: 'Completed',
    totalRecords: 1250,
    success: 1180,
    duplicate: 35,
    doNotTrack: 10,
    invalidNumber: 15,
    invalidEmail: 8,
    failed: 2
  },
  {
    id: 'UP-1002',
    listName: 'Facebook Campaign Q3',
    fileName: 'fb_campaign_q3.csv',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    uploadedBy: 'Rahul Sharma',
    status: 'Completed with Errors',
    totalRecords: 800,
    success: 750,
    duplicate: 20,
    doNotTrack: 0,
    invalidNumber: 10,
    invalidEmail: 5,
    failed: 15
  },
  {
    id: 'UP-1003',
    listName: 'Event Attendees NYC',
    fileName: 'event_nyc_leads.xlsx',
    uploadDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    uploadedBy: 'Priya Nair',
    status: 'Processing',
    totalRecords: 2400,
    success: 0,
    duplicate: 0,
    doNotTrack: 0,
    invalidNumber: 0,
    invalidEmail: 0,
    failed: 0
  },
  {
    id: 'UP-1004',
    listName: 'Old Database Export',
    fileName: 'old_db_export_2023.csv',
    uploadDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    uploadedBy: 'Admin User',
    status: 'Failed',
    totalRecords: 5000,
    success: 0,
    duplicate: 0,
    doNotTrack: 0,
    invalidNumber: 0,
    invalidEmail: 0,
    failed: 5000
  },
  {
    id: 'UP-1005',
    listName: 'Webinar Registrants',
    fileName: 'webinar_may.csv',
    uploadDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    uploadedBy: 'Marketing Team',
    status: 'Completed',
    totalRecords: 350,
    success: 350,
    duplicate: 0,
    doNotTrack: 0,
    invalidNumber: 0,
    invalidEmail: 0,
    failed: 0
  },
  {
    id: 'UP-1006',
    listName: 'Student Performance List',
    fileName: 'Student Performance.csv',
    uploadDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    uploadedBy: 'Admin User',
    status: 'Completed',
    totalRecords: 50,
    success: 48,
    duplicate: 1,
    doNotTrack: 0,
    invalidNumber: 1,
    invalidEmail: 0,
    failed: 0
  }
];

function UploadsActionDropdown({ isUp, onClose, onAction, targetRect }: any) {
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

  const renderBtn = (label: string, icon: any, action: string, color: string = 'var(--text-primary)') => (
    <button 
      onMouseDown={(e) => { e.stopPropagation(); onAction(action); onClose(); }}
      style={{ 
        padding: '12px 16px', 
        textAlign: 'left', 
        background: 'transparent', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        fontSize: '0.95rem', 
        color: color,
        width: '100%',
        fontWeight: 500,
        transition: 'background 0.2s',
        borderRadius: '6px'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> 
      <span>{label}</span>
    </button>
  );

  return createPortal(
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: isUp ? 10 : -10 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95, y: isUp ? 10 : -10 }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        right: Math.max(10, window.innerWidth - targetRect.right),
        top: isUp ? 'auto' : targetRect.bottom + 8,
        bottom: isUp ? window.innerHeight - targetRect.top + 8 : 'auto',
        width: '260px',
        zIndex: 99999,
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        transformOrigin: isUp ? 'bottom right' : 'top right'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderBtn('View Details', <Eye size={18} />, 'view')}
      {renderBtn('View Imported Records', <FileSpreadsheet size={18} />, 'view_imported')}
      {renderBtn('Download Original File', <Download size={18} />, 'download_original')}
      {renderBtn('Download Rejected Records', <Download size={18} />, 'download_rejected')}
      {renderBtn('Retry Failed Records', <RefreshCw size={18} />, 'retry_failed')}
      <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
      {renderBtn('Revert Import', <RotateCcw size={18} />, 'revert', 'var(--status-working)')}
      {renderBtn('Delete Upload', <Trash2 size={18} />, 'delete', 'var(--status-lost)')}
    </motion.div>,
    document.body
  );
}

export function LeadsUploadsView() {
  const [uploads, setUploads] = useState<UploadRecord[]>(initialUploads);


  
  // Header States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  
  const [dateFilter, setDateFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Action States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);
  const [menuIsUp, setMenuIsUp] = useState(false);
  const [viewDetails, setViewDetails] = useState<UploadRecord | null>(null);
  useGlobalEscape(!!viewDetails, () => { setViewDetails(null) });
  const [revertPrompt, setRevertPrompt] = useState<UploadRecord | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setFilterMenuOpen(false);
      setDateMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);
  
  // Import Options
  const [duplicateHandling, setDuplicateHandling] = useState('Skip Records');
  const [blankHandling, setBlankHandling] = useState('Always overwrite');
  const [selectedOwner, setSelectedOwner] = useState('Admin User');
  const [selectedList, setSelectedList] = useState('Website Leads');
  const [verifiedData, setVerifiedData] = useState(false);

  // Computed KPIs
  const kpis = useMemo(() => {
    let totalRecords = 0, success = 0, duplicate = 0, invalid = 0, failed = 0;
    uploads.forEach(u => {
      totalRecords += u.totalRecords;
      success += u.success;
      duplicate += u.duplicate;
      invalid += (u.invalidNumber + u.invalidEmail);
      failed += u.failed;
    });
    return { totalUploads: uploads.length, totalRecords, success, duplicate, invalid, failed };
  }, [uploads]);

  // Filtering Logic
  const filteredUploads = useMemo(() => {
    let res = uploads;
    
    // Status Filter
    if (statusFilter !== 'All Status') res = res.filter(u => u.status === statusFilter);
    
    // Date Filter Logic
    if (dateFilter !== 'All Time') {
      const now = new Date();
      res = res.filter(u => {
        const uDate = new Date(u.uploadDate);
        const msPerDay = 86400000;
        const diffMs = now.getTime() - uDate.getTime();
        
        if (dateFilter === 'Today') return diffMs < msPerDay && now.getDate() === uDate.getDate();
        if (dateFilter === 'Yesterday') return diffMs >= msPerDay && diffMs < 2*msPerDay;
        if (dateFilter === 'Last 7 Days') return diffMs <= 7*msPerDay;
        if (dateFilter === 'Last 30 Days') return diffMs <= 30*msPerDay;
        if (dateFilter === 'This Month') return now.getMonth() === uDate.getMonth() && now.getFullYear() === uDate.getFullYear();
        if (dateFilter === 'Last Month') {
          const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return uDate.getMonth() === lm.getMonth() && uDate.getFullYear() === lm.getFullYear();
        }
        return true;
      });
    }

    // KPI Filter
    if (kpiFilter === 'totalRecords') res = res.filter(u => u.totalRecords > 0);
    else if (kpiFilter === 'success') res = res.filter(u => u.success > 0);
    else if (kpiFilter === 'duplicate') res = res.filter(u => u.duplicate > 0);
    else if (kpiFilter === 'invalid') res = res.filter(u => (u.invalidNumber + u.invalidEmail) > 0);
    else if (kpiFilter === 'failed') res = res.filter(u => u.failed > 0);
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(u => 
        u.listName.toLowerCase().includes(q) ||
        u.fileName.toLowerCase().includes(q) ||
        u.uploadedBy.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
      );
    }
    
    return res;
  }, [uploads, searchQuery, statusFilter, dateFilter, kpiFilter]);

  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const currentData = filteredUploads.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // --- Handlers ---
  const handleAction = (action: string, record: UploadRecord) => {
    setActiveMenuId(null);
    setMenuTarget(null);
    if (action === 'view') setViewDetails(record);
    else if (action === 'download_original' || action === 'download_rejected') {
      const csvData = action === 'download_original' ? 'id,name\\n1,Test' : 'id,error\\n1,Invalid email';
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = action === 'download_original' ? record.fileName : `rejected_${record.fileName}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${action === 'download_original' ? 'Original File' : 'Rejected Records'}`);
    }
    else if (action === 'revert') setRevertPrompt(record);
    else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this upload history?')) {
        setUploads(uploads.filter(u => u.id !== record.id));
        showToast('Upload history deleted', 'error');
      }
    }
    else if (action === 'view_imported' || action === 'retry_failed') {
      showToast(`Action ${action} triggered for ${record.fileName}`);
    }
  };

  const confirmRevert = () => {
    if (revertPrompt) {
      setUploads(uploads.filter(u => u.id !== revertPrompt.id));
      setRevertPrompt(null);
      showToast('Import successfully reverted');
    }
  };

  const simulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWizardStep(5);
      const newRecord: UploadRecord = {
        id: `UP-${Date.now()}`,
        listName: selectedList,
        fileName: uploadedFile?.name || 'imported_file.csv',
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Admin User',
        status: 'Completed',
        totalRecords: 1250,
        success: 1180,
        duplicate: 35,
        doNotTrack: 0,
        invalidNumber: 15,
        invalidEmail: 10,
        failed: 10
      };
      setImportStats(newRecord);
      setUploads([newRecord, ...uploads]);
      showToast('Import completed successfully!');
    }, 2500);
  };

  const exportData = () => {
    if (filteredUploads.length === 0) {
      showToast('No records to export', 'error');
      return;
    }
    const headers = ['List Name', 'File Name', 'Upload Date', 'Uploaded By', 'Status', 'Total Records', 'Success', 'Duplicate', 'Do Not Track', 'Invalid Number', 'Invalid Email', 'Failed'];
    const rows = filteredUploads.map(r => [
      r.listName, r.fileName, new Date(r.uploadDate).toLocaleString(), r.uploadedBy, r.status, 
      r.totalRecords, r.success, r.duplicate, r.doNotTrack, r.invalidNumber, r.invalidEmail, r.failed
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Uploads_Export_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export successful');
  };

  // --- Renders ---
  
  if (isWizardOpen) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        {/* Wizard Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
           <div>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>New Lead Import</h2>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Follow the steps to securely import your leads.</p>
           </div>
           <button onClick={() => setIsWizardOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)' }}><XIcon size={24} /></button>
        </div>
        
        {/* Wizard Progress */}
        <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
           {[1, 2, 3, 4].map((step, idx) => (
             <React.Fragment key={step}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: wizardStep >= step ? 'var(--primary-color)' : 'var(--text-tertiary)', fontWeight: wizardStep >= step ? 600 : 400 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: wizardStep >= step ? 'var(--primary-color)' : 'var(--glass-border)', color: wizardStep >= step ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                    {wizardStep > step ? <Check size={14} /> : step}
                  </div>
                  {step === 1 && 'Select Module'}
                  {step === 2 && 'Upload File'}
                  {step === 3 && 'Map Fields'}
                  {step === 4 && 'Preview & Import'}
               </div>
               {idx < 3 && <ArrowRight size={16} color="var(--text-tertiary)" />}
             </React.Fragment>
           ))}
        </div>

        {/* Wizard Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '800px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)', padding: '32px' }}>
            
            {/* Step 1 */}
            {wizardStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Select Module</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Choose the module you want to import data into.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div style={{ border: '2px solid var(--primary-color)', background: 'var(--primary-light)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                     <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '4px solid var(--primary-color)', background: 'white' }} />
                     <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary-color)' }}>Leads</span>
                   </div>
                   <div style={{ border: '1px solid var(--glass-border)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5, cursor: 'not-allowed' }}>
                     <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--text-tertiary)' }} />
                     <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Contacts (Disabled)</span>
                   </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {wizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Upload File</h3>
                  <button onClick={() => showToast('Downloading template...')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Download size={16} /> Sample Template
                  </button>
                </div>
                
                {!uploadedFile ? (
                  <div style={{ border: '2px dashed var(--primary-color)', background: 'var(--primary-light)', borderRadius: '16px', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: 'var(--primary-color)' }}>
                      <FileUp size={32} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>Drag & Drop your file here</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Supports .csv, .xls, .xlsx (Max 10MB)</p>
                      <input 
                        type="file" 
                        id="fileUpload" 
                        style={{ display: 'none' }} 
                        accept=".csv,.xls,.xlsx" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadedFile(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="fileUpload" className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'inline-block' }}>
                        Browse Files
                      </label>
                    </div>
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--primary-color)', background: 'var(--primary-light)', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <FileSpreadsheet size={32} color="var(--primary-color)" />
                       <div>
                         <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{uploadedFile.name}</p>
                         <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{(uploadedFile.size / 1024).toFixed(2)} KB • Upload Complete</p>
                       </div>
                     </div>
                     <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--status-lost)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>Remove</button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {wizardStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Map Fields</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Map your file columns to CRM properties.</p>
                </div>
                <div style={{ border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                     <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                       <tr>
                         <th style={{ padding: '12px 16px', width: '50%' }}>File Column</th>
                         <th style={{ padding: '12px 16px', width: '50%' }}>CRM Lead Field</th>
                       </tr>
                     </thead>
                     <tbody>
                       {[
                         { file: 'First Name', req: true, map: 'First Name' },
                         { file: 'Last Name', req: true, map: 'Last Name' },
                         { file: 'Phone', req: false, map: 'Mobile Number' },
                         { file: 'Email', req: false, map: 'Email' },
                         { file: 'Lead Source', req: false, map: 'Lead Source' },
                       ].map((field, i) => (
                         <tr key={i} style={{ borderTop: '1px solid var(--glass-border)' }}>
                           <td style={{ padding: '16px', fontWeight: 500 }}>
                             {field.file} {field.req && <span style={{ color: 'var(--status-lost)' }}>*</span>}
                           </td>
                           <td style={{ padding: '16px' }}>
                             <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-primary)' }}>
                               <option>{field.map}</option>
                               <option>Unmapped</option>
                             </select>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {wizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Preview & Import Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                   <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Total Records</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-primary)' }}>1250</p>
                   </div>
                   <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Valid</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--status-admitted)' }}>1180</p>
                   </div>
                   <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Duplicates</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--status-working)' }}>35</p>
                   </div>
                   <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Invalid</p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--status-lost)' }}>25</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                   <div>
                     <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Duplicate Handling</label>
                     <select value={duplicateHandling} onChange={e => setDuplicateHandling(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                        <option>Skip Records</option>
                        <option>Merge Records</option>
                        <option>Create Multiple Records</option>
                     </select>
                   </div>
                   <div>
                     <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Blank Values</label>
                     <select value={blankHandling} onChange={e => setBlankHandling(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                        <option>Always overwrite</option>
                        <option>Only overwrite when values are present</option>
                     </select>
                   </div>
                   <div>
                     <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Assign Owner</label>
                     <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                        <option>Admin User</option>
                        <option>Rahul Sharma</option>
                        <option>Priya Nair</option>
                        <option>Sales Team</option>
                     </select>
                   </div>
                   <div>
                     <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Add to List / Segment</label>
                     <select value={selectedList} onChange={e => setSelectedList(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                        <option>Website Leads</option>
                        <option>High Priority Leads</option>
                        <option>Admission Leads</option>
                        <option>Create New List</option>
                     </select>
                   </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '8px', border: '1px solid var(--primary-color)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 600, color: 'var(--primary-color)' }}>
                      <input type="checkbox" checked={verifiedData} onChange={e => setVerifiedData(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                      I have verified the data and import settings.
                   </label>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {wizardStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '48px 0' }}>
                {isProcessing ? (
                   <>
                     <RefreshCw size={48} className="animate-spin" color="var(--primary-color)" />
                     <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Processing Records...</h3>
                     <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-secondary)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                       <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2 }} style={{ height: '100%', background: 'var(--primary-color)' }} />
                     </div>
                   </>
                ) : (
                   <>
                     <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--status-admitted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                       <Check size={32} />
                     </div>
                     <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-admitted)' }}>Import Completed Successfully</h3>
                     <div style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', textAlign: 'left', marginTop: '16px' }}>
                       <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Total Records</span>
                         <span style={{ fontWeight: 'bold' }}>{importStats?.totalRecords}</span>
                       </div>
                       <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--status-admitted)', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Records Created</span>
                         <span style={{ fontWeight: 'bold' }}>{importStats?.success}</span>
                       </div>
                       <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--status-working)', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} /> Duplicates</span>
                         <span style={{ fontWeight: 'bold' }}>{importStats?.duplicate}</span>
                       </div>
                       <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ color: 'var(--status-lost)', display: 'flex', alignItems: 'center', gap: '8px' }}><XIcon size={16} /> Rejected</span>
                         <span style={{ fontWeight: 'bold' }}>{(importStats?.invalidNumber || 0) + (importStats?.invalidEmail || 0) + (importStats?.failed || 0)}</span>
                       </div>
                     </div>
                   </>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Wizard Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
           {wizardStep < 5 ? (
             <>
               <button onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setIsWizardOpen(false)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                 {wizardStep === 1 ? 'Cancel' : 'Back'}
               </button>
               <button 
                 disabled={(wizardStep === 2 && !uploadedFile) || (wizardStep === 4 && !verifiedData) || isProcessing}
                 onClick={() => wizardStep < 4 ? setWizardStep(wizardStep + 1) : simulateImport()} 
                 style={{ padding: '12px 32px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: ((wizardStep === 2 && !uploadedFile) || (wizardStep === 4 && !verifiedData)) ? 'not-allowed' : 'pointer', opacity: ((wizardStep === 2 && !uploadedFile) || (wizardStep === 4 && !verifiedData)) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                 {wizardStep === 4 ? 'Start Import' : 'Next'} <ArrowRight size={18} />
               </button>
             </>
           ) : (
             !isProcessing && (
               <>
                 <button onClick={() => { setIsWizardOpen(false); setWizardStep(1); setUploadedFile(null); setVerifiedData(false); }} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                   Close
                 </button>
                 <div style={{ display: 'flex', gap: '16px' }}>
                   {(importStats?.invalidNumber + importStats?.invalidEmail + importStats?.failed) > 0 && (
                     <button onClick={() => showToast('Downloading rejected records...')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--status-lost)', color: 'var(--status-lost)', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>
                       Download Rejected
                     </button>
                   )}
                   <button onClick={() => setIsWizardOpen(false)} style={{ padding: '12px 32px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                     View Imported Records
                   </button>
                 </div>
               </>
             )
           )}
        </div>
      </div>
    );
  }

  // --- Main View Render ---
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* Header Toolbar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', zIndex: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', width: '350px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search across Uploads..." 
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={(e) => { e.stopPropagation(); setFilterMenuOpen(!filterMenuOpen); setDateMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Filter size={18} /> {statusFilter === 'All Status' ? 'Filter' : statusFilter}
            </button>
            <AnimatePresence>
              {filterMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '220px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['All Status', 'Completed', 'Processing', 'Completed with Errors', 'Failed'].map(st => (
                    <button key={st} onClick={(e) => { e.stopPropagation(); setStatusFilter(st); setFilterMenuOpen(false); setPage(1); }} style={{ padding: '10px 12px', background: statusFilter === st ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: statusFilter === st ? 600 : 400, cursor: 'pointer', display: 'block', width: '100%' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background=statusFilter === st ? 'var(--bg-secondary)' : 'transparent'}>{st}</button>
                  ))}
                  <div style={{ borderTop: '1px solid var(--glass-border)', margin: '8px 0' }} />
                  <button onClick={(e) => { e.stopPropagation(); setStatusFilter('All Status'); setKpiFilter(null); setFilterMenuOpen(false); }} style={{ padding: '10px 12px', color: 'var(--status-lost)', border: 'none', background: 'transparent', textAlign: 'center', fontWeight: 600, cursor: 'pointer', display: 'block', width: '100%' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>Clear Filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={(e) => { e.stopPropagation(); setDateMenuOpen(!dateMenuOpen); setFilterMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
               <Calendar size={18} /> {dateFilter} <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {dateMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '180px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'All Time', 'Custom Range'].map(df => (
                    <button key={df} onClick={(e) => { e.stopPropagation(); setDateFilter(df); setDateMenuOpen(false); setPage(1); }} style={{ padding: '10px 12px', background: dateFilter === df ? 'var(--bg-secondary)' : 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: dateFilter === df ? 600 : 400, cursor: 'pointer', display: 'block', width: '100%' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background=dateFilter === df ? 'var(--bg-secondary)' : 'transparent'}>{df}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           <button onClick={() => showToast('Refreshing data...')} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}><RefreshCw size={18} /></button>
           <button onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
             <Download size={18} /> Export
           </button>
           <button onClick={() => setIsWizardOpen(true)} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
             <Plus size={18} /> New Upload
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', borderBottom: '1px solid var(--glass-border)' }}>
         {[
           { label: 'Total Uploads', value: kpis.totalUploads, filter: null, color: 'var(--primary-color)' },
           { label: 'Total Records', value: kpis.totalRecords.toLocaleString(), filter: 'totalRecords', color: 'var(--text-primary)' },
           { label: 'Successful', value: kpis.success.toLocaleString(), filter: 'success', color: 'var(--status-admitted)' },
           { label: 'Duplicates', value: kpis.duplicate.toLocaleString(), filter: 'duplicate', color: 'var(--status-working)' },
           { label: 'Invalid', value: kpis.invalid.toLocaleString(), filter: 'invalid', color: 'var(--status-lost)' },
           { label: 'Failed', value: kpis.failed.toLocaleString(), filter: 'failed', color: '#dc2626' }
         ].map((kpi, i) => (
           <div 
             key={i} 
             onClick={() => { setKpiFilter(kpiFilter === kpi.filter ? null : kpi.filter); setPage(1); }}
             style={{ 
               background: kpiFilter === kpi.filter ? 'var(--primary-light)' : 'var(--bg-card)', 
               border: `1px solid ${kpiFilter === kpi.filter ? 'var(--primary-color)' : 'var(--glass-border)'}`, 
               padding: '16px', borderRadius: '12px', cursor: 'pointer', 
               boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
             }}
           >
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>{kpi.label}</p>
             <p style={{ fontWeight: 'bold', fontSize: '1.4rem', color: kpi.color }}>{kpi.value}</p>
           </div>
         ))}
      </div>

      {/* Table Area */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '0', position: 'relative' }}>
        <table style={{ width: '100%', minWidth: '1950px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '250px' }}>List Name</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '250px' }}>File Name</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Upload Date</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '140px' }}>Uploaded By</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '160px' }}>Status</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '110px' }}>Total Records</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '100px' }}>Success</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '100px' }}>Duplicate</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '120px' }}>Do Not Track</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '130px' }}>Invalid Number</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '120px' }}>Invalid Email</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '90px' }}>Failed</th>
              <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan={13} style={{ textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)' }}>No upload history found.</td></tr>
            ) : currentData.map((row, idx) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-primary)', height: '64px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.background='var(--bg-primary)'}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.listName}>{row.listName}</td>
                <td style={{ padding: '16px 12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.fileName}>{row.fileName}</td>
                <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{new Date(row.uploadDate).toLocaleDateString()} {new Date(row.uploadDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td style={{ padding: '16px 12px' }}>{row.uploadedBy}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                    background: row.status === 'Completed' ? '#dcfce7' : row.status === 'Processing' ? '#e0f2fe' : row.status === 'Failed' ? '#fee2e2' : '#fef9c3',
                    color: row.status === 'Completed' ? '#166534' : row.status === 'Processing' ? '#0369a1' : row.status === 'Failed' ? '#991b1b' : '#854d0e'
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{row.totalRecords}</td>
                <td style={{ padding: '16px 12px', color: 'var(--status-admitted)', fontWeight: 600 }}>{row.success}</td>
                <td style={{ padding: '16px 12px', color: 'var(--status-working)' }}>{row.duplicate}</td>
                <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{row.doNotTrack}</td>
                <td style={{ padding: '16px 12px', color: 'var(--status-lost)' }}>{row.invalidNumber}</td>
                <td style={{ padding: '16px 12px', color: 'var(--status-lost)' }}>{row.invalidEmail}</td>
                <td style={{ padding: '16px 12px', color: '#dc2626', fontWeight: 600 }}>{row.failed}</td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeMenuId === row.id) {
                          setActiveMenuId(null);
                          setMenuTarget(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const spaceAbove = rect.top;
                          setMenuIsUp(spaceBelow < 300 && spaceAbove > spaceBelow);
                          setActiveMenuId(row.id);
                          setMenuTarget(e.currentTarget);
                        }
                      }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                      onMouseOver={e => e.currentTarget.style.background='var(--glass-border)'} 
                      onMouseOut={e => e.currentTarget.style.background='transparent'}
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === row.id && menuTarget && (
                        <UploadsActionDropdown 
                          isUp={menuIsUp}
                          targetRect={menuTarget.getBoundingClientRect()}
                          onClose={() => { setActiveMenuId(null); setMenuTarget(null); }} 
                          onAction={(action: string) => handleAction(action, row)} 
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <b>{filteredUploads.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to {Math.min(page * itemsPerPage, filteredUploads.length)} of {filteredUploads.length}</b>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontSize: '0.85rem' }}>Previous</button>
          <div style={{ display: 'flex', gap: '4px', margin: '0 8px' }}>
             {Array.from({length: Math.min(totalPages, 5)}).map((_, i) => {
               let p = page > 2 ? page - 2 + i : i + 1;
               if (page > totalPages - 2 && totalPages >= 5) p = totalPages - 4 + i;
               if (p > totalPages || p < 1) return null;
               return <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: page === p ? 'var(--primary-color)' : 'transparent', color: page === p ? 'white' : 'var(--text-primary)', border: page === p ? 'none' : '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>{p}</button>
             })}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, fontSize: '0.85rem' }}>Next</button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {viewDetails && (
          <GenericModal title="Import Details" onClose={() => setViewDetails(null)} width={viewDetails.fileName === 'Student Performance.csv' ? '800px' : '600px'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>List Name</p><p style={{ fontWeight: 600 }}>{viewDetails.listName}</p></div>
                 <div><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>File Name</p><p style={{ fontWeight: 600 }}>{viewDetails.fileName}</p></div>
                 <div><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Uploaded By</p><p style={{ fontWeight: 600 }}>{viewDetails.uploadedBy}</p></div>
                 <div><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upload Date</p><p style={{ fontWeight: 600 }}>{new Date(viewDetails.uploadDate).toLocaleString()}</p></div>
                 <div><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</p>
                    <span style={{ 
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginTop: '4px',
                        background: viewDetails.status === 'Completed' ? '#dcfce7' : viewDetails.status === 'Processing' ? '#e0f2fe' : viewDetails.status === 'Failed' ? '#fee2e2' : '#fef9c3',
                        color: viewDetails.status === 'Completed' ? '#166534' : viewDetails.status === 'Processing' ? '#0369a1' : viewDetails.status === 'Failed' ? '#991b1b' : '#854d0e'
                      }}>
                        {viewDetails.status}
                    </span>
                 </div>
               </div>
               
               <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                 <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Import Statistics</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{viewDetails.totalRecords}</p></div>
                    <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: '#166534' }}>Successful</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#166534' }}>{viewDetails.success}</p></div>
                    <div style={{ background: '#fef9c3', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: '#854d0e' }}>Duplicates</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#854d0e' }}>{viewDetails.duplicate}</p></div>
                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: '#991b1b' }}>Invalid Num</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#991b1b' }}>{viewDetails.invalidNumber}</p></div>
                    <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: '#991b1b' }}>Invalid Email</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#991b1b' }}>{viewDetails.invalidEmail}</p></div>
                    <div style={{ background: '#fecaca', padding: '12px', borderRadius: '8px', textAlign: 'center' }}><p style={{ fontSize: '0.85rem', color: '#991b1b' }}>Failed</p><p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#991b1b' }}>{viewDetails.failed}</p></div>
                 </div>
               </div>

               {viewDetails.fileName === 'Student Performance.csv' && (
                 <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                   <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>CSV Data Preview</h4>
                   <div style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                       <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                         <tr>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student ID</th>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Name</th>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Grade</th>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Math Score</th>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Science Score</th>
                           <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                           <td style={{ padding: '8px 12px' }}>ST-101</td><td style={{ padding: '8px 12px' }}>Aarav Patel</td><td style={{ padding: '8px 12px' }}>10th</td><td style={{ padding: '8px 12px' }}>85</td><td style={{ padding: '8px 12px' }}>92</td><td style={{ padding: '8px 12px' }}>Pass</td>
                         </tr>
                         <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                           <td style={{ padding: '8px 12px' }}>ST-102</td><td style={{ padding: '8px 12px' }}>Priya Sharma</td><td style={{ padding: '8px 12px' }}>10th</td><td style={{ padding: '8px 12px' }}>90</td><td style={{ padding: '8px 12px' }}>88</td><td style={{ padding: '8px 12px' }}>Pass</td>
                         </tr>
                         <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                           <td style={{ padding: '8px 12px' }}>ST-103</td><td style={{ padding: '8px 12px' }}>Rahul Kumar</td><td style={{ padding: '8px 12px' }}>10th</td><td style={{ padding: '8px 12px' }}>78</td><td style={{ padding: '8px 12px' }}>81</td><td style={{ padding: '8px 12px' }}>Pass</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setViewDetails(null)} className="secondary-btn" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
          </GenericModal>
        )}

        {revertPrompt && (
          <GenericModal title="Revert Import" onClose={() => setRevertPrompt(null)} width="400px">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Are you sure you want to revert this import? This will remove all successfully imported leads associated with this upload and cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setRevertPrompt(null)} className="secondary-btn" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={confirmRevert} className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Revert Import</button>
            </div>
          </GenericModal>
        )}
      </AnimatePresence>
    </div>
  );
}
