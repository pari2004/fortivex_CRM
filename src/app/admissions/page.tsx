'use client';

import React, { useState, useMemo } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { CheckSquare, Square, Eye, Edit, Trash2, PhoneCall, Mail, CreditCard, MessageSquare, ArrowRightCircle, FileText, Printer, FileDown, UploadCloud, Users, BadgeAlert, File, CheckCircle, Activity, Box, Download, Check, XCircle, AlertCircle, TrendingUp, BarChart3, Receipt, Archive, Briefcase, Bell, Plus, Video } from 'lucide-react';
import { mockMembers, getRandomMember } from '@/lib/mockMembers';

// --- MOCK DATA GENERATION ---

export interface FullAdmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  mobile: string;
  email: string;
  program: string;
  batch: string;
  counselor: string;
  date: string;
  totalFee: number;
  paidFee: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  status: 'Active' | 'Pending Verification' | 'Completed' | 'Cancelled' | 'Archived';
  documents: number;
  missingDocs?: string[];
  attendance?: string;
  dueDate?: string;
}

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'DevOps'];
const paymentStatuses = ['Paid', 'Partial', 'Pending'];
const statuses = ['Active', 'Pending Verification', 'Completed', 'Cancelled', 'Archived'];
const docTypes = ['Aadhaar', 'PAN', '10th Marks', '12th Marks', 'Degree'];

