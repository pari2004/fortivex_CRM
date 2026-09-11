'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, TrendingUp, X, Users, BookOpen, Clock, Download, ChevronRight, Phone, CheckSquare, Filter, ThumbsUp, ThumbsDown, CheckCircle, XCircle, FileText, Bell, MessageCircle, FileInput } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DataToolbar } from '@/components/common/DataToolbar';
import { MonthlyRevenueChart, MonthlyConversionChart, CounselorPerformanceChart, ProgramConversionChart, MonthlyClosingTrendChart } from './AnalyticsCharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

// --- Cohort Data Models ---
interface Cohort {
  id: string;
  name: string;
  program: string;
  students: number;
  mentor: string;
  startDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  completionPct: number;
  revenue: number;
}

const mockCohorts: Cohort[] = [
  { id: 'COH-1001', name: 'FSD-2026-A', program: 'Full Stack Development', students: 42, mentor: 'Rahul Sharma', startDate: '05 Aug 2026', status: 'Active', completionPct: 45, revenue: 6300000 },
  { id: 'COH-1002', name: 'FSD-2026-B', program: 'Full Stack Development', students: 38, mentor: 'Sneha Reddy', startDate: '15 Aug 2026', status: 'Active', completionPct: 20, revenue: 5700000 },
  { id: 'COH-1003', name: 'FSD-2026-C', program: 'Full Stack Development', students: 51, mentor: 'Arjun Kumar', startDate: '10 Aug 2026', status: 'Active', completionPct: 15, revenue: 7650000 },
  { id: 'COH-1004', name: 'FSD-Weekend-01', program: 'Full Stack Development', students: 29, mentor: 'Priya Sharma', startDate: '20 Aug 2026', status: 'Active', completionPct: 5, revenue: 4350000 },
  { id: 'COH-1005', name: 'FSD-2025-Q4', program: 'Full Stack Development', students: 45, mentor: 'Rahul Sharma', startDate: '01 Nov 2025', status: 'Completed', completionPct: 100, revenue: 6750000 },
];

function CohortStatusBadge({ status }: { status: string }) {
  if (status === 'Active') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200">{status}</span>;
  if (status === 'Upcoming') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">{status}</span>;
  return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-800 border-gray-200">{status}</span>;
}

