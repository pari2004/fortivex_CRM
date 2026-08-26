'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { Filter, Calendar, Phone, CheckCircle, Search, Edit2, Download, Check, X, FileText, ChevronLeft, ChevronRight, MessageCircle, LayoutGrid, List, Clock, AlertTriangle } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const KANBAN_COLUMNS: { key: string; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'Today', label: 'Follow-up Today', icon: <Clock size={14} />, color: '#d97706' },
  { key: 'Upcoming', label: 'Upcoming', icon: <Calendar size={14} />, color: '#0ea5e9' },
  { key: 'Overdue', label: 'Overdue', icon: <AlertTriangle size={14} />, color: '#ef4444' },
  { key: 'Completed', label: 'Done', icon: <CheckCircle size={14} />, color: '#22c55e' },
];

function ActionModal({ title, onClose, onSave, children }: { title: string, onClose: () => void, onSave: () => void, children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} color="var(--text-tertiary)" /></button>
        </div>
        {children}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={onSave} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

const CURRENT_USER = 'Rahul Sharma'; // Assuming logged in user for demo

export function LeadsFollowUpView() {
  const { leads, updateLead } = useCRM();

  // View mode
  const [viewMode, setViewMode] = useState<'Kanban' | 'Table'>('Kanban');

  // Filters
  const [ownerFilter, setOwnerFilter] = useState<'All' | 'My'>('My');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => setActiveMenuId(null));
  
  const [actionModal, setActionModal] = useState<{
    type: 'complete' | 'reschedule' | 'note';
    leadId: string;
  } | null>(null);
  const [modalData, setModalData] = useState({ date: '', time: '', remark: '' });

  // Get follow-up status based on current date
  const getFollowUpStatus = (lead: any) => {
    if (lead.followUpStatus === 'Completed') return 'Completed';
    if (!lead.nextFollowUp) return 'No Follow-up';
    
    const today = new Date().toISOString().split('T')[0];
    const followDate = lead.nextFollowUp;
    
    if (followDate === today) return 'Today';
    if (followDate < today) return 'Overdue';
    return 'Upcoming';
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    let result = leads.filter(l => l.nextFollowUp); // Only leads with follow-up
    
    if (ownerFilter === 'My') {
      result = result.filter(l => l.owner === CURRENT_USER || l.counselor === CURRENT_USER || l.assignedTo === CURRENT_USER);
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(l => getFollowUpStatus(l) === statusFilter);
    }
    
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(sq) || 
        (l.mobile && l.mobile.includes(sq)) || 
        (l.email && l.email.toLowerCase().includes(sq)) ||
        (l.owner && l.owner.toLowerCase().includes(sq))
      );
    }
    
    // Sort by date (overdue -> today -> upcoming -> completed)
    return result.sort((a, b) => {
      if (a.followUpStatus === 'Completed' && b.followUpStatus !== 'Completed') return 1;
      if (a.followUpStatus !== 'Completed' && b.followUpStatus === 'Completed') return -1;
      return (a.nextFollowUp || '').localeCompare(b.nextFollowUp || '');
    });
  }, [leads, ownerFilter, statusFilter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Overdue': return { bg: '#fee2e2', text: '#ef4444' };
      case 'Today': return { bg: '#fef3c7', text: '#d97706' };
      case 'Upcoming': return { bg: '#e0f2fe', text: '#0ea5e9' };
      case 'Completed': return { bg: '#dcfce3', text: '#22c55e' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  const handleAction = (type: 'complete' | 'reschedule' | 'note', leadId: string) => {
    setActiveMenuId(null);
    setModalData({ date: '', time: '', remark: '' });
    setActionModal({ type, leadId });
  };

  const executeAction = () => {
    if (!actionModal) return;
    const lead = leads.find(l => l.id === actionModal.leadId);
    if (!lead) return;

    const updatedLead = { ...lead };

    if (actionModal.type === 'complete') {
      updatedLead.followUpStatus = 'Completed';
      updatedLead.lastFollowUpRemark = modalData.remark;
      updatedLead.completedOn = new Date().toISOString();
      updatedLead.completedBy = CURRENT_USER;
      if (!updatedLead.activities) updatedLead.activities = [];
      updatedLead.activities.push({
        id: Math.random().toString(36).substr(2, 9),
        activityTime: new Date().toISOString(),
        lifecycle: updatedLead.status,
        activityType: 'Follow-up Completed',
        category: 'Task',
        description: `${CURRENT_USER} completed a follow-up for ${updatedLead.name}. Remark: ${modalData.remark || ''}`,
        activityBy: CURRENT_USER
      });
    } else if (actionModal.type === 'reschedule') {
      if (modalData.date) {
        updatedLead.nextFollowUp = modalData.date;
        updatedLead.followUpStatus = 'Pending';
        if (modalData.remark) updatedLead.lastFollowUpRemark = modalData.remark;
        if (!updatedLead.activities) updatedLead.activities = [];
        updatedLead.activities.push({
          id: Math.random().toString(36).substr(2, 9),
          activityTime: new Date().toISOString(),
          lifecycle: updatedLead.status,
          activityType: 'Follow-up Rescheduled',
          category: 'Task',
          description: `${CURRENT_USER} rescheduled a follow-up for ${updatedLead.name} to ${modalData.date}. Remark: ${modalData.remark || ''}`,
          activityBy: CURRENT_USER
        });
      }
    } else if (actionModal.type === 'note') {
      updatedLead.remark = modalData.remark;
      if (!updatedLead.activities) updatedLead.activities = [];
      updatedLead.activities.push({
        id: Math.random().toString(36).substr(2, 9),
        activityTime: new Date().toISOString(),
        lifecycle: updatedLead.status,
        activityType: 'Note Added',
        category: 'Update',
        description: `${CURRENT_USER} added a note to ${updatedLead.name}. Note: ${modalData.remark || ''}`,
        activityBy: CURRENT_USER
      });
    }

    updateLead(updatedLead);
    setActionModal(null);
  };

  // Group leads into Kanban columns by follow-up status
  const kanbanColumns = useMemo(() => {
    const groups: Record<string, typeof filteredLeads> = { Today: [], Upcoming: [], Overdue: [], Completed: [] };
    filteredLeads.forEach(lead => {
      const status = getFollowUpStatus(lead);
      if (groups[status]) groups[status].push(lead);
    });
    return groups;
  }, [filteredLeads]);

  // Dragging a card into "Done" completes the follow-up; dragging out of "Done" reopens it.
  // The date-based columns (Today/Upcoming/Overdue) are computed automatically and aren't manually reorderable.
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const lead = leads.find(l => l.id === draggableId);
    if (!lead) return;

    if (destination.droppableId === 'Completed') {
      handleAction('complete', lead.id);
    } else if (source.droppableId === 'Completed') {
      updateLead({ ...lead, followUpStatus: 'Pending' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setOwnerFilter('My')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: ownerFilter === 'My' ? 'var(--primary-color)' : '#f1f5f9', color: ownerFilter === 'My' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
          >
            My Follow-ups
          </button>
          <button 
            onClick={() => setOwnerFilter('All')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: ownerFilter === 'All' ? 'var(--primary-color)' : '#f1f5f9', color: ownerFilter === 'All' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
          >
            All Follow-ups
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', width: '250px' }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white', color: 'var(--text-secondary)', fontWeight: 500 }}
          >
            <option value="All">All Statuses</option>
            <option value="Today">Today</option>
            <option value="Overdue">Overdue</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button style={{ padding: '9px 16px', borderRadius: '8px', background: 'white', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <Filter size={16} /> Filters
          </button>

          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('Kanban')}
              title="Kanban view"
              style={{ padding: '9px 12px', background: viewMode === 'Kanban' ? 'var(--primary-color)' : 'white', color: viewMode === 'Kanban' ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('Table')}
              title="Table view"
              style={{ padding: '9px 12px', background: viewMode === 'Table' ? 'var(--primary-color)' : 'white', color: viewMode === 'Table' ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'Kanban' && (
        <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '16px', height: '100%', minWidth: 'min-content' }}>
              {KANBAN_COLUMNS.map(col => {
                const colLeads = kanbanColumns[col.key] || [];
                return (
                  <div key={col.key} style={{ width: '280px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ color: col.color, display: 'flex' }}>{col.icon}</span>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{col.label}</h3>
                      <span style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{colLeads.length}</span>
                    </div>

                    <Droppable droppableId={col.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ flex: 1, background: snapshot.isDraggingOver ? 'rgba(37,99,235,0.05)' : 'transparent', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '150px' }}
                        >
                          {colLeads.map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    background: 'white',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{lead.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{lead.mobile || 'No Mobile'}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    <Calendar size={12} /> {lead.nextFollowUp}
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', background: '#f1f5f9', color: 'var(--text-secondary)' }}>{lead.stage || lead.status || 'New'}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{lead.owner || lead.counselor || 'Unassigned'}</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* Table Area */}
      {viewMode === 'Table' && (
      <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Lead Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Follow-up Date</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Owner</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Stage</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Remark</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length > 0 ? (
                currentLeads.map(lead => {
                  const status = getFollowUpStatus(lead);
                  const colors = getStatusColor(status);
                  
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', background: 'white' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', gap: '8px' }}>
                          <span>{lead.mobile || 'No Mobile'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Calendar size={14} />
                          {lead.nextFollowUp}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: colors.bg, color: colors.text }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {lead.owner || lead.counselor || 'Unassigned'}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                          {lead.stage || lead.status || 'New'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.lastFollowUpRemark || lead.remark || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                        >
                          Actions ▾
                        </button>
                        
                        {activeMenuId === lead.id && (
                          <div style={{ position: 'absolute', top: '100%', right: '24px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, width: '180px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <a href={`tel:${lead.mobile}`} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)', textDecoration: 'none', background: 'transparent' }} onMouseOver={e => e.currentTarget.style.background='#f1f5f9'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                              <Phone size={14} /> Call
                            </a>
                            <a href={`https://wa.me/${(lead.mobile||'').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)', textDecoration: 'none', background: 'transparent' }} onMouseOver={e => e.currentTarget.style.background='#f1f5f9'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                              <MessageCircle size={14} color="#10b981" /> WhatsApp
                            </a>
                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                            {status !== 'Completed' && (
                              <div onClick={() => handleAction('complete', lead.id)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '6px', color: '#16a34a' }} onMouseOver={e => e.currentTarget.style.background='#f0fdf4'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                <CheckCircle size={14} /> Complete
                              </div>
                            )}
                            <div onClick={() => handleAction('reschedule', lead.id)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)' }} onMouseOver={e => e.currentTarget.style.background='#f1f5f9'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                              <Calendar size={14} /> Reschedule
                            </div>
                            <div onClick={() => handleAction('note', lead.id)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '6px', color: 'var(--text-primary)' }} onMouseOver={e => e.currentTarget.style.background='#f1f5f9'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                              <FileText size={14} /> Add Note
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: '#f8fafc', borderRadius: '50%', marginBottom: '16px' }}>
                      <Calendar size={32} color="var(--text-tertiary)" />
                    </div>
                    <h3>No follow-ups found</h3>
                    <p>There are no {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} follow-ups matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing {filteredLeads.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to {Math.min(page * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{ width: '32px', height: '32px', borderRadius: '6px', border: page === i + 1 ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', background: page === i + 1 ? 'var(--primary-color)' : 'white', color: page === i + 1 ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Action Modals */}
      {actionModal && (
        <ActionModal 
          title={actionModal.type === 'complete' ? 'Complete Follow-up' : actionModal.type === 'reschedule' ? 'Reschedule Follow-up' : 'Add Note'} 
          onClose={() => setActionModal(null)} 
          onSave={executeAction}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {actionModal.type === 'reschedule' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>New Date <span style={{color: 'red'}}>*</span></label>
                  <input type="date" value={modalData.date} onChange={e => setModalData({...modalData, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Time</label>
                  <input type="time" value={modalData.time} onChange={e => setModalData({...modalData, time: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                </div>
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {actionModal.type === 'complete' ? 'Completion Remarks' : actionModal.type === 'note' ? 'Note Details' : 'Reschedule Reason (Optional)'}
              </label>
              <textarea 
                rows={4} 
                value={modalData.remark} 
                onChange={e => setModalData({...modalData, remark: e.target.value})} 
                placeholder={actionModal.type === 'complete' ? "What happened during this follow-up?" : "Enter notes..."}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }} 
              />
            </div>
            
            {actionModal.type === 'complete' && (
              <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <CheckCircle size={20} color="#16a34a" />
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#16a34a' }}>Marking as Completed</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#15803d' }}>This will be logged to the Lead's timeline.</p>
                </div>
              </div>
            )}
          </div>
        </ActionModal>
      )}

    </div>
  );
}
