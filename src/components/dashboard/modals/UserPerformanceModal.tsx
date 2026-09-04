'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, Target, Phone, BarChart2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  userName: string;
  onClose: () => void;
}

export function UserPerformanceModal({ userName, onClose }: Props) {
  const chartData = [
    { name: 'Week 1', leads: 40, converted: 12, target: 10 },
    { name: 'Week 2', leads: 45, converted: 15, target: 12 },
    { name: 'Week 3', leads: 50, converted: 18, target: 15 },
    { name: 'Week 4', leads: 60, converted: 25, target: 20 },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Performance Analytics</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[{ title: 'Total Leads', val: '458', icon: Target, c: '#3b82f6' }, { title: 'Leads Converted', val: '86', icon: TrendingUp, c: '#10b981' }, { title: 'Call Attempts', val: '1,204', icon: Phone, c: '#f59e0b' }, { title: 'Productivity Score', val: '92%', icon: BarChart2, c: '#8b5cf6' }].map(k => (
             <div key={k.title} className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
               <div style={{ background: `${k.c}15`, color: k.c, padding: '12px', borderRadius: '8px' }}><k.icon size={20}/></div>
               <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.title}</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{k.val}</div></div>
             </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Monthly Targets vs Converted</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Legend />
                  <Bar dataKey="target" name="Target" fill="#f59e0b" radius={[4,4,0,0]} />
                  <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Leads Processed Trend</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="leads" name="Leads Processed" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
