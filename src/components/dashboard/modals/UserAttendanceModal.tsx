'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  userName: string;
  onClose: () => void;
}

export function UserAttendanceModal({ userName, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Attendance Details</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{userName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <CheckCircle size={24} color="#10b981" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>21</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Present Days</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <XCircle size={24} color="#ef4444" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>2</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Absent Days</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <Calendar size={24} color="#f59e0b" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>1</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Leave Days</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <Clock size={24} color="#3b82f6" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>98%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Attendance %</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Attendance History (Last 5 days)</h3>
           <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                 <th style={{ padding: '12px' }}>Date</th>
                 <th style={{ padding: '12px' }}>Status</th>
                 <th style={{ padding: '12px' }}>Check-in</th>
                 <th style={{ padding: '12px' }}>Check-out</th>
                 <th style={{ padding: '12px' }}>Working Hrs</th>
               </tr>
             </thead>
             <tbody>
               {[
                 { date: '11 Aug 2026', stat: 'Present', in: '09:05 AM', out: '06:15 PM', hrs: '9h 10m' },
                 { date: '10 Aug 2026', stat: 'Present', in: '09:00 AM', out: '06:30 PM', hrs: '9h 30m' },
                 { date: '09 Aug 2026', stat: 'Present', in: '09:12 AM', out: '06:05 PM', hrs: '8h 53m' },
                 { date: '08 Aug 2026', stat: 'Leave', in: '-', out: '-', hrs: '0h 0m' },
                 { date: '07 Aug 2026', stat: 'Present', in: '09:01 AM', out: '06:10 PM', hrs: '9h 09m' }
               ].map(r => (
                 <tr key={r.date} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                   <td style={{ padding: '12px' }}>{r.date}</td>
                   <td style={{ padding: '12px' }}><span style={{ color: r.stat === 'Present' ? '#10b981' : '#f59e0b' }}>{r.stat}</span></td>
                   <td style={{ padding: '12px' }}>{r.in}</td>
                   <td style={{ padding: '12px' }}>{r.out}</td>
                   <td style={{ padding: '12px' }}>{r.hrs}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </motion.div>
    </div>
  );
}
