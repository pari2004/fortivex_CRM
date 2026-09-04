'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { 
  Filter, Search, RefreshCw, Settings, Phone, Mail, 
  MessageSquare, Download, Users, CheckSquare, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { CustomizeEngagementsColumnsModal } from '@/components/engagements/modals/CustomizeEngagementsColumnsModal';
import { AssignEngagementModal } from '@/components/engagements/modals/AssignEngagementModal';
import * as XLSX from 'xlsx';

const ALL_COLUMNS = [
  'Lead',
  'Lead Source',
  'Sent By',
  'Sent On',
  'Message',
  'Mode',
  'Team',
  'Last Updated'
];

const DEFAULT_WIDTHS: Record<string, number> = {
  'Lead': 180,
  'Lead Source': 130,
  'Sent By': 150,
  'Sent On': 160,
  'Message': 300,
  'Mode': 120,
  'Team': 140,
  'Last Updated': 160
};

export default function MessagesPage() {
  const { leads, updateLead, systemUsers } = useCRM();
  const { openSharedInbox } = useInbox();
  
  const CURRENT_USER = 'Abhay';
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  const [modeFilter, setModeFilter] = useState<'All' | 'WhatsApp' | 'Email'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Column customization state
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState<{id: string, visible: boolean}[]>(
    ALL_COLUMNS.map(c => ({ id: c, visible: true }))
  );

  // Column Resizing state
  const [colWidths, setColWidths] = useState<Record<string, number>>(DEFAULT_WIDTHS);
  
  useEffect(() => {
    const saved = localStorage.getItem('messages_col_widths');
    if (saved) {
      try {
        setColWidths({ ...DEFAULT_WIDTHS, ...JSON.parse(saved) });
      } catch(e) {}
    }
  }, []);

  const resizingColRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingColRef.current = colId;
    startXRef.current = e.pageX;
    startWidthRef.current = colWidths[colId] || DEFAULT_WIDTHS[colId];
    
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingColRef.current) return;
    const diff = e.pageX - startXRef.current;
    let newWidth = startWidthRef.current + diff;
    if (newWidth < 80) newWidth = 80; // Min width
    
    setColWidths(prev => ({ ...prev, [resizingColRef.current as string]: newWidth }));
  };

  const handleMouseUp = () => {
    if (resizingColRef.current) {
      setColWidths(prev => {
        localStorage.setItem('messages_col_widths', JSON.stringify(prev));
        return prev;
      });
    }
    resizingColRef.current = null;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Hovered row & message state
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState<{text: string, x: number, y: number} | null>(null);

  const availableUsers = useMemo(() => {
    if (!systemUsers) return ['Pavan S H', 'Abhishek', 'Yashwanth', 'Parikshit', 'Spoorthi'];
    return systemUsers.map(u => u.name);
  }, [systemUsers]);
  
  const availableTeams = useMemo(() => {
    if (!leads) return ['Tech', 'Sales', 'Admissions', 'Marketing', 'Counseling', 'FS Sales Team'];
    return Array.from(new Set(leads.map(l => l.team || 'FS Sales Team'))).filter(Boolean);
  }, [leads]);

  // Generate realistic message data
  const generatedMessages = useMemo(() => {
    if (!leads || leads.length === 0) return [];
    
    const messagesData: any[] = [];
    const dummyEmails = [
      "Hi there, checking in on your application status.",
      "Attached is the brochure you requested. Let me know if you have any questions.",
      "Reminder: Your interview is scheduled for tomorrow at 10 AM.",
      "Thank you for reaching out! We will get back to you shortly."
    ];
    const dummyWA = [
      "Hey! Are you still interested in joining our upcoming batch?",
      "Can we schedule a quick call today?",
      "Your documents have been received and verified. 😊",
      "Hi! Just a quick follow-up on our previous discussion."
    ];

    leads.forEach((lead, i) => {
      const assignedUser = systemUsers && systemUsers.length > 0 
        ? systemUsers[i % systemUsers.length].name 
        : 'Pavan S H';
      const team = lead.team || 'FS Sales Team';
      
      // Email message
      messagesData.push({
        id: `msg-${i}-1`,
        fullLead: lead,
        leadName: lead.name,
        leadSource: lead.source || 'Website',
        sentBy: assignedUser,
        sentOn: lead.lastActive || new Date(Date.now() - i * 86400000).toISOString(),
        message: dummyEmails[i % dummyEmails.length],
        mode: 'Email',
        team: team,
        lastUpdated: lead.lastActive || new Date().toISOString()
      });

      // WhatsApp message
      if (i % 2 === 0) {
        messagesData.push({
          id: `msg-${i}-2`,
          fullLead: lead,
          leadName: lead.name,
          leadSource: lead.source || 'Facebook',
          sentBy: assignedUser,
          sentOn: lead.lastContact || new Date(Date.now() - (i+1) * 3600000).toISOString(),
          message: dummyWA[i % dummyWA.length],
          mode: 'WhatsApp',
          team: team,
          lastUpdated: lead.lastContact || new Date().toISOString()
        });
      }
    });

    // Sort by most recent
    return messagesData.sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime());
  }, [leads]);

  // Apply filters
  const filteredMessages = useMemo(() => {
    return generatedMessages.filter(msg => {
      // My / All filter
      if (activeFilter === 'My' && msg.sentBy !== CURRENT_USER) return false;
      
      // Mode filter
      if (modeFilter !== 'All' && msg.mode !== modeFilter) return false;
      
      // User / Team filter
      if (selectedUserFilter && msg.sentBy !== selectedUserFilter) return false;
      if (selectedTeamFilter && msg.team !== selectedTeamFilter) return false;
      
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(
          msg.leadName.toLowerCase().includes(q) ||
          msg.leadSource.toLowerCase().includes(q) ||
          msg.sentBy.toLowerCase().includes(q) ||
          msg.message.toLowerCase().includes(q) ||
          msg.team.toLowerCase().includes(q)
        )) {
          return false;
        }
      }
      return true;
    });
  }, [generatedMessages, activeFilter, modeFilter, selectedUserFilter, selectedTeamFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMessages.length / rowsPerPage) || 1;
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMessages(filteredMessages.map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelect = (id: string) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(prev => prev.filter(item => item !== id));
    } else {
      setSelectedMessages(prev => [...prev, id]);
    }
  };

  const handleAssign = (owner: string, team: string) => {
    selectedMessages.forEach(id => {
      const msg = filteredMessages.find(m => m.id === id);
      if (msg && msg.fullLead) {
        updateLead({ ...msg.fullLead, owner, team });
      }
    });
    setIsAssignModalOpen(false);
    setSelectedMessages([]);
  };

  const handleExport = () => {
    const dataToExport = filteredMessages.map(msg => ({
      'Lead Name': msg.leadName,
      'Lead Source': msg.leadSource,
      'Sent By': msg.sentBy,
      'Sent On': new Date(msg.sentOn).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      'Message': msg.message,
      'Mode': msg.mode,
      'Team': msg.team,
      'Last Updated': new Date(msg.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
    XLSX.writeFile(workbook, `Messages_Export_${new Date().getTime()}.xlsx`);
  };

  const visibleCols = tableColumns.filter(c => c.visible);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{`Messages (${filteredMessages.length})`}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View and manage all WhatsApp and Email communications.</p>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* My / All */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => { setActiveFilter('All'); setCurrentPage(1); }}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: activeFilter === 'All' ? 'white' : 'transparent',
                color: activeFilter === 'All' ? 'var(--primary-color)' : '#64748b',
                boxShadow: activeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              All
            </button>
            <button
              onClick={() => { setActiveFilter('My'); setCurrentPage(1); }}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: activeFilter === 'My' ? 'white' : 'transparent',
                color: activeFilter === 'My' ? 'var(--primary-color)' : '#64748b',
                boxShadow: activeFilter === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              My
            </button>
          </div>

          {/* Mode Filters */}
          <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => { setModeFilter('All'); setCurrentPage(1); }}
              style={{
                padding: '8px 12px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: modeFilter === 'All' ? 'white' : 'transparent',
                color: modeFilter === 'All' ? '#0f172a' : '#64748b',
                boxShadow: modeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              All
            </button>
            <button
              onClick={() => { setModeFilter('WhatsApp'); setCurrentPage(1); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: modeFilter === 'WhatsApp' ? '#22c55e' : 'transparent',
                color: modeFilter === 'WhatsApp' ? 'white' : '#64748b',
                boxShadow: modeFilter === 'WhatsApp' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <MessageSquare size={14} /> WhatsApp
            </button>
            <button
              onClick={() => { setModeFilter('Email'); setCurrentPage(1); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: modeFilter === 'Email' ? '#8b5cf6' : 'transparent',
                color: modeFilter === 'Email' ? 'white' : '#64748b',
                boxShadow: modeFilter === 'Email' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Mail size={14} /> Email
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '220px', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: isFilterOpen ? '#f1f5f9' : 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Filter size={16} /> Filter {(selectedUserFilter || selectedTeamFilter) && <span style={{ background: '#4f46e5', color: 'white', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem' }}>Active</span>}
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '300px', 
                    background: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)', 
                    boxShadow: 'var(--shadow-lg)', zIndex: 50, padding: '16px' 
                  }}
                >
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Filter Messages</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>USER</label>
                      <select 
                        value={selectedUserFilter} 
                        onChange={(e) => { setSelectedUserFilter(e.target.value); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a', background: 'white', outline: 'none' }}
                      >
                        <option value="">All Users</option>
                        {availableUsers.map(user => (
                          <option key={user} value={user}>{user}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>TEAM</label>
                      <select 
                        value={selectedTeamFilter} 
                        onChange={(e) => { setSelectedTeamFilter(e.target.value); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a', background: 'white', outline: 'none' }}
                      >
                        <option value="">All Teams</option>
                        {availableTeams.map(team => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <button 
                      onClick={() => { setSelectedUserFilter(''); setSelectedTeamFilter(''); setCurrentPage(1); }}
                      style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      style={{ flex: 1, padding: '10px', background: '#4f46e5', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Download size={16} /> Export
          </button>
          
          <button 
            onClick={() => setIsCustomizeModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Settings size={16} /> Customize Columns
          </button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedMessages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e0e7ff', padding: '12px 20px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 600, color: '#3730a3', fontSize: '0.9rem' }}>{selectedMessages.length} message{selectedMessages.length !== 1 && 's'} selected</span>
                <button 
                  onClick={() => setIsAssignModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <Users size={16} /> Assign Lead
                </button>
              </div>
              <button 
                onClick={() => setSelectedMessages([])}
                style={{ background: 'transparent', border: 'none', color: '#4338ca', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Area */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
          
          {/* Custom Message Tooltip Popover */}
          <AnimatePresence>
            {hoveredMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  left: `${hoveredMessage.x}px`,
                  top: `${hoveredMessage.y}px`,
                  background: 'white',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  maxWidth: '350px',
                  zIndex: 9999,
                  pointerEvents: 'none',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  lineHeight: '1.5',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {hoveredMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px', width: '50px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedMessages.length === paginatedMessages.length && paginatedMessages.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {visibleCols.map((col, i) => (
                  <th key={col.id} style={{ position: 'relative', padding: '16px', fontSize: '0.85rem', fontWeight: 700, color: '#475569', width: colWidths[col.id] || DEFAULT_WIDTHS[col.id] }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col.id}</span>
                    </div>
                    {/* Resizer Handle */}
                    <div 
                      onMouseDown={(e) => handleMouseDown(e, col.id)}
                      style={{
                        position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', 
                        cursor: 'col-resize', background: 'transparent', zIndex: 20
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#cbd5e1')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedMessages.map((msg, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  key={msg.id} 
                  style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: hoveredRowId === msg.id ? '#f8fafc' : 'white' }}
                  onMouseEnter={() => setHoveredRowId(msg.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedMessages.includes(msg.id)}
                      onChange={() => handleSelect(msg.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  {visibleCols.map(col => (
                    <td key={col.id} style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {col.id === 'Lead' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
                          <span 
                            onClick={(e) => { e.stopPropagation(); setSelectedLeadForWorkspace(msg.fullLead); }}
                            style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            className="hover-underline"
                          >
                            {msg.leadName}
                          </span>
                          
                          {/* Hover Quick Actions */}
                          {hoveredRowId === msg.id && (
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => alert(`Calling ${msg.leadName}...`)} style={{ background: '#e0e7ff', border: 'none', color: '#4f46e5', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Call">
                                <Phone size={12} />
                              </button>
                              <button onClick={() => alert(`Opening WhatsApp for ${msg.leadName}...`)} style={{ background: '#dcfce7', border: 'none', color: '#16a34a', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="WhatsApp">
                                <MessageSquare size={12} />
                              </button>
                              <button onClick={() => setSelectedLeadForWorkspace(msg.fullLead)} style={{ background: '#f1f5f9', border: 'none', color: '#475569', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="View">
                                <Eye size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {col.id === 'Lead Source' && (
                        <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{msg.leadSource}</span>
                      )}
                      
                      {col.id === 'Sent By' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {msg.sentBy.charAt(0)}
                          </div>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.sentBy}</span>
                        </div>
                      )}
                      
                      {col.id === 'Sent On' && (
                        <span style={{ color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {new Date(msg.sentOn).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      )}
                      
                      {col.id === 'Message' && (
                        <div 
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredMessage({ text: msg.message, x: rect.left, y: rect.bottom + 10 });
                          }}
                          onMouseLeave={() => setHoveredMessage(null)}
                          style={{ 
                            width: '100%', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            color: '#0f172a'
                          }}
                        >
                          {msg.message}
                        </div>
                      )}
                      
                      {col.id === 'Mode' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {msg.mode === 'WhatsApp' ? (
                            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageSquare size={12} /> WhatsApp
                            </span>
                          ) : (
                            <span style={{ background: '#f3e8ff', color: '#9333ea', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} /> Email
                            </span>
                          )}
                        </div>
                      )}
                      
                      {col.id === 'Team' && (
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.team || '—'}</span>
                      )}
                      
                      {col.id === 'Last Updated' && (
                        <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(msg.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredMessages.length === 0 && (
            <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
              <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No messages found</h3>
              <p>Try changing your filters or search criteria.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredMessages.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredMessages.length)} to {Math.min(currentPage * rowsPerPage, filteredMessages.length)} of {filteredMessages.length}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontSize: '0.85rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                First
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontSize: '0.85rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', margin: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontSize: '0.85rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', fontSize: '0.85rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCustomizeModalOpen && (
          <CustomizeEngagementsColumnsModal
            isOpen={isCustomizeModalOpen}
            onClose={() => setIsCustomizeModalOpen(false)}
            savedColumns={tableColumns}
            onSave={(newCols) => setTableColumns(newCols)}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isAssignModalOpen && (
          <AssignEngagementModal 
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            selectedEngagements={selectedMessages.map(id => filteredMessages.find(m => m.id === id))}
            onAssign={handleAssign}
          />
        )}
      </AnimatePresence>

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
