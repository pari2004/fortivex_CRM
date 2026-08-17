'use client';

import React, { useState } from 'react';
import { MessageSquare, Search, Send, CheckCheck, Star, Archive, Trash2, User, AlertCircle, Check } from 'lucide-react';

type Thread = {
  id: string;
  lead: string;
  phone: string;
  source: string;
  lastMessage: string;
  time: string;
  unread: number;
  counselor: string;
  priority: 'High' | 'Medium' | 'Low';
  tag: string;
  starred?: boolean;
  archived?: boolean;
};

type ChatMsg = {
  from: 'lead' | 'counselor';
  text: string;
  time: string;
};

const INITIAL_THREADS: Thread[] = [
  { id: 'LI-001', lead: 'Priya Reddy', phone: '+91 98712 34501', source: 'Facebook Ad', lastMessage: 'I want to know about the MBA evening batch timings.', time: '2 min ago', unread: 1, counselor: 'Anjali Desai', priority: 'High', tag: 'MBA' },
  { id: 'LI-002', lead: 'Arjun Kumar', phone: '+91 98712 34502', source: 'Google Ad', lastMessage: 'Can you share the brochure for BBA?', time: '10 min ago', unread: 2, counselor: 'Rahul Sharma', priority: 'High', tag: 'BBA' },
  { id: 'LI-003', lead: 'Sneha Patil', phone: '+91 98712 34503', source: 'Website', lastMessage: 'What is the last date for applications?', time: '45 min ago', unread: 0, counselor: 'Vikram Singh', priority: 'Medium', tag: 'BCA' },
  { id: 'LI-004', lead: 'Kiran Patel', phone: '+91 98712 34504', source: 'Referral', lastMessage: 'I was referred by Ananya. Is there a referral discount?', time: '1 hr ago', unread: 1, counselor: 'Priya Kapoor', priority: 'Medium', tag: 'MBA' },
  { id: 'LI-005', lead: 'Rohit Verma', phone: '+91 98712 34505', source: 'Instagram', lastMessage: 'Please connect me with a finance counselor.', time: '2 hr ago', unread: 0, counselor: 'Anjali Desai', priority: 'Low', tag: 'Finance' },
  { id: 'LI-006', lead: 'Ananya Rao', phone: '+91 98712 34506', source: 'Walk-in', lastMessage: 'My campus tour was great! What are the next steps?', time: '3 hr ago', unread: 3, counselor: 'Rahul Sharma', priority: 'High', tag: 'Admission' },
  { id: 'LI-007', lead: 'Aditya Singh', phone: '+91 98712 34507', source: 'LinkedIn', lastMessage: 'I need a seat in the September batch.', time: 'Yesterday', unread: 0, counselor: 'Vikram Singh', priority: 'High', tag: 'MBA' },
  { id: 'LI-008', lead: 'Meera Nair', phone: '+91 98712 34508', source: 'Website', lastMessage: 'When is the next batch starting?', time: 'Yesterday', unread: 0, counselor: 'Priya Kapoor', priority: 'Low', tag: 'BBA' },
];

const INITIAL_MESSAGES: Record<string, ChatMsg[]> = {
  'LI-001': [
    { from: 'lead', text: 'Hi! I saw your ad on Facebook about the MBA program. Can you tell me more?', time: '09:02 AM' },
    { from: 'counselor', text: 'Hello Priya! Welcome to Fortivex.AI. Our MBA program is designed for working professionals. It is an 18-month blended learning program with 100% placement assistance.', time: '09:05 AM' },
    { from: 'lead', text: 'That sounds interesting! What are the evening batch timings?', time: '09:08 AM' },
    { from: 'counselor', text: 'Our evening batch runs Mon–Fri from 7:00 PM to 9:00 PM and Saturdays 9:00 AM to 1:00 PM.', time: '09:10 AM' },
    { from: 'lead', text: 'Perfect! I want to know about the MBA evening batch timings.', time: '09:12 AM' },
  ],
};

const COUNSELORS = ['Anjali Desai', 'Rahul Sharma', 'Vikram Singh', 'Priya Kapoor'];

