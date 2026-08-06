'use client';

import React, { useState, useEffect } from 'react';
import { calendarEvents } from '@/lib/data/mockData';
import { useCRM, Lead } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Square, Trash2, Edit2, UserCheck, FileText, CheckCircle, Clock, XCircle, AlertCircle, PhoneCall, UploadCloud, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionMenu, ActionMenuItem } from '@/components/common/ActionMenu';
import { openWhatsApp, openEmail, createGoogleCalendarEvent } from '@/lib/integrations';

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

// --- Badges ---
function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch(status) {
      case 'New Lead': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Interested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Demo Scheduled': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Admitted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': case 'Lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getColors()}`} style={{ whiteSpace: 'nowrap' }}>{status}</span>;
}

type DemoStatus = 'Scheduled' | 'Completed' | 'No Show' | 'Cancelled' | 'Rescheduled' | 'Not Scheduled';

function DemoStatusBadge({ status }: { status: DemoStatus }) {
  const getColors = () => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rescheduled': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Not Scheduled': default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getColors()}`} style={{ whiteSpace: 'nowrap' }}>{status}</span>;
}

// --- Schedule Demo Modal ---
function ScheduleDemoModal({ lead, onClose, onSave }: { lead: Lead, onClose: () => void, onSave: (leadId: string, date: string, type: string) => void }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Google Meet');

  const handleSave = () => {
    if(!date || !time) { showToast('Please select date and time', 'error'); return; }
    onSave(lead.id, `${date}T${time}`, type);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Schedule Demo</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Name</label>
            <input type="text" value={lead.name} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Program</label>
            <input type="text" value={lead.program} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', marginTop: '4px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Meeting Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Offline</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Schedule</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Lead Profile ---
function LeadProfile({ lead, onClose }: { lead: Lead, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Timeline', 'Notes'];

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderLeft: '1px solid var(--glass-border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Lead Profile</h2>
        <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {lead.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{lead.name}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{lead.id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a href={`tel:${lead.phone}`} style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, textDecoration: 'none', color: 'inherit' }}><Phone size={16} /> Call</a>
          <a href={`mailto:${lead.email}`} style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, textDecoration: 'none', color: 'inherit' }}><Mail size={16} /> Email</a>
          <a href="https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0" onClick={(e) => { e.preventDefault(); if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); }} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, textDecoration: 'none' }}><MessageCircle size={16} /> Join Fortivex.AI CRM WhatsApp Community</a>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        {activeTab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-secondary)' }}>Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Program</span><br/><b>{lead.program}</b></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Status</span><br/><StatusBadge status={lead.status} /></div>
                <div><span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Demo Status</span><br/><DemoStatusBadge status={(lead as any).demoStatus} /></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Payment Status</span><br/><b>{(lead as any).paymentStatus}</b></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>City</span><br/><b>{lead.city}</b></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Experience</span><br/><b>{lead.experience}</b></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Company</span><br/><b>{lead.currentCompany}</b></div>
                <div><span style={{ color: 'var(--text-tertiary)' }}>Score</span><br/><b>{lead.leadScore}/100</b></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(lead as any).activityTimeline && (lead as any).activityTimeline.length > 0 ? (lead as any).activityTimeline.map((act: any) => (
              <div key={act.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={16} />
                </div>
                <div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{act.title}</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{act.description}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(act.date).toLocaleString()}</span>
                </div>
              </div>
            )) : <p>No activity recorded.</p>}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.9rem' }}>{lead.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Main Page ---
export default function LeadsPage() {
  const { leads: leadsData, scheduleDemo } = useCRM();
  const [localData, setLocalData] = useState<Lead[]>(leadsData);
  const [filteredData, setFilteredData] = useState<Lead[]>(leadsData);
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [demoModalLead, setDemoModalLead] = useState<Lead | null>(null);
  
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleFilteredDataChange = (filtered: Lead[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map(l => l.id)));
    }
  };

  const handleAction = (action: string, lead: Lead) => {
    setActiveMenuId(null);
    if (action === 'view') {
      setSelectedLead(lead);
    } else if (action === 'demo') {
      setDemoModalLead(lead);
    } else if (action === 'delete') {
      if(confirm(`Are you sure you want to delete ${lead.name}?`)) {
        const newData = localData.filter(l => l.id !== lead.id);
        setLocalData(newData);
        setFilteredData(filteredData.filter(l => l.id !== lead.id));
        showToast('Lead deleted successfully', 'success');
      }
    } else if (action === 'admit') {
      const newData = localData.map(l => l.id === lead.id ? { ...l, status: 'Admitted' as any } : l);
      setLocalData(newData);
      setFilteredData(filteredData.map(l => l.id === lead.id ? { ...l, status: 'Admitted' as any } : l));
      showToast('Lead marked as Admitted', 'success');
    } else if (action === 'lost') {
      const newData = localData.map(l => l.id === lead.id ? { ...l, status: 'Lost' as any } : l);
      setLocalData(newData);
      setFilteredData(filteredData.map(l => l.id === lead.id ? { ...l, status: 'Lost' as any } : l));
      showToast('Lead marked as Lost', 'success');
    } else if (action === 'edit') {
      showToast('Opened Edit Lead form', 'success');
    } else if (action === 'followup') {
      showToast('Opened Schedule Follow-up modal', 'success');
    } else if (action === 'call') {
      window.open(`tel:${lead.phone}`, '_self');
    } else if (action === 'upload') {
      showToast('Opened Upload Documents dialog', 'success');
    } else if (action === 'convert') {
      showToast('Lead converted to Application successfully', 'success');
    }
  };

  const handleSaveDemo = (leadId: string, dateStr: string, type: string) => {
    const newData = localData.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          demoStatus: 'Scheduled' as DemoStatus,
          activityTimeline: [
            { id: `ACT-NEW-${Date.now()}`, type: 'Demo' as any, title: `Demo Scheduled (${type})`, description: `Scheduled for ${new Date(dateStr).toLocaleString()}`, date: new Date().toISOString() },
            ...((l as any).activityTimeline || [])
          ]
        };
      }
      return l;
    });
    setLocalData(newData);
    setFilteredData(filteredData.map(l => l.id === leadId ? newData.find(x => x.id === leadId)! : l));
    
    const lead = newData.find(x => x.id === leadId);
    if (lead) {
      const startDate = new Date(dateStr);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
      createGoogleCalendarEvent(`${lead.name} - Demo Class (${type})`, `Demo scheduled for ${lead.name} regarding ${lead.program}.`, startDate, endDate, type);
    }
    
    setDemoModalLead(null);
    showToast('Demo scheduled successfully!', 'success');
  };

  const selectedItemsList = currentData.filter(l => selectedRows.has(l.id));

  const exportMapping = [
    { key: 'id' as keyof Lead, label: 'Lead ID' },
    { key: 'name' as keyof Lead, label: 'Student Name' },
    { key: 'phone' as keyof Lead, label: 'Phone' },
    { key: 'email' as keyof Lead, label: 'Email' },
    { key: 'program' as keyof Lead, label: 'Program' },
    { key: 'city' as keyof Lead, label: 'City' },
    { key: 'status' as keyof Lead, label: 'Status' },
    { key: 'source' as keyof Lead, label: 'Lead Source' },
    { key: 'counselor' as keyof Lead, label: 'Counselor' },
    { key: 'createdAt' as keyof Lead, label: 'Created Date' },
    { key: 'lastFollowUp' as keyof Lead, label: 'Last Follow-up' },
    { key: 'nextFollowUp' as keyof Lead, label: 'Next Follow-up' },
    { key: 'paymentStatus' as keyof Lead, label: 'Payment Status' },
    { key: 'demoStatus' as keyof Lead, label: 'Demo Status' },
  ];

  const filterOptions = [
    { key: 'createdAt', label: 'Date', type: 'date' as const },
    { key: 'program', label: 'Program', type: 'select' as const, options: ['Full Stack Development', 'Data Science', 'UI/UX Design'] },
    { key: 'batch', label: 'Batch', type: 'select' as const, options: ['Cohort 1', 'Cohort 2', 'Cohort 3'] },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['New Lead', 'Contacted', 'Interested', 'Demo Scheduled', 'Admitted', 'Lost', 'Active', 'Completed', 'Dropped'] },
    { key: 'source', label: 'Lead Source', type: 'select' as const, options: ['Website', 'WhatsApp', 'Instagram', 'LinkedIn', 'Referral', 'Organic', 'Paid Ads'] },
    { key: 'counselor', label: 'Counselor', type: 'select' as const, options: ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'] },
    { key: 'city', label: 'City', type: 'select' as const, options: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida'] },
    { key: 'demoStatus', label: 'Demo Status', type: 'select' as const, options: ['Not Scheduled', 'Scheduled', 'Completed', 'Rescheduled', 'Cancelled'] },
    { key: 'paymentStatus', label: 'Payment Status', type: 'select' as const, options: ['Pending', 'Partial', 'Completed'] },
    { key: 'priority', label: 'Priority', type: 'select' as const, options: ['High', 'Medium', 'Low'] },
    { key: 'experience', label: 'Experience', type: 'select' as const, options: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'] },
    { key: 'currentCompany', label: 'Company', type: 'select' as const, options: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Tech Mahindra', 'None'] }
  ]; // replaced

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Leads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your 100+ program enquiries efficiently.</p>
        </div>
        <button onClick={() => setDemoModalLead(localData[0])} className="primary-btn"><Calendar size={18} /> Schedule Demo</button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={localData} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['name', 'email', 'phone', 'counselor', 'id']}
          searchPlaceholder="Search leads by name, email, ID..."
          exportFilename="Empowers_Leads_Export"
          filterOptions={filterOptions}
          selectedItems={selectedItemsList}
          exportMapping={exportMapping}
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {selectedRows.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Lead</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Program</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Demo Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Counselor</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'background 0.2s', background: selectedRows.has(lead.id) ? 'var(--bg-secondary)' : 'transparent' }} onClick={() => setSelectedLead(lead)} onMouseEnter={(e) => { if(!selectedRows.has(lead.id)) e.currentTarget.style.background = 'var(--bg-secondary)'; }} onMouseLeave={(e) => { if(!selectedRows.has(lead.id)) e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(lead.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(lead.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(lead.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{lead.email} • {lead.phone}</div>
                  </td>
                  <td style={{ padding: '16px 12px', fontWeight: 500, fontSize: '0.9rem' }}>{lead.program}</td>
                  <td style={{ padding: '16px 12px' }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: '16px 12px' }}><DemoStatusBadge status={(lead as any).demoStatus} /></td>
                  <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>{lead.counselor}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)', position: 'relative' }}>
                    <ActionMenu 
                      isOpen={activeMenuId === lead.id}
                      onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === lead.id ? null : lead.id); }}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        { label: 'View Details', icon: <UserCheck size={16} />, onClick: () => handleAction('view', lead) },
                        { label: 'Edit Lead', icon: <Edit2 size={16} />, onClick: () => handleAction('edit', lead) },
                        { label: 'Schedule Demo', icon: <Calendar size={16} />, onClick: () => handleAction('demo', lead) },
                        { label: 'Schedule Follow-up', icon: <Clock size={16} />, onClick: () => handleAction('followup', lead) },
                        { label: 'Call Student', icon: <PhoneCall size={16} />, onClick: () => handleAction('call', lead) },
                        { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageCircle size={16} />, onClick: () => openWhatsApp(lead.phone || lead.mobile || '') },
                        { label: 'Send Email', icon: <Mail size={16} />, onClick: () => openEmail(lead.email || '') },
                        { label: 'Upload Documents', icon: <UploadCloud size={16} />, onClick: () => handleAction('upload', lead) },
                        { divider: true, label: '' },
                        { label: 'Convert to Application', icon: <RefreshCw size={16} />, onClick: () => handleAction('convert', lead) },
                        { label: 'Mark as Admitted', icon: <CheckCircle size={16} />, color: 'var(--status-admitted)', onClick: () => handleAction('admit', lead) },
                        { label: 'Mark as Lost', icon: <XCircle size={16} />, color: 'var(--status-rejected)', onClick: () => handleAction('lost', lead) },
                        { divider: true, label: '' },
                        { label: 'Delete Lead', icon: <Trash2 size={16} />, color: 'var(--status-rejected)', onClick: () => handleAction('delete', lead) }
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} leads</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', cursor: page === 1 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={18} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && <LeadProfile lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        {demoModalLead && <ScheduleDemoModal lead={demoModalLead} onClose={() => setDemoModalLead(null)} onSave={handleSaveDemo} />}
      </AnimatePresence>
      
      {/* Dim overlay */}
      <AnimatePresence>
        {(selectedLead || demoModalLead) && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setSelectedLead(null); setDemoModalLead(null); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)', zIndex: 999 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
