import React, { useState, useMemo } from 'react';
import { PhoneCall } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

interface CallingTrendChartProps {
    dateFilter: string;
}

export function CallingTrendChart({ dateFilter }: CallingTrendChartProps) {
    const [activeTrendDate, setActiveTrendDate] = useState('30 Days');
    const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

    const toggleSeries = (dataKey: string) => {
        setHiddenSeries(prev => prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]);
    };

    const data = useMemo(() => {
        if (activeTrendDate === 'Today') {
            return [
                { time: '10:00', connected: 15, unconnected: 25, prev: 30 },
                { time: '11:00', connected: 20, unconnected: 60, prev: 95 },
                { time: '12:00', connected: 25, unconnected: 55, prev: 100 },
                { time: '13:00', connected: 15, unconnected: 45, prev: 35 },
                { time: '14:00', connected: 20, unconnected: 50, prev: 90 },
                { time: '15:00', connected: 30, unconnected: 60, prev: 155 },
                { time: '16:00', connected: 20, unconnected: 35, prev: 70 },
                { time: '17:00', connected: 5, unconnected: 10, prev: 110 }
            ];
        } else if (activeTrendDate === 'Last 7 Days') {
             return Array.from({ length: 7 }).map((_, i) => ({
                time: `Day ${i + 1}`, connected: 50 + Math.random()*50, unconnected: 100 + Math.random()*100, prev: 150 + Math.random()*100
            }));
        } else {
            return Array.from({ length: 30 }).map((_, i) => ({
                time: `Aug ${i + 1}`, connected: 50 + Math.random()*50, unconnected: 100 + Math.random()*100, prev: 150 + Math.random()*100
            }));
        }
    }, [activeTrendDate]);

    const renderCustomLegend = () => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: hiddenSeries.includes('connected') ? 0.5 : 1 }}
                onClick={() => toggleSeries('connected')}
            >
                <div style={{ width: '16px', height: '16px', background: '#831843', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.85rem' }}>Connected Calls</span>
            </div>
            <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: hiddenSeries.includes('unconnected') ? 0.5 : 1 }}
                onClick={() => toggleSeries('unconnected')}
            >
                <div style={{ width: '16px', height: '16px', background: '#fce7f3', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.85rem' }}>Unconnected Calls</span>
            </div>
            <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: hiddenSeries.includes('prev') ? 0.5 : 1 }}
                onClick={() => toggleSeries('prev')}
            >
                <div style={{ width: '16px', height: '0', borderTop: '2px dashed #9ca3af' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9ca3af', marginLeft: '-12px' }} />
                <span style={{ fontSize: '0.85rem' }}>Previous Period</span>
            </div>
        </div>
    );

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <PhoneCall size={18} color="#4f46e5" /> Calling Trend Hourly Today
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 600 }}>Pickup: 32%</span>
                        <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '12px', fontWeight: 600 }}>+3pp</span>
                    </div>
                </div>
                <select 
                    value={activeTrendDate} 
                    onChange={e => setActiveTrendDate(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                >
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="30 Days">Last 30 Days</option>
                    <option value="Custom Range">Custom Range</option>
                </select>
            </div>
            {renderCustomLegend()}
            <div style={{ flex: 1, width: '100%', minHeight: 0, marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                        
                        {!hiddenSeries.includes('connected') && <Bar dataKey="connected" stackId="a" fill="#831843" barSize={20} />}
                        {!hiddenSeries.includes('unconnected') && <Bar dataKey="unconnected" stackId="a" fill="#fce7f3" barSize={20} />}
                        {!hiddenSeries.includes('prev') && <Line type="monotone" dataKey="prev" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
