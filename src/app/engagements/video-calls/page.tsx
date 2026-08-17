'use client';

import React, { useState, useEffect } from 'react';
import { Video, Clock, User, CheckCircle, XCircle, Calendar, Search, Plus, ExternalLink, Eye, Edit3, X, Link as LinkIcon, Check } from 'lucide-react';

type VideoCall = {
  id: string;
  lead: string;
  counselor: string;
  date: string;
  time: string;
  duration: string;
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  status: 'Completed' | 'Missed' | 'Scheduled' | 'Cancelled';
  link: string;
  notes?: string;
};

const INITIAL_VIDEO_CALLS: VideoCall[] = [
  { id: 'VC-001', lead: 'Priya Reddy', counselor: 'Anjali Desai', date: '2026-08-08', time: '10:00 AM', duration: '22:14', platform: 'Google Meet', status: 'Completed', link: 'https://meet.google.com/', notes: 'Discussed MBA curriculum and fee structure.' },
  { id: 'VC-002', lead: 'Arjun Kumar', counselor: 'Rahul Sharma', date: '2026-08-08', time: '11:30 AM', duration: '—', platform: 'Zoom', status: 'Scheduled', link: 'https://zoom.us/', notes: 'Demo session scheduled for BBA course.' },
  { id: 'VC-003', lead: 'Sneha Patil', counselor: 'Vikram Singh', date: '2026-08-07', time: '03:00 PM', duration: '18:05', platform: 'Google Meet', status: 'Completed', link: 'https://meet.google.com/', notes: 'Reviewed BCA syllabus with student & parent.' },
  { id: 'VC-004', lead: 'Kiran Patel', counselor: 'Priya Kapoor', date: '2026-08-07', time: '02:00 PM', duration: '0:00', platform: 'Zoom', status: 'Missed', link: 'https://zoom.us/', notes: 'Student was offline during call time.' },
  { id: 'VC-005', lead: 'Rohit Verma', counselor: 'Anjali Desai', date: '2026-08-06', time: '04:00 PM', duration: '35:42', platform: 'Microsoft Teams', status: 'Completed', link: 'https://teams.microsoft.com/', notes: 'Scholarship guidance call.' },
  { id: 'VC-006', lead: 'Ananya Rao', counselor: 'Rahul Sharma', date: '2026-08-06', time: '09:30 AM', duration: '12:33', platform: 'Google Meet', status: 'Completed', link: 'https://meet.google.com/', notes: 'Interview mock round completed.' },
  { id: 'VC-007', lead: 'Aditya Singh', counselor: 'Vikram Singh', date: '2026-08-09', time: '10:30 AM', duration: '—', platform: 'Zoom', status: 'Scheduled', link: 'https://zoom.us/', notes: 'Course counseling session.' },
  { id: 'VC-008', lead: 'Meera Nair', counselor: 'Priya Kapoor', date: '2026-08-05', time: '11:00 AM', duration: '08:22', platform: 'Google Meet', status: 'Completed', link: 'https://meet.google.com/', notes: 'Orientation session for new batch.' },
  { id: 'VC-009', lead: 'Suresh Babu', counselor: 'Anjali Desai', date: '2026-08-04', time: '03:30 PM', duration: '0:00', platform: 'Microsoft Teams', status: 'Cancelled', link: 'https://teams.microsoft.com/', notes: 'Rescheduled upon request.' },
  { id: 'VC-010', lead: 'Divya Menon', counselor: 'Rahul Sharma', date: '2026-08-09', time: '02:00 PM', duration: '—', platform: 'Google Meet', status: 'Scheduled', link: 'https://meet.google.com/', notes: 'Virtual campus tour demo.' },
];

