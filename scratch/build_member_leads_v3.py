import os

page_path = "src/app/member-leads/page.tsx"

code = """'use client';

import React, { useState, useEffect } from 'react';
import { useCRM, Lead } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Square, FileText, CheckCircle, Clock, XCircle, AlertCircle, PhoneCall, UploadCloud, RefreshCw, Target, Edit2, UserCheck, Plus, BarChart2, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionMenu, ActionMenuItem } from '@/components/common/ActionMenu';
import { openWhatsApp, openEmail, createGoogleCalendarEvent } from '@/lib/integrations';
import { PremiumInput, PremiumSelect, PremiumTextArea, PremiumCard } from '@/components/common/PremiumForm';
import { SlidePanel, FullScreenModal } from '@/components/common/PremiumModal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

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

// 50 Demo Leads Generator
const generateDemoLeads = (): Lead[] => {
  const leads: Lead[] = [];
  const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'Digital Marketing'];
  const sources = ['Website', 'Instagram', 'Facebook', 'LinkedIn', 'Google Ads', 'Referral', 'Walk-in', 'WhatsApp', 'YouTube'];
  const statuses = ['New', 'Contacted', 'Follow-up Required', 'Demo Scheduled', 'Converted', 'Lost'];
  const priorities = ['High', 'Medium', 'Low'];
  const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Kabir', 'Ananya', 'Diya', 'Ishita', 'Sneha', 'Kavya', 'Priya', 'Riya', 'Neha'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Nair', 'Joshi', 'Chauhan'];

  for (let i = 1; i <= 50; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const pStatus = statuses[Math.floor(Math.random() * statuses.length)];
    leads.push({
      id: `L-${10000 + i}`,
      name: `${fn} ${ln}`,
      mobile: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      city: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'][Math.floor(Math.random() * 5)],
      state: ['MH', 'DL', 'KA', 'TS', 'MH'][Math.floor(Math.random() * 5)],
      qualification: 'B.Tech',
      college: 'Local University',
      program: programs[Math.floor(Math.random() * programs.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: 'Me',
      assignedMember: 'Me',
      status: pStatus,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      leadScore: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      notes: 'Demo lead generated automatically.',
      nextFollowUp: pStatus === 'Follow-up Required' ? '2026-08-10 10:00' : undefined
    } as any);
  }
  return leads;
};

export default function MemberLeadsPage() {
  const crmContext = useCRM();
  const leads = crmContext?.leads || [];
  
  // Extend context methods since they are not strongly typed on the base CRMContext yet.
  const updateLead = (crmContext as any).updateLead || ((id: string, updates: any) => console.log('Mock Update:', id, updates));
  const addLead = crmContext?.addLead || ((lead: any) => console.log('Mock Add:', lead));
  const addFollowUpToLead = (crmContext as any).addFollowUpToLead || ((id: string, fu: any) => console.log('Mock FollowUp:', id, fu));
  
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  
  const CURRENT_USER = 'Me'; 
  const [demoInjected, setDemoInjected] = useState(false);

  useEffect(() => {
    let assigned = leads.filter(l => l.assignedMember === CURRENT_USER || l.counselor === CURRENT_USER);
    
    // Inject 50 demo leads if empty and not yet injected
    if (assigned.length === 0 && !demoInjected) {
      const generated = generateDemoLeads();
      // To simulate full integration without writing to localstorage repeatedly in loop, we'll just merge them into local view.
      // In a real scenario we'd call addLead or an API endpoint.
      assigned = generated;
      setDemoInjected(true);
    }
    
    setLocalLeads(assigned);
  }, [leads, demoInjected]);

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
    followUp: localLeads.filter(l => l.status === 'Follow-up Required' || l.status === 'Follow-up').length,
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
  
  // Analytics
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);

  const openModal = (modal: string, lead: Lead | null = null) => {
    if (lead) {
      setSelectedLead(lead);
      setFormData({...lead});
    } else {
      setSelectedLead(null);
      setFormData({});
    }
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
      // Update local view immediately for the mock leads
      setLocalLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...formData } : l));
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
      
      updateLead(selectedLead.id, {
        nextFollowUp: formData.followUpDate,
        status: 'Follow-up Required'
      });
      
      setLocalLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, nextFollowUp: formData.followUpDate, status: 'Follow-up Required' } : l));
      
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
      const start = new Date(`${formData.demoDate}T${formData.demoTime}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later
      createGoogleCalendarEvent(`Demo: ${selectedLead.name} - ${formData.demoFaculty}`, `Meeting with ${selectedLead.name}`, start, end);
      
      setLocalLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'Demo Scheduled' } : l));
      
      showToast('Demo scheduled successfully');
      closeModal();
    }
  };

  const handleAddLeadSave = () => {
    const newLead = {
      ...formData,
      status: formData.status || 'New',
      priority: formData.priority || 'Medium',
      counselor: CURRENT_USER,
      assignedMember: CURRENT_USER,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${formData.name?.replace(' ', '+')}&background=random`
    };
    addLead(newLead);
    setLocalLeads(prev => [ { ...newLead, id: `L-${10000 + prev.length + 1}` } as any, ...prev ]);
    showToast('Lead created and assigned successfully!');
    closeModal();
  };
  
  // Custom filter logic overlay to sync with DataToolbar
  const dynamicFilteredLeads = kpiFilter ? filteredLeads.filter(l => kpiFilter === '' || l.status.includes(kpiFilter)) : filteredLeads;
  const finalPaginatedLeads = dynamicFilteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleKpiFilter = (status: string) => {
    if (kpiFilter === status) setKpiFilter(null);
    else setKpiFilter(status);
    setCurrentPage(1);
  };

  // --- Analytics Data ---
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];
  const sourceData = Object.entries(localLeads.reduce((acc: any, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const programData = Object.entries(localLeads.reduce((acc: any, curr) => {
    acc[curr.program] = (acc[curr.program] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const funnelData = [
    { name: 'New', value: metrics.new },
    { name: 'Contacted', value: metrics.contacted },
    { name: 'Follow-up', value: metrics.followUp },
    { name: 'Demo', value: metrics.demo },
    { name: 'Converted', value: metrics.converted },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '20px', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Assigned Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your leads, schedule follow-ups, and track conversions.</p>
        </div>
        <button className="primary-btn" onClick={() => openModal('add')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-panel" onClick={() => { setKpiFilter(null); setCurrentPage(1); }} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === null ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(37,99,235,0.1)', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}><Target size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.total}</div><div style={{ color: 'var(--text-secondary)' }}>Total Assigned</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('New')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'New' ? '1px solid #10b981' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><AlertCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.new}</div><div style={{ color: 'var(--text-secondary)' }}>New Leads</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('Contacted')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'Contacted' ? '1px solid #3b82f6' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}><PhoneCall size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.contacted}</div><div style={{ color: 'var(--text-secondary)' }}>Contacted Leads</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('Follow-up')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'Follow-up' ? '1px solid #f59e0b' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '16px', borderRadius: '50%', color: '#f59e0b' }}><RefreshCw size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.followUp}</div><div style={{ color: 'var(--text-secondary)' }}>Follow-up Required</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('Demo Scheduled')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'Demo Scheduled' ? '1px solid #8b5cf6' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: '16px', borderRadius: '50%', color: '#8b5cf6' }}><Calendar size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.demo}</div><div style={{ color: 'var(--text-secondary)' }}>Demo Scheduled</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('Converted')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'Converted' ? '1px solid #10b981' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><CheckCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.converted}</div><div style={{ color: 'var(--text-secondary)' }}>Converted</div></div>
        </div>
        <div className="glass-panel" onClick={() => toggleKpiFilter('Lost')} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: kpiFilter === 'Lost' ? '1px solid #ef4444' : '1px solid var(--glass-border)' }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '50%', color: '#ef4444' }}><XCircle size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.lost}</div><div style={{ color: 'var(--text-secondary)' }}>Lost Leads</div></div>
        </div>
        <div className="glass-panel" onClick={() => setShowAnalytics(true)} style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', background: 'var(--primary-color)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%', color: 'white' }}><BarChart2 size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{metrics.conversionRate}</div><div style={{ color: 'rgba(255,255,255,0.8)' }}>Conversion Analytics</div></div>
        </div>
      </div>

      <DataToolbar<Lead>
        data={localLeads}
        onFilteredDataChange={setFilteredLeads}
        searchKeys={['name', 'id', 'email', 'mobile', 'program']}
        searchPlaceholder="Search leads by name, ID, phone..."
        filterOptions={[
          { key: 'status', label: 'Status', type: 'select', options: ['New', 'Contacted', 'Follow-up Required', 'Demo Scheduled', 'Converted', 'Lost'] },
          { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
          { key: 'program', label: 'Program', type: 'select', options: ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'Digital Marketing'] },
          { key: 'source', label: 'Lead Source', type: 'select', options: ['Website', 'Instagram', 'Facebook', 'LinkedIn', 'Google Ads', 'Referral', 'Walk-in', 'WhatsApp', 'YouTube'] },
          { key: 'createdAt', label: 'Assigned Date', type: 'date' },
        ]}
        exportFilename="member_leads"
      />

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
              {finalPaginatedLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{lead.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={lead.avatar || `https://ui-avatars.com/api/?name=${lead.name.replace(' ', '+')}`} alt={lead.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
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
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: lead.priority === 'High' ? 'rgba(239,68,68,0.1)' : lead.priority === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: lead.priority === 'High' ? '#ef4444' : lead.priority === 'Medium' ? '#f59e0b' : '#10b981'
                    }}>
                      {lead.priority}
                    </span>
                  </td>
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
                        { label: 'Upload Docs', icon: <UploadCloud size={16} />, onClick: () => showToast('Upload functionality active') },
                        { label: 'WhatsApp', icon: <MessageCircle size={16} />, onClick: () => openWhatsApp(lead.mobile) },
                        { label: 'Email', icon: <Mail size={16} />, onClick: () => openEmail(lead.email) },
                        { label: 'Call Student', icon: <Phone size={16} />, onClick: () => window.location.href = `tel:${lead.mobile}` }
                        // Strict constraint: No Delete, No Reassign, No Change Ownership
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {finalPaginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing {(currentPage - 1) * itemsPerPage + (dynamicFilteredLeads.length > 0 ? 1 : 0)} to {Math.min(currentPage * itemsPerPage, dynamicFilteredLeads.length)} of {dynamicFilteredLeads.length} entries
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
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(dynamicFilteredLeads.length / itemsPerPage), prev + 1))}
              disabled={currentPage === Math.ceil(dynamicFilteredLeads.length / itemsPerPage) || dynamicFilteredLeads.length === 0}
              style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', cursor: currentPage === Math.ceil(dynamicFilteredLeads.length / itemsPerPage) || dynamicFilteredLeads.length === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === Math.ceil(dynamicFilteredLeads.length / itemsPerPage) || dynamicFilteredLeads.length === 0 ? 0.5 : 1 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- ADD LEAD MODAL --- */}
      <SlidePanel 
        isOpen={activeModal === 'add'} 
        onClose={closeModal} 
        title="Create New Lead" 
        subtitle="Add a new assigned lead" 
        icon={<Plus />} 
        width="800px" 
        footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="secondary-btn" onClick={() => { handleAddLeadSave(); openModal('add'); }}>Save & Add Another</button><button className="primary-btn" onClick={handleAddLeadSave}>Save Lead</button></>}
      >
        <PremiumCard title="Student Information" icon={<UserCheck size={18} />}>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Student Name *" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} icon={<UserCheck size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Mobile Number *" name="mobile" value={formData.mobile || ''} onChange={(e) => setFormData({...formData, mobile: e.target.value})} icon={<Phone size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Alternate Mobile" name="altMobile" value={formData.altMobile || ''} onChange={(e) => setFormData({...formData, altMobile: e.target.value})} icon={<Phone size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Email *" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<Mail size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Gender" name="gender" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} options={['Male', 'Female', 'Other']} icon={<UserCheck size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Date of Birth" name="dob" type="date" value={formData.dob || ''} onChange={(e) => setFormData({...formData, dob: e.target.value})} icon={<Calendar size={16} />} /></div>
        </PremiumCard>
        
        <PremiumCard title="Location & Academic Details" icon={<FileText size={18} />} style={{ marginTop: '24px' }}>
          <div style={{ gridColumn: '1 / -1' }}><PremiumInput label="Address" name="address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="City" name="city" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="State" name="state" value={formData.state || ''} onChange={(e) => setFormData({...formData, state: e.target.value})} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Country" name="country" value={formData.country || 'India'} onChange={(e) => setFormData({...formData, country: e.target.value})} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Qualification" name="qualification" value={formData.qualification || ''} onChange={(e) => setFormData({...formData, qualification: e.target.value})} icon={<FileText size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="College" name="college" value={formData.college || ''} onChange={(e) => setFormData({...formData, college: e.target.value})} icon={<FileText size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Graduation Year" name="graduationYear" value={formData.graduationYear || ''} onChange={(e) => setFormData({...formData, graduationYear: e.target.value})} icon={<Calendar size={16} />} /></div>
        </PremiumCard>

        <PremiumCard title="Lead Assignment" icon={<Target size={18} />} style={{ marginTop: '24px' }}>
          <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Program Interested" name="program" value={formData.program || ''} onChange={(e) => setFormData({...formData, program: e.target.value})} options={['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'Digital Marketing']} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Lead Source" name="source" value={formData.source || ''} onChange={(e) => setFormData({...formData, source: e.target.value})} options={['Website', 'Instagram', 'Facebook', 'LinkedIn', 'Google Ads', 'Referral', 'Walk-in', 'WhatsApp', 'YouTube']} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Priority" name="priority" value={formData.priority || 'Medium'} onChange={(e) => setFormData({...formData, priority: e.target.value})} options={['High', 'Medium', 'Low']} icon={<AlertCircle size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Assigned Member" name="assignedMember" value={CURRENT_USER} disabled icon={<UserCheck size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumInput label="Follow-up Date" name="nextFollowUp" type="datetime-local" value={formData.nextFollowUp || ''} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} icon={<Clock size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumTextArea label="Notes" name="notes" value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} icon={<FileText size={16} />} /></div>
        </PremiumCard>
      </SlidePanel>

      {/* --- EDIT LEAD MODAL --- */}
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
            <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Student Name" name="name" value={selectedLead.name} disabled icon={<UserCheck size={16} />} /></div>
            <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Lead Source" name="source" value={selectedLead.source} disabled icon={<Target size={16} />} /></div>
            <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Assigned Member" name="assignedMember" value={selectedLead.assignedMember} disabled icon={<UserCheck size={16} />} /></div>
            <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Lead ID" name="id" value={selectedLead.id} disabled icon={<FileText size={16} />} /></div>
            <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Status" name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} options={['New', 'Contacted', 'Follow-up Required', 'Demo Scheduled', 'Converted', 'Lost']} icon={<AlertCircle size={16} />} /></div>
            <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Priority" name="priority" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} options={['High', 'Medium', 'Low']} icon={<AlertCircle size={16} />} /></div>
            <div style={{ gridColumn: '1 / -1' }}><PremiumInput label="Next Follow-up" name="nextFollowUp" type="datetime-local" value={formData.nextFollowUp || ''} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} icon={<Clock size={16} />} /></div>
            <div style={{ gridColumn: '1 / -1' }}><PremiumTextArea label="Notes" name="notes" value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={4} icon={<FileText size={16} />} /></div>
          </PremiumCard>
        )}
      </SlidePanel>

      {/* --- FOLLOW UP MODAL --- */}
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
          <div style={{ gridColumn: '1 / -1' }}><PremiumInput label="Date & Time" name="followUpDate" type="datetime-local" value={formData.followUpDate || ''} onChange={(e) => setFormData({...formData, followUpDate: e.target.value})} icon={<Calendar size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumSelect label="Communication Method" name="followUpMethod" value={formData.followUpMethod || 'Phone Call'} onChange={(e) => setFormData({...formData, followUpMethod: e.target.value})} options={['Phone Call', 'WhatsApp', 'Email', 'Meeting']} icon={<MessageCircle size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumTextArea label="Follow-up Notes" name="followUpNotes" value={formData.followUpNotes || ''} onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})} rows={4} icon={<FileText size={16} />} /></div>
        </PremiumCard>
      </SlidePanel>

      {/* --- DEMO MODAL --- */}
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
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Date" name="demoDate" type="date" value={formData.demoDate || ''} onChange={(e) => setFormData({...formData, demoDate: e.target.value})} icon={<Calendar size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Time" name="demoTime" type="time" value={formData.demoTime || ''} onChange={(e) => setFormData({...formData, demoTime: e.target.value})} icon={<Clock size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumSelect label="Faculty/Host" name="demoFaculty" value={formData.demoFaculty || 'John Doe'} onChange={(e) => setFormData({...formData, demoFaculty: e.target.value})} options={['John Doe', 'Jane Smith', 'Mike Ross']} icon={<UserCheck size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumSelect label="Meeting Type" name="meetingType" value={formData.meetingType || 'Online'} onChange={(e) => setFormData({...formData, meetingType: e.target.value})} options={['Online', 'Offline']} icon={<Target size={16} />} /></div>
          <div style={{ gridColumn: '1 / 3' }}><PremiumInput label="Google Meet Link" name="meetLink" value={formData.meetLink || 'https://meet.google.com/xyz-abc-def'} onChange={(e) => setFormData({...formData, meetLink: e.target.value})} icon={<MessageCircle size={16} />} /></div>
          <div style={{ gridColumn: '1 / -1' }}><PremiumTextArea label="Notes" name="demoNotes" value={formData.demoNotes || ''} onChange={(e) => setFormData({...formData, demoNotes: e.target.value})} rows={3} icon={<FileText size={16} />} /></div>
        </PremiumCard>
      </SlidePanel>
      
      {/* --- VIEW MODAL --- */}
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
              <img src={selectedLead.avatar || `https://ui-avatars.com/api/?name=${selectedLead.name.replace(' ', '+')}`} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
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
                <span style={{ fontWeight: 600, color: selectedLead.priority === 'High' ? '#ef4444' : selectedLead.priority === 'Medium' ? '#f59e0b' : '#10b981' }}>{selectedLead.priority}</span>
              </div>
              <div style={{ gridColumn: '1 / -1', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block' }}>Notes</span>
                <span>{selectedLead.notes || 'No notes available.'}</span>
              </div>
            </PremiumCard>
          </div>
        )}
      </SlidePanel>

      {/* --- CONVERSION ANALYTICS MODAL --- */}
      <FullScreenModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} title="Lead Conversion Analytics" subtitle="Comprehensive view of your assigned pipeline">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Lead Funnel</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="var(--text-secondary)" />
                  <YAxis dataKey="name" type="category" width={100} stroke="var(--text-secondary)" />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="var(--primary-color)" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Source Breakdown</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                    {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Program-wise Leads</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </FullScreenModal>

    </div>
  );
}
"""

with open(page_path, "w") as f:
    f.write(code)

print("Member Leads module build v3 (Upgrades) completed successfully.")
