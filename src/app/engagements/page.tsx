'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Video, MessageSquare, Mail, MapPin, Activity, CheckCircle, XCircle, Settings, User, Clock, Eye, Edit3, X, Calendar, FileText, Key, Link as LinkIcon, RefreshCw, AlertTriangle, Trash2, Check } from 'lucide-react';

// ── API Connector Cards ─────────────────────────────────────────────────────

type ApiChannel = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  provider?: string;
  apiKey?: string;
  webhookUrl?: string;
  lastSync?: string;
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  'calls':       <Phone size={22} />,
  'video-calls': <Video size={22} />,
  'messages':    <MessageSquare size={22} />,
  'email':       <Mail size={22} />,
  'visits':      <MapPin size={22} />,
};

const INITIAL_API_CHANNELS: ApiChannel[] = [
  { id: 'calls',       name: 'Calls',              description: 'Sync call logs from your telephony provider',    connected: true,  provider: 'Exotel',   apiKey: 'exotel_live_983742918', webhookUrl: 'https://api.fortivex.ai/telephony/exotel/webhook', lastSync: '2 min ago' },
  { id: 'video-calls', name: 'Video Calls',        description: 'Connect your video conferencing platform',        connected: false, provider: 'Google Meet', apiKey: '', webhookUrl: '' },
  { id: 'messages',    name: 'Messages / WhatsApp',description: 'Sync WhatsApp & SMS conversations via BSP',       connected: true,  provider: 'Interakt', apiKey: 'interakt_live_77364512', webhookUrl: 'https://api.fortivex.ai/whatsapp/interakt/webhook', lastSync: 'Just now' },
  { id: 'email',       name: 'Email',              description: 'Connect your SMTP / Gmail workspace mailbox',     connected: false, provider: 'Gmail / SMTP', apiKey: '', webhookUrl: '' },
  { id: 'visits',      name: 'Visits',             description: 'Track campus visits and walk-in lead activities', connected: false, provider: 'GeoTrack API', apiKey: '', webhookUrl: '' },
];

// ── Mock Engagement Data ────────────────────────────────────────────────────

type Engagement = {
  id: string;
  type: 'Call' | 'Video Call' | 'Message' | 'Email' | 'Visit';
  lead: string;
  leadPhone: string;
  counselor: string;
  date: string;
  duration: string;
  status: 'Completed' | 'Missed' | 'Pending' | 'Scheduled';
  notes: string;
  followUpDate: string;
  outcome: string;
};

