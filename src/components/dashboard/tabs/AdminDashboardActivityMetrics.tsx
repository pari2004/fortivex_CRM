'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Save, Download, Printer, MoreVertical, ChevronDown } from 'lucide-react';
import { ActionMenu } from '@/components/common/ActionMenu';
import { ActivityMetricsDetailsModal } from '../modals/ActivityMetricsDetailsModal';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

const generateDemoMetrics = () => {
  const data = [];
  const names = ['Sarah Miller', 'John Doe', 'Jane Smith', 'David Chen', 'Alex Wong', 'Rahul Sharma', 'Sneha Reddy', 'Priya Sharma', 'Arjun Kumar', 'Kiran Patel'];
  const teams = ['Sales', 'Support', 'Admissions', 'Marketing'];
  
  for (let i = 0; i < 50; i++) {
    data.push({
      id: `AM-${1000 + i}`,
      employeeName: names[Math.floor(Math.random() * names.length)] + (i > 9 ? ` ${i}` : ''),
      outgoingCalls: Math.floor(Math.random() * 150),
      incomingCalls: Math.floor(Math.random() * 80),
      callDurationOutgoing: `${Math.floor(Math.random() * 5)}h ${Math.floor(Math.random() * 60)}m`,
      callDurationIncoming: `${Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
      averageCallDuration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 60)}s`,
      totalTasks: Math.floor(Math.random() * 50) + 10,
      completedTasks: Math.floor(Math.random() * 40) + 5,
      pendingTasks: Math.floor(Math.random() * 10),
      totalDeals: Math.floor(Math.random() * 20),
      wonDeals: Math.floor(Math.random() * 10),
      lostDeals: Math.floor(Math.random() * 5),
      otherActivities: Math.floor(Math.random() * 30),
      activeUsers: Math.floor(Math.random() * 100),
      team: teams[Math.floor(Math.random() * teams.length)],
      performance: Math.floor(Math.random() * 40) + 60, // 60-100%
      lastUpdated: 'Just now'
    });
  }
  return data;
};

const filterTabs = ['All', 'Calls', 'Unique Calls', 'Calls (Detailed)', 'Tasks', 'Deals', 'Others', 'Users', 'Teams'];
const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];

