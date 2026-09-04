'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Mail, Building2, Users, List, PhoneCall,
  MessageSquare, FileText, ChevronDown, Clock, Star, MapPin, Tag, Briefcase, 
  Settings, File, Plus, User, Download, Upload, CheckCircle, Activity,
  MoreVertical, Calendar, Eye, Send, ArrowRight, ArrowRightCircle, CheckSquare, XCircle,
  Video, CalendarCheck, Paperclip, CreditCard, RefreshCw, Search, Edit3,
  Play, RotateCcw, RotateCw, Volume2, PhoneOutgoing, PhoneIncoming, Gauge, RefreshCcw
} from 'lucide-react';
import { getEnrichedActivities } from '@/utils/demoActivities';
import CallAudioPlayer from '@/components/dashboard/CallAudioPlayer';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { EditLeadModal } from './EditLeadModal';
import { EditContactDrawer } from './EditContactDrawer';
import { AddTagDrawer } from './AddTagDrawer';
import { AddToListDrawer } from './AddToListDrawer';
import { ChangeCategoryModal } from './ChangeCategoryModal';
import { LogCallOutcomeDrawer } from './LogCallOutcomeDrawer';
import { AddNoteModal } from './AddNoteModal';
import { LogVisitDrawer } from './LogVisitDrawer';
import { VideoCallDrawer } from './VideoCallDrawer';
import { AddDocumentDrawer } from './AddDocumentDrawer';
import { ViewPaymentsDrawer } from './ViewPaymentsDrawer';
import { CreateAdHocTaskModal } from './CreateAdHocTaskModal';
import { CreateUpdateDealModal } from './CreateUpdateDealModal';
import { CreateUpdateTicketModal } from './CreateUpdateTicketModal';
import { SetupWarningModal } from './SetupWarningModal';
import { AssignLeadsModal } from './AssignLeadsModal';
import { QuotationDefaultsWorkspaceModal } from './QuotationDefaultsWorkspaceModal';
import { RequestPaymentModal } from './RequestPaymentModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadWorkspaceModal({ isOpen, onClose, lead }: Props) {
  const { leads, updateLead, deleteLead, deals, updateDeal, tasks, businessLeads, documents, uploadDocument, dealStages , quotationDefaults } = useCRM();
  const { openSharedInbox } = useInbox();
  const CURRENT_USER = 'Abhay';
  
  const currentLead = leads.find(l => l.id === lead?.id) || lead;

  const [activeTab, setActiveTab] = useState('Integration');
  const [subFilter, setSubFilter] = useState('Important');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);
  const [showChangeCategory, setShowChangeCategory] = useState(false);
  const [showLogCallOutcome, setShowLogCallOutcome] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showLogVisit, setShowLogVisit] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showViewPayments, setShowViewPayments] = useState(false);
  const [showCreateAdHocTask, setShowCreateAdHocTask] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showSetupWarning, setShowSetupWarning] = useState(false);
  const [showQuotationDefaults, setShowQuotationDefaults] = useState(false);
  const [showQuotationDraft, setShowQuotationDraft] = useState(false);
  const [showRequestPayment, setShowRequestPayment] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [showLinkBusiness, setShowLinkBusiness] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  
  const [showLinkContact, setShowLinkContact] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [timelineSearch, setTimelineSearch] = useState('');
  const [contactType, setContactType] = useState('Client');
  const [contactRel, setContactRel] = useState('Primary');
  
  const [listName, setListName] = useState('');
  
  const [noteText, setNoteText] = useState('');
  
  const [showNextFollowupDrawer, setShowNextFollowupDrawer] = useState(false);
  const [followupOption, setFollowupOption] = useState<string | null>(null);

  const calculateFollowupDate = (option: string) => {
    const date = new Date();
    if (option === 'In 2 Hours') {
      date.setHours(date.getHours() + 2);
    } else if (option === 'Tomorrow') {
      date.setDate(date.getDate() + 1);
    } else if (option === 'In 2 Days') {
      date.setDate(date.getDate() + 2);
    } else if (option === 'Later This Week') {
      date.setDate(date.getDate() + 3);
    } else if (option === 'Next Week') {
      date.setDate(date.getDate() + 7);
    }
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${option}, ${day} ${month} at ${hours}:${minutes} ${ampm}`;
  };

  useGlobalEscape(!!isOpen && !actionMenuOpen && !showEditLead && !showLinkBusiness && !showLinkContact && !showAddToList && !showAddNote && !showNextFollowupDrawer && !showChangeCategory, () => { onClose() });
  useGlobalEscape(!!actionMenuOpen, () => { setActionMenuOpen(false) });
  useGlobalEscape(!!showEditLead, () => { setShowEditLead(false) });
  useGlobalEscape(!!showLinkBusiness, () => { setShowLinkBusiness(false) });
  useGlobalEscape(!!showLinkContact, () => { setShowLinkContact(false) });
  useGlobalEscape(!!showAddToList, () => { setShowAddToList(false) });
  useGlobalEscape(!!showChangeCategory, () => { setShowChangeCategory(false) });
  useGlobalEscape(!!showAddNote, () => { setShowAddNote(false) });
  useGlobalEscape(!!showNextFollowupDrawer, () => { setShowNextFollowupDrawer(false); setFollowupOption(null); });

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
  const handleCreateList = (listName: string) => {
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
        case 'Add Tag': setShowAddTag(true); break;
        case 'Add Business': setShowLinkBusiness(true); break;
        case 'Add To List': setShowAddToList(true); break;
        case 'Change Category': setShowChangeCategory(true); break;
        case 'Log Call':
        case 'Add Note': setShowAddNote(true); break;
        case 'Log Call Outcome': setShowLogCallOutcome(true); break;
        case 'Log Visit': setShowLogVisit(true); break;
        case 'Video Call': setShowVideoCall(true); break;
        case 'Add Document': setShowAddDocument(true); break;
        case 'View Payments': setShowViewPayments(true); break;
        case 'Create Ad-hoc Task': setShowCreateAdHocTask(true); break;
        case 'Create/Update Deal':
        case 'Update Deal': setShowDealModal(true); break;
        case 'Create/Update Ticket': setShowTicketModal(true); break;
        case 'Request Payment': setShowRequestPayment(true); break;
        case 'Assign': setShowAssignModal(true); break;
        case 'Send Quote':
          if (!quotationDefaults.isConfigured) {
            setShowSetupWarning(true);
          } else {
            setShowQuotationDraft(true); // TODO: actual quote drafting modal
            alert('Quotation Draft flow opens here!');
          }
          break;
        case 'Delete Contact':
            if (confirm(`Are you sure you want to delete ${currentLead.name}?`)) {
                deleteLead([currentLead.id]);
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
                <span>Owner: {currentLead.owner || currentLead.counselor || currentLead.assignedTo || "Unassigned"}</span>
              </div>

              {/* Next Followup */}
              <div style={{ padding: '16px 24px' }}>
                <div 
                  onClick={() => setShowNextFollowupDrawer(true)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                >
                  <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '50%', color: '#4f46e5' }}>
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Next followup</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentLead.nextFollowUp || 'None'}</div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div style={{ padding: '16px 24px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>Contact Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={16} color="#64748b" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentLead.phone && currentLead.phone !== 'NA' ? currentLead.phone : '+1 (555) 0198-432'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer' }} onClick={() => { addActivity('Call', 'Initiated outbound call'); window.location.href = `tel:${currentLead.phone && currentLead.phone !== 'NA' ? currentLead.phone : '+15550198432'}`; }}><Phone size={14} /></button>
                      <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#22c55e', cursor: 'pointer' }} onClick={() => { addActivity('WhatsApp', 'Initiated WhatsApp conversation'); window.open(`https://wa.me/${(currentLead.phone && currentLead.phone !== 'NA' ? currentLead.phone : '15550198432').replace(/[^0-9]/g, '')}`, '_blank'); }}><MessageSquare size={14} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={16} color="#64748b" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentLead.email && currentLead.email !== 'NA' ? currentLead.email : 'john.doe@example.com'}</div>
                    </div>
                    <button style={{ border: '1px solid #e2e8f0', background: 'white', padding: '6px', borderRadius: '6px', color: '#8b5cf6', cursor: 'pointer' }} onClick={() => { addActivity('Email', 'Initiated email'); window.location.href = `mailto:${currentLead.email && currentLead.email !== 'NA' ? currentLead.email : 'john.doe@example.com'}`; }}><Send size={14} /></button>
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
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No businesses linked yet.</div>
              </div>

              {/* Associated Contacts */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>Associated Contacts</h4>
                  <button onClick={() => setShowLinkContact(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Link Contact</button>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No contacts linked yet.</div>
              </div>

              {/* List Memberships */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e1b4b', fontWeight: 700 }}>List Memberships</h4>
                  <button onClick={() => setShowAddToList(true)} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Add To List</button>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No list memberships yet.</div>
              </div>




              

            </div>

            {/* RIGHT PANEL (Main Area) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
              
              {/* Top Navigation */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px 24px 0 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#1e1b4b', color: 'white' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {[
                    { id: 'Integration', label: 'Integration', count: 3, icon: Activity },
                    { id: 'Tasks', label: 'Tasks', count: (currentLead?.tasks || []).length, icon: CheckSquare },
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
                        paddingBottom: '16px'
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '12px' }}>
                  <Search size={18} color="#94a3b8" cursor="pointer" onClick={() => alert('Search clicked')} />
                  <MessageSquare size={18} color="#22c55e" cursor="pointer" onClick={() => window.open(`https://wa.me/${(currentLead.phone && currentLead.phone !== 'NA' ? currentLead.phone : '15550198432').replace(/[^0-9]/g, '')}`, '_blank')} />
                  
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Tag')}><Tag size={16}/> Add Tag</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Business')}><Building2 size={16}/> Add Business</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add To List')}><List size={16}/> Add To List</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Change Category')}><ArrowRightCircle size={16}/> Change Category</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => handleActionClick('Delete Contact')}><XCircle size={16}/> Delete Contact</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Activity</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Log Call Outcome')}><Phone size={16}/> Log Call Outcome</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Note')}><FileText size={16}/> Add Note</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Log Visit')}><MapPin size={16}/> Log Visit</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Video Call')}><Video size={16}/> Video Call</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Add Document')}><Paperclip size={16}/> Add Document</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('View Payments')}><CreditCard size={16}/> View Payments</div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Tasks / Sales</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Create Ad-hoc Task')}><CheckCircle size={16}/> Create Ad-hoc Task</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Create/Update Deal')}><Briefcase size={16}/> Create/Update Deal</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Create/Update Ticket')}><Tag size={16}/> Create/Update Ticket</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Send Quote')}><File size={16}/> Send Quote</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Request Payment')}><CreditCard size={16}/> Request Payment</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleActionClick('Assign')}><User size={16}/> Assign</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                </div>
              </div>

              {/* Sub-filters (for Integration) */}
              {activeTab === 'Integration' && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', flex: 1, paddingBottom: '4px' }}>
                    {[
                      { id: 'Important', label: 'Important', count: getEnrichedActivities(currentLead).filter((a: any) => a.isImportant).length },
                      { id: 'All', label: 'All', count: getEnrichedActivities(currentLead).length },
                      { id: 'Calls', label: 'Calls', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Call' || a.activityType === 'Call Outcome').length },
                      { id: 'Video Call', label: 'Video Call', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Video Call').length },
                      { id: 'Notes', label: 'Notes', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Note').length },
                      { id: 'Emails', label: 'Emails', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Email').length },
                      { id: 'Whatsapp Templates', label: 'Whatsapp Templates', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'WhatsApp').length },
                      { id: 'Broadcast', label: 'Broadcast', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Broadcast').length },
                      { id: 'Visits', label: 'Visits', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Visit').length },
                      { id: 'Quotes', label: 'Quotes', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Quote').length },
                      { id: 'Payments', label: 'Payments', count: getEnrichedActivities(currentLead).filter((a: any) => a.activityType === 'Payment').length }
                    ].map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setSubFilter(f.id)}
                        style={{
                          padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                          background: subFilter === f.id ? '#4f46e5' : '#f1f5f9',
                          color: subFilter === f.id ? 'white' : '#64748b',
                          border: 'none', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0
                        }}
                      >
                        {f.label}
                        {f.count !== undefined && f.count > 0 && <span style={{ background: subFilter === f.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem' }}>{f.count}</span>}
                      </button>
                    ))}
                  </div>
                  
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <Search size={14} color="#94a3b8" />
                      <input 
                        type="text" 
                        placeholder="Search timeline" 
                        value={timelineSearch || ''}
                        onChange={(e) => setTimelineSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', marginLeft: '8px', width: '120px' }} 
                      />
                    </div>
                    <RefreshCw size={16} color="#64748b" cursor="pointer" onClick={() => { setTimelineSearch('');  }} />
                  </div>
                </div>
              )}

              
              {/* Timeline Content */}
              {activeTab === 'Integration' && (
                
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Timeline Items mapped from activities */}
                  {(() => {
                    const filteredActivities = getEnrichedActivities(currentLead).filter((a: any) => {
                      if (timelineSearch) {
                        const searchStr = timelineSearch.toLowerCase();
                        if (!(a.title?.toLowerCase().includes(searchStr) || 
                              a.description?.toLowerCase().includes(searchStr) || 
                              a.activityType?.toLowerCase().includes(searchStr))) {
                          return false;
                        }
                      }
                      if (subFilter === 'All') return true;
                      if (subFilter === 'Important') return a.isImportant === true;
                      if (subFilter === 'Calls') return a.activityType === 'Call' || a.activityType === 'Call Outcome';
                      if (subFilter === 'Video Call') return a.activityType === 'Video Call';
                      if (subFilter === 'Notes') return a.activityType === 'Note';
                      if (subFilter === 'Emails') return a.activityType === 'Email';
                      if (subFilter === 'Whatsapp Templates') return a.activityType === 'WhatsApp';
                      if (subFilter === 'Broadcast') return a.activityType === 'Broadcast';
                      if (subFilter === 'Visits') return a.activityType === 'Visit';
                      if (subFilter === 'Quotes') return a.activityType === 'Quote';
                      if (subFilter === 'Payments') return a.activityType === 'Payment';
                      return true;
                    });
                    
                      return (
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {/* Faint vertical line connecting the icons */}
                          <div style={{ position: 'absolute', top: '20px', bottom: '20px', left: '19px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                          
                          {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity: any) => {
                              // Define Icon and Color based on Activity Type
                              let Icon = Activity;
                              let iconBg = '#94a3b8';
                              let iconColor = 'white';
                              
                              if (activity.activityType === 'Call') {
                                Icon = activity.direction === 'incoming' ? PhoneCall : Phone;
                                iconBg = activity.direction === 'incoming' ? '#ef4444' : '#22c55e';
                              } else if (activity.activityType === 'Lifecycle') {
                                Icon = RefreshCw;
                                iconBg = '#4f46e5';
                              } else if (activity.activityType === 'Followup') {
                                Icon = Calendar;
                                iconBg = '#22c55e';
                              } else if (activity.activityType === 'Note') {
                                Icon = FileText;
                                iconBg = '#f97316';
                              } else if (activity.activityType === 'Email') {
                                Icon = Mail;
                                iconBg = '#3b82f6';
                              } else if (activity.activityType === 'Video Call') {
                                Icon = Video;
                                iconBg = '#a855f7';
                              } else if (activity.activityType === 'WhatsApp') {
                                Icon = MessageSquare;
                                iconBg = '#22c55e';
                              } else if (activity.activityType === 'Visit') {
                                Icon = MapPin;
                                iconBg = '#eab308';
                              } else if (activity.activityType === 'Quote' || activity.activityType === 'Payment') {
                                Icon = CreditCard;
                                iconBg = '#4f46e5';
                              }

                              return (
                                <div key={activity.id} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                                  <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '50%', 
                                    background: iconBg, 
                                    color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                                  }}>
                                    <Icon size={18} />
                                  </div>
                                  
                                  {activity.activityType === 'Call' ? (
                                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          <div style={{ fontSize: '1rem', color: '#1e1b4b' }}><span style={{ fontWeight: 700 }}>{activity.activityBy}</span> {activity.description}</div>
                                          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{activity.duration}</span>
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{activity.activityTime}</div>
                                      </div>

                                      <div style={{ display: 'flex', gap: '40px', fontSize: '0.85rem', color: '#64748b', marginTop: '12px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                          <span><strong>Handled by:</strong> {activity.activityBy}</span>
                                          <span><strong>Phone number:</strong> {currentLead?.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                          <span>{activity.direction === 'outgoing' ? 'Outgoing call' : 'Incoming call'}</span>
                                          <span>{activity.direction === 'outgoing' ? 'Call answered' : 'Missed call'}</span>
                                        </div>
                                      </div>
                                      
                                      {activity.audioPlayer && <CallAudioPlayer duration={activity.duration} />}
                                    </div>
                                  ) : activity.activityType === 'Lifecycle' ? (
                                    <div style={{ flex: 1, background: '#f5f3ff', padding: '16px', borderRadius: '12px', border: '1px solid #ede9fe', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: '1rem' }}><span style={{ fontWeight: 700, color: '#4f46e5' }}>{activity.title}</span> <span style={{ color: '#4f46e5' }}>{activity.description}</span></div>
                                        <div style={{ color: '#4f46e5', fontSize: '0.85rem' }}>{activity.activityTime}</div>
                                      </div>
                                    </div>
                                  ) : activity.activityType === 'Video Call' ? (
                                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>{activity.title}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{activity.activityTime}</div>
                                      </div>
                                      <div style={{ color: '#64748b', marginBottom: '12px' }}>{activity.description}</div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' }}>
                                          <Calendar size={14} /> {activity.date}
                                        </div>
                                        {activity.hasJoinLink && (
                                          <button style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                            Join Meeting
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ) : activity.activityType === 'WhatsApp' ? (
                                    <div style={{ flex: 1, background: '#e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover' }}>
                                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{activity.date || activity.activityTime.split(' ')[0] || 'Today'}</span>
                                      </div>
                                      <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: '#dcf8c6', padding: '8px 12px', borderRadius: '8px 0 8px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'relative' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#111', marginBottom: '4px', lineHeight: '1.4' }}>
                                          {activity.description}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#64748b' }}>
                                          <span>{activity.activityTime.split(' ').pop() || '10:00 AM'}</span>
                                          <CheckCircle size={14} color="#3b82f6" style={{ marginLeft: '2px' }} />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1rem' }}>{activity.title || activity.activityType}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{activity.activityTime}</div>
                                      </div>
                                      <div style={{ color: '#64748b' }}>{activity.description}</div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>No data found.</div>
                          )}
                        </div>
                      );
                    })()}

                </div>
              </div>
              )}


              {/* Tasks Content */}
              {activeTab === 'Tasks' && (
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>
                  <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {(currentLead?.tasks && currentLead.tasks.length > 0) ? (
                      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ position: 'absolute', top: '20px', bottom: '20px', left: '19px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                        {currentLead.tasks.map((task: any, idx: number) => (
                          <div key={task.id || idx} style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, border: '4px solid #f8fafc' }}>
                              <CheckSquare size={18} />
                            </div>
                            <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1.05rem' }}>{task.title}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{task.dueDate instanceof Date ? task.dueDate.toLocaleDateString() : task.dueDate}</div>
                              </div>
                              {task.description && (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
                                  {task.description}
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', background: task.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: task.status === 'Completed' ? '#166534' : '#854d0e' }}>
                                  {task.status || 'Pending'}
                                </span>
                                {task.priority && (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', background: task.priority === 'High' ? '#fee2e2' : '#f1f5f9', color: task.priority === 'High' ? '#991b1b' : '#475569' }}>
                                    {task.priority} Priority
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              )}





              

            </div>
          </motion.div>
      )}
    </AnimatePresence>

      {showEditLead && (
        <EditContactDrawer 
          isOpen={showEditLead}
          onClose={() => setShowEditLead(false)} 
          lead={currentLead}
          onSave={(data: any, changes: string[]) => { 
            const updated = { ...data };
            if (changes && changes.length > 0) {
              const changeDesc = changes.join(', ');
              updated.activities = [
                { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: data.status, activityType: 'Lead Updated', category: 'Update', title: 'Lead details updated', description: changeDesc, activityBy: CURRENT_USER },
                ...(updated.activities || [])
              ];
            }
            updateLead(updated);
            setShowEditLead(false); 
          }} 
        />
      )}

      {showAddTag && (
        <AddTagDrawer 
          isOpen={showAddTag}
          onClose={() => setShowAddTag(false)} 
          lead={currentLead}
          onSave={(data: any, changes: string[]) => { 
            const updated = { ...data };
            if (changes && changes.length > 0) {
              const changeDesc = changes.join(', ');
              updated.activities = [
                { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: data.status, activityType: 'Tags Updated', category: 'Update', title: 'Lead tags updated', description: changeDesc, activityBy: CURRENT_USER },
                ...(updated.activities || [])
              ];
            }
            updateLead(updated);
            setShowAddTag(false); 
          }} 
        />
      )}

      {/* Drawers */}
      <AnimatePresence>
        {showLinkBusiness && (
          <div key="link-business-drawer" style={{ position: 'fixed', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
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
          <div key="link-contact-drawer" style={{ position: 'fixed', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
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
          <AddToListDrawer 
            key="add-to-list-drawer"
            isOpen={showAddToList}
            onClose={() => setShowAddToList(false)} 
            lead={currentLead}
            onSave={(listName: string) => handleCreateList(listName)} 
          />
        )}
        
        {showChangeCategory && (
          <ChangeCategoryModal 
            key="change-category-modal"
            isOpen={showChangeCategory}
            onClose={() => setShowChangeCategory(false)}
            lead={currentLead}
            onSave={(updatedLead: any, changes: string[]) => {
              const toSave = { ...updatedLead };
              if (changes && changes.length > 0) {
                const changeDesc = changes.join(', ');
                toSave.activities = [
                  { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: toSave.status, activityType: 'Category Changed', category: 'Update', title: 'Lead category changed', description: changeDesc, activityBy: CURRENT_USER },
                  ...(toSave.activities || [])
                ];
              }
              updateLead(toSave);
              setShowChangeCategory(false);
            }}
          />
        )}

        <AddNoteModal key="add-note-modal" isOpen={showAddNote} onClose={() => setShowAddNote(false)} lead={currentLead} />

        {showNextFollowupDrawer && (
          <div key="next-followup-drawer" style={{ position: 'fixed', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
             <motion.div initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}} transition={{type: 'tween'}} style={{ width: '500px', background: 'white', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Changing next followup date time for {currentLead.phone || currentLead.mobile || currentLead.name}</h3>
                  <button onClick={() => { setShowNextFollowupDrawer(false); setFollowupOption(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'block', fontSize: '1rem', marginBottom: '12px', color: '#1e1b4b' }}>Set next Followup date & time:</label>
                  <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
                    {['In 2 Hours', 'Tomorrow', 'In 2 Days', 'Later This Week', 'Next Week'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => setFollowupOption(opt)}
                        style={{
                          flex: 1, padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                          background: followupOption === opt ? '#f8fafc' : 'white',
                          fontWeight: followupOption === opt ? 600 : 400,
                          borderRight: opt !== 'Next Week' ? '1px solid #e2e8f0' : 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <button 
                      onClick={() => {
                        const updated: any = { ...currentLead, nextFollowUp: null };
                        updated.activities = [
                          { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: currentLead.status, activityType: 'Followup', category: 'Followup', description: 'Follow-up cleared', activityBy: 'System' },
                          ...(updated.activities || [])
                        ];
                        updateLead(updated);
                        setShowNextFollowupDrawer(false);
                        setFollowupOption(null);
                      }}
                      style={{ padding: '10px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Reset
                    </button>
                    <button 
                      disabled={!followupOption}
                      onClick={() => {
                        if (followupOption) {
                          const formattedDate = calculateFollowupDate(followupOption);
                          const updated: any = { ...currentLead, nextFollowUp: formattedDate };
                          updated.activities = [
                            { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: currentLead.status, activityType: 'Followup', category: 'Followup', description: `Next followup scheduled: ${formattedDate}`, activityBy: 'System' },
                            ...(updated.activities || [])
                          ];
                          updateLead(updated);
                          setShowNextFollowupDrawer(false);
                          setFollowupOption(null);
                        }
                      }}
                      style={{ 
                        padding: '10px 24px', 
                        background: followupOption ? '#e2e8f0' : '#f1f5f9',
                        color: followupOption ? '#1e1b4b' : '#94a3b8',
                        border: 'none', borderRadius: '6px', fontWeight: 600, cursor: followupOption ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}

      </AnimatePresence>

      <RequestPaymentModal isOpen={showRequestPayment} onClose={() => setShowRequestPayment(false)} lead={currentLead} />

      <SetupWarningModal isOpen={showSetupWarning} onClose={() => setShowSetupWarning(false)} onProceed={() => { setShowSetupWarning(false); setShowQuotationDefaults(true); }} />
      <QuotationDefaultsWorkspaceModal isOpen={showQuotationDefaults} onClose={() => setShowQuotationDefaults(false)} onProceedAfterSave={() => { setShowQuotationDefaults(false); setShowQuotationDraft(true); alert('Quotation Draft flow opens here!'); }} />

      <CreateUpdateTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        lead={currentLead}
      />

      <CreateUpdateDealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        lead={currentLead}
      />

      <CreateAdHocTaskModal
        isOpen={showCreateAdHocTask}
        onClose={() => setShowCreateAdHocTask(false)}
        lead={currentLead}
      />

      <ViewPaymentsDrawer
        isOpen={showViewPayments}
        onClose={() => setShowViewPayments(false)}
        lead={currentLead}
      />

      <AddDocumentDrawer
        isOpen={showAddDocument}
        onClose={() => setShowAddDocument(false)}
        lead={currentLead}
      />

      <VideoCallDrawer
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        lead={currentLead}
      />

      <LogVisitDrawer
        isOpen={showLogVisit}
        onClose={() => setShowLogVisit(false)}
        lead={currentLead}
      />

      <LogCallOutcomeDrawer
        isOpen={showLogCallOutcome}
        onClose={() => setShowLogCallOutcome(false)}
        lead={currentLead}
      />

      <AssignLeadsModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        leads={[currentLead]}
      />
    </>
  );
}