const platformColors: Record<string, { bg: string; color: string }> = {
  'Google Meet':      { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'Zoom':             { bg: 'rgba(37,160,237,0.1)', color: '#0c7abf' },
  'Microsoft Teams':  { bg: 'rgba(91,33,182,0.1)',  color: '#5b21b6' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'Completed': { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'Missed':    { bg: 'rgba(239,68,68,0.1)',  color: '#dc2626' },
  'Scheduled': { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'Cancelled': { bg: 'rgba(100,116,139,0.1)',color: '#475569' },
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

export default function VideoCallsPage() {
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>(INITIAL_VIDEO_CALLS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<VideoCall | null>(null);
  const [editRecord, setEditRecord] = useState<VideoCall | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_video_calls');
    if (saved) {
      try { setVideoCalls(JSON.parse(saved)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_video_calls', JSON.stringify(videoCalls));
    }
  }, [videoCalls, isLoaded]);

  const handleScheduleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCall: VideoCall = {
      id: `VC-0${videoCalls.length + 1}`.padStart(6, '0'),
      lead: fd.get('lead') as string,
      counselor: fd.get('counselor') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      duration: '—',
      platform: fd.get('platform') as VideoCall['platform'],
      status: 'Scheduled',
      link: (fd.get('link') as string) || 'https://meet.google.com/abc-defg-hij',
      notes: fd.get('notes') as string,
    };
    setVideoCalls(prev => [newCall, ...prev]);
    setScheduleOpen(false);
    showToast(`Video Call scheduled for ${newCall.lead}!`);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecord) return;
    const fd = new FormData(e.currentTarget);
    const updated: VideoCall = {
      ...editRecord,
      lead: fd.get('lead') as string,
      counselor: fd.get('counselor') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      duration: fd.get('duration') as string,
      platform: fd.get('platform') as VideoCall['platform'],
      status: fd.get('status') as VideoCall['status'],
      link: fd.get('link') as string,
      notes: fd.get('notes') as string,
    };
    setVideoCalls(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (viewRecord?.id === updated.id) setViewRecord(updated);
    setEditRecord(null);
    showToast(`Video call record ${updated.id} updated!`);
  };

  const filtered = videoCalls.filter(vc => {
    const matchSearch = vc.lead.toLowerCase().includes(search.toLowerCase()) || vc.counselor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || vc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: videoCalls.length,
    completed: videoCalls.filter(v => v.status === 'Completed').length,
    scheduled: videoCalls.filter(v => v.status === 'Scheduled').length,
    missed: videoCalls.filter(v => v.status === 'Missed').length,
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(37,99,235,0.12))' }}>
              <Video size={24} style={{ color: '#7c3aed' }} />
            </div>
            Video Calls
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Schedule and manage video call sessions with leads and students.</p>
        </div>
        <button
          onClick={() => setScheduleOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> Schedule Video Call
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Sessions', value: stats.total, color: '#2563eb', icon: <Video size={20} /> },
          { label: 'Completed', value: stats.completed, color: '#059669', icon: <CheckCircle size={20} /> },
          { label: 'Scheduled', value: stats.scheduled, color: '#2563eb', icon: <Calendar size={20} /> },
          { label: 'Missed', value: stats.missed, color: '#dc2626', icon: <XCircle size={20} /> },
        ].map(k => (
          <div key={k.label} style={{ ...card, padding: '20px 24px', flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lead or counselor…"
            style={{ width: '100%', height: '42px', paddingLeft: '40px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        {['All', 'Completed', 'Scheduled', 'Missed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '8px 16px', borderRadius: '99px', border: statusFilter === s ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(226,232,240,0.8)', background: statusFilter === s ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' : 'rgba(255,255,255,0.7)', color: statusFilter === s ? '#2563eb' : '#64748b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 150px 110px 90px 110px 110px', padding: '12px 20px', background: 'rgba(248,250,252,0.8)', borderBottom: '1px solid rgba(226,232,240,0.6)', gap: '12px' }}>
          {['ID', 'Lead', 'Counselor', 'Platform', 'Date & Time', 'Duration', 'Status', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>
        {filtered.map((vc, i) => {
          const pc = platformColors[vc.platform] || platformColors['Google Meet'];
          const sc = statusColors[vc.status];
          return (
            <div key={vc.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 150px 110px 90px 110px 110px', padding: '14px 20px', gap: '12px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(248,250,252,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace' }}>{vc.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{vc.lead.charAt(0)}</div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{vc.lead}</span>
              </div>
              <span style={{ fontSize: '0.83rem', color: '#475569' }}>{vc.counselor.split(' ')[0]}</span>
              <div style={{ background: pc.bg, color: pc.color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' }}>{vc.platform}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{vc.date.slice(5)}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{vc.time}</div>
              </div>
              <span style={{ fontSize: '0.83rem', color: '#475569', fontFamily: 'monospace' }}>{vc.duration}</span>
              <div style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' }}>{vc.status}</div>
              
              {/* Row actions */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button onClick={() => setViewRecord(vc)} title="View session details" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.05)', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={14} />
                </button>
                <button onClick={() => setEditRecord(vc)} title="Edit video call" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)', color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={14} />
                </button>
                <a href={vc.link} target="_blank" rel="noopener noreferrer" title="Join meeting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', textDecoration: 'none' }}>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SCHEDULE VIDEO CALL MODAL ── */}
      {scheduleOpen && (
        <>
          <div onClick={() => setScheduleOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={20} style={{ color: '#7c3aed' }} /> Schedule Video Call
              </h2>
              <button onClick={() => setScheduleOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Student / Lead Name *</label>
                <input name="lead" required placeholder="e.g. Priya Reddy" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Counselor *</label>
                  <input name="counselor" required defaultValue="Anjali Desai" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Platform</label>
                  <select name="platform" style={inputStyle}>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date *</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Time *</label>
                  <input name="time" type="time" required defaultValue="10:00" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Meeting Link</label>
                <input name="link" defaultValue="https://meet.google.com/abc-defg-hij" style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Agenda / Notes</label>
                <textarea name="notes" rows={3} placeholder="Session objective..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setScheduleOpen(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Schedule Session</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── VIEW DETAILS MODAL ── */}
      {viewRecord && (
        <>
          <div onClick={() => setViewRecord(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{viewRecord.lead}</h2>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{viewRecord.id}</div>
              </div>
              <button onClick={() => setViewRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Counselor</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.counselor}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Platform</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.platform}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.date} at {viewRecord.time}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Status</span><div style={{ fontWeight: 600, fontSize: '0.9rem', color: statusColors[viewRecord.status]?.color }}>{viewRecord.status}</div></div>
            </div>
            <div style={{ background: 'rgba(248,250,252,0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.6)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Session Notes</div>
              <div style={{ fontSize: '0.88rem', color: '#0f172a' }}>{viewRecord.notes || 'No notes provided.'}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setEditRecord(viewRecord); setViewRecord(null); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Edit3 size={15} /> Edit Session</button>
              <a href={viewRecord.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}><ExternalLink size={15} /> Launch Meeting</a>
            </div>
          </div>
        </>
      )}

      {/* ── EDIT MODAL ── */}
      {editRecord && (
        <>
          <div onClick={() => setEditRecord(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 1001, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1002, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20} style={{ color: '#7c3aed' }} /> Edit Video Call Record</h2>
              <button onClick={() => setEditRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Lead Name *</label><input name="lead" defaultValue={editRecord.lead} required style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Counselor *</label><input name="counselor" defaultValue={editRecord.counselor} required style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date</label><input name="date" type="date" defaultValue={editRecord.date} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Time</label><input name="time" defaultValue={editRecord.time} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Platform</label><select name="platform" defaultValue={editRecord.platform} style={inputStyle}><option value="Google Meet">Google Meet</option><option value="Zoom">Zoom</option><option value="Microsoft Teams">Microsoft Teams</option></select></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status</label><select name="status" defaultValue={editRecord.status} style={inputStyle}><option value="Completed">Completed</option><option value="Scheduled">Scheduled</option><option value="Missed">Missed</option><option value="Cancelled">Cancelled</option></select></div>
              </div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Meeting Link</label><input name="link" defaultValue={editRecord.link} style={{ ...inputStyle, fontFamily: 'monospace' }} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notes</label><textarea name="notes" defaultValue={editRecord.notes} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditRecord(null)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
