'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Printer, 
  RefreshCw, Save, MoreVertical, Edit, FilePlus, Trash2, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '@/contexts/CRMContext';
import { useRouter } from 'next/navigation';

interface EnterpriseDetailTemplateProps {
  title: string;
  data: any[];
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[];
  summaryCards: { title: string; value: string; icon: any; color: string }[];
}

export function EnterpriseDetailTemplate({ title, data, columns, summaryCards }: EnterpriseDetailTemplateProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (action: string, id: string) => {
    showToast(`Action "${action}" triggered for ${id}`);
    setMenuOpenId(null);
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '24px' }}>
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{title} Details</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enterprise Analytics & Data Management</p>
        </div>
        <button className="secondary-btn" onClick={() => router.back()}>← Back to Dashboard</button>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {summaryCards.map((card, i) => (
          <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}20`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{card.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" placeholder="Search everywhere..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input" style={{ paddingLeft: '36px', width: '300px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => showToast('Filters Opened')}><Filter size={16} /> Filter</button>
          <button className="secondary-btn" onClick={() => showToast('Saved!')}><Save size={16} /> Save</button>
          <button className="secondary-btn" onClick={() => showToast('PDF Download Started')}><FileText size={16} /> PDF</button>
          <button className="secondary-btn" onClick={() => showToast('Excel Export Started')}><FileSpreadsheet size={16} /> Excel</button>
          <button className="secondary-btn" onClick={() => showToast('Printing...')}><Printer size={16} /> Print</button>
          <button className="secondary-btn" onClick={() => showToast('Refreshed')}><RefreshCw size={16} /></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ flex: 1, overflow: 'auto', minHeight: '400px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{col.label}</th>
              ))}
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 100).map((row, i) => (
              <tr key={row.id || i} style={{ borderBottom: '1px solid var(--glass-border)', position: 'relative' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '16px' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button className="icon-btn" onClick={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}>
                    <MoreVertical size={18} />
                  </button>
                  {menuOpenId === row.id && (
                    <div className="glass-panel" style={{ position: 'absolute', right: '32px', top: '16px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', textAlign: 'left' }}>
                      <button className="dropdown-item" onClick={() => handleAction('View Details', row.id)}><FileText size={14} /> View Details</button>
                      <button className="dropdown-item" onClick={() => handleAction('Edit', row.id)}><Edit size={14} /> Edit</button>
                      <button className="dropdown-item" onClick={() => handleAction('Duplicate', row.id)}><FilePlus size={14} /> Duplicate</button>
                      <button className="dropdown-item" onClick={() => handleAction('Download PDF', row.id)}><Download size={14} /> Download PDF</button>
                      <button className="dropdown-item" onClick={() => handleAction('Timeline', row.id)}><Clock size={14} /> Activity Timeline</button>
                      <button className="dropdown-item" onClick={() => handleAction('Delete', row.id)} style={{ color: '#ef4444' }}><Trash2 size={14} /> Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found.</div>
        )}
      </div>
    </div>
  );
}
