'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MessageSquare, Search, Send, CheckCheck, Filter, Users, Wifi, Clock, 
  ExternalLink, MoreVertical, Copy, Eye, Info, Share2, AlertTriangle, X, MessageCircle 
} from 'lucide-react';

type Message = {
  id: string;
  lead: string;
  phone: string;
  channel: 'WhatsApp' | 'SMS' | 'In-App';
  lastMessage: string;
  time: string;
  unread: number;
  counselor: string;
  status: 'active' | 'resolved' | 'pending';
};

const MOCK_THREADS: Message[] = [
  { id: 'MSG-001', lead: 'Priya Reddy',   phone: '+91 98712 34501', channel: 'WhatsApp', lastMessage: 'Thank you! I will submit the documents by tomorrow.', time: '2 min ago',   unread: 0, counselor: 'Anjali Desai',  status: 'active' },
  { id: 'MSG-002', lead: 'Arjun Kumar',   phone: '+91 98712 34502', channel: 'WhatsApp', lastMessage: 'Can you share the fee structure again?',              time: '15 min ago',  unread: 2, counselor: 'Rahul Sharma',  status: 'active' },
  { id: 'MSG-003', lead: 'Sneha Patil',   phone: '+91 98712 34503', channel: 'SMS',      lastMessage: 'Reminder: Your admission deadline is Aug 15.',        time: '1 hr ago',    unread: 0, counselor: 'Vikram Singh',  status: 'resolved' },
  { id: 'MSG-004', lead: 'Kiran Patel',   phone: '+91 98712 34504', channel: 'WhatsApp', lastMessage: 'I am interested in the MBA batch starting September.', time: '3 hr ago',    unread: 1, counselor: 'Priya Kapoor',  status: 'pending' },
  { id: 'MSG-005', lead: 'Rohit Verma',   phone: '+91 98712 34505', channel: 'In-App',   lastMessage: 'Please connect me with the finance team regarding loans.', time: 'Yesterday', unread: 0, counselor: 'Anjali Desai',  status: 'active' },
  { id: 'MSG-006', lead: 'Ananya Rao',    phone: '+91 98712 34506', channel: 'WhatsApp', lastMessage: 'The campus tour was amazing! When do I get the offer letter?', time: 'Yesterday', unread: 3, counselor: 'Rahul Sharma',  status: 'active' },
  { id: 'MSG-007', lead: 'Aditya Singh',  phone: '+91 98712 34507', channel: 'SMS',      lastMessage: 'Confirmed for batch. Payment pending.',                time: '2 days ago',  unread: 0, counselor: 'Vikram Singh',  status: 'resolved' },
  { id: 'MSG-008', lead: 'Meera Nair',    phone: '+91 98712 34508', channel: 'WhatsApp', lastMessage: 'My parents want to speak with the faculty coordinator.', time: '2 days ago',  unread: 1, counselor: 'Priya Kapoor',  status: 'pending' },
];

const chatMessages = [
  { from: 'lead',      text: 'Hi, I saw your ad for the MBA program. Can you share the details?', time: '10:02 AM' },
  { from: 'counselor', text: 'Hello Priya! Welcome to Fortivex.AI. I\'d be happy to help. Our MBA program runs for 18 months with 100% placement support.', time: '10:05 AM' },
  { from: 'lead',      text: 'What is the total fee and are there any scholarships?', time: '10:08 AM' },
  { from: 'counselor', text: 'The total fee is ₹2.4L for the full program. We offer merit-based scholarships up to 30% for qualifying students.', time: '10:10 AM' },
  { from: 'lead',      text: 'That sounds good! What are the documents needed for admission?', time: '10:14 AM' },
  { from: 'counselor', text: 'You\'ll need: 10th & 12th marksheets, graduation certificate, Aadhar card, and 2 passport photos. Shall I send you our admission form?', time: '10:16 AM' },
  { from: 'lead',      text: 'Thank you! I will submit the documents by tomorrow.', time: '10:32 AM' },
];

