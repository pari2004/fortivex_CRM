
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCRM, Deal } from '@/contexts/CRMContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Filter, Search, Plus, MoreVertical, Edit, Copy, Trash2, Calendar, Target, CheckCircle, XCircle, LayoutGrid, List, Settings, X, Eye, Clock, Phone, AlertCircle, ChevronDown } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { AddNewDealModal } from '../modals/AddNewDealModal';
import { LeadProfileModal } from '@/components/dashboard/modals/LeadProfileModal';
import { LeadPreviewModal } from '@/components/dashboard/modals/LeadPreviewModal';

const CURRENT_USER = 'Pavan S.H';

// Configurable Fields for "Customize Table"
const CUSTOM_FIELDS = [
  { key: 'recentActions', label: 'Recent actions', category: 'SHOW ON EACH CARD' },
  { key: 'contactTags', label: 'Contact tags', category: 'SHOW ON EACH CARD' },
  { key: 'interestedIn', label: 'Interested In?', category: 'DEAL CUSTOM FIELDS' },
  { key: 'companyType', label: 'Current Company Type', category: 'DEAL CUSTOM FIELDS' },
  { key: 'source', label: 'Lead Source', category: 'DEAL CUSTOM FIELDS' },
  { key: 'experienceLevel', label: 'Experience Level', category: 'DEAL CUSTOM FIELDS' },
  { key: 'whatLookingFor', label: 'What are you looking for?', category: 'DEAL CUSTOM FIELDS' },
  { key: 'careerGoal', label: 'Career Goal', category: 'DEAL CUSTOM FIELDS' },
  { key: 'enrollmentTimeline', label: 'Enrollment Timeline', category: 'DEAL CUSTOM FIELDS' },
  { key: 'technicalBackground', label: 'Technical Background', category: 'DEAL CUSTOM FIELDS' },
  { key: 'stage', label: 'Deal Stage', category: 'DEAL CUSTOM FIELDS' },
  { key: 'leadLifecycleName', label: 'Lead Lifecycle Name', category: 'DEAL CUSTOM FIELDS' },
];

