'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, Clock, Search, Filter, 
  MoreVertical, FileText, Download, Check, X, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Requests', value: '142', icon: Users, color: '#3b82f6' },
  { title: 'Pending Review', value: '38', icon: Clock, color: '#f59e0b' },
  { title: 'Approved', value: '89', icon: CheckCircle, color: '#10b981' },
  { title: 'Rejected', value: '15', icon: XCircle, color: '#ef4444' },
];

const INITIAL_ADMISSION_REQUESTS = [
  { id: 'ADM-2026-001', name: 'Aarav Patel', course: 'Full Stack Development', date: '08 Aug 2026', status: 'Pending', score: '82%', documents: '3/4' },
  { id: 'ADM-2026-002', name: 'Priya Sharma', course: 'Data Science Bootcamp', date: '07 Aug 2026', status: 'Approved', score: '91%', documents: '4/4' },
  { id: 'ADM-2026-003', name: 'Vikram Singh', course: 'Full Stack Development', date: '07 Aug 2026', status: 'Pending', score: '76%', documents: '4/4' },
  { id: 'ADM-2026-004', name: 'Neha Gupta', course: 'UI/UX Design', date: '06 Aug 2026', status: 'Rejected', score: '54%', documents: '2/4' },
  { id: 'ADM-2026-005', name: 'Rohan Desai', course: 'Cloud Computing', date: '05 Aug 2026', status: 'Approved', score: '88%', documents: '4/4' },
  { id: 'ADM-2026-006', name: 'Aditi Verma', course: 'Full Stack Development', date: '05 Aug 2026', status: 'Pending', score: '79%', documents: '4/4' },
  { id: 'ADM-2026-007', name: 'Siddharth Iyer', course: 'Data Science Bootcamp', date: '04 Aug 2026', status: 'Approved', score: '95%', documents: '4/4' },
];

export default function StudentAdmissionsPage() {
  const [requests, setRequests] = useState(INITIAL_ADMISSION_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'Rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      default: return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admissions Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review, approve, and manage incoming student applications.</p>
        </div>
        <button
          onClick={() => {
            const name = prompt('Enter applicant student name:');
            if (name) {
              const course = prompt('Enter course name:', 'Full Stack Development');
              const newReq = {
                id: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
                name,
                course: course || 'Full Stack Development',
                date: 'Today',
                status: 'Pending',
                score: '80%',
                documents: '4/4'
              };
              setRequests(prev => [newReq, ...prev]);
              setCurrentPage(1);
              alert(`Added new admission application for ${name}!`);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}
        >
          <FileText size={18} /> + Add Application
        </button>
      </div>

      {/* Statistics Cards */}
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

      {/* Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Application ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Applied Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Score</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Documents</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, i) => {
                const statusStyle = getStatusStyle(req.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 500, color: '#3b82f6' }}>{req.id}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {req.name.charAt(0)}
                        </div>
                        {req.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{req.course}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{req.date}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{req.score}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{req.documents}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', position: 'relative' }}>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: 'var(--text-secondary)' }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === req.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                              position: 'absolute', right: '40px', top: '16px', background: 'rgba(255, 255, 255, 0.95)',
                              backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)',
                              borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10,
                              minWidth: '200px', display: 'flex', flexDirection: 'column', padding: '8px',
                              textAlign: 'left'
                            }}
                          >
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', color: '#10b981', fontWeight: 500 }} className="hover-bg-green-50">
                              <Check size={16} /> Approve Admission
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', color: '#ef4444', fontWeight: 500 }} className="hover-bg-red-50">
                              <X size={16} /> Reject Admission
                            </button>
                            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 500 }} className="hover-bg-gray-50">
                              <Eye size={16} /> View Documents
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 500 }} className="hover-bg-gray-50">
                              <Download size={16} /> Download Form
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredRequests.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No admission requests found matching your filters.
            </div>
          )}
        </div>

        {/* 10-Item Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing {filteredRequests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Previous
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600, fontSize: '0.9rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        </div>

      </div>
      
      {/* CSS for hover effects in dropdown */}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-green-50:hover { background: rgba(16, 185, 129, 0.1) !important; }
        .hover-bg-red-50:hover { background: rgba(239, 68, 68, 0.1) !important; }
        .hover-bg-gray-50:hover { background: rgba(0, 0, 0, 0.05) !important; }
      `}} />
    </div>
  );
}
