'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Clock, User, CheckCircle, Calendar, Search, Plus, Building2, ChevronUp, ChevronDown, ChevronsUpDown, LayoutList, LayoutGrid, Eye, Edit3, X, Check } from 'lucide-react';

type Visit = {
  id: string;
  lead: string;
  phone: string;
  counselor: string;
  date: string;
  time: string;
  duration: string;
  type: 'Campus Tour' | 'Walk-In' | 'Scheduled Visit' | 'Virtual Tour';
  location: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled' | 'No Show';
  notes: string;
};

const INITIAL_VISITS: Visit[] = [
  { id: 'VST-001', lead: 'Ananya Rao',    phone: '+91 98712 34506', counselor: 'Anjali Desai',  date: '2026-08-08', time: '10:00 AM', duration: '45 min', type: 'Campus Tour',     location: 'Main Campus, Block A',     status: 'Completed', notes: 'Very impressed with lab facilities. Likely to enroll.' },
  { id: 'VST-002', lead: 'Divya Menon',   phone: '+91 98712 34510', counselor: 'Rahul Sharma',  date: '2026-08-09', time: '11:00 AM', duration: '—',      type: 'Scheduled Visit', location: 'Admissions Office',        status: 'Scheduled', notes: 'Wants to discuss scholarship eligibility.' },
  { id: 'VST-003', lead: 'Kiran Patel',   phone: '+91 98712 34504', counselor: 'Vikram Singh',  date: '2026-08-07', time: '02:30 PM', duration: '30 min', type: 'Walk-In',         location: 'Reception',                status: 'Completed', notes: 'Walked in for a brochure. Showed interest in BBA.' },
  { id: 'VST-004', lead: 'Rohit Verma',   phone: '+91 98712 34505', counselor: 'Priya Kapoor',  date: '2026-08-06', time: '03:00 PM', duration: '0 min',  type: 'Scheduled Visit', location: 'Admissions Office',        status: 'No Show',   notes: 'Did not arrive. Called – rescheduling requested.' },
  { id: 'VST-005', lead: 'Suresh Babu',   phone: '+91 98712 34509', counselor: 'Anjali Desai',  date: '2026-08-10', time: '10:30 AM', duration: '—',      type: 'Virtual Tour',    location: 'Online – Zoom',            status: 'Scheduled', notes: 'Out-of-city lead; virtual campus tour arranged.' },
  { id: 'VST-006', lead: 'Meera Nair',    phone: '+91 98712 34508', counselor: 'Rahul Sharma',  date: '2026-08-05', time: '04:00 PM', duration: '60 min', type: 'Campus Tour',     location: 'Main Campus, All Blocks',  status: 'Completed', notes: 'Parent accompanied. Tour extended due to queries.' },
  { id: 'VST-007', lead: 'Aditya Singh',  phone: '+91 98712 34507', counselor: 'Vikram Singh',  date: '2026-08-04', time: '11:00 AM', duration: '20 min', type: 'Walk-In',         location: 'Reception',                status: 'Completed', notes: 'Quick visit to collect offer letter.' },
  { id: 'VST-008', lead: 'Riya Thomas',   phone: '+91 98712 34512', counselor: 'Priya Kapoor',  date: '2026-08-11', time: '02:00 PM', duration: '—',      type: 'Campus Tour',     location: 'Main Campus, Block B',     status: 'Scheduled', notes: 'Referred by alumni. Expecting full-time enrollment.' },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  'Campus Tour':     { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'Walk-In':         { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  'Scheduled Visit': { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
  'Virtual Tour':    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'Completed': { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'Scheduled': { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'Cancelled': { bg: 'rgba(100,116,139,0.1)',color: '#475569' },
  'No Show':   { bg: 'rgba(239,68,68,0.1)',  color: '#dc2626' },
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

type SortKey = 'date' | 'lead' | 'counselor' | 'type' | 'status';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} style={{ color: '#cbd5e1', marginLeft: 3 }} />;
  return sortDir === 'asc' ? <ChevronUp size={13} style={{ color: '#db2777', marginLeft: 3 }} /> : <ChevronDown size={13} style={{ color: '#db2777', marginLeft: 3 }} />;
}

export default function VisitsPage() {
  const [visits, setVisits]               = useState<Visit[]>(INITIAL_VISITS);
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('All');
  const [counselorFilter, setCounselorFilter] = useState('All');
  const [dateFrom, setDateFrom]           = useState('');
  const [dateTo, setDateTo]               = useState('');
  const [sortKey, setSortKey]             = useState<SortKey>('date');
  const [sortDir, setSortDir]             = useState<SortDir>('desc');
  const [view, setView]                   = useState<'table' | 'cards'>('table');
  const [isLoaded, setIsLoaded]           = useState(false);

  // Modals
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [viewRecord, setViewRecord]     = useState<Visit | null>(null);
  const [editRecord, setEditRecord]     = useState<Visit | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_visits');
    if (saved) {
      try { setVisits(JSON.parse(saved)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_visits', JSON.stringify(visits));
    }
  }, [visits, isLoaded]);

  const counselors = Array.from(new Set(visits.map(v => v.counselor)));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleScheduleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newVisit: Visit = {
      id: `VST-0${visits.length + 1}`.padStart(7, '0'),
      lead: fd.get('lead') as string,
      phone: fd.get('phone') as string,
      counselor: fd.get('counselor') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      duration: '—',
      type: fd.get('type') as Visit['type'],
      location: fd.get('location') as string || 'Admissions Office',
      status: 'Scheduled',
      notes: fd.get('notes') as string,
    };
    setVisits(prev => [newVisit, ...prev]);
    setScheduleOpen(false);
    showToast(`Campus visit scheduled for ${newVisit.lead}!`);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecord) return;
    const fd = new FormData(e.currentTarget);
    const updated: Visit = {
      ...editRecord,
      lead: fd.get('lead') as string,
      phone: fd.get('phone') as string,
      counselor: fd.get('counselor') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      duration: fd.get('duration') as string,
      type: fd.get('type') as Visit['type'],
      location: fd.get('location') as string,
      status: fd.get('status') as Visit['status'],
      notes: fd.get('notes') as string,
    };
    setVisits(prev => prev.map(v => v.id === updated.id ? updated : v));
    if (viewRecord?.id === updated.id) setViewRecord(updated);
    setEditRecord(null);
    showToast(`Visit record ${updated.id} updated!`);
  };

  const filtered = useMemo(() => {
    let list = visits.filter(v => {
      const matchSearch   = v.lead.toLowerCase().includes(search.toLowerCase()) || v.counselor.toLowerCase().includes(search.toLowerCase());
      const matchStatus   = statusFilter === 'All' || v.status === statusFilter;
      const matchCounselor = counselorFilter === 'All' || v.counselor === counselorFilter;
      const matchDateFrom = !dateFrom || v.date >= dateFrom;
      const matchDateTo   = !dateTo   || v.date <= dateTo;
      return matchSearch && matchStatus && matchCounselor && matchDateFrom && matchDateTo;
    });
    list = [...list].sort((a, b) => {
      const av = (a as any)[sortKey] as string;
      const bv = (b as any)[sortKey] as string;
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [visits, search, statusFilter, counselorFilter, dateFrom, dateTo, sortKey, sortDir]);

  const stats = {
    total:     visits.length,
    completed: visits.filter(v => v.status === 'Completed').length,
    scheduled: visits.filter(v => v.status === 'Scheduled').length,
    noShow:    visits.filter(v => v.status === 'No Show').length,
  };

  const thStyle: React.CSSProperties = {
    padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px',
    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))' }}>
              <MapPin size={24} style={{ color: '#db2777' }} />
            </div>
            Campus Visits
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track campus visits, walk-ins, and virtual tours with leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', overflow: 'hidden' }}>
            {([['table', <LayoutList size={15} />], ['cards', <LayoutGrid size={15} />]] as [string, React.ReactNode][]).map(([v, icon]) => (
              <button key={v} onClick={() => setView(v as any)} style={{ padding: '8px 14px', background: view === v ? 'rgba(219,39,119,0.08)' : 'rgba(255,255,255,0.7)', border: 'none', color: view === v ? '#db2777' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.82rem' }}>
                {icon} {(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setScheduleOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
          >
            <Plus size={16} /> Schedule Visit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Visits', value: stats.total,     color: '#7c3aed', icon: <MapPin size={20} /> },
          { label: 'Completed',    value: stats.completed, color: '#059669', icon: <CheckCircle size={20} /> },
          { label: 'Scheduled',    value: stats.scheduled, color: '#2563eb', icon: <Calendar size={20} /> },
          { label: 'No Shows',     value: stats.noShow,    color: '#dc2626', icon: <User size={20} /> },
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

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lead or counselor…" style={{ width: '100%', height: '40px', paddingLeft: '38px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {/* Counselor filter */}
        <select value={counselorFilter} onChange={e => setCounselorFilter(e.target.value)} style={{ height: '40px', padding: '0 12px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.86rem', color: '#0f172a', outline: 'none', cursor: 'pointer' }}>
          <option value="All">All Counselors</option>
          {counselors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Date range */}
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ height: '40px', padding: '0 12px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.84rem', color: '#0f172a', outline: 'none' }} />
        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ height: '40px', padding: '0 12px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.84rem', color: '#0f172a', outline: 'none' }} />
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['All', 'Completed', 'Scheduled', 'No Show', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '7px 16px', borderRadius: '99px', border: statusFilter === s ? '1px solid rgba(219,39,119,0.4)' : '1px solid rgba(226,232,240,0.8)', background: statusFilter === s ? 'rgba(219,39,119,0.08)' : 'rgba(255,255,255,0.7)', color: statusFilter === s ? '#db2777' : '#64748b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {s}
          </button>
        ))}
      </div>

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(248,250,252,0.9)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                  {([
                    { label: 'ID',        key: null },
                    { label: 'Lead',      key: 'lead' },
                    { label: 'Counselor', key: 'counselor' },
                    { label: 'Type',      key: 'type' },
                    { label: 'Date',      key: 'date' },
                    { label: 'Time',      key: null },
                    { label: 'Duration',  key: null },
                    { label: 'Location',  key: null },
                    { label: 'Status',    key: 'status' },
                    { label: 'Actions',   key: null },
                  ] as { label: string; key: SortKey | null }[]).map(col => (
                    <th key={col.label} onClick={() => col.key && handleSort(col.key as SortKey)} style={{ ...thStyle, cursor: col.key ? 'pointer' : 'default' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {col.label}
                        {col.key && <SortIcon col={col.key as SortKey} sortKey={sortKey} sortDir={sortDir} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((visit, i) => {
                  const tc = typeColors[visit.type];
                  const sc = statusColors[visit.status];
                  return (
                    <tr key={visit.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,250,252,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{visit.id}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{visit.lead.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{visit.lead}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{visit.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '0.86rem', color: '#475569' }}>{visit.counselor}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: tc.bg, color: tc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{visit.type}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '0.86rem', color: '#475569', whiteSpace: 'nowrap' }}>{visit.date}</td>
                      <td style={{ padding: '13px 16px', fontSize: '0.86rem', color: '#475569', whiteSpace: 'nowrap' }}>{visit.time}</td>
                      <td style={{ padding: '13px 16px', fontSize: '0.86rem', color: '#475569', fontFamily: 'monospace' }}>{visit.duration}</td>
                      <td style={{ padding: '13px 16px', fontSize: '0.82rem', color: '#64748b', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{visit.location}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{visit.status}</span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button onClick={() => setViewRecord(visit)} title="View visit details" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(219,39,119,0.2)', background: 'rgba(219,39,119,0.05)', color: '#db2777', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => setEditRecord(visit)} title="Edit visit record" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)', color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Edit3 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No visits match the current filters.</div>
            )}
          </div>
        </div>
      )}

      {/* CARDS VIEW */}
      {view === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map(visit => {
            const tc = typeColors[visit.type];
            const sc = statusColors[visit.status];
            return (
              <div key={visit.id} style={{ ...card, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #db2777, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{visit.lead.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{visit.lead}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{visit.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => setViewRecord(visit)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(219,39,119,0.2)', background: 'rgba(219,39,119,0.05)', color: '#db2777', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={13} /></button>
                    <button onClick={() => setEditRecord(visit)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)', color: '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={13} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: tc.bg, color: tc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{visit.type}</span>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{visit.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}><Calendar size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />{visit.date} at {visit.time} · {visit.duration}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}><Building2 size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />{visit.location}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}><User size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />{visit.counselor}</div>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, background: 'rgba(248,250,252,0.8)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.5)' }}>{visit.notes}</p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No visits match the current filters.</div>
          )}
        </div>
      )}

      {/* ── SCHEDULE VISIT MODAL ── */}
      {scheduleOpen && (
        <>
          <div onClick={() => setScheduleOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} style={{ color: '#db2777' }} /> Schedule Campus Visit
              </h2>
              <button onClick={() => setScheduleOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Lead Name *</label><input name="lead" required placeholder="e.g. Ananya Rao" style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone Number *</label><input name="phone" required placeholder="+91 98765 43210" style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Counselor *</label><input name="counselor" required defaultValue="Anjali Desai" style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Visit Type</label><select name="type" style={inputStyle}><option value="Campus Tour">Campus Tour</option><option value="Walk-In">Walk-In</option><option value="Scheduled Visit">Scheduled Visit</option><option value="Virtual Tour">Virtual Tour</option></select></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date *</label><input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Time *</label><input name="time" type="time" required defaultValue="10:00" style={inputStyle} /></div>
              </div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Location / Venue</label><input name="location" defaultValue="Main Campus, Admissions Block A" style={inputStyle} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notes</label><textarea name="notes" rows={3} placeholder="Visit purpose or instructions..." style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setScheduleOpen(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Schedule Visit</button>
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
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Phone</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.phone}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Counselor</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.counselor}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Visit Type</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.type}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Status</span><div style={{ fontWeight: 600, fontSize: '0.9rem', color: statusColors[viewRecord.status]?.color }}>{viewRecord.status}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.date} at {viewRecord.time}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Duration</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.duration}</div></div>
            </div>
            <div style={{ background: 'rgba(248,250,252,0.8)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.6)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Location / Venue</div>
              <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, marginBottom: '10px' }}>{viewRecord.location}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Visit Notes</div>
              <div style={{ fontSize: '0.88rem', color: '#0f172a' }}>{viewRecord.notes || 'No notes provided.'}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setViewRecord(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Close</button>
              <button onClick={() => { setEditRecord(viewRecord); setViewRecord(null); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Edit3 size={15} /> Edit Visit Record</button>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20} style={{ color: '#db2777' }} /> Edit Campus Visit Record</h2>
              <button onClick={() => setEditRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Lead Name *</label><input name="lead" defaultValue={editRecord.lead} required style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone Number *</label><input name="phone" defaultValue={editRecord.phone} required style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Counselor *</label><input name="counselor" defaultValue={editRecord.counselor} required style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Visit Type</label><select name="type" defaultValue={editRecord.type} style={inputStyle}><option value="Campus Tour">Campus Tour</option><option value="Walk-In">Walk-In</option><option value="Scheduled Visit">Scheduled Visit</option><option value="Virtual Tour">Virtual Tour</option></select></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date</label><input name="date" type="date" defaultValue={editRecord.date} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Time</label><input name="time" defaultValue={editRecord.time} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Duration</label><input name="duration" defaultValue={editRecord.duration} style={inputStyle} /></div>
                <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status</label><select name="status" defaultValue={editRecord.status} style={inputStyle}><option value="Completed">Completed</option><option value="Scheduled">Scheduled</option><option value="No Show">No Show</option><option value="Cancelled">Cancelled</option></select></div>
              </div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Location / Venue</label><input name="location" defaultValue={editRecord.location} style={inputStyle} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notes</label><textarea name="notes" defaultValue={editRecord.notes} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditRecord(null)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #db2777, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