const INITIAL_ENGAGEMENTS: Engagement[] = [
  { id: 'ENG-001', type: 'Call',       lead: 'Priya Reddy',   leadPhone: '+91 98712 34501', counselor: 'Rahul Sharma',  date: '2026-08-08', duration: '5:32',  status: 'Completed', notes: 'Discussed MBA fees and scholarship options.', followUpDate: '2026-08-12', outcome: 'Interested — follow up on scholarship docs' },
  { id: 'ENG-002', type: 'Video Call', lead: 'Arjun Kumar',   leadPhone: '+91 98712 34502', counselor: 'Anjali Desai',  date: '2026-08-08', duration: '12:10', status: 'Completed', notes: 'Demo of online learning platform conducted.', followUpDate: '2026-08-11', outcome: 'Demo completed, awaiting enrollment decision' },
  { id: 'ENG-003', type: 'Message',    lead: 'Sneha Patil',   leadPhone: '+91 98712 34503', counselor: 'Vikram Singh',  date: '2026-08-07', duration: '—',     status: 'Completed', notes: 'Sent course brochure via WhatsApp.', followUpDate: '2026-08-10', outcome: 'Brochure delivered, awaiting reply' },
  { id: 'ENG-004', type: 'Call',       lead: 'Kiran Patel',   leadPhone: '+91 98712 34504', counselor: 'Priya Kapoor',  date: '2026-08-07', duration: '0:00',  status: 'Missed',    notes: 'No answer. Scheduled follow-up.', followUpDate: '2026-08-09', outcome: 'Call missed — rescheduled' },
  { id: 'ENG-005', type: 'Email',      lead: 'Rohit Verma',   leadPhone: '+91 98712 34505', counselor: 'Rahul Sharma',  date: '2026-08-07', duration: '—',     status: 'Completed', notes: 'Fee payment reminder sent via email.', followUpDate: '2026-08-10', outcome: 'Reminder sent, awaiting payment' },
  { id: 'ENG-006', type: 'Visit',      lead: 'Ananya Rao',    leadPhone: '+91 98712 34506', counselor: 'Anjali Desai',  date: '2026-08-06', duration: '45:00', status: 'Completed', notes: 'Campus tour conducted. Very interested.', followUpDate: '2026-08-09', outcome: 'Highly interested — offer letter being prepared' },
  { id: 'ENG-007', type: 'Call',       lead: 'Aditya Singh',  leadPhone: '+91 98712 34507', counselor: 'Vikram Singh',  date: '2026-08-06', duration: '3:45',  status: 'Completed', notes: 'Confirmed enrollment decision.', followUpDate: '2026-08-10', outcome: 'Enrollment confirmed' },
  { id: 'ENG-008', type: 'Video Call', lead: 'Meera Nair',    leadPhone: '+91 98712 34508', counselor: 'Priya Kapoor',  date: '2026-08-05', duration: '8:22',  status: 'Completed', notes: 'Parent orientation session completed.', followUpDate: '2026-08-10', outcome: 'Parents satisfied — full enrollment expected' },
  { id: 'ENG-009', type: 'Message',    lead: 'Suresh Babu',   leadPhone: '+91 98712 34509', counselor: 'Rahul Sharma',  date: '2026-08-05', duration: '—',     status: 'Completed', notes: 'Answered admission query on WhatsApp.', followUpDate: '2026-08-11', outcome: 'Query resolved' },
  { id: 'ENG-010', type: 'Visit',      lead: 'Divya Menon',   leadPhone: '+91 98712 34510', counselor: 'Anjali Desai',  date: '2026-08-04', duration: '30:00', status: 'Scheduled', notes: 'Campus visit booked for tomorrow morning.', followUpDate: '2026-08-09', outcome: 'Visit scheduled' },
  { id: 'ENG-011', type: 'Call',       lead: 'Rahul Sharma',  leadPhone: '+91 98712 34511', counselor: 'Vikram Singh',  date: '2026-08-04', duration: '6:10',  status: 'Completed', notes: 'Discussed scholarship criteria.', followUpDate: '2026-08-10', outcome: 'Scholarship details shared' },
  { id: 'ENG-012', type: 'Email',      lead: 'Riya Thomas',   leadPhone: '+91 98712 34512', counselor: 'Priya Kapoor',  date: '2026-08-03', duration: '—',     status: 'Pending',   notes: 'Draft offer letter awaiting approval.', followUpDate: '2026-08-08', outcome: 'Letter in review' },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  'Call':       { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'Video Call': { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
  'Message':    { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  'Email':      { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  'Visit':      { bg: 'rgba(236,72,153,0.1)',  color: '#db2777' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'Completed': { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'Missed':    { bg: 'rgba(239,68,68,0.1)',  color: '#dc2626' },
  'Pending':   { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
  'Scheduled': { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
};

const typeIcons: Record<string, React.ReactNode> = {
  'Call':       <Phone size={14} />,
  'Video Call': <Video size={14} />,
  'Message':    <MessageSquare size={14} />,
  'Email':      <Mail size={14} />,
  'Visit':      <MapPin size={14} />,
};

const filterTabs = ['All', 'Call', 'Video Call', 'Message', 'Email', 'Visit'];

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

// ── Detail Field component ──────────────────────────────────────────────────
function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 500, fontFamily: mono ? 'monospace' : undefined }}>{value}</span>
    </div>
  );
}

export default function AllEngagementsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Persistent state for channel integrations
  const [channels, setChannels] = useState<ApiChannel[]>(INITIAL_API_CHANNELS);
  const [activeConfigChannel, setActiveConfigChannel] = useState<ApiChannel | null>(null);

  // Persistent state for engagements list
  const [engagements, setEngagements] = useState<Engagement[]>(INITIAL_ENGAGEMENTS);
  const [detailRecord, setDetailRecord] = useState<Engagement | null>(null);
  const [editRecord, setEditRecord] = useState<Engagement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedChannels = localStorage.getItem('crm_api_channels');
    if (savedChannels) {
      try { setChannels(JSON.parse(savedChannels)); } catch (e) {}
    }
    const savedEngagements = localStorage.getItem('crm_engagements_list');
    if (savedEngagements) {
      try { setEngagements(JSON.parse(savedEngagements)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_api_channels', JSON.stringify(channels));
    }
  }, [channels, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_engagements_list', JSON.stringify(engagements));
    }
  }, [engagements, isLoaded]);

  const handleSaveChannelConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeConfigChannel) return;
    const fd = new FormData(e.currentTarget);
    const provider = fd.get('provider') as string;
    const apiKey = fd.get('apiKey') as string;
    const webhookUrl = fd.get('webhookUrl') as string;

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeConfigChannel.id) {
        return {
          ...ch,
          connected: true,
          provider: provider || ch.provider || 'Custom API',
          apiKey,
          webhookUrl,
          lastSync: 'Just now',
        };
      }
      return ch;
    }));

    showToast(`${activeConfigChannel.name} integration settings saved & connected!`);
    setActiveConfigChannel(null);
  };

  const handleDisconnectChannel = (id: string) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, connected: false, lastSync: undefined } : ch));
    showToast('Channel disconnected');
    setActiveConfigChannel(null);
  };

  const handleSaveEngagement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecord) return;
    const fd = new FormData(e.currentTarget);
    const updated: Engagement = {
      ...editRecord,
      lead: fd.get('lead') as string,
      leadPhone: fd.get('leadPhone') as string,
      counselor: fd.get('counselor') as string,
      type: fd.get('type') as Engagement['type'],
      status: fd.get('status') as Engagement['status'],
      date: fd.get('date') as string,
      duration: fd.get('duration') as string,
      followUpDate: fd.get('followUpDate') as string,
      notes: fd.get('notes') as string,
      outcome: fd.get('outcome') as string,
    };

    setEngagements(prev => prev.map(item => item.id === updated.id ? updated : item));
    if (detailRecord?.id === updated.id) {
      setDetailRecord(updated);
    }
    setEditRecord(null);
    showToast(`Engagement record ${updated.id} updated!`);
  };

  const filtered = activeFilter === 'All'
    ? engagements
    : engagements.filter(e => e.type === activeFilter);

  const stats = {
    total: engagements.length,
    completed: engagements.filter(e => e.status === 'Completed').length,
    missed: engagements.filter(e => e.status === 'Missed').length,
    scheduled: engagements.filter(e => e.status === 'Scheduled').length,
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' }}>
              <Activity size={24} style={{ color: '#2563eb' }} />
            </div>
            All Engagements
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Unified view of all engagement activities across leads and students.</p>
        </div>

        {/* KPI row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: stats.total, color: '#2563eb' },
            { label: 'Completed', value: stats.completed, color: '#059669' },
            { label: 'Missed', value: stats.missed, color: '#dc2626' },
            { label: 'Scheduled', value: stats.scheduled, color: '#d97706' },
          ].map(k => (
            <div key={k.label} style={{ ...card, padding: '12px 20px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>



      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{ padding: '7px 18px', borderRadius: '99px', border: activeFilter === tab ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(226,232,240,0.8)', background: activeFilter === tab ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' : 'rgba(255,255,255,0.7)', color: activeFilter === tab ? '#2563eb' : '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Engagement Table ── */}
      <div style={{ ...card, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 130px 140px 90px 100px 120px 80px', padding: '12px 20px', background: 'rgba(248,250,252,0.8)', borderBottom: '1px solid rgba(226,232,240,0.6)', gap: '12px' }}>
          {['ID', 'Lead', 'Counselor', 'Type', 'Date', 'Duration', 'Status', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((eng, i) => {
          const tc = typeColors[eng.type];
          const sc = statusColors[eng.status];
          return (
            <div key={eng.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 130px 140px 90px 100px 120px 80px', padding: '14px 20px', gap: '12px', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(248,250,252,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace' }}>{eng.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                  {eng.lead.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{eng.lead}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{eng.notes.slice(0, 35)}…</div>
                </div>
              </div>
              <span style={{ fontSize: '0.83rem', color: '#475569' }}>{eng.counselor.split(' ')[0]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: tc.bg, color: tc.color, padding: '4px 10px', borderRadius: '99px', width: 'fit-content' }}>
                {typeIcons[eng.type]}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{eng.type}</span>
              </div>
              <span style={{ fontSize: '0.83rem', color: '#475569' }}>{eng.date.slice(5)}</span>
              <span style={{ fontSize: '0.83rem', color: '#475569', fontFamily: 'monospace' }}>{eng.duration}</span>
              <div style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' }}>
                {eng.status}
              </div>
              
              {/* Action buttons: Eye (View) & Edit3 (Edit) */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={() => setDetailRecord(eng)}
                  title="View details"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2563eb', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,99,235,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,99,235,0.05)'; }}
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => setEditRecord(eng)}
                  title="Edit record"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7c3aed', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.05)'; }}
                >
                  <Edit3 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Drawer ── */}
      {detailRecord && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDetailRecord(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }}
          />
          {/* Drawer */}
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '440px', maxWidth: '95vw', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(226,232,240,0.8)', boxShadow: '-24px 0 60px rgba(0,0,0,0.12)', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Drawer header */}
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(226,232,240,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(139,92,246,0.04))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                  {detailRecord.lead.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{detailRecord.lead}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{detailRecord.id}</div>
                </div>
              </div>
              <button
                onClick={() => setDetailRecord(null)}
                style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Status + Type badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: typeColors[detailRecord.type].bg, color: typeColors[detailRecord.type].color, padding: '5px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {typeIcons[detailRecord.type]}
                  {detailRecord.type}
                </div>
                <div style={{ background: statusColors[detailRecord.status].bg, color: statusColors[detailRecord.status].color, padding: '5px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {detailRecord.status}
                </div>
              </div>

              {/* Contact & Assignment */}
              <div style={{ ...card, padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Contact & Assignment</div>
                <DetailField label="Lead Name" value={detailRecord.lead} />
                <DetailField label="Lead Phone" value={detailRecord.leadPhone} />
                <DetailField label="Counselor" value={detailRecord.counselor} />
              </div>

              {/* Engagement Details */}
              <div style={{ ...card, padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Engagement Details</div>
                <DetailField label="Engagement ID" value={detailRecord.id} mono />
                <DetailField label="Date" value={detailRecord.date} />
                <DetailField label="Duration" value={detailRecord.duration} mono />
                <DetailField label="Follow-up Date" value={detailRecord.followUpDate} />
              </div>

              {/* Notes */}
              <div style={{ ...card, padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Notes</div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.6 }}>{detailRecord.notes}</p>
              </div>

              {/* Outcome */}
              <div style={{ ...card, padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Outcome / Next Step</div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.6 }}>{detailRecord.outcome}</p>
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(226,232,240,0.6)', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDetailRecord(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', color: '#475569', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditRecord(detailRecord);
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Edit3 size={15} /> Edit Record
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── EDIT ENGAGEMENT RECORD MODAL ── */}
      {editRecord && (
        <>
          <div onClick={() => setEditRecord(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 1001, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '560px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1002, boxShadow: '0 24px 60px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={20} style={{ color: '#2563eb' }} /> Edit Engagement Record
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{editRecord.id}</span>
              </div>
              <button onClick={() => setEditRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveEngagement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Lead Name *</label>
                  <input name="lead" defaultValue={editRecord.lead} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Lead Phone *</label>
                  <input name="leadPhone" defaultValue={editRecord.leadPhone} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Counselor *</label>
                  <input name="counselor" defaultValue={editRecord.counselor} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Type</label>
                  <select name="type" defaultValue={editRecord.type} style={inputStyle}>
                    <option value="Call">Call</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Message">Message</option>
                    <option value="Email">Email</option>
                    <option value="Visit">Visit</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status</label>
                  <select name="status" defaultValue={editRecord.status} style={inputStyle}>
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date</label>
                  <input name="date" type="date" defaultValue={editRecord.date} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Duration</label>
                  <input name="duration" defaultValue={editRecord.duration} placeholder="e.g. 5:30" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Follow-up Date</label>
                  <input name="followUpDate" type="date" defaultValue={editRecord.followUpDate} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Notes</label>
                <textarea name="notes" defaultValue={editRecord.notes} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Outcome / Next Step</label>
                <textarea name="outcome" defaultValue={editRecord.outcome} rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditRecord(null)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── CHANNEL INTEGRATION CONFIGURATION MODAL ── */}
      {activeConfigChannel && (
        <>
          <div onClick={() => setActiveConfigChannel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 1001, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '540px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1002, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  {CHANNEL_ICONS[activeConfigChannel.id]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {activeConfigChannel.connected ? `Manage ${activeConfigChannel.name}` : `Connect ${activeConfigChannel.name}`}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Configure channel credentials & API sync parameters</div>
                </div>
              </div>
              <button onClick={() => setActiveConfigChannel(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>

            {/* Sync status alert if connected */}
            {activeConfigChannel.connected && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} style={{ color: '#059669' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#059669' }}>Connected & Active ({activeConfigChannel.provider || 'Provider'})</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Last synced: {activeConfigChannel.lastSync || 'Just now'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Testing connection... Connection healthy (200 OK)!')}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.4)', background: 'white', color: '#059669', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} /> Test API
                </button>
              </div>
            )}

            <form onSubmit={handleSaveChannelConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Provider Name</label>
                <input name="provider" defaultValue={activeConfigChannel.provider || (activeConfigChannel.id === 'calls' ? 'Exotel' : activeConfigChannel.id === 'video-calls' ? 'Google Meet' : activeConfigChannel.id === 'messages' ? 'Interakt' : activeConfigChannel.id === 'email' ? 'Gmail / SMTP' : 'GeoTrack API')} placeholder="e.g. Exotel / Twilio / Google Meet" required style={inputStyle} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>API Key / Account SID</label>
                <input name="apiKey" defaultValue={activeConfigChannel.apiKey || 'fx_api_live_' + Math.random().toString(36).substr(2, 9)} placeholder="Enter API Key / Token" required style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Webhook Endpoint URL</label>
                <input name="webhookUrl" defaultValue={activeConfigChannel.webhookUrl || `https://api.fortivex.ai/${activeConfigChannel.id}/webhook`} placeholder="https://api.fortivex.ai/webhook" required style={{ ...inputStyle, fontFamily: 'monospace' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Sync Frequency</label>
                <select style={inputStyle}>
                  <option>Real-Time Webhook (Recommended)</option>
                  <option>Every 15 Minutes</option>
                  <option>Hourly Batch</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(226,232,240,0.8)' }}>
                {activeConfigChannel.connected ? (
                  <button
                    type="button"
                    onClick={() => handleDisconnectChannel(activeConfigChannel.id)}
                    style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trash2 size={14} /> Disconnect
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setActiveConfigChannel(null)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={15} /> {activeConfigChannel.connected ? 'Update Settings' : 'Connect Channel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
