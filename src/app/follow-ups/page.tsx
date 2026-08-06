'use client';

import React, { useState, useMemo } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Download, CheckSquare, Square, Eye, Edit, Trash2, PhoneCall, Mail, Calendar as CalendarIcon, MessageSquare, Video, ArrowRightCircle, Plus, FileText, CheckCircle, Printer, FileDown, Clock, Check, Bell, UploadCloud, Users, BadgeAlert, CreditCard, Activity, Link as LinkIcon, Briefcase, File } from 'lucide-react';
import { mockMembers, getRandomMember } from '@/lib/mockMembers';

// --- MOCK DATA GENERATION ---

export interface FollowUpRecord {
  id: string;
  studentName: string;
  mobile: string;
  email: string;
  program: string;
  counselor: string;
  lastFollowUp: string;
  nextFollowUp: string;
  type: 'Call' | 'WhatsApp' | 'Email' | 'Meeting';
  status: 'Pending' | 'Completed' | 'Rescheduled' | 'Missed' | 'Demo Scheduled' | 'Converted';
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  leadSource?: string;
  leadScore?: string;
}

export interface AdmissionRecord {
  id: string;
  studentName: string;
  program: string;
  date: string;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  paymentStatus: 'Verified' | 'Unverified';
  batch: string;
  counselor: string;
  status: 'Active' | 'On Hold' | 'Cancelled';
}

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security'];
const priorities = ['High', 'Medium', 'Low'];
const followUpStatuses = ['Pending', 'Completed', 'Rescheduled', 'Missed', 'Demo Scheduled', 'Converted'];
const types = ['Call', 'WhatsApp', 'Email', 'Meeting'];
const sources = ['Google Ads', 'Facebook Ads', 'Organic Search', 'Referral', 'Direct'];

const generateFollowUps = (): FollowUpRecord[] => {
  const data: FollowUpRecord[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 50; i++) {
    // Generate some today, some past (overdue), some future
    let nextDate = new Date();
    if (i % 5 === 0) nextDate.setDate(today.getDate() - (Math.floor(Math.random() * 5) + 1)); // Overdue
    else if (i % 3 === 0) nextDate.setDate(today.getDate()); // Today
    else nextDate.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1); // Future

    data.push({
      id: `FUP-${8000 + i}`,
      studentName: `Lead Student ${i}`,
      mobile: `+91 98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      email: `lead${i}@example.com`,
      program: programs[Math.floor(Math.random() * programs.length)],
      counselor: getRandomMember().name,
      lastFollowUp: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextFollowUp: nextDate.toISOString().split('T')[0],
      type: types[Math.floor(Math.random() * types.length)] as any,
      status: followUpStatuses[Math.floor(Math.random() * followUpStatuses.length)] as any,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
      notes: 'Initial discussion went well. Need to follow up.',
      leadSource: sources[Math.floor(Math.random() * sources.length)],
      leadScore: `Hot - ${Math.floor(Math.random() * 30 + 70)}%`
    });
  }
  return data;
};

const generateAdmissions = (): AdmissionRecord[] => {
  const data: AdmissionRecord[] = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      id: `ADM-${9000 + i}`,
      studentName: `Enrolled Student ${i}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      feeStatus: Math.random() > 0.5 ? 'Paid' : 'Partial',
      paymentStatus: 'Verified',
      batch: `Batch ${Math.floor(Math.random() * 5) + 1}`,
      counselor: getRandomMember().name,
      status: 'Active'
    });
  }
  return data;
};

const mockFollowUps = generateFollowUps();
const mockAdmissions = generateAdmissions();

// --- COMPONENTS ---