const generateAdmissions = (): FullAdmissionRecord[] => {
  const data: FullAdmissionRecord[] = [];
  for (let i = 1; i <= 50; i++) {
    const totalFee = 50000 + (Math.floor(Math.random() * 5) * 10000);
    const pStat = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    let paidFee = 0;
    if (pStat === 'Paid') paidFee = totalFee;
    else if (pStat === 'Partial') paidFee = totalFee / 2;

    const stat = statuses[Math.floor(Math.random() * statuses.length)];
    let mDocs: string[] = [];
    if (stat === 'Pending Verification') {
        mDocs = [docTypes[Math.floor(Math.random() * docTypes.length)], docTypes[Math.floor(Math.random() * docTypes.length)]];
    }

    data.push({
      id: `ADM-2024-${1000 + i}`,
      studentId: `STU-${9000 + i}`,
      studentName: `Student Name ${i}`,
      mobile: `+91 98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      email: `student${i}@example.com`,
      program: programs[Math.floor(Math.random() * programs.length)],
      batch: `Batch ${Math.floor(Math.random() * 8) + 1}`,
      counselor: getRandomMember().name,
      date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalFee,
      paidFee,
      paymentStatus: pStat as any,
      status: stat as any,
      documents: Math.floor(Math.random() * 5),
      missingDocs: mDocs,
      attendance: `${Math.floor(Math.random() * 20 + 80)}%`
    });
  }
  return data;
};

const initialData = generateAdmissions();

// --- MAIN COMPONENT ---

export default function AdmissionsPage() {
  const [data, setData] = useState<FullAdmissionRecord[]>(initialData);
  const [filteredData, setFilteredData] = useState<FullAdmissionRecord[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  // Modals
  const [viewModal, setViewModal] = useState<FullAdmissionRecord | null>(null);
  const [editModal, setEditModal] = useState<FullAdmissionRecord | null>(null);
  const [paymentModal, setPaymentModal] = useState<FullAdmissionRecord | null>(null);
  const [docsModal, setDocsModal] = useState<FullAdmissionRecord | null>(null);
  const [batchModal, setBatchModal] = useState<FullAdmissionRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [timelineModal, setTimelineModal] = useState<FullAdmissionRecord | null>(null);

  // KPI Drill-down State
  const [activeKpiView, setActiveKpiView] = useState<'total' | 'active' | 'verification' | 'revenue' | 'pendingPayments' | null>(null);

  // --- HELPERS ---

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

  const simulateDownload = (filename: string, content: string = "Simulated Document Content") => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${filename} generated and downloaded.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Paid': case 'Active': return { bg: '#d1fae5', text: '#059669' };
      case 'Cancelled': case 'Archived': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Pending Verification': case 'Pending': case 'Partial': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // --- KPIS ---
  
  const kpis = {
    total: data,
    active: data.filter(d => d.status === 'Active'),
    verification: data.filter(d => d.status === 'Pending Verification'),
    pendingPayments: data.filter(d => d.paymentStatus === 'Pending' || d.paymentStatus === 'Partial'),
    revenue: data.reduce((sum, d) => sum + d.paidFee, 0),
    totalPotentialRevenue: data.reduce((sum, d) => sum + d.totalFee, 0),
    pendingPayAmt: data.reduce((sum, d) => sum + (d.totalFee - d.paidFee), 0),
  };

  // --- ACTIONS ---

  const handleDelete = () => {
    if (deleteModal) {
      setData(prev => prev.filter(d => d.id !== deleteModal));
      setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
      setDeleteModal(null);
      showToast('Admission record deleted.');
    }
  };

  const getActionMenu = (row: FullAdmissionRecord) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <Eye size={16}/>, onClick: () => setViewModal(row) },
      { label: 'View Timeline', icon: <Activity size={16}/>, onClick: () => setTimelineModal(row) },
      { label: 'Edit Admission', icon: <Edit size={16}/>, onClick: () => setEditModal(row) },
      { label: 'Update Payment', icon: <CreditCard size={16}/>, onClick: () => setPaymentModal(row) },
      { label: 'Verify Documents', icon: <CheckCircle size={16} color="#10b981"/>, onClick: () => {
          setData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Active', missingDocs: []} : d));
          setFilteredData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Active', missingDocs: []} : d));
          showToast('Documents verified successfully.');
      }},
      { label: 'Upload Documents', icon: <UploadCloud size={16}/>, onClick: () => setDocsModal(row) },
      { label: 'View Documents', icon: <File size={16}/>, onClick: () => setViewModal(row) },
      { label: 'Generate Admission Letter', icon: <FileText size={16}/>, onClick: () => simulateDownload(`Admission_Letter_${row.studentId}.pdf`, `Fortivex.AI\nAdmission Letter for ${row.studentName}`) },
      { label: 'Generate ID Card', icon: <BadgeAlert size={16}/>, onClick: () => simulateDownload(`ID_Card_${row.studentId}.pdf`) },
      { label: 'Download Admission PDF', icon: <FileDown size={16}/>, onClick: () => simulateDownload(`Admission_Record_${row.id}.pdf`) },
      { label: 'Download Fee Receipt', icon: <Receipt size={16}/>, onClick: () => simulateDownload(`Fee_Receipt_${row.id}.pdf`) },
      { label: 'Print Admission', icon: <Printer size={16}/>, onClick: () => { window.print(); showToast('Preparing print dialog...'); } },
      { label: 'Send Welcome Email', icon: <Mail size={16}/>, onClick: () => window.open(`mailto:${row.email}?subject=Welcome to Fortivex.AI`, '_blank') },
      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageSquare size={16} color="#25D366"/>, onClick: () => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); } },
      { label: 'Call Student', icon: <PhoneCall size={16}/>, onClick: () => window.open(`tel:${row.mobile}`, '_blank') },
      { label: 'Assign Batch', icon: <Users size={16}/>, onClick: () => setBatchModal(row) },
      { label: 'Change Counselor', icon: <Briefcase size={16}/>, onClick: () => setEditModal(row) },
      { label: 'Archive Admission', icon: <Archive size={16}/>, onClick: () => {
          setData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Archived'} : d));
          setFilteredData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Archived'} : d));
          showToast('Admission archived.');
      }},
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(row.id) }
    ]} />
  );

  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admissions Ledger</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage enrollments, fees, documents, and student batches.</p>
        </div>
      </div>

      {/* CLICKABLE KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { id: 'total', label: 'Total Admissions', val: kpis.total.length, color: '#3b82f6' },
          { id: 'active', label: 'Active Students', val: kpis.active.length, color: '#10b981' },
          { id: 'verification', label: 'Pending Verification', val: kpis.verification.length, color: '#f59e0b' },
          { id: 'revenue', label: 'Revenue Generated', val: formatCurrency(kpis.revenue), color: '#059669' },
          { id: 'pendingPayments', label: 'Pending Payments', val: formatCurrency(kpis.pendingPayAmt), color: '#ef4444' }
        ].map((k, i) => (
          <div key={i} onClick={() => setActiveKpiView(k.id as any)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* MAIN TABLE (Only show if no KPI view is active) */}
      {!activeKpiView && (
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DataToolbar 
            data={data} 
            onFilteredDataChange={setFilteredData} 
            searchKeys={['studentName', 'id', 'studentId', 'mobile', 'email']}
            searchPlaceholder="Search admissions by Name, ID, Phone..."
            filterOptions={[
              { key: 'program', label: 'Program', type: 'select', options: programs },
              { key: 'status', label: 'Admission Status', type: 'select', options: statuses },
              { key: 'paymentStatus', label: 'Payment Status', type: 'select', options: paymentStatuses }
            ]}
            selectedItems={currentData.filter(c => selectedIds.has(c.id))}
            exportFilename="Admissions_Export"
          />

          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                    <button onClick={() => selectedIds.size === currentData.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(currentData.map(c=>c.id)))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {selectedIds.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                    </button>
                  </th>
                  <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
                  <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Batch</th>
                  <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Admission Details</th>
                  <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Fee Status</th>
                  <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Admission Status</th>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.has(row.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                    <td style={{ padding: '16px 24px' }} onClick={(e) => { e.stopPropagation(); const n = new Set(selectedIds); n.has(row.id)?n.delete(row.id):n.add(row.id); setSelectedIds(n); }}>
                      <div style={{ cursor: 'pointer', color: selectedIds.has(row.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                        {selectedIds.has(row.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {row.studentName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{row.studentName}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.studentId} • {row.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{row.program}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.batch}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontSize: '0.9rem' }}>{row.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{row.date} • {row.counselor}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(row.paymentStatus).bg, color: getStatusColor(row.paymentStatus).text, display: 'inline-block', marginBottom: '4px' }}>
                        {row.paymentStatus}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        Paid: {formatCurrency(row.paidFee)} / {formatCurrency(row.totalFee)}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(row.status).bg, color: getStatusColor(row.status).text, display: 'inline-block', marginBottom: '4px' }}>
                        {row.status}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                         {row.documents} Docs Uploaded
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {getActionMenu(row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
            <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', borderRadius: '8px' }}>Previous</button>
              <button onClick={() => setPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))} disabled={page === Math.ceil(filteredData.length / itemsPerPage)} style={{ padding: '8px', borderRadius: '8px' }}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* KPI DRILL-DOWN VIEWS */}
      {activeKpiView && (
        <div className="glass-panel fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {activeKpiView === 'total' && 'All Admissions'}
                {activeKpiView === 'active' && 'Active Students'}
                {activeKpiView === 'verification' && 'Pending Verification (Action Required)'}
                {activeKpiView === 'revenue' && 'Revenue Analytics'}
                {activeKpiView === 'pendingPayments' && 'Pending Fee Collection'}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {activeKpiView === 'revenue' && <button onClick={() => simulateDownload('Revenue_Report.pdf')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={16}/> Export Report</button>}
              <button onClick={() => setActiveKpiView(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Close View</button>
            </div>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto', padding: activeKpiView === 'revenue' ? '24px' : '0' }}>
            
            {/* REVENUE ANALYTICS VIEW */}
            {activeKpiView === 'revenue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18}/> Total Collected</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>{formatCurrency(kpis.revenue)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>+12.5% from last month</div>
                  </div>
                  <div style={{ flex: 1, padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart3 size={18}/> Projected Revenue</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatCurrency(kpis.totalPotentialRevenue)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Based on current enrollments</div>
                  </div>
                  <div style={{ flex: 1, padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18}/> Uncollected Fees</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(kpis.pendingPayAmt)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>From {kpis.pendingPayments.length} students</div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Program-wise Collection</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {programs.map((p, i) => {
                      const pData = data.filter(d => d.program === p);
                      const pRevenue = pData.reduce((sum, d) => sum + d.paidFee, 0);
                      const percentage = Math.max(5, (pRevenue / kpis.revenue) * 100);
                      return (
                        <div key={p}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600 }}>{p}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(pRevenue)}</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', background: `hsl(${220 + i*20}, 70%, 50%)`, borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TABLE VIEWS FOR OTHER KPIS */}
            {activeKpiView !== 'revenue' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
                    {activeKpiView === 'verification' ? (
                      <>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Missing Documents</th>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Verification Status</th>
                      </>
                    ) : activeKpiView === 'pendingPayments' ? (
                      <>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Total Fee</th>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Pending Amount & Due Date</th>
                      </>
                    ) : (
                      <>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Batch</th>
                        <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Attendance & Fee</th>
                      </>
                    )}
                    <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis[activeKpiView].map((row: any) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600 }}>{row.studentName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.id} • {row.counselor}</div>
                      </td>
                      
                      {activeKpiView === 'verification' ? (
                        <>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ color: '#dc2626', fontWeight: 500, fontSize: '0.85rem' }}>{row.missingDocs?.join(', ') || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '16px 12px' }}><span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(row.status).bg, color: getStatusColor(row.status).text, display: 'inline-block' }}>{row.status}</span></td>
                        </>
                      ) : activeKpiView === 'pendingPayments' ? (
                        <>
                          <td style={{ padding: '16px 12px', fontWeight: 500 }}>{formatCurrency(row.totalFee)}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(row.totalFee - row.paidFee)}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Due: {row.dueDate}</div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '16px 12px' }}><div style={{ fontWeight: 500 }}>{row.program}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.batch}</div></td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: 600 }}>{row.attendance}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Fee: {row.paymentStatus}</div>
                          </td>
                        </>
                      )}
                      
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {activeKpiView === 'verification' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => { setData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Active', missingDocs: []} : d)); setFilteredData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Active', missingDocs: []} : d)); showToast('Documents verified.'); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #10b981', background: 'transparent', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Verify</button>
                            <button onClick={() => window.open(`mailto:${row.email}?subject=Missing Documents Request`)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> Request Docs</button>
                            <button onClick={() => { setData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Cancelled'} : d)); setFilteredData(prev => prev.map(d => d.id === row.id ? {...d, status: 'Cancelled'} : d)); showToast('Application Rejected.'); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #dc2626', background: 'transparent', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14}/> Reject</button>
                          </div>
                        ) : activeKpiView === 'pendingPayments' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setPaymentModal(row)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14}/> Record Payment</button>
                            <button onClick={() => simulateDownload(`Invoice_${row.id}.pdf`)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14}/> Gen Invoice</button>
                            <button onClick={() => window.open(`mailto:${row.email}?subject=Fee Payment Reminder`)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Bell size={14}/> Remind</button>
                          </div>
                        ) : activeKpiView === 'active' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setViewModal(row)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14}/> View</button>
                            <button onClick={() => window.open(`tel:${row.mobile}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><PhoneCall size={14}/> Contact</button>
                          </div>
                        ) : getActionMenu(row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}


      {/* MODALS */}

      {/* ENHANCED VIEW DETAILS (360 VIEW) */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {viewModal.studentName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{viewModal.studentName}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span>Student ID: <strong>{viewModal.studentId}</strong></span>
                    <span>|</span>
                    <span>Admission ID: <strong>{viewModal.id}</strong></span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Academic Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Program</span> <span style={{ fontWeight: 500 }}>{viewModal.program}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Batch</span> <span style={{ fontWeight: 500 }}>{viewModal.batch}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Admission Date</span> <span style={{ fontWeight: 500 }}>{viewModal.date}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Counselor</span> <span style={{ fontWeight: 500 }}>{viewModal.counselor}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>College</span> <span style={{ fontWeight: 500 }}>Global Engineering College</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Qualification</span> <span style={{ fontWeight: 500 }}>B.Tech 2024</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Attendance</span> <span style={{ fontWeight: 500 }}>{viewModal.attendance}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Contact & Parent Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Mobile</span> <span style={{ fontWeight: 500 }}>{viewModal.mobile}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Email</span> <span style={{ fontWeight: 500 }}>{viewModal.email}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Address</span> <span style={{ fontWeight: 500, textAlign: 'right' }}>123 Tech Park,<br/>Silicon City</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Parent Name</span> <span style={{ fontWeight: 500 }}>Mr. Sharma</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Parent Contact</span> <span style={{ fontWeight: 500 }}>+91 9999999999</span></div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Fee & Payment Timeline</h3>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Fee</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(viewModal.totalFee)}</div>
                  </div>
                  <div style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Paid Amount</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{formatCurrency(viewModal.paidFee)}</div>
                  </div>
                  <div style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pending Amount</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(viewModal.totalFee - viewModal.paidFee)}</div>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Verification & Documents</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {docTypes.map((type, i) => {
                      const isMissing = viewModal.missingDocs?.includes(type);
                      return (
                        <div key={i} style={{ padding: '8px 16px', background: isMissing ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: isMissing ? '#dc2626' : '#059669', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isMissing ? <AlertCircle size={14}/> : <CheckCircle size={14}/>} {type}
                        </div>
                      )
                  })}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setTimelineModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Activity size={16} /> View Timeline</button>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Details</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TIMELINE MODAL */}
      {timelineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity color="var(--primary-color)"/> Admission Timeline</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>History for {timelineModal.studentName}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', bottom: '16px', left: '19px', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
              
              {[
                { icon: <Plus size={16}/>, color: '#6366f1', title: 'Lead Created', desc: 'Campaign: Summer Intake 2024', time: '1 Month Ago' },
                { icon: <CheckSquare size={16}/>, color: '#3b82f6', title: 'Application Submitted', desc: 'Via Web Portal', time: '3 Weeks Ago' },
                { icon: <FileText size={16}/>, color: '#f59e0b', title: 'Documents Uploaded', desc: 'Aadhaar, 10th, 12th', time: '3 Weeks Ago' },
                { icon: <Video size={16}/>, color: '#8b5cf6', title: 'Demo Completed', desc: 'Hosted by Senior Faculty', time: '2 Weeks Ago' },
                { icon: <CheckCircle size={16}/>, color: '#10b981', title: 'Admission Confirmed', desc: 'Status updated to Active', time: timelineModal.date },
                { icon: <CreditCard size={16}/>, color: '#059669', title: 'Payment Received', desc: formatCurrency(timelineModal.paidFee), time: timelineModal.date },
                { icon: <Users size={16}/>, color: '#3b82f6', title: 'Batch Assigned', desc: timelineModal.batch, time: timelineModal.date },
                { icon: <Mail size={16}/>, color: '#ec4899', title: 'Welcome Email Sent', desc: 'Automated Trigger', time: timelineModal.date }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1, paddingBottom: '32px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color }}>
                    {step.icon}
                  </div>
                  <div style={{ paddingTop: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{step.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{step.desc}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px', fontWeight: 600 }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setTimelineModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ADMISSION MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Edit Admission: {editModal.id}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setData(prev => prev.map(d => d.id === editModal.id ? editModal : d));
              setFilteredData(prev => prev.map(d => d.id === editModal.id ? editModal : d));
              setEditModal(null);
              showToast('Admission updated successfully');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Program</label>
                  <select value={editModal.program} onChange={e => setEditModal({...editModal, program: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {programs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Batch</label>
                  <input type="text" value={editModal.batch} onChange={e => setEditModal({...editModal, batch: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Counselor</label>
                  <input type="text" value={editModal.counselor} onChange={e => setEditModal({...editModal, counselor: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admission Status</label>
                  <select value={editModal.status} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Fee</label>
                  <input type="number" value={editModal.totalFee} onChange={e => setEditModal({...editModal, totalFee: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes / Remarks</label>
                  <textarea rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE PAYMENT MODAL */}
      {paymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Update Payment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {paymentModal.studentName} ({paymentModal.id})</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Fee</div><div style={{ fontWeight: 'bold' }}>{formatCurrency(paymentModal.totalFee)}</div></div>
              <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paid</div><div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formatCurrency(paymentModal.paidFee)}</div></div>
              <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending</div><div style={{ fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(paymentModal.totalFee - paymentModal.paidFee)}</div></div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const amountToAdd = Number(formData.get('amount'));
              const newPaidFee = paymentModal.paidFee + amountToAdd;
              const newPaymentStatus = newPaidFee >= paymentModal.totalFee ? 'Paid' : 'Partial';
              const updatedRecord = { ...paymentModal, paidFee: newPaidFee, paymentStatus: newPaymentStatus as any };
              
              setData(prev => prev.map(d => d.id === paymentModal.id ? updatedRecord : d));
              setFilteredData(prev => prev.map(d => d.id === paymentModal.id ? updatedRecord : d));
              
              setPaymentModal(null);
              showToast(`Payment of ${formatCurrency(amountToAdd)} recorded. Revenue dashboard updated.`);
              simulateDownload(`Fee_Receipt_${paymentModal.id}.pdf`);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Amount (₹)</label><input name="amount" required type="number" max={paymentModal.totalFee - paymentModal.paidFee} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Discount (₹)</label><input type="number" defaultValue={0} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                  <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scholarship (₹)</label><input type="number" defaultValue={0} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Method</label>
                  <select required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <option value="upi">UPI / Online</option><option value="bank">Bank Transfer / NEFT</option><option value="cash">Cash</option><option value="cheque">Cheque</option>
                  </select>
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transaction ID / Ref No.</label><input required type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Date</label><input required type="date" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setPaymentModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENTS MODAL */}
      {docsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Upload Documents</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {docsModal.studentName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setData(prev => prev.map(d => d.id === docsModal.id ? {...d, documents: d.documents + 1} : d));
              setFilteredData(prev => prev.map(d => d.id === docsModal.id ? {...d, documents: d.documents + 1} : d));
              setDocsModal(null);
              showToast('Documents uploaded successfully and linked to admission.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Document Type</label>
                  <select required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <option value="aadhaar">Aadhaar Card</option><option value="pan">PAN Card</option><option value="10th">10th Marks Card</option><option value="12th">12th Marks Card</option><option value="degree">Degree Certificate</option><option value="resume">Resume</option><option value="photo">Passport Photo</option><option value="other">Other</option>
                  </select>
                </div>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                  <UploadCloud size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 8px' }}/>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Click to browse or drag file here</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Support PDF, JPG, PNG (Max 5MB)</div>
                  <input type="file" required style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setDocsModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Upload File</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE BATCH MODAL */}
      {batchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Assign Batch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Reassign {batchModal.studentName} to a new cohort.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newBatch = formData.get('batch') as string;
              setData(prev => prev.map(d => d.id === batchModal.id ? {...d, batch: newBatch} : d));
              setFilteredData(prev => prev.map(d => d.id === batchModal.id ? {...d, batch: newBatch} : d));
              setBatchModal(null);
              showToast(`Student successfully assigned to ${newBatch}. Notifications sent.`);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Current Batch</div><div style={{ fontWeight: 600 }}>{batchModal.batch}</div></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select New Batch</label>
                  <select name="batch" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {Array.from({length: 10}).map((_,i) => <option key={i} value={`Batch ${i+1}`}>Batch {i+1}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setBatchModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Confirm Move</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Admission?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to permanently delete {deleteModal}? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
