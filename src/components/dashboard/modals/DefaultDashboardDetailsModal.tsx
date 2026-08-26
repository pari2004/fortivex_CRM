'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Download, Printer, RefreshCw, ChevronDown, PieChart, Activity, Edit, Copy } from 'lucide-react';
import { TableRowActionsMenu } from './TableRowActionsMenu';

interface Props {
  title: string;
  type: string; // 'table', 'analytics', 'timeline', 'edit_widget', 'duplicate_widget'
  onClose: () => void;
  demoData?: any;
  setDemoData?: (data: any) => void;
  activePipeline?: string;
}

export function DefaultDashboardDetailsModal({ title, type, onClose, demoData, setDemoData, activePipeline }: Props) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action Modals State (for table row actions)
  const [activeActionModal, setActiveActionModal] = useState<{type: string, data: any} | null>(null);

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Changes saved successfully');
    setActiveActionModal(null);
  };

  const handleRowAction = (action: string, row: any) => {
    setActiveActionModal({ type: action, data: row });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Data refreshed successfully');
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filterByOwner = (arr: any[]) => activePipeline === 'My' ? arr.filter(item => item.assignedTo === 'Priya Nair') : arr;

  const getDataset = () => {
    if (!demoData) return [];
    if (title === 'New Inquiry Leads Added') return demoData.newInquiryLeads || [];
    if (title === 'Call Attempted Leads Worked') return demoData.callAttemptedLeads || [];
    if (title === 'Total Leads Worked') return demoData.totalLeadsWorked || [];
    if (title === 'Closed Leads') return demoData.closedLeads || [];
    if (title === 'New Leads' || title === 'Work Pipeline') return filterByOwner(demoData.wpNewLeads || []);
    if (title === 'Ad-hoc Tasks') return filterByOwner(demoData.wpAdHocTasks || []);
    if (title === 'Newly Assigned Leads') return filterByOwner(demoData.wpNewlyAssigned || []);
    if (title === 'Overall Activities') return demoData.overallActivities || [];
    if (title === 'Repeat Enquiries') return [];
    if (title === 'User Set Follow-up for Today') return [];
    if (title === 'System Set Follow-up for Today') return [];
    if (title === 'Last 30 Days Overdue Follow-ups') return [];
    if (title === 'Calls You Missed') return [];
    if (title === 'Recent Closed Leads') return filterByOwner(demoData.closedLeads || []);
    return [];
  };

  const getDatasetKey = () => {
    if (title === 'New Inquiry Leads Added') return 'newInquiryLeads';
    if (title === 'Call Attempted Leads Worked') return 'callAttemptedLeads';
    if (title === 'Total Leads Worked') return 'totalLeadsWorked';
    if (title === 'Closed Leads') return 'closedLeads';
    if (title === 'New Leads' || title === 'Work Pipeline') return 'workPipelineNewLeads';
    if (title === 'Ad-hoc Tasks') return 'workPipelineAdHocTasks';
    if (title === 'Newly Assigned Leads') return 'workPipelineNewlyAssigned';
    if (title === 'Overall Activities') return 'overallActivities';
    return '';
  };

  const { data, columns, dataKeys } = useMemo(() => {
    let rawData = getDataset();
    let cols = [];
    let keys = [];

    if (
      title === 'New Inquiry Leads Added' || 
      title === 'New Leads' || 
      title === 'Work Pipeline' ||
      title === 'Call Attempted Leads Worked' ||
      title === 'Total Leads Worked' ||
      title === 'Closed Leads' ||
      title === 'Newly Assigned Leads' ||
      title === 'Recent Closed Leads'
    ) {
      cols = [
        'Lead Name', 'Lead Owner', 'Lead Stage', 'Sub Stage/Close Status', 'Closed On',
        'Awaiting First Two Attempts', 'Last Worked', 'Started Working On', 'Speed To First',
        'Next Follow-up', 'Became Opportunity', 'Tags', 'Product/Service', 'Recent Actions',
        'Unanswered Calls', 'Missed Calls', 'Remark', 'Next Open Task', 'Open Ticket',
        'Last Closed Task', 'Deal Stage', 'Lead Disposition', 'Last Disposition', 'Business',
        'Mobile Number', 'Email', 'Address', 'State', 'City', 'Area', 'Country', 'Zip Code',
        'Designation', 'Lead Type', 'Lead Priority', 'Lead Source', 'Source Level 2/3/4',
        'Last Engagement', 'Last Payment', 'Last Payment Amount', 'Total Payment',
        'Last Call Time', 'Last Call Duration', 'Last Call Direction', 'Last Call Outcome',
        'Last Called By', 'Last Visit', 'Last Visit Outcome', 'Last Visit By', 'Last Email',
        'Last Email By', 'Last WhatsApp', 'Last WhatsApp By', 'Last Broadcast',
        'Last Broadcast Reply', 'Last Note', 'Last Note By', 'Last Task Done', 'Last Task By',
        'Lead Added By', 'Assigned Status', 'Assigned On', 'Last Repeat Inquiry', 'Created',
        'Last Updated', 'Is Duplicate', 'Interested In', 'Current Company', 'Experience Level',
        'What You Do', 'Career Goal', 'Enrollment Time', 'Technical Background'
      ];
      
      keys = cols; // Since our mock data uses exactly these keys
    } 
    else if (title === 'Ad-hoc Tasks') {
      cols = ['Task Title', 'Lead Name', 'Assigned To', 'Status'];
      keys = ['title', 'Lead Name', 'assignedTo', 'status'];
    }
    else {
      cols = ['Name', 'ID', 'Status'];
      keys = ['name', 'id', 'status'];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rawData = rawData.filter((item: any) => 
        Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(q)
        )
      );
    }

    return { data: rawData, columns: cols, dataKeys: keys };
  }, [demoData, title, searchQuery, activePipeline]);

  // Wrap the table rendering in a container with overflow-x: auto to support 70+ columns
    return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000 }}>
      
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px 24px', borderRadius: '8px', zIndex: 10000, color: '#10b981', fontWeight: 500, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modals */}
      <AnimatePresence>
        {activeActionModal && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {activeActionModal.type} - {activeActionModal.data.name || activeActionModal.data.id}
                </h3>
                <button onClick={() => setActiveActionModal(null)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              {activeActionModal.type === 'View Details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {Object.keys(activeActionModal.data).map(k => (
                    <div key={k}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.toUpperCase()}</span>
                      <span style={{ fontWeight: 500 }}>{activeActionModal.data[k] || '-'}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeActionModal.type === 'Edit' && (
                <form onSubmit={handleSaveAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['name', 'status', 'assignedTo'].map(field => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input 
                        type="text" 
                        value={activeActionModal.data[field] || ''} 
                        onChange={e => setActiveActionModal({ ...activeActionModal, data: { ...activeActionModal.data, [field]: e.target.value } })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  ))}
                  <button type="submit" className="primary-btn" style={{ padding: '12px', marginTop: '12px' }}>Save Changes</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '95%', maxWidth: '1400px', height: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {title} 
              {type === 'analytics' && ' Analytics'}
              {type === 'timeline' && ' Timeline'}
              {type === 'edit_widget' && ' Edit Widget'}
              {type === 'duplicate_widget' && ' Duplicate'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Isolated view for {title} only.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="secondary-btn" onClick={handleRefresh} style={{ padding: '8px' }}>
              <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
            </button>
            <button className="secondary-btn" onClick={handlePrint} style={{ padding: '8px' }}><Printer size={18} /></button>
            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 4px' }} />
            <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* ANALYTICS VIEW */}
          {type === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {[
                { label: 'Total Records', val: data.length },
                { label: 'Today\'s Records', val: data.length },
                { label: 'Weekly Trend', val: '+14%' },
                { label: 'Conversion/Completion', val: '100%' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{stat.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stat.val}</div>
                </div>
              ))}
              <div style={{ gridColumn: 'span 4', background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Assigned User Performance</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>Priya Nair: {data.filter((d:any) => d.assignedTo === 'Priya Nair' || d.user === 'Priya Nair').length}</div>
                  <div style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>Rahul Kumar: {data.filter((d:any) => d.assignedTo === 'Rahul Kumar' || d.user === 'Rahul Kumar').length}</div>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE VIEW */}
          {type === 'timeline' && (
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)', marginTop: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.type || item.status || 'Activity'} - {item.name || item.user}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.createdAt || item.date || item.assignedDate || 'Just now'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDIT/DUPLICATE WIDGET VIEW */}
          {(type === 'edit_widget' || type === 'duplicate_widget') && (
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '20px' }}>{type === 'edit_widget' ? 'Edit' : 'Duplicate'} {title} Widget</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Widget Title</label>
                  <input type="text" defaultValue={type === 'duplicate_widget' ? `${title} (Copy)` : title} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Display Options</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    <option>Table View</option>
                    <option>List View</option>
                  </select>
                </div>
                <button className="primary-btn" onClick={() => { showToast('Widget saved successfully!'); onClose(); }} style={{ padding: '12px', marginTop: '8px' }}>Save Widget</button>
              </div>
            </div>
          )}

          {/* TABLE VIEW */}
          {type === 'table' && (
            <>
              {/* Toolbar */}
              <div style={{ padding: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '400px' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="Search details..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflowX: 'auto', overflowY: 'visible' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                  <thead style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                    <tr>
                      {columns.map(col => (
                        <th key={col} style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                      {/* Fixed width action column to ensure alignment */}
                      <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, width: '80px', textAlign: 'center' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: any) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }} className="hover-bg-secondary">
                        {dataKeys.map(key => (
                          <td key={key} style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                            {row[key] || '-'}
                          </td>
                        ))}
                        <td style={{ padding: '16px', width: '80px', textAlign: 'center' }}>
                          {/* Portal-based menu that never clips */}
                          <TableRowActionsMenu onAction={(act) => handleRowAction(act, row)} />
                        </td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={columns.length + 1} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
