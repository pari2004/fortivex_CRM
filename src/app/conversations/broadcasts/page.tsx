'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, Users, Plus, Search, Eye, X, Smartphone, ArrowRight, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Broadcast = {
  id: string;
  name: string;
  templateName: string;
  targetAudience: string;
  recipientsCount: number;
  sentTime: string;
  delivered: number;
  read: number;
  failed: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
};

const INITIAL_BROADCASTS: Broadcast[] = [
  { id: 'WA-001', name: 'August MBA Batch Application Reminder', templateName: 'application_reminder_v1', targetAudience: 'All MBA Leads', recipientsCount: 1240, sentTime: '2026-08-08 10:00 AM', delivered: 1210, read: 980, failed: 30, status: 'Sent' },
  { id: 'WA-002', name: 'BBA Open Day Campus Tour Invite', templateName: 'event_invitation', targetAudience: 'BBA Enquiries (July)', recipientsCount: 850, sentTime: '2026-08-07 02:00 PM', delivered: 832, read: 412, failed: 18, status: 'Sent' },
  { id: 'WA-003', name: 'Early Bird Scholarship Offer', templateName: 'promotional_offer', targetAudience: 'Unconverted High Priority Leads', recipientsCount: 320, sentTime: '2026-08-06 11:30 AM', delivered: 315, read: 290, failed: 5, status: 'Sent' },
  { id: 'WA-004', name: 'Webinar: Careers in Financial Analytics', templateName: 'webinar_invite', targetAudience: 'Finance Lead Segment', recipientsCount: 600, sentTime: '2026-08-10 05:00 PM', delivered: 0, read: 0, failed: 0, status: 'Scheduled' },
  { id: 'WA-005', name: 'September Intake Opening Announcement', templateName: 'general_announcement', targetAudience: 'All Lead Database', recipientsCount: 4500, sentTime: 'Draft', delivered: 0, read: 0, failed: 0, status: 'Draft' },
];

const TEMPLATES = [
  { id: 't1', name: 'application_reminder_v1', category: 'UTILITY', language: 'en', preview: 'Hi {{1}}, friendly reminder that applications for {{2}} close on {{3}}.' },
  { id: 't2', name: 'event_invitation', category: 'MARKETING', language: 'en', preview: 'Hi {{1}}, you are invited to our {{2}} event at our campus! Click here to RSVP: {{3}}' },
  { id: 't3', name: 'promotional_offer', category: 'MARKETING', language: 'en', preview: 'Special offer! Get {{1}} discount on {{2}}. Valid until {{3}}.' },
  { id: 't4', name: 'general_announcement', category: 'UTILITY', language: 'en', preview: 'Important update: {{1}}' },
];

