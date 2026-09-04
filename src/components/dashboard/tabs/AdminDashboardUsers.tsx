'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Printer, RefreshCw, 
  ChevronDown, Calendar, Users, Activity, ChevronRight, Plus, Minus,
  Info, MoreVertical, LayoutDashboard
} from 'lucide-react';
import { CustomDateRangeModal } from '../modals/CustomDateRangeModal';
import { useCRM } from '@/contexts/CRMContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Week', 'Last Month', 'Last Year', 'Custom Range'];

const today = new Date();
const parseDate = (dStr: string) => new Date(dStr).getTime();
const d = (daysAgo: number) => {
  const dt = new Date();
  dt.setDate(today.getDate() - daysAgo);
  return dt.toISOString().split('T')[0];
};

const targetUsers = [
  'Abhishek',
  'Padmesh',
  'Parikshit',
  'Pavan SH',
  'Spoorthi',
  'Thanushree BR',
  'Yashwanth'
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export function AdminDashboardUsers() {
  const { leads, calls, deals, users } = useCRM();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string} | null>(null);
  
  const [showTeamFilter, setShowTeamFilter] = useState(false);
  const [teamFilter, setTeamFilter] = useState('All Teams');

  const [sortField, setSortField] = useState('totalLeads');
  const [sortAsc, setSortAsc] = useState(false);

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Header Expansion States
  const [expandedHeader, setExpandedHeader] = useState<'CallAttempted' | 'Interested' | 'Closed' | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleRow = (userName: string) => {
    setExpandedRows(prev => ({ ...prev, [userName]: !prev[userName] }));
  };

  const getAggregatedData = () => {
    const todayTime = parseDate(d(0));
    let startDate = 0;
    let endDate = Number.MAX_SAFE_INTEGER;

    if (dateFilter === 'Today') {
      startDate = parseDate(d(0));
      endDate = startDate;
    } else if (dateFilter === 'Yesterday') {
      startDate = parseDate(d(1));
      endDate = startDate;
    } else if (dateFilter === 'Last 7 Days') {
      startDate = parseDate(d(7));
      endDate = todayTime;
    } else if (dateFilter === 'Last 30 Days') {
      startDate = parseDate(d(30));
      endDate = todayTime;
    } else if (dateFilter === 'This Week') {
      const currentDay = today.getDay();
      const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff)).getTime();
      endDate = todayTime;
    } else if (dateFilter === 'This Month') {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      endDate = todayTime;
    } else if (dateFilter === 'Last Month') {
      const lm = new Date();
      lm.setMonth(lm.getMonth() - 1);
      startDate = new Date(lm.getFullYear(), lm.getMonth(), 1).getTime();
      endDate = new Date(lm.getFullYear(), lm.getMonth() + 1, 0, 23, 59, 59).getTime();
    } else if (dateFilter === 'Last Year') {
      const ly = new Date();
      ly.setFullYear(ly.getFullYear() - 1);
      startDate = new Date(ly.getFullYear(), 0, 1).getTime();
      endDate = new Date(ly.getFullYear(), 11, 31, 23, 59, 59).getTime();
    } else if (dateFilter.includes('to') && customDateRange) {
      startDate = parseDate(customDateRange.start);
      endDate = parseDate(customDateRange.end);
    }

    const isDateInRange = (dateStr: string) => {
      if (!dateStr) return false;
      const pt = parseDate(dateStr.split('T')[0]);
      return pt >= startDate && pt <= endDate;
    };

    const validLeads = leads.filter(l => isDateInRange(l.createdDate || l.date || d(0)));
    const validCalls = calls.filter(c => isDateInRange(c.date));
    const validDeals = deals.filter(deal => isDateInRange(deal.closeDate || d(0)));

    const userStats: Record<string, any> = {};
    
    targetUsers.forEach(u => {
      userStats[u] = {
        name: u,
        team: users.find(usr => usr.name === u)?.department || 'FA Sales Team',
        source: 'All',
        totalLeads: 0,
        newInquiry: 0,
        reEngaged: 0,
        callAttempted: 0,
        interested: 0,
        closed: 0,
        revenue: 0,
        junk: 0,
        // Call outcomes
        sessionScheduled: 0,
        callBackLater: 0,
        followUp: 0,
        notInterested: 0,
        feeTooHigh: 0,
        notEligible: 0
      };
    });

    validLeads.forEach(l => {
      const uName = l.counselor || l.owner;
      if (userStats[uName]) {
        userStats[uName].totalLeads += 1;
        const st = (l.stage || '').toLowerCase();
        if (st.includes('new') || st.includes('inquiry')) userStats[uName].newInquiry += 1;
        if (st.includes('re-engaged') || st.includes('reengaged')) userStats[uName].reEngaged += 1;
        if (st.includes('junk') || st.includes('invalid')) userStats[uName].junk += 1;
      }
    });

    validCalls.forEach(c => {
      const uName = c.counselor;
      if (userStats[uName]) {
        userStats[uName].callAttempted += 1;
        const out = (c.outcome || '').toLowerCase();
        
        if (out === 'interested' || out === 'positive' || out.includes('demo scheduled')) userStats[uName].interested += 1;
        
        if (out.includes('session') || out.includes('demo scheduled')) userStats[uName].sessionScheduled += 1;
        if (out.includes('call back') || out.includes('later')) userStats[uName].callBackLater += 1;
        if (out.includes('follow up')) userStats[uName].followUp += 1;
        if (out === 'not interested') userStats[uName].notInterested += 1;
        if (out.includes('fee too high') || out.includes('expensive')) userStats[uName].feeTooHigh += 1;
        if (out.includes('not eligible')) userStats[uName].notEligible += 1;
      }
    });

    validDeals.forEach(deal => {
      const uName = deal.dealOwner;
      if (userStats[uName]) {
        if (deal.stage === 'Closed Won') {
          userStats[uName].closed += 1;
          userStats[uName].revenue += (deal.amount || 0);
        }
      }
    });

    Object.values(userStats).forEach(stat => {
      stat.workDonePct = stat.totalLeads ? ((stat.callAttempted / stat.totalLeads) * 100) : 0;
      stat.junkPct = stat.totalLeads ? ((stat.junk / stat.totalLeads) * 100) : 0;
      stat.dealConvPct = stat.interested ? ((stat.closed / stat.interested) * 100) : 0;
      stat.winPct = stat.totalLeads ? ((stat.closed / stat.totalLeads) * 100) : 0;
    });

    return Object.values(userStats);
  };

  const rawData = useMemo(() => getAggregatedData(), [leads, calls, deals, users, dateFilter, customDateRange]);

  const filteredData = useMemo(() => {
    let res = [...rawData];

    if (teamFilter !== 'All Teams') {
      res = res.filter(r => {
        const team = r.team === 'Unknown' || !r.team ? 'FA Sales Team' : r.team;
        return team === teamFilter || (teamFilter === 'FA Sales Team' && team.includes('Sales'));
      });
    }

    if (searchTerm) {
      res = res.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    res.sort((a, b) => {
      const valA = a[sortField] || 0;
      const valB = b[sortField] || 0;
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return res;
  }, [rawData, teamFilter, searchTerm, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExport = () => {
    // Generate CSV
    const headers = [
      'User Name', 'Source', 'Total Leads', 'New Inquiry Lead', 'Re-engaged Lead', 
      'Call Attempted Lead', 'Interested Lead', 'Closed Lead', 'Revenue', 
      'Work Done %', 'Junk %', 'Deal Conversion %', 'Win %'
    ];

    const rows = filteredData.map(r => [
      r.name, r.source, r.totalLeads, r.newInquiry, r.reEngaged,
      r.callAttempted, r.interested, r.closed, r.revenue,
      r.workDonePct.toFixed(1) + '%', r.junkPct.toFixed(1) + '%',
      r.dealConvPct.toFixed(1) + '%', r.winPct.toFixed(1) + '%'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UserLeads_Export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported User Leads Data successfully.');
  };

  // OVERALL CALCULATIONS
  const overall = filteredData.reduce((acc, curr) => {
    acc.totalLeads += curr.totalLeads;
    acc.newInquiry += curr.newInquiry;
    acc.reEngaged += curr.reEngaged;
    acc.callAttempted += curr.callAttempted;
    acc.interested += curr.interested;
    acc.closed += curr.closed;
    acc.revenue += curr.revenue;
    acc.junk += curr.junk;
    acc.sessionScheduled += curr.sessionScheduled;
    acc.callBackLater += curr.callBackLater;
    acc.followUp += curr.followUp;
    acc.notInterested += curr.notInterested;
    acc.feeTooHigh += curr.feeTooHigh;
    acc.notEligible += curr.notEligible;
    return acc;
  }, {
    totalLeads: 0, newInquiry: 0, reEngaged: 0, callAttempted: 0, interested: 0,
    closed: 0, revenue: 0, junk: 0, sessionScheduled: 0, callBackLater: 0,
    followUp: 0, notInterested: 0, feeTooHigh: 0, notEligible: 0
  });

  const overallWorkDonePct = overall.totalLeads ? ((overall.callAttempted / overall.totalLeads) * 100) : 0;
  const overallJunkPct = overall.totalLeads ? ((overall.junk / overall.totalLeads) * 100) : 0;
  const overallDealConvPct = overall.interested ? ((overall.closed / overall.interested) * 100) : 0;
  const overallWinPct = overall.totalLeads ? ((overall.closed / overall.totalLeads) * 100) : 0;

  // Chart Data preparation
  const callAttemptChartData = [
    { name: 'Session Scheduled', value: overall.sessionScheduled },
    { name: 'Call Back Later', value: overall.callBackLater },
    { name: 'Follow Up', value: overall.followUp },
    { name: 'Not Interested', value: overall.notInterested },
    { name: 'Fee Too High', value: overall.feeTooHigh },
    { name: 'Not Eligible', value: overall.notEligible },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomDateRangeModal
        isOpen={showCustomDateModal}
        onClose={() => setShowCustomDateModal(false)}
        onApply={(start, end) => {
          const rangeStr = `${start} to ${end}`;
          setDateFilter(rangeStr);
          setCustomDateRange({start, end});
          setShowCustomDateModal(false);
          showToast(`Filtered by ${rangeStr}`);
        }}
      />

      {/* HEADER & TOOLBAR CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>User Leads</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Track user-wise lead positions, activities, and conversion metrics.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => { setIsRefreshing(false); showToast('User Leads refreshed.'); }, 1000);
            }}>{isRefreshing ? <RefreshCw size={16} className="spin" style={{ color: 'var(--text-secondary)' }} /> : <RefreshCw size={16} style={{ color: 'var(--text-secondary)' }} />} Refresh</button>
            
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} onClick={handleExport}>
              <Download size={16} style={{ color: 'var(--text-secondary)' }} /> Export <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search user..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 14px 10px 40px', width: '100%', borderRadius: '8px', fontSize: '0.9rem', background: 'white', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTeamFilter(!showTeamFilter); }} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            >
              <Users size={16} style={{ color: 'var(--text-secondary)' }}/> {teamFilter} <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            {showTeamFilter && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', boxShadow: '0 10px 35px rgba(0,0,0,0.1)' }}>
                {['All Teams', 'FA Sales Team'].map(team => (
                  <button type="button" key={team} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTeamFilter(team); setShowTeamFilter(false); }} style={{ padding: '8px 12px', textAlign: 'left', background: teamFilter === team ? 'var(--bg-primary)' : 'transparent', color: teamFilter === team ? 'var(--primary-color)' : 'var(--text-primary)', fontWeight: teamFilter === team ? 600 : 400, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{team}</button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDateDropdown(!showDateDropdown); }} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            >
              <Calendar size={16} style={{ color: 'var(--text-secondary)' }} /> {dateFilter} <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            {showDateDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', boxShadow: '0 10px 35px rgba(0,0,0,0.1)' }}>
                {dateOptions.map(opt => (
                  <button type="button" key={opt} onClick={(e) => { 
                    e.preventDefault(); e.stopPropagation();
                    if (opt === 'Custom Range') {
                      setShowCustomDateModal(true);
                      setShowDateDropdown(false);
                    } else {
                      setDateFilter(opt); 
                      setShowDateDropdown(false); 
                    }
                  }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--bg-primary)' : 'transparent', color: dateFilter === opt ? 'var(--primary-color)' : 'var(--text-primary)', fontWeight: dateFilter === opt ? 600 : 400, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', overflowX: 'auto' }}>
          {[
            { title: 'TOTAL LEADS', value: overall.totalLeads, icon: Users, color: '#3b82f6', bg: '#eff6ff', line: '#3b82f6', pts: '0,20 10,15 20,20 30,5 40,10 50,0' },
            { title: 'NEW INQUIRY LEADS', value: overall.newInquiry, icon: Search, color: '#10b981', bg: '#ecfdf5', line: '#10b981', pts: '0,25 10,20 20,25 30,10 40,15 50,5' },
            { title: 'RE-ENGAGED LEADS', value: overall.reEngaged, icon: RefreshCw, color: '#8b5cf6', bg: '#f5f3ff', line: '#8b5cf6', pts: '0,20 10,25 20,10 30,15 40,5 50,0' },
            { title: 'CALL ATTEMPTED LEADS', value: overall.callAttempted, icon: Activity, color: '#f59e0b', bg: '#fffbeb', line: '#f59e0b', pts: '0,25 10,25 20,20 30,10 40,15 50,5' },
            { title: 'INTERESTED LEADS', value: overall.interested, icon: Filter, color: '#14b8a6', bg: '#f0fdfa', line: '#14b8a6', pts: '0,20 10,10 20,15 30,5 40,10 50,0' }
          ].map((kpi, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <kpi.icon size={20} style={{ color: kpi.color }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.title}</span>
                  <Info size={12} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{kpi.value.toLocaleString()}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{idx === 0 ? 'All sources' : 'Last 7 days'}</p>
                </div>
                <div style={{ width: '60px', height: '30px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 50 30" preserveAspectRatio="none">
                    <polyline points={kpi.pts} fill="none" stroke={kpi.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ background: 'white', borderBottom: '1px solid var(--glass-border)' }}>
              <tr>
                <th style={{ padding: '16px 20px', position: 'sticky', left: 0, background: 'white', zIndex: 10, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>User <ChevronDown size={12} /></div>
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Source <ChevronDown size={12} /></div>
                </th>
                {[
                  { key: 'totalLeads', label: 'Total Leads' },
                  { key: 'newInquiry', label: 'New Inquiry Lead' },
                  { key: 'reEngaged', label: 'Re-engaged Lead' },
                ].map(c => (
                  <th key={c.key} style={{ padding: '16px 20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onClick={() => handleSort(c.key)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.label} {sortField === c.key ? (sortAsc ? <ChevronDown size={12} style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown size={12} />) : <ChevronDown size={12} style={{ opacity: 0.3 }} />}
                    </div>
                  </th>
                ))}
                
                {/* Expandable Headers */}
                {[
                  { key: 'callAttempted', label: 'Call Attempted Lead', expKey: 'CallAttempted' },
                  { key: 'interested', label: 'Interested Lead', expKey: 'Interested' },
                  { key: 'closed', label: 'Closed Lead', expKey: 'Closed' }
                ].map((col) => (
                  <th key={col.key} style={{ padding: '16px 20px', background: 'white', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                       <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleSort(col.key)}>
                         {col.label}
                       </div>
                       <button type="button" 
                         onClick={() => setExpandedHeader(expandedHeader === col.expKey ? null : (col.expKey as any))}
                         style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                       >
                         {expandedHeader === col.expKey ? <Minus size={14} /> : <Plus size={14} />}
                       </button>
                     </div>
                  </th>
                ))}
  
                {[
                  { key: 'revenue', label: 'Revenue' },
                  { key: 'workDonePct', label: 'Work Done %' },
                  { key: 'junkPct', label: 'Junk %' },
                  { key: 'dealConvPct', label: 'Deal Conv %' },
                  { key: 'winPct', label: 'Win %' },
                ].map(c => (
                  <th key={c.key} style={{ padding: '16px 20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)' }} onClick={() => handleSort(c.key)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.label} {sortField === c.key ? (sortAsc ? <ChevronDown size={12} style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown size={12} />) : <ChevronDown size={12} style={{ opacity: 0.3 }} />}
                    </div>
                  </th>
                ))}
                
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            
            <tbody>
            {/* EXPANDED HEADER ROWS */}
            <AnimatePresence>
              {expandedHeader === 'CallAttempted' && (
                <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <td colSpan={13} style={{ padding: '32px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ margin: '0 0 24px 0', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Overall Call Attempt Outcomes</h4>
                      <div style={{ height: '300px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={callAttemptChartData} layout="vertical" margin={{ left: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="var(--text-secondary)" />
                            <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={120} />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'white', borderColor: 'var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="value" fill="var(--primary-color)" radius={[0, 4, 4, 0]}>
                              {callAttemptChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
              
              {expandedHeader === 'Interested' && (
                <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <td colSpan={13} style={{ padding: '32px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ margin: '0 0 24px 0', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>User-wise Interested Leads</h4>
                      <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={filteredData} margin={{ top: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'white', borderColor: 'var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="interested" name="Interested Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
  
              {expandedHeader === 'Closed' && (
                <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <td colSpan={13} style={{ padding: '32px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ margin: '0 0 24px 0', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>User-wise Closed Leads & Revenue</h4>
                      <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={filteredData} margin={{ top: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis yAxisId="left" orientation="left" stroke="var(--text-secondary)" />
                            <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'white', borderColor: 'var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="closed" name="Closed Leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
  
              {/* OVERALL ROW */}
              <tr style={{ background: 'white', borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 20px', position: 'sticky', left: 0, background: 'white', zIndex: 5, borderLeft: '4px solid #4f46e5', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={16} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>OVERALL</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>All</td>
                
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{overall.totalLeads.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{overall.newInquiry.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{overall.reEngaged.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{overall.callAttempted.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>{overall.interested.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '1rem' }}>{overall.closed.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>vs last 7 days</div>
                </td>
                
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>₹{overall.revenue.toLocaleString()}</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{overallWorkDonePct.toFixed(1)}%</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{overallJunkPct.toFixed(1)}%</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{overallDealConvPct.toFixed(1)}%</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{overallWinPct.toFixed(1)}%</td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <button style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </td>
              </tr>
  
              {/* USER ROWS */}
              {filteredData.map((row, idx) => {
                const getInitials = (name: string) => {
                  const parts = name.split(' ');
                  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
                  return name.substring(0, 2).toUpperCase();
                };
                const userColor = COLORS[idx % COLORS.length];
                
                // Helper to render value with the minus badge if 0
                const renderVal = (val: number) => {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{val.toLocaleString()}</span>
                      {val === 0 && (
                        <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>-</span>
                      )}
                    </div>
                  );
                };

                return (
                  <React.Fragment key={row.name}>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', background: 'white' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                      <td style={{ padding: '16px 20px', position: 'sticky', left: 0, background: 'inherit', zIndex: 5, borderLeft: '4px solid transparent', borderRight: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: userColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                            {getInitials(row.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{row.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', borderRight: '1px solid var(--glass-border)' }}>{row.source}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.totalLeads)}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.newInquiry)}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.reEngaged)}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.callAttempted)}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.interested)}</td>
                      <td style={{ padding: '16px 20px', borderRight: '1px solid var(--glass-border)' }}>{renderVal(row.closed)}</td>
                      
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)', fontWeight: 500 }}>₹{row.revenue.toLocaleString()}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{row.workDonePct.toFixed(1)}%</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{row.junkPct.toFixed(1)}%</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{row.dealConvPct.toFixed(1)}%</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)' }}>{row.winPct.toFixed(1)}%</td>
                      
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '6px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                          <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={14} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Users size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                      <span>No users found matching your filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', background: 'white' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Showing 1 to {filteredData.length} of {filteredData.length} entries
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} />
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 600 }}>
              1
            </button>
            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
          
          <div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
              10 per page <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
