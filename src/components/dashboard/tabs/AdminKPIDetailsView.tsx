'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, FileSpreadsheet, Printer, RefreshCw, Edit, MoreVertical, FileText, CheckCircle, Clock } from 'lucide-react';
import { kpiDemoData } from '@/lib/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function AdminKPIDetailsView({ kpiTitle, onBack }: { kpiTitle: string, onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Determine the data type based on the KPI title
  const getKpiType = () => {
    const title = kpiTitle.toLowerCase();
    if (title.includes('call')) return 'calls';
    if (title.includes('lead') || title.includes('contacted') || title.includes('converted')) return 'leads';
    if (title.includes('application') || title.includes('admission')) return 'applications';
    if (title.includes('payment') || title.includes('revenue')) return 'payments';
    if (title.includes('meeting')) return 'meetings';
    if (title.includes('task')) return 'tasks';
    return 'leads'; // Default fallback
  };

  const kpiType = getKpiType();
  const dataset = kpiDemoData[kpiType as keyof typeof kpiDemoData] || [];
  
  const filteredData = dataset.filter((item: any) => {
    const searchString = Object.values(item).join(' ').toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  }).slice(0, 100); // Limit to 100 for demo performance

  // Generate a dynamic trend chart
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 50) + 10,
    secondary: Math.floor(Math.random() * 30) + 5
  }));

  const renderTableHeaders = () => {
    switch (kpiType) {
      case 'calls':
        return (
          <>
            <th style={{ padding: '16px' }}>Call ID</th>
            <th style={{ padding: '16px' }}>Student</th>
            <th style={{ padding: '16px' }}>Counselor</th>
            <th style={{ padding: '16px' }}>Duration</th>
            <th style={{ padding: '16px' }}>Outcome</th>
            <th style={{ padding: '16px' }}>Date</th>
          </>
        );
      case 'leads':
        return (
          <>
            <th style={{ padding: '16px' }}>Lead ID</th>
            <th style={{ padding: '16px' }}>Student Name</th>
            <th style={{ padding: '16px' }}>Phone</th>
            <th style={{ padding: '16px' }}>Program</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Counselor</th>
          </>
        );
      case 'applications':
        return (
          <>
            <th style={{ padding: '16px' }}>App ID</th>
            <th style={{ padding: '16px' }}>Student Name</th>
            <th style={{ padding: '16px' }}>Course</th>
            <th style={{ padding: '16px' }}>Doc Status</th>
            <th style={{ padding: '16px' }}>Payment Status</th>
            <th style={{ padding: '16px' }}>Stage</th>
          </>
        );
      case 'payments':
        return (
          <>
            <th style={{ padding: '16px' }}>Payment ID</th>
            <th style={{ padding: '16px' }}>Student</th>
            <th style={{ padding: '16px' }}>Amount</th>
            <th style={{ padding: '16px' }}>Method</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Date</th>
          </>
        );
      case 'meetings':
        return (
          <>
            <th style={{ padding: '16px' }}>Meeting ID</th>
            <th style={{ padding: '16px' }}>Title</th>
            <th style={{ padding: '16px' }}>Host</th>
            <th style={{ padding: '16px' }}>Type</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Date</th>
          </>
        );
      case 'tasks':
        return (
          <>
            <th style={{ padding: '16px' }}>Task ID</th>
            <th style={{ padding: '16px' }}>Title</th>
            <th style={{ padding: '16px' }}>Owner</th>
            <th style={{ padding: '16px' }}>Priority</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Due Date</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item: any) => {
    switch (kpiType) {
      case 'calls':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.student}</td>
            <td style={{ padding: '16px' }}>{item.counselor}</td>
            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.duration}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ 
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                backgroundColor: item.outcome === 'Connected' ? '#10b98120' : '#ef444420',
                color: item.outcome === 'Connected' ? '#10b981' : '#ef4444'
              }}>
                {item.outcome}
              </span>
            </td>
            <td style={{ padding: '16px', color: 'var(--text-tertiary)' }}>{new Date(item.date).toLocaleDateString()}</td>
          </>
        );
      case 'leads':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.name}</td>
            <td style={{ padding: '16px' }}>{item.phone}</td>
            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.program}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                {item.status}
              </span>
            </td>
            <td style={{ padding: '16px' }}>{item.counselor}</td>
          </>
        );
      case 'applications':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.studentName}</td>
            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.program}</td>
            <td style={{ padding: '16px' }}>{item.documentStatus}</td>
            <td style={{ padding: '16px' }}>{item.paymentStatus}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                {item.stage}
              </span>
            </td>
          </>
        );
      case 'payments':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.studentName}</td>
            <td style={{ padding: '16px', fontWeight: 'bold' }}>₹{item.amount?.toLocaleString()}</td>
            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.method || 'Credit Card'}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ 
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                backgroundColor: item.status === 'Paid' ? '#10b98120' : '#f59e0b20',
                color: item.status === 'Paid' ? '#10b981' : '#f59e0b'
              }}>
                {item.status}
              </span>
            </td>
            <td style={{ padding: '16px', color: 'var(--text-tertiary)' }}>{new Date(item.date || Date.now()).toLocaleDateString()}</td>
          </>
        );
      case 'meetings':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.title}</td>
            <td style={{ padding: '16px' }}>{item.host}</td>
            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.type}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>
                {item.status}
              </span>
            </td>
            <td style={{ padding: '16px', color: 'var(--text-tertiary)' }}>{new Date(item.date).toLocaleDateString()}</td>
          </>
        );
      case 'tasks':
        return (
          <>
            <td style={{ padding: '16px', fontWeight: 500 }}>{item.id}</td>
            <td style={{ padding: '16px' }}>{item.title}</td>
            <td style={{ padding: '16px' }}>{item.owner}</td>
            <td style={{ padding: '16px' }}>
              <span style={{ color: item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#10b981' }}>
                {item.priority}
              </span>
            </td>
            <td style={{ padding: '16px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#10b98120', color: '#10b981' }}>
                {item.status}
              </span>
            </td>
            <td style={{ padding: '16px', color: 'var(--text-tertiary)' }}>{new Date(item.dueDate).toLocaleDateString()}</td>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}
    >
      
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} className="icon-btn" style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{kpiTitle} Detailed View</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced analytics, history, and records for {kpiTitle}.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input" style={{ paddingLeft: '36px', width: '300px' }}
            />
          </div>
          <button className="secondary-btn" onClick={() => showToast('Filters applied')}><Filter size={16} /> Filters</button>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => showToast('Edit Mode Enabled')}><Edit size={16} /> Edit</button>
          <button className="secondary-btn" onClick={() => showToast('Downloading PDF...')}><Download size={16} /> PDF</button>
          <button className="secondary-btn" onClick={() => showToast('Exporting to Excel...')}><FileSpreadsheet size={16} /> Excel</button>
          <button className="secondary-btn" onClick={() => showToast('Exporting CSV...')}><FileText size={16} /> CSV</button>
          <button className="secondary-btn" onClick={() => window.print()}><Printer size={16} /> Print</button>
          <button className="secondary-btn" onClick={() => showToast('Data Refreshed')}><RefreshCw size={16} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Trend Analysis</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Comparative Performance</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                <Legend />
                <Bar dataKey="value" name="Current Week" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="secondary" name="Previous Week" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold' }}>Data Records ({filteredData.length})</h3>
          </div>
          <div style={{ overflowX: 'auto', flex: 1, maxHeight: '500px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead style={{ background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  {renderTableHeaders()}
                  <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    {renderTableRow(item)}
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button className="icon-btn"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Activity Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                {idx !== 4 && <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: '-20px', width: '2px', background: 'var(--glass-border)' }}></div>}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f620', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>System updated {kpiTitle.toLowerCase()} record</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px' }}>{idx * 2 + 1} hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
