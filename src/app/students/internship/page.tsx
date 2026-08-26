'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Building, User, Clock, Search, Filter, 
  Download, FileText, ChevronLeft, ChevronRight, Award, MapPin
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Placements', value: '86', icon: Briefcase, color: '#3b82f6' },
  { title: 'Active Internships', value: '42', icon: Clock, color: '#f59e0b' },
  { title: 'Completed', value: '44', icon: Award, color: '#10b981' },
  { title: 'Partner Companies', value: '15', icon: Building, color: '#8b5cf6' },
];

const internshipsList = [
  { id: 'INT-001', student: 'Aarav Patel', batch: 'FSD-B1', company: 'TechNova Solutions', location: 'Bengaluru', mentor: 'Rajesh Kumar', duration: '6 Months', startDate: '01 Jul 2026', status: 'Active', feedback: 'Performing well in React tasks.', certificate: false },
  { id: 'INT-002', student: 'Priya Sharma', batch: 'FSD-B1', company: 'Global Web Inc', location: 'Pune', mentor: 'Anita Desai', duration: '3 Months', startDate: '15 May 2026', status: 'Completed', feedback: 'Exceptional backend development skills.', certificate: true },
  { id: 'INT-003', student: 'Vikram Singh', batch: 'FSD-B1', company: 'InnoApp Labs', location: 'Hyderabad', mentor: 'Suresh Iyer', duration: '6 Months', startDate: '10 Aug 2026', status: 'Pending', feedback: 'Awaiting joining.', certificate: false },
  { id: 'INT-004', student: 'Neha Gupta', batch: 'UI-B2', company: 'Creative Designs Co.', location: 'Remote', mentor: 'Pooja Verma', duration: '3 Months', startDate: '01 Jun 2026', status: 'Active', feedback: 'Great eye for UI/UX details.', certificate: false },
  { id: 'INT-005', student: 'Rohan Desai', batch: 'FSD-B1', company: 'DataSystems Ltd', location: 'Mumbai', mentor: 'Karan Mehta', duration: '6 Months', startDate: '01 Feb 2026', status: 'Completed', feedback: 'Successfully deployed the main module.', certificate: true },
  { id: 'INT-006', student: 'Aditi Verma', batch: 'FSD-B2', company: 'TechNova Solutions', location: 'Bengaluru', mentor: 'Rajesh Kumar', duration: '6 Months', startDate: '01 Jul 2026', status: 'Active', feedback: 'Learning fast.', certificate: false },
  { id: 'INT-007', student: 'Siddharth Iyer', batch: 'UI-B2', company: 'AppWorks', location: 'Remote', mentor: 'Neha Singh', duration: '3 Months', startDate: '15 Aug 2026', status: 'Pending', feedback: 'Interview cleared, joining next week.', certificate: false },
];

export default function InternshipManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInternships = internshipsList.filter(int => {
    const matchesSearch = 
      int.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      int.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      int.mentor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || int.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Completed') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'Active') return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }; // Pending
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Internship Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track student internships, company placements, mentor feedback, and certificates.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Report
          </button>
          <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} /> Add Internship
          </button>
        </div>
      </div>

      {/* Internship Overview / Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search student, company, or mentor..." 
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
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student & Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Company Details</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Mentor</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Duration</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Feedback</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.map((int, i) => {
                const statusStyle = getStatusStyle(int.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {int.student.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{int.student}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{int.batch}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} /> {int.company}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={12} /> {int.location}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                        <User size={14} color="var(--text-secondary)" /> {int.mentor}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{int.duration}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Since {int.startDate}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {int.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        maxWidth: '200px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem' 
                      }} title={int.feedback}>
                        {int.feedback}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {int.certificate ? (
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                          title="Download Certificate"
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}
                        >
                          <FileText size={14} /> Download
                        </motion.button>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                          Not Issued
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredInternships.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No internship records found matching your search.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing 1 to {filteredInternships.length} of {filteredInternships.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <button className="primary-btn" style={{ padding: '8px 16px' }}>1</button>
            <button className="secondary-btn" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
