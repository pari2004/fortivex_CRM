'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, Users, Plus, Search, Eye, X } from 'lucide-react';

type Broadcast = {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  targetAudience: string;
  recipientsCount: number;
  sentTime: string;
  delivered: number;
  read: number;
  responded: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
  messageText?: string;
};

const INITIAL_BROADCASTS: Broadcast[] = [
  { id: 'BC-001', name: 'August MBA Batch Application Reminder', channel: 'WhatsApp', targetAudience: 'All MBA Leads', recipientsCount: 1240, sentTime: '2026-08-08 10:00 AM', delivered: 1210, read: 980, responded: 142, status: 'Sent', messageText: 'Reminder: Applications for the August MBA batch close on Aug 15th! Click here to complete your application.' },
  { id: 'BC-002', name: 'BBA Open Day Campus Tour Invite', channel: 'Email', targetAudience: 'BBA Enquiries (July)', recipientsCount: 850, sentTime: '2026-08-07 02:00 PM', delivered: 832, read: 412, responded: 68, status: 'Sent', messageText: 'Join us for BBA Open Day this Saturday! Meet faculty & explore our high-tech labs.' },
  { id: 'BC-003', name: 'Early Bird Scholarship Offer', channel: 'SMS', targetAudience: 'Unconverted High Priority Leads', recipientsCount: 320, sentTime: '2026-08-06 11:30 AM', delivered: 315, read: 290, responded: 45, status: 'Sent', messageText: 'Avail up to 25% Early Bird Scholarship on all PG courses. Offer valid till Sunday!' },
  { id: 'BC-004', name: 'Webinar: Careers in Financial Analytics', channel: 'WhatsApp', targetAudience: 'Finance Lead Segment', recipientsCount: 600, sentTime: '2026-08-10 05:00 PM', delivered: 0, read: 0, responded: 0, status: 'Scheduled', messageText: 'Live Webinar tomorrow at 5 PM on Careers in Financial Analytics with industry experts.' },
  { id: 'BC-005', name: 'September Intake Opening Announcement', channel: 'Email', targetAudience: 'All Lead Database', recipientsCount: 4500, sentTime: 'Draft', delivered: 0, read: 0, responded: 0, status: 'Draft', messageText: 'Admissions for September 2026 Intake are now OPEN across all undergraduate & postgraduate programs.' },
];

