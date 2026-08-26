'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Calendar as CalendarIcon, Clock, Download, Printer, Activity, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  employeeName: string;
  onClose: () => void;
}

export function EmployeeAttendanceModal({ employeeName, onClose }: Props) {
  const weeklyData = [
    { name: 'Mon', hours: 8.5 },
    { name: 'Tue', hours: 9.1 },
    { name: 'Wed', hours: 7.8 },
    { name: 'Thu', hours: 8.2 },
    { name: 'Fri', hours: 8.0 },
  ];

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {employeeName.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{employeeName}</h2>
              <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {employeeName.toLowerCase().replace(' ', '.')}@fortivex.ai</span>
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
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Attendance Profile</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Department</span><span style={{ fontWeight: 500 }}>Sales</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Role</span><span style={{ fontWeight: 500 }}>Executive</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Manager</span><span style={{ fontWeight: 500 }}>Aditi Sharma</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Attendance %</span><span style={{ color: '#10b981', fontWeight: 500 }}>96%</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Leaves Left</span><span style={{ fontWeight: 500 }}>12 Days</span></div>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Today's Log</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Check-in</span><span style={{ fontWeight: 'bold' }}>09:05 AM</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Check-out</span><span style={{ fontWeight: 'bold' }}>06:15 PM</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Break Time</span><span style={{ fontWeight: 'bold' }}>45 mins</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Total Hrs</span><span style={{ fontWeight: 'bold', color: '#3b82f6' }}>8h 25m</span></div>
               </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Working Hours Trend</h3>
               <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                    <Bar dataKey="hours" name="Hours Logged" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Attendance Log History</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>In</th>
                      <th style={{ padding: '12px 16px' }}>Out</th>
                      <th style={{ padding: '12px 16px' }}>Total Hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Oct 24, 2026', status: 'Present', in: '09:00 AM', out: '06:05 PM', hrs: '8h 20m' },
                      { date: 'Oct 23, 2026', status: 'Present', in: '09:15 AM', out: '06:30 PM', hrs: '8h 30m' },
                      { date: 'Oct 22, 2026', status: 'Leave', in: '-', out: '-', hrs: '-' },
                      { date: 'Oct 21, 2026', status: 'WFH', in: '09:05 AM', out: '06:00 PM', hrs: '8h 10m' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.date}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', 
                            background: row.status === 'Present' || row.status === 'WFH' ? '#10b98120' : '#f59e0b20', 
                            color: row.status === 'Present' || row.status === 'WFH' ? '#10b981' : '#f59e0b' 
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{row.in}</td>
                        <td style={{ padding: '12px 16px' }}>{row.out}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.hrs}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
