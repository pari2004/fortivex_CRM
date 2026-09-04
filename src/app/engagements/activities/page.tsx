'use client';

import React, { useState, useMemo } from 'react';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { useInbox } from '@/contexts/InboxContext';

import { useCRM } from '@/contexts/CRMContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

import { 
  Filter, Search, Phone, Mail, Video, Calendar as CalendarIcon, 
  MessageSquare, StickyNote, RefreshCcw, DollarSign, FileText, 
  CheckSquare, X, BarChart2, Activity, Plus, RefreshCw, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';

// ---------------------------------
// CONSTANTS & TYPES
// ---------------------------------

const ACTIVITY_TYPES = [
  'Added a note', 'Added call outcome', 'Added comment', 'Assigned a lead',
  'Assigned a task', 'Bulk upload completed', 'Business created', 'Call recording available',
  'Call with lead logged', 'Completed a task', 'Contact distribution', 'Created a task',
  'Created a team', 'Data export completed', 'Deal created', 'Deal lost',
  'Deal stage changed', 'Deal won', 'Logged a visit', 'Mentioned in a comment',
  'New team member added', 'New user added to organization', 'Payment cancelled',
  'Payment received', 'Payment requested', 'Sent email', 'Sent SMS',
  'Task completed in failure', 'Task completed successfully', 'Task expired',
  'Task distributed', 'Updated a task', 'Video call completed', 'Video Call Completed Failure',
  'WABA Broadcast Message Sent', 'WhatsApp message sent'
];

const LENSES = ['Communications', 'Tasks', 'Deals', 'Payments', 'People', 'System'];

export default function AllActivitiesTimelinePage() {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const { leads } = useCRM();
  const CURRENT_USER = 'Abhay';

  // ---------------------------------
  // STATE
  // ---------------------------------
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  
  // Dropdown Filter panel (User / Team / Lead)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterUser, setFilterUser] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterLead, setFilterLead] = useState('');

  // Scope (Dates)
  const [scope, setScope] = useState<'Today' | 'Yesterday' | 'Range' | null>('Today');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Lenses
  const [activeLens, setActiveLens] = useState<string | null>(null);

  // Select Activity Type
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');

  // Context Panel
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Lead Workspace
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);

  // Activity Pulse
  const [isPulseOpen, setIsPulseOpen] = useState(false);

  // ---------------------------------
  // DERIVED DATA
  // ---------------------------------
  const availableUsers = useMemo(() => {
    if (!leads) return ['Pavan S.H', 'Abhishek', 'Yashwanth', 'Parikshit', 'Spoorthi'];
    return Array.from(new Set(leads.map(l => l.owner || 'Pavan S.H'))).filter(Boolean);
  }, [leads]);
  
  const availableTeams = useMemo(() => {
    if (!leads) return ['Tech', 'Sales', 'Admissions', 'Marketing', 'Counseling', 'FS Sales Team'];
    return Array.from(new Set(leads.map(l => l.team || 'FS Sales Team'))).filter(Boolean);
  }, [leads]);

  // Generate extremely comprehensive timeline data mapping to requested types
  const generatedActivities = useMemo(() => {
    if (!leads || leads.length === 0) return [];

    const acts: any[] = [];
    const now = new Date();
    
    // We will distribute activities across Today, Yesterday, and a few days ago.
    leads.forEach((lead, i) => {
      const owner = lead.owner || 'Pavan S.H';
      const team = lead.team || 'FS Sales Team';
      
      // Seed a realistic date. 
      // i % 3 === 0 -> Today
      // i % 3 === 1 -> Yesterday
      // i % 3 === 2 -> 2 days ago
      const offsetDays = i % 3;
      const actDate = new Date(now);
      actDate.setDate(actDate.getDate() - offsetDays);
      actDate.setHours(13 - (i % 8), 53 - (i % 59), 0, 0); // Randomize time a bit
      
      const actType = ACTIVITY_TYPES[i % ACTIVITY_TYPES.length];
      
      let lensCategory = 'System';
      if (['Added call outcome', 'Call with lead logged', 'Sent email', 'Sent SMS', 'Video call completed', 'WhatsApp message sent', 'Call recording available'].includes(actType)) {
        lensCategory = 'Communications';
      } else if (['Assigned a task', 'Completed a task', 'Created a task', 'Updated a task', 'Task completed successfully'].includes(actType)) {
        lensCategory = 'Tasks';
      } else if (['Deal created', 'Deal won', 'Deal stage changed', 'Deal lost'].includes(actType)) {
        lensCategory = 'Deals';
      } else if (['Payment received', 'Payment requested', 'Payment cancelled'].includes(actType)) {
        lensCategory = 'Payments';
      } else if (['Assigned a lead', 'New team member added', 'New user added to organization'].includes(actType)) {
        lensCategory = 'People';
      }

      // Generate context-specific notes based on type
      let note = '';
      if (actType === 'Added call outcome') note = 'Cut The Call';
      if (actType === 'Call with lead logged') note = `${owner} made a 00:00:00 duration call to ${lead.name}`;
      if (actType === 'Payment received') note = '₹ 50,000 received via UPI';
      
      acts.push({
        id: `act-${i}-1`,
        fullLead: lead,
        leadName: lead.name,
        type: actType,
        lens: lensCategory,
        owner: owner,
        team: team,
        activityDate: actDate.toISOString(),
        note: note
      });
    });
    return acts.sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime());
  }, [leads]);

  // ---------------------------------
  // FILTERING LOGIC
  // ---------------------------------
  const filteredActivities = generatedActivities.filter(act => {
    // 1. My / All
    if (activeFilter === 'My' && act.owner !== CURRENT_USER) return false;
    
    // 2. User / Team / Lead Filters
    if (filterUser && act.owner !== filterUser) return false;
    if (filterTeam && act.team !== filterTeam) return false;
    if (filterLead && act.leadName !== filterLead) return false;

    // 3. Date Scope
    const actDate = new Date(act.activityDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (scope === 'Today') {
      if (actDate.toDateString() !== today.toDateString()) return false;
    } else if (scope === 'Yesterday') {
      if (actDate.toDateString() !== yesterday.toDateString()) return false;
    } else if (scope === 'Range' && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      start.setHours(0,0,0,0);
      const end = new Date(dateRange.end);
      end.setHours(23,59,59,999);
      if (actDate < start || actDate > end) return false;
    }

    // 4. Lenses
    if (activeLens && act.lens !== activeLens) return false;

    // 5. Activity Type
    if (selectedActivityType && act.type !== selectedActivityType) return false;

    // 6. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(
        act.leadName.toLowerCase().includes(q) ||
        act.owner.toLowerCase().includes(q) ||
        act.type.toLowerCase().includes(q) ||
        (act.note && act.note.toLowerCase().includes(q))
      )) {
        return false;
      }
    }

    return true;
  });

  // Group by relative date (TODAY, YESTERDAY, DATE)
  const groupedActivities: Record<string, any[]> = {};
  filteredActivities.forEach(act => {
    const d = new Date(act.activityDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (d.toDateString() === today.toDateString()) groupKey = 'TODAY';
    else if (d.toDateString() === yesterday.toDateString()) groupKey = 'YESTERDAY';
    
    if (!groupedActivities[groupKey]) groupedActivities[groupKey] = [];
    groupedActivities[groupKey].push(act);
  });

  // ---------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------
  const getIconForType = (type: string) => {
    if (type.includes('Call') || type.includes('call')) return <Phone size={20} color="white" />;
    if (type.includes('email') || type.includes('Email')) return <Mail size={20} color="white" />;
    if (type.includes('WhatsApp') || type.includes('SMS')) return <Smartphone size={20} color="white" />;
    if (type.includes('Payment')) return <DollarSign size={20} color="white" />;
    if (type.includes('task') || type.includes('Task')) return <CheckSquare size={20} color="white" />;
    if (type.includes('note') || type.includes('Note') || type.includes('comment')) return <StickyNote size={20} color="white" />;
    return <FileText size={20} color="white" />;
  };

  const getRelativeTime = (dateString: string) => {
    const diffInMins = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (diffInMins < 5) return 'just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hours ago`;
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

    return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', overflow: 'hidden', background: '#f5f3ff', margin: '-24px' }}>


      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#334155', margin: 0 }}>All Activities</h1>
        <button 
          onClick={() => setIsPulseOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)' }}
        >
          <Activity size={18} />
          Activity Pulse
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        
        {/* LEFT COLUMN: FILTERS */}
        <div style={{ width: '280px', background: '#faf5ff', borderRight: '1px solid #e9d5ff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flexShrink: 0 }}>
          
          {/* My/All */}
          <div style={{ display: 'flex', background: 'white', borderRadius: '12px', padding: '4px', border: '1px solid #e9d5ff' }}>
            <button 
              onClick={() => setActiveFilter('My')}
              style={{ flex: 1, padding: '8px', background: activeFilter === 'My' ? '#8b5cf6' : 'transparent', color: activeFilter === 'My' ? 'white' : '#64748b', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              My
            </button>
            <button 
              onClick={() => setActiveFilter('All')}
              style={{ flex: 1, padding: '8px', background: activeFilter === 'All' ? '#8b5cf6' : 'transparent', color: activeFilter === 'All' ? 'white' : '#64748b', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              All
            </button>
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#4b5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Filter size={16} /> Filter by User / Team / Lead
            </button>
            
            <AnimatePresence>
              {isFilterPanelOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', zIndex: 50, marginTop: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">Select User</option>
                      {availableUsers.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">Select Team</option>
                      {availableTeams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={filterLead} onChange={(e) => setFilterLead(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">Select Lead</option>
                      {leads?.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                    </select>
                    <button onClick={() => { setFilterUser(''); setFilterTeam(''); setFilterLead(''); }} style={{ marginTop: '8px', padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SCOPE */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>SCOPE</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                onClick={() => setScope('Today')}
                style={{ flex: 1, padding: '8px', background: scope === 'Today' ? '#8b5cf6' : 'white', color: scope === 'Today' ? 'white' : '#64748b', border: scope === 'Today' ? 'none' : '1px solid #e2e8f0', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}
              >Today</button>
              <button 
                onClick={() => setScope('Yesterday')}
                style={{ flex: 1, padding: '8px', background: scope === 'Yesterday' ? '#8b5cf6' : 'white', color: scope === 'Yesterday' ? 'white' : '#64748b', border: scope === 'Yesterday' ? 'none' : '1px solid #e2e8f0', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}
              >Yesterday</button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
              <CalendarIcon size={14} color="#64748b" style={{ flexShrink: 0 }} />
              <input type="date" value={dateRange.start} onChange={e => { setDateRange({...dateRange, start: e.target.value}); setScope('Range'); }} style={{ flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', fontSize: '0.75rem', background: 'transparent' }} />
              <span style={{ color: '#64748b', fontSize: '0.75rem', flexShrink: 0 }}>→</span>
              <input type="date" value={dateRange.end} onChange={e => { setDateRange({...dateRange, end: e.target.value}); setScope('Range'); }} style={{ flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', fontSize: '0.75rem', background: 'transparent' }} />
              {scope === 'Range' && <X size={14} color="#ef4444" style={{ cursor: 'pointer', flexShrink: 0, marginLeft: 'auto' }} onClick={() => { setScope(null); setDateRange({start: '', end: ''}); }} />}
            </div>
          </div>

          {/* SEARCH */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>SEARCH</div>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Type first three letters..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* LENSES */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>LENSES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {LENSES.map(lens => (
                <button
                  key={lens}
                  onClick={() => setActiveLens(activeLens === lens ? null : lens)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 16px',
                    background: activeLens === lens ? '#f3e8ff' : 'white',
                    color: activeLens === lens ? '#7e22ce' : '#334155',
                    border: '1px solid',
                    borderColor: activeLens === lens ? '#d8b4fe' : '#e2e8f0',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {lens}
                  {activeLens === lens && <X size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* FILTERS */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>FILTERS</div>
            <select 
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '24px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569', background: 'white' }}
            >
              <option value="">Select Activity Type</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

        </div>

        {/* CENTER COLUMN: TIMELINE */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', position: 'relative' }}>
          
          <div style={{ position: 'absolute', left: '44px', top: '24px', bottom: '24px', width: '1px', background: '#d8b4fe', zIndex: 0 }} />

          {Object.keys(groupedActivities).length === 0 ? (
             <div style={{ textAlign: 'center', color: '#64748b', marginTop: '100px' }}>
                <RefreshCcw size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No activities match your filters.</h3>
                <p>Try clearing your filters or changing the date scope.</p>
             </div>
          ) : (
            Object.entries(groupedActivities).map(([groupDate, acts]) => (
              <div key={groupDate} style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9333ea', letterSpacing: '0.05em', marginBottom: '16px', marginLeft: '60px' }}>
                  {groupDate}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {acts.map((act) => (
                    <div 
                      key={act.id} 
                      onClick={() => setSelectedActivity(act)}
                      style={{ 
                        display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 1, 
                        cursor: 'pointer' 
                      }}
                    >
                      {/* Icon */}
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', 
                        background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getIconForType(act.type)}
                      </div>

                      {/* Card */}
                      <div style={{ 
                        flex: 1, background: 'white', border: selectedActivity?.id === act.id ? '2px solid #8b5cf6' : '1px solid #d8b4fe', 
                        borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'border-color 0.2s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6' }}>{act.type}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{getRelativeTime(act.activityDate)}</span>
                        </div>
                        
                        <div style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: '16px', lineHeight: '1.5' }}>
                          {act.note ? act.note : `${act.owner} recorded: ${act.type} with ${act.leadName}`}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>{act.owner}</span>
                          </div>
                          {act.leadName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#475569', fontWeight: 700 }}>
                                {act.leadName.charAt(0)}
                              </div>
                              <HoverableLeadName 
                                leadName={act.leadName}
                                leadId={act.fullLead?.id}
                                phone={act.fullLead?.phone}
                                hoveredRowId={hoveredRowId}
                                rowId={act.id}
                                onViewClick={() => setSelectedLeadForWorkspace(act.fullLead)}
                                textStyle={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textDecoration: 'none' }}
                                containerStyle={{ background: 'transparent' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: CONTEXT PANEL */}
        <AnimatePresence>
          {selectedActivity && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{ background: 'white', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Context</span>
                <X size={16} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setSelectedActivity(null)} />
              </div>
              
              <div style={{ padding: '20px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#3730a3' }}>
                    {selectedActivity.leadName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{selectedActivity.leadName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lead</div>
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedActivity(null); setSelectedLeadForWorkspace(selectedActivity.fullLead); }}
                  style={{ width: '100%', padding: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, color: '#334155', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '24px' }}
                >
                  Open Lead
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Type</div>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{selectedActivity.type}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>When</div>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>
                      {new Date(selectedActivity.activityDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Done by</div>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{selectedActivity.owner}</div>
                  </div>
                  {selectedActivity.team && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Team</div>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{selectedActivity.team}</div>
                    </div>
                  )}
                  {selectedActivity.note && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Note</div>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{selectedActivity.note}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>



      {/* FULL ACTIVITY PULSE MODAL */}
      <AnimatePresence>
        {isPulseOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', top: '50px', left: '100px', right: '100px', bottom: '50px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf5ff' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4c1d95', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={24} /> Activity Pulse
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '4px' }}>
                  Hourly breakdown by activity type • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button 
                onClick={() => setIsPulseOpen(false)}
                style={{ width: '36px', height: '36px', borderRadius: '18px', background: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#6b21a8' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Chart Body */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Activities by Hour (Based on your filters)</h3>
              
              <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                {(() => {
                  // Process data for the chart
                  // We need to group filteredActivities by hour (0-23)
                  
                  const hourlyData: any[] = [];
                  for (let i = 0; i < 24; i++) {
                    const obj: any = { hour: `${i}:00`, timeNumeric: i, total: 0 };
                    hourlyData.push(obj);
                  }
                  
                  const typesSet = new Set<string>();
                  
                  filteredActivities.forEach(act => {
                    const date = new Date(act.createdAt);
                    let hour = date.getHours();
                    if (isNaN(hour) || hour < 0 || hour > 23) {
                      hour = 0; // fallback if date is invalid
                    }
                    
                    if (!hourlyData[hour][act.type]) {
                      hourlyData[hour][act.type] = 0;
                    }
                    hourlyData[hour][act.type] += 1;
                    hourlyData[hour].total += 1;
                    typesSet.add(act.type);
                  });
                  
                  // Generate distinct colors for the types
                  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#84cc16', '#eab308'];
                  const typesList = Array.from(typesSet);
                  
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          itemStyle={{ fontSize: '0.85rem', fontWeight: 600 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.85rem' }} />
                        
                        {typesList.map((type, index) => (
                          <Bar 
                            key={type} 
                            dataKey={type} 
                            stackId="a" 
                            fill={colors[index % colors.length]} 
                            radius={index === typesList.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Workspace Modal */}
      {selectedLeadForWorkspace && (
        <LeadWorkspaceModal 
          isOpen={!!selectedLeadForWorkspace}
          onClose={() => setSelectedLeadForWorkspace(null)}
          lead={selectedLeadForWorkspace}
        />
      )}
    </div>
  );
}
