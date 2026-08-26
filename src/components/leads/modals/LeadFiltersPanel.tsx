'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface LeadFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: any;
  onApply: (filters: any) => void;
}

const CRM_USERS = ['Abhishek', 'Padmesh', 'Parikshit', 'Pavan S.H', 'Spoorthi', 'Thanushree BR', 'Yashwanth'];

export function LeadFiltersPanel({ isOpen, onClose, currentFilters, onApply }: LeadFiltersPanelProps) {
  const [filters, setFilters] = useState(currentFilters || {});

  useGlobalEscape(isOpen, onClose);

  if (!isOpen) return null;

  const handleChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({});
    onApply({});
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={onClose}></div>
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '400px', 
          background: 'var(--bg-primary)', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', 
          display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Filter Leads</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label className="filter-label">USERS</label>
            <select value={filters.user || ''} onChange={(e) => handleChange('user', e.target.value)} className="filter-select">
              <option value="">Select users...</option>
              {CRM_USERS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">TEAMS</label>
            <select value={filters.team || ''} onChange={(e) => handleChange('team', e.target.value)} className="filter-select">
              <option value="">Select teams...</option>
              <option value="FA Sales Team">FA Sales Team</option>
            </select>
          </div>

          <div>
            <label className="filter-label">BULK UPLOAD</label>
            <select value={filters.bulkUpload || ''} onChange={(e) => handleChange('bulkUpload', e.target.value)} className="filter-select">
              <option value="">Select bulk upload...</option>
              <option value="Recent Upload 1">Recent Upload 1</option>
            </select>
          </div>

          <div>
            <label className="filter-label">LEAD SOURCE</label>
            <select value={filters.source || ''} onChange={(e) => handleChange('source', e.target.value)} className="filter-select">
              <option value="">Select Lead Source</option>
              {['Website', 'Organic Search', 'Facebook Ads', 'Google Ads', 'LinkedIn', 'Referral', 'Walk-in'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">LEAD STAGE</label>
            <select value={filters.stage || ''} onChange={(e) => handleChange('stage', e.target.value)} className="filter-select">
              <option value="">Select Stage</option>
              {['New Lead', 'Call Attempted Lead', 'Contacted', 'Interested', 'Demo Scheduled', 'Converted', 'Lost'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label className="filter-label">LEAD PRIORITY</label>
            <select value={filters.priority || ''} onChange={(e) => handleChange('priority', e.target.value)} className="filter-select">
              <option value="">Select Priority</option>
              {['High', 'Medium', 'Low'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">LEAD STATUS</label>
            <select value={filters.status || ''} onChange={(e) => handleChange('status', e.target.value)} className="filter-select">
              <option value="">Select Status</option>
              {['Active', 'Inactive', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">LEAD TYPE</label>
            <select value={filters.type || ''} onChange={(e) => handleChange('type', e.target.value)} className="filter-select">
              <option value="">Select Type</option>
              {['B2B', 'B2C', 'Enterprise'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">PRODUCT OR SERVICE</label>
            <select value={filters.product || ''} onChange={(e) => handleChange('product', e.target.value)} className="filter-select">
              <option value="">Select Product/Service</option>
              {['Basic Plan', 'Pro Plan', 'Consulting', 'Implementation'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">LEAD DISPOSITION</label>
            <select value={filters.disposition || ''} onChange={(e) => handleChange('disposition', e.target.value)} className="filter-select">
              <option value="">Select Disposition</option>
              {['Not Reachable', 'Follow Up', 'Not Interested', 'Call Back'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="filter-label">FOLLOW-UP</label>
            <select value={filters.followup || ''} onChange={(e) => handleChange('followup', e.target.value)} className="filter-select">
              <option value="">Select Follow-up</option>
              {['Today', 'Tomorrow', 'Next Week', 'Overdue'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px', background: 'var(--bg-secondary)' }}>
          <button onClick={handleClear} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Clear</button>
          <button onClick={() => { onApply(filters); onClose(); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Apply Filters</button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .filter-label {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--text-tertiary);
            margin-bottom: 6px;
            display: block;
            letter-spacing: 0.5px;
          }
          .filter-select {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
          }
          .filter-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
          }
        `}} />
      </motion.div>
    </div>
  );
}
