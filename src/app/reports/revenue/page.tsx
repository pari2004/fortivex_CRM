'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';
import { 
  DollarSign, TrendingUp, AlertCircle, PieChart, 
  Download, FileText, Search, Filter, BarChart, 
  LineChart, CheckCircle
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Revenue (YTD)', value: '₹4.5Cr', icon: DollarSign, color: '#10b981', trend: '+15%' },
  { title: 'Monthly Target', value: '85%', icon: TrendingUp, color: '#3b82f6', trend: '₹42.5L' },
  { title: 'Outstanding Dues', value: '₹12.4L', icon: AlertCircle, color: '#ef4444', trend: '-2%' },
  { title: 'YoY Growth', value: '22%', icon: PieChart, color: '#8b5cf6', trend: '+5%' },
];

const revenueReportData = [
  { id: 'INV-2026-001', student: 'Rahul Sharma', course: 'Full Stack Dev', total: '₹90,000', paid: '₹45,000', due: '₹45,000', dueDate: '15 Sep 2026', status: 'Partial' },
  { id: 'INV-2026-002', student: 'Sneha Patel', course: 'UI/UX Design', total: '₹60,000', paid: '₹60,000', due: '₹0', dueDate: '-', status: 'Paid' },
  { id: 'INV-2026-003', student: 'Amit Kumar', course: 'Data Science', total: '₹1,20,000', paid: '₹20,000', due: '₹1,00,000', dueDate: '10 Aug 2026', status: 'Overdue' },
  { id: 'INV-2026-004', student: 'Priya Singh', course: 'Full Stack Dev', total: '₹90,000', paid: '₹90,000', due: '₹0', dueDate: '-', status: 'Paid' },
  { id: 'INV-2026-005', student: 'Karan Desai', course: 'UI/UX Design', total: '₹60,000', paid: '₹30,000', due: '₹30,000', dueDate: '20 Aug 2026', status: 'Partial' },
  { id: 'INV-2026-006', student: 'Anita Verma', course: 'Data Science', total: '₹1,20,000', paid: '₹1,20,000', due: '₹0', dueDate: '-', status: 'Paid' },
];

export default function RevenueReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRevenue = revenueReportData.filter(rev => {
    const matchesSearch = 
      rev.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rev.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Paid') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'Partial') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // Overdue
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Revenue Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track overarching financial performance, course-wise revenue, and outstanding dues.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredRevenue, 'Revenue_Reports_2026', 'Revenue Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredRevenue, 'Revenue_Reports_2026', 'Financial & Revenue Performance Report')}
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
              color: stat.trend.includes('+') ? '#10b981' : (stat.color === '#ef4444' ? '#10b981' : '#ef4444') 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        
        {/* Monthly Revenue Chart */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LineChart size={20} color="#10b981" /> Monthly Growth
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0,80 Q25,70 50,40 T100,10" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M0,100 L0,80 Q25,70 50,40 T100,10 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
            </svg>
            {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => (
              <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Course Revenue Analysis */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={20} color="#3b82f6" /> Course Revenue
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            
            <div style={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>₹2.1Cr</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>FSD</div>
            </div>
            <div style={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>₹1.2Cr</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} style={{ width: '100%', background: '#8b5cf6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>UI/UX</div>
            </div>
            <div style={{ width: '25%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>₹1.2Cr</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>Data Sci</div>
            </div>

          </div>
        </div>

        {/* Outstanding Payment Analysis */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#ef4444" /> Receivables Health
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '70px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Collected</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} style={{ height: '100%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#10b981' }}>85%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '70px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Pending</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} style={{ height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#f59e0b' }}>10%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '70px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Overdue</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} style={{ height: '100%', background: '#ef4444' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px', color: '#ef4444' }}>5%</div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Revenue Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Revenue & Outstanding Log</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search invoice ID or student..." 
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
                <option value="Paid">Paid</option>
                <option value="Partial">Partial Payment</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Invoice ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Amount Paid</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Outstanding</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRevenue.map((rev, i) => {
                const statusStyle = getStatusStyle(rev.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{rev.id}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{rev.student}</td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{rev.course}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{rev.total}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>{rev.paid}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: rev.due !== '₹0' ? '#ef4444' : 'var(--text-tertiary)' }}>{rev.due}</td>
                    <td style={{ padding: '16px', color: rev.status === 'Overdue' ? '#ef4444' : 'var(--text-secondary)' }}>{rev.dueDate}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {rev.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredRevenue.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No revenue records found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
