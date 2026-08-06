'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, Target, TrendingUp, Users, Search, Download, 
  Eye, Edit, Copy, PauseCircle, PlayCircle, BarChart2, Printer, 
  Trash2, Plus, Calendar, Filter, Activity, CreditCard, DollarSign,
  Briefcase, CheckCircle, PieChart as PieChartIcon, CheckSquare, List
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';

// --- MOCK DATA ---
const generateCampaignsData = () => {
  const data = [];
  const types = ['Google Ads', 'Facebook Ads', 'Instagram Campaign', 'LinkedIn Campaign', 'YouTube Campaign', 'Email Campaign', 'WhatsApp Campaign', 'Referral Campaign', 'Webinar', 'Offline Event'];
  const platforms = ['Google', 'Meta', 'Instagram', 'LinkedIn', 'YouTube', 'Email', 'WhatsApp', 'Organic', 'Zoom', 'In-Person'];
  const statuses = ['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'];
  const owners = ['Rahul Sharma', 'Sneha Reddy', 'Amit Patel', 'Neha Agarwal', 'Kiran Rao'];
  
  for (let i = 0; i < 30; i++) {
    const typeIdx = Math.floor(Math.random() * types.length);
    const budget = Math.floor(Math.random() * 50 + 10) * 10000;
    const leads = Math.floor(Math.random() * 500) + 50;
    const conversions = Math.floor(leads * (Math.random() * 0.3 + 0.05));
    const revenue = conversions * 50000; // Simulated revenue per conversion
    const roi = Math.round(((revenue - budget) / budget) * 100);
    
    const start = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + Math.floor(Math.random() * 60) + 10);

    data.push({
      id: `CMP-${2000 + i}`,
      name: `Q${Math.floor(Math.random()*4)+1} ${types[typeIdx]} Initiative`,
      type: types[typeIdx],
      platform: platforms[typeIdx],
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      budget,
      leads,
      conversions,
      roi,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      owner: owners[Math.floor(Math.random() * owners.length)],
      audience: 'Age 18-35, Metro Cities, Tech Enthusiasts',
      description: 'A strategic campaign to drive top-of-funnel leads and engage our target demographic effectively.'
    });
  }
  return data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};

const generateLeadsData = () => {
  const d = [];
  const names = ['Ankit Rao', 'Smriti Mandhana', 'Virat K', 'Rohit S', 'Jasprit B'];
  for(let i=0; i<15; i++) {
    d.push({
      id: `L-${100+i}`, name: names[i%names.length], mobile: `+91 98${Math.floor(Math.random()*90000000+10000000)}`, email: `${names[i%names.length].split(' ')[0].toLowerCase()}@mail.com`, source: 'Google Ads', program: 'Data Science', status: 'New', counselor: 'Rahul Sharma'
    });
  }
  return d;
};

const INITIAL_DATA = generateCampaignsData();
const MOCK_LEADS = generateLeadsData();

const MONTHLY_LEADS_DATA = [
  { name: 'Week 1', leads: 400, target: 350 },
  { name: 'Week 2', leads: 520, target: 450 },
  { name: 'Week 3', leads: 680, target: 550 },
  { name: 'Week 4', leads: 850, target: 700 },
];
const FUNNEL_DATA = [
  { name: 'Impressions', value: 100000 },
  { name: 'Clicks', value: 25000 },
  { name: 'Leads', value: 5000 },
  { name: 'Conversions', value: 850 },
];
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

// --- GLOBAL TOAST ---
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors: Record<string, string> = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${colors[type]};color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
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

