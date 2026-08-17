import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { WorkPipelineListModal } from '../modals/WorkPipelineListModal';
import { ChevronLeft, ChevronRight, Users, Filter, DollarSign, Target } from 'lucide-react';

interface StageBreakdownCardsProps {
    dashboardData: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

const CardInfo = [
    {
        id: 'new',
        title: 'In New Inquiry Lead Stage',
        icon: <Users size={20} color="#6366f1" />,
        iconBg: '#e0e7ff',
        desc: 'All leads new or rechurned as on today, broken down by Lead Source.',
        filterStage: (l: any) => l['Lead Stage'] === 'New Lead',
        groupBy: 'Lead Source'
    },
    {
        id: 'contacted',
        title: 'In Call Attempted Lead Stage',
        icon: <Filter size={20} color="#6366f1" />,
        iconBg: '#e0e7ff',
        desc: 'Leads in prospecting stage where reps are attempting contact, broken down by Priority.',
        filterStage: (l: any) => l['Lead Stage'] === 'Contacted' || l['Lead Stage'] === 'Prospecting',
        groupBy: 'Lead Priority'
    },
    {
        id: 'interested',
        title: 'In Interested Lead Stage',
        icon: <DollarSign size={20} color="#f59e0b" />,
        iconBg: '#fef3c7',
        desc: 'Leads in opportunity stage with active interest, broken down by Product/Service.',
        filterStage: (l: any) => l['Lead Stage'] === 'Opportunity',
        groupBy: 'Product/Service'
    },
    {
        id: 'closed',
        title: 'In Closed Lead Stage',
        icon: <Target size={20} color="#6b7280" />,
        iconBg: '#f3f4f6',
        desc: 'Leads that exited the funnel as on today, broken down by Lead Source.',
        filterStage: (l: any) => l['Lead Stage'] === 'Admitted',
        groupBy: 'Lead Source'
    }
];

const AnyResponsiveContainer = ResponsiveContainer as any;

export function StageBreakdownCards({ dashboardData }: StageBreakdownCardsProps) {
    const [modalConfig, setModalConfig] = useState<{title: string, filterFn: (l: any) => boolean} | null>(null);
    const [pages, setPages] = useState<Record<string, number>>({});

    const handlePage = (cardId: string, dir: number) => {
        setPages(prev => ({ ...prev, [cardId]: Math.max(0, (prev[cardId] || 0) + dir) }));
    };

    const cardsData = useMemo(() => {
        if (!dashboardData || !dashboardData.leads) return CardInfo.map(c => ({ ...c, total: 0, breakdown: [] }));
        
        return CardInfo.map(card => {
            const filtered = dashboardData.leads.filter(card.filterStage);
            const total = filtered.length;
            
            const grouped = filtered.reduce((acc: any, curr: any) => {
                const key = curr[card.groupBy] || 'Unknown';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

            const breakdown = Object.keys(grouped).map((key, index) => ({
                name: key,
                value: grouped[key],
                color: COLORS[index % COLORS.length]
            })).sort((a, b) => b.value - a.value);

            return { ...card, total, breakdown };
        });
    }, [dashboardData]);

    const handleCardClick = (card: any) => {
        setModalConfig({
            title: `Leads: ${card.title}`,
            filterFn: card.filterStage
        });
    };

    const handleSegmentClick = (card: any, segmentName: string) => {
        setModalConfig({
            title: `${card.title} - ${segmentName}`,
            filterFn: (l: any) => card.filterStage(l) && (l[card.groupBy] || 'Unknown') === segmentName
        });
    };

    return (
        <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {cardsData.map((card, idx) => (
                    <div key={card.id} className="glass-panel hover-scale" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '400px', cursor: 'pointer' }} onClick={() => handleCardClick(card)}>
                        
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {card.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    {card.total} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Leads</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{card.title}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, minHeight: 0, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                            {card.total > 0 ? (
                                <AnyResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={card.breakdown}
                                            innerRadius="60%"
                                            outerRadius="85%"
                                            paddingAngle={2}
                                            dataKey="value"
                                            onClick={(data) => handleSegmentClick(card, data.name)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {card.breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#1e293b', fontWeight: 500 }}
                                        />
                                    </PieChart>
                                </AnyResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    No data available
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '16px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: '8px', flex: 1, overflow: 'hidden' }}>
                                    {card.breakdown.slice((pages[card.id] || 0) * 3, ((pages[card.id] || 0) + 1) * 3).map((item: any, i: number) => (
                                        <div key={i} onClick={() => handleSegmentClick(card, item.name)} style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0, cursor: 'pointer' }} className="hover-opacity">
                                            <div style={{ width: '12px', height: '6px', borderRadius: '4px', background: item.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {card.breakdown.length > 3 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', flexShrink: 0, marginLeft: '8px' }}>
                                        <ChevronLeft 
                                            size={14} 
                                            style={{ cursor: (pages[card.id] || 0) > 0 ? 'pointer' : 'default', opacity: (pages[card.id] || 0) > 0 ? 1 : 0.3 }} 
                                            onClick={(e) => { e.stopPropagation(); if((pages[card.id] || 0) > 0) handlePage(card.id, -1); }} 
                                        />
                                        {(pages[card.id] || 0) + 1}/{Math.ceil(card.breakdown.length / 3)}
                                        <ChevronRight 
                                            size={14} 
                                            style={{ cursor: (pages[card.id] || 0) < Math.ceil(card.breakdown.length / 3) - 1 ? 'pointer' : 'default', opacity: (pages[card.id] || 0) < Math.ceil(card.breakdown.length / 3) - 1 ? 1 : 0.3 }} 
                                            onClick={(e) => { e.stopPropagation(); if((pages[card.id] || 0) < Math.ceil(card.breakdown.length / 3) - 1) handlePage(card.id, 1); }} 
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                                {card.desc}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {modalConfig && (
                <WorkPipelineListModal
                    title={modalConfig.title}
                    count={dashboardData.leads.filter(modalConfig.filterFn).length}
                    dashboardData={dashboardData}
                    onClose={() => setModalConfig(null)}
                    filterFn={modalConfig.filterFn}
                />
            )}
        </div>
    );
}
