'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, IndianRupee, Users, TrendingUp, Search, Filter, Download, Plus, 
  MoreVertical, Edit, FileText, CheckCircle, Activity, Award, Clock,
  Calendar, Briefcase, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { DynamicBackground } from '@/components/layout/DynamicBackground';
import { PremiumInput, PremiumSelect, PremiumCard } from '@/components/common/PremiumForm';
import { SlidePanel } from '@/components/common/PremiumModal';
import { PremiumModal } from '@/components/common/PremiumModal';

// --- MOCK DATA ---
const MOCK_TARGETS = [
  { id: 'TGT-001', name: 'Rahul Sharma', program: 'Full Stack Development', targetRev: 1000000, achievedRev: 825000, targetAdm: 25, achievedAdm: 21, conv: 84, status: 'On Track', date: '2026-08-31' },
  { id: 'TGT-002', name: 'Sneha Reddy', program: 'Full Stack Development', targetRev: 800000, achievedRev: 610000, targetAdm: 20, achievedAdm: 15, conv: 75, status: 'In Progress', date: '2026-08-31' },
  { id: 'TGT-003', name: 'Arjun Kumar', program: 'Full Stack Development', targetRev: 1200000, achievedRev: 1120000, targetAdm: 30, achievedAdm: 29, conv: 97, status: 'Completed', date: '2026-08-31' },
  { id: 'TGT-004', name: 'Priya Sharma', program: 'Full Stack Development', targetRev: 700000, achievedRev: 530000, targetAdm: 18, achievedAdm: 13, conv: 72, status: 'In Progress', date: '2026-08-31' },
  { id: 'TGT-005', name: 'Kiran Patel', program: 'Full Stack Development', targetRev: 1300000, achievedRev: 390000, targetAdm: 27, achievedAdm: 6, conv: 22, status: 'Needs Attention', date: '2026-08-31' },
];

const CHART_DATA = [
  { name: 'Week 1', revenue: 600000, target: 1250000, admissions: 15 },
  { name: 'Week 2', revenue: 950000, target: 1250000, admissions: 22 },
  { name: 'Week 3', revenue: 1150000, target: 1250000, admissions: 28 },
  { name: 'Week 4', revenue: 775000, target: 1250000, admissions: 19 },
];

