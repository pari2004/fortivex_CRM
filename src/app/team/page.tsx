'use client';

import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, TrendingUp, Clock, Search, Filter, Download, 
  MoreVertical, Eye, User, Edit, UserPlus, FileText, Mail, MessageSquare, 
  PhoneCall, Calendar, Activity, RefreshCw, Trash2, CheckCircle, X,
  BarChart2, Shield, CreditCard, PlayCircle, Star, List, Award
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';

// --- MOCK DATA ---
const generateTeamData = () => {
  const data = [];
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];
  const designations = ['Senior Counselor', 'Counselor', 'Team Lead', 'Sales Executive', 'Admissions Officer'];
  const statuses = ['Active', 'Active', 'Active', 'Active', 'On Leave', 'Training', 'Offline'];
  
  for (let i = 0; i < 25; i++) {
    const leadsAssigned = Math.floor(Math.random() * 200) + 50;
    const leadsConverted = Math.floor(leadsAssigned * (Math.random() * 0.5 + 0.1));
    const target = Math.floor(Math.random() * 5 + 5) * 100000;
    const rev = Math.floor(target * (Math.random() * 1.2));
    
    data.push({
      id: `EMP-${2000 + i}`,
      name: names[i],
      designation: designations[Math.floor(Math.random() * designations.length)],
      mobile: `+91 98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      email: `${names[i].split(' ')[0].toLowerCase()}@fortivex.com`,
      leadsAssigned,
      leadsConverted,
      conversionRate: Math.round((leadsConverted / leadsAssigned) * 100),
      revenue: rev,
      target,
      achievement: Math.round((rev / target) * 100),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      rating: (Math.random() * 2 + 3).toFixed(1),
      avgResponse: Math.floor(Math.random() * 30 + 5) + ' mins',
      experience: Math.floor(Math.random() * 5 + 1) + ' Years'
    });
  }
  return data.sort((a, b) => b.revenue - a.revenue);
};

const TEAM_DATA = generateTeamData();

const MONTHLY_SALES_DATA = [
  { name: 'Week 1', revenue: 1200000, target: 1000000 },
  { name: 'Week 2', revenue: 1500000, target: 1000000 },
  { name: 'Week 3', revenue: 1800000, target: 1000000 },
  { name: 'Week 4', revenue: 2100000, target: 1000000 },
];

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
  const blob = new Blob([`Fortivex.AI CRM\n${filename}\nGenerated: ${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

export default function TeamPerformancePage() {
  const crm = useCRM();
  const [data, setData] = useState(TEAM_DATA);
  const [filteredData, setFilteredData] = useState(TEAM_DATA);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modals
  const [viewPerfModal, setViewPerfModal] = useState<any>(null);
  const [editEmployeeModal, setEditEmployeeModal] = useState<any>(null);
  const [meetingModal, setMeetingModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [kpiModal, setKpiModal] = useState<{title: string, data: any[]} | null>(null);
  const [resetTargetModal, setResetTargetModal] = useState<any>(null);

  const totalMembers = data.length;
  const activeMembers = data.filter(d => d.status === 'Active').length;
  const totalLeads = data.reduce((sum, d) => sum + d.leadsAssigned, 0);
  const totalConverted = data.reduce((sum, d) => sum + d.leadsConverted, 0);
  const avgConvRate = Math.round((totalConverted / totalLeads) * 100);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalTarget = data.reduce((sum, d) => sum + d.target, 0);
  const totalAchievement = Math.round((totalRevenue / totalTarget) * 100);

  const filterOptions: FilterOption[] = [
    { key: 'designation', label: 'Designation', type: 'select', options: ['Senior Counselor', 'Counselor', 'Team Lead', 'Sales Executive', 'Admissions Officer'] },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'On Leave', 'Training', 'Offline'] },
  ];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleKPISelect = (title: string) => {
    let modalData = data;
    if (title === 'Active Members') modalData = data.filter(d => d.status === 'Active');
    else if (title === 'Target Achieved') modalData = data.filter(d => d.achievement >= 100);
    setKpiModal({ title, data: modalData });
  };

  const getActionMenu = (emp: any) => (
    <ActionMenu items={[
      { label: 'View Performance', icon: <BarChart2 size={16}/>, onClick: () => setViewPerfModal(emp) },
      { label: 'View Profile', icon: <User size={16}/>, onClick: () => setViewPerfModal(emp) },
      { label: 'Edit Employee', icon: <Edit size={16}/>, onClick: () => setEditEmployeeModal(emp) },
      { divider: true, label: '' },
      { label: 'Assign Leads', icon: <UserPlus size={16}/>, onClick: () => showToast(`Leads assignment modal for ${emp.name}`) },
      { label: 'View Assigned Leads', icon: <Users size={16}/>, onClick: () => showToast(`Opening assigned leads for ${emp.name}`) },
      { label: 'View Revenue', icon: <TrendingUp size={16}/>, onClick: () => setViewPerfModal(emp) },
      { divider: true, label: '' },
      { label: 'Monthly Report', icon: <FileText size={16}/>, onClick: () => simulateDownload(`Monthly_Report_${emp.id}.pdf`) },
      { label: 'Download Performance', icon: <Download size={16}/>, onClick: () => simulateDownload(`Perf_Report_${emp.id}.pdf`) },
      { divider: true, label: '' },
      { label: 'Send Email', icon: <Mail size={16}/>, onClick: () => window.open(`mailto:${emp.email}`) },
      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageSquare size={16} color="#25D366"/>, onClick: () => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); } },
      { label: 'Call Employee', icon: <PhoneCall size={16}/>, onClick: () => window.open(`tel:${emp.mobile}`) },
      { label: 'Schedule Meeting', icon: <Calendar size={16}/>, onClick: () => setMeetingModal(emp) },
      { divider: true, label: '' },
      { label: 'View Attendance', icon: <Clock size={16}/>, onClick: () => showToast(`Opening attendance for ${emp.name}`) },
      { label: 'View Activity Timeline', icon: <Activity size={16}/>, onClick: () => showToast(`Opening activity timeline for ${emp.name}`) },
      { label: 'Reset Target', icon: <RefreshCw size={16}/>, onClick: () => setResetTargetModal(emp) },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(emp.id) }
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Team Performance</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor sales executives, conversions, and targets.</p>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Team Members', val: totalMembers, icon: <Users size={20}/>, color: '#3b82f6' },
          { label: 'Active Members', val: activeMembers, icon: <CheckCircle size={20}/>, color: '#10b981' },
          { label: 'Leads Assigned', val: totalLeads, icon: <Target size={20}/>, color: '#8b5cf6' },
          { label: 'Leads Converted', val: totalConverted, icon: <TrendingUp size={20}/>, color: '#f59e0b' },
          { label: 'Conversion Rate', val: `${avgConvRate}%`, icon: <Activity size={20}/>, color: '#0ea5e9' },
          { label: 'Revenue Generated', val: formatCurrency(totalRevenue), icon: <CreditCard size={20}/>, color: '#10b981' },
          { label: 'Monthly Target', val: formatCurrency(totalTarget), icon: <Target size={20}/>, color: '#6366f1' },
          { label: 'Target Achieved', val: `${totalAchievement}%`, icon: <Award size={20}/>, color: '#ec4899' },
          { label: 'Avg Response Time', val: '12 mins', icon: <Clock size={20}/>, color: '#f59e0b' },
          { label: 'Customer Satisfaction', val: '4.8/5', icon: <Star size={20}/>, color: '#eab308' },
        ].map((k, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} onClick={() => handleKPISelect(k.label)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{k.label}</div>
              <div style={{ color: k.color, background: `${k.color}15`, padding: '6px', borderRadius: '8px' }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{k.val}</div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS & LEADERBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem' }}>Monthly Sales vs Targets</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SALES_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/100000}L`} />
                <RechartsTooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="target" name="Target" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#f59e0b" /> Top Performers
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {data.slice(0, 5).map((emp, i) => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i < 3 ? '#f59e0b' : 'var(--border-color)', color: i < 3 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{i + 1}</div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{emp.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{emp.achievement}% Achieved</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#10b981' }}>{formatCurrency(emp.revenue)}</div>
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
          searchKeys={['name', 'id', 'email', 'mobile', 'designation']}
          searchPlaceholder="Search executives..."
          exportFilename="Team_Performance_Report"
          filterOptions={filterOptions}
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Employee</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Contact</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Leads & Conv %</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Revenue & Target</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Achievement</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-bg">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{emp.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{emp.id} • {emp.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{emp.mobile}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>Assigned: <strong>{emp.leadsAssigned}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Converted: <strong>{emp.leadsConverted}</strong> ({emp.conversionRate}%)</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981' }}>{formatCurrency(emp.revenue)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Target: {formatCurrency(emp.target)}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{emp.achievement}%</div>
                    <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden', width: '100px' }}>
                      <div style={{ height: '100%', width: `${Math.min(emp.achievement, 100)}%`, background: emp.achievement >= 100 ? '#10b981' : emp.achievement >= 75 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: emp.status === 'Active' ? '#d1fae5' : emp.status === 'On Leave' ? '#fef3c7' : '#e0f2fe', color: emp.status === 'Active' ? '#059669' : emp.status === 'On Leave' ? '#d97706' : '#0284c7' }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {getActionMenu(emp)}
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

      {/* VIEW PERFORMANCE MODAL */}
      <SlidePanel isOpen={!!viewPerfModal} onClose={() => setViewPerfModal(null)} title="Performance Dashboard" subtitle={viewPerfModal?.name} icon={<BarChart2 />} width="700px">
        {viewPerfModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2.5rem' }}>{viewPerfModal.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>{viewPerfModal.name}</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{viewPerfModal.designation} • {viewPerfModal.id}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {viewPerfModal.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PhoneCall size={14}/> {viewPerfModal.mobile}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {viewPerfModal.experience} Exp</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Leads Assigned</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewPerfModal.leadsAssigned}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Leads Converted</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewPerfModal.leadsConverted}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{viewPerfModal.conversionRate}% Rate</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #ec4899' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lost Leads</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewPerfModal.leadsAssigned - viewPerfModal.leadsConverted}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 100%)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Revenue Generated</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(viewPerfModal.revenue)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly Target</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatCurrency(viewPerfModal.target)}</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>Achievement</span>
                    <span style={{ fontWeight: 'bold', color: viewPerfModal.achievement >= 100 ? '#10b981' : '#f59e0b' }}>{viewPerfModal.achievement}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(viewPerfModal.achievement, 100)}%`, background: viewPerfModal.achievement >= 100 ? '#10b981' : '#f59e0b' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Activity Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
                  {[
                    { title: 'Converted High Value Lead', time: '2 hours ago', icon: <TrendingUp size={12}/>, color: '#10b981' },
                    { title: 'Scheduled Demo with Client', time: '5 hours ago', icon: <Calendar size={12}/>, color: '#3b82f6' },
                    { title: 'Follow-up Call Completed', time: 'Yesterday', icon: <PhoneCall size={12}/>, color: '#8b5cf6' },
                  ].map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-primary)', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color }}>
                        {act.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{act.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 12px 0' }}>Metrics</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Attendance</span>
                    <span style={{ fontWeight: 'bold' }}>98% (Present)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avg Response Time</span>
                    <span style={{ fontWeight: 'bold' }}>{viewPerfModal.avgResponse}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Customer Rating</span>
                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#eab308" color="#eab308" /> {viewPerfModal.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => simulateDownload(`Perf_Report_${viewPerfModal.id}.pdf`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18}/> Download Report</button>
              <button onClick={() => setViewPerfModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Close Dashboard</button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* EDIT EMPLOYEE MODAL */}
      {editEmployeeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Employee</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editEmployeeModal.id}</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const updated = {
                ...editEmployeeModal,
                name: fd.get('name'),
                designation: fd.get('designation'),
                mobile: fd.get('mobile'),
                email: fd.get('email'),
                status: fd.get('status')
              };
              setData(prev => prev.map(d => d.id === editEmployeeModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === editEmployeeModal.id ? updated : d));
              setEditEmployeeModal(null);
              showToast('Employee updated successfully.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Name</label><input name="name" defaultValue={editEmployeeModal.name} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Designation</label><input name="designation" defaultValue={editEmployeeModal.designation} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mobile</label><input name="mobile" defaultValue={editEmployeeModal.mobile} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email</label><input name="email" defaultValue={editEmployeeModal.email} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select name="status" defaultValue={editEmployeeModal.status} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {['Active', 'On Leave', 'Training', 'Offline'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setEditEmployeeModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MEETING MODAL */}
      {meetingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Schedule Meeting</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>With {meetingModal.name}</p>
            <form onSubmit={e => {
              e.preventDefault();
              setMeetingModal(null);
              showToast('Meeting scheduled and added to calendar.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date</label><input type="date" required min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Time</label><input type="time" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Agenda</label><input type="text" placeholder="e.g. Monthly Performance Review" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Participants</label><input type="text" defaultValue={meetingModal.name} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Location / Link</label><input type="text" defaultValue="https://meet.google.com/new" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setMeetingModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save & Add to Calendar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET TARGET MODAL */}
      {resetTargetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <RefreshCw size={48} color="var(--primary-color)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Reset Target?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Reset target and revenue for {resetTargetModal.name} to 0?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setResetTargetModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                const updated = { ...resetTargetModal, revenue: 0, leadsConverted: 0, achievement: 0, conversionRate: 0 };
                setData(prev => prev.map(d => d.id === resetTargetModal.id ? updated : d));
                setFilteredData(prev => prev.map(d => d.id === resetTargetModal.id ? updated : d));
                setResetTargetModal(null);
                showToast('Target reset successfully.');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Confirm Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Record?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setData(prev => prev.filter(d => d.id !== deleteModal));
                setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
                setDeleteModal(null);
                showToast('Employee record deleted.', 'error');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* KPI MODAL (GENERIC LIST) */}
      <SlidePanel isOpen={!!kpiModal} onClose={() => setKpiModal(null)} title={kpiModal?.title || ''} subtitle={`${kpiModal?.data.length} Records Found`} icon={<List size={20}/>} width="500px">
        {kpiModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {kpiModal.data.map((emp: any) => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{emp.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{emp.designation}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(emp.revenue)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.achievement}% Achieved</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SlidePanel>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: var(--bg-tertiary) !important; }
      `}} />
    </div>
  );
}
