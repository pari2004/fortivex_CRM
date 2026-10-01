'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, BarChart2, Calendar, Phone, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  reportType: string;
  onClose: () => void;
}

export function ReportDetailsModal({ reportType, onClose }: Props) {
  const handlePrint = () => window.print();
  
  const handleDownload = () => {
    const csvContent = `Report Type,${reportType}\nData,Demo`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/ /g, '_')}_Export.csv`;
    a.click();
  };

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 450 },
    { name: 'Fri', value: 600 },
  ];

  const renderContent = () => {
    if (reportType === 'Daily User Report') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Activity size={24} color="#3b82f6" />
              <h3 style={{ fontWeight: 'bold' }}>Active Users Trend</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>System Logins Today</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px' }}>Employee</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Login Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px' }}>User {i}</td><td style={{ padding: '12px' }}>Manager</td><td style={{ padding: '12px' }}>09:{i}0 AM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (reportType === 'Productivity Report') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <BarChart2 size={24} color="#f59e0b" />
              <h3 style={{ fontWeight: 'bold' }}>Department Productivity Comparison</h3>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{n: 'Sales', v: 92}, {n: 'Marketing', v: 85}, {n: 'HR', v: 95}, {n: 'Admissions', v: 88}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="n" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Bar dataKey="v" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    } else if (reportType === 'Attendance Report') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Calendar size={24} color="#10b981" />
              <h3 style={{ fontWeight: 'bold' }}>Attendance Sheet (This Week)</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px' }}>Employee</th>
                    <th style={{ padding: '12px' }}>Mon</th><th style={{ padding: '12px' }}>Tue</th><th style={{ padding: '12px' }}>Wed</th><th style={{ padding: '12px' }}>Thu</th><th style={{ padding: '12px' }}>Fri</th>
                    <th style={{ padding: '12px' }}>Avg Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 500 }}>User {i}</td>
                      <td style={{ padding: '12px', color: '#10b981' }}>P</td><td style={{ padding: '12px', color: '#10b981' }}>P</td>
                      <td style={{ padding: '12px', color: i===3 ? '#ef4444' : '#10b981' }}>{i===3 ? 'A' : 'P'}</td>
                      <td style={{ padding: '12px', color: '#10b981' }}>P</td><td style={{ padding: '12px', color: '#10b981' }}>P</td>
                      <td style={{ padding: '12px' }}>8h 30m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (reportType === 'Calls Report') {
       return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Phone size={24} color="#8b5cf6" />
              <h3 style={{ fontWeight: 'bold' }}>Total Calls Trend</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Top Callers</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px' }}>Employee</th><th style={{ padding: '12px' }}>Calls</th><th style={{ padding: '12px' }}>Connected</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px' }}>User {i}</td><td style={{ padding: '12px' }}>{150 - i*10}</td><td style={{ padding: '12px' }}>{100 - i*5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return <div>Report Details for {reportType}</div>;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '95%', height: '95%', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }} className="no-print">
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{reportType}</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={handleDownload} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={16} /> Export</button>
          <button className="secondary-btn" onClick={handlePrint} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={16} /> Print</button>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </div>
      </div>
    </div>
  );
}