export function OpportunitiesDeals() {
  const { deals, dealStages, updateDealStages, updateDeal } = useCRM();
  
  // View mode
  const [viewMode, setViewMode] = useState<'Kanban' | 'Table'>('Kanban');
  
  // Basic Filters
  const [ownerFilter, setOwnerFilter] = useState<'All' | 'My'>('My');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date Filter
  const [dateFilter, setDateFilter] = useState<string>('All Time');
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // No Action Filter
  const [noActionFilter, setNoActionFilter] = useState<string>('Any Time');
  const [showNoActionFilter, setShowNoActionFilter] = useState(false);

  // Advanced Filter state
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    users: [] as string[],
    stage: [] as string[],
    source: [] as string[],
    priority: [] as string[]
  });

  // Customize Table
  const [showCustomizeTable, setShowCustomizeTable] = useState(false);
  const [customFields, setCustomFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('crm_deal_card_prefs');
    if (saved) {
      setCustomFields(JSON.parse(saved));
    } else {
      // Default enabled fields
      const defaults: Record<string, boolean> = {};
      CUSTOM_FIELDS.forEach(f => defaults[f.key] = true);
      setCustomFields(defaults);
    }
  }, []);

  const toggleCustomField = (key: string) => {
    setCustomFields(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('crm_deal_card_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  useGlobalEscape(showCustomizeTable, () => setShowCustomizeTable(false));
  useGlobalEscape(showDateFilter, () => setShowDateFilter(false));
  useGlobalEscape(showNoActionFilter, () => setShowNoActionFilter(false));
  useGlobalEscape(showAdvancedFilter, () => setShowAdvancedFilter(false));

  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [viewDeal, setViewDeal] = useState<Deal | null>(null);
  const [viewLead, setViewLead] = useState<any | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useGlobalEscape(!!activeMenuId, () => setActiveMenuId(null));

  // Extracted unique values
  const uniqueUsers = Array.from(new Set(deals.map(d => d.dealOwner).filter(Boolean)));
  const uniqueSources = Array.from(new Set(deals.map(d => d.source).filter(Boolean)));

  // Filter Logic
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // My/All Filter
      if (ownerFilter === 'My' && deal.dealOwner !== CURRENT_USER) return false;

      // Search Filter
      if (searchQuery) {
        const sq = searchQuery.toLowerCase();
        if (!deal.leadName?.toLowerCase().includes(sq) && !deal.id.toLowerCase().includes(sq)) return false;
      }

      const today = new Date();
      today.setHours(0,0,0,0);
      
      // Date Filter (Applied to createdAt)
      if (dateFilter !== 'All Time' && deal.createdAt) {
        const dealDate = new Date(deal.createdAt);
        dealDate.setHours(0,0,0,0);
        
        if (dateFilter === 'Today') {
          if (dealDate.getTime() !== today.getTime()) return false;
        } else if (dateFilter === 'Yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          if (dealDate.getTime() !== yesterday.getTime()) return false;
        } else if (dateFilter === 'Last 7 Days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          if (dealDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'Last 30 Days') {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (dealDate < thirtyDaysAgo) return false;
        } else if (dateFilter === 'This Month') {
          if (dealDate.getMonth() !== today.getMonth() || dealDate.getFullYear() !== today.getFullYear()) return false;
        } else if (dateFilter === 'Last Month') {
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          if (dealDate.getMonth() !== lastMonth.getMonth() || dealDate.getFullYear() !== lastMonth.getFullYear()) return false;
        }
      }

      // No Action Filter (Applied to lastActivityTime or updatedAt)
      if (noActionFilter !== 'Any Time') {
        const lastAction = deal.lastActivityTime ? new Date(deal.lastActivityTime) : deal.updatedAt ? new Date(deal.updatedAt) : new Date(deal.createdAt || Date.now());
        const diffDays = Math.floor((today.getTime() - lastAction.getTime()) / (1000 * 3600 * 24));
        
        const daysRequired = parseInt(noActionFilter.split(' ')[0]) || 0; // "1 day", "3 days", etc.
        if (daysRequired > 0 && diffDays < daysRequired) return false;
      }

      // Advanced Filters
      if (advFilters.users.length > 0 && !advFilters.users.includes(deal.dealOwner)) return false;
      if (advFilters.stage.length > 0 && !advFilters.stage.includes(deal.stage)) return false;
      if (advFilters.source.length > 0 && deal.source && !advFilters.source.includes(deal.source)) return false;
      if (advFilters.priority.length > 0 && deal.priority && !advFilters.priority.includes(deal.priority)) return false;

      return true;
    });
  }, [deals, ownerFilter, searchQuery, dateFilter, noActionFilter, advFilters]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const dealToMove = deals.find(d => d.id === draggableId);
    if (dealToMove) {
      const newStage = destination.droppableId;
      let newStatus = 'Open';
      if (newStage.toLowerCase().includes('won')) newStatus = 'Won';
      if (newStage.toLowerCase().includes('lost')) newStatus = 'Lost';
      
      updateDeal({
        ...dealToMove,
        stage: newStage,
        status: newStatus,
        lastActivityTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recentActions: [
          { id: Math.random().toString(36).substring(7), action: `Moved to ${newStage}`, date: new Date().toISOString(), by: CURRENT_USER },
          ...(dealToMove.recentActions || [])
        ]
      });
    }
  };

  const handleAction = (action: string, deal: Deal) => {
    setActiveMenuId(null);
    if (action === 'view') {
      setViewDeal(deal);
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete deal ${deal.id}?`)) {
        alert('Delete logic to be implemented via context.');
      }
    } else if (action === 'won') {
      updateDeal({ ...deal, stage: 'Deal Won', status: 'Won', updatedAt: new Date().toISOString() });
    } else if (action === 'lost') {
      updateDeal({ ...deal, stage: 'Deal Lost', status: 'Lost', updatedAt: new Date().toISOString() });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '0h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // UI rendering helper for the Deal Card
  const getFollowUpStatusBadge = (deal: Deal) => {
    const today = new Date().toISOString().split('T')[0];
    const followUp = deal.nextFollowUp ? new Date(deal.nextFollowUp).toISOString().split('T')[0] : '';
    
    if (followUp === today) {
      return <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>Follow-up today</div>;
    } else if (followUp && followUp < today) {
      const daysOverdue = Math.floor((new Date(today).getTime() - new Date(followUp).getTime()) / (1000 * 3600 * 24));
      return <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', background: '#fee2e2', padding: '4px 8px', borderRadius: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><AlertCircle size={12}/> Overdue {daysOverdue}d ✓</div>;
    } else if (followUp && followUp > today) {
      return <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', background: '#dbeafe', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>Upcoming Follow-up</div>;
    }
    return null;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Header and Controls */}
      <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target color="var(--primary-color)" /> Deals Pipeline
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Customize Table Button */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCustomizeTable(!showCustomizeTable)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                <Settings size={18} /> Customize Table
              </button>
              {showCustomizeTable && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', zIndex: 70, width: '320px', padding: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Customize Table</div>
                    <X size={18} cursor="pointer" onClick={() => setShowCustomizeTable(false)} />
                  </div>
                  
                  {['SHOW ON EACH CARD', 'DEAL CUSTOM FIELDS'].map(category => (
                    <div key={category} style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>{category}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {CUSTOM_FIELDS.filter(f => f.category === category).map(field => (
                          <div key={field.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{field.label}</span>
                            <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                              <input type="checkbox" checked={customFields[field.key] || false} onChange={() => toggleCustomField(field.key)} style={{ opacity: 0, width: 0, height: 0 }} />
                              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: customFields[field.key] ? 'var(--primary-color)' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                                <span style={{ position: 'absolute', content: '""', height: '14px', width: '14px', left: customFields[field.key] ? '18px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setIsAddDealModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={18} /> New Deal
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setOwnerFilter('My')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: ownerFilter === 'My' ? 'var(--primary-color)' : 'white', color: ownerFilter === 'My' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: ownerFilter === 'My' ? '0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 0 0 1px var(--border-color)' }}>My</button>
            <button onClick={() => setOwnerFilter('All')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: ownerFilter === 'All' ? 'var(--primary-color)' : 'white', color: ownerFilter === 'All' ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', boxShadow: ownerFilter === 'All' ? '0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 0 0 1px var(--border-color)' }}>All</button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            
            {/* No Action In Filter */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNoActionFilter(!showNoActionFilter)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>
                No Action In: {noActionFilter} <ChevronDown size={14}/>
              </button>
              {showNoActionFilter && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, width: '200px', padding: '8px' }}>
                  {['Any Time', '1 day', '3 days', '7 days', '14 days', '30 days'].map(d => (
                    <div key={d} onClick={() => { setNoActionFilter(d); setShowNoActionFilter(false); }} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: noActionFilter === d ? 'var(--primary-light)' : 'transparent', color: noActionFilter === d ? 'var(--primary-color)' : 'var(--text-primary)', fontWeight: noActionFilter === d ? 600 : 400 }}>
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowDateFilter(!showDateFilter)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>
                <Calendar size={16} /> {dateFilter} <ChevronDown size={14}/>
              </button>
              {showDateFilter && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, width: '200px', padding: '8px' }}>
                  {['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'].map(d => (
                    <div key={d} onClick={() => { setDateFilter(d); setShowDateFilter(false); }} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: dateFilter === d ? 'var(--primary-light)' : 'transparent', color: dateFilter === d ? 'var(--primary-color)' : 'var(--text-primary)', fontWeight: dateFilter === d ? 600 : 400 }}>
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', width: '220px' }}>
              <Search size={16} color="var(--text-tertiary)" />
              <input type="text" placeholder="Search deals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }} />
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc', padding: '24px' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '20px', height: '100%', minWidth: 'min-content' }}>
            {dealStages.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage);
              const stageAmount = stageDeals.reduce((sum, d) => sum + (d.revenue || 0), 0);
              
              return (
                <div key={stage} style={{ width: '320px', display: 'flex', flexDirection: 'column', background: 'transparent', height: '100%' }}>
                  {/* Stage Header */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stage}</h3>
                        <span style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{stageDeals.length}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{formatCurrency(stageAmount)}</div>
                    </div>
                    
                    {/* Demo Details */}
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        Target: {formatCurrency(Math.max(stageAmount * 1.5, 100000))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        Avg: {stageDeals.length ? formatCurrency(stageAmount / stageDeals.length) : '₹0'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Droppable Area */}
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        style={{ 
                          flex: 1, 
                          background: snapshot.isDraggingOver ? 'rgba(0,0,0,0.02)' : 'transparent', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px',
                          minHeight: '150px'
                        }}
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                onClick={(e) => { e.stopPropagation(); handleAction('view', deal); }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  background: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  boxShadow: snapshot.isDragging ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                                  border: '1px solid var(--border-color)',
                                  ...provided.draggableProps.style
                                }}
                              >
                                {/* Card Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)', paddingRight: '12px' }}>{deal.leadName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    &raquo; {getTimeAgo(deal.lastActivityTime || deal.updatedAt)}
                                  </div>
                                </div>

                                {/* Status Badge */}
                                {getFollowUpStatusBadge(deal)}

                                {/* Deal Amount & Owner */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                  {deal.revenue ? (
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                      {formatCurrency(deal.revenue)}
                                    </div>
                                  ) : (
                                    <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', padding: 0, cursor: 'pointer' }}>+ Add amount</button>
                                  )}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: deal.dealOwner === CURRENT_USER ? '#10b981' : '#cbd5e1' }}></div>
                                    {deal.dealOwner}
                                  </div>
                                </div>

                                {/* Dynamic Custom Fields rendering */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                  {customFields['interestedIn'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Interested In:</span> <span style={{ fontWeight: 500 }}>{deal.interestedIn || '-'}</span></div>}
                                  {customFields['companyType'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Current Company Type:</span> <span style={{ fontWeight: 500 }}>{deal.companyType || '-'}</span></div>}
                                  {customFields['source'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Lead Source:</span> <span style={{ fontWeight: 500 }}>{deal.source || '-'}</span></div>}
                                  {customFields['experienceLevel'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Experience Level:</span> <span style={{ fontWeight: 500 }}>{deal.experienceLevel || '-'}</span></div>}
                                  {customFields['whatLookingFor'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>What looking for:</span> <span style={{ fontWeight: 500 }}>{deal.whatLookingFor || '-'}</span></div>}
                                  {customFields['careerGoal'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Career Goal:</span> <span style={{ fontWeight: 500 }}>{deal.careerGoal || '-'}</span></div>}
                                  {customFields['enrollmentTimeline'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Enrollment Timeline:</span> <span style={{ fontWeight: 500 }}>{deal.enrollmentTimeline || '-'}</span></div>}
                                  {customFields['technicalBackground'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Technical Background:</span> <span style={{ fontWeight: 500 }}>{deal.technicalBackground || '-'}</span></div>}
                                  {customFields['stage'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Deal Stage:</span> <span style={{ fontWeight: 500 }}>{deal.stage || '-'}</span></div>}
                                  {customFields['leadLifecycleName'] && <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Lead Lifecycle Name:</span> <span style={{ fontWeight: 500 }}>{deal.leadLifecycleName || '-'}</span></div>}
                                </div>

                                {/* Tags */}
                                {customFields['contactTags'] && deal.tags && deal.tags.length > 0 && (
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {deal.tags.map(t => (
                                      <span key={t} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t}</span>
                                    ))}
                                  </div>
                                )}

                                {/* Recent Actions & Remarks */}
                                {(customFields['recentActions'] || deal.lastRemark) && (
                                  <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {deal.lastRemark && (
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        "{deal.lastRemark}"
                                      </div>
                                    )}
                                    {customFields['recentActions'] && deal.recentActions && deal.recentActions.length > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        <Clock size={12} /> {deal.recentActions[0].action}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Action Menu */}
                                <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                                  <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === deal.id ? null : deal.id) }} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px', display: 'none' /* Hide by default, show on hover - implementation requires CSS or state, keeping simple for inline */ }}>
                                    <MoreVertical size={14} />
                                  </button>
                                  {activeMenuId === deal.id && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 20, width: '150px', padding: '8px 0', marginTop: '4px' }}>
                                      <div onClick={(e) => { e.stopPropagation(); handleAction('view', deal); }} style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={14} /> View Details</div>
                                      <div onClick={(e) => { e.stopPropagation(); handleAction('won', deal); }} style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}><CheckCircle size={14} /> Mark Won</div>
                                      <div onClick={(e) => { e.stopPropagation(); handleAction('lost', deal); }} style={{ padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}><XCircle size={14} /> Mark Lost</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <div style={{ padding: '12px', border: '2px dashed var(--border-color)', borderRadius: '10px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem', cursor: 'pointer', marginTop: 'auto', background: 'transparent' }} onClick={() => setIsAddDealModalOpen(true)}>
                          + Add Deal
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
            
            <div style={{ width: '320px', flexShrink: 0, padding: '16px', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => {
              const name = prompt('Enter new stage name:');
              if (name) updateDealStages([...dealStages, name]);
            }}>
              <Plus size={20} style={{ marginRight: '8px' }} /> Add Stage
            </div>
          </div>
        </DragDropContext>
      </div>

      {isAddDealModalOpen && (
        <AddNewDealModal onClose={() => setIsAddDealModalOpen(false)} />
      )}
      {viewDeal && (
        <LeadPreviewModal isOpen={true} onClose={() => setViewDeal(null)} lead={{ id: viewDeal.leadId || '', name: viewDeal.leadName || '' }} onViewLead={(l) => { setViewDeal(null); setViewLead(l); }} />
      )}
      {viewLead && (
        <LeadProfileModal isOpen={true} onClose={() => setViewLead(null)} lead={viewLead} />
      )}
    </div>
  );
}
