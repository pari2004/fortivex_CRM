'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';
import { 
  CalendarCheck, UserCheck, UserMinus, FileClock, 
  Download, FileText, Search, Filter, BarChart, 
  LineChart, Eye
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Avg Attendance', value: '86%', icon: CalendarCheck, color: '#10b981', trend: '+2%' },
  { title: 'Present Today', value: '942', icon: UserCheck, color: '#3b82f6', trend: '+15' },
  { title: 'Absent Today', value: '112', icon: UserMinus, color: '#ef4444', trend: '-5' },
  { title: 'Leaves Approved', value: '45', icon: FileClock, color: '#f59e0b', trend: '+2' },
];

const attendanceReportData = [
  { id: 'STU-1001', name: 'Rahul Sharma', batch: 'FSD-B1', present: 45, absent: 3, leave: 2, total: 50, percentage: 90 },
  { id: 'STU-1002', name: 'Sneha Patel', batch: 'UI-B2', present: 42, absent: 5, leave: 3, total: 50, percentage: 84 },
  { id: 'STU-1003', name: 'Amit Kumar', batch: 'DS-B1', present: 32, absent: 15, leave: 3, total: 50, percentage: 64 },
  { id: 'STU-1004', name: 'Priya Singh', batch: 'FSD-B1', present: 48, absent: 1, leave: 1, total: 50, percentage: 96 },
  { id: 'STU-1005', name: 'Karan Desai', batch: 'UI-B1', present: 38, absent: 10, leave: 2, total: 50, percentage: 76 },
  { id: 'STU-1006', name: 'Anita Verma', batch: 'DS-B1', present: 22, absent: 25, leave: 3, total: 50, percentage: 44 },
  { id: 'STU-1007', name: 'Vikram Iyer', batch: 'FSD-B2', present: 44, absent: 4, leave: 2, total: 50, percentage: 88 },
];

export default function AttendanceReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');

  const filteredAttendance = attendanceReportData.filter(stu => {
    const matchesSearch = 
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stu.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter === 'All' || stu.batch === batchFilter;
    return matchesSearch && matchesBatch;
  });

  const getAttendanceColor = (att: number) => {
    if (att >= 85) return '#10b981'; // Green
    if (att >= 70) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Attendance Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor overall student presence, track absentees, and view historical attendance trends.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredAttendance, 'Attendance_Reports_2026', 'Attendance Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredAttendance, 'Attendance_Reports_2026', 'Student Attendance Report')}
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
              color: stat.trend.includes('+') ? (stat.color === '#ef4444' ? '#ef4444' : '#10b981') : (stat.color === '#ef4444' ? '#10b981' : '#ef4444') 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Weekly Attendance Chart */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={20} color="#3b82f6" /> Weekly Attendance Distribution
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>86%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '86%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Mon</div>
            </div>
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>89%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '89%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Tue</div>
            </div>
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>92%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '92%' }} style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Wed</div>
            </div>
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>88%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '88%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Thu</div>
            </div>
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>78%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '78%' }} style={{ width: '100%', background: '#f59e0b', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Fri</div>
            </div>
            <div style={{ width: '12%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>65%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '65%' }} style={{ width: '100%', background: '#ef4444', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Sat</div>
            </div>

          </div>
        </div>

        {/* Monthly Attendance Trend */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LineChart size={20} color="#10b981" /> Monthly Attendance Trend
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0,40 Q15,30 30,50 T60,20 T100,25" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M0,100 L0,40 Q15,30 30,50 T60,20 T100,25 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
            </svg>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
              <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Detailed Attendance Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Detailed Student Attendance</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by student or ID..." 
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
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Batches</option>
                <option value="FSD-B1">FSD-B1</option>
                <option value="FSD-B2">FSD-B2</option>
                <option value="UI-B1">UI-B1</option>
                <option value="UI-B2">UI-B2</option>
                <option value="DS-B1">DS-B1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student ID & Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Present</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Absent</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'center' }}>Leave</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Attendance %</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((stu, i) => {
                const attColor = getAttendanceColor(stu.percentage);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stu.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{stu.id}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{stu.batch}</td>
                    
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#10b981' }}>{stu.present}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#ef4444' }}>{stu.absent}</td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#f59e0b' }}>{stu.leave}</td>
                    
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '6px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stu.percentage}%` }} style={{ height: '100%', background: attColor }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: attColor }}>{stu.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="View Detailed Log"
                        style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={16} />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredAttendance.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No attendance records found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
