'use client';

import React, { useState, useMemo } from 'react';
import { Download, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

type ExportJob = {
  id: string;
  exportName: string;
  createdAt: string;
  fileName: string;
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING';
  message: string;
  exportedBy: string;
  records: number;
};

const MOCK_EXPORTS: ExportJob[] = [
  { id: 'EXP-1005', exportName: 'Active Leads Export', createdAt: '2026-08-24T10:12:00', fileName: 'ACTIVE_LEADS_EXPORT_AUG24.xlsx', status: 'SUCCESS', message: 'Successfully exported 346 records.', exportedBy: 'Ram Kiran', records: 346 },
  { id: 'EXP-1004', exportName: 'Deal Export Thu Aug 20 2026', createdAt: '2026-08-20T09:30:00', fileName: 'DEAL_EXPORT_THU_AUG20.xlsx', status: 'SUCCESS', message: 'Successfully exported 38 records.', exportedBy: 'Padmesh Mk', records: 38 },
  { id: 'EXP-1003', exportName: 'Follow-up Leads Export', createdAt: '2026-08-18T14:05:00', fileName: 'FOLLOWUP_LEADS_AUG18.xlsx', status: 'SUCCESS', message: 'Successfully exported 129 records.', exportedBy: 'Yashwanth', records: 129 },
  { id: 'EXP-1002', exportName: 'Student Admissions Export', createdAt: '2026-08-15T11:40:00', fileName: 'STUDENT_ADMISSIONS_AUG15.xlsx', status: 'FAILED', message: 'Export failed: request timed out.', exportedBy: 'Abhishek', records: 0 },
  { id: 'EXP-1001', exportName: 'All Leads Export', createdAt: '2026-08-10T08:15:00', fileName: 'ALL_LEADS_EXPORT_AUG10.xlsx', status: 'SUCCESS', message: 'Successfully exported 7346 records.', exportedBy: 'Ram Kiran', records: 7346 },
];

const statusStyle: Record<ExportJob['status'], { bg: string; text: string; icon: React.ReactNode }> = {
  SUCCESS: { bg: '#dcfce7', text: '#16a34a', icon: <CheckCircle size={14} /> },
  FAILED: { bg: '#fee2e2', text: '#ef4444', icon: <XCircle size={14} /> },
  PROCESSING: { bg: '#fef3c7', text: '#d97706', icon: <Clock size={14} /> },
};

export function LeadsDataExportsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return MOCK_EXPORTS;
    const sq = searchQuery.toLowerCase();
    return MOCK_EXPORTS.filter(e => e.exportName.toLowerCase().includes(sq) || e.fileName.toLowerCase().includes(sq) || e.exportedBy.toLowerCase().includes(sq));
  }, [searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
          <Download size={18} color="var(--primary-color)" /> Export History
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', width: '260px' }}>
          <Search size={16} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search exports..."
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
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Export Name</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Created At</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>File Name</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Message</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Exported By</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(job => {
              const s = statusStyle[job.status];
              return (
                <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{job.exportName}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{new Date(job.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{job.fileName}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: s.bg, color: s.text }}>
                      {s.icon} {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '260px' }}>{job.message}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{job.exportedBy}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      disabled={job.status !== 'SUCCESS'}
                      onClick={() => alert(`Downloading ${job.fileName}...`)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: job.status === 'SUCCESS' ? 'white' : '#f1f5f9', cursor: job.status === 'SUCCESS' ? 'pointer' : 'not-allowed', fontSize: '0.85rem', fontWeight: 500, color: job.status === 'SUCCESS' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                    >
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No exports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
