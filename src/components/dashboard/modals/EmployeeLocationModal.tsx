'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Calendar as CalendarIcon, Clock, Download, Printer, MapPin, Navigation, Map, TrendingUp, Battery, Smartphone } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  employeeName: string;
  onClose: () => void;
}

export function EmployeeLocationModal({ employeeName, onClose }: Props) {
  const travelData = [
    { name: 'Mon', dist: 45 },
    { name: 'Tue', dist: 30 },
    { name: 'Wed', dist: 65 },
    { name: 'Thu', dist: 40 },
    { name: 'Fri', dist: 55 },
  ];

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal" 
        style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {employeeName.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>{employeeName}</h2>
              <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {employeeName.toLowerCase().replace(' ', '.')}@fortivex.ai</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> +91 98765 43210</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}><Battery size={14}/> 84%</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Download size={16} /></button>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Printer size={16} /></button>
            <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)' }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          
          {/* LEFT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Location Profile</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Department</span><span style={{ fontWeight: 500 }}>Sales</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Territory</span><span style={{ fontWeight: 500 }}>Bengaluru South</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Live Status</span><span style={{ color: '#3b82f6', fontWeight: 500 }}>Travelling</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Device</span><span style={{ fontWeight: 500 }}>Samsung S23</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Avg Daily Travel</span><span style={{ fontWeight: 500 }}>38 km</span></div>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Today's Route Summary</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Start Location</span><span style={{ fontWeight: 'bold', textAlign: 'right' }}>Koramangala,<br/>Bengaluru</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>End Location</span><span style={{ fontWeight: 'bold', textAlign: 'right' }}>Jayanagar,<br/>Bengaluru</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Distance Logged</span><span style={{ fontWeight: 'bold', color: '#ec4899' }}>24.5 km</span></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Client Visits</span><span style={{ fontWeight: 'bold' }}>4</span></div>
               </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Weekly Travel Distance (km)</h3>
               <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={travelData}>
                    <defs>
                      <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                    <Area type="monotone" dataKey="dist" name="Distance (km)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDist)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
               <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Check-in & Location Timeline</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '12px 16px' }}>Time</th>
                      <th style={{ padding: '12px 16px' }}>Event</th>
                      <th style={{ padding: '12px 16px' }}>Location / Address</th>
                      <th style={{ padding: '12px 16px' }}>Coordinates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: '09:05 AM', event: 'Day Start Check-in', loc: 'Koramangala, Bengaluru', coord: '12.9279° N, 77.6271° E' },
                      { time: '11:30 AM', event: 'Client Meeting', loc: 'Indiranagar, Bengaluru', coord: '12.9784° N, 77.6408° E' },
                      { time: '02:15 PM', event: 'Student Visit', loc: 'Jayanagar, Bengaluru', coord: '12.9250° N, 77.5938° E' },
                      { time: '04:45 PM', event: 'Live Update', loc: 'JP Nagar, Bengaluru', coord: '12.9063° N, 77.5857° E' },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{row.time}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', 
                            background: row.event === 'Day Start Check-in' ? '#10b98120' : (row.event === 'Live Update' ? '#3b82f620' : '#8b5cf620'), 
                            color: row.event === 'Day Start Check-in' ? '#10b981' : (row.event === 'Live Update' ? '#3b82f6' : '#8b5cf6') 
                          }}>
                            {row.event}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color="var(--text-secondary)"/>{row.loc}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.coord}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
