'use client';

import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Printer, RefreshCw, Save, 
  MoreVertical, Edit, Trash2, Globe, Target, IndianRupee, BarChart2, Briefcase, Plus, ChevronDown, Activity, BookOpen, X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Label, ComposedChart, Line, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { SourceReportDetailsModal, SourceData } from '../modals/SourceReportDetailsModal';
import { SourceKpiModal } from '../modals/SourceKpiModal';
import { EditSourceModal } from '../modals/EditSourceModal';
import { SourceTimelineModal } from '../modals/SourceTimelineModal';
import { AddSourceModal } from '../modals/AddSourceModal';
import { GenerateReportModal } from '../modals/GenerateReportModal';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

const sources = [
  'Website', 'Google Search', 'Google Ads', 'Facebook', 'Instagram', 
  'LinkedIn', 'WhatsApp', 'YouTube', 'Referral', 'Walk-in', 
  'College Seminar', 'Education Fair', 'Tele Calling', 'Email Campaign', 
  'Existing Student Referral', 'Corporate Partnership', 'Offline Advertisement', 'Others'
];

const managers = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];

const formatCurrency = (val: number) => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
  } else if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  return `₹${val.toLocaleString()}`;
};

const generateMockSources = () => {
  const explicitSources = [
    { source: 'Instagram', leads: 2850, applications: 620, admissions: 285, renewals: 72, revenue: 14200000, marketingCost: 480000, manager: 'Alex Wong' },
    { source: 'Google Ads', leads: 2640, applications: 580, admissions: 310, renewals: 85, revenue: 16800000, marketingCost: 620000, manager: 'Sarah Miller' },
    { source: 'Facebook', leads: 2180, applications: 490, admissions: 235, renewals: 61, revenue: 11200000, marketingCost: 410000, manager: 'John Doe' },
    { source: 'YouTube', leads: 1950, applications: 420, admissions: 210, renewals: 48, revenue: 9800000, marketingCost: 360000, manager: 'Priya Sharma' },
    { source: 'Email Campaign', leads: 1720, applications: 510, admissions: 275, renewals: 94, revenue: 13500000, marketingCost: 280000, manager: 'Alex Wong' },
    { source: 'Referral', leads: 1580, applications: 460, admissions: 295, renewals: 102, revenue: 10800000, marketingCost: 190000, manager: 'Arjun Kumar' },
    { source: 'LinkedIn', leads: 1425, applications: 310, admissions: 165, renewals: 37, revenue: 7600000, marketingCost: 240000, manager: 'Sarah Miller' },
    { source: 'Walk-in', leads: 1150, applications: 290, admissions: 145, renewals: 29, revenue: 6400000, marketingCost: 160000, manager: 'Priya Sharma' },
  ];

  const data = [];
  let idCounter = 1000;
  
  // Add explicit sources
  for (const s of explicitSources) {
    const convRate = ((s.admissions / s.leads) * 100).toFixed(1);
    data.push({
      id: `SRC-${idCounter++}`,
      source: s.source,
      leads: s.leads,
      applications: s.applications,
      admissions: s.admissions,
      renewals: s.renewals,
      revenue: s.revenue,
      convRate,
      marketingCost: s.marketingCost,
      costPerLead: (s.marketingCost / s.leads).toFixed(2),
      manager: s.manager,
      leadStatus: 'Active',
      campaign: `${s.source} - August 2026`,
      studentName: 'Demo Student',
      email: 'demo@example.com',
      mobileNumber: '+91 9876543210',
      employee: s.manager
    });
  }

  // Generate remaining up to 50
  for (let i = explicitSources.length; i < 50; i++) {
    const sourceName = sources[i % sources.length] + ` (Campaign ${i})`;
    const leads = Math.floor(Math.random() * 200) + 10;
    const applications = Math.floor(leads * (Math.random() * 0.4 + 0.1));
    const admissions = Math.floor(applications * (Math.random() * 0.5 + 0.2));
    const renewals = Math.floor(admissions * (Math.random() * 0.3));
    const revenue = admissions * (Math.floor(Math.random() * 50000) + 20000);
    const cost = leads * (Math.floor(Math.random() * 300) + 100);
    const convRate = leads > 0 ? ((admissions / leads) * 100).toFixed(1) : '0.0';
    
    data.push({
      id: `SRC-${idCounter++}`,
      source: sourceName,
      leads,
      applications,
      admissions,
      renewals,
      revenue,
      convRate,
      marketingCost: cost,
      costPerLead: leads > 0 ? (cost / leads).toFixed(2) : '0',
      manager: managers[Math.floor(Math.random() * managers.length)],
      leadStatus: Math.random() > 0.2 ? 'Active' : 'Inactive',
      campaign: `Camp-${i}`,
      studentName: 'Demo Student',
      email: 'demo@example.com',
      mobileNumber: '+91 9876543210',
      employee: managers[Math.floor(Math.random() * managers.length)]
    });
  }
  return data;
};

