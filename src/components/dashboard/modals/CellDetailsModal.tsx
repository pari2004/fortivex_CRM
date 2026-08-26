'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, Filter, Download, Printer } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
}

export function CellDetailsModal({ title, onClose }: Props) {
  // Simple mock data generator for cell details view
  const generateMockData = () => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `REC-${1000 + i}`,
      detail: `Item ${i + 1} for ${title}`,
      date: 'Today',
      status: i % 3 === 0 ? 'Completed' : 'Pending'
    }));
  };

  const data = generateMockData();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
          <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)' }}><X size={20} /></button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search..." className="glass-input" style={{ paddingLeft: '36px', width: '200px' }} />
            </div>
            <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}><Filter size={16} /> Filter</button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Download size={16} /></button>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Printer size={16} /></button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Detail</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.id}</td>
                  <td style={{ padding: '12px 16px' }}>{row.detail}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', background: row.status === 'Completed' ? '#10b98120' : '#f59e0b20', color: row.status === 'Completed' ? '#10b981' : '#f59e0b' }}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
