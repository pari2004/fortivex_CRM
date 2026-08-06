'use client';

import React, { useState } from 'react';
import { FileText, Download, BarChart2, Share2, Copy, Edit2, CheckCircle, Printer, Eye, FileDigit, Calendar, Trash2, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// --- Types ---
export interface CRMReport {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  type: string;
  status: 'Ready' | 'Generating' | 'Failed';
  downloadCount: number;
}

// --- Initial Data ---
const initialReports: CRMReport[] = [
  { id: 'REP-1001', name: 'Full Stack Development Admissions Report', createdBy: 'Rahul Sharma', createdDate: '01 Aug 2026', lastUpdated: '03 Aug 2026', type: 'Admissions Report', status: 'Ready', downloadCount: 12 },
  { id: 'REP-1002', name: 'Full Stack Development Revenue Report', createdBy: 'Finance Dept', createdDate: '28 Jul 2026', lastUpdated: '03 Aug 2026', type: 'Revenue Report', status: 'Ready', downloadCount: 45 },
  { id: 'REP-1003', name: 'Full Stack Development Student Report', createdBy: 'System', createdDate: '03 Aug 2026', lastUpdated: '03 Aug 2026', type: 'Student Report', status: 'Ready', downloadCount: 108 },
  { id: 'REP-1004', name: 'Full Stack Development Placement Report', createdBy: 'Placement Cell', createdDate: '15 Jul 2026', lastUpdated: '03 Aug 2026', type: 'Placement Report', status: 'Ready', downloadCount: 74 },
  { id: 'REP-1005', name: 'Full Stack Development Attendance Report', createdBy: 'Rahul Sharma', createdDate: '02 Aug 2026', lastUpdated: '03 Aug 2026', type: 'Attendance Report', status: 'Ready', downloadCount: 8 },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'Ready') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200">Ready</span>;
  if (status === 'Generating') return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">Generating...</span>;
  return <span className="px-2 py-1 text-xs font-semibold rounded-full border bg-red-100 text-red-800 border-red-200">Failed</span>;
}

