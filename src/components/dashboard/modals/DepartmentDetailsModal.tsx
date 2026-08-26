'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, Users, TrendingUp, Phone, BookOpen, Target, UserCheck, UserX, Clock } from 'lucide-react';

interface Props {
  department: string;
  onClose: () => void;
}

export function DepartmentDetailsModal({ department, onClose }: Props) {
  const handlePrint = () => window.print();
  
  const handleDownload = () => {
    const csvContent = `Department,${department}\nEmployees,Demo`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${department}_Department_Report.csv`;
    a.click();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }} className="no-print">
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{department} Department</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={handleDownload} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={16} /> Export</button>
          <button className="secondary-btn" onClick={handlePrint} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={16} /> Print</button>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Users size={24} color="#3b82f6" /><div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Employees</div><div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>45</div></div>
            </div>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <UserCheck size={24} color="#10b981" /><div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Online</div><div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>38</div></div>
            </div>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <UserX size={24} color="#ef4444" /><div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Offline</div><div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>7</div></div>
            </div>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <TrendingUp size={24} color="#f59e0b" /><div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Productivity</div><div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>92%</div></div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Leads</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>8,450</div></div>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Calls</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4,200</div></div>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Admissions</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>480</div></div>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avg Response</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2m 10s</div></div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Employees Directory</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px' }}>Employee</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Leads</th>
                    <th style={{ padding: '12px' }}>Calls</th>
                    <th style={{ padding: '12px' }}>Admissions</th>
                    <th style={{ padding: '12px' }}>Productivity</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 500, color: 'var(--primary-color)' }}>User {i}</td>
                      <td style={{ padding: '12px' }}>Manager</td>
                      <td style={{ padding: '12px' }}><span style={{ color: i%2===0 ? '#10b981' : '#ef4444' }}>{i%2===0 ? 'Online' : 'Offline'}</span></td>
                      <td style={{ padding: '12px' }}>420</td>
                      <td style={{ padding: '12px' }}>150</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 500 }}>25</td>
                      <td style={{ padding: '12px' }}>9{i}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
