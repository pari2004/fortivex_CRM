'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Calendar, BookOpen, Users, 
  CheckCircle, Play, Download, FileText, 
  Printer, Table2, Layers
} from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/exportUtils';

export default function CustomReportsPage() {
  const [module, setModule] = useState('Admissions');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [course, setCourse] = useState('All');
  const [batch, setBatch] = useState('All');
  const [status, setStatus] = useState('All');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setShowPreview(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Custom Report Builder</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create, filter, and export customized reports across all CRM modules.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print
          </button>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <FileText size={16} /> Export Excel
          </button>
          <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Report Builder Sidebar Panel */}
        <div className="glass-panel" style={{ padding: '24px', width: '350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
            <Settings size={20} /> Report Criteria
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Module Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> Data Module
              </label>
              <select 
                value={module} onChange={(e) => setModule(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.95rem' }}
              >
                <option value="Leads">Leads & Enquiries</option>
                <option value="Admissions">Admissions</option>
                <option value="Students">Student Performance</option>
                <option value="Payments">Payments & Revenue</option>
                <option value="Placements">Placements</option>
              </select>
            </div>

            {/* Date Range */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Date Range
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.85rem' }}
                />
                <input 
                  type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Course Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> Course
              </label>
              <select 
                value={course} onChange={(e) => setCourse(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.95rem' }}
              >
                <option value="All">All Courses</option>
                <option value="FSD">Full Stack Development</option>
                <option value="UIUX">UI/UX Design</option>
                <option value="DS">Data Science</option>
              </select>
            </div>

            {/* Batch Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Batch
              </label>
              <select 
                value={batch} onChange={(e) => setBatch(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.95rem' }}
              >
                <option value="All">All Batches</option>
                <option value="B1">Batch 1</option>
                <option value="B2">Batch 2</option>
                <option value="B3">Batch 3</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> Record Status
              </label>
              <select 
                value={status} onChange={(e) => setStatus(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.95rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active / Completed</option>
                <option value="Pending">Pending / In Progress</option>
                <option value="Cancelled">Cancelled / Dropped</option>
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              style={{ 
                marginTop: '10px', padding: '14px', borderRadius: '10px', background: '#3b82f6', 
                color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <Play size={18} fill="white" /> Generate Preview
            </motion.button>
          </div>
        </div>

        {/* Report Preview Panel */}
        <div className="glass-panel" style={{ flex: 1, padding: '24px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Table2 size={20} color="#8b5cf6" /> Report Preview: {module}
            </h3>
            {showPreview && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => {
                    const mockRows = [1,2,3,4,5,6,7].map(r => ({
                      id: `${module.substring(0,3).toUpperCase()}-2026-00${r}`,
                      primary: `Sample Data Record ${r}`,
                      course: course === 'All' ? 'Full Stack Dev' : course,
                      date: `1${r} Aug 2026`,
                      amount: (r * 15000).toLocaleString(),
                      status: status === 'All' ? 'Active' : status
                    }));
                    exportToExcel(mockRows, `Custom_${module}_Report`, `Custom ${module} Report`);
                  }}
                  className="secondary-btn" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
                >
                  <FileText size={14} /> Export Excel
                </button>
                <button 
                  onClick={() => {
                    const mockRows = [1,2,3,4,5,6,7].map(r => ({
                      id: `${module.substring(0,3).toUpperCase()}-2026-00${r}`,
                      primary: `Sample Data Record ${r}`,
                      course: course === 'All' ? 'Full Stack Dev' : course,
                      date: `1${r} Aug 2026`,
                      amount: (r * 15000).toLocaleString(),
                      status: status === 'All' ? 'Active' : status
                    }));
                    exportToPDF(mockRows, `Custom_${module}_Report`, `Custom ${module} Report`);
                  }}
                  className="primary-btn" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', background: '#3b82f6', cursor: 'pointer' }}
                >
                  <Download size={14} /> Export PDF
                </button>
              </div>
            )}
          </div>

          {!showPreview ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', gap: '16px' }}>
              <Settings size={48} opacity={0.2} />
              <p>Configure your filters on the left and click "Generate Preview" to view data.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Module: {module}</span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Course: {course}</span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Batch: {batch}</span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Status: {status}</span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '16px', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Primary Field</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Secondary Field</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Metric Value</th>
                      <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock Generated Data based on standard template */}
                    {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                      <tr key={row} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '16px', fontWeight: 600, color: '#3b82f6' }}>{module.substring(0,3).toUpperCase()}-2026-00{row}</td>
                        <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Sample Data Record {row}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{course === 'All' ? 'Full Stack Dev' : course}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>1{row} Aug 2026</td>
                        <td style={{ padding: '16px', fontWeight: 'bold' }}>{(row * 15000).toLocaleString()}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {status === 'All' ? 'Active' : status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                Showing 7 of 42 records found for this criteria.
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
