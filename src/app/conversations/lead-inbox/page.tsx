'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { useInbox } from '@/contexts/InboxContext';
import { useCRM } from '@/contexts/CRMContext';
import { generatedLeads } from '@/lib/data/mockData';
import { Phone, MessageSquare, Eye, MoreHorizontal, MessageCircle, AlertTriangle, AlertCircle, Clock, CheckSquare, Square, Search, Filter, Mail, ToggleLeft, ToggleRight, CheckCircle2, Check, XCircle } from 'lucide-react';

const leadOwners = ['Thanushree B R', 'Pavan S H', 'Parikshit', 'Padmesh', 'Abhishek', 'Yashwanth', 'Spoorthi'];
const chatOwners = ['Rahul Sharma', 'Sneha Gupta', 'Amit Patel', 'Priya Singh'];

const generateInboxData = () => {
  return generatedLeads.slice(0, 45).map((lead, i) => {
    const isUnread = i % 5 === 0;
    const isExpired = i % 8 === 0;
    const hasFailed = i % 15 === 0;
    const isResolved = i % 7 === 0;
    const awaitingResponse = i % 4 === 0;
    
    // Status Logic
    let status = 'Started';
    if (isResolved) status = 'Resolved';
    else if (hasFailed) status = 'Failed';
    else if (isExpired) status = 'Expired';
    else if (awaitingResponse) status = 'Awaiting Response';
    else if (isUnread) status = 'Unread';

    let timeLeft = isExpired ? 'Expired' : `${Math.floor(Math.random() * 12 + 1)}h ${Math.floor(Math.random() * 60)}m`;
    if (status === 'Resolved' || status === 'Failed') timeLeft = '-';

    return {
      id: `CONV-${1000 + i}`,
      fullLead: lead,
      leadName: lead.name,
      avatarText: lead.name.substring(0, 2).toUpperCase(),
      lastMessage: i % 2 === 0 ? "Hi, I'm interested in the full stack course." : "We have a demo scheduled for tomorrow.",
      whatsapp: i % 3 !== 0 ? 'Active' : 'Opt-In Pending',
      channel: i % 4 === 0 ? 'Email' : 'WhatsApp',
      lastMessageTime: new Date(Date.now() - Math.random() * 100000000).toISOString(),
      lastMessageByLeadTime: new Date(Date.now() - Math.random() * 200000000).toISOString(),
      lastMessageByUserTime: new Date(Date.now() - Math.random() * 50000000).toISOString(),
      needsAttention: isUnread || isExpired || hasFailed,
      timeLeft: timeLeft,
      recentAction: i % 2 === 0 ? 'Automated Reply' : 'Agent Assigned',
      chatOwner: chatOwners[i % chatOwners.length],
      leadOwner: leadOwners[i % leadOwners.length],
      tags: i % 2 === 0 ? ['Hot', 'Demo Scheduled'] : ['Warm'],
      status: status, // For top filters
      lastMessageFromLead: i % 2 === 0 // true if lead sent the last msg
    };
  });
};

type SortKey = 'leadName' | 'lastMessageTime' | 'chatOwner' | 'leadOwner';

