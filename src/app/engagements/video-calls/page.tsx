'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import React, { useState, useMemo, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { Search, Filter, Calendar, Download, Settings, Users, FileText, ChevronDown, Video, Clock, Phone, MessageSquare, Eye } from 'lucide-react';
import { ScheduleVideoCallModal } from '@/components/engagements/modals/ScheduleVideoCallModal';

export default function VideoCallsPage() {
  const { videoCalls, systemUsers } = useCRM();
  const { openSharedInbox } = useInbox();
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);
  
  const CURRENT_USER = 'Abhay';
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to keep dynamic statuses accurate
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const clearFilters = () => {
    setSelectedUser('');
    setSelectedDate('');
    setSelectedPlatform('');
  };

  const getDynamicStatus = (call: any) => {
    if (call.status === 'Cancelled') return 'Cancelled';
    if (call.status === 'Completed') return 'Completed';

    const startDateTime = new Date(`${call.startDate}T${call.startTime}`);
    const endDateTime = new Date(`${call.endDate}T${call.endTime}`);
    
    // Normalize today for 'Today' logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const callDate = new Date(startDateTime);
    callDate.setHours(0, 0, 0, 0);

    const isToday = today.getTime() === callDate.getTime();

    if (currentTime >= startDateTime && currentTime <= endDateTime) return 'Live';
    if (currentTime > endDateTime) return isToday ? 'Completed Today' : 'Completed';
    if (isToday && currentTime < startDateTime) return 'Scheduled Today';
    if (callDate > today) return 'Scheduled Later';
    
    return 'Delayed';
  };

  const enhancedCalls = useMemo(() => {
    return videoCalls.map(c => ({
      ...c,
      computedStatus: getDynamicStatus(c)
    }));
  }, [videoCalls, currentTime]);

  const filteredCalls = useMemo(() => {
    let filtered = enhancedCalls;

    if (activeFilter === 'My') {
      filtered = filtered.filter(c => c.assignedUser === CURRENT_USER);
    }

    if (activeStatusTab !== 'All') {
      filtered = filtered.filter(c => c.computedStatus === activeStatusTab);
    }

    if (selectedUser) {
      filtered = filtered.filter(c => c.assignedUser === selectedUser);
    }

    if (selectedDate) {
      filtered = filtered.filter(c => c.startDate === selectedDate);
    }

    if (selectedPlatform) {
      filtered = filtered.filter(c => c.platform === selectedPlatform);
    }

    return filtered;
  }, [enhancedCalls, activeFilter, activeStatusTab, selectedUser, selectedDate, selectedPlatform]);

  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'Scheduled Today', label: 'Scheduled Today' },
    { id: 'Live', label: 'Live' },
    { id: 'Scheduled Later', label: 'Scheduled Later' },
    { id: 'Delayed', label: 'Delayed' },
    { id: 'Completed Today', label: 'Completed Today' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' }
  ];

  const getCount = (tabId: string) => {
    let base = enhancedCalls;
    if (activeFilter === 'My') {
      base = base.filter(c => c.assignedUser === CURRENT_USER);
    }
    if (tabId === 'All') return base.length;
    return base.filter(c => c.computedStatus === tabId).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Header Area */}
      <div style={{ padding: '24px 24px 0 24px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>Video Calls</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Manage and schedule video meetings</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '10px 16px', background: '#4f46e5', 
              color: 'white', border: 'none', borderRadius: '8px', 
              fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Video size={18} /> Schedule Video Call
          </button>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '1px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              style={{
                background: 'none', border: 'none', 
                padding: '12px 4px', fontSize: '0.9rem', 
                fontWeight: activeStatusTab === tab.id ? 600 : 500,
                color: activeStatusTab === tab.id ? '#4f46e5' : '#64748b',
                borderBottom: activeStatusTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
              <span style={{ 
                background: activeStatusTab === tab.id ? '#e0e7ff' : '#f1f5f9', 
                color: activeStatusTab === tab.id ? '#4f46e5' : '#64748b', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 
              }}>
                {getCount(tab.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar Area */}
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <button 
              onClick={() => setActiveFilter('My')}
              style={{ 
                padding: '8px 16px', border: 'none', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                background: activeFilter === 'My' ? '#f1f5f9' : 'white',
                color: activeFilter === 'My' ? '#0f172a' : '#64748b'
              }}
            >
              My
            </button>
            <div style={{ width: '1px', background: '#e2e8f0' }} />
            <button 
              onClick={() => setActiveFilter('All')}
              style={{ 
                padding: '8px 16px', border: 'none', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                background: activeFilter === 'All' ? '#f1f5f9' : 'white',
                color: activeFilter === 'All' ? '#0f172a' : '#64748b'
              }}
            >
              All
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                padding: '8px 16px', background: isFilterOpen ? '#f1f5f9' : 'white', 
                border: '1px solid #e2e8f0', borderRadius: '8px',
                color: '#475569', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
              }}
            >
              <Filter size={16} /> Filter <ChevronDown size={14} />
            </button>
            
            {isFilterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '16px', width: '280px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Date</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>User</label>
                  <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: 'white' }}>
                    <option value="">All Users</option>
                    {systemUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Platform</label>
                  <select value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: 'white' }}>
                    <option value="">All Platforms</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
                <button onClick={clearFilters} style={{ padding: '8px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* Main Content / Table Area */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ overflow: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
                <tr>
                  {['Contact', 'Meeting Title', 'Type', 'Platform', 'Scheduled By', 'Assigned User', 'Date', 'Time', 'Duration', 'Status'].map((th, i) => (
                    <th key={i} style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                      No video calls found.
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => {
                    const st = new Date(`${call.startDate}T${call.startTime}`);
                    const et = new Date(`${call.endDate}T${call.endTime}`);
                    const diffMs = Math.max(0, et.getTime() - st.getTime());
                    const durationMins = Math.floor(diffMs / 60000);
                    const durationText = durationMins > 60 ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m` : `${durationMins}m`;

                    let statusColor = '#e2e8f0';
                    let statusText = '#475569';
                    if (call.computedStatus === 'Live') { statusColor = '#fef08a'; statusText = '#854d0e'; }
                    if (call.computedStatus === 'Completed' || call.computedStatus === 'Completed Today') { statusColor = '#dcfce7'; statusText = '#166534'; }
                    if (call.computedStatus === 'Cancelled') { statusColor = '#fee2e2'; statusText = '#991b1b'; }
                    if (call.computedStatus === 'Scheduled Today' || call.computedStatus === 'Scheduled Later') { statusColor = '#dbeafe'; statusText = '#1e40af'; }
                    if (call.computedStatus === 'Delayed') { statusColor = '#ffedd5'; statusText = '#9a3412'; }

                    return (
                      <tr key={call.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={() => setHoveredRowId(call.id)}
                        onMouseLeave={() => setHoveredRowId(null)}>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <HoverableLeadName 
                            leadName={call.leadName || '-'}
                            leadId={(call as any).fullLead?.id}
                            phone={(call as any).fullLead?.phone}
                            hoveredRowId={hoveredRowId}
                            rowId={call.id}
                            onViewClick={() => setSelectedLeadForWorkspace((call as any).fullLead)}
                          />
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#0f172a' }}>{call.title}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569' }}>{call.type}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                            <Video size={12} /> {call.platform}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569' }}>{call.scheduledBy}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569' }}>{call.assignedUser}</td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {new Date(call.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {new Date(`${call.startDate}T${call.startTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(`${call.endDate}T${call.endTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569' }}>{durationText}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ background: statusColor, color: statusText, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {call.computedStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{ padding: '12px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing {filteredCalls.length} results</span>
          </div>
        </div>
      </div>

      <ScheduleVideoCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
