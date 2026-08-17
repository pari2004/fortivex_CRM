'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, Calendar, CheckSquare, Square, Trash2, Edit2, UserCheck, FileText, CheckCircle, Clock, XCircle, AlertCircle, PhoneCall, UploadCloud, RefreshCw, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionMenu } from '@/components/common/ActionMenu';
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
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

// --- Data Generation ---
const names = ['Rahul Sharma', 'Priya Nair', 'Arjun Kumar', 'Sneha Patel', 'Pavan Sadanand', 'Ananya Rao', 'Vikram Singh', 'Neha Verma', 'Amit Joshi', 'Kavya Reddy', 'Rohan Mehta', 'Divya Iyer', 'Karan Shah', 'Meera Kapoor', 'Aditya Rao', 'Shreya Menon', 'Nikhil Patil', 'Aisha Khan', 'Varun Gupta', 'Riya Deshmukh'];
const stages = ['New Lead', 'Contacted', 'Working', 'Qualified', 'Opportunity', 'Converted', 'Lost', 'Not Interested', 'Duplicate', 'Invalid'];
const priorities = ['High', 'Medium', 'Low'];
const types = ['New', 'Repeat', 'Referral'];
const sources = ['Google Ads', 'Facebook', 'Instagram', 'YouTube', 'Referral', 'Walk-in', 'Email Campaign', 'LinkedIn'];
const dealStages = ['No Deal', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const dispositions = ['Interested', 'Not Interested', 'Follow-up Required', 'Converted', 'Unreachable', 'Qualified'];
const callDirections = ['Incoming', 'Outgoing'];
const callOutcomes = ['Connected', 'No Answer', 'Busy', 'Follow-up Required'];
const callNatures = ['Sales', 'Follow-up', 'Support', 'Inquiry'];
const paymentStatuses = ['Paid', 'Partial', 'Pending', 'Not Applicable'];

const generateActiveLeads = () => {
  const today = new Date().toISOString().split('T')[0];
  const overdueDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      id: `LD-${1000 + i}`,
      name: names[i % names.length],
      owner: names[(i + 2) % names.length],
      mobile: `+91 ${9000000000 + Math.floor(Math.random() * 99999999)}`,
      email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
      leadStage: stages[Math.floor(Math.random() * stages.length)],
      status: 'Active',
      campaign: 'Q3 Push',
      createdDate: '2023-09-01',
      lastContacted: '2023-10-14',
      leadScore: Math.floor(Math.random() * 100),
      awaitingFirstAttempt: Math.random() > 0.5 ? 'Yes' : 'No',
      clearFilter: '-',
      castWorked: 'Yes',
      startedWorking: '2023-10-01',
      speedToFirstCall: `${Math.floor(Math.random() * 60)} mins`,
      nextFollowUp: Math.random() > 0.5 ? today : overdueDate,
      becomeOpportunity: 'No',
      tags: 'Hot, Webinar',
      productService: 'Full Stack Development',
      recentActions: 'Called, Emailed',
      unansweredCalls: Math.floor(Math.random() * 5).toString(),
      unansweredAfterMissedCall: '0',
      remark: 'Looking for EMI options',
      nextOpenTask: 'Follow up call',
      openTicket: 'None',
      castClosedTask: '0',
      dealStage: dealStages[Math.floor(Math.random() * dealStages.length)],
      dealUpdatedOn: '2023-10-10',
      time: '14:30',
      reEngaged: Math.random() > 0.7 ? 'Yes' : 'No',
      leadDisposition: dispositions[Math.floor(Math.random() * dispositions.length)],
      businessAddress: '123 Tech Park',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'HSR Layout',
      country: 'India',
      zipCode: '560102',
      primaryTeam: 'Sales Team A',
      designation: 'Software Engineer',
      leadType: types[Math.floor(Math.random() * types.length)],
      leadPriority: priorities[Math.floor(Math.random() * priorities.length)],
      leadSource: sources[Math.floor(Math.random() * sources.length)],
      sourceLevel2: 'Campaign X',
      sourceLevel3: 'Ad Set Y',
      sourceLevel4: 'Creative Z',
      lastEngagement: '2023-10-12',
      lastPaymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      lastPaymentAmount: `₹${(Math.floor(Math.random() * 10) + 1) * 5000}`,
      totalPayment: `₹25000`,
      lastCallTime: '2023-10-12 10:00 AM',
      lastCallDuration: '05:20',
      lastCallDirection: callDirections[Math.floor(Math.random() * callDirections.length)],
      lastCallOutcome: callOutcomes[Math.floor(Math.random() * callOutcomes.length)],
      lastCallNature: callNatures[Math.floor(Math.random() * callNatures.length)],
      lastCalledBy: names[(i + 1) % names.length],
      lastVisit: '2023-10-05',
      lastVisitOutcome: 'Positive',
      lastVisitNature: 'Counseling',
      lastVisitBy: names[(i + 2) % names.length],
      lastEmail: '2023-10-11',
      lastWhatsApp: '2023-10-13'
    });
  }
  return data;
};

