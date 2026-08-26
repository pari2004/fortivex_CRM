'use client';

import React, { useState, useMemo } from 'react';
import { Mail, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';

type EmailLead = {
  id: string;
  from: string;
  status: 'Converted' | 'Pending Review' | 'Ignored';
  savedLead: string | null;
  subject: string;
  time: string;
  preview: string;
};

const MOCK_EMAIL_LEADS: EmailLead[] = [
  { id: 'ML-401', from: 'venkatesh.anna@gmail.com', status: 'Converted', savedLead: 'Venkatesh Anna', subject: 'Inquiry about Full Stack course', time: '2026-08-25T09:12:00', preview: 'Hi, I would like to know more about the upcoming batch and fees for the Full Stack Development course...' },
  { id: 'ML-402', from: 'gopinath.b@outlook.com', status: 'Converted', savedLead: 'Gopinath Bro', subject: 'Placement assistance query', time: '2026-08-24T16:40:00', preview: 'Does the program include placement assistance after completion? Please share the curriculum...' },
  { id: 'ML-403', from: 'info@randomvendor.com', status: 'Ignored', savedLead: null, subject: 'Partnership opportunity', time: '2026-08-23T11:05:00', preview: 'We would like to explore a partnership opportunity with your organization...' },
  { id: 'ML-404', from: 'dommiya.k@gmail.com', status: 'Pending Review', savedLead: null, subject: 'Re: Application status', time: '2026-08-22T08:55:00', preview: 'Just following up on my application submitted last week, has it been reviewed yet?' },
];

const statusStyle: Record<EmailLead['status'], { bg: string; text: string; icon: React.ReactNode }> = {
  Converted: { bg: '#dcfce7', text: '#16a34a', icon: <CheckCircle size={14} /> },
  'Pending Review': { bg: '#fef3c7', text: '#d97706', icon: <Clock size={14} /> },
  Ignored: { bg: '#f1f5f9', text: '#64748b', icon: <AlertCircle size={14} /> },
};

export function LeadsEmailLeadsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return MOCK_EMAIL_LEADS;
    const sq = searchQuery.toLowerCase();
    return MOCK_EMAIL_LEADS.filter(e => e.from.toLowerCase().includes(sq) || e.subject.toLowerCase().includes(sq) || (e.savedLead && e.savedLead.toLowerCase().includes(sq)));
  }, [searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
          <Mail size={18} color="var(--primary-color)" /> Emails auto-captured as leads
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', width: '260px' }}>
          <Search size={16} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search email leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 5, borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>From</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Saved Lead</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(email => {
              const s = statusStyle[email.status];
              return (
                <tr key={email.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{email.from}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: s.bg, color: s.text }}>
                      {s.icon} {email.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{email.savedLead || '-'}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-primary)' }}>{email.subject}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(email.time).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.preview}</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No email leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
