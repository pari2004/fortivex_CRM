'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, Target, HandCoins, Users } from 'lucide-react';
import { RevenueChart } from './DashboardCharts';
import { leadsData } from '@/lib/data/mockData';

export function ManagerDashboard() {
  const router = useRouter();

  const stats = [
    { title: 'Monthly Revenue', value: '₹12,450,000', icon: HandCoins, color: '#10b981', href: '/payments' },
    { title: 'Target Achieved', value: '82%', icon: Target, color: '#2563EB', href: '/reports' },
    { title: 'Conversion Rate', value: '18.4%', icon: TrendingUp, color: '#f59e0b', href: '/analytics' },
    { title: 'Active Deals', value: '145', icon: Users, color: '#8b5cf6', href: '/pipeline' },
  ];

  return (
    <>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sales Manager</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor sales performance, targets, and revenue forecasts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(stat.href)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', height: '400px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Revenue Forecast</h3>
          <div style={{ height: '300px' }}><RevenueChart /></div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', overflowY: 'auto' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Top Counselors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Sarah Jenkins', deals: 15, rev: '₹2,250,000', perf: 95 },
              { name: 'Rahul Sharma', deals: 12, rev: '₹1,800,000', perf: 88 },
              { name: 'Priya Kapoor', deals: 10, rev: '₹1,500,000', perf: 82 },
              { name: 'Amit Patel', deals: 8, rev: '₹1,200,000', perf: 75 }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                  <div style={{ fontWeight: 'bold', color: '#10b981' }}>{c.rev}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  <span>{c.deals} Deals</span>
                  <span>{c.perf}% to Target</span>
                </div>
                <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.perf}%`, background: '#2563EB' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
