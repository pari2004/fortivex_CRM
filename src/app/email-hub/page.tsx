'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Search, Users, Clock, ExternalLink, MoreVertical, Copy, Eye, Info, Share2, AlertTriangle, X, Inbox } from 'lucide-react';

type Mailbox = {
  id: string;
  name: string;
  department: string;
  email: string;
  description: string;
  members: number;
  unread: number;
  lastActivity: string;
  icon: string;
  category: string;
  inboxLink: string;
};

const MAILBOXES: Mailbox[] = [
  { id: 'mb-1', name: 'Fortivex.AI Announcements', department: 'General', email: 'announcements@fortivex.ai', description: 'Company-wide announcements and updates.', members: 45, unread: 3, lastActivity: '1 hr ago', icon: '📣', category: 'Management', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-2', name: 'Admissions Desk', department: 'Admissions', email: 'admissions@fortivex.ai', description: 'Lead inquiries, admissions and follow-up emails.', members: 6, unread: 14, lastActivity: '3 minutes ago', icon: '🎓', category: 'Admissions', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-3', name: 'Sales Team', department: 'Sales', email: 'sales@fortivex.ai', description: 'Deal correspondence, quotes and revenue discussions.', members: 5, unread: 9, lastActivity: 'Just now', icon: '💼', category: 'Sales', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-4', name: 'Marketing Team', department: 'Marketing', email: 'marketing@fortivex.ai', description: 'Campaigns, newsletters and lead generation emails.', members: 4, unread: 6, lastActivity: '10 minutes ago', icon: '📢', category: 'Marketing', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-5', name: 'Student Support', department: 'Students', email: 'support@fortivex.ai', description: 'Student queries and support tickets via email.', members: 8, unread: 21, lastActivity: '5 minutes ago', icon: '🎒', category: 'Students', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-6', name: 'Trainers & Faculty', department: 'Faculty', email: 'faculty@fortivex.ai', description: 'Training schedules, batch communication, assignments.', members: 12, unread: 4, lastActivity: '25 minutes ago', icon: '📚', category: 'Management', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-7', name: 'Placement Team', department: 'Placements', email: 'placements@fortivex.ai', description: 'Placement drives, interview coordination, offer letters.', members: 7, unread: 11, lastActivity: '18 minutes ago', icon: '🏆', category: 'Management', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-8', name: 'HR Team', department: 'HR', email: 'hr@fortivex.ai', description: 'Attendance, recruitment and employee communication.', members: 5, unread: 7, lastActivity: '40 minutes ago', icon: '👥', category: 'HR', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-9', name: 'Finance Team', department: 'Finance', email: 'finance@fortivex.ai', description: 'Invoices, payment confirmations and fee reminders.', members: 4, unread: 16, lastActivity: '12 minutes ago', icon: '💰', category: 'Finance', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-10', name: 'IT Support', department: 'IT', email: 'it@fortivex.ai', description: 'CRM issues, bugs and technical support requests.', members: 3, unread: 5, lastActivity: 'Just now', icon: '🖥️', category: 'IT', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-11', name: 'Management', department: 'Management', email: 'management@fortivex.ai', description: 'Management announcements and strategic communication.', members: 6, unread: 2, lastActivity: '2 hr ago', icon: '👔', category: 'Management', inboxLink: 'https://mail.google.com/' },
  { id: 'mb-12', name: 'Alumni Network', department: 'Alumni', email: 'alumni@fortivex.ai', description: 'Alumni updates and placement communication.', members: 9, unread: 8, lastActivity: '30 minutes ago', icon: '🌐', category: 'Management', inboxLink: 'https://mail.google.com/' },
];

const FILTERS = ['All', 'Admissions', 'Sales', 'Marketing', 'Students', 'HR', 'Finance', 'IT', 'Management'];

