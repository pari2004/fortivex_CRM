'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, ToggleLeft, ToggleRight, Clock, Zap, Edit2, Trash2, Copy, X } from 'lucide-react';

type AutoRule = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  delay: string;
  status: boolean;
  sentCount: number;
  lastTriggered: string;
};

const INITIAL_RULES: AutoRule[] = [
  { id: 'AM-001', name: 'New Lead Welcome', trigger: 'Lead Created', action: 'Send welcome message with course brochure link', channel: 'WhatsApp', delay: 'Immediately', status: true, sentCount: 342, lastTriggered: '2 min ago' },
  { id: 'AM-002', name: 'Follow-Up Reminder – Day 3', trigger: 'No Response (3 days)', action: 'Send follow-up nudge with CTA to schedule call', channel: 'WhatsApp', delay: '3 days', status: true, sentCount: 215, lastTriggered: '1 hr ago' },
  { id: 'AM-003', name: 'Application Submitted Ack', trigger: 'Application Submitted', action: 'Send acknowledgment with expected timeline', channel: 'Email', delay: 'Immediately', status: true, sentCount: 128, lastTriggered: '4 hr ago' },
  { id: 'AM-004', name: 'Payment Due Alert', trigger: 'Payment Due (2 days)', action: 'Remind student about upcoming fee deadline', channel: 'SMS', delay: '2 days before', status: true, sentCount: 89, lastTriggered: 'Yesterday' },
  { id: 'AM-005', name: 'Scholarship Deadline Reminder', trigger: 'Scholarship Deadline (3 days)', action: 'Alert leads who haven\'t applied for scholarship', channel: 'WhatsApp', delay: '3 days before', status: false, sentCount: 0, lastTriggered: 'Never' },
  { id: 'AM-006', name: 'Re-engagement – 7 Days Cold', trigger: 'No Engagement (7 days)', action: 'Send personalised re-engagement message', channel: 'WhatsApp', delay: '7 days', status: false, sentCount: 56, lastTriggered: '3 days ago' },
  { id: 'AM-007', name: 'Batch Confirmation', trigger: 'Seat Confirmed', action: 'Send batch details, orientation schedule and login credentials', channel: 'Email', delay: 'Immediately', status: true, sentCount: 74, lastTriggered: 'Yesterday' },
];

