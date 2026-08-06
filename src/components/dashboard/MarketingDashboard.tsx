'use client';

import { useRouter } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';
import { motion } from 'framer-motion';
import { Megaphone, TrendingUp, Users, CheckCircle, IndianRupee, Activity, Target } from 'lucide-react';
import { SourceChart, RevenueChart } from './DashboardCharts';

export function MarketingDashboard() {
  const { leads, applications, students } = useCRM();
  const router = useRouter();

  const stats = [
    { title: 'Total Campaigns', value: '18', icon: Megaphone, color: '#3b82f6', href: '/campaigns' },
    { title: 'Active Campaigns', value: '8', icon: Activity, color: '#10b981', href: '/campaigns' },
    { title: 'Completed Campaigns', value: '10', icon: CheckCircle, color: '#8b5cf6', href: '/campaigns' },
    { title: 'Total Leads Generated', value: '2,480', icon: Users, color: '#f59e0b', href: '/leads' },
    { title: 'Marketing Qualified Leads', value: '865', icon: Target, color: '#ec4899', href: '/leads' },
    { title: 'Campaign Budget', value: '₹12,50,000', icon: IndianRupee, color: '#64748b', href: '/campaigns' },
    { title: 'Revenue Generated', value: '₹48,75,000', icon: TrendingUp, color: '#10b981', href: '/payments' },
    { title: 'ROI', value: '290%', icon: TrendingUp, color: '#3b82f6', href: '/analytics' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="glass-panel hover-card" 
            style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', borderLeft: `4px solid ${stat.color}` }}
            onClick={() => router.push(stat.href)}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={28} />
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.title}</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Lead Sources & Conversion</h3>
            <select style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <SourceChart />
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Marketing Performance</h3>
          <RevenueChart />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .hover-card { transition: all 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
      `}} />
    </div>
  );
}
