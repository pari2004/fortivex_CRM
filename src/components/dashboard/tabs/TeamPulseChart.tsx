import React, { useState } from 'react';
import { Activity, Expand, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamPulseChartProps {
  dashboardData?: any;
    dateFilter: string;
}

const pulseData = [
    { time: '8a', today: 0, prev: 0 },
    { time: '9a', today: 50, prev: 40 },
    { time: '10a', today: 200, prev: 250 },
    { time: '11a', today: 450, prev: 600 },
    { time: '12p', today: 700, prev: 850 },
    { time: '1p', today: 747, prev: 1100 },
    { time: '2p', today: 747, prev: 1400 },
    { time: '3p', today: 747, prev: 1600 },
    { time: '4p', today: 747, prev: 1750 },
    { time: '5p', today: 747, prev: 2200 },
    { time: '6p', today: 747, prev: 2800 },
    { time: '7p', today: 747, prev: 2950 },
    { time: '8p', today: 747, prev: 2950 },
];

export function TeamPulseChart({ dateFilter }: TeamPulseChartProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [compareWith, setCompareWith] = useState('Last Thursday');

    const renderContent = (isExpanded: boolean) => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexShrink: 0 }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Activity size={18} color="#8b5cf6" /> Team pulse today
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>747</span>
                        <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '12px', fontWeight: 600, fontSize: '0.8rem' }}>Behind pace</span>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>-41%</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}/> Today</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9ca3af' }}/> {compareWith}</div>
                    </div>
                    <select 
                        value={compareWith} 
                        onChange={e => setCompareWith(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.85rem', outline: 'none' }}
                    >
                        <option value="Last Thursday">vs Last Thursday</option>
                        <option value="Yesterday">vs Yesterday</option>
                    </select>
                    {!isExpanded && (
                        <button onClick={() => setIsFullScreen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Expand size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0, overflow: 'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pulseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="today" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorToday)" />
                        <Area type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--glass-border)', marginTop: '12px', paddingTop: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Calls</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>261</div>
                    <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, minHeight: '18px' }}>-64%</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Conversations</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>4</div>
                    <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, minHeight: '18px' }}>same</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Deals Won</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>0</div>
                    <div style={{ fontSize: '0.85rem', minHeight: '18px' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '400px' }}>
                {renderContent(false)}
            </div>

            <AnimatePresence>
                {isFullScreen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel"
                            style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
                        >
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setIsFullScreen(false)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ padding: '40px', flex: 1, minHeight: 0 }}>
                                {renderContent(true)}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
