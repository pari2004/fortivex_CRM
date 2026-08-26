import React from 'react';
import { X, Phone, PhoneCall, PhoneOutgoing, PhoneIncoming, Clock, CheckSquare, Building, Users, Activity } from 'lucide-react';

interface Props {
  record: any;
  onClose: () => void;
}

export function ActivityMetricsDetailsModal({ record, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Employee Activity Details
              <span style={{ fontSize: '0.9rem', padding: '4px 12px', background: 'var(--primary-color)', color: 'white', borderRadius: '16px', fontWeight: 600 }}>{record.id}</span>
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* LEFT COLUMN - Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 16px' }}>
                {record.employeeName.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{record.employeeName}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{record.team} Team</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--glass-border)', background: 'white', color: record.performance >= 80 ? '#10b981' : record.performance >= 60 ? '#f59e0b' : '#ef4444' }}>
                  Performance: {record.performance}%
                </span>
              </div>
            </div>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
               <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Summary Info</h4>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Last Updated:</strong> {record.lastUpdated}</p>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}><strong>Active Users Interacted:</strong> {record.activeUsers}</p>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}><strong>Other Activities:</strong> {record.otherActivities}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Stats Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Call Metrics */}
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={18} color="var(--primary-color)"/> Calls Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}><PhoneOutgoing size={14}/> Outgoing Calls:</span> <strong>{record.outgoingCalls}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}><PhoneIncoming size={14}/> Incoming Calls:</span> <strong>{record.incomingCalls}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}><Clock size={14}/> Duration (Out):</span> <strong>{record.callDurationOutgoing}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}><Clock size={14}/> Duration (In):</span> <strong>{record.callDurationIncoming}</strong></div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-secondary)' }}><PhoneCall size={14}/> Average Duration:</span> <strong>{record.averageCallDuration}</strong></div>
              </div>
            </div>

            {/* Tasks Metrics */}
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="#10b981"/> Tasks
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Total Tasks:</span> <br/><strong>{record.totalTasks}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Completed:</span> <br/><strong style={{color: '#10b981'}}>{record.completedTasks}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Pending:</span> <br/><strong style={{color: '#f59e0b'}}>{record.pendingTasks}</strong></div>
              </div>
            </div>

            {/* Deals Metrics */}
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} color="#8b5cf6"/> Deals
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Total Deals:</span> <br/><strong>{record.totalDeals}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Won:</span> <br/><strong style={{color: '#10b981'}}>{record.wonDeals}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Lost:</span> <br/><strong style={{color: '#ef4444'}}>{record.lostDeals}</strong></div>
              </div>
            </div>
            
            {/* Timeline Stub */}
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary-color)"/> Recent Activity Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'white', padding: '6px', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                      <Clock size={14} color="var(--primary-color)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Completed Task for Lead #1024</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Just now</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'white', padding: '6px', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                      <PhoneOutgoing size={14} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Outgoing Call to Jane Doe (12m 30s)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>1 hour ago</div>
                    </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