export function AdminDashboardActivityMetrics() {
  const [metrics, setMetrics] = useState(generateDemoMetrics());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [dateFilter, setDateFilter] = useState('Today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just Now');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setMetrics(generateDemoMetrics());
    setLastUpdated('Just Now');
    showToast('Data refreshed');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(prev => {
        if (prev === 'Just Now') return 'Updated 1 minute ago';
        if (prev.includes('minute')) {
          const num = parseInt(prev.split(' ')[1]) + 1;
          return `Updated ${num} minutes ago`;
        }
        return prev;
      });
    }, 60000);
    
  const filteredMetrics = metrics.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Minimal logic for the filter tabs
    let matchesTab = true;
    if (activeFilter === 'Calls') matchesTab = m.outgoingCalls > 0 || m.incomingCalls > 0;
    if (activeFilter === 'Tasks') matchesTab = m.totalTasks > 0;
    if (activeFilter === 'Deals') matchesTab = m.totalDeals > 0;
    
    return matchesSearch && matchesTab;
  });

  return () => clearInterval(timer);
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).filter(k => k !== 'id');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${String(row[h]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleAction = (action: string, record: any) => {
    setActiveMenuId(null);
    if (action === 'details') {
      setSelectedRecord(record);
    } else if (action === 'timeline') {
      showToast(`Viewing timeline for ${record.employeeName}`);
    } else if (action === 'edit') {
      setEditingRecord(record);
    } else if (action === 'pdf' || action === 'print') {
      window.print();
    } else if (action === 'excel') {
      exportToCSV([record], `Activity_${record.employeeName.replace(/\s+/g, '_')}.csv`);
    } else if (action === 'assign') {
      showToast(`Opened Task Assignment for ${record.employeeName}`);
    } else if (action === 'refresh') {
      setMetrics(metrics.map(m => m.id === record.id ? { ...m, outgoingCalls: m.outgoingCalls + 1, lastUpdated: 'Just now' } : m));
      showToast('Record refreshed');
    } else {
      showToast(`${action} triggered for ${record.employeeName}`);
    }
  };

  const handleCellClick = (type: string, record: any) => {
    showToast(`Opening ${type} for ${record.employeeName}`);
  };


  useGlobalEscape(!!activeMenuId, () => { setActiveMenuId(null) });
  useGlobalEscape(showFilterDropdown, () => { setShowFilterDropdown(false) });
  useGlobalEscape(!!editingRecord, () => { setEditingRecord(null) });
  
  const filteredMetrics = metrics.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Minimal logic for the filter tabs
    let matchesTab = true;
    if (activeFilter === 'Calls') matchesTab = m.outgoingCalls > 0 || m.incomingCalls > 0;
    if (activeFilter === 'Tasks') matchesTab = m.totalTasks > 0;
    if (activeFilter === 'Deals') matchesTab = m.totalDeals > 0;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', marginTop: '24px' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
        </div>
      )}

      {/* TOP TOOLBAR */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search across Leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input" 
              style={{ paddingLeft: '44px', paddingRight: '16px', width: '280px', borderRadius: '12px', border: '1px solid var(--glass-border)', height: '40px', background: 'transparent' }} 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="secondary-btn" 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', height: '40px', borderRadius: '12px' }}
            >
              <Filter size={16}/> Filter
            </button>
            {showFilterDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 50, padding: '16px', minWidth: '220px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Filter Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <input type="checkbox" onChange={(e) => e.target.checked ? setSearchQuery('Sales') : setSearchQuery('')} checked={searchQuery === 'Sales'} />
                    Sales Team Only
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <input type="checkbox" onChange={(e) => e.target.checked ? setActiveFilter('Deals') : setActiveFilter('All')} checked={activeFilter === 'Deals'} />
                    With Active Deals
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                  <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); setShowFilterDropdown(false); }} style={{ padding: '4px 8px', fontSize: '0.8rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>Clear</button>
                  <button onClick={() => setShowFilterDropdown(false)} style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
                </div>
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="secondary-btn" 
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', height: '40px', borderRadius: '12px' }}
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              {dateFilter} <ChevronDown size={16}/>
            </button>
            {showDateDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                {dateOptions.map(opt => (
                  <button key={opt} onClick={() => { setDateFilter(opt); setShowDateDropdown(false); handleRefresh(); }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lastUpdated}</span>
          <button onClick={handleRefresh} className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Refresh"><RefreshCw size={16}/></button>
          <button onClick={() => showToast('Saved')} className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Save"><Save size={16}/></button>
          <button onClick={() => { exportToCSV(filteredMetrics, 'Activity_Metrics.csv'); showToast('Exported Successfully'); }} className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Export"><Download size={16}/></button>
          <button onClick={() => window.print()} className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Print"><Printer size={16}/></button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="glass-panel" style={{ padding: '8px 24px', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveFilter(tab); handleRefresh(); }}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeFilter === tab ? 'var(--primary-color)' : 'transparent',
              color: activeFilter === tab ? 'white' : 'var(--text-secondary)',
              borderRadius: '20px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* DATA TABLE */}
      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10, color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Employee Name</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Team</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Outgoing Calls</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Incoming Calls</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Duration (Out)</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Avg Duration</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Tasks (C/T)</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Deals (W/T)</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Performance</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500, cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => handleCellClick('Employee', row)}>{row.employeeName}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Team', row)}><span style={{ padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: '16px', fontSize: '0.8rem' }}>{row.team}</span></td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Outgoing Calls', row)}>{row.outgoingCalls}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Incoming Calls', row)}>{row.incomingCalls}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Call Analytics', row)}>{row.callDurationOutgoing}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Call Analytics', row)}>{row.averageCallDuration}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Tasks', row)}>{row.completedTasks} / {row.totalTasks}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Deals', row)}>{row.wonDeals} / {row.totalDeals}</td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleCellClick('Performance', row)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.performance}%`, height: '100%', background: row.performance >= 80 ? '#10b981' : row.performance >= 60 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{row.performance}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <ActionMenu 
                      isOpen={activeMenuId === row.id}
                      onToggle={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        { label: 'View Details', onClick: () => handleAction('details', row) },
                        { label: 'View Analytics', onClick: () => handleAction('analytics', row) },
                        { label: 'Edit Record', onClick: () => handleAction('edit', row) },
                        { divider: true, label: '' },
                        { label: 'Download PDF', onClick: () => handleAction('pdf', row) },
                        { label: 'Export Excel', onClick: () => handleAction('excel', row) },
                        { label: 'Print', onClick: () => handleAction('print', row) },
                        { divider: true, label: '' },
                        { label: 'View Timeline', onClick: () => handleAction('timeline', row) },
                        { label: 'Assign Task', onClick: () => handleAction('assign', row) },
                        { label: 'Refresh Record', onClick: () => handleAction('refresh', row) }
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedRecord && <ActivityMetricsDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}

      {editingRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditingRecord(null)}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', width: '400px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Edit Activity Record</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Employee Name</label>
                <input type="text" defaultValue={editingRecord.employeeName} className="glass-input" style={{ width: '100%', padding: '8px', borderRadius: '6px' }} readOnly />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Outgoing Calls</label>
                <input type="number" id="edit-calls" defaultValue={editingRecord.outgoingCalls} className="glass-input" style={{ width: '100%', padding: '8px', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button className="secondary-btn" onClick={() => setEditingRecord(null)} style={{ padding: '8px 16px' }}>Cancel</button>
                <button 
                  onClick={() => {
                    const newCalls = parseInt((document.getElementById('edit-calls') as HTMLInputElement).value || '0', 10);
                    setMetrics(metrics.map(m => m.id === editingRecord.id ? { ...m, outgoingCalls: newCalls, lastUpdated: 'Just now' } : m));
                    setEditingRecord(null);
                    showToast('Record updated successfully');
                  }} 
                  style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
