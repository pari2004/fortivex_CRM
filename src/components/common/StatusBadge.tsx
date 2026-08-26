import React from 'react';

export function StatusBadge({ status, type }: { status: string, type: 'pipeline' | 'stage' | 'doc' | 'payment' }) {
  let bg = '#e2e8f0';
  let color = '#475569';

  if (type === 'pipeline' || type === 'stage') {
    if (status === 'Active' || status === 'Approved' || status === 'Enrolled' || status === 'Placed') { bg = 'rgba(16, 185, 129, 0.1)'; color = '#10b981'; }
    if (status === 'New Lead' || status === 'New') { bg = 'rgba(59, 130, 246, 0.1)'; color = '#3b82f6'; }
    if (status === 'Interested' || status === 'Demo Scheduled' || status === 'Interview Scheduled') { bg = 'rgba(139, 92, 246, 0.1)'; color = '#8b5cf6'; }
    if (status === 'Payment Pending' || status === 'Documents Pending' || status === 'Under Review') { bg = 'rgba(245, 158, 11, 0.1)'; color = '#f59e0b'; }
    if (status === 'Lost' || status === 'Inactive' || status === 'Closed' || status === 'Rejected') { bg = 'rgba(239, 68, 68, 0.1)'; color = '#ef4444'; }
  }

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: bg,
      color: color,
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
}
