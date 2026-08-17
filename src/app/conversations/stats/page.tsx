'use client';

import React, { useState, useCallback } from 'react';
import { BarChart2, MessageSquare, Clock, CheckCircle, TrendingUp, TrendingDown, Users, Star, Zap, Download, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

type Period = '7d' | '30d' | '90d';

const DATA: Record<Period, {
  totalMessages: number; responseRate: number; avgResolutionHrs: number; csat: number;
  byChannel: { label: string; value: number; color: string }[];
  byDay: { day: string; sent: number; received: number }[];
  topAgents: { name: string; resolved: number; csat: number; avgReply: string }[];
  drillDown: Record<string, { id: string; lead: string; agent: string; channel: string; time: string }[]>;
}> = {
  '7d': {
    totalMessages: 2841, responseRate: 94.2, avgResolutionHrs: 3.4, csat: 4.6,
    byChannel: [
      { label: 'WhatsApp', value: 1204, color: '#16a34a' },
      { label: 'Email',    value: 842,  color: '#d97706' },
      { label: 'SMS',      value: 512,  color: '#2563eb' },
      { label: 'In-App',   value: 283,  color: '#7c3aed' },
    ],
    byDay: [
      { day: 'Mon', sent: 312, received: 285 }, { day: 'Tue', sent: 428, received: 392 },
      { day: 'Wed', sent: 356, received: 341 }, { day: 'Thu', sent: 489, received: 445 },
      { day: 'Fri', sent: 524, received: 478 }, { day: 'Sat', sent: 412, received: 388 },
      { day: 'Sun', sent: 320, received: 295 },
    ],
    topAgents: [
      { name: 'Anjali Desai', resolved: 142, csat: 4.8, avgReply: '2.1 min' },
      { name: 'Rahul Sharma', resolved: 118, csat: 4.7, avgReply: '3.4 min' },
      { name: 'Vikram Singh', resolved: 96,  csat: 4.5, avgReply: '4.2 min' },
      { name: 'Priya Kapoor', resolved: 87,  csat: 4.6, avgReply: '2.8 min' },
    ],
    drillDown: {
      'Total Messages': [
        { id: 'MSG-001', lead: 'Priya Reddy',  agent: 'Anjali Desai',  channel: 'WhatsApp', time: '2 min ago' },
        { id: 'MSG-002', lead: 'Arjun Kumar',  agent: 'Rahul Sharma',  channel: 'WhatsApp', time: '15 min ago' },
        { id: 'MSG-003', lead: 'Sneha Patil',  agent: 'Vikram Singh',  channel: 'SMS',      time: '1 hr ago' },
        { id: 'MSG-004', lead: 'Kiran Patel',  agent: 'Priya Kapoor',  channel: 'WhatsApp', time: '3 hr ago' },
      ],
      'Response Rate': [
        { id: 'MSG-001', lead: 'Priya Reddy',  agent: 'Anjali Desai',  channel: 'WhatsApp', time: 'Replied in 1m 12s' },
        { id: 'MSG-002', lead: 'Arjun Kumar',  agent: 'Rahul Sharma',  channel: 'WhatsApp', time: 'Replied in 2m 04s' },
        { id: 'MSG-006', lead: 'Ananya Rao',   agent: 'Rahul Sharma',  channel: 'WhatsApp', time: 'Replied in 4m 30s' },
      ],
      'Avg. Resolution': [
        { id: 'TKT-0237', lead: 'Rohit Verma',   agent: 'Vikram Singh', channel: 'Email',   time: 'Resolved in 3.2 hrs' },
        { id: 'TKT-0236', lead: 'Ananya Rao',    agent: 'Priya Kapoor', channel: 'WhatsApp',time: 'Resolved in 4.1 hrs' },
        { id: 'TKT-0235', lead: 'Aditya Singh',  agent: 'Anjali Desai', channel: 'Walk-In', time: 'Resolved in 2.8 hrs' },
      ],
      'CSAT Score': [
        { id: 'CST-001', lead: 'Priya Reddy',  agent: 'Anjali Desai', channel: 'WhatsApp', time: 'Rating: 5/5' },
        { id: 'CST-002', lead: 'Arjun Kumar',  agent: 'Rahul Sharma', channel: 'Email',    time: 'Rating: 4/5' },
        { id: 'CST-003', lead: 'Meera Nair',   agent: 'Priya Kapoor', channel: 'WhatsApp', time: 'Rating: 5/5' },
      ],
    },
  },
  '30d': {
    totalMessages: 11284, responseRate: 92.8, avgResolutionHrs: 4.1, csat: 4.5,
    byChannel: [
      { label: 'WhatsApp', value: 4821, color: '#16a34a' },
      { label: 'Email',    value: 3342, color: '#d97706' },
      { label: 'SMS',      value: 2012, color: '#2563eb' },
      { label: 'In-App',   value: 1109, color: '#7c3aed' },
    ],
    byDay: [
      { day: 'Wk 1', sent: 2411, received: 2189 }, { day: 'Wk 2', sent: 2845, received: 2634 },
      { day: 'Wk 3', sent: 3012, received: 2798 }, { day: 'Wk 4', sent: 3016, received: 2788 },
    ],
    topAgents: [
      { name: 'Anjali Desai', resolved: 542, csat: 4.8, avgReply: '2.3 min' },
      { name: 'Rahul Sharma', resolved: 478, csat: 4.7, avgReply: '3.1 min' },
      { name: 'Vikram Singh', resolved: 394, csat: 4.4, avgReply: '4.5 min' },
      { name: 'Priya Kapoor', resolved: 341, csat: 4.6, avgReply: '3.0 min' },
    ],
    drillDown: { 'Total Messages': [], 'Response Rate': [], 'Avg. Resolution': [], 'CSAT Score': [] },
  },
  '90d': {
    totalMessages: 34120, responseRate: 91.5, avgResolutionHrs: 4.8, csat: 4.4,
    byChannel: [
      { label: 'WhatsApp', value: 14512, color: '#16a34a' },
      { label: 'Email',    value: 10234, color: '#d97706' },
      { label: 'SMS',      value: 6124,  color: '#2563eb' },
      { label: 'In-App',   value: 3250,  color: '#7c3aed' },
    ],
    byDay: [
      { day: 'Aug', sent: 11284, received: 10412 },
      { day: 'Jul', sent: 12841, received: 11934 },
      { day: 'Jun', sent: 9995,  received: 9256 },
    ],
    topAgents: [
      { name: 'Anjali Desai', resolved: 1621, csat: 4.8, avgReply: '2.4 min' },
      { name: 'Rahul Sharma', resolved: 1412, csat: 4.7, avgReply: '3.2 min' },
      { name: 'Vikram Singh', resolved: 1198, csat: 4.4, avgReply: '4.6 min' },
      { name: 'Priya Kapoor', resolved: 1034, csat: 4.5, avgReply: '3.1 min' },
    ],
    drillDown: { 'Total Messages': [], 'Response Rate': [], 'Avg. Resolution': [], 'CSAT Score': [] },
  },
};

// Simulated previous-period data for comparison
const PREV: Record<Period, { totalMessages: number; responseRate: number; avgResolutionHrs: number; csat: number }> = {
  '7d':  { totalMessages: 2510, responseRate: 91.0, avgResolutionHrs: 3.9, csat: 4.4 },
  '30d': { totalMessages: 10200, responseRate: 90.5, avgResolutionHrs: 4.6, csat: 4.3 },
  '90d': { totalMessages: 30400, responseRate: 89.0, avgResolutionHrs: 5.2, csat: 4.2 },
};

function delta(curr: number, prev: number) {
  const pct = Math.round(((curr - prev) / prev) * 100);
  const up = pct >= 0;
  return { pct, up };
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <span style={{ width: '80px', fontSize: '0.82rem', color: '#475569', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '10px', borderRadius: '99px', background: 'rgba(226,232,240,0.6)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '99px', background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ width: '56px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', textAlign: 'right', flexShrink: 0 }}>{value.toLocaleString()}</span>
    </div>
  );
}

export default function ConversationStatsPage() {
  const [period, setPeriod]       = useState<Period>('7d');
  const [compare, setCompare]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [drillLabel, setDrillLabel] = useState<string | null>(null);

  const d    = DATA[period];
  const prev = PREV[period];
  const maxChannel = Math.max(...d.byChannel.map(c => c.value));
  const maxBar     = Math.max(...d.byDay.map(b => b.sent));

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const exportReport = () => {
    const lines = [
      `CONVERSATION STATS REPORT — ${period === '7d' ? 'Last 7 Days' : period === '30d' ? 'Last 30 Days' : 'Last 90 Days'}`,
      '='.repeat(60),
      `Total Messages:   ${d.totalMessages.toLocaleString()}`,
      `Response Rate:    ${d.responseRate}%`,
      `Avg. Resolution:  ${d.avgResolutionHrs} hrs`,
      `CSAT Score:       ${d.csat} / 5`,
      '',
      'MESSAGES BY CHANNEL:',
      ...d.byChannel.map(c => `  ${c.label}: ${c.value.toLocaleString()}`),
      '',
      'TOP AGENTS:',
      ...d.topAgents.map(a => `  ${a.name}: ${a.resolved} resolved, CSAT ${a.csat}, Avg reply ${a.avgReply}`),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = `stats_${period}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: 'Total Messages',  value: d.totalMessages.toLocaleString(),    rawCurr: d.totalMessages,       rawPrev: prev.totalMessages,       color: '#2563eb', icon: <MessageSquare size={20} />, sub: 'All channels combined',    invertDelta: false },
    { label: 'Response Rate',   value: `${d.responseRate}%`,                rawCurr: d.responseRate,         rawPrev: prev.responseRate,         color: '#059669', icon: <CheckCircle size={20} />,  sub: 'Replied within 5 min',     invertDelta: false },
    { label: 'Avg. Resolution', value: `${d.avgResolutionHrs} hrs`,         rawCurr: d.avgResolutionHrs,     rawPrev: prev.avgResolutionHrs,     color: '#d97706', icon: <Clock size={20} />,        sub: 'Time to close ticket',     invertDelta: true  },
    { label: 'CSAT Score',      value: `${d.csat} / 5`,                     rawCurr: d.csat,                 rawPrev: prev.csat,                 color: '#7c3aed', icon: <Star size={20} />,         sub: 'Customer satisfaction',    invertDelta: false },
  ];

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' }}>
              <BarChart2 size={24} style={{ color: '#2563eb' }} />
            </div>
            Conversation Stats
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Analytics and performance metrics for all conversation channels.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Compare toggle */}
          <button onClick={() => setCompare(c => !c)} style={{ padding: '8px 14px', borderRadius: '99px', border: compare ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(226,232,240,0.8)', background: compare ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.7)', color: compare ? '#7c3aed' : '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} /> {compare ? 'Comparing' : 'Compare Periods'}
          </button>
          {/* Refresh */}
          <button onClick={handleRefresh} style={{ padding: '8px 14px', borderRadius: '99px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(255,255,255,0.7)', color: '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          {/* Export */}
          <button onClick={exportReport} style={{ padding: '8px 18px', borderRadius: '99px', border: '1px solid rgba(37,99,235,0.4)', background: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export Report
          </button>
          {/* Period tabs */}
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 18px', borderRadius: '99px', border: period === p ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(226,232,240,0.8)', background: period === p ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12))' : 'rgba(255,255,255,0.7)', color: period === p ? '#2563eb' : '#64748b', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Compare banner */}
      {compare && (
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(37,99,235,0.06))', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '14px', padding: '12px 18px', fontSize: '0.84rem', color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={15} /> Showing comparison vs previous {period === '7d' ? '7' : period === '30d' ? '30' : '90'}-day period. Deltas shown on each KPI card.
        </div>
      )}

      {/* KPI cards — clickable for drill-down */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {kpis.map(k => {
          const { pct, up } = delta(k.rawCurr, k.rawPrev);
          const isGood = k.invertDelta ? !up : up;
          const isOpen = drillLabel === k.label;
          const drill  = d.drillDown?.[k.label] ?? [];
          return (
            <div key={k.label} style={{ flex: '1 1 170px' }}>
              <div
                onClick={() => setDrillLabel(isOpen ? null : k.label)}
                style={{ ...card, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', borderBottom: isOpen ? '2px solid ' + k.color : undefined }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, flexShrink: 0 }}>{k.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{k.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {k.sub}
                    {compare && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: isGood ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '0.72rem' }}>
                        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {up ? '+' : ''}{pct}%
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ color: '#94a3b8', flexShrink: 0 }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
              </div>

              {/* Drill-down panel */}
              {isOpen && drill.length > 0 && (
                <div style={{ ...card, borderRadius: '0 0 16px 16px', overflow: 'hidden', marginTop: '-4px', borderTop: 'none' }}>
                  {drill.map((row, i) => (
                    <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', padding: '10px 20px', borderBottom: i < drill.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none', fontSize: '0.82rem', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', color: '#64748b', fontWeight: 600 }}>{row.id}</span>
                      <span style={{ color: '#0f172a', fontWeight: 600 }}>{row.lead}</span>
                      <span style={{ color: '#64748b' }}>{row.agent}</span>
                      <span style={{ color: '#94a3b8' }}>{row.time}</span>
                    </div>
                  ))}
                </div>
              )}
              {isOpen && drill.length === 0 && (
                <div style={{ ...card, padding: '14px 20px', marginTop: '-4px', borderRadius: '0 0 16px 16px', fontSize: '0.83rem', color: '#94a3b8', textAlign: 'center' }}>
                  Detailed records available for 7-day period.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Messages by Channel */}
        <div style={{ ...card, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Messages by Channel</h2>
          {d.byChannel.map(ch => (
            <BarRow key={ch.label} label={ch.label} value={ch.value} max={maxChannel} color={ch.color} />
          ))}
        </div>

        {/* Volume Trend */}
        <div style={{ ...card, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Message Volume Trend</h2>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '140px', marginBottom: '10px' }}>
            {d.byDay.map(b => {
              const sentH = Math.round((b.sent / maxBar) * 120);
              const recvH = Math.round((b.received / maxBar) * 120);
              return (
                <div key={b.day} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px', justifyContent: 'center' }}>
                  <div title={`Sent: ${b.sent}`} style={{ width: '10px', height: `${refreshing ? 0 : sentH}px`, borderRadius: '4px 4px 0 0', background: 'linear-gradient(to top, #2563eb, #7c3aed)', transition: 'height 0.4s ease', cursor: 'help' }} />
                  <div title={`Received: ${b.received}`} style={{ width: '10px', height: `${refreshing ? 0 : recvH}px`, borderRadius: '4px 4px 0 0', background: 'linear-gradient(to top, #059669, #16a34a)', transition: 'height 0.4s ease', cursor: 'help' }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {d.byDay.map(b => (
              <div key={b.day} style={{ flex: 1, textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{b.day}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Sent</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #059669, #16a34a)' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Received</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Agents */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={18} style={{ color: '#7c3aed' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Agent Performance</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 130px', padding: '10px 24px', background: 'rgba(248,250,252,0.8)', borderBottom: '1px solid rgba(226,232,240,0.5)', gap: '12px' }}>
          {['Agent', 'Resolved', 'CSAT', 'Avg. Reply Time'].map(h => (
            <span key={h} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>
        {d.topAgents.map((agent, i) => (
          <div key={agent.name} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 130px', padding: '16px 24px', gap: '12px', alignItems: 'center', borderBottom: i < d.topAgents.length - 1 ? '1px solid rgba(226,232,240,0.4)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${['#2563eb','#059669','#7c3aed','#d97706'][i]}, ${['#7c3aed','#2563eb','#db2777','#ef4444'][i]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{agent.name.charAt(0)}</div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{agent.name}</span>
              {i === 0 && <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '2px 8px', borderRadius: '99px' }}>⭐ Top</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} style={{ color: '#059669' }} /><span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{agent.resolved}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} style={{ color: '#d97706' }} /><span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.9rem' }}>{agent.csat}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} style={{ color: '#2563eb' }} /><span style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.9rem' }}>{agent.avgReply}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
