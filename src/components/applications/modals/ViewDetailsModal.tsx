import React from 'react';
import { X, User, Phone, Mail, GraduationCap, MapPin, Calendar, Clock } from 'lucide-react';
import { Application } from '@/contexts/CRMContext';

interface Props {
  app: Application;
  onClose: () => void;
}

export function ViewDetailsModal({ app, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Application Details
              <span style={{ fontSize: '0.9rem', padding: '4px 12px', background: 'var(--primary-color)', color: 'white', borderRadius: '16px', fontWeight: 600 }}>{app.id}</span>
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left Column - Profile & Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              {app.photo ? (
                <img src={app.photo} alt={app.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px' }} />
              ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 16px' }}>
                  {app.name ? app.name.charAt(0) : '?'}
                </div>
              )}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{app.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.program}</p>
              
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid var(--glass-border)', background: 'white' }}>{app.status}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Assigned Staff</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Counselor:</span>
                  <span style={{ fontWeight: 500 }}>{app.counselor}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Member:</span>
                  <span style={{ fontWeight: 500 }}>{app.member}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Personal Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} color="var(--text-secondary)" /> {app.mobile}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} color="var(--text-secondary)" /> {app.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={16} color="var(--text-secondary)" /> {app.qualification}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="var(--text-secondary)" /> Applied: {new Date(app.date).toLocaleDateString()}</div>
              </div>
            </div>

            {app.parentInfo && (
              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Parent/Guardian Info</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Father's Name:</span> <br/>{app.parentInfo.fatherName}</div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Mother's Name:</span> <br/>{app.parentInfo.motherName}</div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Contact:</span> <br/>{app.parentInfo.parentContact}</div>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Compliance Status</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '0.9rem' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Documents:</span> <br/><strong style={{color: app.documentStatus==='Verified'?'#10b981':'#d97706'}}>{app.documentStatus}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Payment:</span> <br/><strong style={{color: app.paymentStatus==='Paid'?'#10b981':'#d97706'}}>{app.paymentStatus}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Verification:</span> <br/><strong style={{color: app.verificationStatus==='Verified'?'#10b981':'#3b82f6'}}>{app.verificationStatus}</strong></div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Activity Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {app.timeline?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'white', padding: '6px', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                      <Clock size={14} color="var(--primary-color)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.action}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(item.date).toLocaleString()} by {item.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {app.notes && (
              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Notes</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{app.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
