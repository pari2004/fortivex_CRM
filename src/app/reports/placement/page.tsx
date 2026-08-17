'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';
import { 
  Briefcase, DollarSign, Trophy, Building, 
  Download, FileText, Search, Filter, PieChart, 
  BarChart, ExternalLink
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Placed (YTD)', value: '385', icon: Briefcase, color: '#3b82f6', trend: '+12%' },
  { title: 'Average Package', value: '8.5 LPA', icon: DollarSign, color: '#10b981', trend: '+1.5L' },
  { title: 'Highest Package', value: '24.0 LPA', icon: Trophy, color: '#f59e0b', trend: 'TechNova' },
  { title: 'Top Recruiter', value: 'TCS', icon: Building, color: '#8b5cf6', trend: '45 Hires' },
];

const placementReportData = [
  { id: 'PLC-001', name: 'Rahul Sharma', course: 'Full Stack Dev', company: 'TechNova', role: 'SDE-1', package: '12.5 LPA', date: '10 Aug 2026', status: 'Accepted' },
  { id: 'PLC-002', name: 'Sneha Patel', course: 'UI/UX Design', company: 'DesignStudio', role: 'Product Designer', package: '8.0 LPA', date: '08 Aug 2026', status: 'Accepted' },
  { id: 'PLC-003', name: 'Amit Kumar', course: 'Data Science', company: 'DataCorp', role: 'Data Analyst', package: '9.5 LPA', date: '05 Aug 2026', status: 'Pending Review' },
  { id: 'PLC-004', name: 'Priya Singh', course: 'Full Stack Dev', company: 'Infosys', role: 'System Engineer', package: '6.5 LPA', date: '12 Aug 2026', status: 'Accepted' },
  { id: 'PLC-005', name: 'Karan Desai', course: 'UI/UX Design', company: 'CreativeMinds', role: 'UX Researcher', package: '7.2 LPA', date: '01 Aug 2026', status: 'Declined' },
  { id: 'PLC-006', name: 'Anita Verma', course: 'Data Science', company: 'Google', role: 'Machine Learning Eng', package: '24.0 LPA', date: '11 Aug 2026', status: 'Accepted' },
];

export default function PlacementReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPlacements = placementReportData.filter(plc => {
    const matchesSearch = 
      plc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plc.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || plc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Accepted') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'Pending Review') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // Declined
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Placement Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze hiring trends, company-wise selections, and compensation packages.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(filteredPlacements, 'Placement_Reports_2026', 'Placement Reports')}
            className="secondary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <FileText size={16} /> Export Excel
          </button>
          <button 
            onClick={() => exportToPDF(filteredPlacements, 'Placement_Reports_2026', 'Student Placement & Salary Report')}
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
              color: stat.trend.includes('+') ? '#10b981' : 'var(--text-secondary)' 
            }}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Package Analysis (Brackets) */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={20} color="#10b981" /> Salary Package Distribution (LPA)
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            
            <div style={{ width: '15%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>45</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '30%' }} style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>3 - 5</div>
            </div>
            <div style={{ width: '15%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>120</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} style={{ width: '100%', background: '#10b981', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>5 - 8</div>
            </div>
            <div style={{ width: '15%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>85</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '55%' }} style={{ width: '100%', background: '#f59e0b', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>8 - 12</div>
            </div>
            <div style={{ width: '15%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>35</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '25%' }} style={{ width: '100%', background: '#8b5cf6', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>12 - 18</div>
            </div>
            <div style={{ width: '15%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>12</div>
              <motion.div initial={{ height: 0 }} animate={{ height: '10%' }} style={{ width: '100%', background: '#ef4444', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>18+</div>
            </div>

          </div>
        </div>

        {/* Company-wise Distribution */}
        <div className="glass-panel" style={{ padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#8b5cf6" /> Top Hiring Companies
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'conic-gradient(#3b82f6 0% 35%, #10b981 35% 65%, #f59e0b 65% 85%, #8b5cf6 85% 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>385</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Placed</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3b82f6' }}/> TCS (35%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }}/> Infosys (30%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f59e0b' }}/> TechNova (20%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#8b5cf6' }}/> Others (15%)</div>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Placement Report Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Detailed Placement Directory</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by student or company..." 
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
                <option value="Accepted">Accepted</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name & ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Company & Role</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Package</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Placement Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Offer</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlacements.map((plc, i) => {
                const statusStyle = getStatusStyle(plc.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{plc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{plc.id}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: '#8b5cf6' }}>{plc.course}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{plc.company}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{plc.role}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '1.05rem', color: '#10b981' }}>{plc.package}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{plc.date}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {plc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                        title="View Offer Letter"
                        style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <ExternalLink size={16} />
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPlacements.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No placement records found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
