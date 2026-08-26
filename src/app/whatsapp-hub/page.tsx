'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Search, Users, Wifi, Clock, ExternalLink, MoreVertical, Copy, Eye, Info, Share2, AlertTriangle, X } from 'lucide-react';

type WAGroup = {
  id: string;
  name: string;
  department: string;
  description: string;
  members: number;
  online: number;
  lastActivity: string;
  icon: string;
  category: string;
  inviteLink: string;
};

const GROUPS: WAGroup[] = [
  { id: 'wg-1', name: 'Fortivex.AI Community', department: 'General', description: 'Official community for announcements and updates.', members: 312, online: 87, lastActivity: '1 min ago', icon: '🏢', category: 'Management', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-2', name: 'Admission Counselors', department: 'Admissions', description: 'Counselors discuss leads, admissions and follow-ups.', members: 24, online: 12, lastActivity: '2 minutes ago', icon: '🎓', category: 'Admissions', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-3', name: 'Sales Team', department: 'Sales', description: 'Sales pipeline, deals and revenue discussions.', members: 18, online: 8, lastActivity: 'Just now', icon: '💼', category: 'Sales', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-4', name: 'Marketing Team', department: 'Marketing', description: 'Campaign planning and lead generation.', members: 15, online: 7, lastActivity: '5 minutes ago', icon: '📢', category: 'Marketing', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-5', name: 'Student Support', department: 'Students', description: 'Student queries and support.', members: 42, online: 18, lastActivity: '3 minutes ago', icon: '🎒', category: 'Students', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-6', name: 'Trainers & Faculty', department: 'Faculty', description: 'Training schedules, batches and assignments.', members: 29, online: 11, lastActivity: '8 minutes ago', icon: '📚', category: 'Management', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-7', name: 'Placement Team', department: 'Placements', description: 'Placement drives, interviews and offers.', members: 16, online: 6, lastActivity: '12 minutes ago', icon: '🏆', category: 'Management', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-8', name: 'HR Team', department: 'HR', description: 'Attendance, recruitment and employee updates.', members: 11, online: 4, lastActivity: '20 minutes ago', icon: '👥', category: 'HR', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-9', name: 'Finance Team', department: 'Finance', description: 'Payments, invoices and fee collection.', members: 9, online: 3, lastActivity: '15 minutes ago', icon: '💰', category: 'Finance', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-10', name: 'IT Support', department: 'IT', description: 'CRM issues, bugs and technical support.', members: 7, online: 5, lastActivity: 'Just now', icon: '🖥️', category: 'IT', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-11', name: 'Management', department: 'Management', description: 'Management announcements and strategic discussions.', members: 8, online: 3, lastActivity: '35 minutes ago', icon: '👔', category: 'Management', inviteLink: 'https://web.whatsapp.com/' },
  { id: 'wg-12', name: 'Alumni Network', department: 'Alumni', description: 'Communication with alumni and placement updates.', members: 148, online: 32, lastActivity: '10 minutes ago', icon: '🌐', category: 'Management', inviteLink: 'https://web.whatsapp.com/' },
];

const FILTERS = ['All', 'Admissions', 'Sales', 'Marketing', 'Students', 'HR', 'Finance', 'IT', 'Management'];

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
    if (label === 'Open Group') { window.open(group.inviteLink, '_blank', 'noopener,noreferrer'); return; }
    if (label === 'Copy Invite Link') { navigator.clipboard.writeText(group.inviteLink); showToast('Invite link copied!'); return; }
    showToast(`${label}: ${group.name}`);
  };

  const showToast = (msg: string) => {
    const el = document.createElement('div');
    el.innerText = msg;
    Object.assign(el.style, { position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 600, zIndex: '9999', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };

  return (
    <div style={{ ...card, padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,99,235,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '1px solid rgba(37,211,102,0.2)' }}>
            {group.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>{group.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '3px', background: 'rgba(37,211,102,0.1)', padding: '2px 8px', borderRadius: '99px', display: 'inline-block' }}>{group.department}</div>
          </div>
        </div>

        {/* Three-dot menu */}
        <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: menuOpen ? 'rgba(37,99,235,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s' }}>
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: '36px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '180px', overflow: 'hidden', padding: '6px' }}>
              {MENU_ITEMS.map(item => (
                <button key={item.label} onClick={() => handleMenuAction(item.label, group)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 500, color: (item as any).danger ? '#dc2626' : '#334155', textAlign: 'left', transition: 'background 0.15s' }}
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
      <button onClick={() => window.open(group.inviteLink, '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #16a34a, #059669)', color: 'white', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      >
        <MessageCircle size={16} /> Open Group
      </button>
    </div>
  );
}

export default function WhatsAppHubPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = GROUPS.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.department.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || g.department === activeFilter || g.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const totalOnline = GROUPS.reduce((s, g) => s + g.online, 0);
  const totalMembers = GROUPS.reduce((s, g) => s + g.members, 0);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero header */}
      <div style={{ ...card, padding: '32px', background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,99,235,0.06))', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #16a34a, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(22,163,74,0.3)' }}>
              <MessageCircle size={26} style={{ color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                Fortivex.AI <span style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WhatsApp Hub</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '4px 0 0' }}>Connect instantly with different departments and communities.</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Total Groups', value: GROUPS.length, color: '#16a34a' },
            { label: 'Total Members', value: totalMembers.toLocaleString(), color: '#2563eb' },
            { label: 'Online Now', value: totalOnline, color: '#059669' },
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
            placeholder="Search group name or department…"
            style={{ width: '100%', height: '44px', paddingLeft: '42px', borderRadius: '14px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}><X size={15} /></button>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '8px 18px', borderRadius: '99px', border: activeFilter === f ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(226,232,240,0.8)', background: activeFilter === f ? 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(5,150,105,0.08))' : 'rgba(255,255,255,0.7)', color: activeFilter === f ? '#16a34a' : '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
        Showing <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> group{filtered.length !== 1 ? 's' : ''}
        {activeFilter !== 'All' && ` in ${activeFilter}`}
        {search && ` matching "${search}"`}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
        {filtered.map(group => <GroupCard key={group.id} group={group} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <MessageCircle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No groups found</p>
          <p style={{ fontSize: '0.85rem' }}>Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
