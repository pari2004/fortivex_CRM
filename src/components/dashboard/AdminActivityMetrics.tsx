'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Save, RefreshCw, PhoneCall, Phone, Briefcase, 
  CheckCircle2, Users, IndianRupee, Activity, Target, Download, FileSpreadsheet, 
  FileText, Printer, ChevronDown, CheckSquare, Square, X, Calendar, Clock, Edit2
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ActivityTableRowMenu } from './tabs/ActivityTableRowMenu';
import { CustomDateRangeModal } from './modals/CustomDateRangeModal';

// Generate dynamic dates relative to today for realistic demo data filtering
const today = new Date();
const d = (daysAgo: number) => {
  const dt = new Date();
  dt.setDate(today.getDate() - daysAgo);
  return dt.toISOString().split('T')[0];
};

const initialDemoActivities = [
  { id: 'EMP-1001', employeeName: 'Priya Nair', team: 'Sales Alpha', department: 'Sales', outgoingCalls: 45, incomingCalls: 12, uniqueCalls: 38, callDetails: 'Follow-ups and pitching', tasks: 5, duration: '4h 30m', avgDuration: '4m 30s', status: 'Completed', date: d(0), type: 'Calls', numericDuration: 270 },
  { id: 'EMP-1002', employeeName: 'Rahul Kumar', team: 'Support Beta', department: 'Support', outgoingCalls: 20, incomingCalls: 55, uniqueCalls: 60, callDetails: 'Issue resolution', tasks: 12, duration: '6h 15m', avgDuration: '5m 10s', status: 'In Progress', date: d(0), type: 'Calls (Detailed)', numericDuration: 375 },
  { id: 'EMP-1003', employeeName: 'Sneha Reddy', team: 'Sales Alpha', department: 'Sales', outgoingCalls: 52, incomingCalls: 8, uniqueCalls: 45, callDetails: 'Cold calling new leads', tasks: 3, duration: '5h 10m', avgDuration: '5m 15s', status: 'Completed', date: d(0), type: 'Calls', numericDuration: 310 },
  { id: 'EMP-1004', employeeName: 'Vikram Joshi', team: 'Support Beta', department: 'Support', outgoingCalls: 15, incomingCalls: 62, uniqueCalls: 70, callDetails: 'Technical support calls', tasks: 15, duration: '7h 05m', avgDuration: '5m 30s', status: 'Completed', date: d(1), type: 'Calls (Detailed)', numericDuration: 425 },
  { id: 'EMP-1005', employeeName: 'Ananya Patel', team: 'Marketing', department: 'Marketing', outgoingCalls: 10, incomingCalls: 5, uniqueCalls: 12, callDetails: 'Campaign follow-ups', tasks: 22, duration: '2h 15m', avgDuration: '9m 00s', status: 'Completed', date: d(1), type: 'Tasks', numericDuration: 135 },
  { id: 'EMP-1006', employeeName: 'Karan Shah', team: 'Sales Beta', department: 'Sales', outgoingCalls: 38, incomingCalls: 15, uniqueCalls: 40, callDetails: 'Deal negotiations', tasks: 8, duration: '4h 45m', avgDuration: '5m 20s', status: 'In Progress', date: d(2), type: 'Calls', numericDuration: 285 },
  { id: 'EMP-1007', employeeName: 'Neha Verma', team: 'Customer Success', department: 'Support', outgoingCalls: 25, incomingCalls: 20, uniqueCalls: 35, callDetails: 'Onboarding clients', tasks: 10, duration: '3h 50m', avgDuration: '5m 06s', status: 'Completed', date: d(3), type: 'Unique Calls', numericDuration: 230 },
  { id: 'EMP-1008', employeeName: 'Aditya Singh', team: 'Sales Alpha', department: 'Sales', outgoingCalls: 60, incomingCalls: 10, uniqueCalls: 55, callDetails: 'Aggressive outbound', tasks: 2, duration: '6h 30m', avgDuration: '5m 34s', status: 'Completed', date: d(4), type: 'Calls', numericDuration: 390 },
  { id: 'EMP-1009', employeeName: 'Pooja Nair', team: 'Support Beta', department: 'Support', outgoingCalls: 12, incomingCalls: 48, uniqueCalls: 50, callDetails: 'General inquiries', tasks: 14, duration: '5h 20m', avgDuration: '5m 20s', status: 'Completed', date: d(5), type: 'Calls (Detailed)', numericDuration: 320 },
  { id: 'EMP-1010', employeeName: 'Rohan Kapoor', team: 'Sales Beta', department: 'Sales', outgoingCalls: 30, incomingCalls: 25, uniqueCalls: 45, callDetails: 'Mid-funnel conversions', tasks: 6, duration: '4h 15m', avgDuration: '4m 38s', status: 'In Progress', date: d(6), type: 'Calls', numericDuration: 255 },
  { id: 'EMP-1011', employeeName: 'Divya Menon', team: 'Customer Success', department: 'Support', outgoingCalls: 22, incomingCalls: 18, uniqueCalls: 30, callDetails: 'Quarterly reviews', tasks: 11, duration: '3h 40m', avgDuration: '5m 30s', status: 'Completed', date: d(8), type: 'Unique Calls', numericDuration: 220 },
  { id: 'EMP-1012', employeeName: 'Akash Gupta', team: 'Marketing', department: 'Marketing', outgoingCalls: 8, incomingCalls: 4, uniqueCalls: 10, callDetails: 'Partner syncs', tasks: 25, duration: '1h 50m', avgDuration: '9m 10s', status: 'Completed', date: d(12), type: 'Tasks', numericDuration: 110 },
  { id: 'EMP-1013', employeeName: 'Nisha Sharma', team: 'Sales Alpha', department: 'Sales', outgoingCalls: 48, incomingCalls: 14, uniqueCalls: 42, callDetails: 'Enterprise pitching', tasks: 4, duration: '5h 00m', avgDuration: '4m 50s', status: 'Completed', date: d(15), type: 'Calls', numericDuration: 300 },
  { id: 'EMP-1014', employeeName: 'Rohit Patil', team: 'Support Beta', department: 'Support', outgoingCalls: 18, incomingCalls: 50, uniqueCalls: 58, callDetails: 'Escalations', tasks: 18, duration: '6h 40m', avgDuration: '5m 52s', status: 'In Progress', date: d(20), type: 'Calls (Detailed)', numericDuration: 400 },
  { id: 'EMP-1015', employeeName: 'Kavya Rao', team: 'Customer Success', department: 'Support', outgoingCalls: 28, incomingCalls: 22, uniqueCalls: 40, callDetails: 'Churn prevention', tasks: 9, duration: '4h 10m', avgDuration: '5m 00s', status: 'Completed', date: d(25), type: 'Unique Calls', numericDuration: 250 },
  { id: 'EMP-1016', employeeName: 'Meera Iyer', team: 'Sales Beta', department: 'Sales', outgoingCalls: 42, incomingCalls: 16, uniqueCalls: 38, callDetails: 'SMB closing', tasks: 7, duration: '4h 50m', avgDuration: '5m 00s', status: 'Completed', date: d(35), type: 'Calls', numericDuration: 290 },
  { id: 'EMP-1017', employeeName: 'Arjun Mehta', team: 'Marketing', department: 'Marketing', outgoingCalls: 15, incomingCalls: 8, uniqueCalls: 20, callDetails: 'Vendor coordination', tasks: 20, duration: '2h 45m', avgDuration: '7m 10s', status: 'Completed', date: d(40), type: 'Tasks', numericDuration: 165 },
  { id: 'EMP-1018', employeeName: 'Sanjay Dutt', team: 'Sales Alpha', department: 'Sales', outgoingCalls: 55, incomingCalls: 9, uniqueCalls: 48, callDetails: 'New territories', tasks: 3, duration: '5h 45m', avgDuration: '5m 23s', status: 'Completed', date: d(45), type: 'Calls', numericDuration: 345 }
];

