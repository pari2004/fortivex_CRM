'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, CheckCircle, Target, BookOpen, Activity } from 'lucide-react';
import { SourceData } from './SourceReportDetailsModal';

interface Props {
  source: SourceData;
  onClose: () => void;
}

export function SourceTimelineModal({ source, onClose }: Props) {
  const events = [
    { title: 'Campaign Created', date: 'August 1, 2026', icon: Target, color: '#3b82f6', desc: `Initial setup for ${source.campaign || source.source}` },
    { title: 'Leads Added', date: 'August 3, 2026', icon: Activity, color: '#8b5cf6', desc: `${source.leads} leads imported into the system.` },
    { title: 'Campaign Updated', date: 'August 5, 2026', icon: CheckCircle, color: '#10b981', desc: `Marketing cost recorded as ₹${source.marketingCost.toLocaleString()}` },
    { title: 'Applications Received', date: 'August 8, 2026', icon: BookOpen, color: '#f59e0b', desc: `${source.applications} applications processed.` },
    { title: 'Admissions Added', date: 'August 10, 2026', icon: CheckCircle, color: '#ec4899', desc: `${source.admissions} admissions confirmed.` },
    { title: 'Revenue Updated', date: 'August 10, 2026', icon: Activity, color: '#059669', desc: `Total revenue recognized: ₹${source.revenue.toLocaleString()}` },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'var(--bg-primary)', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Clock size={24} color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Timeline: {source.source}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '12px', borderLeft: '2px solid var(--glass-border)', marginLeft: '12px' }}>
          {events.map((ev, i) => (
            <div key={i} style={{ position: 'relative', display: 'flex', gap: '16px' }}>
              <div style={{ position: 'absolute', left: '-33px', top: 0, background: 'var(--bg-primary)', padding: '4px', borderRadius: '50%', border: `2px solid ${ev.color}` }}>
                <ev.icon size={16} color={ev.color} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{ev.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{ev.date}</div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="secondary-btn" onClick={onClose} style={{ padding: '10px 24px' }}>Close Timeline</button>
        </div>
      </motion.div>
    </div>
  );
}
