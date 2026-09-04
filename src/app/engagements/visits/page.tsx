'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { useInbox } from '@/contexts/InboxContext';
import { generatedLeads, activeUsersData } from '@/lib/data/mockData';
import { MapPin, Search, Filter, CheckSquare, Square, ChevronUp, ChevronDown, ChevronsUpDown, AlertCircle, Settings, GripVertical, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CURRENT_USER = 'Abhay';

// Generate realistic demo visits using generatedLeads
const generateVisits = () => {
  const visitTypes = ['Office Visit', 'Campus Visit', 'Counselling Visit', 'Demo Visit', 'Follow-up Visit'];
  const categories = ['Admission', 'Counselling', 'Course Demo', 'Follow-up', 'Enrollment'];
  const notes = [
    'Discussed course curriculum and fees.',
    'Walked through the campus facilities.',
    'Attended a free demo session for full stack.',
    'Follow-up meeting to finalize admission.',
    'Parents inquired about placement assistance.'
  ];
  const outcomes = ['Positive', 'Negative', null, 'Positive', 'Positive'];
  const locations = ['Bangalore HQ', 'Online', 'Chennai Campus', 'Bangalore HQ', 'Mumbai Branch'];
  
  // Use unique users from activeUsersData to ensure consistency with User Activity
  const crmUsers = ['Thanushree B R', 'Pavan S H', 'Parikshit', 'Padmesh', 'Abhishek', 'Yashwanth', 'Spoorthi'];
  
  return generatedLeads.slice(0, 30).map((lead, i) => {
    return {
      id: `VST-${1000 + i}`,
      fullLead: lead,
      leadName: lead.name,
      avatarText: lead.name.substring(0, 2).toUpperCase(),
      leadSource: lead.source || 'Website',
      visitOutcome: outcomes[i % outcomes.length],
      visitLocation: locations[i % locations.length],
      visitNote: notes[i % notes.length],
      activityTime: lead.lastContact || '2026-08-24T10:30:00Z',
      activityType: visitTypes[i % visitTypes.length],
      category: categories[i % categories.length],
      activityBy: crmUsers[i % crmUsers.length] || 'Rahul Sharma',
      allocatedTeam: 'FA Sales Team',
      hasNextStep: i % 3 === 0
    };
  });
};

const INITIAL_VISITS = generateVisits();

type SortKey = 'leadName' | 'leadSource' | 'visitOutcome' | 'visitLocation' | 'visitTime' | 'activityBy' | 'allocatedTeam' | 'activityType' | 'category';
type SortDir = 'asc' | 'desc';

const ALL_COLUMNS = [
  { id: 'leadName', label: 'Lead' },
  { id: 'leadSource', label: 'Lead Source' },
  { id: 'visitOutcome', label: 'Visit Outcome' },
  { id: 'activityBy', label: 'Visit By' },
  { id: 'visitLocation', label: 'Visit Location' },
  { id: 'visitNote', label: 'Visit Note' },
  { id: 'visitTime', label: 'Visit Time' },
  { id: 'allocatedTeam', label: 'Team' },
];

function SortIcon({ col, sortKey, sortDir }: { col: string; sortKey: string; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} style={{ color: '#cbd5e1', marginLeft: 3 }} />;
  return sortDir === 'asc' ? <ChevronUp size={13} style={{ color: '#db2777', marginLeft: 3 }} /> : <ChevronDown size={13} style={{ color: '#db2777', marginLeft: 3 }} />;
}

export default function VisitsPage() {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);
  const [visits] = useState(INITIAL_VISITS);
  const [search, setSearch] = useState('');
  
  // Quick Filters
  const [quickFilter, setQuickFilter] = useState<'All' | 'Positive' | 'Negative' | 'No Outcome' | 'Next Step'>('All');
  
  // My/All
  const [activeFilter, setActiveFilter] = useState<'My' | 'All'>('All');
  
  // Filters Panel
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterUser, setFilterUser] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting
  const [sortKey, setSortKey] = useState<string>('visitTime');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  
  // Columns
  const [isColumnPanelOpen, setIsColumnPanelOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>(ALL_COLUMNS.map(c => c.id));
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

  const availableUsers = Array.from(new Set(visits.map(v => v.activityBy)));
  const availableTeams = Array.from(new Set(visits.map(v => v.allocatedTeam)));

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(v => v.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = useMemo(() => {
    let list = visits.filter(v => {
      // Quick Filters
      if (quickFilter === 'Positive' && v.visitOutcome !== 'Positive') return false;
      if (quickFilter === 'Negative' && v.visitOutcome !== 'Negative') return false;
      if (quickFilter === 'No Outcome' && v.visitOutcome !== null) return false;
      if (quickFilter === 'Next Step' && !v.hasNextStep) return false;
      
      // My/All
      if (activeFilter === 'My' && v.activityBy !== CURRENT_USER) return false;
      
      // Panel Filters
      if (filterUser && v.activityBy !== filterUser) return false;
      if (filterTeam && v.allocatedTeam !== filterTeam) return false;
      
      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!(
          v.leadName.toLowerCase().includes(q) ||
          v.leadSource.toLowerCase().includes(q) ||
          v.activityBy.toLowerCase().includes(q)
        )) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a: any, b: any) => {
      let av = String(a[sortKey] || '');
      let bv = String(b[sortKey] || '');
      if (sortKey === 'visitTime') {
        av = String(a.activityTime || '');
        bv = String(b.activityTime || '');
      }
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return list;
  }, [visits, quickFilter, activeFilter, filterUser, filterTeam, search, sortKey, sortDir]);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  // Resizable Columns Logic
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    checkbox: 40,
    leadName: 280,
    leadSource: 130,
    visitOutcome: 140,
    activityBy: 160,
    visitLocation: 160,
    visitNote: 250,
    visitTime: 160,
    allocatedTeam: 140
  });

  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const onMouseDown = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingCol.current = colKey;
    startX.current = e.pageX;
    startWidth.current = colWidths[colKey] || 100;
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingCol.current) return;
    const diff = e.pageX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff); 
    setColWidths(prev => ({ ...prev, [resizingCol.current as string]: newWidth }));
  }, []);

  const onMouseUp = useCallback(() => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);
  
  // Drag and Drop handlers
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(columnOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setColumnOrder(items);
  };
  
  const resetColumns = () => {
    setColumnOrder(ALL_COLUMNS.map(c => c.id));
    setColumnVisibility(ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}));
  };

  const thStyle: React.CSSProperties = {
    padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px',
    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  };
  
  const getOutcomeStyle = (outcome: string | null) => {
    if (outcome === 'Positive') return { background: '#dcfce7', color: '#166534' };
    if (outcome === 'Negative') return { background: '#fee2e2', color: '#991b1b' };
    return { background: '#f1f5f9', color: '#64748b' };
  };

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ padding: '24px', background: 'white', borderBottom: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', zIndex: 9998 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={22} style={{ color: '#db2777' }} />
          Visits
        </h1>
        
        {/* Quick Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['All', 'Positive', 'Negative', 'No Outcome', 'Next Step'].map(filter => (
            <button
              key={filter}
              onClick={() => setQuickFilter(filter as any)}
              style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                background: quickFilter === filter ? '#3b82f6' : '#f1f5f9',
                color: quickFilter === filter ? 'white' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setActiveFilter('My')} style={{ padding: '6px 16px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', background: activeFilter === 'My' ? 'white' : 'transparent', color: activeFilter === 'My' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>My</button>
              <button onClick={() => setActiveFilter('All')} style={{ padding: '6px 16px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', background: activeFilter === 'All' ? 'white' : 'transparent', color: activeFilter === 'All' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>All</button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setIsFilterPanelOpen(!isFilterPanelOpen); setIsColumnPanelOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#475569', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
              >
                <Filter size={14} /> Filter
              </button>
              <AnimatePresence>
                {isFilterPanelOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                        <option value="">Select User</option>
                        {availableUsers.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                        <option value="">Select Team</option>
                        {availableTeams.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button onClick={() => { setFilterUser(''); setFilterTeam(''); }} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setIsColumnPanelOpen(!isColumnPanelOpen); setIsFilterPanelOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#475569', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
              >
                <Settings size={14} /> Customize Columns
              </button>
              <AnimatePresence>
                {isColumnPanelOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Columns</span>
                      <button onClick={() => setIsColumnPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
                    </div>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="columns">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                            {columnOrder.map((colId, index) => {
                              const colDef = ALL_COLUMNS.find(c => c.id === colId);
                              if (!colDef) return null;
                              return (
                                <Draggable key={colId} draggableId={colId} index={index}>
                                  {(provided) => (
                                    <div 
                                      ref={provided.innerRef} {...provided.draggableProps} 
                                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '6px', ...provided.draggableProps.style }}
                                    >
                                      <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#94a3b8' }}><GripVertical size={16} /></div>
                                      <input 
                                        type="checkbox" 
                                        checked={columnVisibility[colId]} 
                                        onChange={(e) => setColumnVisibility({ ...columnVisibility, [colId]: e.target.checked })} 
                                        style={{ cursor: 'pointer' }}
                                      />
                                      <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{colDef.label}</span>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                      <button onClick={resetColumns} style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Reset</button>
                      <button onClick={() => setIsColumnPanelOpen(false)} style={{ flex: 1, padding: '8px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Save</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '0.85rem' }} 
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ marginTop: '16px', background: '#e0e7ff', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #c7d2fe' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedIds.size}</div>
              <span style={{ fontWeight: 600, color: '#3730a3', fontSize: '0.9rem' }}>Visits Selected</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #c7d2fe', borderRadius: '6px', color: '#4f46e5', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Change Owner</button>
              <button style={{ padding: '6px 14px', background: 'white', border: '1px solid #c7d2fe', borderRadius: '6px', color: '#4f46e5', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Bulk Update</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', width: `${colWidths.checkbox}px`, position: 'relative' }}>
                  <div onClick={toggleSelectAll} style={{ cursor: 'pointer', color: selectedIds.size === filtered.length && filtered.length > 0 ? '#4f46e5' : '#cbd5e1' }}>
                    {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </th>
                {columnOrder.filter(c => columnVisibility[c]).map(colId => {
                  const colDef = ALL_COLUMNS.find(c => c.id === colId);
                  if (!colDef) return null;
                  return (
                    <th key={colDef.id} style={{ ...thStyle, width: `${colWidths[colDef.id]}px`, position: 'relative' }}>
                      <div onClick={() => colDef.id !== 'visitNote' && handleSort(colDef.id)} style={{ display: 'flex', alignItems: 'center', cursor: colDef.id !== 'visitNote' ? 'pointer' : 'default', width: '100%' }}>
                        {colDef.label}
                        {colDef.id !== 'visitNote' && <SortIcon col={colDef.id} sortKey={sortKey} sortDir={sortDir} />}
                      </div>
                      <div 
                        onMouseDown={(e) => onMouseDown(e, colDef.id)}
                        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.map((visit, i) => (
                <tr 
                  key={visit.id}
                  onMouseEnter={() => setHoveredRowId(visit.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #e2e8f0' : 'none', background: selectedIds.has(visit.id) ? '#f1f5f9' : hoveredRowId === visit.id ? '#f8fafc' : 'white', transition: 'background 0.15s' }}
                >
                  <td style={{ padding: '16px' }}>
                    <div onClick={() => toggleSelect(visit.id)} style={{ cursor: 'pointer', color: selectedIds.has(visit.id) ? '#4f46e5' : '#cbd5e1' }}>
                      {selectedIds.has(visit.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  {columnOrder.filter(c => columnVisibility[c]).map(colId => {
                    const tdStyle = { padding: '16px', fontSize: '0.85rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
                    
                    if (colId === 'leadName') return (
                      <td key={colId} style={tdStyle as any}>
                        <HoverableLeadName 
                          leadName={visit.leadName} leadId={visit.fullLead.id} phone={visit.fullLead.phone}
                          hoveredRowId={hoveredRowId} rowId={visit.id} onViewClick={() => setSelectedLeadForWorkspace(visit.fullLead)}
                          avatarText={visit.avatarText} onMoreClick={() => console.log('More actions')}
                        />
                      </td>
                    );
                    if (colId === 'leadSource') return <td key={colId} style={tdStyle as any}>{visit.leadSource}</td>;
                    if (colId === 'visitOutcome') return (
                      <td key={colId} style={tdStyle as any}>
                        {visit.visitOutcome ? (
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontWeight: 600, ...getOutcomeStyle(visit.visitOutcome) }}>
                            {visit.visitOutcome}
                          </span>
                        ) : <span style={{ color: '#94a3b8' }}>-</span>}
                      </td>
                    );
                    if (colId === 'activityBy') return (
                      <td key={colId} style={tdStyle as any}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', color: '#475569' }}>
                            {visit.activityBy.charAt(0)}
                          </div>
                          {visit.activityBy}
                        </div>
                      </td>
                    );
                    if (colId === 'visitLocation') return <td key={colId} style={tdStyle as any}>{visit.visitLocation}</td>;
                    if (colId === 'visitNote') return <td key={colId} style={{...tdStyle, maxWidth: '250px'} as any} title={visit.visitNote}>{visit.visitNote}</td>;
                    if (colId === 'visitTime') return <td key={colId} style={tdStyle as any}>{formatDate(visit.activityTime)}</td>;
                    if (colId === 'allocatedTeam') return <td key={colId} style={tdStyle as any}>{visit.allocatedTeam}</td>;
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <div>No visits match the current filters.</div>
            </div>
          )}
        </div>
      </div>

      {selectedLeadForWorkspace && (
        <LeadWorkspaceModal isOpen={!!selectedLeadForWorkspace} onClose={() => setSelectedLeadForWorkspace(null)} lead={selectedLeadForWorkspace} />
      )}
    </div>
  );
}
