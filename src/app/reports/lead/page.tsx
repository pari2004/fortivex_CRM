'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, Clock, 
  Download, FileText, Search, Filter,
  PieChart, LineChart, Target, ArrowRight
} from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

// Mock Data
const stats = [
  { title: 'Total Leads (YTD)', value: '8,450', icon: Users, color: '#3b82f6', trend: '+15%' },
  { title: 'Successfully Converted', value: '1,520', icon: CheckCircle, color: '#10b981', trend: '+8%' },
  { title: 'Dropped Leads', value: '2,130', icon: XCircle, color: '#ef4444', trend: '-2%' },
  { title: 'Avg Conversion Time', value: '14 Days', icon: Clock, color: '#8b5cf6', trend: '-1 Day' },
];

const leadReportData = [
  { id: 'LD-001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210', source: 'Google Ads', course: 'Full Stack Dev', status: 'Converted', date: '10 Aug 2026' },
  { id: 'LD-002', name: 'Sneha Patel', email: 'sneha.p@example.com', phone: '+91 8765432109', source: 'Organic Search', course: 'UI/UX Design', status: 'In Progress', date: '08 Aug 2026' },
  { id: 'LD-003', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 7654321098', source: 'Facebook Ads', course: 'Data Science', status: 'Dropped', date: '05 Aug 2026' },
  { id: 'LD-004', name: 'Priya Singh', email: 'priya.s@example.com', phone: '+91 6543210987', source: 'Referral', course: 'Full Stack Dev', status: 'New', date: '12 Aug 2026' },
  { id: 'LD-005', name: 'Karan Desai', email: 'karan.d@example.com', phone: '+91 5432109876', source: 'Organic Search', course: 'UI/UX Design', status: 'Converted', date: '01 Aug 2026' },
  { id: 'LD-006', name: 'Anita Verma', email: 'anita.v@example.com', phone: '+91 4321098765', source: 'Google Ads', course: 'Data Science', status: 'In Progress', date: '11 Aug 2026' },
];

export default function LeadReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLeads = leadReportData.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Converted') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'In Progress') return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    if (status === 'Dropped') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
    return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }; // New
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Lead Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze lead sources, conversion rates, and detailed lead performance data.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredLeads, 'Lead_Report_2026', 'Lead Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredLeads, 'Lead_Report_2026', 'Lead Performance & Conversion Report')}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444', cursor: 'pointer' }}
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
              color: stat.trend.includes('+') ? (stat.color === '#ef4444' ? '#ef4444' : '#10b981') : (stat.color === '#ef4444' ? '#10b981' : '#ef4444') 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Mock Line Chart: Monthly Lead Trend */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LineChart size={20} color="#3b82f6" /> Monthly Lead Trend
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
            {/* Simple SVG Line Curve */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0,90 Q15,70 30,50 T60,60 T100,20" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <path d="M0,100 L0,90 Q15,70 30,50 T60,60 T100,20 L100,100 Z" fill="rgba(59, 130, 246, 0.1)" />
            </svg>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
              <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Lead Source Analysis */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#8b5cf6" /> Lead Source Analysis
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Google Ads</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} style={{ height: '100%', background: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>45%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Organic Search</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} style={{ height: '100%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>30%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Facebook Ads</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} style={{ height: '100%', background: '#8b5cf6' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>15%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Referrals</div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} style={{ height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>10%</div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Lead Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#3b82f6" /> Detailed Lead Report
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search leads..." 
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
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Lead Name & ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Contact Info</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Source</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Interested Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Date Created</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => {
                const statusStyle = getStatusStyle(lead.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{lead.id}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.email}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.phone}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{lead.source}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#8b5cf6' }}>{lead.course}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{lead.date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="View Lead Details"
                        style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}
                      >
                        Details <ArrowRight size={14} />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No leads found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
