'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, Users, TrendingUp, Phone, BookOpen, Clock, UserCheck, UserX, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  title: string;
  onClose: () => void;
}

export function UserKpiDetailsModal({ title, onClose }: Props) {
  const isPrint = typeof window !== 'undefined' && window.matchMedia('print').matches;
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    const csvContent = `KPI,Value\n${title},Demo Data`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_')}_Report.csv`;
    a.click();
  };

  const renderContent = () => {
    if (title.includes('Total Users')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Users</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>142</div></div>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active Users</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>128</div></div>
            <div className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Inactive Users</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>14</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Department-wise Users</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <tbody>
                   {[['Sales', '45'], ['Marketing', '28'], ['Admissions', '35'], ['Support', '22'], ['HR', '12']].map(d => (
                     <tr key={d[0]} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                       <td style={{ padding: '12px 0' }}>{d[0]}</td><td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold' }}>{d[1]}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Recent Additions</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {['Rajesh Kumar (Sales)', 'Priya Singh (Marketing)', 'Amit Patel (Admissions)'].map(u => (
                   <div key={u} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>{u} - <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Joined this week</span></div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      );
    } else if (title.includes('Online')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <UserCheck size={32} color="#10b981" />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>86</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Online Users</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Employee</th><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Department</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>User {i}</td><td style={{ padding: '12px' }}>EMP-10{i}</td><td style={{ padding: '12px' }}>Sales</td><td style={{ padding: '12px' }}>Counselor</td><td style={{ padding: '12px' }}>09:00 AM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (title.includes('Offline')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <UserX size={32} color="#ef4444" />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>42</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Offline Users</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Employee</th><th style={{ padding: '12px' }}>ID</th><th style={{ padding: '12px' }}>Department</th><th style={{ padding: '12px' }}>Last Active</th><th style={{ padding: '12px' }}>Offline Duration</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>User {i+10}</td><td style={{ padding: '12px' }}>EMP-20{i}</td><td style={{ padding: '12px' }}>Marketing</td><td style={{ padding: '12px' }}>Yesterday 5:00 PM</td><td style={{ padding: '12px' }}>18 hours</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (title.includes('Productivity')) {
      const data = [
        { name: 'Sales', val: 92 }, { name: 'Marketing', val: 86 }, { name: 'Admissions', val: 89 }, { name: 'Support', val: 81 }, { name: 'HR', val: 94 }
      ];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TrendingUp size={32} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>88.4%</div>
              <div style={{ color: 'var(--text-secondary)' }}>Average Productivity</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Department-wise Productivity</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Bar dataKey="val" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    } else if (title.includes('Calls')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[{t: 'Total Calls', v: '12,450', c: '#8b5cf6'}, {t: 'Answered', v: '8,200', c: '#10b981'}, {t: 'Missed', v: '1,450', c: '#ef4444'}, {t: 'Avg Duration', v: '4m 12s', c: '#3b82f6'}].map(s => (
              <div key={s.t} className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.t}</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.c }}>{s.v}</div></div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Recent Call Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Employee</th><th style={{ padding: '12px' }}>Department</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>User {i}</td><td style={{ padding: '12px' }}>Sales</td><td style={{ padding: '12px', color: '#10b981' }}>Connected</td><td style={{ padding: '12px' }}>5m 20s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (title.includes('Leads')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[{t: 'Total Leads Handled', v: '18,500', c: '#ec4899'}, {t: 'New Leads', v: '4,200', c: '#3b82f6'}, {t: 'Interested', v: '3,450', c: '#f59e0b'}, {t: 'Converted', v: '1,120', c: '#10b981'}].map(s => (
              <div key={s.t} className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.t}</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.c }}>{s.v}</div></div>
            ))}
          </div>
        </div>
      );
    } else if (title.includes('Admissions')) {
       return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[{t: 'Total Admissions', v: '1,245', c: '#14b8a6'}, {t: 'Completed', v: '980', c: '#10b981'}, {t: 'Pending Docs', v: '265', c: '#f59e0b'}].map(s => (
              <div key={s.t} className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.t}</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.c }}>{s.v}</div></div>
            ))}
          </div>
        </div>
      );
    } else if (title.includes('Response')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[{t: 'Avg Response Time', v: '4m 12s', c: '#f97316'}, {t: 'Fastest Response', v: '1m 05s', c: '#10b981'}, {t: 'Slowest Response', v: '45m 20s', c: '#ef4444'}].map(s => (
              <div key={s.t} className="glass-panel" style={{ padding: '16px' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.t}</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.c }}>{s.v}</div></div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback
    return <div className="glass-panel" style={{ padding: '24px' }}>Details for {title} not found.</div>;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }} className="no-print">
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{title} Details</h2>
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
  );
}
