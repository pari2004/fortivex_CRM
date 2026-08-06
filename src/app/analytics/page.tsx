'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, TrendingUp, X, Users, BookOpen, Clock, Download, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataToolbar } from '@/components/common/DataToolbar';
import { MonthlyRevenueChart, MonthlyConversionChart, CounselorPerformanceChart, ProgramConversionChart, MonthlyClosingTrendChart } from './AnalyticsCharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// --- Cohort Data Models ---
interface Cohort {
  id: string;
  name: string;
  program: string;
  students: number;
  mentor: string;
  startDate: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  completionPct: number;
  revenue: number;
}

const mockCohorts: Cohort[] = [
  { id: 'COH-1001', name: 'FSD-2026-A', program: 'Full Stack Development', students: 42, mentor: 'Rahul Sharma', startDate: '05 Aug 2026', status: 'Active', completionPct: 45, revenue: 6300000 },
  { id: 'COH-1002', name: 'FSD-2026-B', program: 'Full Stack Development', students: 38, mentor: 'Sneha Reddy', startDate: '15 Aug 2026', status: 'Active', completionPct: 20, revenue: 5700000 },
  { id: 'COH-1003', name: 'FSD-2026-C', program: 'Full Stack Development', students: 51, mentor: 'Arjun Kumar', startDate: '10 Aug 2026', status: 'Active', completionPct: 15, revenue: 7650000 },
  { id: 'COH-1004', name: 'FSD-Weekend-01', program: 'Full Stack Development', students: 29, mentor: 'Priya Sharma', startDate: '20 Aug 2026', status: 'Active', completionPct: 5, revenue: 4350000 },
  { id: 'COH-1005', name: 'FSD-2025-Q4', program: 'Full Stack Development', students: 45, mentor: 'Rahul Sharma', startDate: '01 Nov 2025', status: 'Completed', completionPct: 100, revenue: 6750000 },
];

function CohortStatusBadge({ status }: { status: string }) {
  if (status === 'Active') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200">{status}</span>;
  if (status === 'Upcoming') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">{status}</span>;
  return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-800 border-gray-200">{status}</span>;
}

