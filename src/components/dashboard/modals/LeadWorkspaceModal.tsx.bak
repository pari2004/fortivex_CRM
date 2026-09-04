'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Mail, Building2, Users, List, PhoneCall,
  MessageSquare, FileText, ChevronDown, Clock, Star, MapPin, Tag, Briefcase, 
  Settings, File, Plus, User, Download, Upload, CheckCircle, Activity,
  MoreVertical, Calendar, Eye, Send, ArrowRight, ArrowRightCircle, CheckSquare, XCircle,
  Video, CalendarCheck, Paperclip, CreditCard, RefreshCw, Search, Edit3
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { EditLeadModal } from './EditLeadModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadWorkspaceModal({ isOpen, onClose, lead }: Props) {
  const { leads, updateLead, deals, updateDeal, tasks, businessLeads, documents, uploadDocument, dealStages } = useCRM();
  const { openSharedInbox } = useInbox();
  const CURRENT_USER = 'Pavan S.H';
  
  const currentLead = leads.find(l => l.id === lead?.id) || lead;

  const [activeTab, setActiveTab] = useState('Interactions');
  const [subFilter, setSubFilter] = useState('Important');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  
  const [showLinkBusiness, setShowLinkBusiness] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  
  const [showLinkContact, setShowLinkContact] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contactType, setContactType] = useState('Client');
  const [contactRel, setContactRel] = useState('Primary');
  
  const [showAddToList, setShowAddToList] = useState(false);
  const [listName, setListName] = useState('');
  
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  
  useGlobalEscape(!!isOpen && !actionMenuOpen && !showEditLead && !showLinkBusiness && !showLinkContact && !showAddToList && !showAddNote, () => { onClose() });
  useGlobalEscape(!!actionMenuOpen, () => { setActionMenuOpen(false) });
  useGlobalEscape(!!showLinkBusiness, () => { setShowLinkBusiness(false) });
  useGlobalEscape(!!showLinkContact, () => { setShowLinkContact(false) });
  useGlobalEscape(!!showAddToList, () => { setShowAddToList(false) });
  useGlobalEscape(!!showAddNote, () => { setShowAddNote(false) });

  if (!isOpen || !currentLead) return null;

  const addActivity = (type: string, description: string, category: string = 'Activity') => {
    const updatedLead = { ...currentLead };
    updatedLead.activities = [
        { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: currentLead.status, activityType: type, category, description, activityBy: CURRENT_USER },
        ...(updatedLead.activities || [])
    ];
    updateLead(updatedLead);
  };

  const handleCall = () => {
    addActivity('Call', 'Initiated outbound call');
    window.location.href = `tel:${currentLead.phone || '263437669'}`;
  };

  const handleWhatsApp = () => {
    openSharedInbox({ entityType: 'lead', entityId: currentLead.id });
  };

  const handleLinkBusiness = (business: any) => {
    const updatedLead = { ...currentLead, company: business.company, companyId: business.id };
    updateLead(updatedLead);
    addActivity('Business Linked', `Linked to business: ${business.company}`);
    setShowLinkBusiness(false);
  };
  const handleRemoveContact = (id: string) => {
    const updated = { ...currentLead };
    updated.associatedContacts = updated.associatedContacts.filter((c: any) => c.id !== id);
    updateLead(updated);
    addActivity('Contact Removed', 'Removed a linked contact');
  };
  const handleLinkContact = () => {
    if(!contactSearch.trim()) return;
    const c = { id: Date.now().toString(), name: contactSearch, type: contactType, rel: contactRel };
    const updated = { ...currentLead };
    updated.associatedContacts = [...(updated.associatedContacts || []), c];
    updateLead(updated);
    addActivity('Contact Linked', `Linked contact: ${contactSearch} (${contactRel})`);
    setContactSearch('');
  };
  const handleCreateList = () => {
    if(!listName.trim()) return;
    const updated = { ...currentLead };
    updated.lists = [...(updated.lists || []), listName];
    updateLead(updated);
    addActivity('Added to List', `Added to list: ${listName}`);
    setShowAddToList(false);
  };
  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addActivity('Note', noteText, 'Note');
    setNoteText('');
    setShowAddNote(false);
  };
  
  const handleActionClick = (actionName: string) => {
    setActionMenuOpen(false);
    switch (actionName) {
        case 'Edit Contact': setShowEditLead(true); break;
        case 'Add Business': setShowLinkBusiness(true); break;
        case 'Add To List': setShowAddToList(true); break;
        case 'Add Note': setShowAddNote(true); break;
        case 'Log Call Outcome': handleCall(); break;
        case 'Delete Contact':
            if (confirm(`Are you sure you want to delete ${currentLead.name}?`)) {
                onClose();
            }
            break;
        default: break;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <motion.div 
          key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop" 
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999 }}
          />
      )}
      {isOpen && (
        <motion.div 
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel"
            style={{ 
              position: 'fixed', top: '2%', left: '2%', right: '2%', bottom: '2%', 
              zIndex: 100000, display: 'flex', flexDirection: 'row', overflow: 'hidden', padding: 0,
              background: '#f8fafc'
            }}
          >
            {/* LEFT PANEL */}
            <div style={{ width: '320px', background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              
              {/* Header */}
              <div style={{ padding: '24px', background: '#e0e7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', position: 'relative' }}>
                    {currentLead.name.substring(0, 2).toUpperCase()}
                    <div style={{ position: 'absolute', bottom: -4, right: -4, background: '#4f46e5', borderRadius: '50%', padding: '4px', color: 'white' }}>
                      <Edit3 size={10} />
                    </div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '4px' }}>{currentLead.name}</h2>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'white', borderRadius: '12px', color: '#4f46e5', fontWeight: 600 }}>{currentLead.stage || 'Prospecting - Inconclusive Outcome'}</span>
                  </div>
                </div>
                <button style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }} onClick={handleCall}>
                  <PhoneCall size={18} />
                </button>
              </div>

              {/* Owner */}
              <div style={{ padding: '8px 24px', background: '#e0e7ff', fontSize: '0.85rem', color: '#4338ca', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Owner: {currentLead.owner}</span>
              </div>

              {/* Next Followup */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '50%', color: '#4f46e5' }}>
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Next followup</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentLead.nextFollowUp || 'in 2h'}</div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div style={{ padding: '16px 24px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Contact Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Phone size={16} color="#64748b" style={{ marginTop: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentLead.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer' }} onClick={handleCall}><Phone size={14} /></button>
                      <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#22c55e', cursor: 'pointer' }} onClick={handleWhatsApp}><MessageSquare size={14} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Mail size={16} color="#64748b" style={{ marginTop: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentLead.email}</div>
                    </div>
                    <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#8b5cf6', cursor: 'pointer' }}><Send size={14} /></button>
                  </div>
                </div>
              </div>

              {/* More On This Lead */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>More On This Lead</h4>
                  <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '12px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>MODIFY</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Interested In?</span>
                    <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{currentLead.interestedIn || 'Executive GenAI'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current Company Type</span>
                    <span style={{ fontWeight: 500 }}>{currentLead.companyType || 'NA'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Experience Level</span>
                    <span style={{ fontWeight: 500 }}>{currentLead.experienceLevel || 'NA'}</span>
                  </div>
                </div>
              </div>

              {/* Lead Journey */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Lead Journey</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5' }} /> Started working</div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>1w ago</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} /> Lead assigned</div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>1w ago</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} /> Lead created</div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>4w ago</span>
                  </div>
                </div>
              </div>


              {/* Associated Businesses */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>Associated Businesses</h4>
                  <button onClick={() => setShowLinkBusiness(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Link Business</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Building2 size={24} color="#94a3b8" />
                  <span style={{ fontWeight: 600, color: currentLead.company ? '#1e1b4b' : '#94a3b8' }}>{currentLead.company || 'NA'}</span>
                </div>
              </div>

              {/* Associated Contacts */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>Associated Contacts</h4>
                  <button onClick={() => setShowLinkContact(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Link Contact</button>
                </div>
                {currentLead.associatedContacts && currentLead.associatedContacts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentLead.associatedContacts.map((c: any) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.rel}</div>
                        </div>
                        <button onClick={() => handleRemoveContact(c.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No contacts linked yet.</div>
                )}
              </div>
              
              {/* List Memberships */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>List Memberships</h4>
                  <button onClick={() => setShowAddToList(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Add To List</button>
                </div>
                {currentLead.lists && currentLead.lists.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentLead.lists.map((l: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{l}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>STATIC • bulk upload</div>
                        </div>
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No list memberships yet.</div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL (Main Area) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
              
              {/* Top Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: '#1e1b4b', color: 'white' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {[
                    { id: 'Interactions', label: 'Interactions', count: 3, icon: Activity },
                    { id: 'Tasks', label: 'Tasks', count: 0, icon: CheckSquare },
                    { id: 'Opportunities', label: 'Opportunities', count: 0, icon: Briefcase },
                    { id: 'Tickets', label: 'Tickets', count: 0, icon: Tag },
                    { id: 'Conversation', label: 'Conversation', icon: MessageSquare },
                    { id: 'Documents', label: 'Documents', count: 0, icon: FileText }
                  ].map(tab => (
                    <div 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        color: activeTab === tab.id ? 'white' : '#94a3b8',
                        fontWeight: activeTab === tab.id ? 600 : 400,
                        borderBottom: activeTab === tab.id ? '2px solid white' : '2px solid transparent',
                        paddingBottom: '4px'
                      }}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{tab.count}</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Search size={18} color="#94a3b8" cursor="pointer" />
                  <MessageSquare size={18} color="#22c55e" cursor="pointer" onClick={handleWhatsApp} />
                  
                  {/* ACTION MENU */}
                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setActionMenuOpen(!actionMenuOpen)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ACTION <ChevronDown size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {actionMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', width: '600px', zIndex: 100, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '24px', gap: '24px' }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Contact</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Edit Contact')}><Edit3 size={16}/> Edit Contact</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><Tag size={16}/> Add Tag</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Business')}><Building2 size={16}/> Add Business</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add To List')}><List size={16}/> Add To List</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><ArrowRightCircle size={16}/> Change Category</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => handleActionClick('Delete Contact')}><XCircle size={16}/> Delete Contact</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Activity</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Log Call Outcome')}><Phone size={16}/> Log Call Outcome</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Note')}><FileText size={16}/> Add Note</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><MapPin size={16}/> Log Visit</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><Video size={16}/> Video Call</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><Paperclip size={16}/> Add Document</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><CreditCard size={16}/> View Payments</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Tasks / Sales</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><CheckCircle size={16}/> Create Ad-hoc Task</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><Briefcase size={16}/> Create/Update Deal</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><Tag size={16}/> Create/Update Ticket</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><File size={16}/> Send Quote</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><CreditCard size={16}/> Request Payment</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }}><User size={16}/> Assign</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                </div>
              </div>

              {/* Sub-filters (for Interactions) */}
              {activeTab === 'Interactions' && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px', overflowX: 'auto' }}>
                  {[
                    { id: 'Important', label: 'Important', count: 3 },
                    { id: 'All', label: 'All' },
                    { id: 'Calls', label: 'Calls' },
                    { id: 'Video Call', label: 'Video Call' },
                    { id: 'Notes', label: 'Notes' },
                    { id: 'Emails', label: 'Emails' },
                    { id: 'Whatsapp Templates', label: 'Whatsapp Templates' },
                    { id: 'Broadcast', label: 'Broadcast' },
                    { id: 'Visits', label: 'Visits' },
                    { id: 'Quotes', label: 'Quotes' },
                    { id: 'Payments', label: 'Payments' }
                  ].map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setSubFilter(f.id)}
                      style={{
                        padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        background: subFilter === f.id ? '#4f46e5' : '#f1f5f9',
                        color: subFilter === f.id ? 'white' : '#64748b',
                        border: 'none', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {f.label}
                      {f.count && <span style={{ background: subFilter === f.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem' }}>{f.count}</span>}
                    </button>
                  ))}
                  
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <Search size={14} color="#94a3b8" />
                      <input type="text" placeholder="Search timeline" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', marginLeft: '8px', width: '120px' }} />
                    </div>
                    <RefreshCw size={16} color="#64748b" cursor="pointer" />
                  </div>
                </div>
              )}

              {/* Timeline Content */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Demo Timeline Items matching screenshot */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div><span style={{ fontWeight: 700, color: '#1e1b4b' }}>{currentLead.owner}</span> placed a call</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>just now</div>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Rnr</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div><span style={{ fontWeight: 700, color: '#1e1b4b' }}>{currentLead.owner}</span> placed a call</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>2d ago</div>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Rnr</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <RefreshCw size={18} />
                    </div>
                    <div style={{ flex: 1, background: '#f5f3ff', padding: '16px', borderRadius: '12px', border: '1px solid #ede9fe', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div><span style={{ fontWeight: 700, color: '#4f46e5' }}>Lifecycle changed</span> to Call Attempted Lead</div>
                        <div style={{ color: '#4f46e5', fontSize: '0.85rem' }}>13 Aug</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div><span style={{ fontWeight: 700, color: '#1e1b4b' }}>{currentLead.owner}</span> placed a call</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>1w ago</div>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Not Reachable</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <RefreshCw size={18} />
                    </div>
                    <div style={{ flex: 1, background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #dcfce7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div><span style={{ fontWeight: 700, color: '#16a34a' }}>Lifecycle changed</span> <span style={{ color: '#16a34a' }}>to New Inquiry Lead</span></div>
                        <div style={{ color: '#16a34a', fontSize: '0.85rem' }}>23 Jul</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>


              {/* Associated Businesses */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>Associated Businesses</h4>
                  <button onClick={() => setShowLinkBusiness(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Link Business</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Building2 size={24} color="#94a3b8" />
                  <span style={{ fontWeight: 600, color: currentLead.company ? '#1e1b4b' : '#94a3b8' }}>{currentLead.company || 'NA'}</span>
                </div>
              </div>

              {/* Associated Contacts */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>Associated Contacts</h4>
                  <button onClick={() => setShowLinkContact(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Link Contact</button>
                </div>
                {currentLead.associatedContacts && currentLead.associatedContacts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentLead.associatedContacts.map((c: any) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.rel}</div>
                        </div>
                        <button onClick={() => handleRemoveContact(c.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No contacts linked yet.</div>
                )}
              </div>
              
              {/* List Memberships */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>List Memberships</h4>
                  <button onClick={() => setShowAddToList(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Add To List</button>
                </div>
                {currentLead.lists && currentLead.lists.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentLead.lists.map((l: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{l}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>STATIC • bulk upload</div>
                        </div>
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No list memberships yet.</div>
                )}
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>

      {showEditLead && <EditLeadModal isOpen={showEditLead} onClose={() => setShowEditLead(false)} lead={currentLead} />}

      {/* Drawers */}
      <AnimatePresence>
        {showLinkBusiness && (
          <div key="link-business-drawer" style={{ position: 'absolute', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
             <motion.div initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}} transition={{type: 'tween'}} style={{ width: '400px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Link Business</h3>
                  <button onClick={() => { setShowLinkBusiness(false); setBusinessSearch(''); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                  <input value={businessSearch} onChange={e=>setBusinessSearch(e.target.value)} placeholder="Search businesses..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {businessLeads.filter((b: any) => b.company?.toLowerCase().includes(businessSearch.toLowerCase())).slice(0, 5).map((b: any) => (
                      <div key={b.id} onClick={() => handleLinkBusiness(b)} style={{ padding: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <Building2 size={20} color="#0f172a" />
                         <span style={{ fontWeight: 600 }}>{b.company}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
          </div>
        )}

        {showLinkContact && (
          <div key="link-contact-drawer" style={{ position: 'absolute', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
             <motion.div initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}} transition={{type: 'tween'}} style={{ width: '400px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Link Contact</h3>
                  <button onClick={() => { setShowLinkContact(false); setContactSearch(''); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Create Association</label>
                     <select value={contactType} onChange={e=>setContactType(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <option>Client</option><option>Vendor</option><option>Partner</option>
                     </select>
                     <input value={contactSearch} onChange={e=>setContactSearch(e.target.value)} placeholder="Search contact name..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                     <select value={contactRel} onChange={e=>setContactRel(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <option>Primary</option><option>Secondary</option><option>Billing</option>
                     </select>
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => { setContactSearch(''); setContactType('Client'); setContactRel('Primary'); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px' }}>Reset</button>
                        <button onClick={handleLinkContact} style={{ flex: 1, padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600 }}>Submit</button>
                     </div>
                  </div>
                </div>
             </motion.div>
          </div>
        )}

        {showAddToList && (
          <div key="add-to-list-drawer" style={{ position: 'absolute', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
             <motion.div initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}} transition={{type: 'tween'}} style={{ width: '400px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Add To List</h3>
                  <button onClick={() => { setShowAddToList(false); setListName(''); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ marginBottom: '24px' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#64748b' }}>Select Existing List or Type New</label>
                     <input value={listName} onChange={e=>setListName(e.target.value)} placeholder="E.g. VIP Customers" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                  </div>
                  <button onClick={handleCreateList} style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save to List</button>
                </div>
             </motion.div>
          </div>
        )}
        
        {showAddNote && (
          <div key="add-note-modal" style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
               <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.2rem' }}>Add Note</h3>
               <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Enter note details..." style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', resize: 'none', fontFamily: 'inherit' }} />
               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setShowAddNote(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSaveNote} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save Note</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
