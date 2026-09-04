import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Users, PhoneCall, Briefcase, IndianRupee, Target, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  dashboardData?: any;
  isOpen: boolean;
  onClose: () => void;
}

const mockChartData = [
  { name: 'Mon', calls: 120, deals: 20, revenue: 150000, conversion: 16 },
  { name: 'Tue', calls: 140, deals: 25, revenue: 200000, conversion: 18 },
  { name: 'Wed', calls: 110, deals: 15, revenue: 120000, conversion: 14 },
  { name: 'Thu', calls: 150, deals: 30, revenue: 250000, conversion: 20 },
  { name: 'Fri', calls: 160, deals: 35, revenue: 300000, conversion: 22 },
  { name: 'Sat', calls: 90, deals: 10, revenue: 80000, conversion: 11 },
  { name: 'Sun', calls: 50, deals: 5, revenue: 40000, conversion: 10 },
];

export function ActivityAnalyticsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;


  useGlobalEscape(!!isOpen, () => { onClose() });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel"
        style={{ width: '95%', maxWidth: '1200px', height: '90vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Activity Analytics</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>Comprehensive view of productivity, trends, and performance.</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          
          {/* Top KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {[
              { label: 'Weekly Calls Trend', value: '+14%', count: '820', icon: PhoneCall, color: '#3b82f6', trendUp: true },
              { label: 'Deal Conversion', value: '+2.4%', count: '18.4%', icon: Target, color: '#10b981', trendUp: true },
              { label: 'Avg Revenue / Deal', value: '-1.2%', count: '₹12,400', icon: IndianRupee, color: '#f59e0b', trendUp: false },
              { label: 'User Productivity', value: '+5%', count: '85%', icon: Activity, color: '#8b5cf6', trendUp: true },
            ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={20} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: stat.trendUp ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                    {stat.trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />} {stat.value}
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.count}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>Calls & Deals Trend</h3>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
                    <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10b981" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>Lead Conversion %</h3>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                    <Bar dataKey="conversion" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>Revenue Trend</h3>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} fill="#8b5cf620" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
