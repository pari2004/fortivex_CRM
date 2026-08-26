'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInbox } from '@/contexts/InboxContext';
import { 
  Users, Search, Send, Star, Hash, 
  MoreVertical, CheckCircle2, Clock, 
  MessageSquare, Plus, ChevronDown, CheckSquare, Square, X, Paperclip, Smile, Info
} from 'lucide-react';
import { usersData } from '@/lib/data/systemData'; // to get CRM users

const CRM_USERS = ['Thanushree B R', 'Pavan S H', 'Parikshit', 'Padmesh', 'Abhishek', 'Yashwanth', 'Spoorthi'];

const MOCK_GROUPS = [
  'FA Sales Team', 
  'Yashwanth Sir', 
  'Tech Team', 
  'Digital Marketing Team'
];

const generateTeamInboxData = () => {
  const records: any[] = [];
  
  // Add group records
  MOCK_GROUPS.forEach((g, i) => {
    records.push({
      id: `GRP-${i}`,
      channelName: g,
      type: 'group',
      lastMessageTime: new Date(Date.now() - Math.random() * 864000000).toISOString(),
      lastMessageBy: CRM_USERS[i % CRM_USERS.length],
      lastMessage: i % 2 === 0 ? "Let's align on the Q3 targets during tomorrow's sync." : "The new marketing assets have been uploaded.",
      isNew: i === 0,
      isUnread: i % 2 === 0,
      isStarred: i === 1,
    });
  });

  // Add direct records
  CRM_USERS.forEach((u, i) => {
    records.push({
      id: `DIR-${i}`,
      channelName: u,
      type: 'direct',
      lastMessageTime: new Date(Date.now() - Math.random() * 864000000 * 2).toISOString(),
      lastMessageBy: u,
      lastMessage: i % 3 === 0 ? "Can you approve the discount request for Lead #4092?" : "I have updated the deal stage as discussed.",
      isNew: i === 1,
      isUnread: i % 3 === 0,
      isStarred: i === 2,
    });
  });

  return records.sort((a,b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
};

export default function TeamInboxPage() {
  const { openSharedInbox } = useInbox();
  
  const [records] = useState(generateTeamInboxData());
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Column Resizing
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    checkbox: 40,
    'Channel Name': 250,
    'Last Message Time': 200,
    'Last Message By': 200,
    'Last Message': 400
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
    const newWidth = Math.max(80, startWidth.current + diff); 
    setColWidths(prev => ({ ...prev, [resizingCol.current as string]: newWidth }));
  }, []);

  const onMouseUp = useCallback(() => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

// Modals & Popovers
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatTab, setNewChatTab] = useState<'Users'|'New Group'>('Users');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  
  // Time Filter State
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [timeFilterType, setTimeFilterType] = useState<string>(''); // e.g., 'Last Number of Days'
  const [timeFilterValue, setTimeFilterValue] = useState<string>('7'); // e.g., '7'

  // Interactions
  const [hoveredChannelId, setHoveredChannelId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const applyTimeFilter = (itemTime: string) => {
    if (!timeFilterType) return true;
    
    const now = new Date();
    const itemDate = new Date(itemTime);
    const diffMs = now.getTime() - itemDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    const val = parseInt(timeFilterValue) || 0;

    switch (timeFilterType) {
      case 'Last Number of Days': return diffDays <= val && diffDays >= 0;
      case 'Next Number of Days': return diffDays >= -val && diffDays < 0; // Negative diff means future
      case 'Not in Last Number of Days': return diffDays > val || diffDays < 0;
      case 'Not in Next Number of Days': return diffDays < -val || diffDays > 0;
      case 'Today': return itemDate.toDateString() === now.toDateString();
      case 'Yesterday': 
        const yest = new Date(now);
        yest.setDate(yest.getDate() - 1);
        return itemDate.toDateString() === yest.toDateString();
      case 'This Week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return itemDate >= startOfWeek;
      case 'This Month':
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      default: return true;
    }
  };

  const filtered = useMemo(() => {
    let list = records;
    
    // Top Bar Filtering
    if (activeFilter === 'New') list = list.filter(r => r.isNew);
    if (activeFilter === 'Unread') list = list.filter(r => r.isUnread);
    if (activeFilter === 'Direct') list = list.filter(r => r.type === 'direct');
    if (activeFilter === 'Groups') list = list.filter(r => r.type === 'group');
    if (activeFilter === 'Starred') list = list.filter(r => r.isStarred);
    
    // Time Filtering
    list = list.filter(r => applyTimeFilter(r.lastMessageTime));

    return list;
  }, [records, activeFilter, timeFilterType, timeFilterValue]);

  const counts = useMemo(() => {
    return {
      'All': records.length,
      'New': records.filter(r => r.isNew).length,
      'Unread': records.filter(r => r.isUnread).length,
      'Direct': records.filter(r => r.type === 'direct').length,
      'Groups': records.filter(r => r.type === 'group').length,
      'Starred': records.filter(r => r.isStarred).length,
    };
  }, [records]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(a => a.id)));
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
    whiteSpace: 'nowrap' as const
  };

  const tdStyle = {
    padding: '16px',
    fontSize: '0.85rem',
    color: '#475569',
    whiteSpace: 'nowrap' as const
  };
  
  const handleOpenChat = (id: string, name: string) => {
    openSharedInbox({ entityType: 'team', entityId: id });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f5f9', padding: '24px' }}>
      
      {/* Header Area */}
      <div style={{ padding: '24px', background: 'white', borderBottom: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <Users size={24} />
            </div>
            Team Inbox
          </h1>
          
          <button 
            onClick={() => setShowNewChat(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' }}
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
        
        {/* Top Controls Filter Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['All', 'New', 'Unread', 'Direct', 'Groups', 'Starred'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: activeFilter === status ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                background: activeFilter === status ? '#eff6ff' : 'white',
                color: activeFilter === status ? '#1d4ed8' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {status}
              <span style={{ 
                background: activeFilter === status ? '#bfdbfe' : '#f1f5f9',
                color: activeFilter === status ? '#1e40af' : '#64748b',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 600
              }}>
                {counts[status as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Area */}
      <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {selectedIds.size > 0 && (
          <div style={{ background: '#e0e7ff', padding: '12px 24px', borderBottom: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#3730a3', fontSize: '0.9rem' }}>{selectedIds.size} Selected</span>
          </div>
        )}

        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
          <table style={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', width: `${colWidths.checkbox}px`, position: 'relative' }}>
                  <div onClick={toggleSelectAll} style={{ cursor: 'pointer', color: selectedIds.size === filtered.length && filtered.length > 0 ? '#4f46e5' : '#cbd5e1' }}>
                    {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </th>
                
                {['Channel Name'].map(label => (
                  <th key={label} style={{ ...thStyle, width: `${colWidths[label]}px`, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>{label}</div>
                    <div onMouseDown={(e) => onMouseDown(e, label)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }} onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
                  </th>
                ))}
                
                {/* Last Message Time with Filter Dropdown */}
                <th style={{ ...thStyle, width: `${colWidths['Last Message Time']}px`, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', cursor: 'pointer' }} onClick={() => setShowTimeFilter(!showTimeFilter)}>
                    Last Message Time
                    <ChevronDown size={14} color={timeFilterType ? '#3b82f6' : '#94a3b8'} />
                  </div>
                  
                  {/* Filter Dropdown */}
                  <AnimatePresence>
                    {showTimeFilter && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 100, width: '220px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select 
                          value={timeFilterType}
                          onChange={(e) => setTimeFilterType(e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '8px', fontSize: '0.8rem', color: '#333' }}
                        >
                          <option value="">Select Option</option>
                          <option value="Last Number of Days">Last Number of Days</option>
                          <option value="Next Number of Days">Next Number of Days</option>
                          <option value="Not in Last Number of Days">Not in Last Number of Days</option>
                          <option value="Not in Next Number of Days">Not in Next Number of Days</option>
                          <option value="Today">Today</option>
                          <option value="Yesterday">Yesterday</option>
                          <option value="This Week">This Week</option>
                          <option value="This Month">This Month</option>
                        </select>
                        
                        {timeFilterType.includes('Number of Days') && (
                          <input 
                            type="number" 
                            value={timeFilterValue} 
                            onChange={(e) => setTimeFilterValue(e.target.value)}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '0.8rem', color: '#333' }} 
                            placeholder="Enter days..."
                          />
                        )}
                        
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button onClick={() => { setTimeFilterType(''); setShowTimeFilter(false); }} style={{ flex: 1, padding: '4px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Clear</button>
                          <button onClick={() => setShowTimeFilter(false)} style={{ flex: 1, padding: '4px', background: '#3b82f6', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Apply</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div onMouseDown={(e) => onMouseDown(e, 'Last Message Time')} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }} onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
                </th>

                {['Last Message By', 'Last Message'].map(label => (
                  <th key={label} style={{ ...thStyle, width: `${colWidths[label]}px`, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>{label}</div>
                    <div onMouseDown={(e) => onMouseDown(e, label)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }} onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr 
                  key={r.id}
                  style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(r.id) ? '#f5f7ff' : (hoveredChannelId === r.id || hoveredMessageId === r.id) ? '#f8fafc' : 'white', transition: 'background 0.2s' }}
                >
                  <td style={{ ...tdStyle }}>
                    <div onClick={() => toggleSelect(r.id)} style={{ cursor: 'pointer', color: selectedIds.has(r.id) ? '#4f46e5' : '#cbd5e1' }}>
                      {selectedIds.has(r.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  
                  <td 
                    style={{ ...tdStyle, position: 'relative' }}
                    onMouseEnter={() => setHoveredChannelId(r.id)}
                    onMouseLeave={() => setHoveredChannelId(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: r.type === 'group' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                        {r.type === 'group' ? <Hash size={14}/> : r.channelName.substring(0, 2).toUpperCase()}
                      </div>
                      
                      {hoveredChannelId === r.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.channelName}</span>
                          <button style={{ padding: '4px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="WhatsApp" onClick={(e) => { e.stopPropagation(); console.log('WhatsApp Action'); }}><MessageSquare size={14} /></button>
                          <button style={{ padding: '4px 8px', background: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '0.7rem', fontWeight: 600 }} onClick={() => handleOpenChat(r.id, r.channelName)}>Chat</button>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{r.channelName}</span>
                      )}
                      
                      {r.isStarred && hoveredChannelId !== r.id && <Star size={12} color="#eab308" fill="#eab308" />}
                    </div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div>{new Date(r.lastMessageTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(r.lastMessageTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 600 }}>{r.lastMessageBy.charAt(0)}</div>
                      <span style={{ fontSize: '0.8rem' }}>{r.lastMessageBy}</span>
                    </div>
                  </td>

                  <td 
                    style={{ ...tdStyle, position: 'relative' }}
                    onMouseEnter={() => setHoveredMessageId(r.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: `${colWidths['Last Message'] - 32}px` }}>
                      <span style={{ fontWeight: r.isUnread ? 600 : 400, color: r.isUnread ? '#0f172a' : '#475569' }}>{r.lastMessage}</span>
                    </div>
                    
                    {/* Hover Full Message Tooltip */}
                    {hoveredMessageId === r.id && (
                       <div style={{ position: 'absolute', top: '100%', left: '16px', marginTop: '4px', background: 'white', color: '#334155', padding: '12px 16px', borderRadius: '8px', fontSize: '0.8rem', zIndex: 9999, whiteSpace: 'normal', width: 'max-content', maxWidth: '400px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', pointerEvents: 'none', lineHeight: '1.5' }}>
                         {r.lastMessage}
                       </div>
                    )}
                  </td>
                  
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Search size={32} color="#cbd5e1" />
                      <div>No conversations match the current filters.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* New Chat Split-Screen Modal */}
      <AnimatePresence>
        {showNewChat && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ background: 'white', borderRadius: selectedChatUser ? '16px' : '0', width: selectedChatUser ? '90vw' : '400px', maxWidth: selectedChatUser ? '1200px' : '400px', height: selectedChatUser ? '90vh' : '100%', position: selectedChatUser ? 'relative' : 'absolute', left: selectedChatUser ? 'auto' : 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', overflow: 'hidden', transition: 'all 0.3s ease' }}
            >
              
              {/* LEFT PANEL */}
              <div style={{ width: '400px', minWidth: '400px', height: '100%', display: 'flex', flexDirection: 'column', borderRight: selectedChatUser ? '1px solid #e2e8f0' : 'none', background: 'white', zIndex: 2 }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setShowNewChat(false); setSelectedChatUser(null); }}>
                    <div style={{ padding: '4px', color: '#0f172a' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Start New Chat</h2>
                  </div>
                  
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                    <button 
                      onClick={() => setNewChatTab('Users')}
                      style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: newChatTab === 'Users' ? '#ec4899' : 'transparent', color: newChatTab === 'Users' ? 'white' : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      Users
                    </button>
                    <button 
                      onClick={() => setNewChatTab('New Group')}
                      style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: newChatTab === 'New Group' ? '#cbd5e1' : 'transparent', color: newChatTab === 'New Group' ? '#334155' : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      New Group
                    </button>
                  </div>
                </div>
                
                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', background: '#fafafa' }}>
                  {newChatTab === 'Users' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {CRM_USERS.map((u, i) => {
                        const isSelected = selectedChatUser === u;
                        return (
                          <div 
                            key={u} 
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: isSelected ? '#eff6ff' : 'white', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent' }} 
                            onClick={() => setSelectedChatUser(u)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i % 2 === 0 ? '#fde047' : '#67e8f9', color: i % 2 === 0 ? '#a16207' : '#0e7490', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                                {u.substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.95rem' }}>{u}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>+91 98765432{i}1</div>
                              </div>
                            </div>
                            <span style={{ padding: '4px 10px', background: '#e2e8f0', color: '#475569', borderRadius: '16px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                              {i % 3 === 0 ? 'SUPERADMIN' : 'MEMBER'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {newChatTab === 'New Group' && (
                    <div style={{ padding: '24px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Group Name</label>
                        <input 
                          type="text" 
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          placeholder="e.g. Finance Team Sync" 
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a' }} 
                        />
                      </div>
                      
                      <div style={{ marginBottom: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Select Members ({selectedGroupMembers.length})</label>
                        
                        {selectedGroupMembers.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {selectedGroupMembers.map(member => (
                              <div key={member} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 500 }}>
                                {member}
                                <X size={12} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setSelectedGroupMembers(prev => prev.filter(m => m !== member)); }} />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          {CRM_USERS.map((u, i) => {
                            const isSelected = selectedGroupMembers.includes(u);
                            return (
                              <div 
                                key={u} 
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedGroupMembers(prev => prev.filter(m => m !== u));
                                  } else {
                                    setSelectedGroupMembers(prev => [...prev, u]);
                                  }
                                }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#eff6ff' : 'white' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i % 2 === 0 ? '#fde047' : '#67e8f9', color: i % 2 === 0 ? '#a16207' : '#0e7490', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                    {u.substring(0,2).toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>{u}</span>
                                </div>
                                <div style={{ color: isSelected ? '#3b82f6' : '#cbd5e1' }}>
                                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <button 
                        disabled={!groupName || selectedGroupMembers.length === 0}
                        onClick={() => {
                          console.log('Creating group', groupName, 'with members', selectedGroupMembers);
                          handleOpenChat(`GRP-NEW-${Date.now()}`, groupName);
                          setShowNewChat(false);
                          setGroupName('');
                          setSelectedGroupMembers([]);
                        }}
                        style={{ padding: '14px', background: (!groupName || selectedGroupMembers.length === 0) ? '#cbd5e1' : '#ec4899', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: (!groupName || selectedGroupMembers.length === 0) ? 'not-allowed' : 'pointer', marginTop: 'auto' }}
                      >
                        Create Group
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* RIGHT PANEL (CHAT INTERFACE) */}
              {selectedChatUser && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', position: 'relative' }}>
                  {/* Chat Header */}
                  <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde047, #facc15)', color: '#a16207', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
                        {selectedChatUser.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{selectedChatUser}</h3>
                          <span style={{ padding: '2px 8px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>+91 9876543210</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Channel Type : Direct</div>
                      </div>
                    </div>
                    
                    <button onClick={() => { setShowNewChat(false); setSelectedChatUser(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <X size={24} />
                    </button>
                  </div>
                  
                  {/* Chat Messages Area */}
                  <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Date Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
                      <div style={{ padding: '4px 12px', background: '#e2e8f0', borderRadius: '12px', fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Today</div>
                    </div>
                    
                    {/* Incoming Message */}
                    <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', maxWidth: '80%' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fde047', color: '#a16207', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                        {selectedChatUser.substring(0,2).toUpperCase()}
                      </div>
                      <div style={{ background: 'white', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>Hi, I have a question regarding the recent deployment.</p>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', textAlign: 'right' }}>10:30 AM</div>
                      </div>
                    </div>
                    
                    {/* Outgoing Message */}
                    <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end', maxWidth: '80%' }}>
                      <div style={{ background: '#3b82f6', padding: '12px 16px', borderRadius: '16px', borderTopRightRadius: '4px', color: 'white', boxShadow: '0 2px 4px rgba(59,130,246,0.2)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>Sure, I can help with that. What seems to be the issue?</p>
                        <div style={{ fontSize: '0.7rem', color: '#bfdbfe', marginTop: '8px', textAlign: 'right' }}>10:32 AM ✓✓</div>
                      </div>
                    </div>
                    
                  </div>
                  
                  {/* Chat Input Area */}
                  <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        Try AI Assist
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        App Issues
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                      </button>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      </button>
                      <input 
                        type="text" 
                        placeholder="Type a message, or try AI Assist for instant answers" 
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', color: '#0f172a', padding: '4px' }}
                      />
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