const categoryTabs = ['All', 'Calls', 'Unique Calls', 'Calls (Detailed)', 'Tasks'];
const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];

import { useCRM } from '@/contexts/CRMContext';

export function AdminActivityMetrics() {
  const [activities, setActivities] = useState(initialDemoActivities);
  const { leads, students, applications, calls } = useCRM();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState<any | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Tabs & Dates & Filters
  const [activeTab, setActiveTab] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string} | null>(null);
  
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    employee: 'All', team: 'All', department: 'All', callType: 'All', 
    status: 'All', activityType: 'All', priority: 'All'
  });

  // Header State
  const [lastUpdated, setLastUpdated] = useState('Updated Just Now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination & Sorting
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Action Modals State
  const [activeModal, setActiveModal] = useState<{type: string, data: any} | null>(null);

  // Load preferences
  useEffect(() => {
    const saved = localStorage.getItem('fortivex_activity_metrics_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.filters) setFilters(parsed.filters);
        if (parsed.dateFilter) setDateFilter(parsed.dateFilter);
      } catch (e) {}
    }
  }, []);

  const getSearchResults = () => {
    if (searchQuery.length <= 1) return [];
    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    leads.forEach(l => {
      if (l.name?.toLowerCase().includes(q) || l.mobile?.includes(q) || l.email?.toLowerCase().includes(q)) {
        results.push({ ...l, resultTitle: l.name, resultSubtitle: `Lead ID: ${l.id} | Team: Sales`, resultType: 'Lead' });
      }
    });
    students.forEach(s => {
      if (s.name?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q) || s.mobile?.includes(q)) {
        results.push({ ...s, resultTitle: s.name, resultSubtitle: `Student ID: ${s.studentId}`, resultType: 'Student' });
      }
    });
    applications.forEach(a => {
      if (a.studentName?.toLowerCase().includes(q) || a.id?.toLowerCase().includes(q)) {
        results.push({ ...a, resultTitle: `${a.studentName} - ${a.program}`, resultSubtitle: `Application • ${a.status}`, resultType: 'Application' });
      }
    });
    calls.forEach(c => {
      if (c.student?.toLowerCase().includes(q) || c.mobile?.includes(q)) {
        results.push({ ...c, resultTitle: `Call with ${c.student}`, resultSubtitle: `Activity • ${c.date} ${c.time}`, resultType: 'Call' });
      }
    });

    return results.slice(0, 10);
  };
  const searchResults = getSearchResults();

  // Global search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated('Updated Just Now');
      setIsRefreshing(false);
      showToast('Activity Metrics refreshed.');
    }, 1000);
  };

  const handleSave = () => {
    localStorage.setItem('fortivex_activity_metrics_prefs', JSON.stringify({
      activeTab, filters, dateFilter
    }));
    showToast('Activity Metrics saved successfully.');
  };

  const handleExport = (type: string) => {
    setShowExportMenu(false);
    showToast(`Downloading ${type}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedActivities.length) setSelectedRows([]);
    else setSelectedRows(paginatedActivities.map(a => a.id));
  };

  const handleRowAction = (action: string, record: any) => {
    if (action === 'Refresh Record') {
      showToast(`Record ${record.id} refreshed successfully.`);
      return;
    }
    if (action === 'Download PDF' || action === 'Export Excel' || action === 'Print') {
      showToast(`${action} triggered for ${record.id}`);
      return;
    }
    setActiveModal({ type: action, data: record });
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    // Category Tabs Filter
    if (activeTab === 'Calls') filtered = filtered.filter(a => a.type === 'Calls');
    else if (activeTab === 'Unique Calls') filtered = filtered.filter(a => a.type === 'Unique Calls');
    else if (activeTab === 'Calls (Detailed)') filtered = filtered.filter(a => a.type === 'Calls (Detailed)');
    else if (activeTab === 'Tasks') filtered = filtered.filter(a => a.type === 'Tasks');
    
    // Drawer Filters
    if (filters.status !== 'All') filtered = filtered.filter(a => a.status === filters.status);
    if (filters.team !== 'All') filtered = filtered.filter(a => a.team === filters.team);
    if (filters.department !== 'All') filtered = filtered.filter(a => a.department === filters.department);
    if (filters.activityType !== 'All') filtered = filtered.filter(a => a.type === filters.activityType);
    if (filters.employee !== 'All') filtered = filtered.filter(a => a.employeeName === filters.employee);

    // Date Filter Logic
    const parseDate = (dStr: string) => new Date(dStr).getTime();
    const todayTime = parseDate(d(0));
    
    if (dateFilter === 'Today') {
      filtered = filtered.filter(a => a.date === d(0));
    } else if (dateFilter === 'Yesterday') {
      filtered = filtered.filter(a => a.date === d(1));
    } else if (dateFilter === 'Last 7 Days') {
      const past = parseDate(d(7));
      filtered = filtered.filter(a => parseDate(a.date) >= past && parseDate(a.date) <= todayTime);
    } else if (dateFilter === 'Last 30 Days') {
      const past = parseDate(d(30));
      filtered = filtered.filter(a => parseDate(a.date) >= past && parseDate(a.date) <= todayTime);
    } else if (dateFilter === 'This Month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
      filtered = filtered.filter(a => parseDate(a.date) >= startOfMonth && parseDate(a.date) <= todayTime);
    } else if (dateFilter === 'Last Month') {
      const startOfLast = new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime();
      const endOfLast = new Date(today.getFullYear(), today.getMonth(), 0).getTime();
      filtered = filtered.filter(a => parseDate(a.date) >= startOfLast && parseDate(a.date) <= endOfLast);
    } else if (dateFilter.includes('to') && customDateRange) {
      // Custom Range
      const start = parseDate(customDateRange.start);
      const end = parseDate(customDateRange.end);
      filtered = filtered.filter(a => parseDate(a.date) >= start && parseDate(a.date) <= end);
    }

    // Sorting
    filtered = [...filtered].sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  const filteredActivities = getFilteredActivities();
  const paginatedActivities = filteredActivities.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const kpiData = [
    { title: 'Total Records', value: filteredActivities.length, icon: Activity, color: '#3b82f6' },
    { title: 'Total Outgoing', value: filteredActivities.reduce((acc, curr) => acc + curr.outgoingCalls, 0), icon: PhoneCall, color: '#8b5cf6' },
    { title: 'Total Incoming', value: filteredActivities.reduce((acc, curr) => acc + curr.incomingCalls, 0), icon: Phone, color: '#f59e0b' },
    { title: 'Total Tasks', value: filteredActivities.reduce((acc, curr) => acc + curr.tasks, 0), icon: CheckSquare, color: '#10b981' },
  ];

  // Modals Submit Handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal && activeModal.type === 'Edit Record') {
      const updated = activities.map(a => a.id === activeModal.data.id ? activeModal.data : a);
      setActivities(updated);
      showToast('Record updated successfully');
      setActiveModal(null);
    }
  };

  return (
    <div style={{ marginTop: '24px', paddingBottom: '24px', position: 'relative' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <CheckCircle2 color="#10b981" size={20} />
            <span style={{ fontWeight: 500 }}>{toastMessage}</span>
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

      <AnimatePresence>
        {selectedSearchResult && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--glass-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {selectedSearchResult.resultType} Details
                </h3>
                <button onClick={() => setSelectedSearchResult(null)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.keys(selectedSearchResult).map(k => {
                  if (typeof selectedSearchResult[k] === 'object' || k.startsWith('result') || k === 'id') return null;
                  return (
                    <div key={k} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{String(selectedSearchResult[k] || '-')}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Modals */}
      <AnimatePresence>
        {activeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--glass-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {activeModal.type} - {activeModal.data.employeeName} ({activeModal.data.id})
                </h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              {activeModal.type === 'View Details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {Object.keys(activeModal.data).map(k => k !== 'numericDuration' && (
                    <div key={k} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{k.toUpperCase()}</span>
                      <span style={{ fontWeight: 500 }}>{activeModal.data[k] || '-'}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal.type === 'View Analytics' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Outgoing Calls</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{activeModal.data.outgoingCalls}</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Incoming Calls</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{activeModal.data.incomingCalls}</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tasks Completed</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{activeModal.data.tasks}</div>
                    </div>
                  </div>
                  <div style={{ height: '300px', background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Stats', outgoing: activeModal.data.outgoingCalls, incoming: activeModal.data.incomingCalls, tasks: activeModal.data.tasks }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="outgoing" fill="#3b82f6" />
                        <Bar dataKey="incoming" fill="#10b981" />
                        <Bar dataKey="tasks" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeModal.type === 'View Timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', marginTop: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Outgoing Call - {activeModal.data.callDetails}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>09:10 AM, {activeModal.data.date}</div>
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginTop: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Incoming Call</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>10:25 AM, {activeModal.data.date}</div>
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', marginTop: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Task Created</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>11:40 AM, {activeModal.data.date}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal.type === 'Edit Record' && (
                <form onSubmit={handleEditSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {['employeeName', 'team', 'department', 'outgoingCalls', 'incomingCalls', 'tasks', 'duration', 'status', 'date'].map(field => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'capitalize' }}>
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input 
                        type={field.includes('Calls') || field === 'tasks' ? 'number' : 'text'} 
                        value={activeModal.data[field] || ''} 
                        onChange={e => setActiveModal({ ...activeModal, data: { ...activeModal.data, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value } })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" className="secondary-btn" onClick={() => setActiveModal(null)} style={{ padding: '12px 24px' }}>Cancel</button>
                    <button type="submit" className="primary-btn" style={{ padding: '12px 24px' }}>Save Changes</button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Activity Metrics</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{lastUpdated}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="secondary-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              <Calendar size={16} /> {dateFilter} <ChevronDown size={16} />
            </button>
            {showDateDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                {dateOptions.map(opt => (
                  <button key={opt} onClick={() => { 
                    if (opt === 'Custom Range') {
                      setShowCustomDateModal(true);
                      setShowDateDropdown(false);
                    } else {
                      setDateFilter(opt); 
                      setShowDateDropdown(false); 
                      showToast(`Dashboard filtered for ${opt}`); 
                      setLastUpdated('Updated Just Now'); 
                    }
                  }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="secondary-btn" onClick={handleRefresh} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowExportMenu(!showExportMenu)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Download <ChevronDown size={14} />
            </button>
            {showExportMenu && (
              <div className="glass-panel" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '150px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <button className="dropdown-item hover-bg-secondary" style={{ padding: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '8px' }} onClick={() => handleExport('PDF')}><FileText size={16} /> PDF</button>
                <button className="dropdown-item hover-bg-secondary" style={{ padding: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '8px' }} onClick={() => handleExport('Excel')}><FileSpreadsheet size={16} /> Excel (.xlsx)</button>
                <button className="dropdown-item hover-bg-secondary" style={{ padding: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '8px' }} onClick={() => handleExport('CSV')}><Download size={16} /> CSV</button>
              </div>
            )}
          </div>
          
          <button className="secondary-btn" onClick={handlePrint} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Printer size={18} /> Print
          </button>
          <button className="primary-btn" onClick={handleSave} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px' }}>
            <Save size={18} /> Save
          </button>
        </div>
      </div>

      {/* Global Search & Filter Drawer Trigger */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <div 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                background: 'var(--bg-secondary)', borderRadius: '12px', 
                border: isSearchFocused ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                boxShadow: isSearchFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.2s', width: '100%'
              }}
            >
              <Search size={18} color="var(--text-secondary)" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search across CRM... (Ctrl + K)" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
            
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-panel"
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '400px', zIndex: 10000, maxHeight: '400px', overflowY: 'auto', padding: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', background: 'var(--bg-card)' }}
                >
                  {searchQuery.length <= 1 ? (
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Recent Searches</h4>
                      {['Rahul Sharma', 'Admissions 2024', 'Marketing ROI', 'Pending Tasks'].map(rs => (
                        <div key={rs} className="hover-bg-secondary" style={{ padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }} onMouseDown={() => setSearchQuery(rs)}>
                          <Clock size={14} color="var(--text-secondary)" /> {rs}
                        </div>
                      ))}
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '16px', marginBottom: '8px', letterSpacing: '0.05em' }}>Quick Links</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['New Leads', "Today's Tasks", 'Active Campaigns', 'Attendance Report'].map(ql => (
                          <span key={ql} style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>{ql}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Search Results</h4>
                      {searchResults.length > 0 ? searchResults.map((res: any, idx) => (
                        <div 
                          key={`${res.id}-${idx}`} 
                          className="hover-bg-secondary" 
                          style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', border: '1px solid transparent' }}
                          onMouseDown={() => { setSelectedSearchResult(res); setSearchQuery(''); setIsSearchFocused(false); }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.resultTitle}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{res.resultSubtitle}</div>
                        </div>
                      )) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No results found</div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <button 
          className="primary-btn"
          onClick={() => setShowFilterDrawer(true)} 
          style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 24px', borderRadius: '12px' }}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilterDrawer && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', zIndex: 99998 }} onClick={() => setShowFilterDrawer(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel"
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', zIndex: 99999, borderRadius: '0', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Advanced Filters</h3>
                <button onClick={() => setShowFilterDrawer(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <select 
                      value={value as string} 
                      onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                      <option value="All">All</option>
                      {key === 'status' && <><option value="Completed">Completed</option><option value="In Progress">In Progress</option></>}
                      {key === 'team' && <><option value="Sales Alpha">Sales Alpha</option><option value="Sales Beta">Sales Beta</option><option value="Support Beta">Support Beta</option><option value="Marketing">Marketing</option><option value="Customer Success">Customer Success</option></>}
                      {key === 'department' && <><option value="Sales">Sales</option><option value="Support">Support</option><option value="Marketing">Marketing</option></>}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" onClick={() => {
                  setFilters({ employee: 'All', team: 'All', department: 'All', callType: 'All', status: 'All', activityType: 'All', priority: 'All' });
                  showToast('Filters reset.');
                }} style={{ flex: 1 }}>Reset</button>
                <button className="primary-btn" onClick={() => { setShowFilterDrawer(false); showToast('Filters applied.'); }} style={{ flex: 1 }}>Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {kpiData.map((kpi, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${kpi.color}20`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{kpi.title}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
        {categoryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', borderRadius: '20px',
              background: activeTab === tab ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              border: activeTab === tab ? 'none' : '1px solid var(--glass-border)',
              fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity Table */}
      <div className="glass-panel" style={{ marginBottom: '24px', maxHeight: '500px', overflowY: 'visible', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '16px', width: '40px' }}>
                <button onClick={toggleSelectAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  {selectedRows.length === paginatedActivities.length && paginatedActivities.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              {['employeeName', 'team', 'outgoingCalls', 'incomingCalls', 'duration', 'avgDuration', 'status', 'date'].map((col) => (
                <th key={col} style={{ padding: '16px', cursor: 'pointer', textTransform: 'capitalize' }} onClick={() => handleSort(col)}>
                  {col.replace(/([A-Z])/g, ' $1').trim()} {sortField === col ? (sortAsc ? '↑' : '↓') : ''}
                </th>
              ))}
              <th style={{ padding: '16px', width: '100px', textAlign: 'center' }}>Details</th>
              <th style={{ padding: '16px', width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((act) => (
              <tr key={act.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.includes(act.id) ? 'var(--bg-hover)' : 'transparent' }} className="hover-bg-secondary">
                <td style={{ padding: '16px' }}>
                  <button onClick={() => {
                    if (selectedRows.includes(act.id)) setSelectedRows(selectedRows.filter(r => r !== act.id));
                    else setSelectedRows([...selectedRows, act.id]);
                  }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    {selectedRows.includes(act.id) ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} color="var(--text-secondary)" />}
                  </button>
                </td>
                <td style={{ padding: '16px', fontWeight: 500 }}>
                  <div>{act.employeeName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{act.id}</div>
                </td>
                <td style={{ padding: '16px' }}>{act.team}</td>
                <td style={{ padding: '16px' }}>{act.outgoingCalls}</td>
                <td style={{ padding: '16px' }}>{act.incomingCalls}</td>
                <td style={{ padding: '16px' }}>{act.duration}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{act.avgDuration}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem',
                    background: act.status === 'Completed' ? '#10b98120' : '#f59e0b20',
                    color: act.status === 'Completed' ? '#10b981' : '#f59e0b',
                  }}>
                    {act.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{act.date}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button className="secondary-btn" onClick={() => handleRowAction('View Details', act)} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Details</button>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <ActivityTableRowMenu onAction={(action) => handleRowAction(action, act)} />
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={11} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No matching records found for "{activeTab}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredActivities.length)} of {filteredActivities.length} entries
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="secondary-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <button className="secondary-btn" onClick={() => setPage(p => p + 1)} disabled={page * rowsPerPage >= filteredActivities.length}>Next</button>
        </div>
      </div>

    </div>
  );
}
