import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, Clock, FileText, CheckCircle, Briefcase, MessageSquare, Activity, Download, Plus, Tag, Settings, Video, File, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadProfileModal({ isOpen, onClose, lead }: Props) {
  const { updateLead } = useCRM();
  const [activeTab, setActiveTab] = useState('Activities');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('All');

  // Use the active lead from context so it stays updated
  const { leads } = useCRM();
  const currentLead = leads.find(l => l.id === lead.id) || lead;

  if (!isOpen || !currentLead) return null;

  useGlobalEscape(!!isOpen && !actionMenuOpen, () => { onClose() });
  useGlobalEscape(!!actionMenuOpen, () => { setActionMenuOpen(false) });

  const addActivity = (type: string, description: string, category: string = 'Activity') => {
    const updatedLead = { ...currentLead };
    updatedLead.activities = [
        { id: Math.random().toString(), activityTime: new Date().toISOString(), lifecycle: currentLead.status, activityType: type, category, description, activityBy: 'Current User' },
        ...(updatedLead.activities || [])
    ];
    updateLead(updatedLead);
  };

  const handleActionClick = (actionName: string) => {
    setActionMenuOpen(false);
    const updatedLead = { ...currentLead };
    
    // Quick mock action handler to fulfill requirements
    switch (actionName) {
        case 'Edit Contact':
            const newName = prompt("Enter new name:", currentLead.name);
            if (newName) {
                updatedLead.name = newName;
                updateLead(updatedLead);
                addActivity('Contact Updated', `Name changed to ${newName}`);
            }
            break;
        case 'Add Tag':
            const newTag = prompt("Enter tag to add:");
            if (newTag) addActivity('Tag Added', `Tag added: ${newTag}`);
            break;
        case 'Add Business':
            const biz = prompt("Enter business name:");
            if (biz) addActivity('Business Added', `Business linked: ${biz}`);
            break;
        case 'Add To List':
            const list = prompt("Enter list name:");
            if (list) addActivity('Added to List', `Added to list: ${list}`);
            break;
        case 'Change Category':
            const cat = prompt("Enter new category:");
            if (cat) addActivity('Category Changed', `Category updated to: ${cat}`);
            break;
        case 'Delete Contact':
            if (confirm("Are you sure you want to delete this contact? (Demo: will just add a note)")) {
                addActivity('Contact Deleted', `Requested deletion of contact.`);
            }
            break;
        case 'Log Call Outcome':
            addActivity('Call Logged', 'Outbound call made', 'Contact');
            break;
        case 'Add Note':
            const newNote = prompt("Enter note:");
            if (newNote) addActivity('Note Added', newNote);
            break;
        case 'Log Visit':
            addActivity('Visit Logged', 'Visit logged successfully');
            break;
        case 'Video Call':
            addActivity('Video Call', 'Video call scheduled/conducted');
            break;
        case 'Add Document':
            addActivity('Document Added', 'New document uploaded');
            break;
        case 'View Payments':
            addActivity('Payments Viewed', 'User accessed payment history');
            break;
        case 'Create Ad-hoc Task':
            const taskName = prompt("Enter task title:");
            if (taskName) {
                updatedLead.tasks = [
                    { id: Math.random().toString(), title: taskName, dueDate: new Date().toISOString(), status: 'Pending' },
                    ...(updatedLead.tasks || [])
                ];
                updateLead(updatedLead);
                addActivity('Task Created', `Ad-hoc task created: ${taskName}`);
            }
            break;
        case 'Create/Update Deal':
            addActivity('Deal Updated', 'Deal created/updated in pipeline');
            break;
        case 'Create/Update Ticket':
            addActivity('Ticket Updated', 'Support ticket created/updated');
            break;
        case 'Send Quote':
            addActivity('Quote Sent', 'Quote sent to contact');
            break;
        case 'Request Payment':
            addActivity('Payment Requested', 'Payment request sent');
            break;
        case 'Assign':
            const user = prompt("Enter user to assign to:");
            if (user) {
                updatedLead.assignedTo = user;
                updateLead(updatedLead);
                addActivity('Lead Reassigned', `Assigned to ${user}`);
            }
            break;
    }
  };

  const getFilteredActivities = () => {
    if (!currentLead.activities) return [];
    if (activityFilter === 'All') return currentLead.activities;
    if (activityFilter === 'Important') return currentLead.activities.filter((a: any) => a.activityType.includes('Important'));
    if (activityFilter === 'Calls') return currentLead.activities.filter((a: any) => a.activityType.includes('Call'));
    if (activityFilter === 'Notes') return currentLead.activities.filter((a: any) => a.activityType.includes('Note'));
    if (activityFilter === 'Video Call') return currentLead.activities.filter((a: any) => a.activityType.includes('Video'));
    if (activityFilter === 'Visits') return currentLead.activities.filter((a: any) => a.activityType.includes('Visit'));
    return currentLead.activities.filter((a: any) => a.activityType.includes(activityFilter));
  };

  const filteredActivities = getFilteredActivities();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel"
        style={{ width: '95%', maxWidth: '1400px', height: '95vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '12px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={() => setActionMenuOpen(!actionMenuOpen)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    ACTION <ChevronDown size={16} />
                </button>
                {actionMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', padding: '16px', zIndex: 9999 }}>
                        <div>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Contact</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Edit Contact')}><User size={14}/> Edit Contact</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Add Tag')}><Tag size={14}/> Add Tag</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Add Business')}><Briefcase size={14}/> Add Business</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Add To List')}><Plus size={14}/> Add To List</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Change Category')}><Settings size={14}/> Change Category</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Delete Contact')} style={{ color: '#ef4444' }}><X size={14}/> Delete Contact</button>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Activity</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Log Call Outcome')}><Phone size={14}/> Log Call Outcome</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Add Note')}><FileText size={14}/> Add Note</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Log Visit')}><MapPin size={14}/> Log Visit</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Video Call')}><Video size={14}/> Video Call</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Add Document')}><File size={14}/> Add Document</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('View Payments')}><Download size={14}/> View Payments</button>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Tasks / Sales</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Create Ad-hoc Task')}><CheckCircle size={14}/> Create Ad-hoc Task</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Create/Update Deal')}><Briefcase size={14}/> Create/Update Deal</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Create/Update Ticket')}><Activity size={14}/> Create/Update Ticket</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Send Quote')}><FileText size={14}/> Send Quote</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Request Payment')}><Download size={14}/> Request Payment</button>
                                <button className="dropdown-action-btn" onClick={() => handleActionClick('Assign')}><User size={14}/> Assign</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: '16px' }}><X size={24} color="var(--text-secondary)" /></button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Sidebar Profile View */}
            <div style={{ width: '350px', background: 'var(--bg-secondary)', overflowY: 'auto', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                
                {/* Main Profile Card */}
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#d8b4fe', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#4c1d95' }}>
                        <span>{currentLead.status}</span>
                        <span>Owner: {currentLead.assignedTo || currentLead.counselor || 'System'}</span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#e9d5ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                            {currentLead.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{currentLead.name}</h2>
                        </div>
                        <button style={{ background: '#3b82f6', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={20}/></button>
                    </div>

                    <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <h4 style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '12px' }}>CONTACT DETAILS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Phone size={16} color="var(--text-tertiary)"/>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Phone</div>
                                    <div style={{ fontWeight: 500 }}>{currentLead.phone || currentLead.mobile}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ padding: '4px', background: '#e0e7ff', borderRadius: '4px', color: '#4f46e5', cursor: 'pointer' }} onClick={() => addActivity('Call Logged', 'Outbound Call')}><Phone size={14}/></div>
                                    <div style={{ padding: '4px', background: '#dcfce7', borderRadius: '4px', color: '#16a34a', cursor: 'pointer' }} onClick={() => addActivity('Message Logged', 'Message Sent')}><MessageSquare size={14}/></div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Mail size={16} color="var(--text-tertiary)"/>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Email</div>
                                    <div style={{ fontWeight: 500, wordBreak: 'break-all' }}>{currentLead.email}</div>
                                </div>
                                <div style={{ padding: '4px', background: '#e0e7ff', borderRadius: '4px', color: '#4f46e5', cursor: 'pointer' }} onClick={() => addActivity('Email Logged', 'Email Sent')}><Mail size={14}/></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* More On This Lead */}
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#d8b4fe', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#4c1d95', alignItems: 'center' }}>
                        <span>More On This Lead</span>
                        <span style={{ fontSize: '12px', background: 'white', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => handleActionClick('Edit Contact')}>MODIFY</span>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Interested In?</span>
                            <span style={{ color: '#4f46e5', fontWeight: 500, fontSize: '14px' }}>{currentLead.program}</span>
                        </div>
                    </div>
                </div>

                {/* Lead Journey */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase' }}>Lead Journey</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4c1d95' }}></div> Lead assigned</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>{currentLead.assignedOn || 'Recently'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }}></div> Lead created</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>{currentLead.createdAt ? new Date(currentLead.createdAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>
                </div>

                {/* Associated Businesses */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Associated Businesses</h4>
                        <button className="primary-btn" onClick={() => handleActionClick('Add Business')} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Link Business</button>
                    </div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No businesses linked yet.</div>
                </div>

                {/* Associated Contacts */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Associated Contacts</h4>
                        <button className="primary-btn" onClick={() => handleActionClick('Edit Contact')} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Link Contact</button>
                    </div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No contacts linked yet.</div>
                </div>

                {/* List Memberships */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>List Memberships</h4>
                        <button className="primary-btn" onClick={() => handleActionClick('Add To List')} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Add to List</button>
                    </div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>Mixed-4 Drive Leads</div>
                </div>

            </div>

            {/* Right Side Content Tabs */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                {/* Tabs Navigation */}
                <div style={{ display: 'flex', background: 'var(--bg-card)', borderBottom: '1px solid var(--glass-border)' }}>
                    {['Activities', 'Interactions', 'Tasks', 'Opportunities', 'Tickets', 'Conversation', 'Documents'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                padding: '16px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            {tab === 'Interactions' && <Activity size={16}/>}
                            {tab === 'Tasks' && <CheckCircle size={16}/>}
                            {tab === 'Opportunities' && <Briefcase size={16}/>}
                            {tab === 'Tickets' && <FileText size={16}/>}
                            {tab === 'Conversation' && <MessageSquare size={16}/>}
                            {tab === 'Documents' && <File size={16}/>}
                            {tab === 'Activities' && <User size={16}/>}
                            {tab}
                            <span style={{ background: '#e2e8f0', color: '#475569', borderRadius: '12px', padding: '2px 8px', fontSize: '12px' }}>
                                {currentLead[tab.toLowerCase()]?.length || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Sub-Filters (for Activities/Interactions) */}
                {(activeTab === 'Activities' || activeTab === 'Interactions') && (
                    <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto', background: '#f8fafc' }}>
                        {['All', 'Important', 'Calls', 'Video Call', 'Notes', 'Emails', 'Whatsapp Templates', 'Broadcast', 'Visits', 'Quotes', 'Payments'].map((filter, i) => (
                            <button 
                                key={filter} 
                                onClick={() => setActivityFilter(filter)}
                                style={{ padding: '6px 16px', borderRadius: '16px', border: 'none', background: activityFilter === filter ? '#4f46e5' : '#e2e8f0', color: activityFilter === filter ? 'white' : '#475569', fontWeight: 500, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                {activityFilter === filter && <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                {filter}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
                    
                    {/* Render Activities */}
                    {activeTab === 'Activities' && filteredActivities.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredActivities.map((act: any, idx: number) => (
                                <div key={idx} style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{act.activityType}</div>
                                        <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>{new Date(act.activityTime).toLocaleString()}</div>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>{act.description}</div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                                        <span><span style={{ fontWeight: 500 }}>Category:</span> {act.category}</span>
                                        <span><span style={{ fontWeight: 500 }}>By:</span> {act.activityBy}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeTab === 'Tasks' && currentLead.tasks && currentLead.tasks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {currentLead.tasks.map((task: any, idx: number) => (
                                <div key={idx} style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                                        <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                                        <span style={{ padding: '2px 8px', background: task.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: task.status === 'Completed' ? '#16a34a' : '#d97706', borderRadius: '12px', fontWeight: 'bold' }}>{task.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                            <div style={{ width: '120px', height: '120px', background: '#e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <FileText size={48} color="#94a3b8" />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>No Data Found</h3>
                            <p style={{ marginTop: '8px' }}>There are no {activeTab.toLowerCase()} associated with this lead yet.</p>
                        </div>
                    )}

                </div>

            </div>
        </div>
      </motion.div>
      <style>{`
        .dropdown-action-btn {
            background: transparent;
            border: none;
            text-align: left;
            padding: 8px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
        }
        .dropdown-action-btn:hover {
            background: var(--bg-secondary);
        }
      `}</style>
    </div>
  );
}
