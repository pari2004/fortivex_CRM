import os

content = """'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { FileText, Eye, Edit, CheckCircle, XCircle, Download, Printer, Trash2, Calendar, FileCheck, CheckSquare, Square, Building, GraduationCap, DollarSign, Send, FileSignature, Upload } from 'lucide-react';

export interface ApplicationRecord {
  id: string;
  studentName: string;
  mobile: string;
  email: string;
  program: string;
  qualification: string;
  college: string;
  graduationYear: string;
  date: string;
  counselor: string;
  documentsSubmitted: boolean;
  paymentStatus: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Enrolled';
  admissionStatus: string;
  remarks: string;
}

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'Digital Marketing'];
const statuses = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Enrolled'];
const counselors = ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'];
const qualifications = ['B.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Tech', 'MBA'];

const generateMockApplications = (): ApplicationRecord[] => {
  const apps: ApplicationRecord[] = [];
  for (let i = 1; i <= 50; i++) {
    apps.push({
      id: `APP-${1000 + i}`,
      studentName: `Student ${i}`,
      mobile: `+91 98${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `student${i}@example.com`,
      program: programs[Math.floor(Math.random() * programs.length)],
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      college: `Engineering College ${Math.floor(Math.random() * 10) + 1}`,
      graduationYear: ['2023', '2024', '2025'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      counselor: counselors[Math.floor(Math.random() * counselors.length)],
      documentsSubmitted: Math.random() > 0.3,
      paymentStatus: statuses[Math.floor(Math.random() * statuses.length)] as any,
      admissionStatus: statuses[Math.floor(Math.random() * statuses.length)],
      remarks: 'Interested in weekend batches.'
    });
  }
  return apps;
};

const mockData = generateMockApplications();

export default function ApplicationsPage() {
  const [data, setData] = useState<ApplicationRecord[]>(mockData);
  const [filteredData, setFilteredData] = useState<ApplicationRecord[]>(mockData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [viewModal, setViewModal] = useState<ApplicationRecord | null>(null);
  const [editModal, setEditModal] = useState<ApplicationRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: ApplicationRecord[]) => {
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
      case 'Approved': case 'Enrolled': return { bg: '#d1fae5', text: '#059669' };
      case 'Rejected': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Under Review': case 'Submitted': return { bg: '#dbeafe', text: '#2563eb' };
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal) {
      setData(d => d.map(app => app.id === editModal.id ? editModal : app));
      setFilteredData(d => d.map(app => app.id === editModal.id ? editModal : app));
      setEditModal(null);
      showToast('Application updated successfully');
    }
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(app => app.id !== deleteModal));
      setFilteredData(d => d.filter(app => app.id !== deleteModal));
      setDeleteModal(null);
      showToast('Application deleted');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'program', label: 'Program', type: 'select', options: programs },
    { key: 'admissionStatus', label: 'Status', type: 'select', options: statuses },
    { key: 'counselor', label: 'Counselor', type: 'select', options: counselors },
    { key: 'date', label: 'Date', type: 'date' }
  ];

  const exportMapping = [
    { key: 'id' as keyof ApplicationRecord, label: 'App ID' },
    { key: 'studentName' as keyof ApplicationRecord, label: 'Name' },
    { key: 'mobile' as keyof ApplicationRecord, label: 'Mobile' },
    { key: 'program' as keyof ApplicationRecord, label: 'Program' },
    { key: 'admissionStatus' as keyof ApplicationRecord, label: 'Status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Applications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage student enrollment applications.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['studentName', 'id', 'mobile', 'email', 'program']}
          searchPlaceholder="Search applications..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedRows.has(c.id))}
          exportMapping={exportMapping}
          exportFilename="Applications"
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
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Applicant</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Contact & Program</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Counselor & Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Docs & App Date</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(app.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(app.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(app.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(app.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{app.studentName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{app.id}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{app.mobile}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.program}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{app.counselor}</div>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(app.admissionStatus).bg, color: getStatusColor(app.admissionStatus).text }}>
                      {app.admissionStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {app.documentsSubmitted ? <CheckCircle size={16} color="#059669" /> : <XCircle size={16} color="#dc2626" />}
                      <span style={{ fontSize: '0.85rem', color: app.documentsSubmitted ? '#059669' : '#dc2626' }}>{app.documentsSubmitted ? 'Submitted' : 'Pending'}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12}/> {app.date}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Application', icon: <Eye size={16} />, onClick: () => setViewModal(app) },
                      { label: 'Edit Application', icon: <Edit size={16} />, onClick: () => setEditModal(app) },
                      { label: 'Approve Application', icon: <CheckCircle size={16} color="#059669" />, onClick: () => {
                          setData(d => d.map(x => x.id === app.id ? { ...x, admissionStatus: 'Approved' } : x));
                          setFilteredData(d => d.map(x => x.id === app.id ? { ...x, admissionStatus: 'Approved' } : x));
                          showToast(`Application ${app.id} Approved`);
                        }
                      },
                      { label: 'Reject Application', icon: <XCircle size={16} color="#dc2626" />, onClick: () => {
                          setData(d => d.map(x => x.id === app.id ? { ...x, admissionStatus: 'Rejected' } : x));
                          setFilteredData(d => d.map(x => x.id === app.id ? { ...x, admissionStatus: 'Rejected' } : x));
                          showToast(`Application ${app.id} Rejected`);
                        }
                      },
                      { label: 'Upload Documents', icon: <Upload size={16} />, onClick: () => showToast(`Upload Documents window for ${app.studentName} opened.`) },
                      { label: 'Generate Offer Letter', icon: <FileSignature size={16} />, onClick: () => showToast(`Offer Letter generated for ${app.studentName}`) },
                      { label: 'Generate Admission Letter', icon: <FileCheck size={16} />, onClick: () => showToast(`Admission Letter generated for ${app.studentName}`) },
                      { label: 'Send Email', icon: <Send size={16} />, onClick: () => showToast(`Email drafted to ${app.email}`) },
                      { label: 'Download PDF', icon: <Download size={16} />, onClick: () => showToast(`Downloading ${app.id}.pdf...`) },
                      { label: 'Print Application', icon: <Printer size={16} />, onClick: () => { window.print(); showToast('Preparing print view...'); } },
                      { label: 'Delete Application', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(app.id) }
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

      {/* VIEW MODAL */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {viewModal.studentName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{viewModal.studentName}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16}/> {viewModal.id} • {viewModal.program}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Personal Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Mobile</span> <span style={{ fontWeight: 500 }}>{viewModal.mobile}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Email</span> <span style={{ fontWeight: 500 }}>{viewModal.email}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Address</span> <span style={{ fontWeight: 500 }}>123 Mock Street, BLR</span></div>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Education</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>College</span> <span style={{ fontWeight: 500 }}>{viewModal.college}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Qualification</span> <span style={{ fontWeight: 500 }}>{viewModal.qualification}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Year of Grad</span> <span style={{ fontWeight: 500 }}>{viewModal.graduationYear}</span></div>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Application Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Counselor</span> <span style={{ fontWeight: 500 }}>{viewModal.counselor}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Applied Date</span> <span style={{ fontWeight: 500 }}>{viewModal.date}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.admissionStatus).text }}>{viewModal.admissionStatus}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Documents</span> <span style={{ fontWeight: 500 }}>{viewModal.documentsSubmitted ? 'Verified' : 'Pending'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Payments</span> <span style={{ fontWeight: 500 }}>{viewModal.paymentStatus}</span></div>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Notes & Timeline</h3>
                <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <p>{viewModal.remarks}</p>
                </div>
                <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-tertiary)', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ marginBottom: '8px' }}><strong>{viewModal.date}</strong> - Application created</div>
                  <div style={{ marginBottom: '8px' }}><strong>+1 day</strong> - Initial screening completed</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { window.print(); showToast('Printing application...'); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Printer size={16} /> Print</button>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Details</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={24} color="var(--primary-color)" /> Edit Application - {editModal.id}</h2>
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Student Name</label><input type="text" value={editModal.studentName} onChange={e => setEditModal({...editModal, studentName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mobile Number</label><input type="text" value={editModal.mobile} onChange={e => setEditModal({...editModal, mobile: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label><input type="email" value={editModal.email} onChange={e => setEditModal({...editModal, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Program</label>
                  <select value={editModal.program} onChange={e => setEditModal({...editModal, program: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {programs.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>College</label><input type="text" value={editModal.college} onChange={e => setEditModal({...editModal, college: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Qualification</label>
                  <select value={editModal.qualification} onChange={e => setEditModal({...editModal, qualification: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Graduation Year</label><input type="text" value={editModal.graduationYear} onChange={e => setEditModal({...editModal, graduationYear: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Counselor</label>
                  <select value={editModal.counselor} onChange={e => setEditModal({...editModal, counselor: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {counselors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admission Status</label>
                  <select value={editModal.admissionStatus} onChange={e => setEditModal({...editModal, admissionStatus: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Status</label>
                  <select value={editModal.paymentStatus} onChange={e => setEditModal({...editModal, paymentStatus: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes / Remarks</label>
                <textarea rows={3} value={editModal.remarks} onChange={e => setEditModal({...editModal, remarks: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Application?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete application <strong>{deleteModal}</strong>? This action cannot be undone.</p>
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
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/applications/page.tsx", "w") as f:
    f.write(content)
print("Updated Applications Action Menus")