const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Date'];

export function AdminDashboardSourceReport() {
  const crm = useCRM();
  const [data, setData] = useState<SourceData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [activeModalSource, setActiveModalSource] = useState<SourceData | null>(null);
  const [activeKpiTitle, setActiveKpiTitle] = useState<string | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState('This Month');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [chartType, setChartType] = useState('Pie');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [activeGenerateReport, setActiveGenerateReport] = useState<string | null>(null);
  
  
  const [advancedFilters, setAdvancedFilters] = useState({
    source: 'All', campaign: 'All', campaignStatus: 'All',
    leadStatus: 'All', leadStage: 'All', leadType: 'All',
    admissionStatus: 'All', course: 'All', program: 'All',
    marketingChannel: 'All', marketingSpendRange: 'All', cplRange: 'All',
    revenueRange: 'All', roiRange: 'All',
    employee: 'All', team: 'All', manager: 'All',
    convRate: 'All'
  });
  const [activeEditSource, setActiveEditSource] = useState<SourceData | null>(null);
  const [activeTimelineSource, setActiveTimelineSource] = useState<SourceData | null>(null);
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  useGlobalEscape(showDateDropdown, () => setShowDateDropdown(false));
  useGlobalEscape(showReportDropdown, () => setShowReportDropdown(false));
  useGlobalEscape(showHeaderDropdown, () => setShowHeaderDropdown(false));
  useGlobalEscape(showFilterDrawer, () => setShowFilterDrawer(false));
  useGlobalEscape(!!menuOpenId, () => setMenuOpenId(null));

  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData([...data]); // Force re-render with "new" data
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      showToast('Data refreshed successfully');
    }, 1200);
  };

  // Load from local storage or generate mock
  React.useEffect(() => {
    const saved = localStorage.getItem('fortivex_sources_data');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const generated = generateMockSources();
      setData(generated as unknown as SourceData[]);
      localStorage.setItem('fortivex_sources_data', JSON.stringify(generated));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  
  const handleAction = (action: string, id: string) => {
    setMenuOpenId(null);
    const item = data.find(d => d.id === id);
    if (!item) return;

    if (action === 'View Details' || action === 'View Analytics') {
      setActiveModalSource(item);
    } else if (action === 'Edit Source') {
      setActiveEditSource(item);
    } else if (action === 'View Timeline') {
      setActiveTimelineSource(item);
    } else if (action === 'Export Excel' || action === 'Download PDF' || action === 'Print') {
      showToast(`${action} for ${item.source}...`);
      setTimeout(() => {
        const csvData = `ID,Source,Campaign,Leads,Applications,Admissions,Revenue,ConvRate,Cost,Manager,Status
${item.id},${item.source},${item.campaign || ''},${item.leads},${item.applications},${item.admissions},${item.revenue},${item.convRate},${item.marketingCost},${item.manager},${item.status}`;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.source}_Details.csv`;
        link.click();
      }, 500);
    } else if (action === 'Refresh Source') {
      showToast(`Refreshing ${item.source} data...`);
      setTimeout(() => showToast(`${item.source} updated successfully`), 1000);
    } else if (action === 'Delete') {
      const newData = data.filter(d => d.id !== id);
      setData(newData);
      localStorage.setItem('fortivex_sources_data', JSON.stringify(newData));
      showToast(`${item.source} deleted successfully.`);
    } else {
      showToast(`${action} triggered for ${item.source}`);
    }
  };


  
  const filteredData = data.filter(item => {
    let matches = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const searchMatch = (
        (item.source?.toLowerCase() || '').includes(term) ||
        (item.campaign?.toLowerCase() || '').includes(term) ||
        (item.leads?.toString() || '').includes(term) ||
        (item.applications?.toString() || '').includes(term) ||
        (item.admissions?.toString() || '').includes(term) ||
        (item.revenue?.toString() || '').includes(term) ||
        (item.convRate?.toString() || '').includes(term) ||
        (item.marketingCost?.toString() || '').includes(term) ||
        (item.id?.toLowerCase() || '').includes(term) ||
        ((item as any).manager?.toLowerCase() || '').includes(term) ||
        ((item as any).employee?.toLowerCase() || '').includes(term) ||
        ((item as any).studentName?.toLowerCase() || '').includes(term) ||
        ((item as any).email?.toLowerCase() || '').includes(term) ||
        ((item as any).mobileNumber?.toLowerCase() || '').includes(term) ||
        ((item as any).leadStatus?.toLowerCase() || '').includes(term)
      );
      if (!searchMatch) matches = false;
    }
    
    // Check advanced filters...
    if (advancedFilters.manager !== 'All' && (item as any).manager !== advancedFilters.manager) matches = false;
    if (advancedFilters.leadStatus !== 'All' && (item as any).leadStatus !== advancedFilters.leadStatus) matches = false;
    if (advancedFilters.convRate === '>20' && Number(item.convRate) <= 20) matches = false;
    if (advancedFilters.convRate === '<10' && Number(item.convRate) >= 10) matches = false;
    
    // A mock date filter check
    if (dateFilter !== 'All Time' && dateFilter !== 'This Month') {
       // just mock filtering since it's demo data without real dates
       // in real world, we'd filter by item.createdAt
    }
    
    return matches;
  });


  const managers = Array.from(new Set(data.map(d => d.manager)));

  // Overall KPIs
  const totalSources = 50;
  const totalLeads = '16,495';
  const totalAdmissions = '2,383';
  const avgConversion = '14';
  const totalRevenue = '9.65';
  const avgCPL = '264';
  const marketingSpend = '43.63';
  const bestSource = 'Email Campaign';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {showFilterDrawer && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 99998 }} onClick={() => setShowFilterDrawer(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel"
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', zIndex: 99999, borderRadius: '0', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Advanced Filters</h3>
                <button onClick={() => setShowFilterDrawer(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* SOURCE FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>SOURCE FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Source Name</label>
                      <select value={advancedFilters.source} onChange={(e) => setAdvancedFilters({...advancedFilters, source: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Sources</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Campaign</label>
                      <select value={advancedFilters.campaign} onChange={(e) => setAdvancedFilters({...advancedFilters, campaign: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Campaigns</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Campaign Status</label>
                      <select value={advancedFilters.campaignStatus} onChange={(e) => setAdvancedFilters({...advancedFilters, campaignStatus: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* LEAD FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>LEAD FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lead Status</label>
                      <select value={advancedFilters.leadStatus} onChange={(e) => setAdvancedFilters({...advancedFilters, leadStatus: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Statuses</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lead Stage</label>
                      <select value={advancedFilters.leadStage} onChange={(e) => setAdvancedFilters({...advancedFilters, leadStage: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Stages</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lead Type</label>
                      <select value={advancedFilters.leadType} onChange={(e) => setAdvancedFilters({...advancedFilters, leadType: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Types</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ADMISSION FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>ADMISSION FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Admission Status</label>
                      <select value={advancedFilters.admissionStatus} onChange={(e) => setAdvancedFilters({...advancedFilters, admissionStatus: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Statuses</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Course</label>
                      <select value={advancedFilters.course} onChange={(e) => setAdvancedFilters({...advancedFilters, course: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Courses</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Program</label>
                      <select value={advancedFilters.program} onChange={(e) => setAdvancedFilters({...advancedFilters, program: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Programs</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* MARKETING FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>MARKETING FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Marketing Channel</label>
                      <select value={advancedFilters.marketingChannel} onChange={(e) => setAdvancedFilters({...advancedFilters, marketingChannel: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Channels</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Marketing Spend Range</label>
                      <select value={advancedFilters.marketingSpendRange} onChange={(e) => setAdvancedFilters({...advancedFilters, marketingSpendRange: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">Any Spend</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cost Per Lead Range</label>
                      <select value={advancedFilters.cplRange} onChange={(e) => setAdvancedFilters({...advancedFilters, cplRange: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">Any CPL</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PERFORMANCE FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>PERFORMANCE FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Conversion Rate</label>
                      <select value={advancedFilters.convRate} onChange={(e) => setAdvancedFilters({...advancedFilters, convRate: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">Any Conversion Rate</option>
                        <option value=">20">&gt; 20% (High)</option>
                        <option value="<10">&lt; 10% (Low)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Revenue Range</label>
                      <select value={advancedFilters.revenueRange} onChange={(e) => setAdvancedFilters({...advancedFilters, revenueRange: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">Any Revenue</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>ROI Range</label>
                      <select value={advancedFilters.roiRange} onChange={(e) => setAdvancedFilters({...advancedFilters, roiRange: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">Any ROI</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* EMPLOYEE FILTERS */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>EMPLOYEE FILTERS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Employee</label>
                      <select value={advancedFilters.employee} onChange={(e) => setAdvancedFilters({...advancedFilters, employee: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Employees</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Team</label>
                      <select value={advancedFilters.team} onChange={(e) => setAdvancedFilters({...advancedFilters, team: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Teams</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Manager</label>
                      <select value={advancedFilters.manager} onChange={(e) => setAdvancedFilters({...advancedFilters, manager: e.target.value})} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        <option value="All">All Managers</option>
                        {managers.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* DATE FILTER */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>DATE FILTER</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Range</label>
                      <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="glass-input" style={{ width: '100%', padding: '8px' }}>
                        {dateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" onClick={() => setAdvancedFilters({ source: 'All', campaign: 'All', campaignStatus: 'All', leadStatus: 'All', leadStage: 'All', leadType: 'All', admissionStatus: 'All', course: 'All', program: 'All', marketingChannel: 'All', marketingSpendRange: 'All', cplRange: 'All', revenueRange: 'All', roiRange: 'All', employee: 'All', team: 'All', manager: 'All', convRate: 'All' })} style={{ flex: 1 }}>Reset</button>
                <button className="primary-btn" onClick={() => { setShowFilterDrawer(false); showToast('Filters Applied'); }} style={{ flex: 1 }}>Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
      {showCustomDateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '24px', width: '400px', background: 'var(--bg-primary)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>Custom Date Range</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>Start Date</label>
                <input type="date" className="glass-input" style={{ width: '100%', padding: '10px' }} value={customDateStart} onChange={(e) => setCustomDateStart(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>End Date</label>
                <input type="date" className="glass-input" style={{ width: '100%', padding: '10px' }} value={customDateEnd} onChange={(e) => setCustomDateEnd(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={() => setShowCustomDateModal(false)}>Cancel</button>
              <button className="primary-btn" onClick={() => { setShowCustomDateModal(false); showToast('Date Range Applied!'); }}>Apply Range</button>
            </div>
          </motion.div>
        </div>
      )}

            {/* ADD SOURCE MODAL */}
      {showAddSourceModal && (
        <AddSourceModal 
          onClose={() => setShowAddSourceModal(false)}
          onSave={(newSource: any) => {
            setData([newSource, ...data]);
            setShowAddSourceModal(false);
            showToast('Source added successfully.');
          }}
        />
      )}

      {/* MODAL */}
      <AnimatePresence>
        {activeModalSource && (
          <SourceReportDetailsModal 
            sourceData={activeModalSource} 
            onClose={() => setActiveModalSource(null)} 
          />
        )}
      </AnimatePresence>

      {/* KPI MODAL */}
      <AnimatePresence>
        {activeKpiTitle && (
          <SourceKpiModal 
            kpiTitle={activeKpiTitle} 
            onClose={() => setActiveKpiTitle(null)} 
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Source Report</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track lead sources, campaign performance, conversions and marketing ROI.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowHeaderDropdown(!showHeaderDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={16}/> Generate Report <ChevronDown size={14}/>
            </button>
            <AnimatePresence>
              {showHeaderDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    {[
                      'Daily Source Report',
                      'Weekly Source Report',
                      'Monthly Source Report',
                      'Yearly Source Report',
                      'Campaign Performance Report',
                      'Marketing ROI Report'
                    ].map(reportType => (
                      <button 
                        key={reportType}
                        onClick={() => {
                          setActiveGenerateReport(reportType);
                          setShowHeaderDropdown(false);
                        }}
                        style={{ padding: '12px 16px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={16} color="var(--primary-color)" />
                        {reportType}
                      </button>
                    ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="secondary-btn" onClick={() => {
            showToast('Refreshing records...');
            setTimeout(() => showToast('Records refreshed successfully'), 1000);
          }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{isRefreshing ? <RefreshCw size={16} className="spin-animation" /> : <RefreshCw size={16}/>} Refresh</button>
          <button className="primary-btn" onClick={() => setShowAddSourceModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16}/> Add Source</button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { title: 'Total Lead Sources', value: '50', subtitle: 'Active: 44  Inactive: 6', icon: Globe, color: '#3b82f6' },
          { title: 'Total Leads Generated', value: '16,495', subtitle: 'New Leads: 5,240', icon: Target, color: '#8b5cf6' },
          { title: 'Total Admissions', value: '2,383', subtitle: 'Completed: 2,383', icon: BookOpen, color: '#10b981' },
          { title: 'Conversion Rate', value: '14.0%', subtitle: 'Vs Last Month: ↑ 2.4%', icon: Activity, color: '#f59e0b' },
          { title: 'Total Revenue', value: '₹9.65 Cr', subtitle: 'Vs Last Month: ↑ 8.6%', icon: IndianRupee, color: '#059669' },
          { title: 'Cost Per Lead', value: '₹264', subtitle: 'Vs Last Month: ↓ 5.0%', icon: IndianRupee, color: '#ef4444' },
          { title: 'Marketing Spend', value: '₹43.63 Lakhs', subtitle: 'Vs Last Month: ↑ 10.3%', icon: BarChart2, color: '#ec4899' },
          { title: 'Best Performing Source', value: 'Email Campaign', subtitle: 'Conversion: 16.0%', icon: Briefcase, color: '#14b8a6' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            className="glass-panel"
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `4px solid ${kpi.color}` }}
            onClick={() => setActiveKpiTitle(kpi.title)}
          >
            <div style={{ padding: '12px', background: `${kpi.color}15`, borderRadius: '12px', color: kpi.color }}>
              <kpi.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{kpi.value}</div>
              {kpi.subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{kpi.subtitle}</div>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Pie Chart - Leads by Source */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Leads by Source</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Distribution of generated leads across major marketing and acquisition sources.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData.slice(0, 8)}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={130}
                    paddingAngle={2}
                    dataKey="leads"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
                      const x = (cx as number) + (radius as number) * Math.cos(-(midAngle || 0) * RADIAN);
                      const y = (cy as number) + (radius as number) * Math.sin(-(midAngle || 0) * RADIAN);
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="0.8rem" fontWeight="500">
                          {`${((percent || 0) * 100).toFixed(1)}%`}
                        </text>
                      );
                    }}
                    onClick={(data) => setActiveModalSource(data.payload || data)}
                    style={{ cursor: 'pointer' }}
                  >
                    {filteredData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox as any;
                        return (
                          <g>
                            <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" style={{ fontSize: '1.6rem', fontWeight: 'bold', fill: 'var(--text-primary)' }}>
                              16,495
                            </text>
                            <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central" style={{ fontSize: '0.9rem', fill: 'var(--text-secondary)' }}>
                              Total Leads
                            </text>
                          </g>
                        );
                      }}
                    />
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                    formatter={(value: any, name: any, props: any) => {
                      const total = filteredData.slice(0,8).reduce((acc, curr) => acc + curr.leads, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return [`${value} Leads (${percent}%)`, props.payload.source || name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredData.slice(0, 8).map((source, index) => {
                const total = filteredData.slice(0, 8).reduce((acc, curr) => acc + curr.leads, 0);
                const percent = ((source.leads / total) * 100).toFixed(1);
                return (
                  <div key={source.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{source.source}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{source.leads.toLocaleString()}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>Total Leads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>16,495</span>
                <span style={{ color: 'var(--text-secondary)' }}>(100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Composed Chart - Spend vs Revenue */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>Marketing Spend vs Revenue (Top Sources)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Comparison of marketing investment and revenue generated by each lead source.</p>
          <div style={{ flex: 1, minHeight: '450px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="source" stroke="var(--text-secondary)" tick={{fontSize: 10}} height={60} angle={-45} textAnchor="end" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" width={60} tickFormatter={(v) => `${(v/100000).toFixed(0)}`} label={{ value: 'Marketing Spend (₹ Lakhs)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--text-secondary)', fontSize: 10 } }} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" width={60} tickFormatter={(v) => `${(v/100000).toFixed(0)}`} label={{ value: 'Revenue (₹ Lakhs)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: 'var(--text-secondary)', fontSize: 10 } }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Revenue') {
                       return [`₹${(value/100000).toFixed(2)} Lakhs`, name];
                    }
                    return [`₹${(value/100000).toFixed(2)} Lakhs`, name];
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar yAxisId="left" dataKey="marketingCost" name="Marketing Spend (₹ Lakhs)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} onClick={(data) => setActiveModalSource(data.payload || data)} style={{ cursor: 'pointer' }} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (₹ Lakhs)" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6, onClick: (e, data: any) => setActiveModalSource(data?.payload || null) }} style={{ cursor: 'pointer' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE TOOLBAR & FILTERS */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', width: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search across Source Report..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input" 
              style={{ padding: '12px 16px 12px 42px', width: '100%', borderRadius: '12px', fontSize: '0.95rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', transition: 'all 0.2s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
            />
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px' }}>
              <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Ctrl</kbd>
              <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>K</kbd>
            </div>
          </div>

          {/* Date Dropdown */}
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowDateDropdown(!showDateDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {dateFilter} <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {showDateDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                >
                  {dateOptions.map(opt => (
                    <button key={opt} onClick={() => { setDateFilter(opt); setShowDateDropdown(false); handleRefresh(); showToast(`Date filter: ${opt}`); }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{opt}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="secondary-btn" onClick={() => setShowFilterDrawer(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={16}/> Advanced Filters</button>
        </div>

        {/* Reports Generation */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowReportDropdown(!showReportDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16}/> Generate Report <ChevronDown size={14}/>
            </button>
            <AnimatePresence>
              {showReportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass-panel"
                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', minWidth: '220px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  >
                  {['Daily Source Report', 'Weekly Source Report', 'Monthly Source Report', 'Yearly Source Report', 'Campaign Performance Report', 'Marketing ROI Report'].map(rep => (
                    <button key={rep} onClick={() => { 
                      setActiveGenerateReport(rep);
                      setShowReportDropdown(false); 
                    }} 
                    style={{ padding: '10px 16px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {rep}
                    </button>
                  ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
          <thead style={{ background: 'var(--bg-card)' }}>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Source Name</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Leads</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Applications</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Admissions</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Renewals</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Revenue</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Conversion</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Marketing Cost</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr 
                key={row.id} 
                style={{ borderBottom: '1px solid var(--glass-border)' }}
              >
                <td style={{ padding: '16px' }}>
                  <div 
                    style={{ fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }}
                    onClick={() => setActiveModalSource(row)}
                  >
                    {row.source}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>{row.leads}</td>
                <td style={{ padding: '16px' }}>{row.applications}</td>
                <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 400 }}>{row.admissions}</td>
                <td style={{ padding: '16px', fontWeight: 400 }}>{row.renewals}</td>
                <td style={{ padding: '16px', fontWeight: 400 }}>{formatCurrency(row.revenue)}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 400 }}>
                    {row.convRate}%
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{formatCurrency(row.marketingCost)}</td>
                <td style={{ padding: '16px', textAlign: 'right', position: 'relative' }}>
                  <button className="icon-btn action-menu-btn" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === row.id ? null : row.id); }}>
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {menuOpenId === row.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="glass-panel" 
                        style={{ position: 'absolute', right: '32px', top: '16px', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
                      >
                        {[
                          { label: 'View Details', icon: Activity },
                          { label: 'View Analytics', icon: BarChart2 },
                          { label: 'Edit Source', icon: Edit },
                          { label: 'Download PDF', icon: Download },
                          { label: 'Export Excel', icon: FileSpreadsheet },
                          { label: 'Print', icon: Printer },
                          { label: 'View Timeline', icon: Activity },
                          { label: 'Refresh Source', icon: RefreshCw },
                          { label: 'Delete', icon: Trash2, danger: true }
                        ].map(action => (
                          <button
                            key={action.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(action.label, row.id);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                              background: 'transparent', border: 'none', color: action.danger ? '#ef4444' : 'var(--text-primary)',
                              textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem'
                            }}
                          >
                            <action.icon size={16} />
                            {action.label}
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
        {filteredData.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No sources found matching your search.</div>
        )}
      </div>

      {activeGenerateReport && (
        <GenerateReportModal 
          reportType={activeGenerateReport} 
          onClose={() => setActiveGenerateReport(null)} 
        />
      )}
    </div>
  );
}