type ActiveViewType = 'dealSize' | 'conversion' | 'timeToClose' | 'cohorts' | null;

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<ActiveViewType>(null);

  const { leads, deals, quotes, calls, tasks, reminders } = useCRM();
  const [dateRange, setDateRange] = useState('This Month');

  // filter items based on dateRange
  const filterByDate = (items: any[], dateField = 'createdAt') => items || [];
  const filteredLeads = filterByDate(leads);
  const filteredDeals = filterByDate(deals);
  const filteredQuotes = filterByDate(quotes);
  const filteredCalls = filterByDate(calls, 'date');
  const filteredTasks = filterByDate(tasks, 'dueDate');

  const crmKPIs = [
    { title: 'Total Leads', value: filteredLeads.length, icon: Users, color: '#3b82f6', trend: '+5%' },
    { title: 'Open Opportunities', value: filteredDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length, icon: BookOpen, color: '#f59e0b', trend: '+12%' },
    { title: 'Total Quotes', value: filteredQuotes.length, icon: FileText, color: '#8b5cf6', trend: '+8%' },
    { title: 'Total Calls', value: filteredCalls.length, icon: Phone, color: '#10b981', trend: '+15%' },
    { title: 'Total Engagements', value: filteredCalls.length + filteredTasks.length, icon: Activity, color: '#ec4899', trend: '+3%' },
    { title: 'Pending Tasks', value: filteredTasks.filter(t => t.status !== 'Completed').length, icon: Clock, color: '#ef4444', trend: '-2%' },
    { title: 'Completed Tasks', value: filteredTasks.filter(t => t.status === 'Completed').length, icon: CheckSquare, color: '#0ea5e9', trend: '+10%' },
    { title: 'Conversion Rate', value: filteredLeads.length ? Math.round((filteredDeals.filter(d => d.stage === 'Closed Won').length / filteredLeads.length) * 100) + '%' : '0%', icon: TrendingUp, color: '#84cc16', trend: '+1%' }
  ];

  const funnelData = [
    { label: 'Leads', value: filteredLeads.length, color: '#3b82f6' },
    { label: 'Opportunities', value: filteredDeals.length, color: '#8b5cf6' },
    { label: 'Quotes', value: filteredQuotes.length, color: '#f59e0b' },
    { label: 'Won', value: filteredDeals.filter(d => d.stage === 'Closed Won').length, color: '#10b981' }
  ];

  const newLeads = filteredLeads.filter(l => l.status === 'New').length;
  const convertedLeads = filteredLeads.filter(l => l.status === 'Converted' || l.status === 'Admitted').length;
  const lostLeads = filteredLeads.filter(l => l.status === 'Lost' || l.status === 'Dead').length;

  const openOpps = filteredDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length;
  const wonOpps = filteredDeals.filter(d => d.stage === 'Closed Won').length;
  const lostOpps = filteredDeals.filter(d => d.stage === 'Closed Lost').length;
  const totalOppValue = filteredDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const draftQuotes = filteredQuotes.filter(q => q.status === 'Draft').length;
  const sentQuotes = filteredQuotes.filter(q => q.status === 'Sent').length;
  const acceptedQuotes = filteredQuotes.filter(q => q.status === 'Accepted').length;
  const rejectedQuotes = filteredQuotes.filter(q => q.status === 'Rejected').length;
  const totalQuoteValue = filteredQuotes.reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);

  const positiveCalls = filteredCalls.filter(c => c.outcome === 'Positive').length;
  const negativeCalls = filteredCalls.filter(c => c.outcome === 'Negative').length;
  const noOutcomeCalls = filteredCalls.filter(c => c.outcome === 'No Outcome').length;
  const callsOver30s = filteredCalls.filter(c => parseInt(c.duration || '0') > 30).length;
  const recOn = filteredCalls.filter(c => c.recordingUrl).length;
  const recOff = filteredCalls.length - recOn;

  const pendingTasksCount = filteredTasks.filter(t => t.status !== 'Completed').length;
  const completedTasksCount = filteredTasks.filter(t => t.status === 'Completed').length;

  const recentCrmActivities: any[] = [];
  filteredLeads.slice(0, 2).forEach(l => recentCrmActivities.push({ time: l.createdOn || 'Recently', desc: 'Lead created: ' + l.firstName + ' ' + l.lastName, type: 'info' }));
  filteredDeals.slice(0, 2).forEach(d => recentCrmActivities.push({ time: d.closeDate || 'Recently', desc: 'Opportunity updated: ' + d.title, type: 'success' }));
  filteredQuotes.slice(0, 2).forEach(q => recentCrmActivities.push({ time: q.date || 'Recently', desc: 'Quote created: ' + q.quoteNumber, type: 'warning' }));
  filteredCalls.slice(0, 2).forEach(c => recentCrmActivities.push({ time: c.date || 'Recently', desc: 'Call logged for ' + c.leadName, type: 'success' }));
  const sortedRecentActivities = recentCrmActivities.slice(0, 6);

  
  // Cohorts state
  const [cohorts, setCohorts] = useState<Cohort[]>(mockCohorts);
  const [filteredCohorts, setFilteredCohorts] = useState<Cohort[]>(mockCohorts);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  // --- Toast ---
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Export Functionality ---
  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    const filename = 'Cohort_Management_Report';
    const columns = [
      { header: 'Cohort ID', key: 'id' },
      { header: 'Name', key: 'name' },
      { header: 'Program', key: 'program' },
      { header: 'Students', key: 'students' },
      { header: 'Mentor', key: 'mentor' },
      { header: 'Start Date', key: 'startDate' },
      { header: 'Status', key: 'status' },
      { header: 'Completion %', key: 'completionPct' },
      { header: 'Revenue', key: 'revenue' },
    ];

    if (format === 'PDF') {
      exportToPDF(filteredCohorts, filename, 'Cohort Management & Performance Report', columns);
    } else {
      exportToExcel(filteredCohorts, filename, 'Cohort Management Report', columns);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px', position: 'relative' }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Analytics & BI</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into business intelligence and cohort performance.</p>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[
          { id: 'dealSize', label: 'Avg Deal Size', val: '₹142,500', icon: TrendingUp },
          { id: 'conversion', label: 'Conversion Rate', val: '18.4%', icon: Activity },
          { id: 'timeToClose', label: 'Time to Close', val: '14 Days', icon: BarChart3 },
          { id: 'cohorts', label: 'Active Cohorts', val: '8', icon: PieChart }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView(stat.id as ActiveViewType)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 500 }}>{stat.label}</span>
              <stat.icon size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
              View Analytics <ChevronRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* BASE DASHBOARD CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonthlyRevenueChart />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ProgramConversionChart />
          </div>
        </div>
      </div>

      
      <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '32px 0 8px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CRM Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live tracking of leads, opportunities, quotes, and engagements.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} color="var(--text-tertiary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter:</span>
          {['Today', 'This Week', 'This Month', 'Last 30 Days'].map(range => (
            <button 
              key={range}
              onClick={() => setDateRange(range)}
              style={{ 
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                background: dateRange === range ? 'var(--primary-color)' : 'transparent', color: dateRange === range ? 'white' : 'var(--text-secondary)'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {crmKPIs.map((kpi, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{kpi.title}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#f59e0b" /> Sales Pipeline Funnel
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {funnelData.map((stage, idx) => (
              <div key={idx} style={{ width: `${100 - (idx * 20)}%`, background: stage.color, color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {stage.label} ({stage.value})
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#3b82f6" /> Lead Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1, alignItems: 'center' }}>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>{newLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>New Leads</div>
             </div>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{convertedLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Converted</div>
             </div>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc2626' }}>{lostLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lost Leads</div>
             </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#8b5cf6" /> Opportunity Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Open</span>
                 <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{openOpps}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Won</span>
                 <span style={{ fontWeight: 'bold', color: '#10b981' }}>{wonOpps}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Lost</span>
                 <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{lostOpps}</span>
               </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Pipeline Value</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>₹{totalOppValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0ea5e9" /> Quotes Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{draftQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Draft</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0284c7' }}>{sentQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sent</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#16a34a' }}>{acceptedQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accepted</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#dc2626' }}>{rejectedQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rejected</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
             <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total Quote Value</span>
             <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0ea5e9' }}>₹{totalQuoteValue.toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={20} color="#10b981" /> Calls & Engagements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsUp size={14} color="#16a34a"/> Positive</span><span style={{ fontWeight: 'bold' }}>{positiveCalls}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsDown size={14} color="#dc2626"/> Negative</span><span style={{ fontWeight: 'bold' }}>{negativeCalls}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#ea580c"/> &gt;30s Talk</span><span style={{ fontWeight: 'bold' }}>{callsOver30s}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={14} color="var(--text-secondary)"/> No Outcome</span><span style={{ fontWeight: 'bold' }}>{noOutcomeCalls}</span></div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>Recording Status</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold' }}>ON ({recOn})</span>
                 <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 'bold' }}>OFF ({recOff})</span>
               </div>
               <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                 <div style={{ width: `${filteredCalls.length ? (recOn / filteredCalls.length) * 100 : 0}%`, height: '100%', background: '#16a34a' }} />
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={20} color="#ec4899" /> Tasks & Reminders
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#db2777' }}>{pendingTasksCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Tasks</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{completedTasksCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Tasks</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="#f59e0b" /> Active Reminders
            </span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{reminders.filter(r => !r.isCompleted).length}</span>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--text-secondary)" /> Recent CRM Activity
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '12px' }}>
             <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }} />
             
             {sortedRecentActivities.length > 0 ? sortedRecentActivities.map((act, idx) => {
               const isLast = idx === sortedRecentActivities.length - 1;
               let dotColor = '#3b82f6';
               if (act.type === 'success') dotColor = '#10b981';
               if (act.type === 'warning') dotColor = '#f59e0b';
               
               return (
                 <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: isLast ? '0' : '24px', position: 'relative' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, marginTop: '5px', zIndex: 2, outline: '4px solid var(--bg-primary)' }} />
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.desc}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{act.time}</div>
                   </div>
                 </div>
               );
             }) : (
               <div style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>No recent activities found in CRM.</div>
             )}
           </div>
        </div>
      </div>


      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {activeView && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '40px 20px' }}>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: '1200px', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
              
              {/* Overlay Toolbar */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {activeView === 'dealSize' && <><TrendingUp color="var(--primary-color)" /> Average Deal Size Analytics</>}
                  {activeView === 'conversion' && <><Activity color="var(--primary-color)" /> Conversion Analytics</>}
                  {activeView === 'timeToClose' && <><Clock color="var(--primary-color)" /> Sales Cycle Analytics</>}
                  {activeView === 'cohorts' && <><BookOpen color="var(--primary-color)" /> Cohort Management</>}
                </h2>
                <button onClick={() => { setActiveView(null); setSelectedCohort(null); }} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={24} /></button>
              </div>

              {/* Overlay Content */}
              <div style={{ padding: '32px', flex: 1 }}>
                
                {/* 1. DEAL SIZE */}
                {activeView === 'dealSize' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Average Deal Value</div><div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹142,500</div></div>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Highest Deal</div><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹285,000</div></div>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Lowest Deal</div><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>₹75,000</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Deal Size Breakdown</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Monthly Average</span><strong>₹135,000</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Quarterly Average</span><strong>₹142,500</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Yearly Average</span><strong>₹138,200</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Program</span><strong>Full Stack Development</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Counselor by Value</span><strong>Priya Sharma</strong></div>
                      </div>
                      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, minHeight: '300px' }}>
                          <MonthlyRevenueChart />
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                      <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Top 10 Highest Value Deals</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead><tr style={{ color: 'var(--text-secondary)' }}><th style={{ padding: '12px' }}>Student</th><th style={{ padding: '12px' }}>Program</th><th style={{ padding: '12px' }}>Value</th></tr></thead>
                        <tbody>
                          {[...Array(5)].map((_, i) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--glass-border)' }}>
                              <td style={{ padding: '12px', fontWeight: 500 }}>Example Student {i + 1}</td>
                              <td style={{ padding: '12px' }}>PG Executive Agentic AI</td>
                              <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{285000 - (i * 15000)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. CONVERSION */}
                {activeView === 'conversion' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Overall Conversion Rate</div>
                      <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-color)' }}>18.4%</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '32px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '24px' }}>Lead Funnel</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          { label: 'Website Leads', count: 420, pct: '100%', color: '#3b82f6' },
                          { label: 'Qualified', count: 286, pct: '68%', color: '#6366f1' },
                          { label: 'Interested', count: 162, pct: '38%', color: '#8b5cf6' },
                          { label: 'Demo Scheduled', count: 94, pct: '22%', color: '#d946ef' },
                          { label: 'Admissions', count: 77, pct: '18.4%', color: '#10b981' },
                        ].map((stage, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>{stage.label}</div>
                            <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: stage.pct }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: '100%', backgroundColor: stage.color, borderRadius: '12px' }} />
                            </div>
                            <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>{stage.count}</div>
                            <div style={{ width: '60px', textAlign: 'right', color: 'var(--text-tertiary)' }}>{stage.pct}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <MonthlyConversionChart />
                       </div>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <CounselorPerformanceChart />
                       </div>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <div style={{ fontWeight: 600, marginBottom: '16px' }}>Batch Conversion Chart</div>
                         <ProgramConversionChart />
                       </div>
                    </div>
                  </div>
                )}

                {/* 3. TIME TO CLOSE */}
                {activeView === 'timeToClose' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Average Closing Time</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>14 Days</div></div>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Fastest Close</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>3 Days</div></div>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Longest Close</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444' }}>38 Days</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Additional Metrics</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Average Response Time</span><strong>2.4 Hours</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Demo Completion Time</span><strong>4 Days</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Counselor Closing Time (Avg)</span><strong>12.5 Days</strong></div>
                      </div>
                      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '350px' }}>
                        <div style={{ flex: 1, minHeight: 0 }}>
                          <MonthlyClosingTrendChart />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. COHORT MANAGEMENT */}
                {activeView === 'cohorts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                    {selectedCohort ? (
                      <div className="glass-panel" style={{ padding: '32px' }}>
                        <button onClick={() => setSelectedCohort(null)} className="secondary-btn" style={{ marginBottom: '24px' }}>← Back to Cohorts</button>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>{selectedCohort.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{selectedCohort.program}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mentor</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedCohort.mentor}</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Students</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedCohort.students}</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completion</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{selectedCohort.completionPct}%</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Revenue</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>₹{selectedCohort.revenue.toLocaleString()}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Progress Tracking</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Average Attendance</span><strong>88%</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Assignments Submitted</span><strong>340 / 420</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Placement Ready Students</span><strong>{Math.floor(selectedCohort.students * 0.2)}</strong></div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Upcoming Sessions</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>React Advanced Hooks</span><strong>Tomorrow, 6 PM</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>State Management with Redux</span><strong>In 3 Days</strong></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Cohorts</h3>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleExport('CSV')} className="secondary-btn"><Download size={16} /> CSV</button>
                            <button onClick={() => handleExport('Excel')} className="secondary-btn"><Download size={16} /> Excel</button>
                            <button onClick={() => handleExport('PDF')} className="primary-btn"><Download size={16} /> PDF</button>
                          </div>
                        </div>

                        <DataToolbar 
                          data={cohorts} 
                          onFilteredDataChange={setFilteredCohorts} 
                          searchKeys={['name', 'program', 'mentor']}
                          searchPlaceholder="Search Cohort, Program, or Mentor..."
                          exportFilename="none" // Managed manually above
                          filterOptions={[
                            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Completed', 'Upcoming'] },
                            { key: 'name', label: 'Batch', type: 'select', options: ['FSD-2026-A', 'FSD-2026-B', 'FSD-2026-C', 'FSD-Weekend-01'] }
                          ]}
                        />

                        <div style={{ flex: 1, overflow: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                              <tr>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Cohort Info</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Mentor</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Students</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Start Date</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCohorts.map(cohort => (
                                <tr key={cohort.id} onClick={() => setSelectedCohort(cohort)} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '16px 24px' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cohort.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cohort.program}</div>
                                  </td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-primary)', fontWeight: 500 }}>{cohort.mentor}</td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{cohort.students}</td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{cohort.startDate}</td>
                                  <td style={{ padding: '16px 24px' }}><CohortStatusBadge status={cohort.status} /></td>
                                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>₹{cohort.revenue.toLocaleString()}</td>
                                </tr>
                              ))}
                              {filteredCohorts.length === 0 && (
                                <tr>
                                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No cohorts found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: toast.type === 'success' ? 'var(--status-enrolled)' : toast.type === 'error' ? 'var(--status-rejected)' : 'var(--primary-color)', color: 'white', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
