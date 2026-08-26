'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Download, Printer, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  userName: string;
  onClose: () => void;
}

export function UserDetailsModal({ userName, onClose }: Props) {
  const performanceData = [
    { name: 'Mon', calls: 45, leads: 12 },
    { name: 'Tue', calls: 52, leads: 15 },
    { name: 'Wed', calls: 38, leads: 10 },
    { name: 'Thu', calls: 65, leads: 20 },
    { name: 'Fri', calls: 48, leads: 14 },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {userName.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{userName}</h2>
              <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {userName.toLowerCase().replace(' ', '.')}@fortivex.ai</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> +91 98765 43210</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Download size={16} /></button>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Printer size={16} /></button>
            <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)' }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* LEFT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Employee Information</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Employee ID</span><span style={{ fontWeight: 500 }}>EMP-1024</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Department</span><span style={{ fontWeight: 500 }}>Admissions</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Role</span><span style={{ fontWeight: 500 }}>Counselor</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Team</span><span style={{ fontWeight: 500 }}>North Zone A</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Manager</span><span style={{ fontWeight: 500 }}>John Doe</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Joining Date</span><span style={{ fontWeight: 500 }}>12 Jan 2024</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Created Date</span><span style={{ fontWeight: 500 }}>10 Jan 2024</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Updated Date</span><span style={{ fontWeight: 500 }}>11 Aug 2026</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Status</span><span style={{ color: '#10b981', fontWeight: 500 }}>Active</span></div>
                 <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Last Active</span><span style={{ fontWeight: 500 }}>Online Now</span></div>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Performance & Metrics</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Leads</div><div style={{ fontWeight: 'bold' }}>450</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Call Attempts</div><div style={{ fontWeight: 'bold' }}>1,200</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Connected Calls</div><div style={{ fontWeight: 'bold' }}>850</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interested Leads</div><div style={{ fontWeight: 'bold' }}>210</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Conversion Rate</div><div style={{ fontWeight: 'bold', color: '#10b981' }}>18.5%</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Productivity</div><div style={{ fontWeight: 'bold', color: '#3b82f6' }}>94%</div></div>
                 <div><div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Attendance</div><div style={{ fontWeight: 'bold' }}>98%</div></div>
               </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Weekly Performance Trend</h3>
               <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="calls" name="Calls Attempted" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="leads" name="Leads Processed" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Recent Activity Timeline</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {[
                   { action: 'Closed Lead #4052', time: '10 mins ago', type: 'success' },
                   { action: 'Updated Application #8891', time: '1 hour ago', type: 'info' },
                   { action: 'Missed Call from Student', time: '2 hours ago', type: 'warning' },
                 ].map((item, i) => (
                   <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ background: item.type === 'success' ? '#10b981' : item.type === 'warning' ? '#f59e0b' : '#3b82f6', padding: '6px', borderRadius: '50%', color: 'white' }}>
                        <Activity size={14} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 500 }}>{item.action}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.time}</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
