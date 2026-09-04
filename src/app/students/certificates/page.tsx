'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, CheckCircle, Clock, ShieldAlert, Search, Filter, 
  Download, QrCode, FileCheck, ShieldCheck, X, Check
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Issued', value: '450', icon: Award, color: '#3b82f6' },
  { title: 'Issued This Month', value: '32', icon: CheckCircle, color: '#10b981' },
  { title: 'Pending Verification', value: '5', icon: Clock, color: '#f59e0b' },
  { title: 'Revoked', value: '2', icon: ShieldAlert, color: '#ef4444' },
];

const certificatesList = [
  { id: 'CERT-2026-8901', student: 'Aarav Patel', batch: 'FSD-B1', type: 'Course Completion', issueDate: '10 Aug 2026', status: 'Verified', url: '#' },
  { id: 'CERT-2026-8902', student: 'Priya Sharma', batch: 'FSD-B1', type: 'Excellence Award', issueDate: '08 Aug 2026', status: 'Verified', url: '#' },
  { id: 'CERT-2026-8903', student: 'Vikram Singh', batch: 'FSD-B1', type: 'Participation', issueDate: '05 Aug 2026', status: 'Pending', url: '#' },
  { id: 'CERT-2026-8904', student: 'Neha Gupta', batch: 'UI-B2', type: 'Course Completion', issueDate: '01 Aug 2026', status: 'Verified', url: '#' },
  { id: 'CERT-2026-8905', student: 'Rohan Desai', batch: 'FSD-B1', type: 'Internship Completion', issueDate: '28 Jul 2026', status: 'Verified', url: '#' },
  { id: 'CERT-2026-8906', student: 'Aditi Verma', batch: 'FSD-B2', type: 'Course Completion', issueDate: '25 Jul 2026', status: 'Verified', url: '#' },
  { id: 'CERT-2026-8907', student: 'Siddharth Iyer', batch: 'UI-B2', type: 'Course Completion', issueDate: '20 Jul 2026', status: 'Revoked', url: '#' },
];

export default function CertificatesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verifyModal, setVerifyModal] = useState<string | null>(null);

  const filteredCertificates = certificatesList.filter(cert => {
    const matchesSearch = 
      cert.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Verified') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <ShieldCheck size={14} /> };
    if (status === 'Pending') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <Clock size={14} /> };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <ShieldAlert size={14} /> }; // Revoked
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Certificate Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Issue, track, and verify student certificates via QR.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} /> Issue Certificate
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
                placeholder="Search by student or Certificate ID..." 
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
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Certificate ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student & Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Certificate Type</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Issue Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert, i) => {
                const statusStyle = getStatusStyle(cert.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#6366f1' }}>{cert.id}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {cert.student.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{cert.student}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{cert.batch}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{cert.type}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{cert.issueDate}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {statusStyle.icon} {cert.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => setVerifyModal(cert.id)}
                          title="QR Verify"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <QrCode size={16} />
                        </motion.button>
                        {cert.status !== 'Revoked' && (
                          <motion.button 
                            whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                            title="Download Certificate"
                            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Download size={16} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredCertificates.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No certificates found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* QR Verify Modal */}
      <AnimatePresence>
        {verifyModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setVerifyModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{ position: 'relative', width: '400px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.9)' }}
            >
              <button 
                onClick={() => setVerifyModal(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
              
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileCheck size={32} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>Certificate Verified</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                This certificate ({verifyModal}) is authentic and was issued by Fortivex.AI CRM.
              </p>
              
              <div style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Issued To:</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{certificatesList.find(c => c.id === verifyModal)?.student}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Course:</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Stack Development</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Issue Date:</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{certificatesList.find(c => c.id === verifyModal)?.issueDate}</span>
                </div>
              </div>
              
              <button className="primary-btn" onClick={() => setVerifyModal(null)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Check size={18} /> Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