const AUDIENCES = [
  'All Leads', 'Selected Leads', 'Lead Owner', 'Team', 'Tags', 'Lead Status', 
  'All MBA Leads', 'BBA Enquiries (July)', 'Unconverted High Priority Leads', 'Finance Lead Segment'
];

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
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntegrated, setIsIntegrated] = useState(false);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<Broadcast | null>(null);

  // Create Form State
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);

  useEffect(() => {
    // Check Integration Status
    const waStatus = localStorage.getItem('wa_connected');
    if (waStatus === 'true') {
      setIsIntegrated(true);
    }
    
    // Load Broadcasts
    const saved = localStorage.getItem('crm_broadcasts_wa');
    if (saved) {
      try { setBroadcasts(JSON.parse(saved)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isIntegrated) {
      localStorage.setItem('crm_broadcasts_wa', JSON.stringify(broadcasts));
    }
  }, [broadcasts, isLoaded, isIntegrated]);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const count = Math.floor(Math.random() * 5000) + 100;
    const isSchedule = fd.get('scheduleTime') as string;
    const tpl = TEMPLATES.find(t => t.id === selectedTemplate);

    const newBc: Broadcast = {
      id: `WA-0${broadcasts.length + 1}`.padStart(6, '0'),
      name: fd.get('name') as string,
      templateName: tpl?.name || 'unknown',
      targetAudience: fd.get('targetAudience') as string,
      recipientsCount: count,
      sentTime: isSchedule ? isSchedule.replace('T', ' ') : new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      delivered: isSchedule ? 0 : Math.round(count * 0.97),
      read: isSchedule ? 0 : Math.round(count * 0.72),
      failed: isSchedule ? 0 : Math.round(count * 0.03),
      status: isSchedule ? 'Scheduled' : 'Sent',
    };

    setBroadcasts(prev => [newBc, ...prev]);
    setCreateOpen(false);
    showToast(`WhatsApp Broadcast "${newBc.name}" created!`);
  };

  const filtered = broadcasts.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.targetAudience.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalDelivered = broadcasts.reduce((s, b) => s + b.delivered, 0);
  const totalFailed = broadcasts.reduce((s, b) => s + b.failed, 0);

  if (!isLoaded) return null;

  // --- UNINTEGRATED LANDING PAGE ---
  if (!isIntegrated) {
    return (
      <div style={{ height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff', padding: '40px' }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: '1100px', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
          
          {/* Left Content */}
          <div style={{ flex: 1, padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              WHATSAPP CLOUD API NOT INTEGRATED YET!!!
            </h4>
            <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, marginBottom: '32px', maxWidth: '350px' }}>
              Visit integration page and get started with Whatsapp Cloud API
            </p>
            <button 
              onClick={() => router.push('/conversations/broadcasts/integrations')}
              style={{ alignSelf: 'flex-start', background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79,70,229,0.3)' }}
            >
              Go To Integrations
            </button>
          </div>

          {/* Right Illustration */}
          <div style={{ flex: 1, background: '#023c2d', position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
            {/* Concentric Circles */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.1)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.2)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '240px', height: '240px', borderRadius: '50%', border: '1px solid rgba(34,197,94,0.3)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', borderRadius: '50%', border: '2px solid rgba(34,197,94,0.4)' }} />
            
            {/* Central WhatsApp Icon */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90px', height: '90px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(37,211,102,0.4)', zIndex: 10 }}>
              <h1 style={{ color: 'white', fontSize: '3rem', margin: 0, fontWeight: 900 }}>B</h1>
            </div>

            {/* Orbiting Icons */}
            <div style={{ position: 'absolute', top: '35%', left: '25%', width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 11 }}>
              <span style={{ color: '#0668E1', fontWeight: 800, fontSize: '1.2rem' }}>Meta</span>
            </div>

            <div style={{ position: 'absolute', top: '25%', right: '30%', width: '40px', height: '40px', background: '#0ea5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 11 }}>
              <Smartphone size={20} color="white" />
            </div>

            <div style={{ position: 'absolute', bottom: '30%', right: '25%', width: '50px', height: '50px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 11 }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>API</span>
            </div>

            {/* Dotted Grid Pattern overlay (minimal) */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }} />
          </div>
        </div>
      </div>
    );
  }

  // --- INTEGRATED DASHBOARD ---
  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(20,184,166,0.12))' }}>
              <MessageCircle size={24} style={{ color: '#059669' }} />
            </div>
            WhatsApp Broadcasts
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Send mass WhatsApp templates to targeted CRM audiences via Cloud API.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 8px 16px rgba(16,185,129,0.2)' }}
        >
          <Plus size={16} /> Create Broadcast
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Broadcasts', value: broadcasts.length, color: '#3b82f6', icon: <Send size={20} /> },
          { label: 'Total Sent',  value: totalDelivered.toLocaleString(), color: '#059669', icon: <CheckCircle size={20} /> },
          { label: 'Total Failed', value: totalFailed.toLocaleString(), color: '#ef4444', icon: <X size={20} /> },
          { label: 'Scheduled',    value: broadcasts.filter(b=>b.status==='Scheduled').length, color: '#f59e0b', icon: <Clock size={20} /> },
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

      {/* Search & Tabs */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(226,232,240,0.8)' }}>
           {['My', 'All'].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: '8px', background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#0f172a' : '#64748b', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: activeTab === tab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
               {tab}
             </button>
           ))}
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search broadcasts..." style={{ width: '100%', height: '40px', paddingLeft: '38px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(248,250,252,0.9)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                {['Broadcast Name', 'Template', 'Audience', 'Recipients', 'Sent', 'Delivered', 'Read', 'Failed', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = statusColors[b.status];
                return (
                  <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,250,252,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{b.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>{b.id}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.84rem', color: '#475569', fontWeight: 500 }}>{b.templateName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.84rem', color: '#475569' }}>{b.targetAudience}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#0f172a', fontWeight: 600 }}>{b.recipientsCount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#0f172a', fontWeight: 500 }}>{b.sentTime}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#059669', fontWeight: 600 }}>{b.delivered.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#2563eb', fontWeight: 600 }}>{b.read.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.86rem', color: '#ef4444', fontWeight: 600 }}>{b.failed.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: '0.73rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setViewRecord(b)} title="View Report" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(226,232,240,0.8)', background: 'white', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Eye size={14} />
                        </button>
                        <button title="More Actions" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(226,232,240,0.8)', background: 'white', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
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
          <div onClick={() => setCreateOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)', display: 'flex', gap: '32px' }}>
            
            {/* Form Side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageCircle size={20} style={{ color: '#059669' }} /> Create WhatsApp Broadcast
                </h2>
              </div>
              <form id="bc-form" onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Broadcast Name *</label>
                  <input name="name" required placeholder="e.g. October Offer" style={inputStyle} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Select Audience *</label>
                  <select name="targetAudience" required style={inputStyle}>
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>WhatsApp Message Template *</label>
                  <select 
                    name="template" 
                    value={selectedTemplate} 
                    onChange={e => setSelectedTemplate(e.target.value)} 
                    style={inputStyle}
                  >
                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name} ({t.language})</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Sender / WhatsApp Number</label>
                  <input value="+91 9876543210 (Fortivex.AI)" readOnly style={{ ...inputStyle, background: '#f1f5f9', color: '#64748b' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Schedule (Optional)</label>
                  <input name="scheduleTime" type="datetime-local" style={inputStyle} />
                </div>
              </form>
            </div>

            {/* Preview Side */}
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
               <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '16px' }}>Message Preview</div>
               <div style={{ flex: 1, background: '#e5ddd5', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 14px', borderRadius: '8px', borderTopLeftRadius: '0px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', fontSize: '0.88rem', color: '#111b21', lineHeight: 1.5, position: 'relative' }}>
                   {TEMPLATES.find(t => t.id === selectedTemplate)?.preview}
                   <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#667781', marginTop: '6px' }}>12:00 PM</div>
                 </div>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setCreateOpen(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" form="bc-form" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Send Now</button>
               </div>
            </div>
            
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
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{viewRecord.id} • {viewRecord.templateName}</div>
              </div>
              <button onClick={() => setViewRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Audience</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.targetAudience}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Recipients</span><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{viewRecord.recipientsCount.toLocaleString()}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>Delivered / Read</span><div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#059669' }}>{viewRecord.delivered.toLocaleString()} / {viewRecord.read.toLocaleString()}</div></div>
              <div><span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>Failed</span><div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ef4444' }}>{viewRecord.failed.toLocaleString()}</div></div>
            </div>
            
            <button onClick={() => setViewRecord(null)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Close Report</button>
          </div>
        </>
      )}
    </div>
  );
}
