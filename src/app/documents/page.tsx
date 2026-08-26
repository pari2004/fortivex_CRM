'use client';

import React, { useState } from 'react';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';
import { FileText, Download, Trash2, Upload, Eye, RefreshCw, Share2, Edit, Printer, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const showToast = (message: string) => {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

const simulateDownload = (filename: string) => {
  const blob = new Blob([`Fortivex.AI CRM
${filename}
Generated: ${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

const MOCK_DOCS = [
  { id: 'D01', name: 'Employee Handbook.pdf', category: 'HR', date: '2026-01-15', by: 'HR Dept', status: 'Active', size: '2.4 MB', desc: 'Official employee guidelines.' },
  { id: 'D02', name: 'Q3 Targets.xlsx', category: 'Sales', date: '2026-07-01', by: 'Manager A', status: 'Active', size: '1.1 MB', desc: 'Sales goals for Q3.' },
  { id: 'D03', name: 'Identity Proof.jpg', category: 'ID Card', date: '2025-05-10', by: 'Self', status: 'Verified', size: '3.5 MB', desc: 'Scanned ID card copy.' },
  { id: 'D04', name: 'Offer Letter.pdf', category: 'Offer Letter', date: '2025-05-01', by: 'HR Dept', status: 'Active', size: '1.8 MB', desc: 'Signed offer letter.' },
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(MOCK_DOCS);
  const [filteredData, setFilteredData] = useState(MOCK_DOCS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Modals for Actions
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [renameDoc, setRenameDoc] = useState<any>(null);
  const [shareDoc, setShareDoc] = useState<any>(null);
  const [historyDoc, setHistoryDoc] = useState<any>(null);
  const [replaceDoc, setReplaceDoc] = useState<any>(null);

  const handleUpload = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newDoc = {
      id: `D${Date.now().toString().slice(-4)}`,
      name: fd.get('docName') as string,
      category: fd.get('category') as string,
      date: new Date().toISOString().split('T')[0],
      by: fd.get('empName') as string,
      status: 'Active',
      size: '1.0 MB',
      desc: fd.get('desc') as string
    };
    setData([newDoc, ...data]);
    setFilteredData([newDoc, ...data]);
    setIsUploadOpen(false);
    showToast('Document uploaded successfully.');
  };

  const getMenu = (doc: any) => (
    <ActionMenu items={[
      { label: 'View Document', icon: <Eye size={16}/>, onClick: () => setViewDoc(doc) },
      { label: 'Download', icon: <Download size={16}/>, onClick: () => simulateDownload(doc.name) },
      { label: 'Rename', icon: <Edit size={16}/>, onClick: () => setRenameDoc(doc) },
      { label: 'Replace File', icon: <RefreshCw size={16}/>, onClick: () => setReplaceDoc(doc) },
      { divider: true, label: '' },
      { label: 'Share', icon: <Share2 size={16}/>, onClick: () => setShareDoc(doc) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => window.print() },
      { label: 'View History', icon: <Clock size={16}/>, onClick: () => setHistoryDoc(doc) },
      { divider: true, label: '' },
      { label: 'Delete', icon: <Trash2 size={16} color="red"/>, onClick: () => {
         if(window.confirm('Are you sure you want to delete this document?')) {
            setData(data.filter(d => d.id !== doc.id));
            setFilteredData(filteredData.filter(d => d.id !== doc.id));
            showToast('Document deleted.');
         }
      }},
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Documents</h1>
        <button onClick={() => setIsUploadOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Upload size={18} /> Upload Document
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
        <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['name', 'category']} exportFilename="Documents_List" />
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Document Name</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Upload Date</th>
              <th style={{ padding: '16px' }}>Uploaded By</th>
              <th style={{ padding: '16px' }}>File Size</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(doc => (
              <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="#3b82f6"/> {doc.name}</td>
                <td style={{ padding: '16px' }}>{doc.category}</td>
                <td style={{ padding: '16px' }}>{doc.date}</td>
                <td style={{ padding: '16px' }}>{doc.by}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{doc.size}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#d1fae5', color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>{doc.status}</span></td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{getMenu(doc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <SlidePanel isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document" width="500px">
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employee Name</label><input name="empName" defaultValue={user?.name} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employee ID</label><input name="empId" defaultValue="EMP-1001" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           </div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Document Name</label><input name="docName" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
             <select name="category" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
               {['Aadhaar', 'PAN', 'Passport', 'Resume', 'Offer Letter', 'Salary Slip', 'Experience Certificate', 'Education Certificate', 'ID Card', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label><textarea name="desc" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload File</label><input type="file" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={() => setIsUploadOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Upload & Save</button>
           </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title="Document Preview" width="600px">
        {viewDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ height: '300px', background: 'var(--bg-secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                 <FileText size={48} style={{ margin: '0 auto 16px' }}/>
                 <div>Preview not available for this file type.</div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
               <h3 style={{ marginBottom: '16px' }}>Metadata</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                  <div><strong>Employee Name:</strong> {viewDoc.by}</div>
                  <div><strong>Document Name:</strong> {viewDoc.name}</div>
                  <div><strong>Upload Date:</strong> {viewDoc.date}</div>
                  <div><strong>Uploaded By:</strong> {viewDoc.by}</div>
                  <div><strong>File Type:</strong> {viewDoc.name.split('.').pop()?.toUpperCase()}</div>
                  <div><strong>File Size:</strong> {viewDoc.size}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Description:</strong> {viewDoc.desc}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => simulateDownload(viewDoc.name)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18}/> Download</button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Printer size={18}/> Print</button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* RENAME MODAL */}
      {renameDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
               <h3 style={{ marginBottom: '16px' }}>Rename Document</h3>
               <form onSubmit={e => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const newName = fd.get('newName') as string;
                  setData(prev => prev.map(d => d.id === renameDoc.id ? {...d, name: newName} : d));
                  setFilteredData(prev => prev.map(d => d.id === renameDoc.id ? {...d, name: newName} : d));
                  setRenameDoc(null);
                  showToast('Document renamed successfully.');
               }}>
                  <input name="newName" defaultValue={renameDoc.name} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}/>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <button type="button" onClick={() => setRenameDoc(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                     <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* REPLACE MODAL */}
      {replaceDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
               <h3 style={{ marginBottom: '16px' }}>Replace File for {replaceDoc.name}</h3>
               <form onSubmit={e => {
                  e.preventDefault();
                  setData(prev => prev.map(d => d.id === replaceDoc.id ? {...d, date: new Date().toISOString().split('T')[0], status: 'Updated'} : d));
                  setFilteredData(prev => prev.map(d => d.id === replaceDoc.id ? {...d, date: new Date().toISOString().split('T')[0], status: 'Updated'} : d));
                  setReplaceDoc(null);
                  showToast('File replaced successfully.');
               }}>
                  <input type="file" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}/>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <button type="button" onClick={() => setReplaceDoc(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                     <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Upload New File</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* SHARE MODAL */}
      {shareDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
               <Share2 size={32} color="#3b82f6" style={{ margin: '0 auto 16px' }}/>
               <h3 style={{ marginBottom: '8px' }}>Share {shareDoc.name}</h3>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Share internally securely.</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => { navigator.clipboard.writeText(`https://crm.fortivex.ai/docs/${shareDoc.id}`); showToast('Link copied to clipboard.'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontWeight: 600 }}>Copy Link</button>
                  <button onClick={() => { showToast('Opening Email Client...'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontWeight: 600 }}>Email</button>
                  <button onClick={() => { showToast('Opening WhatsApp...'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#25D366', color: 'white', fontWeight: 600 }}>Join Fortivex.AI CRM WhatsApp Community</button>
                  <button onClick={() => setShareDoc(null)} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px' }}>Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* HISTORY MODAL */}
      <SlidePanel isOpen={!!historyDoc} onClose={() => setHistoryDoc(null)} title="Document History" width="500px">
         {historyDoc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
               <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
               {[
                  { title: 'Document Uploaded', time: historyDoc.date, by: historyDoc.by, color: '#10b981' },
                  { title: 'Document Verified', time: new Date(new Date(historyDoc.date).getTime() + 86400000).toISOString().split('T')[0], by: 'System', color: '#3b82f6' },
               ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                     <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                     <div className="glass-panel" style={{ flex: 1, padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{act.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>By {act.by} on {act.time}</div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </SlidePanel>

    </div>
  );
}
