'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Save, Bell, ChevronDown, PhoneCall, PhoneOutgoing, PhoneIncoming, Activity, X,
  Users, TrendingUp, TrendingDown, LayoutDashboard, Target, Clock, MessageSquare, Phone, 
  ChevronRight, ChevronLeft, CheckSquare, UserPlus, UserCheck, RefreshCw, CalendarCheck, Bot, 
  AlertTriangle, PhoneMissed, XCircle, Briefcase, Zap, Plus, CheckCircle 
} from 'lucide-react';
import { DashboardWidgetMenu } from '../DashboardWidgetMenu';
import { DefaultDashboardDetailsModal } from '../modals/DefaultDashboardDetailsModal';
import { WorkPipelineListModal } from '../modals/WorkPipelineListModal';
import { AdHocTasksModal } from '../modals/AdHocTasksModal';
import { OverallActivitiesDetailsModal } from '../modals/OverallActivitiesDetailsModal';
import UserProfileModal from './UserProfileModal';
import { LeadWorkspaceModal } from '../modals/LeadWorkspaceModal';
import { UserWorkspaceModal } from '../modals/UserWorkspaceModal';
import { LeadPreviewModal } from '../modals/LeadPreviewModal';
import { CustomTrackingMetrics } from './CustomTrackingMetrics';
import { CallingTrendChart } from './CallingTrendChart';
import { TeamPulseChart } from './TeamPulseChart';
import { LeadSourceDistribution } from './LeadSourceDistribution';
import { StageBreakdownCards } from './StageBreakdownCards';
import { UserLeadAssignment } from './UserLeadAssignment';

import { ThumbsUp, ThumbsDown, FileText } from 'lucide-react';

import { QuickCreateMenu } from '../menus/QuickCreateMenu';
import { QuickCreateModalManager } from '../modals/QuickCreateModalManager';
import { CustomDateRangeModal } from '../modals/CustomDateRangeModal';
import { useCRM } from '@/contexts/CRMContext';

const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Last Year', 'Custom Range'];

