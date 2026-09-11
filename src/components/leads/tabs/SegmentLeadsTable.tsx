'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Search, Filter, ChevronLeft, ChevronRight, Settings,
  MoreVertical, Eye, Edit2, Phone, Mail, MessageCircle, CalendarPlus, CheckSquare,
  Download, Users, ChevronDown, Filter as FilterIcon, Calendar as CalendarIcon,
  UserPlus, Trash2, UserCheck, UserMinus, Check, Clock, User, Users as UsersIcon, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { AssignLeadsModal } from '@/components/dashboard/modals/AssignLeadsModal';

// --- Column Definitions (exactly as requested) ---
const ALL_COLUMNS = [
  { id: 'leadName', label: 'Lead Name', defaultWidth: 200 },
  { id: 'leadOwner', label: 'Lead Owner', defaultWidth: 150 },
  { id: 'leadStage', label: 'Lead Stage', defaultWidth: 150 },
  { id: 'prospectingAttempts', label: 'Prospecting Attempts', defaultWidth: 160 },
  { id: 'lastWorked', label: 'Last Worked', defaultWidth: 120 },
  { id: 'startedWorkOn', label: 'Started Work On', defaultWidth: 140 },
  { id: 'nextFollowup', label: 'Next Followup', defaultWidth: 130 },
  { id: 'movedToOpportunity', label: 'Moved To Opportunity', defaultWidth: 160 },
  { id: 'tags', label: 'Tags', defaultWidth: 180 },
  { id: 'productOrService', label: 'Product or Service', defaultWidth: 180 },
  { id: 'recentAction', label: 'Recent Action', defaultWidth: 150 },
  { id: 'unpickedCallAttempted', label: 'Unpicked Call Attempted', defaultWidth: 180 },
  { id: 'lastUserRemark', label: 'Last User Remark', defaultWidth: 200 },
  { id: 'nextOpenTask', label: 'Next Open Task', defaultWidth: 150 },
  { id: 'lastClosedTask', label: 'Last Closed Task', defaultWidth: 150 },
  { id: 'dealStage', label: 'Deal Stage', defaultWidth: 130 },
  { id: 'leadDisposition', label: 'Lead Disposition', defaultWidth: 150 },
  { id: 'leadDispositionOn', label: 'Lead Disposition On', defaultWidth: 160 },
  { id: 'business', label: 'Business', defaultWidth: 160 },
  { id: 'mobileNumber', label: 'Mobile Number', defaultWidth: 150 },
  { id: 'email', label: 'Email', defaultWidth: 200 },
  { id: 'address', label: 'Address', defaultWidth: 220 },
  { id: 'state', label: 'State', defaultWidth: 130 },
  { id: 'city', label: 'City', defaultWidth: 130 },
  { id: 'area', label: 'Area', defaultWidth: 130 },
  { id: 'primaryTeam', label: 'Primary Team', defaultWidth: 150 },
  { id: 'designation', label: 'Designation', defaultWidth: 150 },
  { id: 'leadType', label: 'Lead Type', defaultWidth: 120 },
  { id: 'leadPriority', label: 'Lead Priority', defaultWidth: 120 },
  { id: 'leadSource', label: 'Lead Source', defaultWidth: 140 },
  { id: 'sourceLevel2', label: 'Source Level 2', defaultWidth: 140 },
  { id: 'sourceLevel3', label: 'Source Level 3', defaultWidth: 140 },
  { id: 'sourceLevel4', label: 'Source Level 4', defaultWidth: 140 },
  { id: 'lastEngagementByUs', label: 'Last Engagement By Us', defaultWidth: 180 },
  { id: 'lastEngagementByLead', label: 'Last Engagement By Lead', defaultWidth: 190 },
  { id: 'lastPaymentStatus', label: 'Last Payment Status', defaultWidth: 150 },
  { id: 'lastPaymentAmount', label: 'Last Payment Amount', defaultWidth: 150 },
  { id: 'lastCallTime', label: 'Last Call Time', defaultWidth: 140 },
  { id: 'lastCallDuration', label: 'Last Call Duration', defaultWidth: 140 },
  { id: 'lastCallDirection', label: 'Last Call Direction', defaultWidth: 150 },
  { id: 'lastCallOutcome', label: 'Last Call Outcome', defaultWidth: 150 },
  { id: 'lastCallNature', label: 'Last Call Nature', defaultWidth: 140 },
  { id: 'lastCalledBy', label: 'Last Called By', defaultWidth: 140 },
  { id: 'lastVisit', label: 'Last Visit', defaultWidth: 130 },
  { id: 'lastVisitOutcome', label: 'Last Visit Outcome', defaultWidth: 150 },
  { id: 'lastVisitNature', label: 'Last Visit Nature', defaultWidth: 140 },
  { id: 'lastVisitBy', label: 'Last Visit By', defaultWidth: 130 },
  { id: 'lastEmail', label: 'Last Email', defaultWidth: 130 },
  { id: 'lastEmailBy', label: 'Last Email By', defaultWidth: 130 },
  { id: 'lastWhatsApp', label: 'Last WhatsApp', defaultWidth: 140 },
  { id: 'lastWhatsAppBy', label: 'Last WhatsApp By', defaultWidth: 140 },
  { id: 'lastWhatsAppBroadcast', label: 'Last WhatsApp Broadcast', defaultWidth: 180 },
  { id: 'lastBroadcastStatus', label: 'Last Broadcast Status', defaultWidth: 160 },
  { id: 'lastBroadcastReply', label: 'Last Broadcast Reply', defaultWidth: 160 },
  { id: 'lastBroadcastReplyType', label: 'Last Broadcast Reply Type', defaultWidth: 200 },
  { id: 'lastBroadcastReplyTime', label: 'Last Broadcast Reply Time', defaultWidth: 190 },
  { id: 'lastNote', label: 'Last Note', defaultWidth: 200 },
  { id: 'lastNoteBy', label: 'Last Note By', defaultWidth: 130 },
  { id: 'lastTaskDone', label: 'Last Task Done', defaultWidth: 140 },
  { id: 'lastTaskBy', label: 'Last Task By', defaultWidth: 130 },
  { id: 'leadAddedBy', label: 'Lead Added By', defaultWidth: 140 },
  { id: 'assignedLead', label: 'Assigned Lead', defaultWidth: 140 },
  { id: 'lastRepeatInquiry', label: 'Last Repeat Inquiry', defaultWidth: 160 },
  { id: 'created', label: 'Created', defaultWidth: 120 },
  { id: 'lastUpdated', label: 'Last Updated', defaultWidth: 120 }
];