type ActiveViewType = 'dealSize' | 'conversion' | 'timeToClose' | 'cohorts' | null;

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<ActiveViewType>(null);
  
  // Cohorts state
  const [cohorts, setCohorts] = useState<Cohort[]>(mockCohorts);
  const [filteredCohorts, setFilteredCohorts] = useState<Cohort[]>(mockCohorts);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  // --- Toast ---
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Export Functionality ---
  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    showToast(`Generating ${format} Export...`, 'info');
    
    setTimeout(() => {
      const headers = ['Cohort ID', 'Name', 'Program', 'Students', 'Mentor', 'Start Date', 'Status', 'Completion %', 'Revenue Generated'];
      const data = filteredCohorts.map(c => [c.id, c.name, c.program, c.students, c.mentor, c.startDate, c.status, `${c.completionPct}%`, `₹${c.revenue}`]);
      const safeName = 'Cohort_Management_Export';
      const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
      const fileName = `${safeName}_${dateStr}`;

      if (format === 'CSV') {
        const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      else if (format === 'Excel') {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cohorts");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } 
      else if (format === 'PDF') {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Empowers Academy', 14, 22);
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text('Active Cohorts Report', 14, 32);
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 45,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] },
          styles: { fontSize: 8 }
        });
        doc.save(`${fileName}.pdf`);
      }
      showToast('Export Completed Successfully', 'success');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px', position: 'relative' }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Analytics & BI</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into business intelligence and cohort performance.</p>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[
          { id: 'dealSize', label: 'Avg Deal Size', val: '₹142,500', icon: TrendingUp },
          { id: 'conversion', label: 'Conversion Rate', val: '18.4%', icon: Activity },
          { id: 'timeToClose', label: 'Time to Close', val: '14 Days', icon: BarChart3 },
          { id: 'cohorts', label: 'Active Cohorts', val: '8', icon: PieChart }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView(stat.id as ActiveViewType)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 500 }}>{stat.label}</span>
              <stat.icon size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
              View Analytics <ChevronRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* BASE DASHBOARD CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonthlyRevenueChart />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ProgramConversionChart />
          </div>
        </div>
      </div>

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {activeView && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '40px 20px' }}>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: '1200px', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
              
              {/* Overlay Toolbar */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {activeView === 'dealSize' && <><TrendingUp color="var(--primary-color)" /> Average Deal Size Analytics</>}
                  {activeView === 'conversion' && <><Activity color="var(--primary-color)" /> Conversion Analytics</>}
                  {activeView === 'timeToClose' && <><Clock color="var(--primary-color)" /> Sales Cycle Analytics</>}
                  {activeView === 'cohorts' && <><BookOpen color="var(--primary-color)" /> Cohort Management</>}
                </h2>
                <button onClick={() => { setActiveView(null); setSelectedCohort(null); }} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}><X size={24} /></button>
              </div>

              {/* Overlay Content */}
              <div style={{ padding: '32px', flex: 1 }}>
                
                {/* 1. DEAL SIZE */}
                {activeView === 'dealSize' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Average Deal Value</div><div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹142,500</div></div>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Highest Deal</div><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹285,000</div></div>
                      <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)' }}>Lowest Deal</div><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>₹75,000</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Deal Size Breakdown</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Monthly Average</span><strong>₹135,000</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Quarterly Average</span><strong>₹142,500</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Yearly Average</span><strong>₹138,200</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Program</span><strong>Full Stack Development</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Counselor by Value</span><strong>Priya Sharma</strong></div>
                      </div>
                      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, minHeight: '300px' }}>
                          <MonthlyRevenueChart />
                        </div>
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                      <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Top 10 Highest Value Deals</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead><tr style={{ color: 'var(--text-secondary)' }}><th style={{ padding: '12px' }}>Student</th><th style={{ padding: '12px' }}>Program</th><th style={{ padding: '12px' }}>Value</th></tr></thead>
                        <tbody>
                          {[...Array(5)].map((_, i) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--glass-border)' }}>
                              <td style={{ padding: '12px', fontWeight: 500 }}>Example Student {i + 1}</td>
                              <td style={{ padding: '12px' }}>PG Executive Agentic AI</td>
                              <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{285000 - (i * 15000)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. CONVERSION */}
                {activeView === 'conversion' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Overall Conversion Rate</div>
                      <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-color)' }}>18.4%</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '32px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '24px' }}>Lead Funnel</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                          { label: 'Website Leads', count: 420, pct: '100%', color: '#3b82f6' },
                          { label: 'Qualified', count: 286, pct: '68%', color: '#6366f1' },
                          { label: 'Interested', count: 162, pct: '38%', color: '#8b5cf6' },
                          { label: 'Demo Scheduled', count: 94, pct: '22%', color: '#d946ef' },
                          { label: 'Admissions', count: 77, pct: '18.4%', color: '#10b981' },
                        ].map((stage, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '150px', fontWeight: 600, color: 'var(--text-secondary)' }}>{stage.label}</div>
                            <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: stage.pct }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: '100%', backgroundColor: stage.color, borderRadius: '12px' }} />
                            </div>
                            <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>{stage.count}</div>
                            <div style={{ width: '60px', textAlign: 'right', color: 'var(--text-tertiary)' }}>{stage.pct}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <MonthlyConversionChart />
                       </div>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <CounselorPerformanceChart />
                       </div>
                       <div className="glass-panel" style={{ padding: '24px', height: '350px' }}>
                         <div style={{ fontWeight: 600, marginBottom: '16px' }}>Batch Conversion Chart</div>
                         <ProgramConversionChart />
                       </div>
                    </div>
                  </div>
                )}

                {/* 3. TIME TO CLOSE */}
                {activeView === 'timeToClose' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Average Closing Time</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>14 Days</div></div>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Fastest Close</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>3 Days</div></div>
                      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ color: 'var(--text-secondary)' }}>Longest Close</div><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444' }}>38 Days</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Additional Metrics</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Average Response Time</span><strong>2.4 Hours</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Demo Completion Time</span><strong>4 Days</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Counselor Closing Time (Avg)</span><strong>12.5 Days</strong></div>
                      </div>
                      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '350px' }}>
                        <div style={{ flex: 1, minHeight: 0 }}>
                          <MonthlyClosingTrendChart />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. COHORT MANAGEMENT */}
                {activeView === 'cohorts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                    {selectedCohort ? (
                      <div className="glass-panel" style={{ padding: '32px' }}>
                        <button onClick={() => setSelectedCohort(null)} className="secondary-btn" style={{ marginBottom: '24px' }}>← Back to Cohorts</button>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>{selectedCohort.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{selectedCohort.program}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mentor</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedCohort.mentor}</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Students</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedCohort.students}</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completion</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{selectedCohort.completionPct}%</div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Revenue</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>₹{selectedCohort.revenue.toLocaleString()}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Progress Tracking</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Average Attendance</span><strong>88%</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Assignments Submitted</span><strong>340 / 420</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>Placement Ready Students</span><strong>{Math.floor(selectedCohort.students * 0.2)}</strong></div>
                          </div>
                          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Upcoming Sessions</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>React Advanced Hooks</span><strong>Tomorrow, 6 PM</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}><span>State Management with Redux</span><strong>In 3 Days</strong></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Cohorts</h3>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleExport('CSV')} className="secondary-btn"><Download size={16} /> CSV</button>
                            <button onClick={() => handleExport('Excel')} className="secondary-btn"><Download size={16} /> Excel</button>
                            <button onClick={() => handleExport('PDF')} className="primary-btn"><Download size={16} /> PDF</button>
                          </div>
                        </div>

                        <DataToolbar 
                          data={cohorts} 
                          onFilteredDataChange={setFilteredCohorts} 
                          searchKeys={['name', 'program', 'mentor']}
                          searchPlaceholder="Search Cohort, Program, or Mentor..."
                          exportFilename="none" // Managed manually above
                          filterOptions={[
                            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Completed', 'Upcoming'] },
                            { key: 'name', label: 'Batch', type: 'select', options: ['FSD-2026-A', 'FSD-2026-B', 'FSD-2026-C', 'FSD-Weekend-01'] }
                          ]}
                        />

                        <div style={{ flex: 1, overflow: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                              <tr>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Cohort Info</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Mentor</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Students</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Start Date</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCohorts.map(cohort => (
                                <tr key={cohort.id} onClick={() => setSelectedCohort(cohort)} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                  <td style={{ padding: '16px 24px' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cohort.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cohort.program}</div>
                                  </td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-primary)', fontWeight: 500 }}>{cohort.mentor}</td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{cohort.students}</td>
                                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{cohort.startDate}</td>
                                  <td style={{ padding: '16px 24px' }}><CohortStatusBadge status={cohort.status} /></td>
                                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>₹{cohort.revenue.toLocaleString()}</td>
                                </tr>
                              ))}
                              {filteredCohorts.length === 0 && (
                                <tr>
                                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No cohorts found matching your criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: toast.type === 'success' ? 'var(--status-enrolled)' : toast.type === 'error' ? 'var(--status-rejected)' : 'var(--primary-color)', color: 'white', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