export function AdminDashboardDefault() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 7 Days'); // Default as per requirements to show 299 leads
  const [activePipeline, setActivePipeline] = useState('All');
  const [activeModal, setActiveModal] = useState<{title: string, type: string} | null>(null);
  const [activeUserProfile, setActiveUserProfile] = useState<any>(null);
  const [selectedLeadForProfile, setSelectedLeadForProfile] = useState<any | null>(null);
  const [fullSelectedLeadForProfile, setFullSelectedLeadForProfile] = useState<any | null>(null);
  const [userActivitySearch, setUserActivitySearch] = useState('');
  const [selectedUserForLeads, setSelectedUserForLeads] = useState<string | null>(null);
  const [activePipelineModal, setActivePipelineModal] = useState<{title: string, count: number, filterState: any} | null>(null);
  const [adHocTasksOpen, setAdHocTasksOpen] = useState(false);
  const [activeActivitiesTitle, setActiveActivitiesTitle] = useState<string | null>(null);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [activeQuickCreateForm, setActiveQuickCreateForm] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState('Updated Just Now');

  const { leads, students, applications, calls, tasks } = useCRM();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState<any | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('fortivex_dashboard_prefs');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.dateFilter) setDateFilter(config.dateFilter);
        if (config.activePipeline) setActivePipeline(config.activePipeline);
      } catch (e) {
        console.error('Error parsing dashboard config', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem('fortivex_dashboard_prefs', JSON.stringify({
      dateFilter,
      activePipeline
    }));
    showToast('Dashboard Saved Successfully');
  };

  const handleCardClick = (title: string) => {
    // KPI Cards are DISPLAY ONLY as per user request
    // DO NOT navigate or open modals for KPI cards
  };

  // -------------------------------------------------------------
  // Comprehensive Global Mock Data Generation Logic
  // -------------------------------------------------------------
  const dashboardData = useMemo(() => {
    let mockLeadCount = 0;
    
    // Exact requested values
    if (dateFilter === 'Today') {
      mockLeadCount = 0;
    } else if (dateFilter === 'Last 7 Days') {
      mockLeadCount = 299;
    } else if (dateFilter === 'Yesterday') {
      mockLeadCount = 45;
    } else if (dateFilter === 'Last 30 Days' || dateFilter === 'This Month') {
      mockLeadCount = 1250;
    } else if (dateFilter === 'Last Month') {
      mockLeadCount = 1100;
    } else if (dateFilter === 'Last Year') {
      mockLeadCount = 14500;
    } else {
      mockLeadCount = 500; // Custom Range
    }

    const team = ['Pavan S.H', 'Thanushree BR', 'Parikshit', 'Spoorthi', 'Yashwanth', 'Abhishek', 'Padmesh'];
    const currentUser = 'Pavan S.H';
    const sources = ['Website', 'Referral', 'Social Media', 'Direct', 'Google Ads', 'LinkedIn'];
    const products = ['CRM Basic', 'CRM Pro', 'Enterprise API', 'Consulting'];

    // Generate fully fleshed-out mock leads with 70+ columns
    const leads = Array.from({ length: mockLeadCount }).map((_, i) => {
      const isContacted = i % 5 === 1 || i % 5 === 2;
      const isClosed = i % 15 === 0;
      
      let status = 'New Lead';
      if (isClosed) status = 'Admitted';
      else if (isContacted) status = 'Contacted';
      else if (i % 7 === 0) status = 'Opportunity';
      else if (i % 10 === 0) status = 'Prospecting';

      const source = sources[i % sources.length];
      const assignedTo = team[i % team.length];

      return {
        id: `L-${10000 + i}`,
        'Lead Name': `Mock Lead ${i}`,
        'Lead Owner': assignedTo,
        'Assigned Counselor': assignedTo,
        'Lead Stage': status,
        'Sub Stage/Close Status': isClosed ? 'Won' : 'Open',
        'Closed On': isClosed ? '2024-05-20' : '-',
        'Awaiting First Two Attempts': i % 8 === 0 ? 'Yes' : 'No',
        'Last Worked': '2024-05-15',
        'Started Working On': '2024-05-10',
        'Speed To First': `${Math.floor(Math.random() * 24)}h`,
        'Next Follow-up': '2024-05-21',
        'Became Opportunity': i % 7 === 0 ? 'Yes' : 'No',
        'Tags': i % 2 === 0 ? 'High Priority' : 'Standard',
        'Product/Service': products[i % products.length],
        'Recent Actions': 'Emailed',
        'Unanswered Calls': Math.floor(Math.random() * 3),
        'Missed Calls': Math.floor(Math.random() * 2),
        'Remark': 'Interested in Pro',
        'Next Open Task': 'Call back',
        'Open Ticket': i % 20 === 0 ? 'T-101' : '-',
        'Last Closed Task': 'Sent quote',
        'Deal Stage': status,
        'Lead Disposition': 'Interested',
        'Last Disposition': 'Callback requested',
        'Business': 'Acme Corp',
        'Mobile Number': `+91 98765${String(43210 + i).substring(0,5)}`,
        'Email': `lead${i}@example.com`,
        'Address': '123 Main St',
        'State': 'Karnataka',
        'City': 'Bangalore',
        'Area': 'Indiranagar',
        'Country': 'India',
        'Zip Code': '560038',
        'Designation': 'Manager',
        'Lead Type': 'B2B',
        'Lead Priority': 'Hot',
        'Lead Source': source,
        'Source Level 2/3/4': 'Organic/Google/Search',
        'Last Engagement': '2 days ago',
        'Last Payment': isClosed ? '2024-05-20' : '-',
        'Last Payment Amount': isClosed ? '₹50,000' : '-',
        'Total Payment': isClosed ? '₹50,000' : '₹0',
        'Last Call Time': '2024-05-15 10:30',
        'Last Call Duration': '05:20',
        'Last Call Direction': 'Outbound',
        'Last Call Outcome': 'Connected',
        'Last Called By': assignedTo,
        'Last Visit': '-',
        'Last Visit Outcome': '-',
        'Last Visit By': '-',
        'Last Email': '2024-05-14',
        'Last Email By': assignedTo,
        'Last WhatsApp': '2024-05-13',
        'Last WhatsApp By': assignedTo,
        'Last Broadcast': '-',
        'Last Broadcast Reply': '-',
        'Last Note': 'Sent proposal',
        'Last Note By': assignedTo,
        'Last Task Done': 'Discovery call',
        'Last Task By': assignedTo,
        'Lead Added By': 'System',
        'Assigned Status': 'Assigned',
        'Assigned On': '2024-05-10',
        'Last Repeat Inquiry': '-',
        'Created': '2024-05-10',
        'Created Date': '2024-05-10',
        'Last Updated': '2024-05-15',
        'Is Duplicate': 'No',
        'Interested In': products[i % products.length],
        'Current Company': 'Acme Corp',
        'Experience Level': 'Mid-level',
        'What You Do': 'Software',
        'Career Goal': 'Growth',
        'Enrollment Time': 'Immediately',
        'Technical Background': 'Yes',
        
        // properties used for generic access
        name: `Mock Lead ${i}`,
        status,
        assignedTo,
        source,
        createdAt: '2024-05-10'
      };
    });

    const pipelineFilteredLeads = leads.filter(l => {
      if (activePipeline === 'My' && l['Lead Owner'] !== currentUser) return false;
      return true;
    });

    // KPI mapping
    const newInquiryLeads = pipelineFilteredLeads.filter(l => l.status === 'New Lead');
    
    // Total Leads Worked = any lead with an activity/contact
    const totalLeadsWorked = pipelineFilteredLeads.filter(l => l.status !== 'New Lead');
    const callAttemptedLeads = totalLeadsWorked;
    const closedLeads = pipelineFilteredLeads.filter(l => l.status === 'Admitted');

    // Work Pipeline
    const wpNewLeads = newInquiryLeads;
    const wpNewlyAssigned = pipelineFilteredLeads.filter(l => l.status !== 'New Lead' && Math.random() > 0.5); // Random subset for demo
    
    // Ad-hoc tasks mock
    const wpAdHocTasks = Array.from({ length: Math.floor(mockLeadCount * 0.1) }).map((_, i) => ({
       id: `T-${i}`, title: `Task ${i}`, owner: team[i % team.length], 'Lead Name': `Mock Lead ${i}`, assignedTo: team[i % team.length], status: 'Pending'
    })).filter(t => activePipeline === 'All' || t.owner === currentUser);

    // Generate exact Activities corresponding to totalLeadsWorked
    const callActivities: any[] = [];
    const connectedActivities: any[] = [];
    const outgoingActivities: any[] = [];
    const connectedOutgoingActivities: any[] = [];
    const incomingActivities: any[] = [];
    const connectedIncomingActivities: any[] = [];
    const positiveOutcomeActivities: any[] = [];
    const negativeOutcomeActivities: any[] = [];
    const noteActivities: any[] = [];
    
    // For every lead worked, generate exactly 1.5 calls on average
    totalLeadsWorked.forEach((lead, index) => {
      // 1 Call minimum
      const numCalls = (index % 2 === 0) ? 2 : 1;
      for (let c = 0; c < numCalls; c++) {
        const isConnected = c % 2 === 0;
        const isOutgoing = c % 3 !== 0;
        const act = {
           id: `ACT-${lead.id}-${c}`,
           'Lead Name': lead.name,
           'Phone Number': lead['Mobile Number'],
           'Lead Source': lead.source,
           'Call Outcome': isConnected ? (c % 4 === 0 ? 'Positive' : 'Connected') : 'No Answer',
           'Duration': isConnected ? '05:20' : '00:00',
           'Call Start Time': '2024-05-15 10:30',
           'Last Updated': '2024-05-15 10:30',
           type: 'Call',
           user: lead.assignedTo,
           date: '2024-05-15',
           status: 'Completed',
           assignedTo: lead.assignedTo
        };
        callActivities.push(act);
        if (isConnected) {
          connectedActivities.push(act);
          if (act['Call Outcome'] === 'Positive') positiveOutcomeActivities.push(act);
          else negativeOutcomeActivities.push(act);
        }
        if (isOutgoing) {
          outgoingActivities.push(act);
          if (isConnected) connectedOutgoingActivities.push(act);
        } else {
          incomingActivities.push(act);
          if (isConnected) connectedIncomingActivities.push(act);
        }
      }
      
      // Notes
      if (index % 3 === 0) {
        noteActivities.push({
           id: `NOTE-${lead.id}`,
           'Lead Name': lead.name,
           'Phone Number': lead['Mobile Number'],
           type: 'Note',
           user: lead.assignedTo,
           date: '2024-05-15',
           assignedTo: lead.assignedTo
        });
      }
    });

    const allActivities = [...callActivities, ...noteActivities];

    return {
      leads,
      pipelineFilteredLeads,
      newInquiryLeads,
      callAttemptedLeads,
      totalLeadsWorked,
      closedLeads,
      wpNewLeads,
      wpNewlyAssigned,
      wpAdHocTasks,
      mockLeadCount,
      team,
      sources,
      
      // Activities
      allActivities,
      callActivities,
      connectedActivities,
      outgoingActivities,
      connectedOutgoingActivities,
      incomingActivities,
      connectedIncomingActivities,
      positiveOutcomeActivities,
      negativeOutcomeActivities,
      noteActivities
    };

  }, [dateFilter, activePipeline]);

  // Overall Activities metrics scaled perfectly to the generated mock leads
  const totalCalls = dashboardData.callActivities.length;
  const connectedCalls = dashboardData.connectedActivities.length;
  const getSearchResults = () => {
    if (searchQuery.length <= 1) return [];
    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    leads.forEach(l => {
      if (l.name?.toLowerCase().includes(q) || l.mobile?.includes(q) || l.email?.toLowerCase().includes(q)) {
        results.push({ ...l, resultTitle: l.name, resultSubtitle: `Lead ID: ${l.id} | Team: Sales`, resultType: 'Lead' });
      }
    });
    return results.slice(0, 10);
  };
  const searchResults = getSearchResults();

  const dynamicUserActivities = [
    { name: 'Abhishek', type: 'received', duration: '00:02:10', leadName: 'Abhaya Kumar', datetime: '11/08/2026, 17:48', relativeTime: '2 days', status: 'inactive' },
    { name: 'Yashwanth', type: 'made', duration: '00:00:49', leadName: 'Raj', datetime: '09/08/2026, 09:51', relativeTime: '3 days', status: 'inactive' },
    { name: 'Parikshit', type: 'made', duration: '00:01:30', leadName: 'Anil Kumar', datetime: '13/08/2026, 11:15', relativeTime: '4 hours', status: 'active' },
    { name: 'Pavan S.H', type: 'received', duration: '00:00:00', leadName: 'Shiv Prasad', datetime: '13/08/2026, 16:00', relativeTime: 'less than a minute', status: 'active' },
    { name: 'Spoorthi', type: 'made', duration: '00:03:45', leadName: 'Nisha', datetime: '12/08/2026, 10:30', relativeTime: '1 day', status: 'active' },
    { name: 'Thanushree BR', type: 'received', duration: '00:05:12', leadName: 'Shashank', datetime: '13/08/2026, 14:20', relativeTime: '1 hour', status: 'active' },
    { name: 'Padmesh', type: 'made', duration: '00:04:30', leadName: 'Demo Lead', datetime: '14/08/2026, 10:00', relativeTime: '30 mins', status: 'active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <AnimatePresence>
        
      {activePipelineModal && (
        <WorkPipelineListModal 
          dashboardData={dashboardData as any}
          title={activePipelineModal.title} 
          count={activePipelineModal.count}
          filterState={activePipelineModal.filterState}
          onClose={() => setActivePipelineModal(null)} 
        />
      )}
      {adHocTasksOpen && (
        <AdHocTasksModal onClose={() => setAdHocTasksOpen(false)} />
      )}

      {activeModal && (
          <DefaultDashboardDetailsModal 
            title={activeModal.title} 
            type={activeModal.type} 
            onClose={() => setActiveModal(null)}
            demoData={dashboardData} // not used anymore since we have proper models
            setDemoData={() => {}}
            activePipeline={activePipeline}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSearchResult && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--glass-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {selectedSearchResult.resultType} Details
                </h3>
                <button onClick={() => setSelectedSearchResult(null)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.keys(selectedSearchResult).map(k => {
                  if (typeof selectedSearchResult[k] === 'object' || k.startsWith('result') || k === 'id') return null;
                  return (
                    <div key={k} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{String(selectedSearchResult[k] || '-')}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuickCreateForm && (
          <QuickCreateModalManager 
            activeForm={activeQuickCreateForm} 
            onClose={() => { setActiveQuickCreateForm(null); showToast(`${activeQuickCreateForm} saved successfully! Data synchronized.`); }} 
          />
        )}
      </AnimatePresence>

      <CustomDateRangeModal
        isOpen={showCustomDateModal}
        onClose={() => setShowCustomDateModal(false)}
        onApply={(start, end) => {
          setDateFilter(`${start} to ${end}`);
          setShowCustomDateModal(false);
          showToast(`Dashboard refreshed for ${start} to ${end}`);
          setLastRefreshed('Updated Just Now');
        }}
      />

      {/* TOP FILTER BAR */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <div 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                background: 'var(--bg-secondary)', borderRadius: '12px', 
                border: isSearchFocused ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                boxShadow: isSearchFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.2s', width: '100%'
              }}
            >
              <Search size={18} color="var(--text-secondary)" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search across CRM... (Ctrl + K)" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
            
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-panel"
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '400px', zIndex: 10000, maxHeight: '400px', overflowY: 'auto', padding: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', background: 'var(--bg-card)' }}
                >
                  {searchQuery.length <= 1 ? (
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Recent Searches</h4>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '16px', marginBottom: '8px', letterSpacing: '0.05em' }}>Quick Links</h4>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Search Results</h4>
                      {searchResults.length > 0 ? searchResults.map((res: any, idx) => (
                        <div 
                          key={`${res.id}-${idx}`} 
                          className="hover-bg-secondary" 
                          style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', border: '1px solid transparent' }}
                          onMouseDown={() => { setSelectedSearchResult(res); setSearchQuery(''); setIsSearchFocused(false); }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.resultTitle}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{res.resultSubtitle}</div>
                        </div>
                      )) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No results found</div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              className="secondary-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              {dateFilter} <ChevronDown size={16} />
            </button>
            {showDateDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                {dateOptions.map(opt => (
                  <button key={opt} onClick={() => { 
                    if (opt === 'Custom Range') {
                      setShowCustomDateModal(true);
                      setShowDateDropdown(false);
                    } else {
                      setDateFilter(opt); 
                      setShowDateDropdown(false); 
                      showToast(`Dashboard refreshed for ${opt}`); 
                      setLastRefreshed('Updated Just Now'); 
                    }
                  }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lastRefreshed}</span>
          <button className="secondary-btn" onClick={() => { showToast('Dashboard Refreshed'); setLastRefreshed('Updated Just Now'); }} style={{ padding: '8px' }}><RefreshCw size={18} /></button>
          
          <div style={{ position: 'relative' }}>
            <button className="primary-btn" onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)} style={{ padding: '8px' }}><Plus size={18} /></button>
            <QuickCreateMenu 
              isOpen={isQuickCreateOpen} 
              onClose={() => setIsQuickCreateOpen(false)} 
              onAction={(action) => setActiveQuickCreateForm(action)} 
            />
          </div>
          
          <button className="primary-btn" onClick={handleSave} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={18} /> Save</button>
        </div>
      </div>

      {/* TOP PERFORMANCE SUMMARY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { title: 'New Inquiry Leads Added', count: dashboardData.newInquiryLeads.length, percent: dashboardData.newInquiryLeads.length > 0 ? 100 : 0, color: '#3b82f6' },
          { title: 'Call Attempted Leads Worked', count: dashboardData.callAttemptedLeads.length, percent: dashboardData.callAttemptedLeads.length > 0 ? 100 : 0, color: '#8b5cf6' },
          { title: 'Total Leads Worked', count: dashboardData.totalLeadsWorked.length, percent: dashboardData.totalLeadsWorked.length > 0 ? 100 : 0, color: '#10b981' },
          { title: 'Closed Leads', count: dashboardData.closedLeads.length, percent: 0, color: '#f59e0b' }
        ].map(card => (
          <motion.div
            key={card.title}
            whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
            className="glass-panel"
            style={{ padding: '20px', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '12px' }}
            onClick={() => handleCardClick(card.title)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{card.title}</div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{card.count}</div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Completion</span>
                <span style={{ fontWeight: 600 }}>{card.percent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${card.percent}%`, height: '100%', background: card.color, borderRadius: '3px' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
      {/* ROW 2: Work Pipeline & User Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Work Pipeline */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={24} color="var(--primary-color)"/> Work Pipeline
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '20px', padding: '4px' }}>
                  {['All', 'My'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActivePipeline(tab)}
                      style={{ padding: '4px 16px', border: 'none', background: activePipeline === tab ? 'var(--primary-color)' : 'transparent', color: activePipeline === tab ? 'white' : 'var(--text-secondary)', borderRadius: '16px', cursor: 'pointer', fontWeight: 500 }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Ad-hoc Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Ad-hoc Tasks</h3>
                  <button onClick={() => setAdHocTasksOpen(true)} style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Today</button>
                </div>
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                  No tasks for today
                </div>
              </div>

              {[
                { title: 'New Leads', sub: 'New inquiries received', icon: UserPlus, color: '#8b5cf6', count: dashboardData.wpNewLeads.length, suffix: '' },
                { title: 'Newly Assigned Leads', sub: 'Other (non-new) assigned leads yet to work', icon: UserCheck, color: '#8b5cf6', count: dashboardData.wpNewlyAssigned.length, suffix: '' },
                { title: 'Repeat Enquiries', sub: 'Repeat lead received within selected period', icon: RefreshCw, color: '#8b5cf6', count: Math.floor(dashboardData.newInquiryLeads.length * 0.05), suffix: '' },
                { title: 'User Set Follow-up for Today', sub: 'Leads where users have scheduled follow-up with due date of today', icon: CalendarCheck, color: '#8b5cf6', count: leads.filter(l => l.nextFollowUp === new Date().toISOString().split('T')[0] && l.followUpStatus !== 'Completed').length, suffix: '' },
                { title: 'System Set Follow-up for Today', sub: 'Leads where system has scheduled follow-up with due date of today', icon: Bot, color: '#8b5cf6', count: 0, suffix: 'All caught up' },
                { title: 'Last 30 Days Overdue Follow-ups', sub: 'Leads with follow-ups overdue in last 30 days', icon: Clock, color: '#ef4444', count: leads.filter(l => l.nextFollowUp && l.nextFollowUp < new Date().toISOString().split('T')[0] && l.followUpStatus !== 'Completed').length, suffix: '' },
                { title: 'Calls You Missed', sub: 'Calls missed in selected period', icon: PhoneMissed, color: '#10b981', count: Math.floor(dashboardData.totalLeadsWorked.length * 0.05), suffix: '' },
                { title: 'Recent Closed Leads', sub: 'Leads closed in selected period', icon: Briefcase, color: '#f59e0b', count: dashboardData.closedLeads.length, suffix: '' },
              ].map(item => (
                <div 
                  key={item.title} 
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', cursor: 'pointer', transition: 'background 0.2s' }}
                  className="hover-bg-secondary"
                  onClick={() => setActivePipelineModal({ title: item.title, count: item.count, filterState: { startDate: (dashboardData as any).startDate, endDate: (dashboardData as any).endDate, activePipeline, dateFilter } })}
                >
                  <div style={{ background: `var(--bg-secondary)`, padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</h4>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item.sub}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: item.color }}>{item.count}</span>
                      </div>
                    </div>
                    
                    {item.suffix ? (
                       <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                         <CheckCircle size={13}/> {item.suffix}
                       </span>
                    ) : (
                       <div style={{ width: '100%', height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                         <div style={{ width: `${Math.min((item.count / 300) * 100, 100)}%`, height: '100%', background: item.color, borderRadius: '2px' }} />
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        {/* User Activity */}
          <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '700px' }}>
            <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#3b82f6"/> 
                {selectedUserForLeads ? `${selectedUserForLeads}'s Assigned Leads` : 'User Activity'}
              </h3>
              {selectedUserForLeads && (
                <button 
                  onClick={() => setSelectedUserForLeads(null)}
                  className="secondary-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.9rem' }}
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
            </div>
            
            {!selectedUserForLeads ? (
              <>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input 
                      type="text" 
                      placeholder="Search Users" 
                      value={userActivitySearch}
                      onChange={e => setUserActivitySearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', marginLeft: '8px' }}
                    />
                  </div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {dynamicUserActivities.filter(u => u.name.toLowerCase().includes(userActivitySearch.toLowerCase())).length > 0 ? 
                    dynamicUserActivities.filter(u => u.name.toLowerCase().includes(userActivitySearch.toLowerCase())).map((user, idx) => (
                    <div 
                      key={idx} 
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                      className="hover-bg-secondary"
                      onClick={() => setActiveUserProfile(user)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '140px', flexShrink: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                            {user.name.charAt(0)}
                          </div>
                          <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', borderRadius: '50%', background: user.status === 'active' ? '#10b981' : '#cbd5e1', border: '2px solid white' }} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: 0, paddingRight: '16px' }}>
                        <Phone size={16} color="#4f46e5" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5', wordBreak: 'break-word' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</span> {user.type} a {user.duration} duration call {user.type === 'made' ? 'to' : 'from'} <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.leadName}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', width: '85px', justifyContent: 'flex-end', flexShrink: 0 }}>
                        <Clock size={14} color={user.status === 'active' ? '#10b981' : '#ef4444'} />
                        <span style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{user.relativeTime}</span>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                      No users matched your search.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '12px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>Lead Details</th>
                      <th style={{ padding: '12px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>Stage & Status</th>
                      <th style={{ padding: '12px 24px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l => l.owner === selectedUserForLeads).length > 0 ? (
                      leads.filter(l => l.owner === selectedUserForLeads).map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="hover-bg-secondary"
                          style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                          onClick={() => setSelectedLeadForProfile(lead)}
                        >
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{lead.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                              <span>{lead.phone}</span>
                              <span>{lead.email}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Source: {lead.source}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#4f46e5', width: 'fit-content' }}>
                                {lead.stage || 'New Lead'}
                              </span>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: {lead.status || 'Active'}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority: {lead.priority || 'Medium'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CalendarCheck size={14} color="#64748b" /> {lead.nextFollowUp || 'No follow-up set'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Last Active: {lead.lastActivity || new Date(lead.updatedAt).toLocaleDateString()}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                              Created: {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No leads assigned to {selectedUserForLeads}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
      </div>

      {/* ROW 3: Overall Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Overall Activities */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="#8b5cf6"/> Overall Activities
              </h3>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                  <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, width: '50%' }}>METRIC</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, width: '25%' }}>COUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Call with Lead Logged', count: totalCalls, icon: Phone },
                    { title: 'Connected Calls Logged', count: connectedCalls, icon: PhoneCall },
                    { title: 'Outgoing Call Logged', count: Math.floor(totalCalls * 0.8), icon: PhoneOutgoing },
                    { title: 'Connected Outgoing', count: Math.floor(connectedCalls * 0.8), icon: PhoneOutgoing },
                    { title: 'Incoming Call Logged', count: Math.floor(totalCalls * 0.2), icon: PhoneIncoming },
                    { title: 'Connected Incoming', count: Math.floor(connectedCalls * 0.2), icon: PhoneIncoming },
                    { title: 'Total Call Duration', count: `${Math.floor(connectedCalls * 2.5 / 60)}h ${Math.floor(connectedCalls * 2.5 % 60)}m`, icon: Clock },
                    { title: 'Incoming Call Duration', count: `${Math.floor(connectedCalls * 0.5 / 60)}h ${Math.floor(connectedCalls * 0.5 % 60)}m`, icon: Clock },
                    { title: 'Outgoing Call Duration', count: `${Math.floor(connectedCalls * 2.0 / 60)}h ${Math.floor(connectedCalls * 2.0 % 60)}m`, icon: Clock },
                    { title: 'Call Outcome Logged', count: totalCalls - 5, icon: PhoneCall },
                    { title: 'Positive Call Outcome', count: Math.floor(connectedCalls * 0.3), icon: ThumbsUp },
                    { title: 'Negative Call Outcome', count: Math.floor(connectedCalls * 0.7), icon: ThumbsDown },
                    { title: 'Added A Note', count: Math.floor(dashboardData.totalLeadsWorked.length * 1.2), icon: FileText },
                    { title: 'Visit Outcome Logged', count: 0, icon: CheckSquare }
                  ].map((act, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setActiveActivitiesTitle(act.title)}
                      style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                      className="hover-row"
                    >
                      <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                          <act.icon size={16} />
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{act.title}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{act.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      </div>

      {/* ROW 4: Custom Tracking Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <CustomTrackingMetrics dateFilter={dateFilter} dashboardData={dashboardData as any} />
      </div>

      {/* ROW 5: Calling Trend & Team Pulse Today */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <CallingTrendChart dateFilter={dateFilter} dashboardData={dashboardData as any} />
                <TeamPulseChart dateFilter={dateFilter} dashboardData={dashboardData as any} />
      </div>

      {/* ROW 6: Where Leads Came From & Who Got Them */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <LeadSourceDistribution dateFilter={dateFilter} dashboardData={dashboardData as any} />
        <UserLeadAssignment dateFilter={dateFilter} dashboardData={dashboardData as any} />
      </div>
      
      {/* ROW 7: Stage Breakdown Cards */}
      <StageBreakdownCards dashboardData={dashboardData as any} />

      {activeActivitiesTitle && (
        <OverallActivitiesDetailsModal 
          title={activeActivitiesTitle} 
          onClose={() => setActiveActivitiesTitle(null)} 
          dashboardData={dashboardData as any} 
        />
      )}

      <AnimatePresence>
        {selectedLeadForProfile && (
          <LeadPreviewModal isOpen={true} lead={selectedLeadForProfile} onClose={() => setSelectedLeadForProfile(null)} onViewLead={(l) => { setSelectedLeadForProfile(null); setFullSelectedLeadForProfile(l); }} />
        )}
        {fullSelectedLeadForProfile && (
          <LeadWorkspaceModal isOpen={true} lead={fullSelectedLeadForProfile} onClose={() => setFullSelectedLeadForProfile(null)} />
        )}
        {activeUserProfile && (
          <UserWorkspaceModal isOpen={true} user={activeUserProfile} onClose={() => setActiveUserProfile(null)} />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
