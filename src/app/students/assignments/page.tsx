'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  Search, Filter, Download, ChevronLeft, ChevronRight, MessageSquare, Edit3
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Assignments', value: '45', icon: FileText, color: '#3b82f6' },
  { title: 'Pending Grading', value: '18', icon: Clock, color: '#f59e0b' },
  { title: 'Graded', value: '124', icon: CheckCircle, color: '#10b981' },
  { title: 'Overdue Submissions', value: '7', icon: AlertCircle, color: '#ef4444' },
];

const assignmentsList = [
  { id: 'ASG-101', title: 'React Final Project', student: 'Aarav Patel', batch: 'FSD-B1', status: 'Submitted', marks: '-', feedback: '-', dueDate: '10 Aug 2026' },
  { id: 'ASG-102', title: 'Node.js API Design', student: 'Priya Sharma', batch: 'FSD-B1', status: 'Graded', marks: '92/100', feedback: 'Excellent use of middleware.', dueDate: '05 Aug 2026' },
  { id: 'ASG-103', title: 'React Final Project', student: 'Vikram Singh', batch: 'FSD-B1', status: 'Overdue', marks: '-', feedback: '-', dueDate: '10 Aug 2026' },
  { id: 'ASG-104', title: 'MongoDB Aggregation', student: 'Neha Gupta', batch: 'FSD-B2', status: 'Submitted', marks: '-', feedback: '-', dueDate: '12 Aug 2026' },
  { id: 'ASG-105', title: 'Express Routing', student: 'Rohan Desai', batch: 'FSD-B1', status: 'Graded', marks: '85/100', feedback: 'Good logic, needs code formatting.', dueDate: '01 Aug 2026' },
  { id: 'ASG-106', title: 'React Hooks Intro', student: 'Aditi Verma', batch: 'FSD-B2', status: 'Graded', marks: '98/100', feedback: 'Perfect implementation.', dueDate: '25 Jul 2026' },
  { id: 'ASG-107', title: 'Redux State Management', student: 'Siddharth Iyer', batch: 'FSD-B1', status: 'Pending', marks: '-', feedback: '-', dueDate: '15 Aug 2026' },
];

export default function AssignmentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAssignments = assignmentsList.filter(asg => {
    const matchesSearch = 
      asg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      asg.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Graded': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'Submitted': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      case 'Pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      case 'Overdue': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      default: return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Assignment Management <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600 }}>Deactivated</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track student submissions, provide feedback, and grade assignments.</p>
        </div>
      </div>

      {/* Administrative Deactivation Banner */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertCircle size={24} color="#ef4444" />
        <div>
          <strong style={{ color: '#ef4444', fontSize: '0.95rem' }}>Module Currently Deactivated</strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            This module has been deactivated by the administrator. Historical records are preserved below in read-only mode.
          </p>
        </div>
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
                placeholder="Search assignments or students..." 
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
                <option value="Submitted">Submitted</option>
                <option value="Graded">Graded</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Assignment Title</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Marks</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Feedback</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((asg, i) => {
                const statusStyle = getStatusStyle(asg.status);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{asg.title}</td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {asg.student.charAt(0)}
                        </div>
                        {asg.student}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{asg.batch}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{asg.dueDate}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {asg.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: asg.status === 'Graded' ? '#10b981' : 'var(--text-secondary)' }}>
                      {asg.marks}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        maxWidth: '150px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        color: asg.feedback === '-' ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        fontSize: '0.9rem' 
                      }}>
                        {asg.feedback}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {asg.status !== 'Pending' && asg.status !== 'Overdue' && (
                          <motion.button 
                            whileHover={{ scale: 1.1, background: 'rgba(99, 102, 241, 0.1)' }}
                            title="Download Submission"
                            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Download size={16} />
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.1, background: 'rgba(16, 185, 129, 0.1)' }}
                          title={asg.status === 'Graded' ? "Edit Grade" : "Grade Assignment"}
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {asg.status === 'Graded' ? <Edit3 size={16} /> : <MessageSquare size={16} />}
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredAssignments.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No assignments found matching your search or filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing 1 to {filteredAssignments.length} of {filteredAssignments.length} entries
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
