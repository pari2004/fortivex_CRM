'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { useInbox } from '@/contexts/InboxContext';
import { Filter, Search, RefreshCw, Settings, CheckSquare, Phone, Mail, Video, Calendar, MessageSquare, StickyNote, RefreshCcw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverableLeadName } from '@/components/engagements/HoverableLeadName';
import { LeadWorkspaceModal } from '@/components/dashboard/modals/LeadWorkspaceModal';
import { CustomizeEngagementsColumnsModal } from '@/components/engagements/modals/CustomizeEngagementsColumnsModal';
import { AssignEngagementModal } from '@/components/engagements/modals/AssignEngagementModal';
import { Users } from 'lucide-react';

const ALL_COLUMNS = [
  'Lead',
  'Lead Source',
  'Engagement Type',
  'Engagement Status',
  'Engagement Owner',
  'Team',
  'Last Updated'
];

export default function AllEngagementsPage() {
  const { leads, updateLead } = useCRM();
  const { openSharedInbox } = useInbox();
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  
  // Using the same active user convention as other pages
  const CURRENT_USER = 'Abhay';
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'My'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngagements, setSelectedEngagements] = useState<string[]>([]);
  const [selectedLeadForWorkspace, setSelectedLeadForWorkspace] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Column customization state
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState<{id: string, visible: boolean}[]>(
    ALL_COLUMNS.map(c => ({ id: c, visible: true }))
  );

  // Column sizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const handleResizeStart = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const th = (e.target as HTMLElement).closest('th');
    const startWidth = th?.getBoundingClientRect().width || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.pageX - startX;
      const newWidth = Math.max(80, startWidth + diff); // Minimum width
      setColumnWidths(prev => ({ ...prev, [colId]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('');
  
  // Unique users and teams for the dropdowns
  const availableUsers = useMemo(() => {
    if (!leads) return ['Pavan S.H', 'Abhishek', 'Yashwanth', 'Parikshit', 'Spoorthi'];
    return Array.from(new Set(leads.map(l => l.owner || 'Pavan S.H'))).filter(Boolean);
  }, [leads]);
  
  const availableTeams = useMemo(() => {
    if (!leads) return ['Tech', 'Sales', 'Admissions', 'Marketing', 'Counseling', 'FS Sales Team'];
    return Array.from(new Set(leads.map(l => l.team || 'FS Sales Team'))).filter(Boolean);
  }, [leads]);


  // Dynamically generate realistic CRM data based on existing leads
  const generatedEngagements = useMemo(() => {
    if (!leads || leads.length === 0) return [];

    const types = ['Call', 'WhatsApp', 'Email', 'Meeting', 'Note', 'Follow-up', 'Visit', 'Task'];
    const statuses = ['Completed', 'Pending', 'In Progress', 'Scheduled', 'Failed'];

    const engs: any[] = [];
    leads.forEach((lead, i) => {
      // Use lead.owner if available, otherwise fallback to a CRM user
      const owner = lead.owner || 'Pavan S.H';
      const team = lead.team || 'FS Sales Team';

      engs.push({
        id: `eng-${i}-1`,
        fullLead: lead,
        leadName: lead.name,
        leadSource: lead.source || 'Website',
        type: types[i % types.length],
        status: statuses[i % statuses.length],
        owner: owner,
        team: team,
        lastUpdated: lead.lastActive || new Date(Date.now() - i * 1000000).toISOString()
      });
      // Add a second engagement for some leads
      if (i % 3 === 0) {
        engs.push({
          id: `eng-${i}-2`,
          fullLead: lead,
          leadName: lead.name,
          leadSource: lead.source || 'Facebook',
          type: types[(i+1) % types.length],
          status: statuses[(i+1) % statuses.length],
          owner: owner,
          team: team,
          lastUpdated: lead.lastContact || new Date(Date.now() - i * 2000000).toISOString()
        });
      }
    });
    return engs;
  }, [leads]);

  // Dynamic filtering based on existing CRM owner data
  const filteredEngagements = generatedEngagements.filter(eng => {
    // 1. My / All filter
    if (activeFilter === 'My' && eng.owner !== CURRENT_USER) return false;
    
    // 2. Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(
        eng.leadName.toLowerCase().includes(q) ||
        eng.leadSource.toLowerCase().includes(q) ||
        eng.type.toLowerCase().includes(q) ||
        eng.team.toLowerCase().includes(q)
      )) {
        return false;
      }
    }
    
    // 3. User filter
    if (selectedUserFilter && eng.owner !== selectedUserFilter) return false;
    
    // 4. Team filter
    if (selectedTeamFilter && eng.team !== selectedTeamFilter) return false;
    
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEngagements(filteredEngagements.map(eng => eng.id));
    } else {
      setSelectedEngagements([]);
    }
  };


  const handleAssign = (owner: string, team: string) => {
    selectedEngagements.forEach(id => {
      const eng = filteredEngagements.find(e => e.id === id);
      if (eng && eng.fullLead) {
        updateLead({ ...eng.fullLead, owner, team });
      }
    });
    setIsAssignModalOpen(false);
    setSelectedEngagements([]);
  };

  const handleSelect = (id: string) => {
    if (selectedEngagements.includes(id)) {
      setSelectedEngagements(prev => prev.filter(item => item !== id));
    } else {
      setSelectedEngagements(prev => [...prev, id]);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Call': return <Phone size={16} color="#3b82f6" />;
      case 'WhatsApp': return <MessageSquare size={16} color="#22c55e" />;
      case 'Email': return <Mail size={16} color="#8b5cf6" />;
      case 'Meeting': return <Video size={16} color="#ec4899" />;
      case 'Note': return <StickyNote size={16} color="#f59e0b" />;
      case 'Follow-up': return <RefreshCcw size={16} color="#06b6d4" />;
      case 'Visit': return <Calendar size={16} color="#10b981" />;
      case 'Task': return <CheckSquare size={16} color="#64748b" />;
      default: return <CheckSquare size={16} color="#64748b" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return { bg: '#dcfce7', text: '#166534' };
      case 'Pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'In Progress': return { bg: '#e0e7ff', text: '#3730a3' };
      case 'Scheduled': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Failed': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const visibleCols = tableColumns.filter(c => c.visible);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{`All Engagements (${generatedEngagements.length})`}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View and manage all your customer interactions and activities.</p>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)' }}>
        
        {/* Left Controls: My / All */}
        <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveFilter('All')}
            style={{
              padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              background: activeFilter === 'All' ? 'white' : 'transparent',
              color: activeFilter === 'All' ? 'var(--primary-color)' : '#64748b',
              boxShadow: activeFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            All Engagements
          </button>
          <button
            onClick={() => setActiveFilter('My')}
            style={{
              padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              background: activeFilter === 'My' ? 'white' : 'transparent',
              color: activeFilter === 'My' ? 'var(--primary-color)' : '#64748b',
              boxShadow: activeFilter === 'My' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            My Engagements
          </button>
        </div>

        {/* Right Controls: Search, Filter, Refresh, Customize */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search engagements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px', fontSize: '0.85rem' }}
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
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Filter Engagements</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>USERS</label>
                      <select 
                        value={selectedUserFilter} 
                        onChange={(e) => setSelectedUserFilter(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a', background: 'white' }}
                      >
                        <option value="">All Users</option>
                        {availableUsers.map(user => (
                          <option key={user} value={user}>{user}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>TEAMS</label>
                      <select 
                        value={selectedTeamFilter} 
                        onChange={(e) => setSelectedTeamFilter(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#0f172a', background: 'white' }}
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
                      onClick={() => { setSelectedUserFilter(''); setSelectedTeamFilter(''); }}
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
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          
          <button 
            onClick={() => setIsCustomizeModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Settings size={16} /> Customize Table
          </button>
        </div>
      </div>


      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedEngagements.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e0e7ff', padding: '12px 20px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 600, color: '#3730a3', fontSize: '0.9rem' }}>{selectedEngagements.length} engagement{selectedEngagements.length !== 1 && 's'} selected</span>
                <button 
                  onClick={() => setIsAssignModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <Users size={16} /> Assign Lead
                </button>
              </div>
              <button 
                onClick={() => setSelectedEngagements([])}
                style={{ background: 'transparent', border: 'none', color: '#4338ca', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Area */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden', flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedEngagements.length === filteredEngagements.length && filteredEngagements.length > 0}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              {visibleCols.map(col => (
                <th key={col.id} style={{ 
                  padding: '16px', 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  color: '#475569',
                  position: 'relative',
                  width: columnWidths[col.id] ? `${columnWidths[col.id]}px` : (col.id === 'Lead' ? '250px' : '150px'),
                  whiteSpace: 'nowrap',
                  userSelect: 'none'
                }}>
                  {col.id}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, col.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '6px',
                      height: '100%',
                      cursor: 'col-resize',
                      backgroundColor: 'transparent',
                      zIndex: 1,
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLDivElement).style.backgroundColor = '#94a3b8'; }}
                    onMouseLeave={(e) => { (e.target as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEngagements.map((eng, idx) => {
              const statusColors = getStatusColor(eng.status);
              return (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={eng.id} 
                  onMouseEnter={() => setHoveredRowId(eng.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{ 
                    borderBottom: '1px solid #e2e8f0', 
                    cursor: 'pointer',
                    backgroundColor: hoveredRowId === eng.id ? '#EFF6FF' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedEngagements.includes(eng.id)}
                      onChange={() => handleSelect(eng.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  {visibleCols.map(col => {
                    return (
                      <td key={col.id} style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {col.id === 'Lead' && (
                          <HoverableLeadName 
                            leadName={eng.leadName}
                            leadId={eng.fullLead?.id}
                            phone={eng.fullLead?.phone}
                            hoveredRowId={hoveredRowId}
                            rowId={eng.id}
                            onViewClick={() => setSelectedLeadForWorkspace(eng.fullLead)}
                          />
                        )}
                        {col.id === 'Lead Source' && (
                          <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{eng.leadSource}</span>
                        )}
                        {col.id === 'Engagement Type' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getIconForType(eng.type)}
                            <span>{eng.type}</span>
                          </div>
                        )}
                        {col.id === 'Engagement Status' && (
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                            background: statusColors.bg, color: statusColors.text
                          }}>
                            {eng.status}
                          </span>
                        )}
                        {col.id === 'Engagement Owner' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0 }}>
                              {eng.owner.charAt(0)}
                            </div>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{eng.owner}</span>
                          </div>
                        )}
                        {col.id === 'Team' && (
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{eng.team}</span>
                        )}
                        {col.id === 'Last Updated' && (
                          <span style={{ color: '#64748b' }}>
                            {new Date(eng.lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filteredEngagements.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
            <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>No engagements found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

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
      

      {/* Assign Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <AssignEngagementModal 
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            selectedEngagements={selectedEngagements.map(id => filteredEngagements.find(e => e.id === id))}
            onAssign={handleAssign}
          />
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
