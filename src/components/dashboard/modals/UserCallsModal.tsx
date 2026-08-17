'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, PhoneCall, PhoneForwarded, PhoneMissed } from 'lucide-react';

interface Props {
  userName: string;
  onClose: () => void;
}

export function UserCallsModal({ userName, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Call Activity</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <Phone size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>1,245</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Calls</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <PhoneCall size={24} color="#10b981" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>890</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Connected Calls</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <PhoneMissed size={24} color="#ef4444" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>355</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Missed Calls</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <PhoneForwarded size={24} color="#8b5cf6" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>4m 12s</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Duration</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Recent Calls</h3>
           <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                 <th style={{ padding: '12px' }}>Time</th>
                 <th style={{ padding: '12px' }}>Lead Name</th>
                 <th style={{ padding: '12px' }}>Status</th>
                 <th style={{ padding: '12px' }}>Duration</th>
               </tr>
             </thead>
             <tbody>
               {[
                 { t: '10:45 AM', n: 'Arjun Reddy', s: 'Connected', d: '4m 30s' },
                 { t: '10:12 AM', n: 'Priya Sharma', s: 'Missed', d: '0m 0s' },
                 { t: '09:55 AM', n: 'Sneha Patel', s: 'Connected', d: '12m 45s' },
                 { t: '09:20 AM', n: 'Rohan Gupta', s: 'Connected', d: '2m 15s' },
                 { t: '09:05 AM', n: 'Vikram Singh', s: 'Missed', d: '0m 0s' }
               ].map((r, i) => (
                 <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                   <td style={{ padding: '12px' }}>{r.t}</td>
                   <td style={{ padding: '12px' }}>{r.n}</td>
                   <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: r.s === 'Connected' ? '#10b98120' : '#ef444420', color: r.s === 'Connected' ? '#10b981' : '#ef4444' }}>{r.s}</span></td>
                   <td style={{ padding: '12px' }}>{r.d}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </motion.div>
    </div>
  );
}
