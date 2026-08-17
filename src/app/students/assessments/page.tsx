'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Award, Target, TrendingUp, Search, Filter, 
  Download, FileText, ChevronLeft, ChevronRight, BarChart2, AlertCircle
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Assessments', value: '24', icon: BookOpen, color: '#3b82f6' },
  { title: 'Average Score', value: '78.5%', icon: Target, color: '#8b5cf6' },
  { title: 'Highest Score', value: '98%', icon: Award, color: '#10b981' },
  { title: 'Pass Percentage', value: '92%', icon: TrendingUp, color: '#f59e0b' },
];

const assessmentsList = [
  { id: 'EXM-001', student: 'Aarav Patel', batch: 'FSD-B1', exam: 'Mid-Term React', score: '85', maxScore: '100', grade: 'A', status: 'Passed', date: '12 Aug 2026' },
  { id: 'EXM-002', student: 'Priya Sharma', batch: 'FSD-B1', exam: 'Mid-Term React', score: '92', maxScore: '100', grade: 'A+', status: 'Passed', date: '12 Aug 2026' },
  { id: 'EXM-003', student: 'Vikram Singh', batch: 'FSD-B1', exam: 'Mid-Term React', score: '45', maxScore: '100', grade: 'F', status: 'Failed', date: '12 Aug 2026' },
  { id: 'EXM-004', student: 'Neha Gupta', batch: 'UI-B2', exam: 'Figma Basics Test', score: '78', maxScore: '100', grade: 'B+', status: 'Passed', date: '10 Aug 2026' },
  { id: 'EXM-005', student: 'Rohan Desai', batch: 'FSD-B1', exam: 'Database Design', score: '88', maxScore: '100', grade: 'A', status: 'Passed', date: '08 Aug 2026' },
  { id: 'EXM-006', student: 'Aditi Verma', batch: 'FSD-B2', exam: 'JavaScript Fundamentals', score: '95', maxScore: '100', grade: 'A+', status: 'Passed', date: '05 Aug 2026' },
  { id: 'EXM-007', student: 'Siddharth Iyer', batch: 'UI-B2', exam: 'Figma Basics Test', score: '62', maxScore: '100', grade: 'C', status: 'Passed', date: '10 Aug 2026' },
];

export default function AssessmentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const filteredAssessments = assessmentsList.filter(asg => {
    const matchesSearch = 
      asg.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      asg.exam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || asg.grade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  const getGradeStyle = (grade: string) => {
    if (grade.includes('A')) return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (grade.includes('B')) return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    if (grade.includes('C')) return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }; // D, F
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Assessment & Grades <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600 }}>Deactivated</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze exam performance, manage grades, and track student progress.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Exam Summary / Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
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

        {/* Grade Analysis / Progress Chart */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#8b5cf6" /> Grade Distribution Analysis
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, padding: '0 10px' }}>
            {/* Mock Chart Bars */}
            {[
              { label: 'A+', height: '80%', value: '35', color: '#10b981' },
              { label: 'A', height: '65%', value: '28', color: '#34d399' },
              { label: 'B+', height: '45%', value: '18', color: '#3b82f6' },
              { label: 'B', height: '30%', value: '12', color: '#60a5fa' },
              { label: 'C', height: '15%', value: '5', color: '#f59e0b' },
              { label: 'F', height: '5%', value: '2', color: '#ef4444' }
            ].map((bar, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{bar.value}</div>
                <div style={{ width: '32px', height: '120px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: bar.height }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: bar.color, borderRadius: '6px', transition: 'height 1s ease' }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{bar.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marks Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search student or exam..." 
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
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Grades</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="F">Failed</option>
              </select>
            </div>
          </div>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Results
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Assessment Title</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Date Taken</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Score</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Grade</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.map((asg, i) => {
                const gradeStyle = getGradeStyle(asg.grade);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {asg.student.charAt(0)}
                        </div>
                        {asg.student}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{asg.batch}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{asg.exam}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{asg.date}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>
                      {asg.score} <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 'normal' }}>/ {asg.maxScore}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: gradeStyle.bg, color: gradeStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {asg.grade}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        color: asg.status === 'Passed' ? '#10b981' : '#ef4444',
                        fontWeight: 600, fontSize: '0.9rem'
                      }}>
                        {asg.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                        title="Download Result Card"
                        style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}
                      >
                        <Download size={14} /> Result
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredAssessments.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No assessment records found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing 1 to {filteredAssessments.length} of {filteredAssessments.length} entries
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
