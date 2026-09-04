'use client';

import React, { useState } from 'react';
import { Student, StudentActivity } from '@/contexts/CRMContext';
import { 
  X, PhoneCall, MessageCircle, Mail, Edit, Calendar, User, 
  MapPin, CheckCircle, FileText, Briefcase, Award, TrendingUp, 
  ChevronRight, Filter, ChevronDown
} from 'lucide-react';
import { ActionMenu } from '@/components/common/ActionMenu';
import { useInbox } from '@/contexts/InboxContext';

interface Props {
  student: Student;
  onClose: () => void;
  onNavigateToLead?: (leadId: string) => void;
}

export function Student360View({ student, onClose, onNavigateToLead }: Props) {
  const { openSharedInbox } = useInbox();
  const [activeTab, setActiveTab] = useState('Interactions');
  const [filter, setFilter] = useState('All');

  const tabs = ['Overview', 'Interactions', 'Tasks', 'Payments', 'Documents', 'Attendance', 'Assessments', 'Internship', 'Placement', 'Certificates'];
  const filters = ['All', 'Important', 'Calls', 'Notes', 'Emails', 'WhatsApp', 'Visits', 'Tasks', 'Payments', 'Assessments', 'Attendance', 'Documents'];

  const filteredActivities = (student.activities || []).filter(act => {
    if (filter === 'All') return true;
    if (filter === 'Important') return ['Payment', 'Admission', 'Assessment', 'Internship', 'Certificate'].includes(act.type);
    if (filter === 'Calls') return act.type === 'Call';
    if (filter === 'Notes') return act.type === 'Note';
    if (filter === 'Emails') return act.type === 'Email';
    if (filter === 'WhatsApp') return act.type === 'WhatsApp';
    if (filter === 'Payments') return act.type === 'Payment';
    if (filter === 'Assessments') return act.type === 'Assessment';
    if (filter === 'Attendance') return act.type === 'Attendance';
    return act.type === filter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Call': return <PhoneCall size={16} color="#3b82f6" />;
      case 'Email': return <Mail size={16} color="#6366f1" />;
      case 'WhatsApp': return <MessageCircle size={16} color="#22c55e" />;
      case 'Payment': return <TrendingUp size={16} color="#10b981" />;
      case 'Admission': return <User size={16} color="#8b5cf6" />;
      case 'Assessment': return <FileText size={16} color="#eab308" />;
      case 'Internship': return <Briefcase size={16} color="#0ea5e9" />;
      case 'Certificate': return <Award size={16} color="#f59e0b" />;
      default: return <Calendar size={16} color="#64748b" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#dcfce7';
      case 'Placed': return '#dcfce7';
      case 'Alumni': return '#f3e8ff';
      case 'Internship': return '#e0f2fe';
      default: return '#f1f5f9';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Active': return '#16a34a';
      case 'Placed': return '#16a34a';
      case 'Alumni': return '#9333ea';
      case 'Internship': return '#0284c7';
      default: return '#475569';
    }
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-secondary)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'white', borderBottom: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-tertiary)' }} onClick={onClose}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>All Students</span>
            <ChevronRight size={16} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{student.name}</h1>
          <span style={{ background: getStatusColor(student.status), color: getStatusTextColor(student.status), padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{student.status}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {student.leadId && (
            <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Origin: </span>
              <span style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }} onClick={() => onNavigateToLead?.(student.leadId!)}>{student.leadName || student.leadId}</span>
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <ActionMenu 
              items={[
                { label: 'Edit Profile', icon: <Edit size={16} />, onClick: () => {} },
                { label: 'Call', icon: <PhoneCall size={16} />, onClick: () => {} },
                { label: 'WhatsApp', icon: <MessageCircle size={16} />, onClick: () => openSharedInbox({ entityType: 'student', entityId: student.id }) },
                { label: 'Email', icon: <Mail size={16} />, onClick: () => {} },
                { label: 'Add Follow-up', icon: <Calendar size={16} />, onClick: () => {} }
              ]}
            />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={24} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Profile Sidebar */}
        <div style={{ width: '320px', background: 'white', borderRight: '1px solid var(--border-color)', overflowY: 'auto', padding: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
            <img src={student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} alt={student.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '4px solid #f1f5f9' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>{student.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{student.id}</div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Mentor: {student.mentor}</div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Call">
                <PhoneCall size={16} />
              </button>
              <button onClick={() => openSharedInbox({ entityType: 'student', entityId: student.id })} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="WhatsApp">
                <MessageCircle size={16} />
              </button>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Email">
                <Mail size={16} />
              </button>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Add Follow-up">
                <Calendar size={16} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Contact Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <PhoneCall size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{student.phone}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Mobile</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{student.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Personal</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{student.city}, {student.state}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{student.address || 'Location'}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Academy Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Attendance</span>
                  <span style={{ fontWeight: 600 }}>{student.attendance}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${student.attendance}%`, height: '100%', background: student.attendance > 75 ? '#10b981' : '#f59e0b' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Assignments ({student.assignmentsCompleted}/{student.assignmentsTotal})</span>
                  <span style={{ fontWeight: 600 }}>{Math.round((student.assignmentsCompleted||0)/(student.assignmentsTotal||1)*100)}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${((student.assignmentsCompleted||0)/(student.assignmentsTotal||1))*100}%`, height: '100%', background: '#3b82f6' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Assessments Avg</span>
                  <span style={{ fontWeight: 600 }}>{student.assessmentsAvg}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${student.assessmentsAvg}%`, height: '100%', background: '#8b5cf6' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>More On This Student</div>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>MODIFY</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><span style={{ color: 'var(--text-tertiary)' }}>Course</span> <span style={{ fontWeight: 500 }}>{student.program}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><span style={{ color: 'var(--text-tertiary)' }}>Batch</span> <span style={{ fontWeight: 500 }}>{student.batch}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><span style={{ color: 'var(--text-tertiary)' }}>Qualification</span> <span style={{ fontWeight: 500 }}>{student.qualification}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><span style={{ color: 'var(--text-tertiary)' }}>Graduation</span> <span style={{ fontWeight: 500 }}>{student.graduationYear}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><span style={{ color: 'var(--text-tertiary)' }}>Placement</span> <span style={{ fontWeight: 500 }}>{student.placementStatus}</span></div>
            </div>
          </div>

        </div>

        {/* Center Panel (Timeline / Tabs) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa', borderRight: '1px solid var(--border-color)', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '16px 24px', 
                  background: 'none', 
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {activeTab === 'Interactions' && (
              <div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
                  {filters.map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{ 
                        padding: '6px 16px', 
                        borderRadius: '16px', 
                        border: '1px solid',
                        borderColor: filter === f ? 'var(--primary-color)' : 'var(--border-color)',
                        background: filter === f ? 'var(--primary-color)' : 'white',
                        color: filter === f ? 'white' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: filter === f ? 600 : 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {filteredActivities.length > 0 ? filteredActivities.map(act => (
                    <div key={act.id} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{act.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(act.date).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{act.description}</p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>by {act.user}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No activities match the current filter.</div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab !== 'Interactions' && (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-tertiary)' }}>
                <Calendar size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                <h3>{activeTab} view coming soon</h3>
                <p>This module connects to the unified CRM data.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel (Alerts & Next Steps) */}
        <div style={{ width: '300px', background: 'white', overflowY: 'auto', padding: '24px' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>Next Follow-up</h3>
            {student.nextFollowUp ? (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', marginBottom: '4px' }}>Student Progress Review</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Tomorrow • 10:00 AM</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Status: <span style={{ color: '#000', fontWeight: 500 }}>Open</span></span>
                  <span style={{ color: 'var(--text-tertiary)' }}>By: <span style={{ color: '#000', fontWeight: 500 }}>{student.mentor}</span></span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No upcoming follow-ups</div>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>Financial Info</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Total Fee</span>
                <span style={{ fontWeight: 600 }}>₹{student.totalFee.toLocaleString()}</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem' }}>Paid</span>
                <span style={{ fontWeight: 600 }}>₹{student.paidAmount.toLocaleString()}</span>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem' }}>Pending</span>
                <span style={{ fontWeight: 600 }}>₹{(student.totalFee - student.paidAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>Student Journey</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }} />
              
              {[
                { label: 'Admission', status: 'done' },
                { label: 'Batch Allocation', status: 'done' },
                { label: 'Learning', status: student.attendance > 0 ? 'current' : 'pending' },
                { label: 'Assessments', status: student.assessmentsAvg && student.assessmentsAvg > 0 ? 'current' : 'pending' },
                { label: 'Internship', status: student.internshipStatus === 'Ongoing' ? 'current' : student.internshipStatus === 'Completed' ? 'done' : 'pending' },
                { label: 'Certificate', status: student.certificateStatus === 'Issued' ? 'done' : 'pending' },
                { label: 'Placement', status: student.placementStatus === 'Placed' ? 'done' : student.placementStatus === 'Interviewing' ? 'current' : 'pending' },
              ].map((stage, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: stage.status === 'done' ? '#10b981' : stage.status === 'current' ? '#3b82f6' : 'white', border: `2px solid ${stage.status === 'pending' ? '#cbd5e1' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stage.status === 'done' && <CheckCircle size={14} color="white" />}
                    {stage.status === 'current' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: stage.status === 'current' ? 600 : 400, color: stage.status === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                    {stage.label} {stage.status === 'current' && <span style={{ fontSize: '0.75rem', color: '#3b82f6', marginLeft: '8px' }}>→ Current</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
