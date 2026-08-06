'use client';

import React from 'react';
import { Users, BookOpen, IndianRupee, TrendingUp, UserPlus, FileText, CheckCircle, Activity, BarChart3, PieChart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { leadsData } from '@/lib/data/mockData';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';
import SystemLogsModal from './SystemLogsModal';

export function AdminDashboard() {
  const { leads, applications, students } = useCRM();
  const [showLogsModal, setShowLogsModal] = React.useState(false);
  const router = useRouter();
  
  const topStats = [
    { title: 'Total Leads', value: (120 + leads.length).toString(), icon: Users, color: '#3b82f6', href: '/leads' },
    { title: 'Applications', value: (95 + applications.length).toString(), icon: FileText, color: '#8b5cf6', href: '/applications' },
    { title: 'Admissions', value: '72', icon: CheckCircle, color: '#10b981', href: '/students' },
    { title: 'Active Students', value: (342 + students.length).toString(), icon: BookOpen, color: '#f59e0b', href: '/students' },
    { title: 'Monthly Revenue', value: '₹24,50,000', icon: IndianRupee, color: '#10b981', href: '/payments' },
    { title: 'Conversion Rate', value: '18.4%', icon: Activity, color: '#8b5cf6', href: '/analytics' },
    { title: 'Avg Deal Size', value: '₹1,42,500', icon: TrendingUp, color: '#3b82f6', href: '/analytics' },
    { title: 'Time to Close', value: '14 Days', icon: Clock, color: '#f59e0b', href: '/analytics' },
  ];

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Full Stack Development Program Overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" onClick={() => router.push('/leads')}>+ Add Lead</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {topStats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
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

      {/* Since charts are fully managed in the Analytics section now, we leave the system health and recent admissions summary on the main dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Recent FSD Admissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads.filter(l => l.status === 'Admitted').slice(0, 5).map(lead => (
              <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{lead.counselor}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(lead.createdAt).toLocaleDateString('en-GB')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Server Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                Operational
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-secondary)' }}>API Latency</div>
              <div style={{ fontWeight: 'bold' }}>42ms</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Database Load</div>
              <div style={{ fontWeight: 'bold' }}>18%</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Last Backup</div>
              <div style={{ fontWeight: 'bold' }}>2 hrs ago</div>
            </div>
            <button className="secondary-btn" onClick={() => setShowLogsModal(true)} style={{ marginTop: 'auto', width: '100%' }}>View System Logs</button>
          </div>
        </div>
      </div>
    </div>
      {showLogsModal && <SystemLogsModal onClose={() => setShowLogsModal(false)} />}
    </>
  );
}
