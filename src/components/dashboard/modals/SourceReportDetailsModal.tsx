'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Search, Filter, Download, Printer, Activity, Target, IndianRupee, Globe, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export interface SourceData {
  id: string;
  source: string;
  leads: number;
  applications: number;
  admissions: number;
  renewals?: number;
  revenue: number;
  convRate: string;
  marketingCost: number;
  costPerLead: string;
  manager: string;
  status: string;
  campaign?: string;
  studentName?: string;
  email?: string;
  mobileNumber?: string;
  employee?: string;
}

interface Props {
  sourceData: SourceData;
  onClose: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SourceReportDetailsModal({ sourceData, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Leads' | 'Admissions' | 'Campaigns'>('Overview');
  // Simple mock data for charts inside the modal
  const pieData = [
    { name: 'Admitted', value: sourceData.admissions },
    { name: 'Pending', value: sourceData.applications - sourceData.admissions },
    { name: 'Lost', value: sourceData.leads - sourceData.applications }
  ];

  const timelineData = [
    { id: 1, action: 'Campaign "Summer Boost" Launched', date: '2 days ago', status: 'Active' },
    { id: 2, action: 'Budget increased by 20%', date: '5 days ago', status: 'Completed' },
    { id: 3, action: 'A/B Testing Started for creatives', date: '1 week ago', status: 'Completed' },
  ];

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sourceData.source} Overview</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Detailed analytics and campaign performance</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setActiveTab('Overview')} className="secondary-btn" style={{ padding: '8px 16px', background: activeTab === 'Overview' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'Overview' ? 'white' : 'var(--text-primary)' }}>Overview</button>
            <button onClick={() => setActiveTab('Leads')} className="secondary-btn" style={{ padding: '8px 16px', background: activeTab === 'Leads' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'Leads' ? 'white' : 'var(--text-primary)' }}>Leads</button>
            <button onClick={() => setActiveTab('Admissions')} className="secondary-btn" style={{ padding: '8px 16px', background: activeTab === 'Admissions' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'Admissions' ? 'white' : 'var(--text-primary)' }}>Admissions</button>
            <button onClick={() => setActiveTab('Campaigns')} className="secondary-btn" style={{ padding: '8px 16px', background: activeTab === 'Campaigns' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'Campaigns' ? 'white' : 'var(--text-primary)' }}>Campaigns</button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Download size={16} /></button>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Printer size={16} /></button>
          </div>
        </div>

        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* LEFT COL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {sourceData.source.toLowerCase() === 'instagram' && (
              <div style={{ padding: '24px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderRadius: '12px', color: 'white' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Instagram Influencer & Ads Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                  <div><div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Reels Reach</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>1.4M</div></div>
                  <div><div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Profile Visits</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>45K</div></div>
                  <div><div style={{ fontSize: '0.85rem', opacity: 0.8 }}>DM Inquiries</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>1,240</div></div>
                  <div><div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Stories Swipe-Ups</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>3,890</div></div>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', opacity: 0.9 }}>* Influencer "Student Life" campaign generated 40% of all Instagram leads this month.</p>
              </div>
            )}

            {sourceData.source.toLowerCase() === 'email campaign' && (
              <div style={{ padding: '24px', background: '#8b5cf610', border: '1px solid #8b5cf630', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#8b5cf6', marginBottom: '16px' }}>Email Marketing Breakdown</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ paddingBottom: '8px' }}>Email Batch</th>
                      <th style={{ paddingBottom: '8px' }}>Sent</th>
                      <th style={{ paddingBottom: '8px' }}>Open Rate</th>
                      <th style={{ paddingBottom: '8px' }}>CTR</th>
                      <th style={{ paddingBottom: '8px' }}>Leads Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0' }}>Newsletter Aug 2026</td><td>45,000</td><td>24.5%</td><td>4.2%</td><td>890</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0' }}>Re-engagement Batch 1</td><td>12,000</td><td>18.1%</td><td>2.8%</td><td>410</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0' }}>Early Bird Offer</td><td>25,000</td><td>32.0%</td><td>6.5%</td><td>560</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

              <div className="glass-panel" style={{ padding: '20px' }}>
                 <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Performance Snapshot</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Leads Generated</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sourceData.leads.toLocaleString()}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Admissions</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{sourceData.admissions.toLocaleString()}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Revenue Generated</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>₹{sourceData.revenue.toLocaleString()}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Marketing Spend</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>₹{sourceData.marketingCost.toLocaleString()}</div>
                   </div>
                 </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Lead Status Distribution</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT COL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {sourceData.source.toLowerCase() === 'youtube' && (
              <div style={{ padding: '24px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ef4444', marginBottom: '16px' }}>YouTube Performance Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Leads</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>1,950</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Applications</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>420</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admissions</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>210</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Renewals</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>48</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Conv. Rate</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>10.8%</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Marketing Cost</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹3.6 Lakhs</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CPL</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹262</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Revenue</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹98 Lakhs</div></div>
                  <div><div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ROI</div><div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#10b981' }}>27.2x</div></div>
                </div>
              </div>
            )}

            {sourceData.source.toLowerCase() === 'facebook' && (
              <div style={{ padding: '24px', background: '#3b82f610', border: '1px solid #3b82f630', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#3b82f6', marginBottom: '16px' }}>Facebook Campaign Performance</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ paddingBottom: '8px' }}>Campaign</th>
                      <th style={{ paddingBottom: '8px' }}>Leads</th>
                      <th style={{ paddingBottom: '8px' }}>Admissions</th>
                      <th style={{ paddingBottom: '8px' }}>Revenue</th>
                      <th style={{ paddingBottom: '8px' }}>Marketing Cost</th>
                      <th style={{ paddingBottom: '8px' }}>Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0' }}>Facebook Campaign A</td><td>820</td><td>115</td><td>₹32 Lakhs</td><td>₹2.8 Lakhs</td><td>14.0%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 0' }}>Facebook Campaign B</td><td>640</td><td>90</td><td>₹26 Lakhs</td><td>₹2.1 Lakhs</td><td>14.0%</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0' }}>Facebook Campaign C</td><td>520</td><td>75</td><td>₹24 Lakhs</td><td>₹1.84 Lakhs</td><td>14.4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

              <div className="glass-panel" style={{ padding: '20px' }}>
                 <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>ROI & Economics</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cost Per Lead (CPL)</span>
                      <span style={{ fontWeight: 'bold' }}>₹{sourceData.costPerLead}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cost Per Acquisition (CPA)</span>
                      <span style={{ fontWeight: 'bold' }}>₹{(sourceData.marketingCost / (sourceData.admissions || 1)).toFixed(2)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Return on Investment (ROI)</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>{(((sourceData.revenue - sourceData.marketingCost) / (sourceData.marketingCost || 1)) * 100).toFixed(1)}%</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Assigned Manager</span>
                      <span style={{ fontWeight: 'bold' }}>{sourceData.manager}</span>
                   </div>
                 </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
                 <h3 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Activity Timeline</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {timelineData.map(item => (
                     <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'var(--primary-color)', padding: '6px', borderRadius: '50%', color: 'white' }}>
                          <Activity size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.action}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.date}</span>
                            <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: item.status === 'Completed' ? '#10b98120' : '#3b82f620', color: item.status === 'Completed' ? '#10b981' : '#3b82f6', borderRadius: '12px' }}>{item.status}</span>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'Leads' && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Lead Name</th>
                  <th style={{ padding: '12px' }}>Lead ID</th>
                  <th style={{ padding: '12px' }}>Source</th>
                  <th style={{ padding: '12px' }}>Campaign</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Assigned Employee</th>
                  <th style={{ padding: '12px' }}>Created Date</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px' }}>Aarav Patel</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>#LD-2841</td>
                  <td style={{ padding: '12px' }}>{sourceData.source}</td>
                  <td style={{ padding: '12px' }}>Summer 2026 Boost</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#10b981', background: '#10b98120', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Hot</span></td>
                  <td style={{ padding: '12px' }}>Neha Sharma</td>
                  <td style={{ padding: '12px' }}>Aug 10, 2026</td>
                  <td style={{ padding: '12px' }}>+91 98765 43210</td>
                  <td style={{ padding: '12px' }}>aarav.p@email.com</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px' }}>Riya Gupta</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>#LD-2842</td>
                  <td style={{ padding: '12px' }}>{sourceData.source}</td>
                  <td style={{ padding: '12px' }}>Summer 2026 Boost</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#f59e0b', background: '#f59e0b20', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Warm</span></td>
                  <td style={{ padding: '12px' }}>Amit Kumar</td>
                  <td style={{ padding: '12px' }}>Aug 09, 2026</td>
                  <td style={{ padding: '12px' }}>+91 91234 56789</td>
                  <td style={{ padding: '12px' }}>riya.g@email.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Admissions' && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Student Name</th>
                  <th style={{ padding: '12px' }}>Application ID</th>
                  <th style={{ padding: '12px' }}>Admission ID</th>
                  <th style={{ padding: '12px' }}>Course</th>
                  <th style={{ padding: '12px' }}>Admission Date</th>
                  <th style={{ padding: '12px' }}>Assigned Counselor</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>Riya Gupta</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>APP-2026-921</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>ADM-2026-302</td>
                  <td style={{ padding: '12px' }}>B.Tech Computer Science</td>
                  <td style={{ padding: '12px' }}>Aug 08, 2026</td>
                  <td style={{ padding: '12px' }}>Amit Kumar</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#3b82f6', background: '#3b82f620', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Enrolled</span></td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>₹2,40,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Campaigns' && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px' }}>Campaign Name</th>
                  <th style={{ padding: '12px' }}>Campaign ID</th>
                  <th style={{ padding: '12px' }}>Leads</th>
                  <th style={{ padding: '12px' }}>Applications</th>
                  <th style={{ padding: '12px' }}>Admissions</th>
                  <th style={{ padding: '12px' }}>Marketing Spend</th>
                  <th style={{ padding: '12px' }}>Revenue</th>
                  <th style={{ padding: '12px' }}>Conv. Rate</th>
                  <th style={{ padding: '12px' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{sourceData.source} Fall Intake Boost</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>CMP-08-26</td>
                  <td style={{ padding: '12px' }}>850</td>
                  <td style={{ padding: '12px' }}>190</td>
                  <td style={{ padding: '12px' }}>110</td>
                  <td style={{ padding: '12px' }}>₹1.2 Lakhs</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>₹24.5 Lakhs</td>
                  <td style={{ padding: '12px' }}>12.9%</td>
                  <td style={{ padding: '12px', color: '#3b82f6' }}>20.4x</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
