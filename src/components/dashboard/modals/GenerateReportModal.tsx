'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, TrendingUp, DollarSign, Users, CheckCircle } from 'lucide-react';

interface Props {
  reportType: string;
  onClose: () => void;
}

export function GenerateReportModal({ reportType, onClose }: Props) {
  const isCampaign = reportType === 'Campaign Performance Report';
  const isROI = reportType === 'Marketing ROI Report';
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{reportType}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Download size={16} /></button>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Printer size={16} /></button>
            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }} />
            <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
          </div>
        </div>

        {isCampaign ? (
          <div>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Campaign Name</th>
                  <th style={{ padding: '12px 16px' }}>Leads</th>
                  <th style={{ padding: '12px 16px' }}>Applications</th>
                  <th style={{ padding: '12px 16px' }}>Admissions</th>
                  <th style={{ padding: '12px 16px' }}>Revenue</th>
                  <th style={{ padding: '12px 16px' }}>Marketing Cost</th>
                  <th style={{ padding: '12px 16px' }}>Conv. Rate</th>
                  <th style={{ padding: '12px 16px' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px' }}>Summer 2026 Boost</td><td>1,240</td><td>320</td><td>185</td><td>₹45.2 L</td><td>₹2.1 L</td><td>14.9%</td><td style={{ color: '#10b981' }}>21.5x</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px' }}>Tech Lead Gen</td><td>890</td><td>210</td><td>145</td><td>₹32.8 L</td><td>₹1.8 L</td><td>16.2%</td><td style={{ color: '#10b981' }}>18.2x</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px' }}>MBA Direct Admission</td><td>650</td><td>180</td><td>95</td><td>₹65.5 L</td><td>₹3.4 L</td><td>14.6%</td><td style={{ color: '#10b981' }}>19.2x</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : isROI ? (
          <div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Marketing Spend</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>₹12.4 Lakhs</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Revenue Generated</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>₹3.85 Crores</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overall ROI</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>31.0x</div>
                </div>
             </div>
             
             <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>ROI by Source</h3>
             <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Source</th>
                  <th style={{ padding: '12px 16px' }}>Marketing Spend</th>
                  <th style={{ padding: '12px 16px' }}>Revenue</th>
                  <th style={{ padding: '12px 16px' }}>CPL</th>
                  <th style={{ padding: '12px 16px' }}>Conv. Rate</th>
                  <th style={{ padding: '12px 16px' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: '#10b98110' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>YouTube (Best Performer)</td><td>₹3.8 L</td><td>₹1.24 Cr</td><td>₹262</td><td>14.4%</td><td style={{ color: '#10b981', fontWeight: 'bold' }}>32.6x</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px' }}>Google Ads</td><td>₹4.2 L</td><td>₹1.15 Cr</td><td>₹315</td><td>12.8%</td><td style={{ color: '#10b981' }}>27.3x</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px' }}>Facebook</td><td>₹2.8 L</td><td>₹82 L</td><td>₹240</td><td>14.0%</td><td style={{ color: '#10b981' }}>29.2x</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Users size={24} color="#3b82f6" />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Leads</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{reportType.includes('Daily') ? '345' : reportType.includes('Weekly') ? '2,450' : reportType.includes('Monthly') ? '10,840' : '124,500'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <CheckCircle size={24} color="#8b5cf6" />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Applications</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{reportType.includes('Daily') ? '85' : reportType.includes('Weekly') ? '610' : reportType.includes('Monthly') ? '2,750' : '32,100'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <TrendingUp size={24} color="#10b981" />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Admissions</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>{reportType.includes('Daily') ? '42' : reportType.includes('Weekly') ? '315' : reportType.includes('Monthly') ? '1,420' : '18,400'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <DollarSign size={24} color="#ef4444" />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Marketing Spend</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>{reportType.includes('Daily') ? '₹14.2 K' : reportType.includes('Weekly') ? '₹1.1 L' : reportType.includes('Monthly') ? '₹4.8 L' : '₹58.5 L'}</div>
            </div>
            
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Revenue</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{reportType.includes('Daily') ? '₹4.5 L' : reportType.includes('Weekly') ? '₹32.5 L' : reportType.includes('Monthly') ? '₹1.4 Cr' : '₹18.5 Cr'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Renewals</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{reportType.includes('Daily') ? '12' : reportType.includes('Weekly') ? '85' : reportType.includes('Monthly') ? '420' : '4,850'}</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Conv. Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>12.1%</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
