import os

content = """'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Upload, Eye, Download, Edit3, Trash2, RefreshCw, FileText, CheckSquare, Square, File, ShieldCheck, User, Share2, FolderInput } from 'lucide-react';

export interface DocumentRecord {
  id: string;
  documentName: string;
  studentName: string;
  studentId: string;
  documentType: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

const docTypes = ['Aadhaar', 'PAN', '10th Marks Card', '12th Marks Card', 'Degree Certificate', 'Resume', 'Passport', 'Fee Receipt', 'Other'];
const statuses = ['Verified', 'Pending', 'Rejected'];

const generateMockDocuments = (): DocumentRecord[] => {
  const docs: DocumentRecord[] = [];
  for (let i = 1; i <= 50; i++) {
    const type = docTypes[Math.floor(Math.random() * docTypes.length)];
    docs.push({
      id: `DOC-${1000 + i}`,
      documentName: `${type.replace(/ /g, '_')}_Student${i}.pdf`,
      studentName: `Student ${i}`,
      studentId: `STU-${5000 + i}`,
      documentType: type,
      uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      uploadedBy: Math.random() > 0.5 ? 'Student' : 'Rahul Sharma',
      fileSize: `${(Math.random() * 4 + 0.1).toFixed(1)} MB`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any
    });
  }
  return docs;
};

const mockDocs = generateMockDocuments();

export default function DocumentsPage() {
  const [data, setData] = useState<DocumentRecord[]>(mockDocs);
  const [filteredData, setFilteredData] = useState<DocumentRecord[]>(mockDocs);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<DocumentRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [renameModal, setRenameModal] = useState<{ id: string, name: string } | null>(null);
  const [replaceModal, setReplaceModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: DocumentRecord[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(currentData.map(c => c.id)));
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return { bg: '#d1fae5', text: '#059669' };
      case 'Rejected': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Pending': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(x => x.id !== deleteModal));
      setFilteredData(d => d.filter(x => x.id !== deleteModal));
      setDeleteModal(null);
      showToast('Document deleted successfully');
    }
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameModal) {
      setData(d => d.map(x => x.id === renameModal.id ? { ...x, documentName: renameModal.name } : x));
      setFilteredData(d => d.map(x => x.id === renameModal.id ? { ...x, documentName: renameModal.name } : x));
      setRenameModal(null);
      showToast('Document renamed successfully');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'documentType', label: 'Document Type', type: 'select', options: docTypes },
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'uploadDate', label: 'Upload Date', type: 'date' }
  ];

  const exportMapping = [
    { key: 'id' as keyof DocumentRecord, label: 'Doc ID' },
    { key: 'documentName' as keyof DocumentRecord, label: 'File Name' },
    { key: 'studentName' as keyof DocumentRecord, label: 'Student' },
    { key: 'documentType' as keyof DocumentRecord, label: 'Type' },
    { key: 'status' as keyof DocumentRecord, label: 'Status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Documents</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student uploads and verifications.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowUploadModal(true)}>
          <Upload size={18} /> Upload Document
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['documentName', 'studentName', 'studentId']}
          searchPlaceholder="Search documents..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedRows.has(c.id))}
          exportMapping={exportMapping}
          exportFilename="Documents"
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {selectedRows.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Document Name & Type</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Upload Details</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(doc.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(doc.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(doc.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(doc.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{doc.documentName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{doc.documentType} • {doc.fileSize}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{doc.studentName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{doc.studentId}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(doc.status).bg, color: getStatusColor(doc.status).text }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{doc.uploadDate}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12}/> By {doc.uploadedBy}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Document', icon: <Eye size={16} />, onClick: () => setShowPreviewModal(doc) },
                      { label: 'Download', icon: <Download size={16} />, onClick: () => showToast(`Downloading ${doc.documentName}`) },
                      { label: 'Rename', icon: <Edit3 size={16} />, onClick: () => setRenameModal({ id: doc.id, name: doc.documentName }) },
                      { label: 'Replace File', icon: <RefreshCw size={16} />, onClick: () => setReplaceModal(doc.id) },
                      { label: 'Share', icon: <Share2 size={16} />, onClick: () => showToast(`Share link generated for ${doc.documentName}`) },
                      { label: 'Move', icon: <FolderInput size={16} />, onClick: () => showToast(`Move dialog opened for ${doc.id}`) },
                      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(doc.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} /></div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{showPreviewModal.documentName}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', gap: '16px' }}>
                    <span>{showPreviewModal.studentName} ({showPreviewModal.studentId})</span>
                    <span>{showPreviewModal.documentType}</span>
                    <span>Uploaded: {showPreviewModal.uploadDate}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => showToast(`Downloading ${showPreviewModal.documentName}`)} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14}/> Download</button>
                <button onClick={() => setShowPreviewModal(null)} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
            
            <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-tertiary)', position: 'relative' }}>
              <File size={64} style={{ marginBottom: '16px', color: 'var(--border-color)' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Preview Rendering is Simulated</p>
              <p style={{ fontSize: '0.9rem' }}>{showPreviewModal.fileSize}</p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / REPLACE MODAL */}
      {(showUploadModal || replaceModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Upload size={24} color="var(--primary-color)" /> {replaceModal ? 'Replace Document' : 'Upload Document'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!replaceModal && (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Document Type</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {docTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              
              <div style={{ padding: '48px 32px', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--text-secondary)' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Drag and drop your file here</p>
                <p style={{ fontSize: '0.85rem' }}>or click to browse from your computer</p>
                <p style={{ fontSize: '0.75rem', marginTop: '16px' }}>Supports PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setShowUploadModal(false); setReplaceModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { setShowUploadModal(false); setReplaceModal(null); showToast('Document uploaded successfully!'); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Upload File</button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Rename Document</h2>
            <form onSubmit={handleRename}>
              <input type="text" value={renameModal.name} onChange={e => setRenameModal({...renameModal, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setRenameModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Document?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete this document? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/documents/page.tsx", "w") as f:
    f.write(content)
print("Updated Documents Action Menus")
