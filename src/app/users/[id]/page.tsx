'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, Mail, Phone, MapPin, Calendar, BookOpen, 
  GraduationCap, TrendingUp, IndianRupee, FileText, 
  Edit3, CheckCircle, Clock, Download, Award, Shield, Briefcase, 
  MoreHorizontal, ChevronLeft, Activity, ListTodo, Users, Briefcase as DealsIcon, ShieldCheck, MessageCircle
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';
import { ActionMenu } from '@/components/common/ActionMenu';
import { useInbox } from '@/contexts/InboxContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { User } from '@/lib/data/systemData';
import { SlidePanel } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumCard } from '@/components/common/PremiumForm';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { openSharedInbox } = useInbox();
  const crm = useCRM();
  
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (crm.systemUsers) {
      const foundUser = crm.systemUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setFormData(foundUser);
      }
    }
  }, [crm.systemUsers, userId]);

  if (!user) return <div style={{ padding: '24px' }}>Loading...</div>;

  const tabs = ['Overview', 'Activities', 'Tasks', 'Leads', 'Opportunities', 'Payments', 'Students', 'Documents', 'Permissions'];

  // Derived Data Connections
  const userLeads = crm.leads.filter(l => l.owner === user.name);
  const userTasks = crm.tasks.filter(t => t.assignedTo === user.name);
  const userOpportunities = crm.deals.filter(d => d.owner === user.name);
  
  // Create mock activity timeline based on leads and tasks
  const activities = [
    ...userLeads.map((l, i) => ({
      id: `act-l-${i}`, type: 'lead_assigned', title: 'Lead assigned', desc: `${l.name} was assigned to ${user.name}`, date: l.lastContact, icon: <UserIcon size={16}/>
    })),
    ...userTasks.map((t, i) => ({
      id: `act-t-${i}`, type: 'task', title: 'Task created', desc: t.title, date: t.dueDate, icon: <ListTodo size={16}/>
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const nextFollowUp = userTasks.filter(t => t.status !== 'Completed')[0];

  const handleSave = () => {
    const updated = { ...user, ...formData } as User;
    if (crm.updateSystemUser) crm.updateSystemUser(updated);
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/users')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={24} /> Users
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            {user.name} <StatusBadge status={user.status} type="pipeline" />
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>{user.role}</span>
            <span style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>{user.department}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setActiveMenuId(activeMenuId === 'header' ? null : 'header')} style={{ padding: '8px' }}><MoreHorizontal size={20}/></button>
            <ActionMenu isOpen={activeMenuId === 'header'} onClose={() => setActiveMenuId(null)} items={[
              { label: 'Edit User', icon: <Edit3 size={16}/>, onClick: () => setIsEditModalOpen(true) },
              { label: 'Assign Leads', icon: <Users size={16}/>, onClick: () => {} },
              { label: 'Deactivate User', icon: <UserIcon size={16}/>, onClick: () => {} }
            ]} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px' }}>
        
        {/* Left Column: User Profile Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img src={user.photo} alt={user.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>{user.id}</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', marginBottom: '24px' }}>
              <button className="primary-btn" style={{ padding: '8px' }}><Phone size={16} /> Call</button>
              <button onClick={() => openSharedInbox({ entityType: 'user', entityId: user.id })} className="primary-btn" style={{ padding: '8px', background: '#25D366' }}><MessageCircle size={16} /> WhatsApp</button>
              <button className="secondary-btn" style={{ padding: '8px' }}><Mail size={16} /> Email</button>
              <button className="secondary-btn" style={{ padding: '8px' }}><ListTodo size={16} /> Task</button>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>Contact Details</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Phone size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.phone}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Mail size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><MapPin size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Bengaluru, India</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Calendar size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Joined {new Date(user.createdDate).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Clock size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Last Active: {new Date(user.lastLogin).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="#8b5cf6" /> User Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Role</span>
                <span style={{ fontWeight: 500 }}>{user.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Department</span>
                <span style={{ fontWeight: 500 }}>{user.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Permission Level</span>
                <span style={{ fontWeight: 500 }}>Administrator</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Team</span>
                <span style={{ fontWeight: 500 }}>Technology</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                  border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {activeTab === 'Overview' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Assigned Leads</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{userLeads.length}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Open Tasks</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{userTasks.length}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Opportunities</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{userOpportunities.length}</div>
                    </div>
                  </div>
                  
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Recent Activity Timeline</h3>
                    {activities.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activities.map((act) => (
                          <div key={act.id} style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {act.icon}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{act.title}</div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{act.desc}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{new Date(act.date).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent activities found.</div>
                    )}
                  </div>
                </>
              )}
              {activeTab === 'Leads' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Assigned Leads</h3>
                  {userLeads.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Name</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Next Follow-up</th></tr></thead>
                      <tbody>{userLeads.map(l => <tr key={l.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{l.name}</td><td style={{ padding: '12px' }}><StatusBadge status={l.status} type="pipeline"/></td><td style={{ padding: '12px' }}>{l.nextFollowUp || '-'}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads assigned.<br/><br/><button className="primary-btn">+ Assign Lead</button></div>}
                </div>
              )}
              {activeTab === 'Tasks' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Assigned Tasks</h3>
                  {userTasks.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Task</th><th style={{ padding: '12px' }}>Due Date</th><th style={{ padding: '12px' }}>Status</th></tr></thead>
                      <tbody>{userTasks.map(t => <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{t.title}</td><td style={{ padding: '12px' }}>{new Date(t.dueDate).toLocaleDateString()}</td><td style={{ padding: '12px' }}>{t.status}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No tasks assigned.<br/><br/><button className="primary-btn">+ Add Task</button></div>}
                </div>
              )}
              {activeTab === 'Opportunities' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Opportunities</h3>
                  {userOpportunities.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Deal Name</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Stage</th></tr></thead>
                      <tbody>{userOpportunities.map(o => <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{o.name}</td><td style={{ padding: '12px' }}>{o.amount}</td><td style={{ padding: '12px' }}>{o.stage}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No opportunities assigned.</div>}
                </div>
              )}
              {activeTab === 'Permissions' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} color="#10b981"/> Access Permissions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {['Lead Management', 'Opportunity Management', 'Payment Management', 'Student Management', 'Task Management', 'Reports'].map((perm, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                        <span style={{ fontWeight: 500 }}>{perm}</span>
                        <span style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>Allowed</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                      <span style={{ fontWeight: 500 }}>Settings & Configuration</span>
                      <span style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>Restricted</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'Payments' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Payments Handled</h3>
                  {crm.payments.filter(p => p.requestedBy === user.name).length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Lead Name</th><th style={{ padding: '12px' }}>Amount</th><th style={{ padding: '12px' }}>Status</th></tr></thead>
                      <tbody>{crm.payments.filter(p => p.requestedBy === user.name).map(p => <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{p.leadName}</td><td style={{ padding: '12px' }}>{p.amount}</td><td style={{ padding: '12px' }}>{p.status}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No payments found.</div>}
                </div>
              )}
              {activeTab === 'Students' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Assigned Students</h3>
                  {crm.students.filter(s => s.counselor === user.name || s.mentor === user.name).length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Student Name</th><th style={{ padding: '12px' }}>Course</th><th style={{ padding: '12px' }}>Status</th></tr></thead>
                      <tbody>{crm.students.filter(s => s.counselor === user.name || s.mentor === user.name).map(s => <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{s.name}</td><td style={{ padding: '12px' }}>{s.course}</td><td style={{ padding: '12px' }}>{s.status}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No students assigned.</div>}
                </div>
              )}
              {activeTab === 'Documents' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>Uploaded Documents</h3>
                  {crm.documents.filter(d => d.uploadedBy === user.name).length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead><tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}><th style={{ padding: '12px' }}>Document Name</th><th style={{ padding: '12px' }}>Type</th><th style={{ padding: '12px' }}>Date</th></tr></thead>
                      <tbody>{crm.documents.filter(d => d.uploadedBy === user.name).map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding: '12px', fontWeight: 500 }}>{d.name}</td><td style={{ padding: '12px' }}>{d.type}</td><td style={{ padding: '12px' }}>{new Date(d.date).toLocaleDateString()}</td></tr>)}</tbody>
                    </table>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No documents found.</div>}
                </div>
              )}
              {activeTab === 'Activities' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>All Activities</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button className="primary-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>All</button>
                    <button className="secondary-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Calls</button>
                    <button className="secondary-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Emails</button>
                    <button className="secondary-btn" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Tasks</button>
                  </div>
                  {activities.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {activities.map((act) => (
                        <div key={act.id + '_all'} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {act.icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{act.title}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{act.desc}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{new Date(act.date).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No activities yet.</div>}
                </div>
              )}

            </div>

            {/* Far Right Summary Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Next Follow-up</h3>
                {nextFollowUp ? (
                  <div style={{ padding: '16px', background: 'rgba(59,130,246,0.05)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{nextFollowUp.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}><Clock size={14}/> {new Date(nextFollowUp.dueDate).toLocaleString()}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: {nextFollowUp.status}</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>No upcoming follow-ups.</p>
                    <button className="primary-btn" style={{ width: '100%' }}>+ Add Follow-up</button>
                  </div>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Leads Converted</span><span style={{ fontWeight: 600 }}>{userLeads.filter(l => l.status === 'Won').length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Conversion Rate</span><span style={{ fontWeight: 600, color: '#10b981' }}>{userLeads.length > 0 ? Math.round((userLeads.filter(l => l.status === 'Won').length / userLeads.length) * 100) : 0}%</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Opportunities Won</span><span style={{ fontWeight: 600 }}>{userOpportunities.filter(o => o.stage === 'Closed Won').length}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Tasks Completed</span><span style={{ fontWeight: 600 }}>{userTasks.filter(t => t.status === 'Completed').length}</span></div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>User Workflow</h3>
                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                  <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }}></div>
                  {['Account Created', 'Assigned to Team', 'Leads Assigned', 'Opportunities Managed'].map((stage, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
                      <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: i < 3 ? '#10b981' : 'var(--glass-border)', border: '4px solid var(--bg-primary)' }}></div>
                      <div style={{ fontWeight: i < 3 ? 600 : 400, color: i < 3 ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>{stage}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <SlidePanel isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User" subtitle={user.name} icon={<Edit3 />} width="600px" footer={<><button className="secondary-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button><button className="primary-btn" onClick={handleSave}>Save Changes</button></>}>
        <PremiumCard title="Basic Info" icon={<UserIcon size={18} />}>
          <PremiumInput label="Full Name" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} icon={<UserIcon size={16} />} />
          <PremiumInput label="Phone" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} icon={<Phone size={16} />} />
          <PremiumInput label="Email" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<Mail size={16} />} />
        </PremiumCard>
        <PremiumCard title="Role & Status" icon={<Shield size={18} />}>
          <PremiumSelect label="Role" name="role" value={formData.role || ''} onChange={(e) => setFormData({...formData, role: e.target.value})} options={['Admin', 'Super Admin', 'HR Manager']} icon={<Shield size={16} />} />
          <PremiumSelect label="Department" name="department" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} options={['Tech']} icon={<Briefcase size={16} />} />
          <PremiumSelect label="Status" name="status" value={formData.status || ''} onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} options={['Active', 'Inactive']} icon={<Activity size={16} />} />
        </PremiumCard>
      </SlidePanel>

    </div>
  );
}
