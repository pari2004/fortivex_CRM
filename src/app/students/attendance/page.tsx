'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, Calendar as CalendarIcon, 
  Search, Filter, Download, PieChart, Clock, Check, UserCheck, AlertCircle, ShieldCheck
} from 'lucide-react';
import { AttendanceVerificationModal } from '@/components/students/attendance/AttendanceVerificationModal';
import { AttendanceRecord as AttendanceRecordType } from '@/lib/types/attendance';

interface AttendanceRecord {
  id: string;
  name: string;
  batch: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  monthly: string;
  lastSeen: string;
  checkInTime?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationVerified?: boolean;
  faceCaptured?: boolean;
  faceCaptureUrl?: string | null;
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  { id: 'FSD-2026-001', name: 'Aarav Patel', batch: 'Morning-B1', status: 'Present', monthly: '92%', lastSeen: 'Today, 09:00 AM' },
  { id: 'FSD-2026-002', name: 'Priya Sharma', batch: 'Morning-B1', status: 'Present', monthly: '95%', lastSeen: 'Today, 08:55 AM' },
  { id: 'FSD-2026-003', name: 'Vikram Singh', batch: 'Morning-B1', status: 'Absent', monthly: '78%', lastSeen: 'Yesterday' },
  { id: 'FSD-2026-004', name: 'Neha Gupta', batch: 'Morning-B1', status: 'Late', monthly: '85%', lastSeen: 'Today, 09:20 AM' },
  { id: 'FSD-2026-005', name: 'Rohan Desai', batch: 'Morning-B1', status: 'Present', monthly: '90%', lastSeen: 'Today, 08:50 AM' },
  { id: 'FSD-2026-006', name: 'Aditi Verma', batch: 'Evening-B2', status: 'Absent', monthly: '75%', lastSeen: '2 days ago' },
  { id: 'FSD-2026-007', name: 'Siddharth Iyer', batch: 'Evening-B2', status: 'Present', monthly: '98%', lastSeen: 'Today, 04:00 PM' },
];

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Quick Search & Mark state
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [quickStatus, setQuickStatus] = useState<'Present' | 'Absent' | 'Late'>('Present');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Verification State
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedVerificationStudent, setSelectedVerificationStudent] = useState<{ id: string; name: string; batch: string; status?: string } | null>(null);
  const [verificationTargetStatus, setVerificationTargetStatus] = useState<'Present' | 'Late'>('Present');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * Main function to trigger attendance marking
   */
  const initiateMarkAttendance = (studentId: string, newStatus: 'Present' | 'Absent' | 'Late') => {
    const student = records.find(r => r.id === studentId);
    if (!student) return;

    if (newStatus === 'Absent') {
      // Absent requires no face/location verification
      const updatedRecords = records.map(r => {
        if (r.id === studentId) {
          return {
            ...r,
            status: 'Absent' as const,
            lastSeen: 'Today',
            locationVerified: false,
            faceCaptured: false
          };
        }
        return r;
      });
      setRecords(updatedRecords);
      showToast(`✅ Marked ${student.name} as Absent`);
    } else {
      // Present or Late requires face + location verification
      setSelectedVerificationStudent({
        id: student.id,
        name: student.name,
        batch: student.batch,
        status: student.status
      });
      setVerificationTargetStatus(newStatus);
      setIsVerificationModalOpen(true);
    }
  };

  // Called after verification succeeds in modal
  const handleVerificationSuccess = (verifiedRecord: AttendanceRecordType) => {
    const updatedRecords = records.map(r => {
      if (r.id === verifiedRecord.studentId) {
        return {
          ...r,
          status: verifiedRecord.status,
          lastSeen: verifiedRecord.lastSeen,
          checkInTime: verifiedRecord.checkInTime,
          latitude: verifiedRecord.latitude,
          longitude: verifiedRecord.longitude,
          locationVerified: verifiedRecord.locationVerified,
          faceCaptured: verifiedRecord.faceCaptured,
          faceCaptureUrl: verifiedRecord.faceCaptureUrl
        };
      }
      return r;
    });

    setRecords(updatedRecords);
    showToast(`✅ Marked ${verifiedRecord.name} as ${verifiedRecord.status} (Face & GPS Verified)`);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      showToast('⚠️ Please select a student from search results.');
      return;
    }
    initiateMarkAttendance(selectedStudentId, quickStatus);
    setSelectedStudentId('');
    setQuickSearch('');
  };

  // Compute Metrics
  const presentCount = records.filter(r => r.status === 'Present').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const lateCount = records.filter(r => r.status === 'Late').length;
  const totalCount = records.length;
  const overallPercentage = Math.round((presentCount / (totalCount || 1)) * 100);

  const [attendancePage, setAttendancePage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = records.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAttendancePages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((attendancePage - 1) * itemsPerPage, attendancePage * itemsPerPage);

  const matchingQuickStudents = records.filter(r => 
    quickSearch.trim() !== '' && 
    (r.name.toLowerCase().includes(quickSearch.toLowerCase()) || r.id.toLowerCase().includes(quickSearch.toLowerCase()))
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Present': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      case 'Absent': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
      case 'Late': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      default: return { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
              background: '#1e293b', color: '#fff', padding: '12px 20px',
              borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Attendance Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Search student by name or ID to verify & mark attendance with Face Capture & Geofencing.
          </p>
        </div>
      </div>

      {/* QUICK ATTENDANCE MARKING PANEL */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={20} color="#3b82f6" /> Quick Attendance Marker
        </h3>
        
        <form onSubmit={handleQuickSubmit} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={quickSearch}
              onChange={(e) => {
                setQuickSearch(e.target.value);
                setSelectedStudentId('');
              }}
              style={{
                width: '100%', padding: '12px 16px 12px 40px', borderRadius: '10px',
                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.08)',
                outline: 'none', fontSize: '0.9rem'
              }}
            />

            {/* Auto-complete Dropdown */}
            {quickSearch.trim() !== '' && !selectedStudentId && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#1e293b', border: '1px solid var(--glass-border)', borderRadius: '10px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
                {matchingQuickStudents.length === 0 ? (
                  <div style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>No matching student found</div>
                ) : (
                  matchingQuickStudents.map(st => (
                    <div
                      key={st.id}
                      onClick={() => {
                        setSelectedStudentId(st.id);
                        setQuickSearch(`${st.name} (${st.id})`);
                      }}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontWeight: 600 }}>{st.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{st.id} • {st.batch}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Status Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setQuickStatus('Present')}
              style={{
                padding: '10px 16px', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: quickStatus === 'Present' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                color: quickStatus === 'Present' ? '#fff' : '#10b981', fontSize: '0.85rem'
              }}
            >
              ✓ Present
            </button>
            <button
              type="button"
              onClick={() => setQuickStatus('Absent')}
              style={{
                padding: '10px 16px', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: quickStatus === 'Absent' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                color: quickStatus === 'Absent' ? '#fff' : '#ef4444', fontSize: '0.85rem'
              }}
            >
              ✕ Absent
            </button>
            <button
              type="button"
              onClick={() => setQuickStatus('Late')}
              style={{
                padding: '10px 16px', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer',
                background: quickStatus === 'Late' ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
                color: quickStatus === 'Late' ? '#fff' : '#f59e0b', fontSize: '0.85rem'
              }}
            >
              ⏰ Late
            </button>
          </div>

          <button
            type="submit"
            disabled={!selectedStudentId}
            style={{
              padding: '10px 22px', borderRadius: '10px', background: selectedStudentId ? '#3b82f6' : 'rgba(100, 116, 139, 0.3)',
              color: '#fff', fontWeight: 600, border: 'none', cursor: selectedStudentId ? 'pointer' : 'not-allowed',
              fontSize: '0.9rem', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> Mark Attendance
          </button>
        </form>
      </div>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Overall Attendance</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{overallPercentage}%</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Present Today</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{presentCount}</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Absent Today</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{absentCount}</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Late Arrival</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{lateCount}</div>
          </div>
        </motion.div>
      </div>

      {/* Roster & Quick Toggle Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Today's Student Roster</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search roster..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                  outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* Table with Direct Quick Action Buttons */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 16px' }}>ID</th>
                <th style={{ padding: '14px 16px' }}>Student Name</th>
                <th style={{ padding: '14px 16px' }}>Batch</th>
                <th style={{ padding: '14px 16px' }}>Monthly %</th>
                <th style={{ padding: '14px 16px' }}>Status Today</th>
                <th style={{ padding: '14px 16px' }}>Verification Ref</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Quick Mark Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((req) => {
                const statusStyle = getStatusStyle(req.status);
                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{req.id}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{req.batch}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.monthly}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {req.faceCaptured && req.locationVerified ? (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <CheckCircle size={14} /> Verified (Face & GPS)
                        </span>
                      ) : req.status === 'Absent' ? (
                        <span>—</span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => initiateMarkAttendance(req.id, 'Present')}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: req.status === 'Present' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                            color: req.status === 'Present' ? '#fff' : '#10b981'
                          }}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => initiateMarkAttendance(req.id, 'Absent')}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: req.status === 'Absent' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                            color: req.status === 'Absent' ? '#fff' : '#ef4444'
                          }}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => initiateMarkAttendance(req.id, 'Late')}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: req.status === 'Late' ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
                            color: req.status === 'Late' ? '#fff' : '#f59e0b'
                          }}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 10-Item Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredRecords.length === 0 ? 0 : (attendancePage - 1) * itemsPerPage + 1} to {Math.min(attendancePage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setAttendancePage(prev => Math.max(prev - 1, 1))}
              disabled={attendancePage === 1}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: attendancePage === 1 ? 'not-allowed' : 'pointer',
                opacity: attendancePage === 1 ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Previous
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600 }}>
              Page {attendancePage} of {totalAttendancePages}
            </span>
            <button
              onClick={() => setAttendancePage(prev => Math.min(prev + 1, totalAttendancePages))}
              disabled={attendancePage >= totalAttendancePages}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: attendancePage >= totalAttendancePages ? 'not-allowed' : 'pointer',
                opacity: attendancePage >= totalAttendancePages ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Attendance Verification Modal */}
      <AttendanceVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setSelectedVerificationStudent(null);
        }}
        student={selectedVerificationStudent}
        targetStatus={verificationTargetStatus}
        onSuccess={handleVerificationSuccess}
      />

    </div>
  );
}
