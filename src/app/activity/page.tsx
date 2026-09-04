'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { generatedLeads } from '@/lib/data/mockData';
import { Activity as ActivityIcon, Search, Filter, Plus, CheckSquare, Square, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const crmUsers = ['Thanushree B R', 'Pavan S H', 'Parikshit', 'Padmesh', 'Abhishek', 'Yashwanth', 'Spoorthi'];

const generateActivities = () => {
  const activityTypes = ['Office Visit', 'Campus Visit', 'Counselling Visit', 'Demo Visit', 'Follow-up Visit'];
  const categories = ['Admission', 'Counselling', 'Course Demo', 'Follow-up', 'Enrollment'];
  const descriptions = [
    'Discussed course curriculum and fees.',
    'Walked through the campus facilities.',
    'Attended a free demo session for full stack.',
    'Follow-up meeting to finalize admission.',
    'Parents inquired about placement assistance.'
  ];
  
  return generatedLeads.slice(0, 30).map((lead, i) => {
    return {
      id: `ACT-${1000 + i}`,
      fullLead: lead,
      leadName: lead.name,
      avatarText: lead.name.substring(0, 2).toUpperCase(),
      activityTime: lead.lastContact || '2026-08-24T10:30:00Z',
      activityType: activityTypes[i % activityTypes.length],
      category: categories[i % categories.length],
      description: descriptions[i % descriptions.length],
      activityBy: crmUsers[i % crmUsers.length],
      allocatedTeam: 'FA Sales Team'
    };
  });
};

type SortKey = 'leadName' | 'activityTime' | 'activityType' | 'category' | 'activityBy' | 'allocatedTeam';

export default function ActivityTableViewPage() {
  const [activities] = useState(generateActivities());
  
  // Filters
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('All');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('All');

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>('activityTime');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Selection & Modals
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);

  // Column Resizing
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    checkbox: 40,
    'Lead Name': 250,
    'Activity Time': 160,
    'Activity Type': 150,
    'Category': 140,
    'Description': 280,
    'Activity By': 160,
    'Allocated Team': 140
  });
  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const onMouseDown = (e: React.MouseEvent, colLabel: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingCol.current = colLabel;
    startX.current = e.pageX;
    startWidth.current = colWidths[colLabel] || 150;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingCol.current) return;
    const diff = e.pageX - startX.current;
    const newWidth = Math.max(60, startWidth.current + diff); 
    setColWidths(prev => ({ ...prev, [resizingCol.current as string]: newWidth }));
  }, []);

  const onMouseUp = useCallback(() => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let list = activities;
    
    if (activeFilter === 'My') {
      list = list.filter(a => a.activityBy === 'Pavan S H');
    }
    
    if (selectedUserFilter !== 'All') {
      list = list.filter(a => a.activityBy === selectedUserFilter);
    }
    if (selectedTeamFilter !== 'All') {
      list = list.filter(a => a.allocatedTeam === selectedTeamFilter);
    }
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(a => 
        a.leadName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.activityType.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      const valA = String(a[sortKey] || '').toLowerCase();
      const valB = String(b[sortKey] || '').toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [activities, activeFilter, searchTerm, selectedUserFilter, selectedTeamFilter, sortKey, sortDir]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    userSelect: 'none' as const,
  };

  const tdStyle = {
    padding: '16px',
    fontSize: '0.85rem',
    color: '#475569',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={14} style={{ marginLeft: '4px', opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={14} style={{ marginLeft: '4px', color: '#4f46e5' }} /> : <ChevronDown size={14} style={{ marginLeft: '4px', color: '#4f46e5' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f5f9', padding: '24px' }}>
      
      {/* Header Area */}
      <div style={{ padding: '24px', background: 'white', borderBottom: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', zIndex: 9998 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
            <ActivityIcon size={24} />
          </div>
          Active Table View
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
              <button 
                onClick={() => setActiveFilter('My')}
                style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, background: activeFilter === 'My' ? 'white' : 'transparent', color: activeFilter === 'My' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                My
              </button>
              <button 
                onClick={() => setActiveFilter('All')}
                style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, background: activeFilter === 'All' ? 'white' : 'transparent', color: activeFilter === 'All' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                All
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#475569', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
              >
                <Filter size={16} />
                Filter
                {(selectedUserFilter !== 'All' || selectedTeamFilter !== 'All') && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                )}
              </button>
              <AnimatePresence>
                {isFilterPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999 }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Select User</label>
                      <select 
                        value={selectedUserFilter}
                        onChange={(e) => setSelectedUserFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
                      >
                        <option value="All">All Users</option>
                        {crmUsers.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Select Team</label>
                      <select 
                        value={selectedTeamFilter}
                        onChange={(e) => setSelectedTeamFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
                      >
                        <option value="All">All Teams</option>
                        <option value="FA Sales Team">FA Sales Team</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => { setSelectedUserFilter('All'); setSelectedTeamFilter('All'); }}
                      style={{ width: '100%', padding: '8px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', width: '250px' }}>
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', padding: '4px 8px', fontSize: '0.85rem', color: '#0f172a', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        
        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div style={{ background: '#e0e7ff', padding: '12px 24px', borderBottom: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 600, color: '#3730a3', fontSize: '0.9rem' }}>{selectedIds.size} Selected</span>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', width: `${colWidths.checkbox}px`, position: 'relative' }}>
                  <div onClick={toggleSelectAll} style={{ cursor: 'pointer', color: selectedIds.size === filtered.length && filtered.length > 0 ? '#4f46e5' : '#cbd5e1' }}>
                    {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </th>
                {([
                  { label: 'Lead Name', key: 'leadName' },
                  { label: 'Activity Time', key: 'activityTime' },
                  { label: 'Activity Type', key: 'activityType' },
                  { label: 'Category', key: 'category' },
                  { label: 'Description', key: null },
                  { label: 'Activity By', key: 'activityBy' },
                  { label: 'Allocated Team', key: 'allocatedTeam' },
                ] as { label: string; key: SortKey | null }[]).map(col => (
                  <th key={col.label} style={{ ...thStyle, width: `${colWidths[col.label]}px`, position: 'relative' }}>
                    <div onClick={() => col.key && handleSort(col.key)} style={{ display: 'flex', alignItems: 'center', cursor: col.key ? 'pointer' : 'default', width: '100%', height: '100%' }}>
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </div>
                    <div 
                      onMouseDown={(e) => onMouseDown(e, col.label)}
                      style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity) => (
                <tr 
                  key={activity.id}
                  onMouseEnter={() => setHoveredRowId(activity.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(activity.id) ? '#f5f7ff' : hoveredRowId === activity.id ? '#f8fafc' : 'white', transition: 'background 0.2s' }}
                >
                  <td style={{ ...tdStyle }}>
                    <div onClick={() => toggleSelect(activity.id)} style={{ cursor: 'pointer', color: selectedIds.has(activity.id) ? '#4f46e5' : '#cbd5e1' }}>
                      {selectedIds.has(activity.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ ...tdStyle }}>
                    <HoverableLeadName 
                      leadName={activity.leadName} 
                      avatarText={activity.avatarText}
                      hoveredRowId={hoveredRowId}
                      rowId={activity.id}
                      onViewClick={() => setSelectedLeadForWorkspace(activity.fullLead)}
                    />
                  </td>
                  <td style={{ ...tdStyle }}>
                    <div style={{ fontWeight: 500 }}>
                      {new Date(activity.activityTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(activity.activityTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td style={{ ...tdStyle }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, background: '#f1f5f9', color: '#475569' }}>
                      {activity.activityType}
                    </span>
                  </td>
                  <td style={{ ...tdStyle }}>{activity.category}</td>
                  <td style={{ ...tdStyle }} title={activity.description}>{activity.description}</td>
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                        {activity.activityBy.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{activity.activityBy}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle }}>{activity.allocatedTeam}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Search size={32} color="#cbd5e1" />
                      <div>No records match the current filters.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLeadForWorkspace && (
        <LeadWorkspaceModal isOpen={!!selectedLeadForWorkspace} onClose={() => setSelectedLeadForWorkspace(null)} lead={selectedLeadForWorkspace} />
      )}
    </div>
  );
}
