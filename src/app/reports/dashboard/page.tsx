'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, UserPlus, DollarSign, 
  CreditCard, Briefcase, CalendarCheck, TrendingUp,
  Download, Activity, BarChart2, PieChart, LineChart, FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

// Mock Data
const kpis = [
  { title: 'Total Leads', value: '3,450', icon: Users, color: '#3b82f6', trend: '+12%' },
  { title: 'New Admissions', value: '412', icon: UserPlus, color: '#10b981', trend: '+8%' },
  { title: 'Active Students', value: '1,205', icon: UserCheck, color: '#8b5cf6', trend: '+5%' },
  { title: 'Total Revenue', value: '₹4.5Cr', icon: DollarSign, color: '#f59e0b', trend: '+15%' },
  { title: 'Pending Fees', value: '₹12.4L', icon: CreditCard, color: '#ef4444', trend: '-2%' },
  { title: 'Placement Rate', value: '92%', icon: Briefcase, color: '#0ea5e9', trend: '+3%' },
  { title: 'Avg Attendance', value: '88%', icon: CalendarCheck, color: '#84cc16', trend: '+1%' },
  { title: 'Conversion Rate', value: '18%', icon: TrendingUp, color: '#ec4899', trend: '+4%' },
];

const recentActivity = [
  { time: '10 mins ago', desc: 'New admission: Aarav Patel (FSD-B1)', type: 'success' },
  { time: '45 mins ago', desc: 'Payment received: ₹45,000 from Priya', type: 'success' },
  { time: '2 hrs ago', desc: 'Lead status updated: 15 leads converted', type: 'info' },
  { time: '3 hrs ago', desc: 'System generated monthly attendance report', type: 'info' },
  { time: '5 hrs ago', desc: 'Missed deadline: Faculty review pending', type: 'warning' },
];

export default function DashboardAnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Comprehensive view of CRM performance, revenue, and student metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(kpis, 'Dashboard_Analytics_2026', 'Executive Dashboard KPI Metrics')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(kpis, 'Dashboard_Analytics_2026', 'Executive Dashboard Analytics Report')}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', cursor: 'pointer' }}
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${kpi.color}20`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{kpi.title}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{kpi.value}</div>
            </div>
            <div style={{ 
              position: 'absolute', top: '24px', right: '24px', fontSize: '0.8rem', fontWeight: 'bold', 
              color: kpi.trend.includes('+') ? '#10b981' : '#ef4444' 
            }}>
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Charts Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Mock Line Chart: Revenue Trend */}
            <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LineChart size={20} color="#3b82f6" /> Revenue Trend
              </h3>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                  <path d="M0,80 Q20,60 40,70 T80,40 T100,20" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <path d="M0,100 L0,80 Q20,60 40,70 T80,40 T100,20 L100,100 Z" fill="rgba(59, 130, 246, 0.1)" />
                </svg>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((m) => (
                  <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
                ))}
              </div>
            </div>

            {/* Mock Bar Chart: Monthly Admissions */}
            <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="#10b981" /> Monthly Admissions
              </h3>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                {[40, 70, 55, 90, 65, 80].map((h, i) => (
                  <div key={i} style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px' }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} style={{ background: '#10b981', borderRadius: '4px 4px 0 0' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Mock Pie Chart / Donuts: Course Enrollments */}
            <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={20} color="#8b5cf6" /> Course Enrollments
              </h3>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#8b5cf6 0% 45%, #3b82f6 45% 75%, #10b981 75% 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'white' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }}/> FSD (45%)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}/> UI/UX (30%)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}/> Data Sci (25%)</div>
                </div>
              </div>
            </div>

            {/* Mock Funnel Chart: Lead Conversion */}
            <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="#f59e0b" /> Lead Conversion Funnel
              </h3>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '90%', background: '#3b82f6', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Total Leads (3,450)</div>
                <div style={{ width: '70%', background: '#8b5cf6', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Contacted (2,100)</div>
                <div style={{ width: '50%', background: '#f59e0b', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Interested (950)</div>
                <div style={{ width: '30%', background: '#10b981', color: 'white', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Enrolled (412)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Panel: Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Recent Activity</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '12px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }} />
              
              {recentActivity.map((act, idx) => {
                const isLast = idx === recentActivity.length - 1;
                let dotColor = '#3b82f6';
                if (act.type === 'success') dotColor = '#10b981';
                if (act.type === 'warning') dotColor = '#f59e0b';
                
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: isLast ? '0' : '24px', position: 'relative' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, marginTop: '5px', zIndex: 2, outline: '4px solid rgba(255,255,255,0.9)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.desc}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{act.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