const MENU_ITEMS = [
  { icon: <ExternalLink size={14} />, label: 'Open Inbox' },
  { icon: <Copy size={14} />, label: 'Copy Email Address' },
  { icon: <Users size={14} />, label: 'View Members' },
  { icon: <Eye size={14} />, label: 'View Description' },
  { icon: <Info size={14} />, label: 'Mailbox Information' },
  { icon: <Share2 size={14} />, label: 'Share Email Address' },
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

function MailboxCard({ mailbox }: { mailbox: Mailbox }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg: string) => {
    const el = document.createElement('div');
    el.innerText = msg;
    Object.assign(el.style, { position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 600, zIndex: '9999', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  const handleMenuAction = (label: string, mb: Mailbox) => {
    setMenuOpen(false);
    if (label === 'Open Inbox') { window.open(mb.inboxLink, '_blank', 'noopener,noreferrer'); return; }
    if (label === 'Copy Email Address') { navigator.clipboard.writeText(mb.email); showToast(`Copied: ${mb.email}`); return; }
    if (label === 'Share Email Address') { navigator.clipboard.writeText(mb.email); showToast(`Email address shared: ${mb.email}`); return; }
    showToast(`${label}: ${mb.name}`);
  };

  return (
    <div style={{ ...card, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(37,99,235,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '1px solid rgba(245,158,11,0.2)' }}>
            {mailbox.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>{mailbox.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, marginTop: '3px', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '99px', display: 'inline-block' }}>{mailbox.department}</div>
          </div>
        </div>

        {/* Unread badge + three-dot menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {mailbox.unread > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Inbox size={11} />{mailbox.unread} unread
            </div>
          )}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: menuOpen ? 'rgba(37,99,235,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s' }}>
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: '36px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '190px', overflow: 'hidden', padding: '6px' }}>
                {MENU_ITEMS.map(item => (
                  <button key={item.label} onClick={() => handleMenuAction(item.label, mailbox)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 500, color: (item as any).danger ? '#dc2626' : '#334155', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = (item as any).danger ? 'rgba(239,68,68,0.06)' : 'rgba(37,99,235,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <span style={{ color: (item as any).danger ? '#dc2626' : '#94a3b8' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email address */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(248,250,252,0.8)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.5)' }}>
        <Mail size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: '#475569', fontFamily: 'monospace' }}>{mailbox.email}</span>
      </div>

      {/* Description */}
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55 }}>{mailbox.description}</p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#475569' }}>
          <Users size={13} style={{ color: '#94a3b8' }} />
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{mailbox.members}</span> members
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#475569' }}>
          <Clock size={12} style={{ color: '#94a3b8' }} />
          {mailbox.lastActivity}
        </div>
      </div>

      {/* CTA */}
      <button onClick={() => window.open(mailbox.inboxLink, '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      >
        <Inbox size={16} /> Open Inbox
      </button>
    </div>
  );
}

export default function EmailHubPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = MAILBOXES.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.department.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || m.department === activeFilter || m.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const totalUnread = MAILBOXES.reduce((s, m) => s + m.unread, 0);
  const totalMembers = MAILBOXES.reduce((s, m) => s + m.members, 0);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero header */}
      <div style={{ ...card, padding: '32px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(37,99,235,0.06))', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(217,119,6,0.3)' }}>
              <Mail size={26} style={{ color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                Fortivex.AI <span style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Email Hub</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '4px 0 0' }}>Reach the right department instantly through connected mailboxes.</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Mailboxes', value: MAILBOXES.length, color: '#d97706' },
            { label: 'Total Members', value: totalMembers, color: '#2563eb' },
            { label: 'Total Unread', value: totalUnread, color: '#dc2626' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search mailbox name, department, or email…"
            style={{ width: '100%', height: '44px', paddingLeft: '42px', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#d97706'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}><X size={15} /></button>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '8px 18px', borderRadius: '99px', border: activeFilter === f ? '1px solid rgba(217,119,6,0.5)' : '1px solid rgba(226,232,240,0.8)', background: activeFilter === f ? 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08))' : 'rgba(255,255,255,0.7)', color: activeFilter === f ? '#d97706' : '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
        Showing <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> mailbox{filtered.length !== 1 ? 'es' : ''}
        {activeFilter !== 'All' && ` in ${activeFilter}`}
        {search && ` matching "${search}"`}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
        {filtered.map(mb => <MailboxCard key={mb.id} mailbox={mb} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Mail size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No mailboxes found</p>
          <p style={{ fontSize: '0.85rem' }}>Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