export default function LeadInboxPage() {
  const [conversations] = useState(generateInboxData());
  
  // Custom Hover Lead Component (to support the 4 buttons)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Filters & State
  const [activeSegment, setActiveSegment] = useState<'All' | 'My'>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals / Navigation
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);
  const { openSharedInbox } = useInbox();
  const {  } = useCRM();

  // Column Resizing
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    checkbox: 40,
    'Lead Name': 220,
    'Last Message': 260,
    'WhatsApp': 120,
    'Channel': 100,
    'Last Message Time': 160,
    'Last Msg By Lead': 160,
    'Last Msg By User': 160,
    'Needs Attention': 120,
    'Time Left': 100,
    'Recent Actions': 140,
    'Chat Owner': 140,
    'Lead Owner': 140,
    'Tags': 160
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

  const filtered = useMemo(() => {
    let list = conversations;
    
    if (activeSegment === 'My') {
      list = list.filter(c => c.chatOwner === 'Rahul Sharma' || c.leadOwner === 'Pavan S H');
    }
    
    if (activeStatusFilter !== 'All') {
      if (activeStatusFilter === 'Last Message From Lead') {
        list = list.filter(c => c.lastMessageFromLead);
      } else {
        list = list.filter(c => c.status === activeStatusFilter);
      }
    }
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => 
        c.leadName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.leadOwner.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, activeSegment, activeStatusFilter, searchTerm]);

  // Counts for Top Status Controls
  const counts = useMemo(() => {
    const list = activeSegment === 'My' 
      ? conversations.filter(c => c.chatOwner === 'Rahul Sharma' || c.leadOwner === 'Pavan S H')
      : conversations;
      
    return {
      'All': list.length,
      'Unread': list.filter(c => c.status === 'Unread').length,
      'Time Left': list.filter(c => c.timeLeft !== '-' && c.timeLeft !== 'Expired').length,
      'Expired': list.filter(c => c.status === 'Expired').length,
      'Started': list.filter(c => c.status === 'Started').length,
      'Awaiting Response': list.filter(c => c.status === 'Awaiting Response').length,
      'Last Message From Lead': list.filter(c => c.lastMessageFromLead).length,
      'Failed': list.filter(c => c.status === 'Failed').length,
      'Resolved': list.filter(c => c.status === 'Resolved').length,
    };
  }, [conversations, activeSegment]);

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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f5f9', padding: '24px' }}>
      
      {/* Header Area */}
      <div style={{ padding: '24px', background: 'white', borderBottom: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
            <MessageSquare size={24} />
          </div>
          Lead Inbox
        </h1>
        
        {/* Top Segment & Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
              <button 
                onClick={() => setActiveSegment('My')}
                style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, background: activeSegment === 'My' ? 'white' : 'transparent', color: activeSegment === 'My' ? '#0f172a' : '#64748b', boxShadow: activeSegment === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                My
              </button>
              <button 
                onClick={() => setActiveSegment('All')}
                style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, background: activeSegment === 'All' ? 'white' : 'transparent', color: activeSegment === 'All' ? '#0f172a' : '#64748b', boxShadow: activeSegment === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                All
              </button>
            </div>
            
            <button 
              onClick={() => setBroadcastEnabled(!broadcastEnabled)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: broadcastEnabled ? '#16a34a' : '#64748b', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {broadcastEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Broadcast
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', width: '250px' }}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: '4px 8px', fontSize: '0.85rem', color: '#0f172a', width: '100%' }}
            />
          </div>
        </div>

        {/* Top Status Controls */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            overflowX: 'auto', 
            paddingBottom: '8px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE
          }}
        >
          {['All', 'Unread', 'Time Left', 'Expired', 'Started', 'Awaiting Response', 'Last Message From Lead', 'Failed', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatusFilter(status)}
              style={{
                padding: '0 16px',
                height: '36px',
                borderRadius: '8px',
                border: activeStatusFilter === status ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                background: activeStatusFilter === status ? '#eff6ff' : 'white',
                color: activeStatusFilter === status ? '#1d4ed8' : '#475569',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {status}
              <span style={{ 
                background: activeStatusFilter === status ? '#bfdbfe' : '#f1f5f9',
                color: activeStatusFilter === status ? '#1e40af' : '#64748b',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                {([
                  'Lead Name', 'Last Message', 'WhatsApp', 'Channel', 'Last Message Time', 
                  'Last Msg By Lead', 'Last Msg By User', 'Needs Attention', 'Time Left', 
                  'Recent Actions', 'Chat Owner', 'Lead Owner', 'Tags'
                ]).map(label => (
                  <th key={label} style={{ ...thStyle, width: `${colWidths[label]}px`, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>{label}</div>
                    <div 
                      onMouseDown={(e) => onMouseDown(e, label)}
                      style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 10 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#cbd5e1'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((conv) => (
                <tr 
                  key={conv.id}
                  onMouseEnter={() => setHoveredRowId(conv.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{ borderBottom: '1px solid #f1f5f9', background: selectedIds.has(conv.id) ? '#f5f7ff' : hoveredRowId === conv.id ? '#f8fafc' : 'white', transition: 'background 0.2s' }}
                >
                  <td style={{ ...tdStyle }}>
                    <div onClick={() => toggleSelect(conv.id)} style={{ cursor: 'pointer', color: selectedIds.has(conv.id) ? '#4f46e5' : '#cbd5e1' }}>
                      {selectedIds.has(conv.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  
                  {/* Lead Name with Hover Actions */}
                  <td style={{ ...tdStyle, position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                        {conv.avatarText}
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{conv.leadName}</span>
                    </div>
                    
                    {/* Hover Overlay Actions */}
                    <AnimatePresence>
                      {hoveredRowId === conv.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px', background: 'rgba(248,250,252,0.95)', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
                        >
                          <button style={{ padding: '6px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#10b981' }} title="Call" onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${conv.fullLead.phone || ''}`; }}><Phone size={14} /></button>
                          <button style={{ padding: '6px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6' }} title="Message" onClick={() => openSharedInbox({ entityType: 'lead', entityId: conv.fullLead.id })}><MessageSquare size={14} /></button>
                          <button style={{ padding: '6px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#8b5cf6' }} title="View Details" onClick={() => setSelectedLeadForWorkspace(conv.fullLead)}><Eye size={14} /></button>
                          <button style={{ padding: '6px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }} title="Edit"><MoreHorizontal size={14} /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>

                  <td style={{ ...tdStyle }} title={conv.lastMessage}>{conv.lastMessage}</td>
                  
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageCircle size={14} color={conv.whatsapp === 'Active' ? '#22c55e' : '#94a3b8'} />
                      <span style={{ fontSize: '0.75rem', color: conv.whatsapp === 'Active' ? '#16a34a' : '#64748b' }}>{conv.whatsapp}</span>
                    </div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    {conv.channel === 'WhatsApp' ? (
                      <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>WhatsApp</span>
                    ) : (
                      <span style={{ padding: '2px 8px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>Email</span>
                    )}
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div>{new Date(conv.lastMessageTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(conv.lastMessageTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div>{new Date(conv.lastMessageByLeadTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(conv.lastMessageByLeadTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div>{new Date(conv.lastMessageByUserTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(conv.lastMessageByUserTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    {conv.needsAttention ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                        <AlertCircle size={14} /> <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Action Req</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                        <CheckCircle2 size={14} /> <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>On Track</span>
                      </div>
                    )}
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    {conv.timeLeft === 'Expired' ? (
                      <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>Expired</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 500, fontSize: '0.8rem' }}>
                        {conv.timeLeft !== '-' && <Clock size={12} />} {conv.timeLeft}
                      </div>
                    )}
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>{conv.recentAction}</span>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 600 }}>{conv.chatOwner.charAt(0)}</div>
                      <span style={{ fontSize: '0.8rem' }}>{conv.chatOwner}</span>
                    </div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 600 }}>{conv.leadOwner.charAt(0)}</div>
                      <span style={{ fontSize: '0.8rem' }}>{conv.leadOwner}</span>
                    </div>
                  </td>
                  
                  <td style={{ ...tdStyle }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap' }}>
                      {conv.tags.map(t => (
                        <span key={t} style={{ padding: '2px 6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={14} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
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

      {selectedLeadForWorkspace && (
        <LeadWorkspaceModal isOpen={!!selectedLeadForWorkspace} onClose={() => setSelectedLeadForWorkspace(null)} lead={selectedLeadForWorkspace} />
      )}
    </div>
  );
}