const channelColors: Record<string, { bg: string; color: string }> = {
  'WhatsApp': { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'SMS':      { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
  'Email':    { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'Sent':      { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'Scheduled': { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'Draft':     { bg: 'rgba(100,116,139,0.1)',color: '#475569' },
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid rgba(226,232,240,0.9)',
  background: 'rgba(248,250,252,0.85)',
  fontSize: '0.88rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
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

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [search, setSearch]         = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [isLoaded, setIsLoaded]     = useState(false);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<Broadcast | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_broadcasts');
    if (saved) {
      try { setBroadcasts(JSON.parse(saved)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_broadcasts', JSON.stringify(broadcasts));
    }
  }, [broadcasts, isLoaded]);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const channel = fd.get('channel') as Broadcast['channel'];
    const count = parseInt(fd.get('recipientsCount') as string) || 500;
    const isSchedule = fd.get('scheduleTime') as string;

    const newBc: Broadcast = {
      id: `BC-0${broadcasts.length + 1}`.padStart(6, '0'),
      name: fd.get('name') as string,
      channel,
      targetAudience: fd.get('targetAudience') as string,
      recipientsCount: count,
      sentTime: isSchedule ? isSchedule.replace('T', ' ') : new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      delivered: isSchedule ? 0 : Math.round(count * 0.97),
      read: isSchedule ? 0 : Math.round(count * 0.72),
      responded: isSchedule ? 0 : Math.round(count * 0.15),
      status: isSchedule ? 'Scheduled' : 'Sent',
      messageText: fd.get('messageText') as string,
    };

    setBroadcasts(prev => [newBc, ...prev]);
    setCreateOpen(false);
    showToast(`Broadcast "${newBc.name}" created!`);
  };

  const filtered = broadcasts.filter(b => {
    const matchSearch  = b.name.toLowerCase().includes(search.toLowerCase()) || b.targetAudience.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'All' || b.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalDelivered = broadcasts.reduce((s, b) => s + b.delivered, 0);
  const totalRead      = broadcasts.reduce((s, b) => s + b.read, 0);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))' }}>
              <Send size={24} style={{ color: '#db2777' }} />
            </div>
            Broadcast Campaigns
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Send mass messages via WhatsApp, SMS, and Email to targeted lead segments.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> New Broadcast
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Broadcasts', value: broadcasts.length, color: '#7c3aed', icon: <Send size={20} /> },
          { label: 'Total Delivered',  value: totalDelivered.toLocaleString(), color: '#059669', icon: <CheckCircle size={20} /> },
          { label: 'Total Read',       value: totalRead.toLocaleString(), color: '#2563eb', icon: <Users size={20} /> },
          { label: 'Avg Read Rate',    value: totalDelivered > 0 ? `${Math.round((totalRead / totalDelivered) * 100)}%` : '0%', color: '#db2777', icon: <Clock size={20} /> },
        ].map(k => (
          <div key={k.label} style={{ ...card, padding: '20px 24px', flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Channel Tabs */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search broadcast campaign…" style={{ width: '100%', height: '40px', paddingLeft: '38px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {['All', 'WhatsApp', 'Email', 'SMS'].map(ch => (
          <button key={ch} onClick={() => setChannelFilter(ch)} style={{ padding: '8px 16px', borderRadius: '99px', border: channelFilter === ch ? '1px solid rgba(219,39,119,0.4)' : '1px solid rgba(226,232,240,0.8)', background: channelFilter === ch ? 'rgba(219,39,119,0.08)' : 'rgba(255,255,255,0.7)', color: channelFilter === ch ? '#db2777' : '#64748b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {ch}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(248,250,252,0.9)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                {['Campaign Name', 'Channel', 'Target Audience', 'Recipients', 'Sent Time', 'Delivered', 'Read Rate', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const cc = channelColors[b.channel];
                const sc = statusColors[b.status];
                const readPct = b.delivered > 0 ? Math.round((b.read / b.delivered) * 100) : 0;
                return (
                  <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,250,252,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{b.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>{b.id}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: cc.bg, color: cc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{b.channel}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.84rem', color: '#475569' }}>{b.targetAudience}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#0f172a', fontWeight: 600 }}>{b.recipientsCount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>{b.sentTime}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#059669', fontWeight: 600 }}>{b.delivered.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(226,232,240,0.8)', borderRadius: '99px', overflow: 'hidden', minWidth: '50px' }}>
                          <div style={{ width: `${readPct}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{readPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => setViewRecord(b)} title="View campaign stats & content" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(219,39,119,0.2)', background: 'rgba(219,39,119,0.05)', color: '#db2777', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No broadcasts match your query.</div>
          )}
        </div>
      </div>

      {/* ── CREATE BROADCAST MODAL ── */}
      {createOpen && (
        <>
          <div onClick={() => setCreateOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '540px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={20} style={{ color: '#db2777' }} /> Create New Broadcast Campaign
              </h2>
              <button onClick={() => setCreateOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Campaign Name *</label>
                <input name="name" required placeholder="e.g. October MBA Orientation Reminder" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Channel *</label>
                  <select name="channel" style={inputStyle}>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Target Segment *</label>
                  <input name="targetAudience" required defaultValue="All Unconverted Leads" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Recipients Count</label>
                  <input name="recipientsCount" type="number" defaultValue="750" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Schedule Time (Optional)</label>
                  <input name="scheduleTime" type="datetime-local" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Message Body *</label>
                <textarea name="messageText" required rows={4} placeholder="Type message body or template variables..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setCreateOpen(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Launch Campaign</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── VIEW DETAILS MODAL ── */}
      {viewRecord && (
        <>
          <div onClick={() => setViewRecord(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{viewRecord.name}</h2>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{viewRecord.id}</div>
              </div>
              <button onClick={() => setViewRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Channel</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.channel}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Target Segment</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.targetAudience}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Recipients</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.recipientsCount}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Delivered / Read</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.delivered} / {viewRecord.read}</div></div>
            </div>
            <div style={{ background: 'rgba(248,250,252,0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.6)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Broadcast Message Text</div>
              <div style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.5 }}>{viewRecord.messageText || 'Standard broadcast prompt.'}</div>
            </div>
            <button onClick={() => setViewRecord(null)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Close Details</button>
          </div>
        </>
      )}
    </div>
  );
}