const ALL_LEADS_COLUMNS = [
  {key: "id", label: "Lead ID"},
  {key: "owner", label: "Lead Owner"},
  {key: "mobile", label: "Mobile Number"},
  {key: "email", label: "Email"},
  {key: "leadStage", label: "Lead Stage"},
  {key: "status", label: "Status"},
  {key: "leadPriority", label: "Priority"},
  {key: "leadSource", label: "Lead Source"},
  {key: "campaign", label: "Campaign"},
  {key: "primaryTeam", label: "Assigned Team"},
  {key: "lastContacted", label: "Last Contacted"},
  {key: "nextFollowUp", label: "Next Follow-up"},
  {key: "createdDate", label: "Created Date"},
  {key: "leadScore", label: "Lead Score"}
];

const ACTIVE_LEADS_COLUMNS = [
  {key: "owner", label: "Lead Owner"},
  {key: "mobile", label: "Mobile Number"},
  {key: "email", label: "Email"},
  {key: "leadStage", label: "Lead Stage"},
  {key: "awaitingFirstAttempt", label: "Awaiting First Attempt"},
  {key: "clearFilter", label: "Clear Filter"},
  {key: "castWorked", label: "Cast Worked"},
  {key: "startedWorking", label: "Started Working"},
  {key: "speedToFirstCall", label: "Speed to First Call"},
  {key: "nextFollowUp", label: "Next Follow-up"},
  {key: "becomeOpportunity", label: "Become Opportunity"},
  {key: "tags", label: "Tags"},
  {key: "productService", label: "Products / Service"},
  {key: "recentActions", label: "Recent Actions"},
  {key: "unansweredCalls", label: "Unanswered Calls"},
  {key: "unansweredAfterMissedCall", label: "Unanswered After Missed Call From Last User"},
  {key: "remark", label: "Remark"},
  {key: "nextOpenTask", label: "Next Open Task"},
  {key: "openTicket", label: "Open Ticket"},
  {key: "castClosedTask", label: "Cast Closed Task"},
  {key: "dealStage", label: "Deal Stage"},
  {key: "dealUpdatedOn", label: "Deal Updated On"},
  {key: "time", label: "Time"},
  {key: "reEngaged", label: "Re-engaged"},
  {key: "leadDisposition", label: "Lead Disposition"},
  {key: "businessAddress", label: "Business Address"},
  {key: "state", label: "State"},
  {key: "city", label: "City"},
  {key: "area", label: "Area"},
  {key: "country", label: "Country"},
  {key: "zipCode", label: "ZIP Code"},
  {key: "primaryTeam", label: "Primary Team"},
  {key: "designation", label: "Designation"},
  {key: "leadType", label: "Lead Type"},
  {key: "leadPriority", label: "Lead Priority"},
  {key: "leadSource", label: "Lead Source"},
  {key: "sourceLevel2", label: "Source Level 2"},
  {key: "sourceLevel3", label: "Source Level 3"},
  {key: "sourceLevel4", label: "Source Level 4"},
  {key: "lastEngagement", label: "Last Engagement"},
  {key: "lastPaymentStatus", label: "Last Payment Status"},
  {key: "lastPaymentAmount", label: "Last Payment Amount"},
  {key: "totalPayment", label: "Total Payment"},
  {key: "lastCallTime", label: "Last Call Time"},
  {key: "lastCallDuration", label: "Last Call Duration"},
  {key: "lastCallDirection", label: "Last Call Direction"},
  {key: "lastCallOutcome", label: "Last Call Outcome"},
  {key: "lastCallNature", label: "Last Call Nature"},
  {key: "lastCalledBy", label: "Last Called By"},
  {key: "lastVisit", label: "Last Visit"},
  {key: "lastVisitOutcome", label: "Last Visit Outcome"},
  {key: "lastVisitNature", label: "Last Visit Nature"},
  {key: "lastVisitBy", label: "Last Visit By"},
  {key: "lastEmail", label: "Last Email"},
  {key: "lastWhatsApp", label: "Last WhatsApp"}
];


