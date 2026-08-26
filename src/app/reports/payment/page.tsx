'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';
import { 
  DollarSign, CreditCard, AlertCircle, TrendingUp, 
  Download, FileText, Search, Filter, PieChart, 
  LineChart, CheckCircle, XCircle
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Revenue', value: '₹4.5Cr', icon: DollarSign, color: '#10b981', trend: '+15%' },
  { title: 'Collected (This Month)', value: '₹42.5L', icon: TrendingUp, color: '#3b82f6', trend: '+5%' },
  { title: 'Pending Fees', value: '₹12.4L', icon: AlertCircle, color: '#f59e0b', trend: '-2%' },
  { title: 'Avg Transaction', value: '₹45,000', icon: CreditCard, color: '#8b5cf6', trend: '+1%' },
];

const paymentReportData = [
  { id: 'TXN-001', student: 'Rahul Sharma', course: 'Full Stack Dev', amount: '₹45,000', method: 'UPI', date: '10 Aug 2026', status: 'Completed' },
  { id: 'TXN-002', student: 'Sneha Patel', course: 'UI/UX Design', amount: '₹60,000', method: 'Credit Card', date: '08 Aug 2026', status: 'Completed' },
  { id: 'TXN-003', student: 'Amit Kumar', course: 'Data Science', amount: '₹20,000', method: 'Bank Transfer', date: '05 Aug 2026', status: 'Pending' },
  { id: 'TXN-004', student: 'Priya Singh', course: 'Full Stack Dev', amount: '₹90,000', method: 'Debit Card', date: '12 Aug 2026', status: 'Completed' },
  { id: 'TXN-005', student: 'Karan Desai', course: 'UI/UX Design', amount: '₹30,000', method: 'UPI', date: '01 Aug 2026', status: 'Failed' },
  { id: 'TXN-006', student: 'Anita Verma', course: 'Data Science', amount: '₹1,20,000', method: 'Bank Transfer', date: '11 Aug 2026', status: 'Completed' },
];

export default function PaymentReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = paymentReportData.filter(pay => {
    const matchesSearch = 
      pay.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pay.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Completed') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <CheckCircle size={14} /> };
    if (status === 'Pending') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <AlertCircle size={14} /> };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <XCircle size={14} /> }; // Failed
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Payment Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze revenue streams, fee collections, and track pending student balances.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredPayments, 'Payment_Reports_2026', 'Payment & Fee Collection Report')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredPayments, 'Payment_Reports_2026', 'Payment & Fee Collection Report')}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', cursor: 'pointer' }}
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
            <div style={{ 
              position: 'absolute', top: '24px', right: '24px', fontSize: '0.8rem', fontWeight: 'bold', 
              color: stat.trend.includes('+') ? '#10b981' : (stat.color === '#f59e0b' ? '#10b981' : '#ef4444') 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Monthly Revenue Chart */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LineChart size={20} color="#10b981" /> Monthly Revenue Trend
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
            {/* Simple SVG Line Curve */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0,80 Q15,90 30,50 T60,40 T100,10" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M0,100 L0,80 Q15,90 30,50 T60,40 T100,10 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
            </svg>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
              <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Fee Collection Analytics */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#f59e0b" /> Fee Collection Status
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Collected</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} style={{ height: '100%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#10b981' }}>78%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Pending</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} style={{ height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#f59e0b' }}>18%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Failed</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '4%' }} style={{ height: '100%', background: '#ef4444' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#ef4444' }}>4%</div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Payment Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="#3b82f6" /> Transaction Log
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search transaction ID or student..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)',
                  outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Transaction ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Payment Method</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((pay, i) => {
                const statusStyle = getStatusStyle(pay.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{pay.id}</td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{pay.student}</td>
                    <td style={{ padding: '16px', fontWeight: 500, color: '#8b5cf6' }}>{pay.course}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{pay.method}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{pay.date}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '1.05rem', color: pay.status === 'Completed' ? '#10b981' : (pay.status === 'Failed' ? '#ef4444' : 'var(--text-primary)') }}>
                      {pay.amount}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {statusStyle.icon} {pay.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No transactions found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