export default function FollowUpsPage() {
  const [activeTab, setActiveTab] = useState<'followups' | 'admissions'>('followups');
  
  // Follow-ups State
  const [fData, setFData] = useState<FollowUpRecord[]>(mockFollowUps);
  const [fFiltered, setFFiltered] = useState<FollowUpRecord[]>(mockFollowUps);
  const [fSelected, setFSelected] = useState<Set<string>>(new Set());
  const [fPage, setFPage] = useState(1);

  // Admissions State
  const [aData, setAData] = useState<AdmissionRecord[]>(mockAdmissions);
  const [aFiltered, setAFiltered] = useState<AdmissionRecord[]>(mockAdmissions);
  const [aSelected, setASelected] = useState<Set<string>>(new Set());
  const [aPage, setAPage] = useState(1);

  // Modal States
  const [viewModal, setViewModal] = useState<any>(null);
  const [editFModal, setEditFModal] = useState<FollowUpRecord | null>(null);
  const [scheduleModal, setScheduleModal] = useState<FollowUpRecord | null>(null);
  const [demoModal, setDemoModal] = useState<FollowUpRecord | null>(null);
  const [timelineModal, setTimelineModal] = useState<FollowUpRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<{id: string, type: 'followup' | 'admission'} | null>(null);

  // KPI Drill-down State
  const [activeKpiView, setActiveKpiView] = useState<'total' | 'today' | 'pending' | 'completed' | 'overdue' | 'demo' | 'admissions' | null>(null);

  const itemsPerPage = 15;
  const todayStr = new Date().toISOString().split('T')[0];

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
    showToast(`${filename} downloaded successfully`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Converted': case 'Paid': case 'Verified': case 'Active': return { bg: '#d1fae5', text: '#059669' };
      case 'Missed': case 'Cancelled': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Demo Scheduled': return { bg: '#e0e7ff', text: '#4f46e5' };
      case 'Pending': case 'Rescheduled': case 'Partial': case 'On Hold': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#4b5563';
    }
  };

  const isOverdue = (fup: FollowUpRecord) => {
    return new Date(fup.nextFollowUp) < new Date(todayStr) && fup.status !== 'Completed' && fup.status !== 'Converted';
  };

  // --- ACTIONS ---

  const handleConvertToAdmission = (fup: FollowUpRecord) => {
    setFData(prev => prev.filter(f => f.id !== fup.id));
    setFFiltered(prev => prev.filter(f => f.id !== fup.id));
    
    const newAdm: AdmissionRecord = {
      id: `ADM-${Math.floor(Math.random() * 90000) + 10000}`,
      studentName: fup.studentName,
      program: fup.program,
      date: new Date().toISOString().split('T')[0],
      feeStatus: 'Pending',
      paymentStatus: 'Unverified',
      batch: 'Batch Pending',
      counselor: fup.counselor,
      status: 'Active'
    };
    setAData(prev => [newAdm, ...prev]);
    setAFiltered(prev => [newAdm, ...prev]);
    
    showToast(`${fup.studentName} successfully converted to Admission! Dashboard metrics updated.`);
  };

  const handleDelete = () => {
    if (deleteModal) {
      if (deleteModal.type === 'followup') {
        setFData(prev => prev.filter(f => f.id !== deleteModal.id));
        setFFiltered(prev => prev.filter(f => f.id !== deleteModal.id));
      } else {
        setAData(prev => prev.filter(a => a.id !== deleteModal.id));
        setAFiltered(prev => prev.filter(a => a.id !== deleteModal.id));
      }
      setDeleteModal(null);
      showToast('Record deleted successfully');
    }
  };

  // --- RENDERERS ---

  const fCurrentData = fFiltered.slice((fPage - 1) * itemsPerPage, fPage * itemsPerPage);
  const aCurrentData = aFiltered.slice((aPage - 1) * itemsPerPage, aPage * itemsPerPage);

  const kpis = {
    total: fData,
    today: fData.filter(f => f.nextFollowUp === todayStr && f.status !== 'Completed'),
    pending: fData.filter(f => f.status === 'Pending'),
    completed: fData.filter(f => f.status === 'Completed'),
    overdue: fData.filter(f => isOverdue(f)),
    demo: fData.filter(f => f.status === 'Demo Scheduled'),
    admissions: aData
  };

  const getActionMenu = (f: FollowUpRecord) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <Eye size={16}/>, onClick: () => setViewModal(f) },
      { label: 'View Timeline', icon: <Activity size={16}/>, onClick: () => setTimelineModal(f) },
      { label: 'Edit Follow-up', icon: <Edit size={16}/>, onClick: () => setEditFModal(f) },
      { label: 'Schedule Next Follow-up', icon: <CalendarIcon size={16}/>, onClick: () => setScheduleModal(f) },
      { label: 'Schedule Demo', icon: <Video size={16}/>, onClick: () => setDemoModal(f) },
      { label: 'Convert to Admission', icon: <ArrowRightCircle size={16} color="#10b981"/>, onClick: () => handleConvertToAdmission(f) },
      { label: 'Call Student', icon: <PhoneCall size={16}/>, onClick: () => window.open(`tel:${f.mobile}`, '_blank') },
      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageSquare size={16} color="#25D366"/>, onClick: () => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); } },
      { label: 'Send Email', icon: <Mail size={16}/>, onClick: () => window.open(`mailto:${f.email}`, '_blank') },
      { label: 'Add Notes', icon: <FileText size={16}/>, onClick: () => setEditFModal(f) },
      { label: 'Download PDF', icon: <FileDown size={16}/>, onClick: () => simulateDownload(`FollowUp_${f.id}.pdf`, `Record: ${f.id}\nName: ${f.studentName}`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => { window.print(); showToast('Preparing print view...'); } },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal({id: f.id, type: 'followup'}) }
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Follow-ups & Admissions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your pipeline, schedule demos, and convert leads.</p>
        </div>
      </div>

      {/* CLICKABLE KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { id: 'total', label: 'Total Follow-ups', val: kpis.total.length, color: '#3b82f6' },
          { id: 'today', label: 'Today\'s Tasks', val: kpis.today.length, color: '#f59e0b' },
          { id: 'pending', label: 'Pending', val: kpis.pending.length, color: '#8b5cf6' },
          { id: 'completed', label: 'Completed', val: kpis.completed.length, color: '#10b981' },
          { id: 'overdue', label: 'Overdue', val: kpis.overdue.length, color: '#ef4444' },
          { id: 'demo', label: 'Demos Scheduled', val: kpis.demo.length, color: '#6366f1' },
          { id: 'admissions', label: 'Total Admissions', val: kpis.admissions.length, color: '#059669' }
        ].map((k, i) => (
          <div key={i} onClick={() => setActiveKpiView(k.id as any)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* MAIN DATA TABLES */}
      {!activeKpiView && (
        <>
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button onClick={() => setActiveTab('followups')} style={{ background: 'transparent', border: 'none', padding: '8px 16px', fontSize: '1.1rem', fontWeight: 600, color: activeTab === 'followups' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'followups' ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer' }}>Active Follow-ups</button>
            <button onClick={() => setActiveTab('admissions')} style={{ background: 'transparent', border: 'none', padding: '8px 16px', fontSize: '1.1rem', fontWeight: 600, color: activeTab === 'admissions' ? 'var(--primary-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'admissions' ? '2px solid var(--primary-color)' : 'none', cursor: 'pointer' }}>Admissions Ledger</button>
          </div>

          {activeTab === 'followups' && (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <DataToolbar 
                data={fData} onFilteredDataChange={setFFiltered} searchKeys={['studentName', 'mobile', 'email', 'id']} searchPlaceholder="Search leads..."
                filterOptions={[
                  { key: 'status', label: 'Status', type: 'select', options: followUpStatuses },
                  { key: 'priority', label: 'Priority', type: 'select', options: priorities }
                ]}
                selectedItems={fCurrentData.filter(c => fSelected.has(c.id))} exportFilename="FollowUps_Export"
              />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Lead Info</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Counselor</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Schedule</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status & Priority</th>
                      <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fCurrentData.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600 }}>{f.studentName}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{f.mobile}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.program}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{f.counselor}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>Next: {f.nextFollowUp}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Last: {f.lastFollowUp}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(f.status).bg, color: getStatusColor(f.status).text, display: 'inline-block', marginBottom: '4px' }}>{f.status}</span>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: getPriorityColor(f.priority) }}>• {f.priority} Priority</div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>{getActionMenu(f)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <DataToolbar data={aData} onFilteredDataChange={setAFiltered} searchKeys={['studentName', 'id', 'program']} searchPlaceholder="Search admissions..." />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Admission Info</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Batch</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aCurrentData.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '16px 24px' }}><div style={{ fontWeight: 600 }}>{a.studentName}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{a.id} • {a.date}</div></td>
                        <td style={{ padding: '16px 12px' }}><div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{a.program}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{a.batch}</div></td>
                        <td style={{ padding: '16px 12px' }}><span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(a.status).bg, color: getStatusColor(a.status).text, display: 'inline-block' }}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* KPI DRILL-DOWN MODALS */}
      {activeKpiView && (
        <div className="glass-panel fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {activeKpiView === 'total' && 'All Active Follow-ups'}
                {activeKpiView === 'today' && "Today's Scheduled Tasks"}
                {activeKpiView === 'pending' && 'Pending Follow-ups'}
                {activeKpiView === 'completed' && 'Completed Follow-ups'}
                {activeKpiView === 'overdue' && 'Overdue Follow-ups (Requires Attention)'}
                {activeKpiView === 'demo' && 'Scheduled Demos'}
                {activeKpiView === 'admissions' && 'Admissions Ledger'}
              </h2>
            </div>
            <button onClick={() => setActiveKpiView(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 600, cursor: 'pointer' }}>Close View</button>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Student</th>
                  {activeKpiView === 'demo' ? (
                    <>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Faculty</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Date & Time</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Meeting Link</th>
                    </>
                  ) : activeKpiView === 'admissions' ? (
                    <>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Batch</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Admission Date</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Fee Status</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program & Counselor</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Schedule</th>
                      <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                    </>
                  )}
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {kpis[activeKpiView].map((row: any) => {
                  const isRed = activeKpiView === 'overdue';
                  return (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: isRed ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: isRed ? '#dc2626' : 'var(--text-primary)' }}>{row.studentName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.id}</div>
                      </td>
                      
                      {activeKpiView === 'demo' ? (
                        <>
                          <td style={{ padding: '16px 12px' }}><div style={{ fontWeight: 500 }}>{row.counselor}</div></td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: 600 }}>{row.nextFollowUp}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>10:00 AM</div>
                          </td>
                          <td style={{ padding: '16px 12px' }}><a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>meet.google.com/xyz</a></td>
                        </>
                      ) : activeKpiView === 'admissions' ? (
                        <>
                          <td style={{ padding: '16px 12px' }}><div style={{ fontWeight: 500 }}>{row.program}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.batch}</div></td>
                          <td style={{ padding: '16px 12px' }}>{row.date}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(row.feeStatus).bg, color: getStatusColor(row.feeStatus).text, display: 'inline-block' }}>{row.feeStatus}</span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{row.program}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{row.counselor}</div>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontSize: '0.9rem', color: isRed ? '#dc2626' : 'var(--primary-color)', fontWeight: 600 }}>Next: {row.nextFollowUp}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Last: {row.lastFollowUp}</div>
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(row.status).bg, color: getStatusColor(row.status).text, display: 'inline-block' }}>{row.status}</span>
                          </td>
                        </>
                      )}
                      
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {activeKpiView === 'today' || activeKpiView === 'overdue' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => { setFData(prev => prev.map(f => f.id === row.id ? {...f, status: 'Completed'} : f)); showToast('Task marked as Complete'); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #10b981', background: 'transparent', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Complete</button>
                            <button onClick={() => setScheduleModal(row)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Reschedule</button>
                            {activeKpiView === 'overdue' && <button onClick={() => showToast('Reminder Sent via Email & WhatsApp')} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Bell size={14}/> Send Reminder</button>}
                          </div>
                        ) : activeKpiView === 'admissions' ? null : getActionMenu(row)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

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
                    <span>Lead ID: <strong>{viewModal.id}</strong></span>
                    <span>|</span>
                    <span style={{ color: '#dc2626', fontWeight: 600 }}>Score: {viewModal.leadScore}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Contact & Personal Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Mobile</span> <span style={{ fontWeight: 500 }}>{viewModal.mobile}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Email</span> <span style={{ fontWeight: 500 }}>{viewModal.email}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Address</span> <span style={{ fontWeight: 500, textAlign: 'right' }}>123 Tech Park,<br/>Silicon City</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>College</span> <span style={{ fontWeight: 500 }}>Global Institute</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Qualification</span> <span style={{ fontWeight: 500 }}>B.Tech 2024</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Lead Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Program</span> <span style={{ fontWeight: 500 }}>{viewModal.program}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Assigned To</span> <span style={{ fontWeight: 500 }}>{viewModal.counselor}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Lead Source</span> <span style={{ fontWeight: 500 }}>{viewModal.leadSource}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Priority</span> <span style={{ fontWeight: 600, color: getPriorityColor(viewModal.priority) }}>{viewModal.priority}</span></div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Communication & Activity Log</h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <button onClick={() => window.open(`tel:${viewModal.mobile}`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}><PhoneCall size={16}/> Call History (3)</button>
                  <button onClick={() => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #25D366', background: 'rgba(37,211,102,0.05)', color: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}><MessageSquare size={16}/> WhatsApp Sync (12)</button>
                  <button onClick={() => window.open(`mailto:${viewModal.email}`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}><Mail size={16}/> Email Threads (2)</button>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ marginBottom: '12px' }}><strong>{viewModal.nextFollowUp}</strong> - Scheduled: {viewModal.type}</div>
                  <div style={{ marginBottom: '12px' }}><strong>{viewModal.lastFollowUp}</strong> - Outbound call completed. Duration: 5m 23s.</div>
                  <div style={{ color: 'var(--text-tertiary)' }}>Remarks: {viewModal.notes}</div>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Uploaded Documents</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={14}/> Resume.pdf</div>
                  <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={14}/> ID_Proof.jpg</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setTimelineModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Activity size={16} /> View Timeline</button>
              <button onClick={() => { setEditFModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Details</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TIMELINE MODAL */}
      {timelineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity color="var(--primary-color)"/> Student Journey Timeline</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>For {timelineModal.studentName}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', bottom: '16px', left: '19px', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
              
              {[
                { icon: <Plus size={16}/>, color: '#6366f1', title: 'Lead Created', desc: `Imported via ${timelineModal.leadSource}`, time: timelineModal.lastFollowUp },
                { icon: <PhoneCall size={16}/>, color: '#3b82f6', title: 'Call Completed', desc: 'Counselor made initial contact', time: timelineModal.lastFollowUp },
                { icon: <Mail size={16}/>, color: '#f59e0b', title: 'Email Sent', desc: 'Program brochure dispatched', time: '1 Day Ago' },
                { icon: <MessageSquare size={16}/>, color: '#25D366', title: 'WhatsApp Sent', desc: 'Automated greeting sent', time: '1 Day Ago' },
                { icon: <Video size={16}/>, color: '#8b5cf6', title: 'Demo Scheduled', desc: 'Google Meet invite generated', time: 'Pending' },
                { icon: <ArrowRightCircle size={16}/>, color: '#10b981', title: 'Admission & Payment', desc: 'Awaiting conversion', time: 'Pending' }
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

      {/* EDIT FOLLOW-UP */}
      {editFModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Edit Follow-up: {editFModal.id}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setFData(prev => prev.map(f => f.id === editFModal.id ? editFModal : f));
              setFFiltered(prev => prev.map(f => f.id === editFModal.id ? editFModal : f));
              setEditFModal(null);
              showToast('Follow-up updated successfully');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Student Name</label><input type="text" value={editFModal.studentName} onChange={e => setEditFModal({...editFModal, studentName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Program</label><select value={editFModal.program} onChange={e => setEditFModal({...editFModal, program: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>{programs.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Next Date</label><input type="date" value={editFModal.nextFollowUp} onChange={e => setEditFModal({...editFModal, nextFollowUp: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Next Time</label><input type="time" defaultValue="10:00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Counselor</label><input type="text" value={editFModal.counselor} onChange={e => setEditFModal({...editFModal, counselor: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label><select value={editFModal.status} onChange={e => setEditFModal({...editFModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>{followUpStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label><select value={editFModal.priority} onChange={e => setEditFModal({...editFModal, priority: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>{priorities.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes</label><textarea rows={3} value={editFModal.notes} onChange={e => setEditFModal({...editFModal, notes: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical' }} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setEditFModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE NEXT */}
      {scheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Schedule Follow-up</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {scheduleModal.studentName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setScheduleModal(null);
              showToast('Follow-up scheduled and added to calendar');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date</label><input required type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Time</label><input required type="time" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Reminder</label>
                  <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <option>10 mins before</option><option>1 hour before</option><option>1 day before</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Communication Method</label>
                  <select required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <option value="Call">Call</option><option value="WhatsApp">WhatsApp</option><option value="Email">Email</option><option value="Meeting">Meeting</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setScheduleModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE DEMO */}
      {demoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Schedule Demo</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {demoModal.studentName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setFData(prev => prev.map(f => f.id === demoModal.id ? {...f, status: 'Demo Scheduled'} : f));
              setFFiltered(prev => prev.map(f => f.id === demoModal.id ? {...f, status: 'Demo Scheduled'} : f));
              setDemoModal(null);
              showToast('Demo scheduled. Calendar updated and notifications sent.');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date</label><input required type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Time</label><input required type="time" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Faculty / Host</label><input required type="text" placeholder="John Smith" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mode</label><select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}><option>Online (GMeet)</option><option>Offline (Campus)</option></select></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google Meet / Location</label><input required type="url" placeholder="https://meet.google.com/..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notes</label><textarea rows={2} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={() => setDemoModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Confirm Demo</button>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Record?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete {deleteModal.id}? This action cannot be undone.</p>
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