// Edit Lead Modal
function EditLeadModal({ lead, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ ...lead });



  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});
  
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Edit Lead</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label>Lead Name</label><input name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }} /></div>
          <div><label>Mobile Number</label><input name="mobile" value={formData.mobile} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }} /></div>
          <div><label>Email</label><input name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }} /></div>
          <div>
            <label>Lead Stage</label>
            <select name="leadStage" value={formData.leadStage} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {stages.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label>Lead Source</label><input name="leadSource" value={formData.leadSource} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }} /></div>
          <div><label>Remark</label><input name="remark" value={formData.remark} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }} /></div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(formData)} style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Lead Profile Modal (Drawer)
function LeadProfileDrawer({ lead, onClose }: any) {
  return createPortal(
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: 'var(--bg-primary)', borderLeft: '1px solid var(--glass-border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Lead Profile</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{lead.name}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>ID: {lead.id} | {lead.leadType}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
             <span style={{ padding: '4px 12px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>{lead.leadStage}</span>
             <span style={{ padding: '4px 12px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>{lead.leadPriority}</span>
             <span style={{ padding: '4px 12px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>{lead.status}</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Overview</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Lead Owner</span><br/><b>{lead.owner}</b></div>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Team</span><br/><b>{lead.primaryTeam}</b></div>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Lead Source</span><br/><b>{lead.leadSource}</b></div>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Campaign</span><br/><b>{lead.campaign}</b></div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Contact</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Mobile</span><br/><b>{lead.mobile}</b></div>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Email</span><br/><b>{lead.email}</b></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-tertiary)' }}>Address</span><br/><b>{lead.businessAddress}, {lead.city}, {lead.state}, {lead.country}, {lead.zipCode}</b></div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>Follow-up</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Next Follow-up</span><br/><b>{lead.nextFollowUp}</b></div>
            <div><span style={{ color: 'var(--text-tertiary)' }}>Assigned Employee</span><br/><b>{lead.owner}</b></div>
          </div>
        </div>

      </div>
    </motion.div>,
    document.body
  );
}

// Temporary Modals
function ActionModal({ title, children, onClose, onSave }: any) {
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>{title}</h3>
        {children}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onSave} style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save / Send</button>
        </div>
      </div>
    </div>,
    document.body
  );
}


// Main View

function ActionDropdown({ isUp, onClose, onAction, targetRect }: any) {
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

  const renderBtn = (label: string, icon: any, action: string) => (
    <button 
      onMouseDown={(e) => { e.stopPropagation(); onAction(action); onClose(); }}
      style={{ 
        padding: '10px 16px', 
        textAlign: 'left', 
        background: 'transparent', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        fontSize: '0.95rem', 
        color: '#334155',
        width: '100%',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>{icon}</span> 
      <span style={{ fontWeight: 500 }}>{label}</span>
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
        right: window.innerWidth - targetRect.right,
        top: isUp ? 'auto' : targetRect.bottom + 8,
        bottom: isUp ? window.innerHeight - targetRect.top + 8 : 'auto',
        width: '240px',
        zIndex: 99999,
          padding: '8px 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderBtn('View Details', <UserCheck size={18} />, 'view')}
        {renderBtn('Edit Lead', <Edit2 size={18} />, 'edit')}
        {renderBtn('View Timeline', <Clock size={18} />, 'timeline')}
        {renderBtn('Add Task', <CheckSquare size={18} />, 'task')}
        {renderBtn('Schedule Follow-up', <Calendar size={18} />, 'followup')}
        {renderBtn('Log Call', <PhoneCall size={18} />, 'call')}
        {renderBtn('Send Email', <Mail size={18} />, 'email')}
        {renderBtn('Send WhatsApp', <MessageCircle size={18} />, 'whatsapp')}
        <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
        {renderBtn('Change Stage', <RefreshCw size={18} />, 'stage')}
        {renderBtn('Assign Owner', <UserCheck size={18} />, 'owner')}
      </motion.div>,
    document.body
  );
}

export function LeadsDefaultView({ activeTab, newLeadEvent }: { activeTab: string, newLeadEvent?: any }) {
  const [data, setData] = useState(generateActiveLeads());
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('All Time');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const currentColumnsList = activeTab === 'Active Leads' ? ACTIVE_LEADS_COLUMNS : ALL_LEADS_COLUMNS;
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  
  // Set default visible columns when tab changes
  useEffect(() => {
    setVisibleColumns(currentColumnsList.slice(0, 15).map(c => c.key));
  }, [activeTab]);

  const handleToggleColumn = (colKey: string) => {
    setVisibleColumns(prev => prev.includes(colKey) ? prev.filter(c => c !== colKey) : [...prev, colKey]);
  };

  // Add new lead effect
  useEffect(() => {
    if (newLeadEvent) {
      const newEntry = {
        id: `LD-${Math.floor(Math.random() * 10000)}`,
        owner: 'Unassigned',
        leadStage: 'New Lead',
        status: 'Active',
        campaign: 'Direct',
        createdDate: new Date().toISOString().split('T')[0],
        nextFollowUp: new Date().toISOString().split('T')[0],
        ...newLeadEvent
      };
      setData(prev => [newEntry, ...prev]);
    }
  }, [newLeadEvent]);

  useEffect(() => {
    let result = data;
    
    // Apply Date Filter
    if (dateFilter !== 'All Time') {
      const today = new Date();
      result = result.filter(lead => {
        const leadDate = new Date(lead.createdDate);
        if (dateFilter === 'Today') {
          return leadDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'Yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          return leadDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'Last 7 Days') {
          const last7 = new Date(today);
          last7.setDate(today.getDate() - 7);
          return leadDate >= last7 && leadDate <= today;
        } else if (dateFilter === 'This Month') {
          return leadDate.getMonth() === today.getMonth() && leadDate.getFullYear() === today.getFullYear();
        } else if (dateFilter === 'Last Month') {
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return leadDate.getMonth() === lastMonth.getMonth() && leadDate.getFullYear() === lastMonth.getFullYear();
        }
        return true;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(lead => {
        return searchKeys.some(key => {
          const val = lead[key as keyof typeof lead];
          return val && String(val).toLowerCase().includes(q);
        });
      });
    }

    if (activeKpi === null) {
      setFilteredData(result);
    } else if (activeKpi === 'Overdue') {
      const todayStr = new Date().toISOString().split('T')[0];
      setFilteredData(result.filter(l => l.nextFollowUp < todayStr));
    } else if (activeKpi === 'Follow-up') {
      const todayStr = new Date().toISOString().split('T')[0];
      setFilteredData(result.filter(l => l.nextFollowUp === todayStr));
    } else {
      setFilteredData(result.filter(l => l.leadStage === activeKpi));
    }
  }, [activeKpi, data, dateFilter, searchQuery]);

  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const [editLead, setEditLead] = useState<any>(null);
  const [viewLead, setViewLead] = useState<any>(null);
  useGlobalEscape(!!viewLead, () => { setViewLead(null) });
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  const [menuIsUp, setMenuIsUp] = useState(false);
  const [menuTarget, setMenuTarget] = useState<HTMLElement | null>(null);
  const [menuLead, setMenuLead] = useState<any>(null);

  // Bulk Actions Handlers
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedRows.size} leads?`)) {
      setData(prev => prev.filter(l => !selectedRows.has(l.id)));
      setSelectedRows(new Set());
      showToast(`${selectedRows.size} leads deleted successfully.`, 'success');
    }
  };

  const handleBulkChangeStage = (newStage: string) => {
    setData(prev => prev.map(l => selectedRows.has(l.id) ? { ...l, leadStage: newStage } : l));
    setSelectedRows(new Set());
    setActiveModal(null);
    showToast(`Stage updated for ${selectedRows.size} leads.`, 'success');
  };

  const handleBulkAssignOwner = (newOwner: string) => {
    setData(prev => prev.map(l => selectedRows.has(l.id) ? { ...l, owner: newOwner } : l));
    setSelectedRows(new Set());
    setActiveModal(null);
    showToast(`Owner updated for ${selectedRows.size} leads.`, 'success');
  };

  // Items per page now in state
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const filterOptions = [
    { key: 'leadStage', label: 'Lead Stage', type: 'select' as const, options: stages },
    { key: 'leadPriority', label: 'Lead Priority', type: 'select' as const, options: priorities },
    { key: 'leadType', label: 'Lead Type', type: 'select' as const, options: types },
    { key: 'leadSource', label: 'Lead Source', type: 'select' as const, options: sources },
    { key: 'dealStage', label: 'Deal Stage', type: 'select' as const, options: dealStages },
    { key: 'leadDisposition', label: 'Lead Disposition', type: 'select' as const, options: dispositions },
    { key: 'lastPaymentStatus', label: 'Payment Status', type: 'select' as const, options: paymentStatuses },
    { key: 'lastCallOutcome', label: 'Call Outcome', type: 'select' as const, options: callOutcomes },
    { key: 'lastCallDirection', label: 'Call Direction', type: 'select' as const, options: callDirections },
  ];

  const searchKeys = ['name', 'owner', 'mobile', 'email', 'id', 'leadStage', 'leadSource', 'leadPriority', 'leadType', 'primaryTeam', 'city', 'state', 'country', 'dealStage', 'productService', 'tags'] as const;
  
  const handleAction = (action: string, lead: any) => {
    setActiveMenuId(null);
    setMenuLead(lead);
    if (action === 'view') setViewLead(lead);
    else if (action === 'edit') setEditLead(lead);
    else setActiveModal(action);
  };

  const handleSaveEdit = (updatedLead: any) => {
    const newData = data.map(l => l.id === updatedLead.id ? updatedLead : l);
    setData(newData);
    setEditLead(null);
    showToast('Lead updated successfully', 'success');
  };  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      
      {/* KPI Cards Row */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { label: 'Total Leads', value: data.length, key: null, color: '#3b82f6' },
          { label: 'New Leads', value: data.filter(l => l.leadStage === 'New Lead').length, key: 'New Lead', color: '#10b981' },
          { label: 'Working Leads', value: data.filter(l => l.leadStage === 'Working').length, key: 'Working', color: '#f59e0b' },
          { label: 'Qualified Leads', value: data.filter(l => l.leadStage === 'Qualified').length, key: 'Qualified', color: '#8b5cf6' },
          { label: 'Converted Leads', value: data.filter(l => l.leadStage === 'Converted').length, key: 'Converted', color: '#14b8a6' },
          { label: 'Lost Leads', value: data.filter(l => l.leadStage === 'Lost').length, key: 'Lost', color: '#ef4444' },
          { label: 'Follow-ups Due', value: data.filter(l => l.nextFollowUp === new Date().toISOString().split('T')[0]).length, key: 'Follow-up', color: '#f97316' },
          { label: 'Overdue Leads', value: data.filter(l => l.nextFollowUp < new Date().toISOString().split('T')[0]).length, key: 'Overdue', color: '#dc2626' }
        ].map((kpi, idx) => (
          <div 
            key={idx}
            onClick={() => { setActiveKpi(kpi.key); setPage(1); }}
            style={{ 
              minWidth: '160px', padding: '16px', borderRadius: '12px', background: 'var(--bg-card)', 
              border: `1px solid ${activeKpi === kpi.key ? kpi.color : 'var(--glass-border)'}`,
              boxShadow: activeKpi === kpi.key ? `0 0 0 1px ${kpi.color}` : 'var(--shadow-sm)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s'
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{kpi.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel w-full" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          {...{ 
            filteredData, 
            onFilteredDataChange: (f: any) => { setFilteredData(f); setPage(1); }, 
            onFilterChange: (activeFilters: any) => {} 
          } as any}
          selectedItems={data.filter(d => selectedRows.has(d.id))}
          onSearchChange={setSearchQuery}
          searchKeys={searchKeys as any}
          searchPlaceholder="Search across Leads..."
          filterOptions={filterOptions}
          exportFilename="All_Leads_Export"
          exportMapping={[{key: 'name', label: 'Lead Name'}, ...currentColumnsList] as any}
          allColumns={currentColumnsList}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          extraActions={
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
              </select>
              <button onClick={() => showToast('Data Refreshed', 'success')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          }
        />

        {selectedRows.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'var(--primary-light)', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{selectedRows.size} Selected</span>
            <button className="secondary-btn" onClick={() => setActiveModal('bulk_owner')}><UserCheck size={16}/> Assign Owner</button>
            <button className="secondary-btn" onClick={() => setActiveModal('bulk_stage')}><RefreshCw size={16}/> Change Stage</button>
            <button className="secondary-btn" onClick={() => setActiveModal('task')}><CheckSquare size={16}/> Add Task</button>
            <button className="secondary-btn" onClick={() => setActiveModal('email')}><Mail size={16}/> Send Email</button>
            <button className="secondary-btn" onClick={handleBulkDelete} style={{ color: 'var(--status-lost)', borderColor: 'var(--status-lost)' }}><Trash2 size={16}/> Delete</button>
            <div style={{ flex: 1 }} />
            <button className="secondary-btn" onClick={() => setSelectedRows(new Set())}>Clear Selection</button>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', paddingBottom: '120px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 20 }}>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px', verticalAlign: 'middle', width: '40px', position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 22 }}>
                  <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(currentData.map(d => d.id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }} checked={selectedRows.size > 0 && selectedRows.size === currentData.length} />
                </th>
                <th style={{ padding: '16px', verticalAlign: 'middle', height: '60px', position: 'sticky', left: '40px', background: 'var(--bg-card)', zIndex: 21, borderRight: '1px solid var(--glass-border)' }}>Lead Name</th>
                {currentColumnsList.filter(c => visibleColumns.includes(c.key)).map(col => (
                  <th key={col.key} style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle', fontWeight: 500 }}>{col.label}</th>
                ))}
                <th style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle', height: '60px', position: 'sticky', right: 0, background: 'var(--bg-card)', zIndex: 21, borderLeft: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px', verticalAlign: 'middle', width: '40px', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 16 }}>
                    <input type="checkbox" checked={selectedRows.has(row.id)} onChange={(e) => {
                      const newSet = new Set(selectedRows);
                      if (e.target.checked) newSet.add(row.id);
                      else newSet.delete(row.id);
                      setSelectedRows(newSet);
                    }} />
                  </td>
                  <td style={{ padding: '16px', verticalAlign: 'middle', height: '60px', position: 'sticky', left: '40px', background: 'var(--bg-primary)', zIndex: 15, borderRight: '1px solid var(--glass-border)' }}>
                    <div style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--primary-color)' }} onClick={() => setViewLead(row)}>
                      {row.name}
                    </div>
                  </td>
                  {currentColumnsList.filter(c => visibleColumns.includes(c.key)).map(col => (
                    <td key={col.key} style={{ padding: '16px', verticalAlign: 'middle', height: '60px' }}>{row[col.key as keyof typeof row]}</td>
                  ))}
                  
                  <td style={{ position: 'sticky', right: 0, background: 'var(--bg-primary)', zIndex: activeMenuId === row.id ? 50 : 15, borderLeft: '1px solid var(--glass-border)' }}>
                    <div style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <button className="icon-btn" onClick={(e) => { 
                        e.stopPropagation();
                        if (activeMenuId === row.id) {
                          setActiveMenuId(null);
                          setMenuIsUp(false);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const spaceAbove = rect.top;
                          setMenuIsUp(spaceBelow < 350 && spaceAbove > spaceBelow);
                          setActiveMenuId(row.id);
                          setMenuTarget(e.currentTarget);
                          setMenuLead(row);
                        }
                      }}>
                        <MoreVertical size={18} />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenuId === row.id && menuTarget && (
                          <ActionDropdown 
                            isUp={menuIsUp}
                            targetRect={menuTarget.getBoundingClientRect()}
                            onClose={() => { setActiveMenuId(null); setMenuTarget(null); setMenuLead(null); }} 
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
          {filteredData.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found.</div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              <span>Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} leads</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="secondary-btn" style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '6px', border: '1px solid var(--glass-border)',
                      background: page === i + 1 ? 'var(--primary-color)' : 'var(--bg-card)',
                      color: page === i + 1 ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer', fontWeight: 500
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="secondary-btn" style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewLead && <LeadProfileDrawer lead={viewLead} onClose={() => setViewLead(null)} />}
        {editLead && <EditLeadModal lead={editLead} onClose={() => setEditLead(null)} onSave={handleSaveEdit} />}
        {activeModal === 'timeline' && <ActionModal title="View Timeline" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Timeline updated'); }}><div style={{color: 'var(--text-secondary)'}}>Chronological timeline...</div></ActionModal>}
        
        {(activeModal === 'owner' || activeModal === 'bulk_owner') && (
          <ActionModal 
            title={activeModal === 'bulk_owner' ? `Assign Owner to ${selectedRows.size} Leads` : "Assign Owner"} 
            onClose={() => setActiveModal(null)} 
            onSave={() => { 
              const select = document.getElementById('owner-select') as HTMLSelectElement;
              if (activeModal === 'bulk_owner') handleBulkAssignOwner(select.value);
              else if (menuLead) {
                setData(prev => prev.map(l => l.id === menuLead.id ? { ...l, owner: select.value } : l));
                setActiveModal(null);
                showToast('Owner assigned successfully', 'success');
              }
            }}
          >
            <div><select id="owner-select" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>{names.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          </ActionModal>
        )}

        {(activeModal === 'stage' || activeModal === 'bulk_stage') && (
          <ActionModal 
            title={activeModal === 'bulk_stage' ? `Change Stage for ${selectedRows.size} Leads` : "Change Stage"} 
            onClose={() => setActiveModal(null)} 
            onSave={() => { 
              const select = document.getElementById('stage-select') as HTMLSelectElement;
              if (activeModal === 'bulk_stage') handleBulkChangeStage(select.value);
              else if (menuLead) {
                setData(prev => prev.map(l => l.id === menuLead.id ? { ...l, leadStage: select.value } : l));
                setActiveModal(null);
                showToast('Stage updated successfully', 'success');
              }
            }}
          >
            <div><select id="stage-select" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>{stages.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          </ActionModal>
        )}

        {activeModal === 'task' && <ActionModal title="Add Task" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Task added'); }}><input placeholder="Task Name" style={{width:'100%', padding:'8px', borderRadius:'8px', marginBottom:'8px', border: '1px solid var(--border-color)', outline: 'none'}} /></ActionModal>}
        {activeModal === 'followup' && <ActionModal title="Schedule Follow-up" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Follow-up Scheduled'); }}><input type="date" style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}} /></ActionModal>}
        {activeModal === 'call' && <ActionModal title="Log Call" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Call logged'); }}><select style={{width:'100%', padding:'8px', borderRadius:'8px', border: '1px solid var(--border-color)', outline: 'none'}}>{callOutcomes.map(o=><option key={o}>{o}</option>)}</select></ActionModal>}
        {activeModal === 'email' && <ActionModal title="Send Email" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('Email sent'); }}><textarea placeholder="Message..." style={{width:'100%', padding:'8px', borderRadius:'8px', minHeight:'100px', border: '1px solid var(--border-color)', outline: 'none'}} /></ActionModal>}
        {activeModal === 'whatsapp' && <ActionModal title="Send WhatsApp" onClose={() => setActiveModal(null)} onSave={() => { setActiveModal(null); showToast('WhatsApp sent'); }}><textarea placeholder="WhatsApp Message..." style={{width:'100%', padding:'8px', borderRadius:'8px', minHeight:'100px', border: '1px solid var(--border-color)', outline: 'none'}} /></ActionModal>}
      </AnimatePresence>
      
      {createPortal(
        <AnimatePresence>
          {(viewLead || editLead) && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setViewLead(null); setEditLead(null); }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 999 }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}


    </div>
  );
}
