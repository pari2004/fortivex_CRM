import React, { useState, useMemo } from 'react';
import { WorkPipelineListModal } from '../modals/WorkPipelineListModal';

interface UserLeadAssignmentProps {
    dateFilter: string;
    dashboardData?: any;
}

export function UserLeadAssignment({ dateFilter, dashboardData }: UserLeadAssignmentProps) {
    const usersList = ['Thanushree BR', 'Parikshit', 'Abhishek', 'Pavan SH', 'Spoorthi', 'Yashwanth', 'Padmesh'];

    const userStats = useMemo(() => {
        const stats = usersList.map(name => ({ name, count: 0, percentage: 0 }));
        let totalAssigned = 0;
        
        if (dashboardData && dashboardData.leads) {
            dashboardData.leads.forEach((l: any) => {
                if (l.assignedTo) {
                    const user = stats.find(s => s.name === l.assignedTo);
                    if (user) {
                        user.count++;
                        totalAssigned++;
                    }
                }
            });
        }
        
        stats.forEach(s => {
            s.percentage = totalAssigned > 0 ? (s.count / totalAssigned) * 100 : 0;
        });
        
        return { stats, totalAssigned };
    }, [dashboardData]);

    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Who got them <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userStats.totalAssigned}</span>
                    </h3>
                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{userStats.stats.filter(s => s.count === 0).length} need rebalancing</span>
                    <button style={{ background: '#f3e8ff', color: '#9333ea', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Assign More Leads</button>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Assigned this period in brackets</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
                {userStats.stats.map(user => (
                    <div key={user.name} onClick={() => setSelectedUser(user.name)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} className="hover-opacity">
                        <div style={{ width: '120px', fontSize: '0.85rem', fontWeight: 500, display: 'flex', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.name} <span style={{ color: 'var(--text-secondary)' }}>👥</span>
                        </div>
                        <div style={{ flex: 1, height: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ width: `${Math.min(user.percentage, 100)}%`, height: '100%', background: '#8b5cf6', borderRadius: '8px' }} />
                        </div>
                        <div style={{ width: '30px', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'right' }}>{user.count}</div>
                        <div style={{ width: '80px', fontSize: '0.8rem', color: user.count === 0 ? '#ef4444' : '#3b82f6', fontWeight: 600 }}>{user.count === 0 ? 'Needs leads' : 'Active'}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Team active: {userStats.stats.filter(s => s.count > 0).length}</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                        { name: 'New', color: '#8b5cf6' },
                        { name: 'Prospecting', color: '#3b82f6' },
                        { name: 'Opportunity', color: '#10b981' },
                        { name: 'Closed', color: '#9ca3af' }
                    ].map(item => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} />
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
            
            {selectedUser && (
                <WorkPipelineListModal 
                    title={`Assigned to: ${selectedUser}`}
                    count={userStats.stats.find(s => s.name === selectedUser)?.count || 0}
                    dashboardData={dashboardData}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}