const channelColors: Record<string, { bg: string; color: string }> = {
  'WhatsApp': { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  'SMS':      { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'Email':    { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
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

export default function AutoMessagingPage() {
  const [rules, setRules] = useState<AutoRule[]>(INITIAL_RULES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AutoRule | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_auto_rules');
    if (saved) {
      try { setRules(JSON.parse(saved)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_auto_rules', JSON.stringify(rules));
    }
  }, [rules, isLoaded]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newRule: AutoRule = {
      id: `AM-0${rules.length + 1}`.padStart(6, '0'),
      name: fd.get('name') as string,
      trigger: fd.get('trigger') as string,
      action: fd.get('action') as string,
      channel: fd.get('channel') as AutoRule['channel'],
      delay: fd.get('delay') as string || 'Immediately',
      status: true,
      sentCount: 0,
      lastTriggered: 'Never',
    };
    setRules(prev => [newRule, ...prev]);
    setCreateOpen(false);
    showToast(`Rule "${newRule.name}" created!`);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editRecord) return;
    const fd = new FormData(e.currentTarget);
    const updated: AutoRule = {
      ...editRecord,
      name: fd.get('name') as string,
      trigger: fd.get('trigger') as string,
      action: fd.get('action') as string,
      channel: fd.get('channel') as AutoRule['channel'],
      delay: fd.get('delay') as string,
    };
    setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditRecord(null);
    showToast(`Rule "${updated.name}" updated!`);
  };

  const handleCopyRule = (rule: AutoRule) => {
    const copy: AutoRule = {
      ...rule,
      id: `AM-0${rules.length + 1}`.padStart(6, '0'),
      name: `${rule.name} (Copy)`,
      sentCount: 0,
      lastTriggered: 'Never',
    };
    setRules(prev => [copy, ...prev]);
    showToast(`Copied "${rule.name}"`);
  };

  const handleDeleteRule = (id: string, name: string) => {
    if (confirm(`Delete auto-messaging rule "${name}"?`)) {
      setRules(prev => prev.filter(r => r.id !== id));
      showToast(`Rule "${name}" deleted`);
    }
  };

  const activeCount = rules.filter(r => r.status).length;
  const totalSent   = rules.reduce((s, r) => s + r.sentCount, 0);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(37,99,235,0.12))' }}>
              <Zap size={24} style={{ color: '#059669' }} />
            </div>
            Auto Messaging
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Automate messages based on lead behaviour and lifecycle triggers.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #059669, #2563eb)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> Create Rule
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Rules', value: rules.length, color: '#2563eb' },
          { label: 'Active Rules', value: activeCount, color: '#059669' },
          { label: 'Paused', value: rules.length - activeCount, color: '#d97706' },
          { label: 'Total Messages Sent', value: totalSent.toLocaleString(), color: '#7c3aed' },
        ].map(k => (
          <div key={k.label} style={{ ...card, padding: '18px 24px', flex: '1 1 140px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Rules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rules.map(rule => {
          const cc = channelColors[rule.channel] || channelColors['WhatsApp'];
          return (
            <div key={rule.id} style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', opacity: rule.status ? 1 : 0.7, transition: 'opacity 0.2s' }}>
              {/* Toggle */}
              <button onClick={() => toggleRule(rule.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, color: rule.status ? '#059669' : '#94a3b8', transition: 'color 0.2s' }}>
                {rule.status ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{rule.name}</span>
                  <span style={{ background: cc.bg, color: cc.color, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px' }}>{rule.channel}</span>
                  <span style={{ background: rule.status ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: rule.status ? '#059669' : '#475569', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px' }}>
                    {rule.status ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>Trigger: </span>{rule.trigger}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} style={{ color: '#94a3b8' }} />{rule.delay}
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  → {rule.action}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{rule.sentCount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>SENT</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{rule.lastTriggered}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>LAST RUN</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => setEditRecord(rule)} title="Edit rule" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleCopyRule(rule)} title="Duplicate rule" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                  <Copy size={14} />
                </button>
                <button onClick={() => handleDeleteRule(rule.id, rule.name)} title="Delete rule" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CREATE RULE MODAL ── */}
      {createOpen && (
        <>
          <div onClick={() => setCreateOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1000, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} style={{ color: '#059669' }} /> Create Auto Messaging Rule
              </h2>
              <button onClick={() => setCreateOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Rule Name *</label>
                <input name="name" required placeholder="e.g. Inactivity Follow-up 5 Days" style={inputStyle} />
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
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Delay</label>
                  <input name="delay" defaultValue="Immediately" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Trigger Event *</label>
                <input name="trigger" required placeholder="e.g. Lead Created or Application Submitted" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Action Description / Message *</label>
                <textarea name="action" required rows={3} placeholder="Describe the message or action to execute..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setCreateOpen(false)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #059669, #2563eb)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Create Rule</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── EDIT RULE MODAL ── */}
      {editRecord && (
        <>
          <div onClick={() => setEditRecord(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 1001, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '520px', maxWidth: '95vw', background: 'white', borderRadius: '24px', padding: '32px', zIndex: 1002, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={20} style={{ color: '#059669' }} /> Edit Automation Rule
              </h2>
              <button onClick={() => setEditRecord(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Rule Name *</label>
                <input name="name" defaultValue={editRecord.name} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Channel</label>
                  <select name="channel" defaultValue={editRecord.channel} style={inputStyle}>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Delay</label>
                  <input name="delay" defaultValue={editRecord.delay} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Trigger Event *</label>
                <input name="trigger" defaultValue={editRecord.trigger} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Action Description *</label>
                <textarea name="action" defaultValue={editRecord.action} required rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditRecord(null)} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', background: 'transparent', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #059669, #2563eb)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
