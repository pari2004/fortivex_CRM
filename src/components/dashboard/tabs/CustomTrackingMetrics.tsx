import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';

interface CustomTrackingMetricsProps {
    dateFilter: string;
}

export function CustomTrackingMetrics({ dateFilter }: CustomTrackingMetricsProps) {
    const [showUserWise, setShowUserWise] = useState(false);

    const users = ['Pavan SH', 'Thanushree BR', 'Parikshit', 'Spoorthi', 'Yashwanth', 'Abhishek'];

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Custom Tracking Metrics</h3>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>Auto Refreshes every 5 minutes</span>
                    <span style={{ fontSize: '0.8rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>5m change</span>
                </div>
                <button 
                    onClick={() => setShowUserWise(true)}
                    style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    View User Wise
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ padding: '24px', border: '1px solid var(--glass-border)', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>454</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '8px' }}>leads in call back later</span>
                </div>
                <div style={{ padding: '24px', border: '1px solid var(--glass-border)', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>527</span>
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '12px', marginTop: '4px', marginBottom: '4px' }}>+1 5M</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>leads in rnr and not called</span>
                </div>
            </div>

            <AnimatePresence>
                {showUserWise && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-panel"
                            style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Custom Tracking Metrics - User Wise</h3>
                                <button onClick={() => setShowUserWise(false)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
                            </div>
                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {users.map(user => (
                                    <div key={user} style={{ padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{user.charAt(0)}</div>
                                            <span style={{ fontWeight: 600 }}>{user}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>{Math.floor(Math.random() * 100)}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Call Back Later</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>{Math.floor(Math.random() * 100)}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>RNR & Not Called</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
