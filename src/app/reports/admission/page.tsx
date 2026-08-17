'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Target, BookOpen, DollarSign, 
  Download, Search, Filter, BarChart2, TrendingUp, Eye, FileText
} from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

// Mock Data
const stats = [
  { title: 'Total Admissions', value: '1,205', icon: UserPlus, color: '#10b981', trend: '+5%' },
  { title: 'Target Achieved', value: '86%', icon: Target, color: '#3b82f6', trend: '+2%' },
  { title: 'Top Course', value: 'Full Stack', icon: BookOpen, color: '#8b5cf6', trend: '45%' },
  { title: 'Revenue Gen', value: '₹4.5Cr', icon: DollarSign, color: '#f59e0b', trend: '+12%' },
];

const admissionReportData = [
  { id: 'ADM-2026-001', student: 'Rahul Sharma', email: 'rahul.s@example.com', course: 'Full Stack Development', batch: 'FSD-B1', date: '10 Aug 2026', fees: '₹45,000 / ₹90,000', status: 'Active' },
  { id: 'ADM-2026-002', student: 'Sneha Patel', email: 'sneha.p@example.com', course: 'UI/UX Design', batch: 'UI-B2', date: '08 Aug 2026', fees: '₹60,000 / ₹60,000', status: 'Active' },
  { id: 'ADM-2026-003', student: 'Amit Kumar', email: 'amit.k@example.com', course: 'Data Science', batch: 'DS-B1', date: '05 Aug 2026', fees: '₹20,000 / ₹1,20,000', status: 'Pending Fees' },
  { id: 'ADM-2026-004', student: 'Priya Singh', email: 'priya.s@example.com', course: 'Full Stack Development', batch: 'FSD-B1', date: '12 Aug 2026', fees: '₹90,000 / ₹90,000', status: 'Active' },
  { id: 'ADM-2026-005', student: 'Karan Desai', email: 'karan.d@example.com', course: 'UI/UX Design', batch: 'UI-B2', date: '01 Aug 2026', fees: '₹30,000 / ₹60,000', status: 'Pending Fees' },
  { id: 'ADM-2026-006', student: 'Anita Verma', email: 'anita.v@example.com', course: 'Data Science', batch: 'DS-B1', date: '11 Aug 2026', fees: '₹1,20,000 / ₹1,20,000', status: 'Active' },
];

export default function AdmissionReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');

  const filteredAdmissions = admissionReportData.filter(adm => {
    const matchesSearch = 
      adm.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      adm.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'All' || adm.course.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Active') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }; // Pending Fees
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admission Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track enrollment numbers, course popularity, and revenue generation.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredAdmissions, 'Admission_Reports_2026', 'Admission Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export to Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredAdmissions, 'Admission_Reports_2026', 'Admission & Enrollment Report')}
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Monthly Admission Trend */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#10b981" /> Monthly Admission Trend
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0,80 Q20,50 40,60 T80,30 T100,10" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M0,100 L0,80 Q20,50 40,60 T80,30 T100,10 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
            </svg>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
              <div key={m} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, marginBottom: '-20px' }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Course-wise Admissions */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#8b5cf6" /> Course-wise Enrollments
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            
            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>542</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>Full Stack</div>
            </div>

            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>360</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '55%' }} style={{ width: '100%', background: '#8b5cf6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>UI/UX Design</div>
            </div>

            <div style={{ width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>303</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '45%' }} style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>Data Science</div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Admission Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Detailed Admission Report</h3>
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
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Courses</option>
                <option value="Full Stack">Full Stack</option>
                <option value="UI/UX">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Admission ID & Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Date of Admission</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Fees Paid / Total</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map((adm, i) => {
                const statusStyle = getStatusStyle(adm.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{adm.student}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{adm.id}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#8b5cf6' }}>{adm.course}</td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>{adm.batch}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{adm.date}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{adm.fees}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {adm.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="View Full Profile"
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
          
          {filteredAdmissions.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No admissions found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