export default function CampaignsPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState(INITIAL_DATA);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modals
  const [viewModal, setViewModal] = useState<any>(null);
  const [editModal, setEditModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  
  // Advanced Features State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);

  // KPIs
  const totalCampaigns = data.length;
  const activeCampaigns = data.filter(d => d.status === 'Active').length;
  const scheduledCampaigns = data.filter(d => d.status === 'Scheduled').length;
  const completedCampaigns = data.filter(d => d.status === 'Completed').length;
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0);
  const avgConvRate = totalLeads ? Math.round((totalConversions / totalLeads) * 100) : 0;
  const totalBudget = data.reduce((sum, d) => sum + d.budget, 0);
  const avgROI = Math.round(data.reduce((sum, d) => sum + d.roi, 0) / data.length);

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'] },
    { key: 'type', label: 'Type', type: 'select', options: ['Google Ads', 'Facebook Ads', 'Instagram Campaign', 'LinkedIn Campaign', 'YouTube Campaign', 'Email Campaign', 'WhatsApp Campaign', 'Referral Campaign', 'Webinar', 'Offline Event'] },
    { key: 'platform', label: 'Platform', type: 'select', options: ['Google', 'Meta', 'Instagram', 'LinkedIn', 'YouTube', 'Email', 'WhatsApp', 'Organic', 'Zoom', 'In-Person'] },
  ];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDuplicate = (cmp: any) => {
    const copy = { ...cmp, id: `CMP-${Date.now().toString().slice(-4)}`, name: `${cmp.name} (Copy)`, status: 'Draft' };
    setData([copy, ...data]);
    setFilteredData([copy, ...data]);
    showToast('Campaign duplicated successfully.');
  };

  const getActionMenu = (cmp: any) => (
    <ActionMenu items={[
      { label: 'View Campaign', icon: <Eye size={16}/>, onClick: () => setViewModal(cmp) },
      { label: 'Edit Campaign', icon: <Edit size={16}/>, onClick: () => setEditModal(cmp) },
      { label: 'Duplicate', icon: <Copy size={16}/>, onClick: () => handleDuplicate(cmp) },
      { divider: true, label: '' },
      { label: cmp.status === 'Paused' ? 'Resume' : 'Pause', icon: cmp.status === 'Paused' ? <PlayCircle size={16}/> : <PauseCircle size={16}/>, onClick: () => {
        const updated = { ...cmp, status: cmp.status === 'Paused' ? 'Active' : 'Paused' };
        setData(prev => prev.map(d => d.id === cmp.id ? updated : d));
        setFilteredData(prev => prev.map(d => d.id === cmp.id ? updated : d));
        showToast(`Campaign ${updated.status.toLowerCase()}.`);
      }},
      { label: 'View Analytics', icon: <BarChart2 size={16}/>, onClick: () => setActiveKpiModal('Average ROI') },
      { divider: true, label: '' },
      { label: 'Export PDF', icon: <Download size={16}/>, onClick: () => simulateDownload(`Campaign_${cmp.id}.pdf`) },
      { label: 'Export Excel', icon: <Download size={16}/>, onClick: () => simulateDownload(`Campaign_${cmp.id}.xlsx`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => window.print() },
      { divider: true, label: '' },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(cmp.id) }
    ]} />
  );

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCamp = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      platform: fd.get('platform') as string,
      startDate: fd.get('startDate') as string,
      endDate: fd.get('endDate') as string,
      budget: Number(fd.get('budget')),
      leads: 0,
      conversions: 0,
      roi: 0,
      status: fd.get('status') as string,
      owner: fd.get('owner') as string,
      audience: fd.get('audience') as string,
      description: fd.get('description') as string
    };
    setData([newCamp, ...data]);
    setFilteredData([newCamp, ...data]);
    setIsCreateModalOpen(false);
    showToast('New campaign created successfully.');
  };

  const renderKpiModalContent = () => {
    if (activeKpiModal === 'Total Campaigns' || activeKpiModal === 'Active Campaigns' || activeKpiModal === 'Scheduled Campaigns' || activeKpiModal === 'Completed Campaigns') {
      const filterStatus = activeKpiModal.split(' ')[0]; // 'Total', 'Active', 'Scheduled', 'Completed'
      let listData = data;
      if (filterStatus !== 'Total') listData = data.filter(d => d.status === filterStatus);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {listData.map(cmp => (
            <div key={cmp.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{cmp.name} <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-primary)', marginLeft: '8px' }}>{cmp.id}</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{cmp.type} • {cmp.owner}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setViewModal(cmp)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 600 }}>View</button>
                <button onClick={() => setEditModal(cmp)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                {cmp.status === 'Active' && <button onClick={() => showToast('Campaign stopped.')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Stop</button>}
                {cmp.status === 'Scheduled' && <button onClick={() => showToast('Campaign published.')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#10b981', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Publish Now</button>}
                {cmp.status === 'Completed' && <button onClick={() => simulateDownload('Report.pdf')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Report</button>}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (activeKpiModal === 'Total Leads Generated') {
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <th style={{ padding: '12px' }}>Lead Name</th><th style={{ padding: '12px' }}>Contact</th><th style={{ padding: '12px' }}>Source / Program</th><th style={{ padding: '12px' }}>Status</th>
          </tr></thead>
          <tbody>
            {MOCK_LEADS.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{l.name}</td>
                <td style={{ padding: '12px' }}><div style={{ fontSize: '0.85rem' }}>{l.mobile}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{l.email}</div></td>
                <td style={{ padding: '12px' }}><div style={{ fontSize: '0.85rem' }}>{l.source}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{l.program}</div></td>
                <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#d1fae5', color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeKpiModal === 'Conversion Rate') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Conversion Funnel</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={12} axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Monthly Conversion</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_LEADS_DATA}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="target" name="Conversions" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    if (activeKpiModal === 'Campaign Budget') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
             <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Budget</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(totalBudget)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Budget Used</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{formatCurrency(totalBudget * 0.75)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Remaining</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(totalBudget * 0.25)}</div>
              </div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Monthly Budget vs Spend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_LEADS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="target" name="Budget Allocated" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="leads" name="Budget Spent" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (activeKpiModal === 'Average ROI') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 100%)' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Portfolio ROI</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>{avgROI}%</div>
              <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Generated {formatCurrency(totalConversions * 50000)} against {formatCurrency(totalBudget)} investment.</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>ROI Trend Analysis</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_LEADS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="leads" name="ROI %" stroke="#10b981" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Campaigns</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track all marketing campaigns and ROI.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {/* KPI DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Campaigns', val: totalCampaigns, icon: <Megaphone size={20}/>, color: '#3b82f6' },
          { label: 'Active Campaigns', val: activeCampaigns, icon: <Activity size={20}/>, color: '#10b981' },
          { label: 'Scheduled Campaigns', val: scheduledCampaigns, icon: <Calendar size={20}/>, color: '#8b5cf6' },
          { label: 'Completed Campaigns', val: completedCampaigns, icon: <CheckCircle size={20}/>, color: '#6366f1' },
          { label: 'Total Leads Generated', val: totalLeads, icon: <Users size={20}/>, color: '#f59e0b' },
          { label: 'Conversion Rate', val: `${avgConvRate}%`, icon: <TrendingUp size={20}/>, color: '#0ea5e9' },
          { label: 'Campaign Budget', val: formatCurrency(totalBudget), icon: <CreditCard size={20}/>, color: '#ec4899' },
          { label: 'Average ROI', val: `${avgROI}%`, icon: <DollarSign size={20}/>, color: '#10b981' },
        ].map((k, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setActiveKpiModal(k.label)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer', transition: 'background 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{k.label}</div>
              <div style={{ color: k.color, background: `${k.color}15`, padding: '6px', borderRadius: '8px' }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{k.val}</div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem' }}>Monthly Leads vs Targets</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_LEADS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="leads" name="Leads Generated" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="step" dataKey="target" name="Target Leads" stroke="#3b82f6" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#10b981" /> Top Campaigns by ROI
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {data.slice().sort((a,b) => b.roi - a.roi).slice(0, 5).map((cmp, i) => (
              <div key={cmp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i < 3 ? '#10b981' : 'var(--border-color)', color: i < 3 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cmp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{cmp.platform}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#10b981' }}>{cmp.roi}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={d => { setFilteredData(d); setPage(1); }} 
          searchKeys={['name', 'id', 'type', 'platform', 'owner']}
          searchPlaceholder="Search campaigns..."
          exportFilename="Campaigns_Report"
          filterOptions={filterOptions}
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Campaign</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Platform</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Duration</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Budget & ROI</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Leads & Conv</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(cmp => (
                <tr key={cmp.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-bg">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 'bold' }}>{cmp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{cmp.id} • {cmp.type}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{cmp.platform}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(cmp.startDate).toLocaleDateString('en-GB')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>to {new Date(cmp.endDate).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatCurrency(cmp.budget)}</div>
                    <div style={{ fontSize: '0.8rem', color: cmp.roi >= 100 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{cmp.roi}% ROI</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}><strong>{cmp.leads}</strong> Leads</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{cmp.conversions} Conversions</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, 
                      background: cmp.status === 'Active' ? '#d1fae5' : cmp.status === 'Paused' ? '#fef3c7' : cmp.status === 'Scheduled' ? '#e0f2fe' : cmp.status === 'Completed' ? '#f3f4f6' : '#e0e7ff', 
                      color: cmp.status === 'Active' ? '#059669' : cmp.status === 'Paused' ? '#d97706' : cmp.status === 'Scheduled' ? '#0284c7' : cmp.status === 'Completed' ? '#4b5563' : '#4f46e5' }}>
                      {cmp.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {getActionMenu(cmp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* KPI MODAL */}
      <SlidePanel isOpen={!!activeKpiModal} onClose={() => setActiveKpiModal(null)} title={activeKpiModal || ''} subtitle="Detailed Analytics" icon={<BarChart2 />} width="700px">
        {renderKpiModalContent()}
      </SlidePanel>

      {/* CREATE NEW CAMPAIGN MODAL */}
      <SlidePanel isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Campaign" subtitle="Set up a new marketing initiative" icon={<Megaphone />} width="600px">
        <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Name</label>
              <input name="name" required placeholder="e.g. Q4 Google Search Campaign" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Type</label>
                <select name="type" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Campaign', 'WhatsApp Campaign', 'Email Campaign', 'YouTube Campaign', 'Webinar', 'Offline Event', 'Referral Program'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Platform</label>
                <select name="platform" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['Google', 'Meta', 'Instagram', 'LinkedIn', 'YouTube', 'Email', 'WhatsApp', 'Organic', 'Zoom', 'In-Person'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Owner</label>
                <input name="owner" required defaultValue="Rahul Sharma" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Objective</label>
                <select name="objective" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Sales">Sales</option>
                  <option value="Webinar Signups">Webinar Signups</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Budget (₹)</label>
                <input type="number" name="budget" required min={0} defaultValue={50000} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Expected Leads</label>
                <input type="number" name="expectedLeads" required min={0} defaultValue={100} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Target Audience</label>
              <input name="audience" required defaultValue="Age 18-35, Metro Cities" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Start Date</label>
                <input type="date" name="startDate" required defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>End Date</label>
                <input type="date" name="endDate" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                <select name="status" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['Draft', 'Scheduled', 'Active', 'Completed', 'Paused'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
                <select name="priority" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['High', 'Medium', 'Low'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
              <textarea name="description" rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)', resize: 'none' }}></textarea>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Banner/Image</label>
              <div style={{ padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', marginTop: '4px', color: 'var(--text-secondary)' }}>
                Drag and drop files here, or click to browse
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="reset" style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Reset</button>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
            <div style={{ flex: 1 }}></div>
            <button type="button" onClick={() => showToast('Campaign saved as draft.', 'info')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', fontWeight: 600 }}>Save Campaign</button>
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save & Publish</button>
          </div>
        </form>
      </SlidePanel>

      {/* VIEW CAMPAIGN MODAL */}
      <SlidePanel isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Campaign Dashboard" subtitle={viewModal?.name} icon={<Megaphone />} width="700px">
        {viewModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{viewModal.name}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}>{viewModal.id}</span>
                  <span style={{ padding: '4px 10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}>{viewModal.platform}</span>
                  <span style={{ padding: '4px 10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}>{viewModal.type}</span>
                </div>
              </div>
              <span style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, 
                background: viewModal.status === 'Active' ? '#d1fae5' : viewModal.status === 'Paused' ? '#fef3c7' : viewModal.status === 'Scheduled' ? '#e0f2fe' : viewModal.status === 'Completed' ? '#f3f4f6' : '#e0e7ff', 
                color: viewModal.status === 'Active' ? '#059669' : viewModal.status === 'Paused' ? '#d97706' : viewModal.status === 'Scheduled' ? '#0284c7' : viewModal.status === 'Completed' ? '#4b5563' : '#4f46e5' }}>
                {viewModal.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Duration</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="var(--primary-color)" /> {new Date(viewModal.startDate).toLocaleDateString()} – {new Date(viewModal.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Audience Targeting</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="var(--primary-color)" /> {viewModal.audience}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Budget</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(viewModal.budget)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Leads Generated</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewModal.leads}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Conversions</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewModal.conversions}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{Math.round((viewModal.conversions/viewModal.leads)*100)}% Rate</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Return on Investment (ROI)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{viewModal.roi}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Revenue</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(viewModal.conversions * 50000)}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => simulateDownload(`Campaign_Analytics_${viewModal.id}.pdf`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18}/> Export Report</button>
              <button onClick={() => setViewModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Close Dashboard</button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* EDIT CAMPAIGN MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Campaign</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editModal.id}</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const updated = {
                ...editModal,
                name: fd.get('name'),
                platform: fd.get('platform'),
                budget: Number(fd.get('budget')),
                status: fd.get('status')
              };
              setData(prev => prev.map(d => d.id === editModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === editModal.id ? updated : d));
              setEditModal(null);
              showToast('Campaign updated successfully.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Name</label><input name="name" defaultValue={editModal.name} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Platform</label>
                  <select name="platform" defaultValue={editModal.platform} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {['Google', 'Meta', 'Instagram', 'LinkedIn', 'YouTube', 'Email', 'WhatsApp', 'Organic', 'Zoom', 'In-Person'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Budget (₹)</label><input type="number" name="budget" defaultValue={editModal.budget} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select name="status" defaultValue={editModal.status} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Campaign?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure? This action cannot be undone and will erase all historical ROI data.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setData(prev => prev.filter(d => d.id !== deleteModal));
                setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
                setDeleteModal(null);
                showToast('Campaign deleted successfully.', 'error');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: var(--bg-tertiary) !important; }
      `}} />
    </div>
  );
}
