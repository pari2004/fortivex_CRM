'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Send, CheckCheck, Star, Archive, Hash, 
  Pin, X, MoreVertical, HelpCircle, CheckCircle2, Clock, 
  AlertCircle, MessageSquare, Shield, Filter
} from 'lucide-react';

type TeamThread = {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  unread: number;
  members: string[];
  department: string;
  type: 'group' | 'direct';
  starred?: boolean;
  archived?: boolean;
  isSystemSupport?: boolean;
};

type TeamMsg = {
  id: string;
  from: string;
  text: string;
  time: string;
  avatar: string;
};

const INITIAL_TEAM_THREADS: TeamThread[] = [
  { id: 'TI-001', title: 'Admissions Team', lastMessage: 'Anjali: Updated the lead pipeline for August batch.', time: '5 min ago', unread: 3, members: ['Anjali Desai', 'Rahul Sharma', 'Vikram Singh'], department: 'Admissions', type: 'group' },
  { id: 'TI-002', title: 'Sales Huddle', lastMessage: 'Vikram: Closed 3 deals today! Total revenue: ₹7.2L.', time: '20 min ago', unread: 0, members: ['Vikram Singh', 'Priya Kapoor'], department: 'Sales', type: 'group' },
  { id: 'TI-003', title: 'Marketing Team', lastMessage: 'Rahul: Facebook ad CTR improved to 4.2%. Campaign is live.', time: '1 hr ago', unread: 1, members: ['Rahul Sharma', 'Anjali Desai'], department: 'Marketing', type: 'group' },
  { id: 'TI-004', title: 'Priya Kapoor', lastMessage: 'Can you send me the batch schedule for September?', time: '2 hr ago', unread: 2, members: ['Priya Kapoor', 'You'], department: 'Sales', type: 'direct' },
  { id: 'TI-005', title: 'Management Updates', lastMessage: 'Admin: Monthly target achieved. Great work team!', time: 'Yesterday', unread: 0, members: ['Admin', 'Anjali Desai', 'Rahul Sharma', 'Vikram Singh', 'Priya Kapoor'], department: 'Management', type: 'group' },
  { id: 'TI-006', title: '[Workspace] - Salesmax Support', lastMessage: 'Support Team: Your webhook configuration has been verified.', time: 'Just now', unread: 1, members: ['Salesmax Support Agent', 'System Bot', 'You'], department: 'Support', type: 'group', isSystemSupport: true },
];

const INITIAL_TEAM_MESSAGES: Record<string, TeamMsg[]> = {
  'TI-001': [
    { id: 'm1', from: 'Anjali Desai', text: 'Good morning team! Let\'s review today\'s lead pipeline.', time: '09:00 AM', avatar: 'A' },
    { id: 'm2', from: 'Rahul Sharma', text: 'I have 12 follow-ups scheduled for today. Will update by EOD.', time: '09:03 AM', avatar: 'R' },
    { id: 'm3', from: 'Vikram Singh', text: 'Already closed 2 deals this morning! Both MBA batch September.', time: '09:15 AM', avatar: 'V' },
    { id: 'm4', from: 'me', text: 'Great work Vikram! Anjali, can you update the pipeline status after the team call?', time: '09:18 AM', avatar: 'Y' },
    { id: 'm5', from: 'Anjali Desai', text: 'Updated the lead pipeline for August batch.', time: '09:22 AM', avatar: 'A' },
  ],
  'TI-006': [
    { id: 'sm1', from: 'Salesmax Support Agent', text: 'Welcome to your dedicated workspace support channel! How can our support team assist you today?', time: '10:00 AM', avatar: 'S' },
    { id: 'sm2', from: 'me', text: 'We noticed a delay in Exotel webhook events.', time: '10:05 AM', avatar: 'Y' },
    { id: 'sm3', from: 'Salesmax Support Agent', text: 'Support Team: Your webhook configuration has been verified. Latency is back to under 200ms.', time: '10:12 AM', avatar: 'S' }
  ]
};

