
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Mail, Building2, Users, List,
  MessageSquare, FileText, ChevronDown, Clock, Star, MapPin, Tag, Briefcase, 
  Settings, File, Plus, User, Download, Upload, CheckCircle, Activity,
  MoreVertical, Calendar, Eye, Send, ArrowRight, ArrowRightCircle
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { EditLeadModal } from './EditLeadModal';
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
import { QuotationDefaultsWorkspaceModal } from './QuotationDefaultsWorkspaceModal';
import { RequestPaymentModal } from './RequestPaymentModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadProfileModal({ isOpen, onClose, lead }: Props) {
  const { leads, updateLead, deleteLead, deals, updateDeal, tasks, businessLeads, documents, uploadDocument, dealStages , quotationDefaults, leadLifecycleStages } = useCRM();
  const { openSharedInbox } = useInbox();
  const CURRENT_USER = 'Abhay';
  
  // Use the active lead from context so it stays updated
  const currentLead = leads.find(l => l.id === lead?.id) || lead;

  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);
  const [showChangeCategory, setShowChangeCategory] = useState(false);
  const [showLogCallOutcome, setShowLogCallOutcome] = useState(false);
  const [showMoveStage, setShowMoveStage] = useState(false);
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
  
  // Modals for associations
  const [showLinkBusiness, setShowLinkBusiness] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  
  const [showLinkContact, setShowLinkContact] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contactType, setContactType] = useState('Client');
  const [contactRel, setContactRel] = useState('Primary');
  
  const [listName, setListName] = useState('');

  const [noteText, setNoteText] = useState('');
  const [expandedActivity, setExpandedActivity] = useState(false);

  useGlobalEscape(!!isOpen && !actionMenuOpen && !showEditLead && !showLinkBusiness && !showLinkContact && !showAddToList && !showChangeCategory && !showMoveStage && !showAddNote, () => { onClose() });
  useGlobalEscape(!!actionMenuOpen, () => { setActionMenuOpen(false) });
  useGlobalEscape(!!showEditLead, () => { setShowEditLead(false) });
  useGlobalEscape(!!showLinkBusiness, () => { setShowLinkBusiness(false) });
  useGlobalEscape(!!showLinkContact, () => { setShowLinkContact(false) });
  useGlobalEscape(!!showAddToList, () => { setShowAddToList(false) });
  useGlobalEscape(!!showChangeCategory, () => { setShowChangeCategory(false) });
  useGlobalEscape(!!showMoveStage, () => { setShowMoveStage(false) });
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

  const handleActionClick = (actionName: string) => {
    setActionMenuOpen(false);
    switch (actionName) {
        case 'Edit Lead': setShowEditLead(true); break;
        case 'Add Tag': setShowAddTag(true); break;
        case 'Add Business': setShowLinkBusiness(true); break;
        case 'Link Contact': setShowLinkContact(true); break;
        case 'Add To List': setShowAddToList(true); break;
        case 'Change Category': setShowChangeCategory(true); break;
        case 'Move Stage': setShowMoveStage(true); break;
        case 'Add Note': setShowAddNote(true); break;
        case 'Log Call': setShowLogCallOutcome(true); break;
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
        case 'Send Quote':
          if (!quotationDefaults.isConfigured) {
            setShowSetupWarning(true);
          } else {
            setShowQuotationDraft(true); // TODO: actual quote drafting modal
            alert('Quotation Draft flow opens here!');
          }
          break;
        case 'WhatsApp': handleWhatsApp(); break;
        case 'Delete Lead':
            if (confirm(`Are you sure you want to delete ${currentLead.name}?`)) {
                deleteLead([currentLead.id]);
                onClose();
            }
            break;
        default: break;
    }
  };

  const handleCall = () => {
    addActivity('Call', 'Initiated outbound call');
    window.location.href = `tel:${currentLead.phone || '263437669'}`;
  };

  const handleWhatsApp = () => {
    openSharedInbox({ entityType: 'lead', entityId: currentLead.id });
    onClose();
  };

  const handleStageChange = (newStage: string) => {
    // 1. Update the Lead
    const updatedLead = { ...currentLead, status: newStage };
    
    // 2. Add Activity
    updatedLead.activities = [
        { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: newStage, activityType: 'Stage Change', category: 'Activity', description: `Moved stage to ${newStage}`, activityBy: CURRENT_USER },
        ...(updatedLead.activities || [])
    ];
    updateLead(updatedLead);

    // 3. Update Deal if exists
    const activeDeals = deals.filter(d => d.leadId === currentLead.id || d.leadName === currentLead.name);
    if (activeDeals.length > 0) {
      // Find matching stage in dealStages if possible
      let finalDealStage = newStage;
      if (newStage === 'Lost') finalDealStage = 'Deal Lost';
      if (newStage === 'Admitted' || newStage === 'Enrolled') finalDealStage = 'Deal Won';
      
      const deal = activeDeals[0];
      updateDeal({
        ...deal,
        stage: dealStages.includes(finalDealStage) ? finalDealStage : (dealStages.includes(newStage) ? newStage : deal.stage),
        status: finalDealStage.includes('Won') ? 'Won' : finalDealStage.includes('Lost') ? 'Lost' : 'Open',
        lastActivityTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recentActions: [
          { id: Math.random().toString(36).substring(7), action: `Moved to ${finalDealStage}`, date: new Date().toISOString(), by: CURRENT_USER },
          ...(deal.recentActions || [])
        ]
      });
    }

    setShowMoveStage(false);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addActivity('Note', noteText, 'Note');
    setNoteText('');
    setShowAddNote(false);
  };

  // Drawer Submit handlers
  const handleLinkBusiness = (b: any) => {
    const updated = { ...currentLead, associatedBusiness: b };
    updateLead(updated);
    addActivity('Business Linked', `Linked to business: ${b.name || b.company}`);
    setShowLinkBusiness(false);
  };

  const handleCreateList = (listName: string) => {
    if(!listName.trim()) return;
    const updated = { ...currentLead };
    updated.lists = [...(updated.lists || []), listName];
    updateLead(updated);
    addActivity('Added to List', `Added to list: ${listName}`);
    setShowAddToList(false);
  };

  const handleLinkContact = () => {
    if(!contactSearch.trim()) return;
    const c = { id: Date.now().toString(), name: contactSearch, type: contactType, rel: contactRel };
    const updated = { ...currentLead };
    updated.associatedContacts = [...(updated.associatedContacts || []), c];
    updateLead(updated);
    addActivity('Contact Linked', `Linked contact: ${contactSearch} (${contactRel})`);
    setShowLinkContact(false);
    setContactSearch('');
  };

  const handleRemoveContact = (cId: string) => {
    const updated = { ...currentLead };
    updated.associatedContacts = updated.associatedContacts.filter((c: any) => c.id !== cId);
    updateLead(updated);
    addActivity('Contact Unlinked', `Removed associated contact.`);
  };

  // Helper calculations
  const calculateDaysAgo = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  };

  const leadAge = calculateDaysAgo(currentLead.createdAt || currentLead.date);
  
  // Find time in current stage
  const lastStageChange = currentLead.activities?.find((a: any) => a.activityType === 'Stage Change');
  const timeInStage = lastStageChange ? calculateDaysAgo(lastStageChange.activityTime) : leadAge;

  // Active Opportunities
  const activeDeals = deals.filter(d => d.leadId === currentLead.id || d.leadName === currentLead.name);
  
  // Next Step / Tasks
  const leadTasks = tasks.filter(t => t.assignedTo?.toLowerCase().includes(currentLead.name?.toLowerCase()) || t.leadId === currentLead.id).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const openTasks = leadTasks.filter(t => t.status !== 'Completed');
  const nextTask = openTasks[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Extracted Stages from mock data
  const allLeadStages = leadLifecycleStages.map(s => s.name);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
      zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          width: '1200px', maxWidth: '95vw', height: '90vh', background: '#f8fafc',
          borderRadius: '16px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)', overflow: 'hidden',
          position: 'relative', zIndex: 100001
        }}
        onClick={(e) => { e.stopPropagation(); if (actionMenuOpen) setActionMenuOpen(false); }}
      >
        {/* TOP LEAD HEADER */}
        <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {currentLead.name?.[0]}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{currentLead.name}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>[{currentLead.status}]</span>
              <span>·</span>
              <span>{leadAge} days old</span>
              <span>·</span>
              <span>{timeInStage}d in stage</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> {currentLead.owner || currentLead.counselor || CURRENT_USER}</span>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handleWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', color: '#10b981', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              <MessageSquare size={16} /> WhatsApp
            </button>
            <button onClick={handleCall} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', color: '#3b82f6', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              <Phone size={16} /> Call
            </button>
            <button onClick={() => setShowMoveStage(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', color: '#0f172a', border: '1px solid #0f172a', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              <ArrowRightCircle size={16} /> Move Stage
            </button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setActionMenuOpen(!actionMenuOpen); }} style={{ padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ACTION <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {actionMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '220px', zIndex: 100, overflow: 'hidden', padding: '8px' }}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '8px 12px', textTransform: 'uppercase' }}>Contact</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Edit Lead')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><FileText size={16} /> Edit Lead</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Add Tag')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Tag size={16} /> Add Tag</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Add Business')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Building2 size={16} /> Add Business</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Link Contact')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Users size={16} /> Link Contact</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Add To List')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><List size={16} /> Add To List</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Change Category')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Briefcase size={16} /> Change Category</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Delete Lead')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#ef4444' }}><X size={16} /> Delete Lead</div>
                    
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '8px 12px', textTransform: 'uppercase' }}>Activity</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Log Call Outcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Phone size={16} /> Log Call Outcome</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Add Note')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><File size={16} /> Add Note</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Log Visit')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><MapPin size={16} /> Log Visit</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('WhatsApp')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><MessageSquare size={16} /> WhatsApp</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Add Document')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><FileText size={16} /> Add Document</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('View Follow-up')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Eye size={16} /> View Follow-up</div>

                    <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '8px 12px', textTransform: 'uppercase' }}>Sales</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Create/Update Deal')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Briefcase size={16} /> Create/Update Deal</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Move Stage')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><ArrowRightCircle size={16} /> Move Stage</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Create Follow-up')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><Calendar size={16} /> Create Follow-up</div>
                    <div className="dropdown-item-hover" onClick={() => handleActionClick('Assign Lead')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 500, color: '#334155' }}><User size={16} /> Assign Lead</div>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid transparent', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '8px' }}><X size={18} /></button>
          </div>
        </div>

        {/* VISUAL PROGRESS INDICATOR */}
        <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', minWidth: '800px' }}>
            <div style={{ position: 'absolute', top: '12px', left: '20px', right: '20px', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
            {leadLifecycleStages.map((stage, idx) => {
              const isActive = stage.name === currentLead.status;
              const currentIndex = leadLifecycleStages.findIndex(s => s.name === currentLead.status);
              const isPast = currentIndex > idx;
              
              // Progress bar fill logic (between nodes)
              const hasLineFill = isPast || isActive;
              
              return (
                <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1, flex: 1, position: 'relative' }}>
                  {/* The connected line fill (left half) */}
                  {idx > 0 && (
                    <div style={{ position: 'absolute', top: '12px', left: '-50%', width: '100%', height: '2px', background: isPast || isActive ? '#10b981' : 'transparent', zIndex: -1 }} />
                  )}
                  
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: isActive ? '#3b82f6' : (isPast ? '#10b981' : '#f8fafc'), 
                    border: `2px solid ${isActive ? '#3b82f6' : (isPast ? '#10b981' : '#cbd5e1')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                    {isPast && <CheckCircle size={14} />}
                    {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: isActive ? 700 : 500, 
                    color: isActive ? '#3b82f6' : (isPast ? '#10b981' : '#64748b'), 
                    textAlign: 'center', 
                    width: '100%',
                    padding: '0 4px',
                    wordBreak: 'break-word',
                    lineHeight: '1.2'
                  }}>
                    {stage.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* BODY (2 COLUMNS) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT SIDEBAR - LEAD INFO PANEL */}
          <div style={{ width: '340px', background: 'white', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
            
            {/* Contact Details */}
            <div style={{ padding: '24px', borderBottom: '1px dashed #e2e8f0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <a href={`tel:${currentLead.phone || '263437669'}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} /></div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{currentLead.phone || '263437669'}</div>
                  </div>
                </a>
                <a href={`mailto:${currentLead.email || 'hadimanipavan802@gmail.com'}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={16} /></div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentLead.email || 'hadimanipavan802@gmail.com'}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Custom Fields */}
            <div style={{ padding: '24px', borderBottom: '1px dashed #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ABOUT</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Interested In', value: currentLead.interestedIn || currentLead['Interested In'] },
                  { label: 'Current Company Type', value: currentLead.companyType },
                  { label: 'Experience Level', value: currentLead.experienceLevel },
                  { label: 'What are you looking for', value: currentLead.whatLookingFor || currentLead.lookingFor },
                  { label: 'Career Goal', value: currentLead.careerGoal },
                  { label: 'Enrollment Timeline', value: currentLead.enrollmentTimeline },
                  { label: 'Technical Background', value: currentLead.technicalBackground },
                  { label: 'Lead Source', value: currentLead.source },
                  { label: 'Lead Tag', value: currentLead.tags?.join(', ') },
                  { label: 'Deal Stage', value: activeDeals[0]?.stage },
                  { label: 'Lead Lifecycle', value: currentLead.leadLifecycleName || 'Standard' }
                ].map((field, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{field.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: field.value ? '#0f172a' : '#cbd5e1' }}>{field.value || 'NA'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Journey */}
            <div style={{ padding: '24px', flex: 1 }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.5px' }}>LEAD JOURNEY</h3>
              
              <div style={{ position: 'relative', marginLeft: '12px' }}>
                <div style={{ position: 'absolute', top: '12px', bottom: '12px', left: '11px', width: '2px', background: '#e2e8f0', zIndex: 0 }} />
                
                {currentLead.activities?.filter((a: any) => a.activityType === 'Stage Change' || a.activityType === 'Lead Creation' || a.activityType === 'Lead Assignment').map((act: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? '#10b981' : 'white', color: idx === 0 ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: idx === 0 ? '2px solid white' : '2px solid #e2e8f0' }}>
                      <CheckCircle size={12} fill="currentColor" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{act.activityType === 'Stage Change' ? act.description : act.activityType}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{getTimeAgo(act.activityTime)}</div>
                    </div>
                  </div>
                ))}
                
                {(!currentLead.activities || currentLead.activities.length === 0) && (
                  <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid white' }}>
                      <CheckCircle size={12} fill="currentColor" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Lead Created</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{getTimeAgo(currentLead.createdAt || currentLead.date)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT MAIN CONTENT (Relationship Driven) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', padding: '24px', overflowY: 'auto', gap: '24px' }}>
            
            {/* NEXT STEP / FOLLOW-UP */}
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>NEXT STEP</h3>
              {nextTask ? (
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={16} /></div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{nextTask.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Due: {new Date(nextTask.dueDate).toLocaleDateString()} · Assigned to {nextTask.assignedTo}</div>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>{nextTask.status}</span>
                </div>
              ) : (
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  <Calendar size={16} /> <span style={{ fontSize: '0.9rem' }}>No open follow-ups. <span onClick={() => handleActionClick('Add Note')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Create one</span></span>
                </div>
              )}
            </div>

            {/* ACTIVE OPPORTUNITIES */}
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>ACTIVE OPPORTUNITIES</h3>
              {activeDeals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeDeals.map(deal => (
                    <div key={deal.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={16} /></div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>DEAL - {deal.leadName}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>[{deal.stage}]</span> · {formatCurrency(deal.revenue || 0)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Last Moved: {getTimeAgo(deal.updatedAt || deal.lastActivityTime)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  <Briefcase size={16} /> <span style={{ fontSize: '0.9rem' }}>No active opportunities. <span onClick={() => setShowMoveStage(true)} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Create Deal</span></span>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* ASSOCIATED BUSINESS */}
              <div>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>ASSOCIATED BUSINESS</h3>
                {currentLead.associatedBusiness ? (
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} /></div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{currentLead.associatedBusiness.company || currentLead.associatedBusiness.name}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                    <Building2 size={16} /> <span style={{ fontSize: '0.9rem' }}>No business linked yet. <span onClick={() => handleActionClick('Add Business')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Link Business</span></span>
                  </div>
                )}
              </div>

              {/* ASSOCIATED CONTACT */}
              <div>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>ASSOCIATED CONTACT</h3>
                {currentLead.associatedContacts && currentLead.associatedContacts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentLead.associatedContacts.map((c: any) => (
                      <div key={c.id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.rel} ({c.type})</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                    <Users size={16} /> <span style={{ fontSize: '0.9rem' }}>No contacts linked yet. <span onClick={() => handleActionClick('Link Contact')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Link Contact</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* LIST MEMBERSHIPS */}
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                LIST MEMBERSHIPS
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <button onClick={() => handleActionClick('Add To List')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>+ Add to List</button>
              </div>
              {currentLead.lists && currentLead.lists.length > 0 ? (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>List Name</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Source</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLead.lists.map((l: string, i: number) => (
                        <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{l}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>Manual</td>
                          <td style={{ padding: '12px 16px', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}>Remove</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  <List size={16} /> <span style={{ fontSize: '0.9rem' }}>Not a member of any lists.</span>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITY */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  LAST ACTIVITY · {currentLead.activities && currentLead.activities.length > 0 ? getTimeAgo(currentLead.activities[0].activityTime) : 'Never'}
                </h3>
                <span onClick={() => setExpandedActivity(!expandedActivity)} style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                  {expandedActivity ? 'Collapse' : `Recent Activity (${currentLead.activities?.length || 0})`}
                </span>
              </div>
              
              {expandedActivity && currentLead.activities && currentLead.activities.length > 0 && (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ position: 'relative', marginLeft: '12px' }}>
                    <div style={{ position: 'absolute', top: '12px', bottom: '12px', left: '11px', width: '2px', background: '#e2e8f0', zIndex: 0 }} />
                    {currentLead.activities.map((act: any, idx: number) => (
                      <div key={act.id || idx} style={{ display: 'flex', gap: '16px', marginBottom: idx === currentLead.activities.length - 1 ? 0 : '24px', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #e2e8f0' }}>
                          <Activity size={12} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{act.activityBy || CURRENT_USER} logged a {act.activityType}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(act.activityTime).toLocaleString()}</div>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            {act.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>

      {/* MODALS & DRAWERS */}
      
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
      {showEditLead && <EditLeadModal lead={currentLead} onClose={() => setShowEditLead(false)} onSave={(updatedLead: any) => { updateLead(updatedLead); setShowEditLead(false); }} />}

      {/* Move Stage Modal */}
      <AnimatePresence>
        {showMoveStage && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 100005, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '400px', background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Move Stage</h3>
                  <button onClick={() => setShowMoveStage(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                  {allLeadStages.map(s => (
                    <div key={s} onClick={() => handleStageChange(s)} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: currentLead.status === s ? '#eff6ff' : 'white', borderColor: currentLead.status === s ? '#3b82f6' : '#e2e8f0' }}>
                      <span style={{ fontWeight: 500, color: currentLead.status === s ? '#3b82f6' : '#0f172a' }}>{s}</span>
                      {currentLead.status === s && <CheckCircle size={16} color="#3b82f6" />}
                    </div>
                  ))}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        <AddNoteModal isOpen={showAddNote} onClose={() => setShowAddNote(false)} lead={currentLead} />
      </AnimatePresence>

      {/* Right side Drawers (Business, Contact, List) */}
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
                  
                  {currentLead.associatedContacts && currentLead.associatedContacts.length > 0 && (
                     <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '12px', display: 'block' }}>Remove Association</label>
                        {currentLead.associatedContacts.map((c: any) => (
                           <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px' }}>
                              <div><div style={{ fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.rel} ({c.type})</div></div>
                              <button onClick={() => handleRemoveContact(c.id)} style={{ padding: '4px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Remove</button>
                           </div>
                        ))}
                     </div>
                  )}
                </div>
             </motion.div>
          </div>
        )}

        {showAddToList && (
        <AddToListDrawer 
          isOpen={showAddToList}
          onClose={() => setShowAddToList(false)} 
          lead={currentLead}
          onSave={(listName: string) => handleCreateList(listName)} 
        />
      )}

      {showChangeCategory && (
        <ChangeCategoryModal 
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
    </div>
  );
}
