'use client';

import React, { useState } from 'react';
import { useInbox } from '@/contexts/InboxContext';
import { useCRM } from '@/contexts/CRMContext';
import { Phone, Mail, MessageCircle, FileText, CheckSquare, Plus, Edit2, Link as LinkIcon, User, Users, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ContactDetails() {
  const { activeConversationId, conversations } = useInbox();
  const { leads, students, systemUsers } = useCRM();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'media'>('info');

  const activeConv = conversations.find(c => c.id === activeConversationId);

  if (!activeConv) return null;

  // Attempt to find the entity in CRM data
  let entityData: any = null;
  let title = activeConv.entityId;
  let subtitle = '';
  let phone = '';
  let email = '';
  let ownerName = '';

  if (activeConv.entityType === 'lead') {
    entityData = leads.find(l => l.id === activeConv.entityId || l.name === activeConv.entityId);
    if (entityData) {
      title = entityData.name;
      subtitle = 'Lead';
      phone = entityData.phone;
      email = entityData.email;
      ownerName = entityData.ownerId; // Would map to user name ideally
    }
  } else if (activeConv.entityType === 'student') {
    entityData = students.find(s => s.id === activeConv.entityId || s.name === activeConv.entityId);
    if (entityData) {
      title = entityData.name;
      subtitle = 'Student';
      phone = entityData.phone;
      email = entityData.email;
    }
  } else if (activeConv.entityType === 'user') {
    entityData = systemUsers.find(u => u.id === activeConv.entityId || u.name === activeConv.entityId);
    if (entityData) {
      title = entityData.name;
      subtitle = `${entityData.role} • ${entityData.department}`;
      phone = entityData.phone;
      email = entityData.email;
    }
  }

  const navigateToProfile = () => {
    if (!entityData) return;
    if (activeConv.entityType === 'student') router.push(`/students/${entityData.id}`);
    if (activeConv.entityType === 'user') router.push(`/users/${entityData.id}`);
    // Lead could open modal or page depending on implementation
  };

  const getIcon = () => {
    if (activeConv.entityType === 'team') return <Users size={40} />;
    return <User size={40} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          marginBottom: '16px', position: 'relative'
        }}>
          {entityData?.photo ? (
            <img src={entityData.photo} alt={title} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            getIcon()
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{title}</h2>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Edit2 size={14} /></button>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', textTransform: 'capitalize' }}>
          {subtitle || activeConv.entityType}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
          {phone && (
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', cursor: 'pointer' }} title="Call">
              <Phone size={18} />
            </button>
          )}
          {email && (
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', cursor: 'pointer' }} title="Email">
              <Mail size={18} />
            </button>
          )}
          {phone && (
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', cursor: 'pointer' }} title="WhatsApp">
              <MessageCircle size={18} />
            </button>
          )}
          {entityData && (
            <button onClick={navigateToProfile} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Open Profile">
              <LinkIcon size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
        <button 
          onClick={() => setActiveTab('info')}
          style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'info' ? '2px solid var(--brand-primary)' : '2px solid transparent', color: activeTab === 'info' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
        >INFO</button>
        <button 
          onClick={() => setActiveTab('media')}
          style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'media' ? '2px solid var(--brand-primary)' : '2px solid transparent', color: activeTab === 'media' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
        >MEDIA</button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Owner Section */}
            {ownerName && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={12} /></div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{ownerName}</span>
                </div>
              </div>
            )}

            {/* Quick Actions Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer' }}>
                <FileText size={16} /> Add Note
              </button>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer' }}>
                <CheckSquare size={16} /> Create Task
              </button>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer', gridColumn: 'span 2' }}>
                <Plus size={16} /> Add Follow-up
              </button>
            </div>

            {/* Dynamic Entity Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {phone && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{phone}</div>
                </div>
              )}
              {email && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{email}</div>
                </div>
              )}
              
              {/* Lead Specific */}
              {activeConv.entityType === 'lead' && entityData && (
                <>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Stage</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 500 }}>{entityData.stage || 'New'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Source</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{entityData.source || 'Website'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Interested In</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{entityData.interestedIn || 'N/A'}</div>
                  </div>
                </>
              )}

              {/* Student Specific */}
              {activeConv.entityType === 'student' && entityData && (
                <>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Course</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{entityData.course || 'Full Stack Dev'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Batch</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{entityData.batch || 'Upcoming'}</div>
                  </div>
                </>
              )}

              {/* User Specific */}
              {activeConv.entityType === 'user' && entityData && (
                <>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Role</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{entityData.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Department</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{entityData.department}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', gap: '16px' }}>
            <ImageIcon size={48} style={{ opacity: 0.2 }} />
            <p style={{ fontSize: '0.9rem' }}>No media shared yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