const deptColors: Record<string, { bg: string; color: string }> = {
  'Admissions': { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'Sales':      { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'Marketing':  { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
  'Management': { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  'Support':    { bg: 'rgba(236,72,153,0.1)', color: '#db2777' },
};

const avatarGradients = ['linear-gradient(135deg,#2563eb,#7c3aed)', 'linear-gradient(135deg,#059669,#2563eb)', 'linear-gradient(135deg,#7c3aed,#db2777)', 'linear-gradient(135deg,#d97706,#ef4444)'];

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

// Web Audio API notification sound generator
function playMessageSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio context may be blocked before user gesture
  }
}

export default function TeamInboxPage() {
  const [threads, setThreads] = useState<TeamThread[]>(INITIAL_TEAM_THREADS);
  const [selectedId, setSelectedId] = useState('TI-001');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<Record<string, TeamMsg[]>>(INITIAL_TEAM_MESSAGES);

  // Filter chips state
  const [filterType, setFilterType] = useState<'ALL' | 'NEW' | 'UNREAD' | 'DIRECT' | 'GROUPS' | 'STARRED'>('ALL');
  const [countsLast7Days, setCountsLast7Days] = useState(true);

  // Floating Toast Notification state (bottom-left)
  const [toastNotification, setToastNotification] = useState<{
    sender: string;
    avatar: string;
    preview: string;
    unreadCount: number;
    pinned?: boolean;
  } | null>(null);

  // Follow-up sidebar state
  const [showFollowUpPanel, setShowFollowUpPanel] = useState(true);
  const [followUpTab, setFollowUpTab] = useState<'asked' | 'reply'>('asked');

  const selected = threads.find(t => t.id === selectedId) || threads[0];
  const activeMessages = messages[selected.id] || [
    { id: 'init-1', from: 'Team Member', text: selected.lastMessage, time: selected.time, avatar: 'T' },
  ];

  // Calculate live counts bar
  const totalCount = threads.length;
  const unreadCount = threads.reduce((acc, t) => acc + (t.unread > 0 ? 1 : 0), 0);
  const directCount = threads.filter(t => t.type === 'direct').length;
  const groupsCount = threads.filter(t => t.type === 'group').length;
  const starredCount = threads.filter(t => t.starred).length;

  const handleSendReply = () => {
    if (!reply.trim()) return;
    const newMsg: TeamMsg = {
      id: `msg-${Date.now()}`,
      from: 'me',
      text: reply.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'Y',
    };

    setMessages(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || activeMessages), newMsg],
    }));

    setThreads(prev => prev.map(t => t.id === selected.id ? { ...t, lastMessage: `me: ${reply.trim()}`, unread: 0, time: 'Just now' } : t));
    const sentText = reply.trim();
    setReply('');

    // Trigger notification sound & floating toast popup
    playMessageSound();
    setToastNotification({
      sender: 'You',
      avatar: 'Y',
      preview: sentText,
      unreadCount: 1,
    });
  };

  const handleToggleStar = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const handleArchive = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, archived: !t.archived } : t));
  };

  // Filter threads
  const filteredThreads = threads.filter(t => {
    if (t.archived) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType === 'UNREAD' || filterType === 'NEW') return t.unread > 0;
    if (filterType === 'DIRECT') return t.type === 'direct';
    if (filterType === 'GROUPS') return t.type === 'group';
    if (filterType === 'STARRED') return t.starred;
    return true;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 80px)', position: 'relative' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.12))' }}>
              <Users size={24} style={{ color: '#059669' }} />
            </div>
            Team Inbox
            <span style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
              {threads.reduce((s, t) => s + t.unread, 0)} unread
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>Shared inbox for team collaboration, support routing, and internal chat.</p>
        </div>

        <button 
          onClick={() => setShowFollowUpPanel(!showFollowUpPanel)}
          style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: showFollowUpPanel ? 'rgba(37,99,235,0.1)' : 'white', color: showFollowUpPanel ? '#2563eb' : '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <HelpCircle size={16} /> Follow-up Panel
        </button>
      </div>

      {/* Counts Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'ALL', label: 'ALL', count: totalCount },
            { id: 'NEW', label: 'NEW / UNREAD', count: unreadCount },
            { id: 'DIRECT', label: 'DIRECT', count: directCount },
            { id: 'GROUPS', label: 'GROUPS', count: groupsCount },
            { id: 'STARRED', label: 'STARRED', count: starredCount },
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id as any)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: filterType === chip.id ? 'none' : '1px solid rgba(226,232,240,0.8)',
                background: filterType === chip.id ? '#2563eb' : 'white', color: filterType === chip.id ? 'white' : '#64748b',
                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: filterType === chip.id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
              }}
            >
              {chip.label} <span style={{ background: filterType === chip.id ? 'rgba(255,255,255,0.25)' : 'rgba(100,116,139,0.1)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{chip.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
          <span>Counts last 7 days</span>
          <button 
            onClick={() => setCountsLast7Days(!countsLast7Days)} 
            style={{ width: '36px', height: '20px', borderRadius: '10px', background: countsLast7Days ? '#10b981' : '#cbd5e1', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
          >
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: countsLast7Days ? '18px' : '2px', transition: 'left 0.2s' }} />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Left Panel: Channel List */}
        <div style={{ ...card, width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channels..." style={{ width: '100%', height: '36px', paddingLeft: '32px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.83rem', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredThreads.map((thread, idx) => {
              const dc = deptColors[thread.department] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' };
              const isSelected = selected.id === thread.id;
              return (
                <div key={thread.id} onClick={() => { setSelectedId(thread.id); setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: 0 } : t)); }} style={{ padding: '13px 15px', cursor: 'pointer', background: isSelected ? 'rgba(16,185,129,0.06)' : 'transparent', borderLeft: isSelected ? '3px solid #059669' : '3px solid transparent', borderBottom: '1px solid rgba(226,232,240,0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px', transition: 'all 0.15s' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: avatarGradients[idx % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem' }}>
                      {thread.type === 'group' ? <Hash size={14} /> : thread.title.charAt(0)}
                    </div>
                    {thread.unread > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', width: '16px', height: '16px', borderRadius: '50%', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{thread.unread}</div>}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {thread.title} {thread.starred && <Star size={11} fill="#d97706" color="#d97706" />}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{thread.time}</span>
                    </div>
                    <p style={{ fontSize: '0.77rem', color: '#64748b', margin: '3px 0 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.lastMessage}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ background: dc.bg, color: dc.color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>{thread.department}</span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{thread.type.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Chat Window */}
        <div style={{ ...card, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          
          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: avatarGradients[0], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem' }}>
              {selected.type === 'group' ? <Hash size={20} /> : selected.title.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selected.title}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                  Channel Type: {selected.type.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                {selected.members.length} Participants ({selected.members.join(', ')}) · {selected.department}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button title="Search Chat" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><Search size={15} /></button>
              <button onClick={() => handleToggleStar(selected.id)} title="Star Channel" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: selected.starred ? 'rgba(245,158,11,0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: selected.starred ? '#d97706' : '#64748b' }}><Star size={15} fill={selected.starred ? '#d97706' : 'none'} /></button>
              <button onClick={() => handleArchive(selected.id)} title="Archive Channel" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><Archive size={15} /></button>
              <button title="More Options" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><MoreVertical size={15} /></button>
            </div>
          </div>

          {/* System/Support Channel Info Banner */}
          {selected.isSystemSupport && (
            <div style={{ padding: '12px 20px', background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))', borderBottom: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#1e3a8a', fontWeight: 500 }}>
                <strong>This is the exclusive support channel for your workspace.</strong> Technical and product support specialists monitor this channel 24/7.
              </div>
            </div>
          )}

          {/* Message History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeMessages.map((msg, i) => {
              const isMe = msg.from === 'me';
              const senderDisplayName = isMe ? 'You (Current User)' : msg.from;

              return (
                <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-end' }}>
                  {!isMe && <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: avatarGradients[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{msg.avatar}</div>}
                  
                  <div style={{ maxWidth: '60%' }}>
                    {/* Sender Name Label */}
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '4px', fontWeight: 700, textAlign: isMe ? 'right' : 'left' }}>
                      {senderDisplayName}
                    </div>

                    <div style={{ background: isMe ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.12))' : 'rgba(248,250,252,0.95)', border: isMe ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(226,232,240,0.8)', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.5 }}>{msg.text}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{msg.time}</span>
                        {isMe && <CheckCheck size={12} style={{ color: '#059669' }} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(226,232,240,0.5)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={reply} onChange={e => setReply(e.target.value)} placeholder={`Message ${selected.title}...`} onKeyDown={e => { if (e.key === 'Enter') handleSendReply(); }} style={{ flex: 1, height: '42px', paddingLeft: '16px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.88rem', outline: 'none', color: '#0f172a' }} />
            <button onClick={handleSendReply} style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #2563eb)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Panel: Follow-up Sidebar */}
        {showFollowUpPanel && (
          <div style={{ ...card, width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Follow-ups Tracker</span>
              <button onClick={() => setShowFollowUpPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(226,232,240,0.5)', background: 'rgba(248,250,252,0.5)' }}>
              <button
                onClick={() => setFollowUpTab('asked')}
                style={{ flex: 1, padding: '10px 8px', border: 'none', background: 'transparent', borderBottom: followUpTab === 'asked' ? '2px solid #2563eb' : 'none', color: followUpTab === 'asked' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Queries I asked - Open (2)
              </button>
              <button
                onClick={() => setFollowUpTab('reply')}
                style={{ flex: 1, padding: '10px 8px', border: 'none', background: 'transparent', borderBottom: followUpTab === 'reply' ? '2px solid #2563eb' : 'none', color: followUpTab === 'reply' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Queries to reply (1)
              </button>
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {followUpTab === 'asked' ? (
                <>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>September Batch Seat Matrix</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>To: Anjali Desai · 2 hours ago</div>
                    <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#d97706', fontSize: '0.75rem', fontWeight: 700 }}>Awaiting Response</span>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Exotel Webhook Latency Check</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>To: Salesmax Support · 1 day ago</div>
                    <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>Resolved</span>
                  </div>
                </>
              ) : (
                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Priya Kapoor: Batch schedule request</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>Due by 05:00 PM Today</div>
                  <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>Action Required</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Notification Popup (Bottom-Left) */}
      {toastNotification && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
          width: '320px', background: '#0f172a', color: 'white', borderRadius: '16px',
          padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', gap: '10px', animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>
              <MessageSquare size={14} /> Team ({toastNotification.unreadCount}/{toastNotification.unreadCount})
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setToastNotification({ ...toastNotification, pinned: !toastNotification.pinned })}
                style={{ background: 'none', border: 'none', color: toastNotification.pinned ? '#fbbf24' : '#94a3b8', cursor: 'pointer' }}
                title="Pin Notification"
              >
                <Pin size={14} />
              </button>
              <button 
                onClick={() => setToastNotification(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              {toastNotification.avatar}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{toastNotification.sender}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toastNotification.preview}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
