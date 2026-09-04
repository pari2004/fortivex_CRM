'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Save, RefreshCw, PhoneCall, Phone, Briefcase, 
  CheckCircle2, Users, IndianRupee, Activity, Target, Download, FileSpreadsheet, 
  FileText, Printer, ChevronDown, CheckSquare, Square, X, Calendar, Clock, Edit2, SlidersHorizontal
} from 'lucide-react';
import { CustomDateRangeModal } from './modals/CustomDateRangeModal';
import { useCRM } from '@/contexts/CRMContext';

const categoryTabs = ['All', 'Calls', 'Calls (Detailed)', 'Unique Calls', 'Tasks', 'Deals', 'Others'];
const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Week', 'This Month', 'Custom Range'];

const today = new Date();
const parseDate = (dStr: string) => new Date(dStr).getTime();
const d = (daysAgo: number) => {
  const dt = new Date();
  dt.setDate(today.getDate() - daysAgo);
  return dt.toISOString().split('T')[0];
};

export function AdminActivityMetrics() {
  const { leads, students, applications, calls, tasks, deals, users } = useCRM();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Tabs & Dates & Filters
  const [activeTab, setActiveTab] = useState('Calls');
  const [dateFilter, setDateFilter] = useState('Today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string} | null>(null);
  
  const [groupingMode, setGroupingMode] = useState<'Users' | 'Teams'>('Users');
  
  // Header State
  const [lastUpdated, setLastUpdated] = useState('Updated Just Now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination & Sorting
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState('callsConnected');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Column Filters
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [colFilters, setColFilters] = useState<Record<string, { search: string, selected: string[], min?: number, max?: number }>>({});

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

  // Aggregation Logic
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
      const currentDay = today.getDay(); // 0 is Sunday
      const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is sunday
      startDate = new Date(today.setDate(diff)).getTime();
      endDate = todayTime;
    } else if (dateFilter === 'This Month') {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      endDate = todayTime;
    } else if (dateFilter.includes('to') && customDateRange) {
      startDate = parseDate(customDateRange.start);
      endDate = parseDate(customDateRange.end);
    }

    const isDateInRange = (dateStr: string) => {
      if (!dateStr) return false;
      // Some dates in mockData are ISO strings, some are YYYY-MM-DD
      const pt = parseDate(dateStr.split('T')[0]);
      return pt >= startDate && pt <= endDate;
    };

    const validCalls = calls.filter(c => isDateInRange(c.date));
    const validTasks = tasks.filter(t => isDateInRange(t.dueDate || t.createdDate));
    const validDeals = deals.filter(d => isDateInRange(d.closeDate));

    // Grouping
    const groups = new Map<string, any>();
    
    // Initialize groups
    if (groupingMode === 'Users') {
      users.forEach(u => {
        groups.set(u.name, { name: u.name, team: u.department || 'General', callsConnected: 0, disposed: 0, positiveOutcome: 0, negativeOutcome: 0, tasks: 0, deals: 0 });
      });
      // Handle cases where calls/tasks belong to users not in the users array
      validCalls.forEach(c => { if (!groups.has(c.counselor)) groups.set(c.counselor, { name: c.counselor, team: 'Unknown', callsConnected: 0, disposed: 0, positiveOutcome: 0, negativeOutcome: 0, tasks: 0, deals: 0 }); });
    } else {
      // Teams mode
      const defaultTeam = 'General';
      users.forEach(u => {
        const teamName = u.department || defaultTeam;
        if (!groups.has(teamName)) groups.set(teamName, { name: teamName, team: teamName, callsConnected: 0, disposed: 0, positiveOutcome: 0, negativeOutcome: 0, tasks: 0, deals: 0 });
      });
      validCalls.forEach(c => { 
        const u = users.find(user => user.name === c.counselor);
        const teamName = u?.department || 'Unknown';
        if (!groups.has(teamName)) groups.set(teamName, { name: teamName, team: teamName, callsConnected: 0, disposed: 0, positiveOutcome: 0, negativeOutcome: 0, tasks: 0, deals: 0 });
      });
    }

    // Process Calls
    validCalls.forEach(c => {
      const u = users.find(user => user.name === c.counselor);
      const key = groupingMode === 'Users' ? c.counselor : (u?.department || 'Unknown');
      if (!groups.has(key)) return;
      
      const g = groups.get(key);
      g.disposed += 1;
      
      // Outcome logic
      const out = (c.outcome || '').toLowerCase();
      if (out !== 'no answer' && out !== 'not reachable') {
        g.callsConnected += 1;
      }
      if (out === 'interested' || out === 'demo scheduled' || out === 'positive') {
        g.positiveOutcome += 1;
      }
      if (out === 'not interested' || out === 'negative' || out === 'invalid') {
        g.negativeOutcome += 1;
      }
    });

    // Process Tasks
    validTasks.forEach(t => {
      const u = users.find(user => user.name === t.owner || user.name === t.assignTo);
      const ownerName = t.owner || t.assignTo || 'Unknown';
      const key = groupingMode === 'Users' ? ownerName : (u?.department || 'Unknown');
      if (groups.has(key)) groups.get(key).tasks += 1;
    });
    
    // Process Deals
    validDeals.forEach(d => {
      const u = users.find(user => user.name === d.dealOwner);
      const key = groupingMode === 'Users' ? (d.dealOwner || 'Unknown') : (u?.department || 'Unknown');
      if (groups.has(key)) groups.get(key).deals += 1;
    });

    return Array.from(groups.values());
  };

  const aggregatedData = useMemo(() => getAggregatedData(), [calls, tasks, deals, users, dateFilter, customDateRange, groupingMode]);

  // Apply Column Filters
  const filteredData = useMemo(() => {
    let result = aggregatedData;
    
    Object.entries(colFilters).forEach(([col, filter]) => {
      if (filter.selected && filter.selected.length > 0) {
        result = result.filter(item => filter.selected.includes(String(item[col])));
      }
      if (filter.min !== undefined && filter.min !== null && !isNaN(filter.min)) {
        result = result.filter(item => Number(item[col]) >= filter.min!);
      }
      if (filter.max !== undefined && filter.max !== null && !isNaN(filter.max)) {
        result = result.filter(item => Number(item[col]) <= filter.max!);
      }
    });

    // Category Tabs Filter (simplified implementation for demo)
    if (activeTab === 'Tasks') result = result.filter(r => r.tasks > 0);
    else if (activeTab === 'Deals') result = result.filter(r => r.deals > 0);

    // Sorting
    result = [...result].sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [aggregatedData, colFilters, sortField, sortAsc, activeTab]);

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const totalCalls = filteredData.reduce((acc, curr) => acc + curr.disposed, 0);
  const totalConnected = filteredData.reduce((acc, curr) => acc + curr.callsConnected, 0);
  const totalPositive = filteredData.reduce((acc, curr) => acc + curr.positiveOutcome, 0);
  const totalNegative = filteredData.reduce((acc, curr) => acc + curr.negativeOutcome, 0);

  const kpiData = [
    { title: 'TOTAL CALLS', value: totalCalls, icon: PhoneCall, color: '#3b82f6' },
    { title: 'CONNECTED', value: totalConnected, icon: Phone, color: '#10b981' },
    { title: 'DISPOSED', value: totalCalls, icon: CheckCircle2, color: '#8b5cf6' },
    { title: 'POSITIVE', value: totalPositive, icon: Target, color: '#f59e0b' },
    { title: 'NEGATIVE', value: totalNegative, icon: X, color: '#ef4444' },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default to descending for numbers
    }
  };

  const columns = [
    { key: 'name', label: groupingMode === 'Users' ? 'Name' : 'Team Name', type: 'string' },
    { key: 'callsConnected', label: 'Calls Connected', type: 'number' },
    { key: 'disposed', label: 'Disposed', type: 'number' },
    { key: 'positiveOutcome', label: 'Positive Call Outcome', type: 'number' },
    { key: 'negativeOutcome', label: 'Negative Call Outcome', type: 'number' },
    { key: 'tasks', label: 'Tasks', type: 'number' },
    { key: 'deals', label: 'Deals', type: 'number' },
  ];

  // Column Filter Helpers
  const handleApplyFilter = (col: string, selected: string[], min?: number, max?: number) => {
    setColFilters(prev => ({
      ...prev,
      [col]: { ...prev[col], selected, min, max }
    }));
    setActiveFilterCol(null);
  };
  
  const handleClearFilter = (col: string) => {
    const newFilters = { ...colFilters };
    delete newFilters[col];
    setColFilters(newFilters);
    setActiveFilterCol(null);
  };

  const getUniqueValuesForCol = (col: string) => {
    return Array.from(new Set(aggregatedData.map(item => String(item[col])))).sort();
  };

  return (
    <div style={{ marginTop: '24px', paddingBottom: '24px', position: 'relative' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '12px' }}
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

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Activity Metrics</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{lastUpdated}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setGroupingMode('Users')}
              style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: groupingMode === 'Users' ? 'var(--primary-color)' : 'transparent', color: groupingMode === 'Users' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}
            >
              Users
            </button>
            <button 
              onClick={() => setGroupingMode('Teams')}
              style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: groupingMode === 'Teams' ? 'var(--primary-color)' : 'transparent', color: groupingMode === 'Teams' ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }}
            >
              Teams
            </button>
          </div>

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
          
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {kpiData.map((kpi, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${kpi.color}20`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.title}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{kpi.value.toLocaleString()}</div>
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
      <div className="glass-panel" style={{ marginBottom: '24px', maxHeight: '600px', overflowY: 'visible', overflowX: 'auto', position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              {columns.map((col) => (
                <th key={col.key} style={{ padding: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleSort(col.key)}>
                      {col.label} {sortField === col.key ? (sortAsc ? '↑' : '↓') : ''}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveFilterCol(activeFilterCol === col.key ? null : col.key); }}
                      style={{ background: colFilters[col.key] ? 'var(--primary-color)' : 'transparent', color: colFilters[col.key] ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Filter size={14} />
                    </button>
                  </div>
                  
                  {/* Inline Filter Popup */}
                  {activeFilterCol === col.key && (
                    <div style={{ position: 'absolute', top: '100%', left: '16px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 50, width: '250px', marginTop: '4px', fontWeight: 'normal', textTransform: 'none', color: 'var(--text-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Filter {col.label}</h4>
                        <button onClick={() => setActiveFilterCol(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
                      </div>
                      
                      {col.type === 'string' ? (
                        <div>
                          <input type="text" placeholder="Search..." style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-primary)', marginBottom: '12px' }} onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            const items = document.querySelectorAll(`.filter-item-${col.key}`);
                            items.forEach(item => {
                              const text = item.textContent?.toLowerCase() || '';
                              (item as HTMLElement).style.display = text.includes(val) ? 'flex' : 'none';
                            });
                          }} />
                          <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {getUniqueValuesForCol(col.key).map(val => (
                              <label key={val} className={`filter-item-${col.key}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" value={val} defaultChecked={colFilters[col.key]?.selected?.includes(val)} className={`chk-${col.key}`} />
                                {val}
                              </label>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="secondary-btn" style={{ flex: 1, padding: '6px' }} onClick={() => handleClearFilter(col.key)}>Clear</button>
                            <button className="primary-btn" style={{ flex: 1, padding: '6px' }} onClick={() => {
                              const checkboxes = document.querySelectorAll(`.chk-${col.key}:checked`);
                              const selected = Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
                              handleApplyFilter(col.key, selected);
                            }}>Apply</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Min</label>
                              <input type="number" id={`min-${col.key}`} defaultValue={colFilters[col.key]?.min} style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Max</label>
                              <input type="number" id={`max-${col.key}`} defaultValue={colFilters[col.key]?.max} style={{ width: '100%', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="secondary-btn" style={{ flex: 1, padding: '6px' }} onClick={() => handleClearFilter(col.key)}>Clear</button>
                            <button className="primary-btn" style={{ flex: 1, padding: '6px' }} onClick={() => {
                              const min = parseFloat((document.getElementById(`min-${col.key}`) as HTMLInputElement).value);
                              const max = parseFloat((document.getElementById(`max-${col.key}`) as HTMLInputElement).value);
                              handleApplyFilter(col.key, [], isNaN(min) ? undefined : min, isNaN(max) ? undefined : max);
                            }}>Apply</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }} className="hover-bg-secondary">
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '16px' }}>
                    {col.key === 'name' ? (
                      <span style={{ fontWeight: 500 }}>{row[col.key]}</span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No records found for the selected filters.
                </td>
              </tr>
            )}
            
            {/* Total Row */}
            {filteredData.length > 0 && (
              <tr style={{ background: 'var(--bg-secondary)', borderTop: '2px solid var(--glass-border)' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>TOTAL</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{filteredData.reduce((acc, curr) => acc + curr.callsConnected, 0).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{filteredData.reduce((acc, curr) => acc + curr.disposed, 0).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>{filteredData.reduce((acc, curr) => acc + curr.positiveOutcome, 0).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444' }}>{filteredData.reduce((acc, curr) => acc + curr.negativeOutcome, 0).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{filteredData.reduce((acc, curr) => acc + curr.tasks, 0).toLocaleString()}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{filteredData.reduce((acc, curr) => acc + curr.deals, 0).toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {filteredData.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} to {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="secondary-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <button className="secondary-btn" onClick={() => setPage(p => p + 1)} disabled={page * rowsPerPage >= filteredData.length}>Next</button>
        </div>
      </div>

    </div>
  );
}
