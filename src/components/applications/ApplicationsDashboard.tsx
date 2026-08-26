'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCRM, Application } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { 
  FileText, CheckCircle, XCircle, Clock, FileCheck, CheckSquare, 
  Send, Eye, Edit, Upload, Calendar, Building, DollarSign, Printer, Download, UserCheck
} from 'lucide-react';
import { ViewDetailsModal } from './modals/ViewDetailsModal';
import { EditApplicationModal } from './modals/EditApplicationModal';
import { ActionModal } from './modals/ActionModal';
import { mockMembers } from '@/lib/mockMembers';
import { leadsData } from '@/lib/data/mockData';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  activeStatus: string;
}

const showToast = (message: string) => {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#10b981';
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
};

export function ApplicationsDashboard({ activeStatus }: Props) {
  const router = useRouter();
  const { applications, updateApplication } = useCRM();
  
  const displayData = useMemo(() => {
    if (activeStatus === 'All Applications') return applications;
    return applications.filter(a => a.status === activeStatus);
  }, [applications, activeStatus]);

  const [filteredData, setFilteredData] = useState<Application[]>(displayData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals state
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [actionModal, setActionModal] = useState<{title: string, text: string, onConfirm: () => void} | null>(null);

  const itemsPerPage = 15;
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // KPIs
  const totalApps = applications.length;
  const draftApps = applications.filter(a => a.status === 'Draft').length;
  const submittedApps = applications.filter(a => a.status === 'Submitted').length;
  const underReviewApps = applications.filter(a => a.status === 'Under Review').length;
  const docsPendingApps = applications.filter(a => a.status === 'Documents Pending').length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  const admissionCompletedApps = applications.filter(a => a.status === 'Admission Completed').length;

  const handleKpiClick = (status: string) => {
    router.push(`/applications?status=${encodeURIComponent(status)}`);
  };

  const updateAppStatus = (app: Application, newStatus: Application['status']) => {
    updateApplication({ ...app, status: newStatus });
    showToast(`Application marked as ${newStatus}`);
  };

  const handleAction = (action: string, app: Application) => {
    setActiveMenuId(null);
    switch (action) {
      case 'view':
        setViewApp(app);
        break;
      case 'edit':
        setEditApp(app);
        break;
      case 'approve':
        setActionModal({
          title: 'Approve Application',
          text: `Are you sure you want to approve the application for ${app.name}?`,
          onConfirm: () => { updateAppStatus(app, 'Approved'); setActionModal(null); }
        });
        break;
      case 'reject':
        setActionModal({
          title: 'Reject Application',
          text: `Are you sure you want to reject the application for ${app.name}?`,
          onConfirm: () => { updateAppStatus(app, 'Rejected'); setActionModal(null); }
        });
        break;
      case 'convert':
        setActionModal({
          title: 'Convert to Admission',
          text: `Are you sure you want to convert ${app.name}'s application to an admission?`,
          onConfirm: () => { updateAppStatus(app, 'Admission Completed'); setActionModal(null); }
        });
        break;
      case 'verifyDocs':
        updateApplication({ ...app, documentStatus: 'Verified' });
        showToast('Documents verified');
        break;
      case 'uploadDocs':
        showToast('Document upload modal would open here.');
        break;
      case 'scheduleInterview':
        showToast('Interview scheduling modal would open here.');
        break;
      case 'scheduleDemo':
        showToast('Demo scheduling modal would open here.');
        break;
      case 'pdf':
      case 'download':
        showToast('Application PDF downloaded.');
        break;
      case 'print':
        window.print();
        break;
      case 'email':
        showToast('Email composer opened.');
        break;
      case 'whatsapp':
        showToast('WhatsApp opened.');
        break;
      case 'timeline':
        setViewApp(app); // Shows timeline in view details
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': case 'Admission Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review': case 'Submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Documents Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeStatus}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage student enrollment applications from draft to admission.</p>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Applications', value: totalApps, icon: <FileText size={20}/>, status: 'All Applications' },
          { label: 'Draft', value: draftApps, icon: <Edit size={20}/>, status: 'Draft' },
          { label: 'Submitted', value: submittedApps, icon: <Send size={20}/>, status: 'Submitted' },
          { label: 'Under Review', value: underReviewApps, icon: <Clock size={20}/>, status: 'Under Review' },
          { label: 'Documents Pending', value: docsPendingApps, icon: <FileCheck size={20}/>, status: 'Documents Pending' },
          { label: 'Approved', value: approvedApps, icon: <CheckCircle size={20}/>, status: 'Approved' },
          { label: 'Rejected', value: rejectedApps, icon: <XCircle size={20}/>, status: 'Rejected' },
          { label: 'Admission Completed', value: admissionCompletedApps, icon: <Building size={20}/>, status: 'Admission Completed' },
        ].map((kpi, idx) => {
          const isActive = activeStatus === kpi.status;
        
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  return (
            <div 
              key={idx} 
              onClick={() => handleKpiClick(kpi.status)}
              style={{ 
                background: isActive ? 'var(--primary-color)' : 'var(--bg-secondary)', 
                color: isActive ? 'white' : 'inherit',
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid var(--glass-border)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ padding: '12px', background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.1)', color: isActive ? 'white' : '#3b82f6', borderRadius: '12px' }}>
                {kpi.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpi.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px' }}>
        <DataToolbar 
          data={displayData} 
          onFilteredDataChange={(f) => { setFilteredData(f); setPage(1); }} 
          searchKeys={['id', 'name', 'mobile', 'email', 'program']}
          searchPlaceholder="Search by ID, name, email, mobile..."
          exportFilename={`Applications_${activeStatus}`}
          filterOptions={[
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Submitted', 'Under Review', 'Documents Pending', 'Approved', 'Rejected', 'Admission Completed'] },
            { key: 'program', label: 'Program', type: 'select', options: ['Full Stack Development', 'Data Science', 'AI & Machine Learning', 'Cloud Computing'] },
            { key: 'verificationStatus', label: 'Verification', type: 'select', options: ['Pending', 'In Progress', 'Verified', 'Failed'] },
            { key: 'paymentStatus', label: 'Payment', type: 'select', options: ['Pending', 'Partial', 'Paid'] }
          ]}
          selectedItems={currentData.filter(d => selectedRows.has(d.id))}
          exportMapping={[
            { key: 'id', label: 'App ID' },
            { key: 'name', label: 'Student' },
            { key: 'mobile', label: 'Mobile' },
            { key: 'email', label: 'Email' },
            { key: 'program', label: 'Program' },
            { key: 'status', label: 'App Status' },
            { key: 'documentStatus', label: 'Docs' },
            { key: 'paymentStatus', label: 'Payment' }
          ]}
        />

        <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>App ID & Student</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Contact</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Program & Qual.</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Docs & Payment</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Assigned</th>
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {app.photo ? (
                        <img src={app.photo} alt={app.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {app.name ? app.name.charAt(0) : '?'}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{app.id}</div>
                        <div style={{ fontWeight: 600 }}>{app.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(app.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                    <div>{app.mobile}</div>
                    <div style={{ color: 'var(--text-tertiary)' }}>{app.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: 500 }}>{app.program}</div>
                    <div style={{ color: 'var(--text-tertiary)' }}>{app.qualification}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: app.documentStatus === 'Verified' ? '#10b981' : '#d97706' }}>
                      <FileCheck size={14}/> Docs: {app.documentStatus}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: app.paymentStatus === 'Paid' ? '#10b981' : '#d97706', marginTop: '4px' }}>
                      <DollarSign size={14}/> Pay: {app.paymentStatus}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: app.verificationStatus === 'Verified' ? '#10b981' : '#3b82f6', marginTop: '4px' }}>
                      <UserCheck size={14}/> Verif: {app.verificationStatus}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                    <div><span style={{color: 'var(--text-tertiary)'}}>C:</span> {app.counselor}</div>
                    <div><span style={{color: 'var(--text-tertiary)'}}>M:</span> {app.member}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <ActionMenu 
                      isOpen={activeMenuId === app.id}
                      onToggle={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        { label: 'View Details', icon: <Eye size={16} />, onClick: () => handleAction('view', app) },
                        { label: 'Edit Application', icon: <Edit size={16} />, onClick: () => handleAction('edit', app) },
                        { label: 'Verify Documents', icon: <CheckSquare size={16} />, onClick: () => handleAction('verifyDocs', app) },
                        { label: 'Upload Documents', icon: <Upload size={16} />, onClick: () => handleAction('uploadDocs', app) },
                        { divider: true, label: '' },
                        { label: 'Schedule Interview', icon: <Calendar size={16} />, onClick: () => handleAction('scheduleInterview', app) },
                        { label: 'Schedule Demo', icon: <Calendar size={16} />, onClick: () => handleAction('scheduleDemo', app) },
                        { divider: true, label: '' },
                        { label: 'Approve', icon: <CheckCircle size={16} />, color: '#10b981', onClick: () => handleAction('approve', app) },
                        { label: 'Reject', icon: <XCircle size={16} />, color: '#ef4444', onClick: () => handleAction('reject', app) },
                        { label: 'Convert to Admission', icon: <Building size={16} />, color: '#3b82f6', onClick: () => handleAction('convert', app) },
                        { divider: true, label: '' },
                        { label: 'Generate PDF', icon: <FileText size={16} />, onClick: () => handleAction('pdf', app) },
                        { label: 'Print', icon: <Printer size={16} />, onClick: () => handleAction('print', app) },
                        { label: 'Download PDF', icon: <Download size={16} />, onClick: () => handleAction('download', app) },
                        { label: 'Send Email', icon: <Send size={16} />, onClick: () => handleAction('email', app) },
                        { label: 'Activity Timeline', icon: <Clock size={16} />, onClick: () => handleAction('timeline', app) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewApp && <ViewDetailsModal app={viewApp} onClose={() => setViewApp(null)} />}
      {editApp && <EditApplicationModal app={editApp} onClose={() => setEditApp(null)} />}
      {actionModal && <ActionModal {...actionModal} onClose={() => setActionModal(null)} />}
    </div>
  );
}
