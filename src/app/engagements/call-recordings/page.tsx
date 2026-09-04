'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { Search, Filter, Phone, Trash2, UserPlus, Tag, Headphones, PhoneOutgoing, PhoneIncoming, MessageSquare, Play, Pause, X, ChevronDown, ChevronRight, Settings, Eye } from 'lucide-react';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { useInbox } from '@/contexts/InboxContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';

// ALL AVAILABLE COLUMNS
const ALL_COLUMNS = [
  'Lead', 'Recording', 'AI Topic', 'Lead Source', 'Tags', 'Call With',
  'Call Through', 'Team', 'Call Outcome', 'Call Outcome Nature', 'Note',
  'Call Direction', 'Call Connected Status', 'Call Start Time', 'Duration',
  'Total Duration', 'Last Updated', 'Interested In', 'Current Company Type',
  'Experience Level', 'What are you looking for', 'Career Goal',
  'Enrollment Timeline', 'Technical Background'
];

const DEFAULT_COLUMNS = [
  'Lead', 'Recording', 'AI Topic', 'Lead Source', 'Tags', 'Call With'
];

export default function CallsPage() {
  const { systemUsers, leads, updateLead } = useCRM();
  const { openSharedInbox } = useInbox();
  const CURRENT_USER = 'Abhay';

  // Core State
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  // Custom Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Chips Filters
  const [chipPositive, setChipPositive] = useState(false);
  const [chipNegative, setChipNegative] = useState(false);
  const [chip30s, setChip30s] = useState(false);
  const [chipNoOutcome, setChipNoOutcome] = useState(false);
  const [recordingFilter, setRecordingFilter] = useState<'ALL'|'ON'|'OFF'>('ALL');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Columns & Resizing
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_calls_columns');
    if (saved) {
      try { setVisibleColumns(JSON.parse(saved)); } catch (e) {}
    }
    const savedWidths = localStorage.getItem('crm_calls_widths');
    if (savedWidths) {
      try { setColumnWidths(JSON.parse(savedWidths)); } catch (e) {}
    }
  }, []);

  const saveColumns = (cols: string[]) => {
    setVisibleColumns(cols);
    localStorage.setItem('crm_calls_columns', JSON.stringify(cols));
  };

  const handleMouseDown = (e: React.MouseEvent, col: string) => {
    resizingCol.current = col;
    startX.current = e.pageX;
    startWidth.current = columnWidths[col] || 150;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingCol.current) return;
    const diff = e.pageX - startX.current;
    const newWidth = Math.max(100, startWidth.current + diff);
    setColumnWidths(prev => {
      const next = { ...prev, [resizingCol.current!]: newWidth };
      localStorage.setItem('crm_calls_widths', JSON.stringify(next));
      return next;
    });
  };

  const handleMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Generate Dummy Data mapped to actual leads
  const callData = useMemo(() => {
    return leads.map((lead, i) => {
      const uCount = systemUsers?.length || 1;
      const assignedUser = systemUsers && systemUsers.length > 0 ? systemUsers[i % uCount].name : CURRENT_USER;
      
      const hasRecording = i % 3 !== 0;
      const outcome = i % 4 === 0 ? 'Positive' : i % 5 === 0 ? 'Negative' : i % 6 === 0 ? '' : 'Interested';
      const durationSeconds = hasRecording ? 15 + (i * 17) % 300 : 0;
      
      return {
        id: `call-${i}`,
        leadObj: lead,
        Lead: lead.name,
        Recording: hasRecording,
        'AI Topic': ['Pricing Inquiry', 'Syllabus Review', 'Batch Timings', 'General Info'][i % 4],
        'Lead Source': lead.source || 'Website',
        Tags: lead.tags || ['Follow Up'],
        'Call With': assignedUser,
        'Call Through': 'Internal Dialer',
        Team: lead.team || 'Sales Team',
        'Call Outcome': outcome,
        'Call Outcome Nature': outcome === 'Positive' ? 'Warm' : outcome === 'Negative' ? 'Cold' : 'Neutral',
        Note: `Discussed general requirements. Follow up next week.`,
        'Call Direction': i % 2 === 0 ? 'Outbound' : 'Inbound',
        'Call Connected Status': hasRecording ? 'Connected' : 'Missed',
        'Call Start Time': lead.lastActive || new Date().toISOString(),
        Duration: durationSeconds,
        'Total Duration': `${Math.floor(durationSeconds/60)}m ${durationSeconds%60}s`,
        'Last Updated': lead.lastActive || new Date().toISOString(),
        'Interested In': 'Data Science',
        'Current Company Type': 'IT Services',
        'Experience Level': '2-4 Years',
        'What are you looking for': 'Upskilling',
        'Career Goal': 'Data Scientist',
        'Enrollment Timeline': '1 Month',
        'Technical Background': 'Yes'
      };
    });
  }, [leads, systemUsers]);

  const filteredData = useMemo(() => {
    return callData.filter(c => {
      // Basic My/All
      if (activeFilter === 'My' && c['Call With'] !== CURRENT_USER) return false;
      
      // Custom Filters
      if (selectedUser && c['Call With'] !== selectedUser) return false;
      if (selectedTeam && c.Team !== selectedTeam) return false;

      // Chip Filters
      if (chipPositive && c['Call Outcome'] !== 'Positive') return false;
      if (chipNegative && c['Call Outcome'] !== 'Negative') return false;
      if (chip30s && c.Duration <= 30) return false;
      if (chipNoOutcome && c['Call Outcome'] !== '') return false;
      
      if (recordingFilter === 'ON' && !c.Recording) return false;
      if (recordingFilter === 'OFF' && c.Recording) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!c.Lead.toLowerCase().includes(query) && 
            !c['AI Topic'].toLowerCase().includes(query) &&
            !c['Call Outcome'].toLowerCase().includes(query) &&
            !c['Call With'].toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [callData, activeFilter, selectedUser, selectedTeam, chipPositive, chipNegative, chip30s, chipNoOutcome, recordingFilter, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredData.map(d => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Audio Playback
  const togglePlay = (id: string, durationSecs: number) => {
    if (playingId === id) {
      setPlayingId(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingId(id);
      setAudioProgress(0);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Mock play if no real audio
          let prog = 0;
          const interval = setInterval(() => {
            prog += 1;
            setAudioProgress(Math.min((prog / durationSecs) * 100, 100));
            if (prog >= durationSecs) {
              clearInterval(interval);
              setPlayingId(null);
            }
          }, 1000);
          audioRef.current = { interval } as any;
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current && (audioRef.current as any).interval) {
        clearInterval((audioRef.current as any).interval);
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      
      {/* Header Area */}
      <div style={{ padding: '24px 24px 16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Top Row: Title, Search, Customize Columns */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Calls</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search calls..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '260px', padding: '10px 12px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setIsCustomizeOpen(!isCustomizeOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Settings size={16} /> Customize Columns
              </button>
              
              {isCustomizeOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '20px', width: '320px', zIndex: 60, maxHeight: '400px', overflowY: 'auto' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>Visible Columns</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ALL_COLUMNS.map(col => (
                      <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.includes(col)}
                          onChange={(e) => {
                            if (e.target.checked) saveColumns([...visibleColumns, col]);
                            else saveColumns(visibleColumns.filter(c => c !== col));
                          }}
                          style={{ accentColor: '#4f46e5', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        {col}
                      </label>
                    ))}
                  </div>
                  <button onClick={() => saveColumns(DEFAULT_COLUMNS)} style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Reset to Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: My/All, Filter, Chips, Recording */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => setActiveFilter('My')}
              style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: activeFilter === 'My' ? 'white' : 'transparent', color: activeFilter === 'My' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              My
            </button>
            <button 
              onClick={() => setActiveFilter('All')}
              style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: activeFilter === 'All' ? 'white' : 'transparent', color: activeFilter === 'All' ? '#0f172a' : '#64748b', boxShadow: activeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              All
            </button>
          </div>

          <div style={{ width: '1px', height: '24px', background: '#cbd5e1' }} />

          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: isFilterOpen ? '#f8fafc' : 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              <Filter size={16} /> Filter <ChevronDown size={14} color="#94a3b8" />
            </button>
            {isFilterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '20px', width: '280px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>User</label>
                  <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', background: 'white' }}>
                    <option value="">All Users</option>
                    {systemUsers?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Team</label>
                  <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', background: 'white' }}>
                    <option value="">All Teams</option>
                    <option value="Sales Team">Sales Team</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setChipPositive(!chipPositive)} style={{ padding: '8px 16px', border: chipPositive ? '1px solid #22c55e' : '1px solid #e2e8f0', background: chipPositive ? '#dcfce7' : 'white', color: chipPositive ? '#166534' : '#475569', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Positive</button>
            <button onClick={() => setChipNegative(!chipNegative)} style={{ padding: '8px 16px', border: chipNegative ? '1px solid #ef4444' : '1px solid #e2e8f0', background: chipNegative ? '#fee2e2' : 'white', color: chipNegative ? '#991b1b' : '#475569', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Negative</button>
            <button onClick={() => setChip30s(!chip30s)} style={{ padding: '8px 16px', border: chip30s ? '1px solid #4f46e5' : '1px solid #e2e8f0', background: chip30s ? '#e0e7ff' : 'white', color: chip30s ? '#3730a3' : '#475569', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>&gt; 30s Talk</button>
            <button onClick={() => setChipNoOutcome(!chipNoOutcome)} style={{ padding: '8px 16px', border: chipNoOutcome ? '1px solid #f59e0b' : '1px solid #e2e8f0', background: chipNoOutcome ? '#fef3c7' : 'white', color: chipNoOutcome ? '#b45309' : '#475569', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>No Outcome</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', paddingLeft: '4px' }}>Recording</span>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
              <button onClick={() => setRecordingFilter('ALL')} style={{ padding: '4px 10px', border: 'none', background: recordingFilter === 'ALL' ? 'white' : 'transparent', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: recordingFilter === 'ALL' ? '#0f172a' : '#64748b', cursor: 'pointer', boxShadow: recordingFilter === 'ALL' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>ALL</button>
              <button onClick={() => setRecordingFilter('ON')} style={{ padding: '4px 10px', border: 'none', background: recordingFilter === 'ON' ? 'white' : 'transparent', color: recordingFilter === 'ON' ? '#166534' : '#64748b', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', boxShadow: recordingFilter === 'ON' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>ON</button>
              <button onClick={() => setRecordingFilter('OFF')} style={{ padding: '4px 10px', border: 'none', background: recordingFilter === 'OFF' ? 'white' : 'transparent', color: recordingFilter === 'OFF' ? '#991b1b' : '#64748b', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', boxShadow: recordingFilter === 'OFF' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>OFF</button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Table Area */}
      <div style={{ flex: 1, padding: '24px', overflow: 'hidden', position: 'relative' }}>
        
        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '24px', zIndex: 50, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{selectedIds.size} Calls Selected</div>
              <div style={{ width: '1px', height: '24px', background: '#334155' }} />
              <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><MessageSquare size={16} /> Modify Outcome</button>
              <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><UserPlus size={16} /> Assign {selectedIds.size} Leads</button>
              <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Tag size={16} /> Tag {selectedIds.size}</button>
              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Trash2 size={16} /> Delete {selectedIds.size}</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ overflow: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1500px' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', width: '40px' }}>
                    <input type="checkbox" checked={selectedIds.size === filteredData.length && filteredData.length > 0} onChange={handleSelectAll} style={{ accentColor: '#4f46e5' }} />
                  </th>
                  {visibleColumns.map((col, i) => (
                    <th key={col} style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', position: 'relative', width: columnWidths[col] || (col === 'Recording' ? 250 : 150) }}>
                      {col}
                      <div
                        onMouseDown={(e) => handleMouseDown(e, col)}
                        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', zIndex: 11 }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(row => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr 
                      key={row.id} 
                      style={{ borderBottom: '1px solid #f1f5f9', background: isSelected ? '#f5f3ff' : 'white', transition: 'background 0.2s' }}
                      onMouseEnter={() => setHoveredRowId(row.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td style={{ padding: '16px' }}>
                        <input type="checkbox" checked={isSelected} onChange={() => handleSelect(row.id)} style={{ accentColor: '#4f46e5' }} />
                      </td>
                      
                      {visibleColumns.map(col => {
                        let content: React.ReactNode = (row as any)[col];

                        if (col === 'Lead') {
                          content = (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', minHeight: '32px' }}>
                              <span 
                                onClick={(e) => { e.stopPropagation(); setSelectedProfile(row.leadObj); }}
                                className="hover-underline" 
                                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}
                                title={row.Lead}
                              >
                                {row.Lead}
                              </span>
                              
                              <AnimatePresence>
                                {hoveredRowId === row.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, x: 10, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                                    exit={{ opacity: 0, x: 10, width: 0 }}
                                    transition={{ duration: 0.15 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', flexShrink: 0 }}
                                  >
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${row.leadObj?.phone || ''}`; }}
                                      style={{ padding: '4px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                                      title="Call"
                                    >
                                      <Phone size={14} />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); openSharedInbox({ entityType: 'lead', entityId: row.leadObj?.id }); }}
                                      style={{ padding: '4px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                                      title="Message"
                                    >
                                      <MessageSquare size={14} />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setSelectedProfile(row.leadObj); }}
                                      style={{ padding: '4px', background: '#e0e7ff', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center' }}
                                      title="View Details"
                                    >
                                      <Eye size={14} />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        } else if (col === 'Recording') {
                          if (row.Recording) {
                            const isPlaying = playingId === row.id;
                            content = (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <button onClick={() => togglePlay(row.id, row.Duration)} style={{ background: '#4f46e5', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <div style={{ flex: 1, height: '4px', background: '#cbd5e1', borderRadius: '2px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', background: '#4f46e5', width: isPlaying ? `${audioProgress}%` : '0%' }} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{row['Total Duration']}</span>
                              </div>
                            );
                          } else {
                            content = <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No Recording</span>;
                          }
                        } else if (col === 'Call With') {
                          content = (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
                                {String(content).charAt(0)}
                              </div>
                              <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{content}</span>
                            </div>
                          );
                        } else if (col === 'Call Outcome') {
                          let bg = '#f1f5f9', tc = '#475569';
                          if (content === 'Positive') { bg = '#dcfce7'; tc = '#166534'; }
                          else if (content === 'Negative') { bg = '#fee2e2'; tc = '#991b1b'; }
                          else if (content) { bg = '#dbeafe'; tc = '#1e40af'; }
                          
                          if (content) {
                            content = <span style={{ background: bg, color: tc, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{content}</span>;
                          } else {
                            content = <span style={{ color: '#94a3b8' }}>-</span>;
                          }
                        } else if (col === 'Tags') {
                          const tags = content as string[];
                          content = (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {tags.map((t, i) => <span key={i} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#475569' }}>{t}</span>)}
                            </div>
                          );
                        } else if (col.includes('Time') || col === 'Last Updated') {
                          content = new Date(String(content)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        }

                        return (
                          <td key={col} style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: columnWidths[col] || (col === 'Recording' ? 250 : 150) }}>
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div style={{ padding: '12px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing 1 to {filteredData.length} of {filteredData.length} entries</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>Previous</button>
              <button style={{ padding: '6px 12px', background: '#4f46e5', border: 'none', color: 'white', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>1</button>
              <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {selectedProfile && (
        <LeadWorkspaceModal 
          isOpen={!!selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          lead={selectedProfile}
        />
      )}
    </div>
  );
}