interface SegmentLeadsTableProps {
  listName: string;
  onClose: () => void;
  onLeadClick: (lead: any) => void;
}

export function SegmentLeadsTable({ listName, onClose, onLeadClick }: SegmentLeadsTableProps) {
  useGlobalEscape(true, onClose);
  const { leads, updateLead, deleteLead } = useCRM();

  // Normalize real leads to support the 50 table columns gracefully without throwing errors
  const normalizedLeads = useMemo(() => {
    return leads.map(l => ({
      ...l,
      leadName: l.name || '-',
      leadOwner: l.counselor || l.owner || l.assignedTo || '-',
      leadStage: l.status || l.stage || '-',
      prospectingAttempts: l.prospectingAttempts || '-',
      lastWorked: l.lastWorked || '-',
      startedWorkOn: l.startedWorkOn || '-',
      nextFollowup: l.nextFollowup || l.followUpStatus || '-',
      movedToOpportunity: l.movedToOpportunity || '-',
      tags: l.tags || '-',
      productOrService: l.program || l.productOrService || '-',
      recentAction: l.recentAction || '-',
      unpickedCallAttempted: l.unpickedCallAttempted || '-',
      lastUserRemark: l.lastUserRemark || l.lastFollowUpRemark || '-',
      nextOpenTask: l.nextOpenTask || '-',
      lastClosedTask: l.lastClosedTask || '-',
      dealStage: l.dealStage || '-',
      leadDisposition: l.leadDisposition || '-',
      leadDispositionOn: l.leadDispositionOn || '-',
      business: l.business || '-',
      mobileNumber: l.mobile || l.mobileNumber || '-',
      email: l.email || '-',
      address: l.address || '-',
      state: l.state || '-',
      city: l.city || '-',
      area: l.area || '-',
      primaryTeam: l.primaryTeam || '-',
      designation: l.designation || '-',
      leadType: l.leadType || '-',
      leadPriority: l.priority || l.leadPriority || '-',
      leadSource: l.source || l.leadSource || '-',
      sourceLevel2: l.sourceLevel2 || '-',
      sourceLevel3: l.sourceLevel3 || '-',
      sourceLevel4: l.sourceLevel4 || '-',
      lastEngagementByUs: l.lastEngagementByUs || '-',
      lastEngagementByLead: l.lastEngagementByLead || '-',
      lastPaymentStatus: l.lastPaymentStatus || '-',
      lastPaymentAmount: l.lastPaymentAmount || '-',
      lastCallTime: l.lastCallTime || '-',
      lastCallDuration: l.lastCallDuration || '-',
      lastCallDirection: l.lastCallDirection || '-',
      lastCallOutcome: l.lastCallOutcome || '-',
      lastCallNature: l.lastCallNature || '-',
      lastCalledBy: l.lastCalledBy || '-',
      lastVisit: l.lastVisit || '-',
      lastVisitOutcome: l.lastVisitOutcome || '-',
      lastVisitNature: l.lastVisitNature || '-',
      lastVisitBy: l.lastVisitBy || '-',
      lastEmail: l.lastEmail || '-',
      lastEmailBy: l.lastEmailBy || '-',
      lastWhatsApp: l.lastWhatsApp || '-',
      lastWhatsAppBy: l.lastWhatsAppBy || '-',
      lastWhatsAppBroadcast: l.lastWhatsAppBroadcast || '-',
      lastBroadcastStatus: l.lastBroadcastStatus || '-',
      lastBroadcastReply: l.lastBroadcastReply || '-',
      lastBroadcastReplyType: l.lastBroadcastReplyType || '-',
      lastBroadcastReplyTime: l.lastBroadcastReplyTime || '-',
      lastNote: l.lastNote || '-',
      lastNoteBy: l.lastNoteBy || '-',
      lastTaskDone: l.lastTaskDone || '-',
      lastTaskBy: l.lastTaskBy || '-',
      leadAddedBy: l.leadAddedBy || '-',
      assignedLead: l.assignedLead || '-',
      lastRepeatInquiry: l.lastRepeatInquiry || '-',
      created: l.date || l.created || '-',
      lastUpdated: l.lastUpdated || '-'
    }));
  }, [leads]);

  // --- Resizable Columns State ---
  const [widths, setWidths] = useState<Record<string, number>>(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: col.defaultWidth }), {})
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Resize Drag Logic
  const handleResizeStart = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.pageX;
    const startWidth = widths[colId];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.pageX - startX;
      let newWidth = startWidth + diffX;
      if (newWidth < 80) newWidth = 80; // Min width
      if (newWidth > 600) newWidth = 600; // Max width
      setWidths(prev => ({ ...prev, [colId]: newWidth }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // --- Column Customization State ---
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // --- Filter and Sort ---
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc'|'desc'} | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [isStageFilterOpen, setIsStageFilterOpen] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('All Time');
  const [isDateRangeFilterOpen, setIsDateRangeFilterOpen] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Workflows
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [removedFromListIds, setRemovedFromListIds] = useState<string[]>([]);

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...normalizedLeads].filter(l => !removedFromListIds.includes(l.id));
    
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.leadName.toLowerCase().includes(q) || 
        l.mobileNumber.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) ||
        l.business.toLowerCase().includes(q) ||
        l.leadOwner.toLowerCase().includes(q) ||
        l.leadSource.toLowerCase().includes(q) ||
        l.productOrService.toLowerCase().includes(q)
      );
    }

    // Stage Filter
    if (stageFilter && stageFilter !== 'All') {
      result = result.filter(l => l.leadStage === stageFilter);
    }

    // Date Range Filter
    if (dateRangeFilter && dateRangeFilter !== 'All Time') {
      const now = new Date();
      result = result.filter(l => {
        const leadDate = new Date(l.created);
        if (dateRangeFilter === 'Last 7 Days') {
          return (now.getTime() - leadDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        }
        if (dateRangeFilter === 'This Month') {
          return now.getMonth() === leadDate.getMonth() && now.getFullYear() === leadDate.getFullYear();
        }
        if (dateRangeFilter === 'Last Month') {
          let prevMonth = now.getMonth() - 1;
          let prevYear = now.getFullYear();
          if (prevMonth < 0) { prevMonth = 11; prevYear--; }
          return prevMonth === leadDate.getMonth() && prevYear === leadDate.getFullYear();
        }
        return true;
      });
    }

    // Owner Filter
    if (ownerFilter && ownerFilter !== 'All') {
      result = result.filter(l => l.leadOwner === ownerFilter);
    }

    // Priority Filter
    if (priorityFilter && priorityFilter !== 'All') {
      result = result.filter(l => l.leadPriority === priorityFilter);
    }

    // Sort
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [search, sortConfig, stageFilter, dateRangeFilter, ownerFilter, priorityFilter]);

  const handleExportCSV = () => {
    const headers = ['Lead Name', 'Company', 'Email', 'Phone', 'Stage', 'Priority', 'Owner'];
    const csvData = filteredAndSortedLeads.map(l => [
      `"${l.leadName}"`,
      `"${l.business}"`,
      `"${l.email}"`,
      `"${l.mobileNumber}"`,
      `"${l.leadStage}"`,
      `"${l.leadPriority}"`,
      `"${l.leadOwner}"`
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredAndSortedLeads.length / itemsPerPage);
  const currentData = filteredAndSortedLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, itemsPerPage]);

  // --- Selection ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(currentData.map(d => d.id));
    else setSelectedIds([]);
  };
  const toggleSelect = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(p => [...p, id]);
    else setSelectedIds(p => p.filter(i => i !== id));
  };

  // --- Row Actions Dropdown ---
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const activeColumns = ALL_COLUMNS.filter(c => visibleColumns[c.id]);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ 
        padding: '24px 32px', 
        borderBottom: '1px solid #e2e8f0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'linear-gradient(to right, #f8fafc, #eff6ff)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2563eb', padding: '4px' }} onMouseOver={e => e.currentTarget.style.color = '#1d4ed8'} onMouseOut={e => e.currentTarget.style.color = '#2563eb'}>
             <ChevronLeft size={28} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Leads in Selected List - {listName}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>View and manage all leads in this list. You can search, filter, and customize columns.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Info Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Users size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Manage Your Leads</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Analyze, filter and take action to<br/>move leads forward.</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }} onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b'; }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        {selectedIds.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setSelectedIds([])} style={{ display: 'flex', alignItems: 'center', background: '#50809e', color: 'white', border: 'none', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ padding: '8px 10px', background: '#426881', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></span>
              <span style={{ padding: '8px 12px' }}>{selectedIds.length} Contact{selectedIds.length > 1 ? 's' : ''} Selected</span>
            </button>
            <button onClick={() => setShowBulkAssign(true)} style={{ display: 'flex', alignItems: 'center', background: '#50809e', color: 'white', border: 'none', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ padding: '8px 10px', background: '#426881', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserPlus size={16} /></span>
              <span style={{ padding: '8px 12px' }}>Assign</span>
            </button>
            <button onClick={() => {
              if(window.confirm(`Are you sure you want to delete ${selectedIds.length} selected lead(s)?`)) {
                deleteLead(selectedIds);
                setSelectedIds([]);
              }
            }} style={{ display: 'flex', alignItems: 'center', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ padding: '8px 10px', background: '#c9302c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></span>
              <span style={{ padding: '8px 12px' }}>Delete</span>
            </button>
            <button onClick={() => {
               if(window.confirm(`Are you sure you want to rechurn ${selectedIds.length} lead(s)?`)) {
                 leads.filter(l => selectedIds.includes(l.id)).forEach(l => {
                   updateLead({ ...l, status: 'Rechurned Lead', stage: 'Rechurned Lead' });
                 });
                 setSelectedIds([]);
               }
            }} style={{ display: 'flex', alignItems: 'center', background: '#50809e', color: 'white', border: 'none', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ padding: '8px 10px', background: '#426881', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={16} /></span>
              <span style={{ padding: '8px 12px' }}>Rechurn</span>
            </button>
            <button onClick={() => {
              if(window.confirm(`Remove selected lead(s) from this list?`)) {
                setRemovedFromListIds(prev => [...prev, ...selectedIds]);
                setSelectedIds([]);
              }
            }} style={{ display: 'flex', alignItems: 'center', background: '#50809e', color: 'white', border: 'none', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              <span style={{ padding: '8px 10px', background: '#426881', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserMinus size={16} /></span>
              <span style={{ padding: '8px 12px' }}>Remove From List</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '10px 16px', borderRadius: '10px', width: '300px', border: '1px solid #e2e8f0' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, email..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem', color: '#0f172a' }} 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setIsStageFilterOpen(!isStageFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: '#334155' }}>
                <FilterIcon size={16} /> {stageFilter === 'All' ? 'All Stages' : stageFilter} <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {isStageFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{ 
                      position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '220px', 
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                    }}
                  >
                    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {['All', 'New', 'Contacted', 'Interested Lead', 'Working', 'Opportunity Ready Leads'].map(stage => (
                        <button 
                          key={stage}
                          onClick={() => { setStageFilter(stage); setIsStageFilterOpen(false); }}
                          style={{ textAlign: 'left', padding: '8px 12px', background: stageFilter === stage ? '#f8fafc' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: stageFilter === stage ? '#2563eb' : '#334155', fontWeight: stageFilter === stage ? 600 : 400 }}
                          onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>{ if (stageFilter !== stage) e.currentTarget.style.background='transparent' }}
                        >
                          {stage === 'All' ? 'All Stages' : stage}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setIsDateRangeFilterOpen(!isDateRangeFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: '#334155' }}>
                <CalendarIcon size={16} /> {dateRangeFilter === 'All Time' ? 'Date Range' : dateRangeFilter} <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {isDateRangeFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{ 
                      position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '220px', 
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                    }}
                  >
                    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {['All Time', 'Last 7 Days', 'This Month', 'Last Month'].map(range => (
                        <button 
                          key={range}
                          onClick={() => { setDateRangeFilter(range); setIsDateRangeFilterOpen(false); setPage(1); }}
                          style={{ textAlign: 'left', padding: '8px 12px', background: dateRangeFilter === range ? '#f8fafc' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: dateRangeFilter === range ? '#2563eb' : '#334155', fontWeight: dateRangeFilter === range ? 600 : 400 }}
                          onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>{ if (dateRangeFilter !== range) e.currentTarget.style.background='transparent' }}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: '#334155' }}>
                <Settings size={16} /> More Filters {(ownerFilter !== 'All' || priorityFilter !== 'All') && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }}/>}
              </button>
              <AnimatePresence>
                {isMoreFiltersOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{ 
                      position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '280px', 
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Advanced Filters</h4>
                      <button onClick={() => { setOwnerFilter('All'); setPriorityFilter('All'); setPage(1); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Lead Owner</label>
                        <select value={ownerFilter} onChange={e => { setOwnerFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem', color: '#334155' }}>
                          <option value="All">All Owners</option>
                          {Array.from(new Set(normalizedLeads.map(l => l.leadOwner))).filter(Boolean).map(owner => (
                            <option key={owner} value={owner}>{owner}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Priority</label>
                        <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem', color: '#334155' }}>
                          <option value="All">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsExportOpen(!isExportOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
              <Download size={18} /> Export <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '200px', 
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                  }}
                >
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button 
                      onClick={handleExportCSV}
                      style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}
                    >
                      <Download size={16} /> Export as CSV
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column Management */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', border: '1px solid #bfdbfe', borderRadius: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#2563eb' }}
            >
              <Settings size={18} /> Customize Table Columns
            </button>
            
            <AnimatePresence>
              {isCustomizeOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '300px', maxHeight: '400px', 
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Show/Hide Columns</h4>
                    <button onClick={() => setVisibleColumns(ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}))} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Reset Default</button>
                  </div>
                  <div style={{ padding: '8px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {ALL_COLUMNS.map(col => (
                      <label key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <input type="checkbox" checked={visibleColumns[col.id]} onChange={e => setVisibleColumns(p => ({ ...p, [col.id]: e.target.checked }))} style={{ accentColor: '#2563eb' }} />
                        <span style={{ fontSize: '0.9rem', color: '#334155' }}>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table Area (Horizontal Scroll) */}
      <div 
        ref={tableContainerRef}
        style={{ flex: 1, overflow: 'auto', background: 'white', position: 'relative', margin: '0 16px', paddingBottom: '16px' }}
      >
        <table style={{ borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed', minWidth: '100%' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
            <tr>
              {/* Checkbox (Sticky Left) */}
              <th style={{ position: 'sticky', left: 0, width: '48px', padding: '0 16px', borderBottom: '1px solid #e2e8f0', background: 'white', zIndex: 60 }}>
                <input type="checkbox" onChange={toggleSelectAll} checked={currentData.length > 0 && selectedIds.length === currentData.length} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }} />
              </th>
              
              {activeColumns.map((col, idx) => {
                const isSticky = col.id === 'leadName';
                const isSortable = ['leadName', 'leadOwner', 'leadStage', 'prospectingAttempts', 'lastWorked', 'nextFollowup', 'leadPriority', 'created', 'lastUpdated'].includes(col.id);
                
                return (
                  <th 
                    key={col.id} 
                    style={{ 
                      width: `${widths[col.id]}px`, 
                      minWidth: `${widths[col.id]}px`, 
                      maxWidth: `${widths[col.id]}px`, 
                      padding: 0,
                      borderBottom: '1px solid #e2e8f0', 
                      background: 'white',
                      position: isSticky ? 'sticky' : 'relative',
                      left: isSticky ? '48px' : 'auto',
                      zIndex: isSticky ? 60 : 50,
                      fontSize: '0.75rem',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                      <div 
                        style={{ padding: '16px', flex: 1, cursor: isSortable ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}
                        onClick={() => isSortable && requestSort(col.id)}
                      >
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.label}</span>
                        {isSortable && <Filter size={14} color={sortConfig?.key === col.id ? "#2563eb" : "#cbd5e1"} />}
                      </div>
                      
                      {/* Resizer handle */}
                      <div 
                        onMouseDown={(e) => handleResizeStart(e, col.id)}
                        style={{ width: '8px', cursor: 'col-resize', height: '100%', position: 'absolute', right: '-4px', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                         <div style={{ width: '1px', height: '100%', background: '#e2e8f0', transition: 'background 0.2s' }} className="resizer-line" />
                      </div>
                    </div>
                  </th>
                )
              })}
              
              {/* Actions Column */}
              <th style={{ width: '80px', padding: '16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', background: 'white' }}>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row) => (
              <tr 
                key={row.id} 
                style={{ 
                  background: selectedIds.includes(row.id) ? '#f8fafc' : 'white', 
                  transition: 'background 0.2s' 
                }}
                onMouseOver={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = '#f8fafc' }}
                onMouseOut={(e) => { if (!selectedIds.includes(row.id)) e.currentTarget.style.background = 'white' }}
              >
                {/* Checkbox */}
                <td style={{ position: 'sticky', left: 0, padding: '0 16px', borderBottom: '1px solid #f1f5f9', background: selectedIds.includes(row.id) ? '#f8fafc' : 'white', zIndex: 10 }}>
                  <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={(e) => toggleSelect(row.id, e)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }} />
                </td>

                {activeColumns.map((col) => {
                  const isSticky = col.id === 'leadName';
                  
                  // Value mapping and styling
                  let content: any = (row as any)[col.id];
                  
                  if (col.id === 'leadName') {
                    let displayName = content || 'Unknown Lead';
                    let initials = displayName.trim() ? displayName.split(' ').map((n: string) => n[0]).join('').substring(0,2) : '?';
                    content = (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                          {initials.toUpperCase()}
                        </div>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>
                          {content}
                        </span>
                      </div>
                    );
                  } else if (col.id === 'leadOwner') {
                    let displayName = content || 'Unassigned';
                    let initials = displayName.trim() ? displayName.split(' ').map((n: string) => n[0]).join('').substring(0,2) : '?';
                    content = (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600 }}>
                          {initials.toUpperCase()}
                        </div>
                        <span style={{ color: '#334155' }}>{content}</span>
                      </div>
                    );
                  } else if (col.id === 'leadStage') {
                    let bg = '#f1f5f9', color = '#475569';
                    if (content === 'New') { bg = '#dbeafe'; color = '#1d4ed8'; }
                    else if (content === 'Contacted') { bg = '#f3e8ff'; color = '#6b21a8'; }
                    else if (content === 'Interested Lead') { bg = '#dcfce7'; color = '#166534'; }
                    else if (content === 'Working') { bg = '#fef3c7'; color = '#b45309'; }
                    else if (content === 'Opportunity Ready') { bg = '#fae8ff'; color = '#86198f'; }
                    
                    content = <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: bg, color: color }}>{content}</span>;
                  } else if (col.id === 'tags') {
                    const tags = content.split(',').map((t: string) => t.trim());
                    content = (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {tags.map((t: string, i: number) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: t === 'VIP' ? '#f3e8ff' : '#eff6ff', color: t === 'VIP' ? '#7e22ce' : '#2563eb' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    );
                  } else if (col.id === 'movedToOpportunity') {
                    content = <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: content === 'Yes' ? '#dcfce7' : '#fee2e2', color: content === 'Yes' ? '#166534' : '#991b1b' }}>{content}</span>;
                  } else if (col.id === 'recentAction') {
                    content = <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, background: '#eff6ff', color: '#2563eb' }}>{content}</span>;
                  } else if (col.id === 'leadPriority') {
                     content = <span style={{ 
                       padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                       background: content === 'High' ? '#fee2e2' : content === 'Medium' ? '#fef3c7' : '#f1f5f9',
                       color: content === 'High' ? '#991b1b' : content === 'Medium' ? '#92400e' : '#475569',
                     }}>
                       {content}
                     </span>;
                  } else {
                     content = <span title={(row as any)[col.id]} style={{ color: '#334155' }}>{(row as any)[col.id]}</span>;
                  }

                  return (
                    <td 
                      key={col.id} 
                      style={{ 
                        padding: '16px', 
                        borderBottom: '1px solid #f1f5f9', 
                        position: isSticky ? 'sticky' : 'relative',
                        left: isSticky ? '48px' : 'auto',
                        background: isSticky ? (selectedIds.includes(row.id) ? '#f8fafc' : 'white') : 'transparent',
                        zIndex: isSticky ? 10 : 1,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: isSticky ? 'pointer' : 'default'
                      }}
                      onClick={(e) => {
                        if (isSticky) {
                          e.stopPropagation();
                          onLeadClick(row);
                        }
                      }}
                    >
                      {content}
                    </td>
                  )
                })}
                
                {/* Actions */}
                <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', position: 'relative' }}>
                  <button onClick={() => setActiveMenu(activeMenu === row.id ? null : row.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <MoreVertical size={18} color="#94a3b8" />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === row.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        style={{ position: 'absolute', right: '40px', top: '10px', width: '160px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                         <button onClick={() => { onLeadClick(row); setActiveMenu(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><Eye size={16}/> View Lead</button>
                         <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><Edit2 size={16}/> Edit Lead</button>
                         <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><CalendarPlus size={16}/> Add Follow-up</button>
                         <div style={{ margin: '4px 0', borderTop: '1px solid #e2e8f0' }} />
                         <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><Phone size={16}/> Call</button>
                         <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='transparent'}><MessageCircle size={16}/> WhatsApp</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={activeColumns.length + 2} style={{ padding: '64px', textAlign: 'center', color: '#94a3b8' }}>
                   No leads match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Style tag to handle resizer hover effect without needing individual event listeners on every resizer */}
        <style dangerouslySetInnerHTML={{__html: `
          th:hover .resizer-line { background: #2563eb !important; }
        `}} />
      </div>

      {/* Footer Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Showing {Math.min((page - 1) * itemsPerPage + 1, filteredAndSortedLeads.length)} to {Math.min(page * itemsPerPage, filteredAndSortedLeads.length)} of {filteredAndSortedLeads.length} leads
          </span>
          <select 
            value={itemsPerPage} 
            onChange={e => setItemsPerPage(Number(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', color: '#334155', fontSize: '0.9rem', fontWeight: 500 }}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, color: '#334155' }}><ChevronLeft size={18} /></button>
           <button onClick={() => setPage(1)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: page === 1 ? '#2563eb' : 'transparent', color: page === 1 ? 'white' : '#334155', fontWeight: 600, cursor: 'pointer' }}>1</button>
           {totalPages > 1 && <button onClick={() => setPage(2)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: page === 2 ? '#2563eb' : 'transparent', color: page === 2 ? 'white' : '#334155', fontWeight: 600, cursor: 'pointer' }}>2</button>}
           <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: page === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, color: '#334155', fontWeight: 600 }}>Next</button>
        </div>
      </div>

      {showBulkAssign && (
        <AssignLeadsModal
          isOpen={showBulkAssign}
          onClose={() => setShowBulkAssign(false)}
          leads={leads.filter(l => selectedIds.includes(l.id))}
        />
      )}
    </div>,
    document.body
  );
}
