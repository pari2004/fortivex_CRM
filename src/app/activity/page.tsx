'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Activity as ActivityIcon } from 'lucide-react';
import { DataToolbar } from '@/components/common/DataToolbar';

const MOCK_ACTIVITY = [
  { id: '1', time: '2026-08-03 10:15 AM', user: 'Admin', activity: 'Created new Application APP-102', module: 'Applications', status: 'Completed' },
  { id: '2', time: '2026-08-03 09:30 AM', user: 'Admission Counselor', activity: 'Logged a call with Student STU-501', module: 'Calls', status: 'Completed' },
  { id: '3', time: '2026-08-02 04:45 PM', user: 'Sales Manager', activity: 'Updated Lead Status to "Hot"', module: 'Leads', status: 'Completed' },
  { id: '4', time: '2026-08-02 02:20 PM', user: 'Admin', activity: 'Added new Student STU-502', module: 'Students', status: 'Completed' },
  { id: '5', time: '2026-08-01 11:10 AM', user: 'Marketing Team', activity: 'Scheduled Demo for Lead L-204', module: 'Tasks', status: 'Pending' },
  { id: '6', time: '2026-08-01 09:00 AM', user: 'Admission Counselor', activity: 'Uploaded Document for APP-101', module: 'Documents', status: 'Completed' },
];

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState(MOCK_ACTIVITY);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'var(--status-enrolled)';
      case 'pending': return 'var(--status-pending)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'var(--status-enrolled-bg)';
      case 'pending': return 'var(--status-pending-bg)';
      default: return 'var(--bg-tertiary)';
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <ActivityIcon size={24} />
            </div>
            Activity History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>View complete CRM activity and audit logs.</p>
        </div>
      </div>

      {/* Toolbar */}
      <DataToolbar
        data={MOCK_ACTIVITY}
        onFilteredDataChange={setActivities}
        searchKeys={['activity', 'user', 'module']}
        searchPlaceholder="Search activity..."
        filterOptions={[
          { key: 'module', label: 'Module', type: 'select', options: ['Applications', 'Calls', 'Leads', 'Students', 'Tasks', 'Documents'] },
          { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Pending'] }
        ]}
      />

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Time</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Activity</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Module</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {item.time}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.user}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {item.activity}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-secondary)' 
                    }}>
                      {item.module}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      backgroundColor: getStatusBg(item.status), 
                      color: getStatusColor(item.status) 
                    }}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {activities.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No activities found.
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing 1 to {activities.length} of {activities.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>Previous</button>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--primary-color)', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
