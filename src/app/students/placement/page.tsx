'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle, TrendingUp, DollarSign, Search, Filter, 
  Download, Building, User, Clock, FileText, Activity, MapPin, X
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Placed', value: '184', icon: CheckCircle, color: '#10b981' },
  { title: 'Avg Package', value: '₹6.5 LPA', icon: TrendingUp, color: '#3b82f6' },
  { title: 'Highest Package', value: '₹14.0 LPA', icon: DollarSign, color: '#8b5cf6' },
  { title: 'Interviews Ongoing', value: '45', icon: Clock, color: '#f59e0b' },
];

const INITIAL_PLACEMENTS = [
  { id: 'PLC-001', student: 'Aarav Patel', batch: 'FSD-B1', company: 'TechNova Solutions', recruiter: 'Pooja Singh', role: 'Frontend Developer', package: '₹7.5 LPA', status: 'Offered', offerDate: '10 Aug 2026', timeline: ['Applied (01 Aug)', 'Round 1 (05 Aug)', 'HR Round (08 Aug)', 'Offer (10 Aug)'] },
  { id: 'PLC-002', student: 'Priya Sharma', batch: 'FSD-B1', company: 'Global Web Inc', recruiter: 'Karan Mehta', role: 'Backend Developer', package: '₹9.0 LPA', status: 'Joined', offerDate: '25 Jul 2026', timeline: ['Applied (10 Jul)', 'Tech Interview (15 Jul)', 'Offer (20 Jul)', 'Joined (25 Jul)'] },
  { id: 'PLC-003', student: 'Vikram Singh', batch: 'FSD-B1', company: 'InnoApp Labs', recruiter: 'Anita Desai', role: 'Full Stack Developer', package: '-', status: 'Interviewing', offerDate: '-', timeline: ['Applied (05 Aug)', 'Round 1 cleared (09 Aug)', 'Round 2 scheduled (12 Aug)'] },
  { id: 'PLC-004', student: 'Neha Gupta', batch: 'UI-B2', company: 'Creative Designs Co.', recruiter: 'Rajesh Kumar', role: 'UI/UX Designer', package: '₹6.0 LPA', status: 'Offered', offerDate: '08 Aug 2026', timeline: ['Applied (20 Jul)', 'Portfolio Review (25 Jul)', 'Offer (08 Aug)'] },
  { id: 'PLC-005', student: 'Rohan Desai', batch: 'FSD-B1', company: 'DataSystems Ltd', recruiter: 'Suresh Iyer', role: 'Software Engineer', package: '-', status: 'Rejected', offerDate: '-', timeline: ['Applied (01 Aug)', 'Tech Interview (05 Aug)', 'Rejected (07 Aug)'] },
  { id: 'PLC-006', student: 'Aditi Verma', batch: 'FSD-B2', company: 'NextGen Tech', recruiter: 'Neha Singh', role: 'React Developer', package: '₹8.5 LPA', status: 'Joined', offerDate: '01 Aug 2026', timeline: ['Applied (15 Jul)', 'Offer (25 Jul)', 'Joined (01 Aug)'] },
];

export default function PlacementTrackingPage() {
  const [placements, setPlacements] = useState(INITIAL_PLACEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timelineModal, setTimelineModal] = useState<any | null>(null);

  const [placementPage, setPlacementPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPlacements = placements.filter(plc => {
    const matchesSearch = 
      plc.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plc.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || plc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPlacementPages = Math.ceil(filteredPlacements.length / itemsPerPage) || 1;
  const paginatedPlacements = filteredPlacements.slice((placementPage - 1) * itemsPerPage, placementPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    if (status === 'Joined') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'Offered') return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    if (status === 'Interviewing') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // Rejected
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Placement Tracking</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track interview pipelines, offers, packages, and placement success rates.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => {
              const student = prompt('Enter student name:');
              if (student) {
                const company = prompt('Enter company name:', 'TechCorp Ltd');
                const role = prompt('Enter role:', 'Software Engineer');
                const newPlc = {
                  id: `PLC-${Math.floor(100 + Math.random() * 900)}`,
                  student,
                  batch: 'FSD-2026-A',
                  company: company || 'TechCorp Ltd',
                  recruiter: 'Admin',
                  role: role || 'Software Engineer',
                  package: '₹8.0 LPA',
                  status: 'Offered',
                  offerDate: 'Today',
                  timeline: ['Offer Issued Today']
                };
                setPlacements(prev => [newPlc, ...prev]);
                setPlacementPage(1);
                alert(`Placement record for ${student} added successfully!`);
              }
            }}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Briefcase size={16} /> Add Placement Record
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
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
                placeholder="Search student, company, or role..." 
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
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Joined">Joined</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Data
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student & Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Applied Company</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Role & Recruiter</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Package</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Interview Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlacements.map((plc, i) => {
                const statusStyle = getStatusStyle(plc.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {plc.student.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{plc.student}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{plc.batch}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} /> {plc.company}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{plc.role}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <User size={12} /> {plc.recruiter}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: plc.package !== '-' ? '#10b981' : 'var(--text-tertiary)' }}>
                      {plc.package}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {plc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(139, 92, 246, 0.1)' }}
                          onClick={() => setTimelineModal(plc)}
                          title="View Timeline"
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #8b5cf6', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}
                        >
                          <Activity size={14} /> Timeline
                        </motion.button>
                        {(plc.status === 'Offered' || plc.status === 'Joined') && (
                          <motion.button 
                            whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                            title="Download Offer Letter"
                            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <FileText size={16} />
                          </motion.button>
                        )}
                      </div>
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

        {/* 10-Item Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredPlacements.length === 0 ? 0 : (placementPage - 1) * itemsPerPage + 1} to {Math.min(placementPage * itemsPerPage, filteredPlacements.length)} of {filteredPlacements.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setPlacementPage(prev => Math.max(prev - 1, 1))}
              disabled={placementPage === 1}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: placementPage === 1 ? 'not-allowed' : 'pointer',
                opacity: placementPage === 1 ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Previous
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600 }}>
              Page {placementPage} of {totalPlacementPages}
            </span>
            <button
              onClick={() => setPlacementPage(prev => Math.min(prev + 1, totalPlacementPages))}
              disabled={placementPage >= totalPlacementPages}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: placementPage >= totalPlacementPages ? 'not-allowed' : 'pointer',
                opacity: placementPage >= totalPlacementPages ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      <AnimatePresence>
        {timelineModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setTimelineModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{ position: 'relative', width: '450px', padding: '32px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.95)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Placement Timeline</h2>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    {timelineModal.student} at <span style={{ color: '#3b82f6', fontWeight: 500 }}>{timelineModal.company}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setTimelineModal(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '12px' }}>
                <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }} />
                
                {timelineModal.timeline.map((step: string, idx: number) => {
                  const isLast = idx === timelineModal.timeline.length - 1;
                  const isSuccess = step.toLowerCase().includes('offer') || step.toLowerCase().includes('joined');
                  const isFail = step.toLowerCase().includes('reject');
                  
                  let dotColor = '#3b82f6';
                  if (isSuccess) dotColor = '#10b981';
                  if (isFail) dotColor = '#ef4444';
                  
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: isLast ? '0' : '24px', position: 'relative' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, marginTop: '5px', zIndex: 2, outline: '4px solid rgba(255,255,255,0.95)' }} />
                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px 16px', borderRadius: '8px', flex: 1, border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{step.split(' (')[0]}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{step.match(/\((.*?)\)/)?.[1]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
