import React from 'react';
import { Target } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface LeadSourceDistributionProps {
  dashboardData?: any;
    dateFilter: string;
}

export function LeadSourceDistribution({ dateFilter }: LeadSourceDistributionProps) {
    const data = [
        { name: 'New', value: 400, color: '#8b5cf6' },
        { name: 'Prospecting', value: 300, color: '#3b82f6' },
        { name: 'Opportunity', value: 150, color: '#10b981' },
        { name: 'Closed', value: 50, color: '#9ca3af' }
    ];

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Where leads came from</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button style={{ background: '#f3e8ff', color: '#9333ea', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>View Detailed</button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dateFilter === 'Today' ? 'Today' : dateFilter}</span>
                </div>
            </div>
            
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '8px' }}>
                0
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Empty state per reference image for 0 leads today, or chart if data exists */}
                {dateFilter === 'Today' ? (
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No leads today</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                {data.map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} />
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
