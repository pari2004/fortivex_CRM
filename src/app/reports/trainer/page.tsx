'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';
import { 
  Users, Video, Star, BookOpen, 
  Download, FileText, Search, Filter, PieChart, 
  BarChart, ExternalLink
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Active Trainers', value: '24', icon: Users, color: '#3b82f6', trend: '+2' },
  { title: 'Total Sessions', value: '450', icon: Video, color: '#10b981', trend: '+45' },
  { title: 'Avg Rating', value: '4.8/5', icon: Star, color: '#f59e0b', trend: '+0.2' },
  { title: 'Top Course', value: 'Full Stack', icon: BookOpen, color: '#8b5cf6', trend: '4.9 Avg' },
];

const trainerReportData = [
  { id: 'TRN-001', name: 'Rajesh Kumar', expertise: 'Frontend React', sessions: 85, students: 240, rating: 4.9, status: 'Active' },
  { id: 'TRN-002', name: 'Sneha Patel', expertise: 'UI/UX Design', sessions: 62, students: 180, rating: 4.7, status: 'Active' },
  { id: 'TRN-003', name: 'Amit Kumar', expertise: 'Data Science', sessions: 45, students: 120, rating: 4.4, status: 'On Leave' },
  { id: 'TRN-004', name: 'Priya Singh', expertise: 'Backend Node.js', sessions: 90, students: 250, rating: 4.8, status: 'Active' },
  { id: 'TRN-005', name: 'Karan Desai', expertise: 'UI/UX Tools', sessions: 35, students: 100, rating: 4.6, status: 'Active' },
  { id: 'TRN-006', name: 'Anita Verma', expertise: 'Machine Learning', sessions: 20, students: 60, rating: 4.9, status: 'Inactive' },
];

export default function TrainerReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTrainers = trainerReportData.filter(trn => {
    const matchesSearch = 
      trn.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trn.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || trn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Active') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'On Leave') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // Inactive
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Trainer Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Evaluate faculty performance, session delivery statistics, and student feedback.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredTrainers, 'Trainer_Reports_2026', 'Trainer Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredTrainers, 'Trainer_Reports_2026', 'Faculty & Trainer Performance Report')}
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
              color: stat.trend.includes('+') ? '#10b981' : '#8b5cf6' 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Session Delivery Analytics */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={20} color="#3b82f6" /> Monthly Session Delivery
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            {[45, 60, 50, 80, 65, 95].map((h, i) => (
              <div key={i} style={{ width: '10%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{h}</div>
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        {/* Student Feedback Distribution */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#f59e0b" /> Feedback Ratings
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>5 <Star size={12} color="#f59e0b" fill="#f59e0b"/></div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>65%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>4 <Star size={12} color="#f59e0b" fill="#f59e0b"/></div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} style={{ height: '100%', background: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>25%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>3 <Star size={12} color="#f59e0b" fill="#f59e0b"/></div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '8%' }} style={{ height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>8%</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>&lt; 3 <Star size={12} color="#f59e0b" fill="#f59e0b"/></div>
              <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '2%' }} style={{ height: '100%', background: '#ef4444' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '35px' }}>2%</div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Trainer Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Trainer Performance Directory</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search trainer or expertise..." 
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
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Trainer Name & ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Expertise</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Total Sessions</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Students Taught</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Avg Rating</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.map((trn, i) => {
                const statusStyle = getStatusStyle(trn.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {trn.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{trn.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '2px' }}>{trn.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{trn.expertise}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>{trn.sessions}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>{trn.students}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 'bold', color: '#f59e0b', fontSize: '1.05rem' }}>
                        {trn.rating} <Star size={16} fill="#f59e0b" />
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {trn.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="View Detailed Profile"
                        style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ExternalLink size={16} />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredTrainers.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No trainers found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
