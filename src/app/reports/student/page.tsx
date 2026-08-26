'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CalendarCheck, Award, UserMinus, 
  Download, Search, Filter, PieChart, BarChart, 
  ExternalLink, FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

// Mock Data
const stats = [
  { title: 'Active Students', value: '1,205', icon: Users, color: '#3b82f6', trend: '+5%' },
  { title: 'Avg Attendance', value: '88%', icon: CalendarCheck, color: '#10b981', trend: '+2%' },
  { title: 'Avg Performance', value: '76%', icon: Award, color: '#8b5cf6', trend: '+4%' },
  { title: 'Dropped Out', value: '42', icon: UserMinus, color: '#ef4444', trend: '-1%' },
];

const studentReportData = [
  { id: 'STU-1001', name: 'Rahul Sharma', course: 'Full Stack Dev', batch: 'FSD-B1', attendance: 92, performance: 'A', status: 'Active' },
  { id: 'STU-1002', name: 'Sneha Patel', course: 'UI/UX Design', batch: 'UI-B2', attendance: 85, performance: 'B+', status: 'Active' },
  { id: 'STU-1003', name: 'Amit Kumar', course: 'Data Science', batch: 'DS-B1', attendance: 65, performance: 'C', status: 'Warning' },
  { id: 'STU-1004', name: 'Priya Singh', course: 'Full Stack Dev', batch: 'FSD-B1', attendance: 98, performance: 'A+', status: 'Active' },
  { id: 'STU-1005', name: 'Karan Desai', course: 'UI/UX Design', batch: 'UI-B1', attendance: 78, performance: 'B', status: 'Active' },
  { id: 'STU-1006', name: 'Anita Verma', course: 'Data Science', batch: 'DS-B1', attendance: 45, performance: 'F', status: 'Dropout' },
  { id: 'STU-1007', name: 'Vikram Iyer', course: 'Full Stack Dev', batch: 'FSD-B2', attendance: 88, performance: 'B+', status: 'Active' },
];

export default function StudentReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');

  const filteredStudents = studentReportData.filter(stu => {
    const matchesSearch = 
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stu.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter === 'All' || stu.batch === batchFilter;
    return matchesSearch && matchesBatch;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Active') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'Warning') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // Dropout
  };

  const getAttendanceColor = (att: number) => {
    if (att >= 85) return '#10b981';
    if (att >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Evaluate student performance, attendance patterns, and batch health metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredStudents, 'Student_Reports_2026', 'Student Performance & Attendance Report')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredStudents, 'Student_Reports_2026', 'Student Performance & Attendance Report')}
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
              color: stat.trend.includes('+') ? '#10b981' : '#ef4444' 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Batch-wise Performance Analytics */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={20} color="#3b82f6" /> Batch-wise Performance (Avg)
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            
            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>82%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '82%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>FSD-B1</div>
            </div>

            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>75%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '75%' }} style={{ width: '100%', background: '#8b5cf6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>FSD-B2</div>
            </div>

            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>90%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '90%' }} style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>UI-B2</div>
            </div>

            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>65%</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '65%' }} style={{ width: '100%', background: '#f59e0b', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>DS-B1</div>
            </div>

          </div>
        </div>

        {/* Course-wise Distribution */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#8b5cf6" /> Course Distribution
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'conic-gradient(#8b5cf6 0% 50%, #3b82f6 50% 80%, #10b981 80% 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1,205</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Total</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#8b5cf6' }}/> Full Stack (50%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3b82f6' }}/> UI/UX (30%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }}/> Data Science (20%)</div>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Student Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Student Performance Log</h3>
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
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Attendance</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Performance Grade</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu, i) => {
                const statusStyle = getStatusStyle(stu.status);
                const attColor = getAttendanceColor(stu.attendance);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stu.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{stu.id}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{stu.course}</td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{stu.batch}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stu.attendance}%` }} style={{ height: '100%', background: attColor }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: attColor }}>{stu.attendance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#8b5cf6', fontSize: '1.1rem' }}>
                      {stu.performance}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {stu.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="Open Profile"
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
          
          {filteredStudents.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No students found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