const COUNSELOR_PERF = [
  { name: 'Rahul', rev: 8.25, target: 10 },
  { name: 'Sneha', rev: 6.1, target: 8 },
  { name: 'Arjun', rev: 11.2, target: 12 },
  { name: 'Priya', rev: 5.3, target: 7 },
  { name: 'Kiran', rev: 3.9, target: 13 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

// --- UTILS ---
const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

// --- GLOBAL TOAST ---
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export default function TargetsPage() {
  const [targets, setTargets] = useState(MOCK_TARGETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [isNewTargetOpen, setIsNewTargetOpen] = useState(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [progressModal, setProgressModal] = useState<any>(null);
  const [progressValue, setProgressValue] = useState(0);

  // Filter Logic
  const filteredTargets = targets.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesProgram = filterProgram === 'All' || t.program === filterProgram;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'On Track': return '#3b82f6';
      case 'In Progress': return '#f59e0b';
      case 'Needs Attention': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  };

  const handleExport = (format: string) => {
    showToast(`Exporting targets as ${format}...`, 'info');
    setTimeout(() => {
      showToast(`Targets exported as ${format} successfully.`, 'success');
    }, 1500);
  };

  const openDetails = (target: any) => {
    setSelectedTarget(target);
    setIsDetailsOpen(true);
    setActiveMenuId(null);
  };

  const triggerMockNotification = () => {
    const msgs = ['Target Completed: Arjun Kumar', 'Revenue Target Achieved!', 'Monthly Target Updated', 'Target Assigned to Sneha'];
    showToast(msgs[Math.floor(Math.random() * msgs.length)]);
  };

  useEffect(() => {
    // Generate initial demo notification
    setTimeout(triggerMockNotification, 2000);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <DynamicBackground />
      
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Sales Targets</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage revenue targets, admissions goals, and counselor performance.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={triggerMockNotification} style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer' }}>
              Simulate Alert
            </button>
            <button onClick={() => setIsNewTargetOpen(true)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <Plus size={18}/> New Target
            </button>
          </div>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Monthly Sales Target', value: '₹50,00,000', sub: 'Completion: 69.5%', color: '#3b82f6', icon: IndianRupee },
            { label: 'Current Achievement', value: '₹34,75,000', sub: 'Remaining: ₹15,25,000', color: '#10b981', icon: Target },
            { label: 'Admissions Target', value: '120', sub: 'Closed: 84 | Rem: 36', color: '#8b5cf6', icon: Users },
            { label: 'Conversion Rate', value: '38%', sub: 'Target: 40%', color: '#f59e0b', icon: Activity },
          ].map(stat => (
            <div key={stat.label} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderLeft: `4px solid ${stat.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}22`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{stat.value}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: stat.color, fontWeight: 600 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: CHARTS & TOP PERFORMERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* CHARTS */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Revenue vs Target (Monthly)</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} tickFormatter={(val) => `₹${val/100000}L`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="target" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTar)" name="Weekly Target" />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" name="Revenue Achieved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP PERFORMERS */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#f59e0b"/> Top Performers
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Arjun Kumar', rev: '₹11,20,000', adm: 29, conv: '97%' },
                { name: 'Rahul Sharma', rev: '₹8,25,000', adm: 21, conv: '84%' },
                { name: 'Sneha Reddy', rev: '₹6,10,000', adm: 15, conv: '75%' }
              ].map((perf, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#cd7f32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {i+1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '1rem' }}>{perf.name}</h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Rev: <b style={{ color: 'var(--text-primary)' }}>{perf.rev}</b></span>
                      <span>Adm: <b style={{ color: 'var(--text-primary)' }}>{perf.adm}</b></span>
                      <span>Win: <b style={{ color: '#10b981' }}>{perf.conv}</b></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COUNSELOR PERF CHART */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Counselor Performance (Target vs Achieved)</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COUNSELOR_PERF} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} tickFormatter={(val) => `${val}L`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="target" name="Target (Lakhs)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="rev" name="Achieved (Lakhs)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>


        {/* TABLE SECTION */}
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* TOOLBAR */}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search Counselor or Target ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="On Track">On Track</option>
                <option value="In Progress">In Progress</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleExport('PDF')} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Download size={16}/> PDF</button>
              <button onClick={() => handleExport('Excel')} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Download size={16}/> Excel</button>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-secondary)' }}>
                <tr>
                  {['Target ID', 'Counselor', 'Program', 'Revenue Progress', 'Admissions', 'Conv %', 'Status', 'Due Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTargets.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No targets found matching your criteria.</td></tr>
                ) : filteredTargets.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover-bg">
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.id}</td>
                    <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.program}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {formatCurrency(t.achievedRev)} / {formatCurrency(t.targetRev)}
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: getStatusColor(t.status), width: `${Math.min(100, (t.achievedRev/t.targetRev)*100)}%` }} />
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.achievedAdm} / {t.targetAdm}</td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.conv}%</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: `${getStatusColor(t.status)}22`, color: getStatusColor(t.status) }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                    
                    {/* ACTIONS */}
                    <td style={{ padding: '16px', position: 'relative' }}>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === t.id ? null : t.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <MoreVertical size={18} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === t.id && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'absolute', right: '40px', top: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 50, minWidth: '180px', overflow: 'hidden' }}>
                            {[
                              { label: 'View Details', icon: FileText, color: 'var(--text-primary)', onClick: () => { openDetails(t); setActiveMenuId(null); } },
                              { label: 'Edit Target', icon: Edit, color: 'var(--text-primary)', onClick: () => { setEditFormData({...t}); setEditModal(t); setActiveMenuId(null); } },
                              { label: 'Update Progress', icon: Activity, color: 'var(--text-primary)', onClick: () => { setProgressValue(t.achievedAdm); setProgressModal(t); setActiveMenuId(null); } },
                              { label: 'Download Report', icon: Download, color: 'var(--text-primary)', onClick: () => { handleExport('PDF'); setActiveMenuId(null); } },
                              { label: 'Delete Target', icon: X, color: '#ef4444', onClick: () => { setDeleteModal(t.id); setActiveMenuId(null); } },
                            ].map((action, i) => (
                              <button key={i} onClick={action.onClick} style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', borderBottom: i !== 4 ? '1px solid var(--border-color)' : 'none', color: action.color, cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' }} className="hover-bg">
                                <action.icon size={16} /> {action.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Target Details Slide Panel */}
      <SlidePanel isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Target Details" subtitle={selectedTarget?.id} icon={<Target />} width="600px">
        {selectedTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {selectedTarget.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedTarget.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedTarget.program}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Revenue Target</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(selectedTarget.targetRev)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Revenue Achieved</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#10b981' }}>{formatCurrency(selectedTarget.achievedRev)}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admissions Target</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedTarget.targetAdm}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admissions Closed</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#3b82f6' }}>{selectedTarget.achievedAdm}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Progress Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Target Completion</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{((selectedTarget.achievedRev/selectedTarget.targetRev)*100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(selectedTarget.achievedRev/selectedTarget.targetRev)*100}%`, background: getStatusColor(selectedTarget.status) }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Conversion Rate</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedTarget.conv}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${selectedTarget.conv}%`, background: '#8b5cf6' }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Activity Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
                {[
                  { text: 'Target assigned by Sales Manager', date: '01 Aug 2026' },
                  { text: 'Achieved 25% of Revenue Target', date: '10 Aug 2026' },
                  { text: 'Converted high value enterprise lead', date: '15 Aug 2026' },
                ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.text}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => { setIsDetailsOpen(false); showToast('Target updated', 'success'); }} style={{ padding: '12px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Update Performance Notes</button>

          </div>
        )}
      </SlidePanel>

      {/* Add New Target Modal */}
      <PremiumModal isOpen={isNewTargetOpen} onClose={() => setIsNewTargetOpen(false)} title="Assign New Target" subtitle="Set goals for counselors" icon={<Target size={24}/>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
          <PremiumSelect label="Counselor" options={['Select Counselor', 'Rahul Sharma', 'Arjun Kumar', 'Sneha Reddy', 'Priya Sharma', 'Kiran Patel']} />
          <PremiumSelect label="Program" options={['Full Stack Development', 'Data Science', 'Cloud Computing']} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <PremiumInput label="Revenue Target (₹)" type="number" placeholder="500000" />
            <PremiumInput label="Admissions Target" type="number" placeholder="10" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <PremiumInput label="Start Date" type="date" />
            <PremiumInput label="End Date" type="date" />
          </div>
          <PremiumSelect label="Priority" options={['High', 'Medium', 'Low']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description / Notes</label>
            <textarea rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button onClick={() => setIsNewTargetOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => { setIsNewTargetOpen(false); showToast('New target assigned successfully'); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save Target</button>
          </div>
        </div>
      </PremiumModal>

      {/* EDIT TARGET MODAL */}
      {editModal && editFormData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Target</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editModal.id} — {editModal.name}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Counselor Name</label>
                <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Revenue Target (₹)</label>
                <input type="number" value={editFormData.targetRev} onChange={e => setEditFormData({...editFormData, targetRev: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Revenue Achieved (₹)</label>
                <input type="number" value={editFormData.achievedRev} onChange={e => setEditFormData({...editFormData, achievedRev: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admissions Target</label>
                <input type="number" value={editFormData.targetAdm} onChange={e => setEditFormData({...editFormData, targetAdm: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admissions Achieved</label>
                <input type="number" value={editFormData.achievedAdm} onChange={e => setEditFormData({...editFormData, achievedAdm: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                  {['On Track', 'In Progress', 'Completed', 'Needs Attention'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Target Date</label>
                <input type="date" value={editFormData.date} onChange={e => setEditFormData({...editFormData, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setTargets(prev => prev.map(t => t.id === editModal.id ? {...editFormData, conv: Math.round((editFormData.achievedAdm / editFormData.targetAdm) * 100)} : t));
                setEditModal(null);
                showToast('Target updated successfully.');
              }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE PROGRESS MODAL */}
      {progressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Update Progress</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{progressModal.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admissions Achieved <span style={{ color: 'var(--primary-color)' }}>({progressValue})</span></label>
                <input type="range" min={0} max={progressModal.targetAdm} value={progressValue} onChange={e => setProgressValue(Number(e.target.value))} style={{ width: '100%', marginTop: '8px', accentColor: 'var(--primary-color)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}><span>0</span><span>Target: {progressModal.targetAdm}</span></div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Revenue Achieved (₹)</label>
                <input type="number" defaultValue={progressModal.achievedRev} id="prog-rev" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setProgressModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                const revEl = document.getElementById('prog-rev') as HTMLInputElement;
                const newRev = Number(revEl?.value || progressModal.achievedRev);
                setTargets(prev => prev.map(t => t.id === progressModal.id ? {...t, achievedAdm: progressValue, achievedRev: newRev, conv: Math.round((progressValue / progressModal.targetAdm) * 100)} : t));
                setProgressModal(null);
                showToast('Progress updated successfully.');
              }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Update Progress</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <X size={32} color="#dc2626" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Target?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to permanently delete this target record? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setTargets(prev => prev.filter(t => t.id !== deleteModal));
                setDeleteModal(null);
                showToast('Target deleted successfully.', 'error');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        .hover-bg:hover { background: var(--bg-tertiary); }
      `}} />
    </div>
  );
}
