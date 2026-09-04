"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { Search, Filter, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageDoNotTrackPage() {
  const { doNotTrackRecords, systemUsers, removeDoNotTrackRecords } = useCRM();

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Row Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering States
  const [activeFilterPopover, setActiveFilterPopover] = useState<string | null>(null);
  
  // Number Filter
  const [numberFilterCondition, setNumberFilterCondition] = useState('Contains');
  const [numberFilterValue, setNumberFilterValue] = useState('');
  
  // Sent By Filter
  const [sentByUserExists, setSentByUserExists] = useState(false);
  const [sentByUserMissing, setSentByUserMissing] = useState(false);
  const [sentBySelectedUsers, setSentBySelectedUsers] = useState<string[]>([]);
  
  // Date Filter
  const [dateFilterDays, setDateFilterDays] = useState<number | null>(null);

  // AND / OR logic
  const [filterLogic, setFilterLogic] = useState<'AND' | 'OR'>('AND');

  // Column Resizing
  const [colWidths, setColWidths] = useState({
    checkbox: 60,
    number: 300,
    sentBy: 250,
    date: 250
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm_manage_dnt_colWidths');
      if (saved) {
        try {
          setColWidths(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm_manage_dnt_colWidths', JSON.stringify(colWidths));
    }
  }, [colWidths]);

  const [resizingCol, setResizingCol] = useState<keyof typeof colWidths | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  useEffect(() => {
    if (!resizingCol) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      let newWidth = startWidth + deltaX;
      
      // Enforce minimums
      if (resizingCol === 'checkbox') newWidth = Math.max(newWidth, 50);
      else if (resizingCol === 'number') newWidth = Math.max(newWidth, 180);
      else if (resizingCol === 'sentBy') newWidth = Math.max(newWidth, 160);
      else if (resizingCol === 'date') newWidth = Math.max(newWidth, 180);

      setColWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingCol(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingCol, startX, startWidth]);

  const handleResizeStart = (col: keyof typeof colWidths, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingCol(col);
    setStartX(e.clientX);
    setStartWidth(colWidths[col]);
  };

  // Close popovers on click outside
  const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      let isInside = false;
      Object.values(filterRefs.current).forEach(ref => {
        if (ref && ref.contains(e.target as Node)) {
          isInside = true;
        }
      });
      if (!isInside) {
        setActiveFilterPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyNumberFilter = () => { setActiveFilterPopover(null); };
  const handleClearNumberFilter = () => { 
    setNumberFilterValue(''); 
    setNumberFilterCondition('Contains'); 
    setActiveFilterPopover(null); 
  };

  const handleApplySentByFilter = () => { setActiveFilterPopover(null); };
  const handleClearSentByFilter = () => {
    setSentByUserExists(false);
    setSentByUserMissing(false);
    setSentBySelectedUsers([]);
    setActiveFilterPopover(null);
  };

  const handleApplyDateFilter = () => { setActiveFilterPopover(null); };
  const handleClearDateFilter = () => {
    setDateFilterDays(null);
    setActiveFilterPopover(null);
  };

  // Filter Logic
  const filteredRecords = useMemo(() => {
    let result = doNotTrackRecords;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => {
        const user = systemUsers.find(u => u.id === r.sentById);
        const userName = user ? user.name.toLowerCase() : '';
        return r.number.toLowerCase().includes(q) || userName.includes(q);
      });
    }

    // Column Filters
    const hasNumberFilter = numberFilterValue.trim() !== '' || ['Blank', 'Not blank'].includes(numberFilterCondition);
    const hasSentByFilter = sentByUserExists || sentByUserMissing || sentBySelectedUsers.length > 0;
    const hasDateFilter = dateFilterDays !== null;

    if (hasNumberFilter || hasSentByFilter || hasDateFilter) {
      result = result.filter(r => {
        let passNumber = false;
        let passSentBy = false;
        let passDate = false;

        // Number check
        if (hasNumberFilter) {
          const val = numberFilterValue.toLowerCase();
          const num = r.number.toLowerCase();
          if (numberFilterCondition === 'Contains') passNumber = num.includes(val);
          else if (numberFilterCondition === 'Does not contain') passNumber = !num.includes(val);
          else if (numberFilterCondition === 'Equals') passNumber = num === val;
          else if (numberFilterCondition === 'Does not equal') passNumber = num !== val;
          else if (numberFilterCondition === 'Begins with') passNumber = num.startsWith(val);
          else if (numberFilterCondition === 'Ends with') passNumber = num.endsWith(val);
          else if (numberFilterCondition === 'Blank') passNumber = num.trim() === '';
          else if (numberFilterCondition === 'Not blank') passNumber = num.trim() !== '';
        }

        // Sent By check
        if (hasSentByFilter) {
          const user = systemUsers.find(u => u.id === r.sentById);
          if (sentByUserExists && user) passSentBy = true;
          if (sentByUserMissing && !user) passSentBy = true;
          if (sentBySelectedUsers.length > 0 && sentBySelectedUsers.includes(r.sentById)) passSentBy = true;
        }

        // Date check
        if (hasDateFilter) {
          const created = new Date(r.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= (dateFilterDays as number)) passDate = true;
        }

        // Combine logic
        if (filterLogic === 'AND') {
          return (!hasNumberFilter || passNumber) && (!hasSentByFilter || passSentBy) && (!hasDateFilter || passDate);
        } else {
          return (hasNumberFilter && passNumber) || (hasSentByFilter && passSentBy) || (hasDateFilter && passDate);
        }
      });
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [doNotTrackRecords, systemUsers, searchQuery, numberFilterCondition, numberFilterValue, sentByUserExists, sentByUserMissing, sentBySelectedUsers, dateFilterDays, filterLogic]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredRecords.map(r => r.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${selectedIds.length} number(s) from Do Not Track?`)) {
      removeDoNotTrackRecords(selectedIds);
      setSelectedIds([]);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const ResizeHandle = ({ col }: { col: keyof typeof colWidths }) => (
    <div 
      onMouseDown={(e) => handleResizeStart(col, e)}
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '5px',
        cursor: 'col-resize',
        zIndex: 15,
        backgroundColor: resizingCol === col ? 'var(--primary-color)' : 'transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-color)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = resizingCol === col ? 'var(--primary-color)' : 'transparent')}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header / Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', background: '#ffffff', zIndex: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Manage Do Not Track</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Manage contacts that have opted out of communications.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', width: '300px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search by number or user..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '24px', zIndex: 11 }}>
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{selectedIds.length} selected</span>
          <button onClick={handleRemove} style={{ padding: '8px 16px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} /> Remove from Do Not Track
          </button>
        </motion.div>
      )}

      {/* Table Container */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ width: colWidths.checkbox, padding: '16px', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', position: 'relative', borderRight: '1px solid var(--glass-border)' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                <ResizeHandle col="checkbox" />
              </th>
              
              <th style={{ width: colWidths.number, padding: '16px', borderBottom: '1px solid var(--glass-border)', position: 'relative', borderRight: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Do Not Track Number</span>
                  <div style={{ position: 'relative' }} ref={el => { filterRefs.current['number'] = el; }}>
                    <button type="button" onClick={() => setActiveFilterPopover(activeFilterPopover === 'number' ? null : 'number')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', color: (numberFilterValue || ['Blank', 'Not blank'].includes(numberFilterCondition)) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      <Filter size={14} style={{ pointerEvents: 'none' }} />
                    </button>
                    {activeFilterPopover === 'number' && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '16px', width: '250px', zIndex: 100, textTransform: 'none' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Condition</label>
                          <select value={numberFilterCondition} onChange={e => setNumberFilterCondition(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.9rem' }}>
                            {['Contains', 'Does not contain', 'Equals', 'Does not equal', 'Begins with', 'Ends with', 'Blank', 'Not blank'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        {!['Blank', 'Not blank'].includes(numberFilterCondition) && (
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Search / value</label>
                            <input type="text" value={numberFilterValue} onChange={e => setNumberFilterValue(e.target.value)} placeholder="Value..." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={handleClearNumberFilter} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                          <button onClick={handleApplyNumberFilter} style={{ padding: '6px 12px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ResizeHandle col="number" />
              </th>

              <th style={{ width: colWidths.sentBy, padding: '16px', borderBottom: '1px solid var(--glass-border)', position: 'relative', borderRight: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sent By</span>
                  <div style={{ position: 'relative' }} ref={el => { filterRefs.current['sentBy'] = el; }}>
                    <button type="button" onClick={() => setActiveFilterPopover(activeFilterPopover === 'sentBy' ? null : 'sentBy')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', color: (sentByUserExists || sentByUserMissing || sentBySelectedUsers.length > 0) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      <Filter size={14} style={{ pointerEvents: 'none' }} />
                    </button>
                    {activeFilterPopover === 'sentBy' && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '16px', width: '250px', zIndex: 100, textTransform: 'none' }}>
                        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="radio" checked={sentByUserExists} onChange={() => { setSentByUserExists(true); setSentByUserMissing(false); }} /> User Exists
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="radio" checked={sentByUserMissing} onChange={() => { setSentByUserExists(false); setSentByUserMissing(true); }} /> User Missing
                          </label>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />
                        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {systemUsers.map(u => (
                            <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                              <input type="checkbox" checked={sentBySelectedUsers.includes(u.id)} onChange={(e) => {
                                if (e.target.checked) setSentBySelectedUsers([...sentBySelectedUsers, u.id]);
                                else setSentBySelectedUsers(sentBySelectedUsers.filter(id => id !== u.id));
                              }} /> {u.name}
                            </label>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={handleClearSentByFilter} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                          <button onClick={handleApplySentByFilter} style={{ padding: '6px 12px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ResizeHandle col="sentBy" />
              </th>

              <th style={{ width: colWidths.date, padding: '16px', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '8px' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Do Not Track Set At</span>
                  <div style={{ position: 'relative' }} ref={el => { filterRefs.current['date'] = el; }}>
                    <button type="button" onClick={() => setActiveFilterPopover(activeFilterPopover === 'date' ? null : 'date')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', color: (dateFilterDays !== null) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      <Filter size={14} style={{ pointerEvents: 'none' }} />
                    </button>
                    {activeFilterPopover === 'date' && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '16px', width: '250px', zIndex: 100, textTransform: 'none' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Filter Logic</label>
                          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', padding: '2px' }}>
                            <button 
                              onClick={() => setFilterLogic('AND')}
                              style={{ flex: 1, padding: '6px 12px', background: filterLogic === 'AND' ? '#fff' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: filterLogic === 'AND' ? 600 : 400, boxShadow: filterLogic === 'AND' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                              AND
                            </button>
                            <button 
                              onClick={() => setFilterLogic('OR')}
                              style={{ flex: 1, padding: '6px 12px', background: filterLogic === 'OR' ? '#fff' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: filterLogic === 'OR' ? 600 : 400, boxShadow: filterLogic === 'OR' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                              OR
                            </button>
                          </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Last number of days</label>
                          <select value={dateFilterDays === null ? '' : dateFilterDays} onChange={e => setDateFilterDays(e.target.value === '' ? null : Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.9rem' }}>
                            <option value="">All Time</option>
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="60">Last 60 Days</option>
                            <option value="90">Last 90 Days</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={handleClearDateFilter} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                          <button onClick={handleApplyDateFilter} style={{ padding: '6px 12px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ResizeHandle col="date" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? filteredRecords.map(row => {
              const sentByUser = systemUsers.find(u => u.id === row.sentById);
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.includes(row.id) ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.2s' }}>
                  <td style={{ width: colWidths.checkbox, padding: '16px', textAlign: 'center', borderRight: '1px solid var(--glass-border)' }}>
                    <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={(e) => handleSelectRow(row.id, e)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-color)' }} />
                  </td>
                  <td style={{ width: colWidths.number, padding: '16px', fontWeight: 600, color: 'var(--text-primary)', borderRight: '1px solid var(--glass-border)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.number}</td>
                  <td style={{ width: colWidths.sentBy, padding: '16px', color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sentByUser ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={sentByUser.photo} alt={sentByUser.name} style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sentByUser.name}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#ef4444' }}>User Missing</span>
                    )}
                  </td>
                  <td style={{ width: colWidths.date, padding: '16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatDate(row.createdAt)}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-tertiary)' }}>No Do Not Track numbers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
