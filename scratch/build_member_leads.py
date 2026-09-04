import os

os.makedirs('src/app/member-leads', exist_ok=True)
page_path = "src/app/member-leads/page.tsx"

code = """'use client';

import React, { useState, useEffect } from 'react';
import { useCRM, Lead } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Square, FileText, CheckCircle, Clock, XCircle, AlertCircle, PhoneCall, UploadCloud, RefreshCw, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionMenu, ActionMenuItem } from '@/components/common/ActionMenu';
import { openWhatsApp, openEmail, createGoogleCalendarEvent } from '@/lib/integrations';
import { PremiumInput, PremiumSelect, PremiumTextArea, PremiumCard } from '@/components/common/PremiumForm';
import { SlidePanel } from '@/components/common/PremiumModal';
import { StatusBadge } from '@/components/common/StatusBadge';

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
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}

export default function MemberLeadsPage() {
  const { leads, updateLead, deleteLead, addFollowUpToLead } = useCRM();
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  
  // Fake "Logged-In Member" for demonstration
  const CURRENT_USER = 'Me'; 

  // Sync with main CRM state, but ONLY assigned leads
  useEffect(() => {
    // In a real app, 'Me' would be the currently authenticated member's name or ID.
    // For demo purposes, let's treat leads assigned to 'Me' OR 'John Doe' as assigned to this member.
    const assigned = leads.filter(l => l.assignedMember === CURRENT_USER || l.assignedMember === 'John Doe');
    setLocalLeads(assigned);
  }, [leads]);

  // --- Filtering & Searching ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredLeads = localLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile.includes(searchTerm) ||
      lead.program.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    const matchesPriority = priorityFilter ? lead.priority === priorityFilter : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- KPI Metrics ---
  const metrics = {
    total: localLeads.length,
    new: localLeads.filter(l => l.status === 'New').length,
    contacted: localLeads.filter(l => l.status === 'Contacted').length,
    followUp: localLeads.filter(l => l.status === 'Follow-up').length,
    demo: localLeads.filter(l => l.status === 'Demo Scheduled').length,
    converted: localLeads.filter(l => l.status === 'Converted').length,
    lost: localLeads.filter(l => l.status === 'Lost').length,
    conversionRate: localLeads.length > 0 ? ((localLeads.filter(l => l.status === 'Converted').length / localLeads.length) * 100).toFixed(1) + '%' : '0%'
  };

  // --- Modals State ---
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const openModal = (modal: string, lead: Lead) => {
    setSelectedLead(lead);
    setFormData({...lead});
    setActiveModal(modal);
    setActiveMenuId(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLead(null);
    setFormData({});
  };

  const handleEditSave = () => {
    if (selectedLead) {
      updateLead(selectedLead.id, {
        notes: formData.notes,
        nextFollowUp: formData.nextFollowUp,
        status: formData.status,
        priority: formData.priority,
      });
      showToast('Lead updated successfully');
      closeModal();
    }
  };

  const handleFollowUpSave = () => {
    if (selectedLead) {
      const followUpEntry = {
        date: formData.followUpDate,
        method: formData.followUpMethod || 'Phone Call',
        notes: formData.followUpNotes,
      };
      addFollowUpToLead(selectedLead.id, followUpEntry);
      
      // Update next follow up date and status implicitly
      updateLead(selectedLead.id, {
        nextFollowUp: formData.followUpDate,
        status: 'Follow-up'
      });
      
      showToast(`Follow-up scheduled via ${followUpEntry.method}`);
      closeModal();
    }
  };

  const handleDemoSave = () => {
    if (selectedLead) {
      updateLead(selectedLead.id, {
        status: 'Demo Scheduled',
        notes: (selectedLead.notes ? selectedLead.notes + "\\n" : "") + `Demo Scheduled for ${formData.demoDate} at ${formData.demoTime} with ${formData.demoFaculty}`,
      });
      createGoogleCalendarEvent(`Demo: ${selectedLead.name} - ${formData.demoFaculty}`, formData.demoDate, formData.demoTime);
      showToast('Demo scheduled successfully');
      closeModal();
    }
  };

  // --- Actions ---
  const handleExport = (format: 'pdf'|'excel'|'csv') => {
    showToast(`Exporting ${filteredLeads.length} leads as ${format.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '20px', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Assigned Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your leads, schedule follow-ups, and track conversions.</p>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-panel" onClick={() => setStatusFilter('')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(37,99,235,0.1)', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}><Target size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.total}</div><div style={{ color: 'var(--text-secondary)' }}>Total Assigned</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('New')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><AlertCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.new}</div><div style={{ color: 'var(--text-secondary)' }}>New Leads</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('Follow-up')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '16px', borderRadius: '50%', color: '#f59e0b' }}><RefreshCw size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.followUp}</div><div style={{ color: 'var(--text-secondary)' }}>Follow-up Required</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('Demo Scheduled')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: '16px', borderRadius: '50%', color: '#8b5cf6' }}><Calendar size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.demo}</div><div style={{ color: 'var(--text-secondary)' }}>Demo Scheduled</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('Contacted')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}><PhoneCall size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.contacted}</div><div style={{ color: 'var(--text-secondary)' }}>Contacted Leads</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('Converted')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><CheckCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.converted}</div><div style={{ color: 'var(--text-secondary)' }}>Converted</div></div>
        </div>
        <div className="glass-panel" onClick={() => setStatusFilter('Lost')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '50%', color: '#ef4444' }}><XCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.lost}</div><div style={{ color: 'var(--text-secondary)' }}>Lost Leads</div></div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><Target size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.conversionRate}</div><div style={{ color: 'var(--text-secondary)' }}>Conversion Rate</div></div>
        </div>
      </div>

      {/* Toolbar */}
      <DataToolbar 
        searchPlaceholder="Search leads by name, ID, phone..."
        onSearch={setSearchTerm}
        filters={[
          { label: 'All Status', value: '', options: ['New', 'Contacted', 'Follow-up', 'Demo Scheduled', 'Converted', 'Lost'] },
          { label: 'All Priorities', value: '', options: ['High', 'Medium', 'Low'] },
        ]}
        onFilterChange={(index, val) => {
          if (index === 0) setStatusFilter(val);
          if (index === 1) setPriorityFilter(val);
        }}
        actions={[
          { label: 'PDF', onClick: () => handleExport('pdf') },
          { label: 'Excel', onClick: () => handleExport('excel') },
          { label: 'CSV', onClick: () => handleExport('csv') }
        ]}
      />

      {/* Table Area */}
      <div className="glass-panel" style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>Lead ID</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Contact</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Program</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Source</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Follow-up</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{lead.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={lead.avatar} alt={lead.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 600 }}>{lead.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>{lead.mobile}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{lead.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{lead.program}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', fontSize: '0.8rem' }}>
                      {lead.source}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {lead.nextFollowUp ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 500 }}>
                        <Clock size={14} /> {lead.nextFollowUp}
                      </div>
                    ) : <span style={{ color: 'var(--text-secondary)' }}>Not Scheduled</span>}
                  </td>
                  <td style={{ padding: '16px' }}><StatusBadge status={lead.status} type="pipeline" /></td>
                  <td style={{ padding: '16px' }}><StatusBadge status={lead.priority} type="priority" /></td>
                  <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                    <ActionMenu
                      isOpen={activeMenuId === lead.id}
                      onToggle={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        { label: 'View Lead', icon: <FileText size={16} />, onClick: () => openModal('view', lead) },
                        { label: 'Edit Lead', icon: <Edit2 size={16} />, onClick: () => openModal('edit', lead) },
                        { label: 'Add Follow-up', icon: <RefreshCw size={16} />, onClick: () => openModal('followup', lead) },
                        { label: 'Schedule Demo', icon: <Calendar size={16} />, onClick: () => openModal('demo', lead) },
                        { label: 'Upload Docs', icon: <UploadCloud size={16} />, onClick: () => showToast('Upload feature ready') },
                        { label: 'WhatsApp', icon: <MessageCircle size={16} />, onClick: () => openWhatsApp(lead.mobile) },
                        { label: 'Email', icon: <Mail size={16} />, onClick: () => openEmail(lead.email) },
                        { label: 'Call Student', icon: <Phone size={16} />, onClick: () => window.location.href = `tel:${lead.mobile}` },
                        { label: 'Download PDF', icon: <FileText size={16} />, onClick: () => handleExport('pdf') },
                        // No Delete option
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1}
              style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <SlidePanel 
        isOpen={activeModal === 'edit'} 
        onClose={closeModal} 
        title="Edit Lead" 
        subtitle={`Lead ID: ${selectedLead?.id}`} 
        icon={<Edit2 />} 
        width="600px" 
        footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={handleEditSave}>Save Changes</button></>}
      >
        {selectedLead && (
          <PremiumCard title="Lead Details" icon={<FileText size={18} />}>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumInput label="Student Name" name="name" value={selectedLead.name} disabled icon={<UserCheck size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumInput label="Lead Source" name="source" value={selectedLead.source} disabled icon={<Target size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumInput label="Assigned Member" name="assignedMember" value={selectedLead.assignedMember} disabled icon={<UserCheck size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumInput label="Lead ID" name="id" value={selectedLead.id} disabled icon={<FileText size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumSelect label="Status" name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} options={['New', 'Contacted', 'Follow-up', 'Demo Scheduled', 'Converted', 'Lost']} icon={<AlertCircle size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / 3' }}>
              <PremiumSelect label="Priority" name="priority" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} options={['High', 'Medium', 'Low']} icon={<AlertCircle size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PremiumInput label="Next Follow-up" name="nextFollowUp" type="datetime-local" value={formData.nextFollowUp || ''} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} icon={<Clock size={16} />} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PremiumTextArea label="Notes" name="notes" value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={4} icon={<FileText size={16} />} />
            </div>
          </PremiumCard>
        )}
      </SlidePanel>

      {/* Follow-up Modal */}
      <SlidePanel 
        isOpen={activeModal === 'followup'} 
        onClose={closeModal} 
        title="Schedule Follow-up" 
        subtitle={`For: ${selectedLead?.name}`} 
        icon={<RefreshCw />} 
        width="600px" 
        footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={handleFollowUpSave}>Schedule Follow-up</button></>}
      >
        <PremiumCard title="Follow-up Details" icon={<Clock size={18} />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumInput label="Date & Time" name="followUpDate" type="datetime-local" value={formData.followUpDate || ''} onChange={(e) => setFormData({...formData, followUpDate: e.target.value})} icon={<Calendar size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumSelect label="Communication Method" name="followUpMethod" value={formData.followUpMethod || 'Phone Call'} onChange={(e) => setFormData({...formData, followUpMethod: e.target.value})} options={['Phone Call', 'WhatsApp', 'Email', 'Meeting']} icon={<MessageCircle size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumTextArea label="Follow-up Notes" name="followUpNotes" value={formData.followUpNotes || ''} onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})} rows={4} icon={<FileText size={16} />} />
          </div>
        </PremiumCard>
      </SlidePanel>

      {/* Demo Modal */}
      <SlidePanel 
        isOpen={activeModal === 'demo'} 
        onClose={closeModal} 
        title="Schedule Demo" 
        subtitle={`For: ${selectedLead?.name}`} 
        icon={<Calendar />} 
        width="600px" 
        footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={handleDemoSave}>Schedule Demo</button></>}
      >
        <PremiumCard title="Demo Meeting Details" icon={<Calendar size={18} />}>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Date" name="demoDate" type="date" value={formData.demoDate || ''} onChange={(e) => setFormData({...formData, demoDate: e.target.value})} icon={<Calendar size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Time" name="demoTime" type="time" value={formData.demoTime || ''} onChange={(e) => setFormData({...formData, demoTime: e.target.value})} icon={<Clock size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumSelect label="Faculty/Host" name="demoFaculty" value={formData.demoFaculty || 'John Doe'} onChange={(e) => setFormData({...formData, demoFaculty: e.target.value})} options={['John Doe', 'Jane Smith', 'Mike Ross']} icon={<UserCheck size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumSelect label="Meeting Type" name="meetingType" value={formData.meetingType || 'Online'} onChange={(e) => setFormData({...formData, meetingType: e.target.value})} options={['Online', 'Offline']} icon={<Target size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Google Meet Link" name="meetLink" value={formData.meetLink || 'https://meet.google.com/xyz-abc-def'} onChange={(e) => setFormData({...formData, meetLink: e.target.value})} icon={<MessageCircle size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumTextArea label="Notes" name="demoNotes" value={formData.demoNotes || ''} onChange={(e) => setFormData({...formData, demoNotes: e.target.value})} rows={3} icon={<FileText size={16} />} />
          </div>
        </PremiumCard>
      </SlidePanel>
      
      {/* View Modal */}
      <SlidePanel 
        isOpen={activeModal === 'view'} 
        onClose={closeModal} 
        title="View Lead Profile" 
        subtitle={`${selectedLead?.name} - ${selectedLead?.id}`} 
        icon={<UserCheck />} 
        width="600px" 
        footer={<button className="primary-btn" onClick={closeModal}>Close View</button>}
      >
        {selectedLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <img src={selectedLead.avatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>{selectedLead.name}</h3>
                <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> {selectedLead.mobile}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {selectedLead.email}</span>
                </div>
              </div>
            </div>
            
            <PremiumCard title="Lead Information" icon={<FileText size={18} />}>
              <div style={{ gridColumn: '1 / 3', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Program</span>
                <span style={{ fontWeight: 600 }}>{selectedLead.program}</span>
              </div>
              <div style={{ gridColumn: '1 / 3', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Source</span>
                <span style={{ fontWeight: 600 }}>{selectedLead.source}</span>
              </div>
              <div style={{ gridColumn: '1 / 3', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Status</span>
                <StatusBadge status={selectedLead.status} type="pipeline" />
              </div>
              <div style={{ gridColumn: '1 / 3', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Priority</span>
                <StatusBadge status={selectedLead.priority} type="priority" />
              </div>
              <div style={{ gridColumn: '1 / -1', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Notes</span>
                <span>{selectedLead.notes || 'No notes available.'}</span>
              </div>
            </PremiumCard>
          </div>
        )}
      </SlidePanel>

    </div>
  );
}
"""

with open(page_path, "w") as f:
    f.write(code)

print("Member Leads module build completed successfully.")