const priorityColors: Record<string, { bg: string; color: string }> = {
  'High':   { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  'Medium': { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  'Low':    { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

function showToast(msg: string) {
  const el = document.createElement('div');
  el.innerText = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a',
    color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem',
    fontWeight: 600, zIndex: '9999', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'opacity 0.3s'
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2500);
}

export default function LeadInboxPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [selectedId, setSelectedId] = useState('LI-001');
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMsg[]>>(INITIAL_MESSAGES);

  const selected = threads.find(t => t.id === selectedId) || threads[0];
  const activeMessages = messages[selected.id] || [
    { from: 'lead', text: selected.lastMessage, time: selected.time },
  ];

  const handleSendReply = () => {
    if (!reply.trim()) return;
    const newMsg: ChatMsg = {
      from: 'counselor',
      text: reply.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || activeMessages), newMsg],
    }));

    setThreads(prev => prev.map(t => t.id === selected.id ? { ...t, lastMessage: reply.trim(), unread: 0, time: 'Just now' } : t));
    setReply('');
    showToast(`Reply sent to ${selected.lead}!`);
  };

  const handleToggleStar = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
    showToast(selected.starred ? 'Unstarred thread' : 'Starred thread');
  };

  const handleArchive = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, archived: !t.archived } : t));
    showToast(selected.archived ? 'Unarchived thread' : 'Thread archived');
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete conversation thread with ${selected.lead}?`)) {
      const remaining = threads.filter(t => t.id !== id);
      setThreads(remaining);
      if (remaining.length > 0) setSelectedId(remaining[0].id);
      showToast('Conversation deleted');
    }
  };

  const handleReassign = (counselor: string) => {
    setThreads(prev => prev.map(t => t.id === selected.id ? { ...t, counselor } : t));
    showToast(`Assigned to ${counselor}`);
  };

  const handlePriorityChange = (priority: Thread['priority']) => {
    setThreads(prev => prev.map(t => t.id === selected.id ? { ...t, priority } : t));
    showToast(`Priority set to ${priority}`);
  };

  const filtered = threads.filter(t =>
    !t.archived &&
    (t.lead.toLowerCase().includes(search.toLowerCase()) ||
     t.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 80px)' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' }}>
            <MessageSquare size={24} style={{ color: '#2563eb' }} />
          </div>
          Lead Inbox
          <span style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
            {threads.reduce((sum, t) => sum + t.unread, 0)} unread
          </span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Centralised inbox for all inbound lead conversations.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Left panel */}
        <div style={{ ...card, width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…" style={{ width: '100%', height: '36px', paddingLeft: '32px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.83rem', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(thread => {
              const pc = priorityColors[thread.priority];
              const isSelected = selected.id === thread.id;
              return (
                <div key={thread.id} onClick={() => setSelectedId(thread.id)} style={{ padding: '13px 15px', cursor: 'pointer', background: isSelected ? 'rgba(37,99,235,0.06)' : 'transparent', borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s', borderBottom: '1px solid rgba(226,232,240,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.82rem' }}>{thread.lead.charAt(0)}</div>
                      {thread.unread > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', width: '16px', height: '16px', borderRadius: '50%', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{thread.unread}</div>}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {thread.lead} {thread.starred && <Star size={12} fill="#d97706" color="#d97706" />}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{thread.time}</span>
                      </div>
                      <p style={{ fontSize: '0.77rem', color: '#64748b', margin: '3px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.lastMessage}</p>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(148,163,184,0.1)', padding: '1px 6px', borderRadius: '4px' }}>{thread.source}</span>
                        <span style={{ background: pc.bg, color: pc.color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>{thread.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chat */}
        <div style={{ ...card, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Thread Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{selected.lead.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{selected.lead} <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>({selected.phone})</span></div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span>Source: {selected.source}</span>
                <span>·</span>
                {/* Counselor select */}
                <select value={selected.counselor} onChange={e => handleReassign(e.target.value)} style={{ padding: '2px 6px', borderRadius: '6px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.72rem', background: 'white', color: '#0f172a', outline: 'none' }}>
                  {COUNSELORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {/* Priority select */}
                <select value={selected.priority} onChange={e => handlePriorityChange(e.target.value as any)} style={{ padding: '2px 6px', borderRadius: '6px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.72rem', background: priorityColors[selected.priority].bg, color: priorityColors[selected.priority].color, fontWeight: 700, outline: 'none' }}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleToggleStar(selected.id)} title="Star lead" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: selected.starred ? 'rgba(245,158,11,0.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: selected.starred ? '#d97706' : '#64748b' }}>
                <Star size={15} fill={selected.starred ? '#d97706' : 'none'} />
              </button>
              <button onClick={() => handleArchive(selected.id)} title="Archive thread" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <Archive size={15} />
              </button>
              <button onClick={() => handleDelete(selected.id)} title="Delete conversation" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeMessages.map((msg, i) => {
              const isLead = msg.from === 'lead';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isLead ? 'flex-start' : 'flex-end' }}>
                  <div style={{ maxWidth: '60%', background: isLead ? 'rgba(248,250,252,0.9)' : 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))', border: isLead ? '1px solid rgba(226,232,240,0.6)' : '1px solid rgba(37,99,235,0.15)', borderRadius: isLead ? '4px 16px 16px 16px' : '16px 4px 16px 16px', padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#0f172a', lineHeight: 1.5 }}>{msg.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{msg.time}</span>
                      {!isLead && <CheckCheck size={12} style={{ color: '#2563eb' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Box */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(226,232,240,0.5)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder={`Reply to ${selected.lead}…`}
              onKeyDown={e => { if (e.key === 'Enter') handleSendReply(); }}
              style={{ flex: 1, height: '42px', paddingLeft: '16px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.88rem', outline: 'none', color: '#0f172a' }}
            />
            <button
              onClick={handleSendReply}
              style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