const channelColors: Record<string, { bg: string; color: string }> = {
  'WhatsApp': { bg: 'rgba(37,211,102,0.1)',  color: '#16a34a' },
  'SMS':      { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'In-App':   { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'active':   { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  'resolved': { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  'pending':  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
};

// ── WhatsApp Groups Data ──
type WAGroup = {
  id: string;
  name: string;
  department: string;
  description: string;
  members: number;
  online: number;
  lastActivity: string;
  icon: string;
  inviteLink: string;
};

const WA_GROUPS: WAGroup[] = [
  { id: 'wg-1',  name: 'Fortivex.AI Community', department: 'Management', description: 'Official community for announcements and updates.', members: 312, online: 87, lastActivity: '1 min ago', icon: '🏢', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-2',  name: 'Admission Counselors', department: 'Admissions', description: 'Counselors discuss leads, admissions and follow-ups.', members: 24, online: 12, lastActivity: '2 minutes ago', icon: '🎓', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-3',  name: 'Sales Team', department: 'Sales', description: 'Sales pipeline, deals and revenue discussions.', members: 18, online: 8, lastActivity: 'Just now', icon: '💼', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-4',  name: 'Marketing Team', department: 'Marketing', description: 'Campaign planning and lead generation.', members: 15, online: 7, lastActivity: '5 minutes ago', icon: '📢', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-5',  name: 'Student Support', department: 'Students', description: 'Student queries and support.', members: 42, online: 18, lastActivity: '3 minutes ago', icon: '🎒', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-6',  name: 'Trainers & Faculty', department: 'Management', description: 'Training schedules, batches and assignments.', members: 29, online: 11, lastActivity: '8 minutes ago', icon: '📚', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-7',  name: 'Placement Team', department: 'Management', description: 'Placement drives, interviews and offers.', members: 16, online: 6, lastActivity: '12 minutes ago', icon: '🏆', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-8',  name: 'HR Team', department: 'HR', description: 'Attendance, recruitment and employee updates.', members: 11, online: 4, lastActivity: '20 minutes ago', icon: '👥', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-9',  name: 'Finance Team', department: 'Finance', description: 'Payments, invoices and fee collection.', members: 9, online: 3, lastActivity: '15 minutes ago', icon: '💰', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-10', name: 'IT Support', department: 'IT', description: 'CRM issues, bugs and technical support.', members: 7, online: 5, lastActivity: 'Just now', icon: '🖥️', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-11', name: 'Management', department: 'Management', description: 'Management announcements and strategic discussions.', members: 8, online: 3, lastActivity: '35 minutes ago', icon: '👔', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-12', name: 'Alumni Network', department: 'Management', description: 'Communication with alumni and placement updates.', members: 148, online: 32, lastActivity: '10 minutes ago', icon: '🌐', inviteLink: 'https://web.whatsapp.com/' },
];

const GROUP_FILTERS = ['All', 'Admissions', 'Sales', 'Marketing', 'Students', 'HR', 'Finance', 'IT', 'Management'];

const MENU_ITEMS = [
  { icon: <ExternalLink size={14} />, label: 'Open Group' },
  { icon: <Copy size={14} />, label: 'Copy Invite Link' },
  { icon: <Users size={14} />, label: 'View Members' },
  { icon: <Eye size={14} />, label: 'View Description' },
  { icon: <Info size={14} />, label: 'Group Information' },
  { icon: <Share2 size={14} />, label: 'Share Link' },
  { icon: <AlertTriangle size={14} />, label: 'Report Issue', danger: true },
];

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

const CHANNEL_TABS = ['All', 'WhatsApp', 'SMS', 'In-App', 'Groups'] as const;
type ChannelTab = typeof CHANNEL_TABS[number];

function showToast(msg: string) {
  const el = document.createElement('div');
  el.innerText = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a',
    color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem',
    fontWeight: 600, zIndex: '9999', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function GroupCard({ group }: { group: WAGroup }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMenuAction = (label: string, group: WAGroup) => {
    setMenuOpen(false);
    if (label === 'Open Group') {
      window.open(group.inviteLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (label === 'Copy Invite Link') {
      navigator.clipboard.writeText(group.inviteLink);
      showToast('Invite link copied!');
      return;
    }
    showToast(`${label}: ${group.name}`);
  };

  return (
    <div style={{
      ...card, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px',
      transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative'
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)';
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,99,235,0.12))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', flexShrink: 0, border: '1px solid rgba(37,211,102,0.2)'
          }}>
            {group.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>{group.name}</div>
            <div style={{
              fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '3px',
              background: 'rgba(37,211,102,0.1)', padding: '2px 8px', borderRadius: '99px',
              display: 'inline-block'
            }}>
              {group.department}
            </div>
          </div>
        </div>

        {/* Three-dot menu */}
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: '1px solid rgba(226,232,240,0.6)',
              background: menuOpen ? 'rgba(37,99,235,0.06)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.15s'
            }}
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '36px',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)', borderRadius: '14px',
              border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
              zIndex: 100, minWidth: '180px', overflow: 'hidden', padding: '6px'
            }}>
              {MENU_ITEMS.map(item => (
                <button
                  key={item.label}
                  onClick={() => handleMenuAction(item.label, group)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    padding: '9px 12px', borderRadius: '8px', border: 'none',
                    background: 'transparent', cursor: 'pointer', fontSize: '0.84rem',
                    fontWeight: 500, color: item.danger ? '#dc2626' : '#334155',
                    textAlign: 'left', transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = item.danger ? 'rgba(239,68,68,0.06)' : 'rgba(37,99,235,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ color: item.danger ? '#dc2626' : '#94a3b8' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55 }}>{group.description}</p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#475569' }}>
          <Users size={13} style={{ color: '#94a3b8' }} />
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{group.members}</span> members
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#475569' }}>
          <Wifi size={13} style={{ color: '#16a34a' }} />
          <span style={{ fontWeight: 700, color: '#16a34a' }}>{group.online}</span> online
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
          <Clock size={12} />
          {group.lastActivity}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => window.open(group.inviteLink, '_blank', 'noopener,noreferrer')}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(135deg, #16a34a, #059669)', color: 'white',
          fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'opacity 0.2s'
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      >
        <MessageCircle size={16} /> Open Group
      </button>
    </div>
  );
}

export default function MessagesPage() {
  const [selected, setSelected]         = useState(MOCK_THREADS[0]);
  const [search, setSearch]             = useState('');
  const [reply, setReply]               = useState('');
  const [channelTab, setChannelTab]     = useState<ChannelTab>('All');
  const [localMessages, setLocalMessages] = useState(chatMessages);

  // Groups state
  const [groupSearch, setGroupSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');

  const filteredThreads = useMemo(() =>
    MOCK_THREADS.filter(t => {
      const matchSearch  = t.lead.toLowerCase().includes(search.toLowerCase()) || t.channel.toLowerCase().includes(search.toLowerCase());
      const matchChannel = channelTab === 'All' || t.channel === channelTab;
      return matchSearch && matchChannel;
    }),
    [search, channelTab]
  );

  const filteredGroups = useMemo(() =>
    WA_GROUPS.filter(g => {
      const matchSearch = g.name.toLowerCase().includes(groupSearch.toLowerCase()) || g.department.toLowerCase().includes(groupSearch.toLowerCase());
      const matchFilter = groupFilter === 'All' || g.department === groupFilter;
      return matchSearch && matchFilter;
    }),
    [groupSearch, groupFilter]
  );

  const sendReply = () => {
    if (!reply.trim()) return;
    setLocalMessages(prev => [...prev, { from: 'counselor', text: reply.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setReply('');
  };

  const isGroupsTab = channelTab === 'Groups';

  return (
    <div style={{
      padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px',
      height: isGroupsTab ? 'auto' : 'calc(100vh - 80px)',
      overflowY: isGroupsTab ? 'visible' : 'hidden'
    }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(16,185,129,0.12))' }}>
            <MessageSquare size={24} style={{ color: '#2563eb' }} />
          </div>
          Messages & WhatsApp
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Direct messaging across WhatsApp, SMS, In-App channels, and group communities.</p>
      </div>

      {/* Channel Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CHANNEL_TABS.map(tab => {
          const isWA = tab === 'WhatsApp';
          const isGrp = tab === 'Groups';
          const active = channelTab === tab;
          const waActiveStyle = active && isWA ? { background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.4)', color: '#16a34a' } : {};
          const grpActiveStyle = active && isGrp ? { background: 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(37,99,235,0.12))', border: '1px solid rgba(22,163,74,0.4)', color: '#16a34a' } : {};

          return (
            <button
              key={tab}
              onClick={() => setChannelTab(tab)}
              style={{
                padding: '7px 18px', borderRadius: '99px',
                border: active ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(226,232,240,0.8)',
                background: active ? 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(16,185,129,0.1))' : 'rgba(255,255,255,0.7)',
                color: active ? '#2563eb' : '#64748b',
                fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
                ...(active && isWA ? waActiveStyle : {}),
                ...(active && isGrp ? grpActiveStyle : {}),
              }}
            >
              {tab === 'WhatsApp' && <span style={{ fontSize: '0.9em' }}>💬</span>}
              {tab === 'Groups' && <Users size={14} style={{ color: active ? '#16a34a' : '#64748b' }} />}
              {tab}
              {tab !== 'All' && tab !== 'Groups' && (
                <span style={{ background: channelTab === tab ? 'rgba(37,99,235,0.15)' : 'rgba(148,163,184,0.15)', color: channelTab === tab ? '#2563eb' : '#94a3b8', borderRadius: '99px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {MOCK_THREADS.filter(t => t.channel === tab).length}
                </span>
              )}
              {tab === 'Groups' && (
                <span style={{ background: channelTab === tab ? 'rgba(22,163,74,0.15)' : 'rgba(148,163,184,0.15)', color: channelTab === tab ? '#16a34a' : '#94a3b8', borderRadius: '99px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {WA_GROUPS.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: GROUPS TAB CONTENT (WhatsApp Hub) */}
      {isGroupsTab ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* WhatsApp Hub Header Banner */}
          <div style={{
            ...card, padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,99,235,0.06))',
            borderRadius: '24px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #16a34a, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(22,163,74,0.3)'
              }}>
                <MessageCircle size={26} style={{ color: 'white' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                  Fortivex.AI <span style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WhatsApp Hub</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '4px 0 0' }}>Connect instantly with different departments and communities.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Total Groups', value: WA_GROUPS.length, color: '#16a34a' },
                { label: 'Total Members', value: WA_GROUPS.reduce((s, g) => s + g.members, 0).toLocaleString(), color: '#2563eb' },
                { label: 'Online Now', value: WA_GROUPS.reduce((s, g) => s + g.online, 0), color: '#059669' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search + Filter Chips */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                value={groupSearch}
                onChange={e => setGroupSearch(e.target.value)}
                placeholder="Search group name or department…"
                style={{
                  width: '100%', height: '44px', paddingLeft: '42px', paddingRight: groupSearch ? '38px' : '14px',
                  borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)',
                  background: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', color: '#0f172a',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#16a34a'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'; }}
              />
              {groupSearch && (
                <button onClick={() => setGroupSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  <X size={15} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {GROUP_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setGroupFilter(f)}
                  style={{
                    padding: '8px 18px', borderRadius: '99px',
                    border: groupFilter === f ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(226,232,240,0.8)',
                    background: groupFilter === f ? 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(5,150,105,0.08))' : 'rgba(255,255,255,0.7)',
                    color: groupFilter === f ? '#16a34a' : '#64748b',
                    fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
            Showing <strong style={{ color: '#0f172a' }}>{filteredGroups.length}</strong> group{filteredGroups.length !== 1 ? 's' : ''}
            {groupFilter !== 'All' && ` in ${groupFilter}`}
            {groupSearch && ` matching "${groupSearch}"`}
          </div>

          {/* Group Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
            {filteredGroups.map(group => <GroupCard key={group.id} group={group} />)}
          </div>

          {filteredGroups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <MessageCircle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>No groups found</p>
              <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>Try adjusting your search or filter</p>
            </div>
          )}

        </div>
      ) : (

        /* VIEW 2: 1:1 MESSAGES SPLIT PANEL (All, WhatsApp, SMS, In-App) */
        <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Left: Thread List */}
          <div style={{ ...card, width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" style={{ width: '100%', height: '38px', paddingLeft: '36px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.85rem', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredThreads.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.86rem' }}>No {channelTab !== 'All' ? channelTab : ''} conversations found.</div>
              )}
              {filteredThreads.map(thread => {
                const cc = channelColors[thread.channel];
                const isSelected = selected.id === thread.id;
                return (
                  <div key={thread.id} onClick={() => setSelected(thread)} style={{ padding: '14px 16px', cursor: 'pointer', background: isSelected ? 'rgba(37,99,235,0.06)' : 'transparent', borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, position: 'relative' }}>
                      {thread.lead.charAt(0)}
                      {thread.unread > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', width: '16px', height: '16px', borderRadius: '50%', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{thread.unread}</div>}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{thread.lead}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{thread.time}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.lastMessage}</p>
                      <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
                        <span style={{ background: cc.bg, color: cc.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px' }}>{thread.channel}</span>
                        <span style={{ background: statusColors[thread.status].bg, color: statusColors[thread.status].color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', textTransform: 'capitalize' }}>{thread.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Chat Panel */}
          <div style={{ ...card, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* Chat header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{selected.lead.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{selected.lead}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selected.phone} · Assigned to {selected.counselor}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: channelColors[selected.channel].bg, color: channelColors[selected.channel].color, padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>{selected.channel}</span>
                <span style={{ background: statusColors[selected.status].bg, color: statusColors[selected.status].color, padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{selected.status}</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {localMessages.map((msg, i) => {
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

            {/* Reply box */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(226,232,240,0.5)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder={`Reply via ${selected.channel}…`} onKeyDown={e => { if (e.key === 'Enter') sendReply(); }} style={{ flex: 1, height: '42px', paddingLeft: '16px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.88rem', outline: 'none', color: '#0f172a' }} />
              <button onClick={sendReply} style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