// --- MOCK DATA GENERATOR FOR REPORTS ---
const generateMockReportData = (reportName: string) => {
  const headers = ['Record ID', 'Student Name', 'Program', 'Status', 'Counselor', 'Date'];
  const data = [];
  
  const names = ['Rahul Sharma', 'Priya Patel', 'Sneha Reddy', 'Amit Kumar', 'Vikram Singh', 'Neha Gupta', 'Arjun Kapoor', 'Sanjay Dutt', 'Riya Sen', 'Karan Johar'];
  const programs = ['Full Stack Development'];
  const statuses = ['Interested', 'Admitted', 'Demo Scheduled', 'Pending', 'Lost'];
  const counselors = ['Rahul', 'Arjun', 'Kiran', 'Priya', 'Amit'];

  // Generate 55 rows of realistic data
  for (let i = 1; i <= 55; i++) {
    const id = `REC-${String(i).padStart(4, '0')}`;
    const name = names[Math.floor(Math.random() * names.length)] + ` ${i}`;
    const program = programs[Math.floor(Math.random() * programs.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const counselor = counselors[Math.floor(Math.random() * counselors.length)];
    const date = new Date(Date.now() - Math.random() * 30 * 86400000).toLocaleDateString('en-GB');
    
    data.push([id, name, program, status, counselor, date]);
  }
  
  return { headers, data };
};

export default function ReportsPage() {
  const [reports, setReports] = useState<CRMReport[]>(initialReports);
  const [filteredReports, setFilteredReports] = useState<CRMReport[]>(initialReports);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- Toast ---
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Modals State ---
  const [downloadReport, setDownloadReport] = useState<CRMReport | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewReport, setViewReport] = useState<CRMReport | null>(null);
  const [shareReport, setShareReport] = useState<CRMReport | null>(null);
  const [deleteReport, setDeleteReport] = useState<CRMReport | null>(null);
  const [renameReport, setRenameReport] = useState<CRMReport | null>(null);
  const [newName, setNewName] = useState('');

  // --- REAL DOWNLOAD HANDLERS ---
  const handleStartDownload = async (format: 'PDF' | 'Excel' | 'CSV') => {
    if (!downloadReport) return;
    
    setIsDownloading(true);
    showToast('Preparing Report...', 'info');

    try {
      // Simulate slight processing delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      showToast('Generating File...', 'info');
      
      const { headers, data } = generateMockReportData(downloadReport.name);
      const safeName = downloadReport.name.replace(/[^a-zA-Z0-9]/g, '_');
      const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '_'); // e.g. 03_08_2026
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Download Started...', 'info');

      if (format === 'CSV') {
        const fileName = `${safeName}_${dateStr}.csv`;
        const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      else if (format === 'Excel') {
        const fileName = `${safeName}_${dateStr}.xlsx`;
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report Data");
        XLSX.writeFile(wb, fileName);
      } 
      else if (format === 'PDF') {
        const fileName = `${safeName}_${dateStr}.pdf`;
        const doc = new jsPDF();
        
        // Add Header
        doc.setFontSize(20);
        doc.text('FORTIVEX.AI CRM', 14, 22);
        
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text(downloadReport.name, 14, 32);
        
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
        doc.text(`Generated by: ${downloadReport.createdBy}`, 14, 46);
        
        // Add Table
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 55,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] }, // Primary color
          styles: { fontSize: 8 }
        });
        
        doc.save(fileName);
      }

      // Update download count
      setReports(prev => prev.map(r => r.id === downloadReport.id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
      setIsDownloading(false);
      setDownloadReport(null);
      
      setTimeout(() => {
        showToast('Download Completed Successfully.', 'success');
      }, 500);

    } catch (error) {
      console.error("Download error:", error);
      showToast('Error generating file.', 'error');
      setIsDownloading(false);
      setDownloadReport(null);
    }
  };

  const handleDuplicate = (report: CRMReport) => {
    const newReport = {
      ...report,
      id: `REP-${Math.floor(Math.random() * 9000) + 1000}`,
      name: `Copy of ${report.name}`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      downloadCount: 0
    };
    setReports(prev => [newReport, ...prev]);
    showToast('Report duplicated successfully');
  };

  const confirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameReport && newName.trim()) {
      setReports(prev => prev.map(r => r.id === renameReport.id ? { ...r, name: newName.trim(), lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) } : r));
      showToast('Report renamed successfully');
      setRenameReport(null);
    }
  };

  const confirmDelete = () => {
    if (deleteReport) {
      setReports(prev => prev.filter(r => r.id !== deleteReport.id));
      showToast('Report deleted successfully');
      setDeleteReport(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleActionMenu = (action: string, report: CRMReport) => {
    switch (action) {
      case 'View Report': setViewReport(report); break;
      case 'Download PDF': setDownloadReport(report); setTimeout(() => handleStartDownload('PDF'), 100); break;
      case 'Download Excel': setDownloadReport(report); setTimeout(() => handleStartDownload('Excel'), 100); break;
      case 'Download CSV': setDownloadReport(report); setTimeout(() => handleStartDownload('CSV'), 100); break;
      case 'Print Report': handlePrint(); break;
      case 'Share Report': setShareReport(report); break;
      case 'Duplicate Report': handleDuplicate(report); break;
      case 'Rename Report': setRenameReport(report); setNewName(report.name); break;
      case 'Delete Report': setDeleteReport(report); break;
    }
    setActiveMenuId(null);
  };

  // --- RENDER VIEW REPORT CONTENT ---
  const renderReportContent = (report: CRMReport) => {
    switch (report.type) {
      case 'Lead Report':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>120</div><div style={{ color: 'var(--text-secondary)' }}>Total Leads</div></div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>86</div><div style={{ color: 'var(--text-secondary)' }}>Qualified Leads</div></div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>54</div><div style={{ color: 'var(--text-secondary)' }}>Interested</div></div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>31</div><div style={{ color: 'var(--text-secondary)' }}>Demo Scheduled</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Performance Metrics</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Admissions</span><strong>18</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Lost Leads</span><strong>12</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Conversion Rate</span><strong style={{ color: '#10b981' }}>42%</strong></div>
              </div>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Top Contributors</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Lead Source</span><strong>Website</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}><span>Top Counselor</span><strong>Rahul Sharma</strong></div>
              </div>
            </div>
          </div>
        );
      case 'Admissions Report':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>85</div><div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Total Applications</div></div>
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>67</div><div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Admissions Completed</div></div>
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}><div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b' }}>18</div><div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Pending Decisions</div></div>
          </div>
        );
      case 'Revenue Report':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Revenue</div><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>₹24,50,000</div></div>
              <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Payments</div><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>₹3,20,000</div></div>
              <div className="glass-panel" style={{ padding: '24px' }}><div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Scholarships</div><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹2,50,000</div></div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)' }}>
              <BarChart2 size={48} color="var(--text-tertiary)" style={{ opacity: 0.5, marginRight: '16px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Revenue Graph Placeholder</span>
            </div>
          </div>
        );
      case 'Student Report':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>342</div><div style={{ color: 'var(--text-secondary)' }}>Active Students</div></div>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>148</div><div style={{ color: 'var(--text-secondary)' }}>Completed</div></div>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>194</div><div style={{ color: 'var(--text-secondary)' }}>Current Batch</div></div>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>88</div><div style={{ color: 'var(--text-secondary)' }}>Placement Ready</div></div>
          </div>
        );
      default:
        return (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Detailed visualization for <strong>{report.type}</strong> is being generated.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Generate and export formatted PDF/CSV reports for management.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={reports} 
          onFilteredDataChange={setFilteredReports} 
          searchKeys={['id', 'name', 'createdBy', 'type']}
          searchPlaceholder="Search by Report Name, ID, or Creator..."
          exportFilename="Empowers_Reports_List"
          filterOptions={[
            { key: 'status', label: 'Status', type: 'select', options: ['Ready', 'Generating', 'Failed'] },
            { key: 'type', label: 'Report Type', type: 'select', options: ['Lead Report', 'Admissions Report', 'Revenue Report', 'Student Report', 'Payment Report'] }
          ]}
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Report Details</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Type</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Created By</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Dates</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Downloads</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{report.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{report.id}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{report.type}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-primary)', fontWeight: 500 }}>{report.createdBy}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.9rem' }}>Created: {report.createdDate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Updated: {report.lastUpdated}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}><StatusBadge status={report.status} /></td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600 }}>{report.downloadCount}</td>
                  <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => setDownloadReport(report)} style={{ padding: '6px 12px', background: 'var(--primary-light)', color: 'var(--primary-color)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <Download size={14} /> Download
                    </button>
                    <div style={{ position: 'relative' }}>
                      <ActionMenu 
                        isOpen={activeMenuId === report.id}
                        onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === report.id ? null : report.id); }}
                        onClose={() => setActiveMenuId(null)}
                        items={[
                          { label: 'View Report', icon: <Eye size={16} />, onClick: () => handleActionMenu('View Report', report) },
                          { label: 'Download PDF', icon: <FileText size={16} />, onClick: () => handleActionMenu('Download PDF', report) },
                          { label: 'Download Excel', icon: <FileDigit size={16} />, onClick: () => handleActionMenu('Download Excel', report) },
                          { label: 'Download CSV', icon: <FileDigit size={16} />, onClick: () => handleActionMenu('Download CSV', report) },
                          { label: 'Print Report', icon: <Printer size={16} />, onClick: () => handleActionMenu('Print Report', report) },
                          { divider: true, label: '' },
                          { label: 'Share Report', icon: <Share2 size={16} />, onClick: () => handleActionMenu('Share Report', report) },
                          { label: 'Duplicate Report', icon: <Copy size={16} />, onClick: () => handleActionMenu('Duplicate Report', report) },
                          { label: 'Rename Report', icon: <Edit2 size={16} />, onClick: () => handleActionMenu('Rename Report', report) },
                          { divider: true, label: '' },
                          { label: 'Delete Report', icon: <Trash2 size={16} />, color: 'var(--status-rejected)', onClick: () => handleActionMenu('Delete Report', report) }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No reports found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: toast.type === 'success' ? 'var(--status-enrolled)' : toast.type === 'error' ? 'var(--status-rejected)' : 'var(--primary-color)', color: 'white', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOWNLOAD OPTIONS MODAL */}
      <AnimatePresence>
        {downloadReport && !isDownloading && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDownloadReport(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ position: 'relative', width: '90%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
              <button onClick={() => setDownloadReport(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Download size={32} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Download Report</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Select a format for <strong>{downloadReport.name}</strong>.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handleStartDownload('PDF')} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>PDF (.pdf)</button>
                <button onClick={() => handleStartDownload('Excel')} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Excel (.xlsx)</button>
                <button onClick={() => handleStartDownload('CSV')} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>CSV (.csv)</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW REPORT MODAL */}
      <AnimatePresence>
        {viewReport && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewReport(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'relative', width: '90%', maxWidth: '1000px', height: '80vh', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Toolbar */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '8px' }}>
                    <BarChart2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{viewReport.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      FORTIVEX.AI CRM • Date: {viewReport.createdDate} • ID: {viewReport.id}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button onClick={handlePrint} title="Print" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Printer size={20} /></button>
                  <button onClick={() => setDownloadReport(viewReport)} title="Download" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '12px' }}><Download size={20} /></button>
                  <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
                  <button onClick={() => setViewReport(null)} title="Close" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X size={24} /></button>
                </div>
              </div>

              {/* Viewer Area */}
              <div style={{ flex: 1, backgroundColor: 'white', padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div style={{ borderBottom: '2px solid var(--text-primary)', paddingBottom: '16px', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>FORTIVEX.AI CRM</h1>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>{viewReport.name}</h2>
                  </div>
                  {renderReportContent(viewReport)}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHARE REPORT MODAL */}
      <AnimatePresence>
        {shareReport && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShareReport(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ position: 'relative', width: '90%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
              <button onClick={() => setShareReport(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Share2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Share Report</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Share <strong>{shareReport.name}</strong>
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={`mailto:?subject=${shareReport.name} - FORTIVEX.AI CRM&body=Please find the ${shareReport.name} report attached.`} target="_blank" rel="noreferrer" onClick={() => { showToast('Opened Gmail'); setShareReport(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> Share via Email</span>
                </a>
                <a href="https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0" target="_blank" rel="noreferrer" onClick={(e) => { e.preventDefault(); if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) { window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); showToast('Opened WhatsApp'); setShareReport(null); } }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: '#25D366', color: 'white', fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                  Join Fortivex.AI CRM WhatsApp Community
                </a>
                <button onClick={() => { showToast('Link copied to clipboard'); setShareReport(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENAME REPORT MODAL */}
      <AnimatePresence>
        {renameReport && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRenameReport(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ position: 'relative', width: '90%', maxWidth: '400px', padding: '32px' }}>
              <button onClick={() => setRenameReport(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Rename Report</h2>
              <form onSubmit={confirmRename} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" autoFocus required className="input-field" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Report Name" />
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setRenameReport(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteReport && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteReport(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel" style={{ position: 'relative', width: '90%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef2f2', color: 'var(--status-rejected)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Trash2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Delete Report?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Are you sure you want to delete <strong>{deleteReport.name}</strong>?
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => setDeleteReport(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--status-rejected)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
