import os

content = """'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Zap, Eye, Edit, Trash2, Power, PowerOff, Play, Copy, Activity, CheckSquare, Square, Settings, ListTree, User, Clock } from 'lucide-react';

export interface AutomationRecord {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'Active' | 'Inactive' | 'Draft' | 'Error';
  createdBy: string;
  lastRun: string;
  nextRun: string;
  executionCount: number;
}

const triggers = ['On Application Submit', 'On Payment Success', 'When Task Overdue', 'On Status Change', 'Scheduled Time'];
const statuses = ['Active', 'Inactive', 'Draft', 'Error'];
const users = ['System', 'Rahul Sharma', 'Anjali Desai'];

const generateMockAutomations = (): AutomationRecord[] => {
  const autos: AutomationRecord[] = [];
  const workflows = [
    { name: 'Welcome Email', action: 'Send Welcome Package Email' },
    { name: 'Payment Receipt', action: 'Generate & Email PDF Receipt' },
    { name: 'Task Reminder', action: 'Send Slack Notification to Assignee' },
    { name: 'Lead Assignment', action: 'Round-robin assign to Counselors' },
    { name: 'Daily Report', action: 'Email Daily Summary to Management' },
    { name: 'Document Verification', action: 'Tag student as Verified' },
    { name: 'Follow-up Alert', action: 'Create Task for follow-up' },
    { name: 'Interview Scheduled', action: 'Send Calendar Invite' },
    { name: 'Offer Letter Gen', action: 'Generate Offer Letter PDF' },
    { name: 'Refund Processed', action: 'Update Account Ledgers' }
  ];

  for (let i = 0; i < workflows.length; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    autos.push({
      id: `WF-${100 + i}`,
      name: workflows[i].name,
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      action: workflows[i].action,
      status: status,
      createdBy: users[Math.floor(Math.random() * users.length)],
      lastRun: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextRun: new Date(Date.now() + Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      executionCount: Math.floor(Math.random() * 5000)
    });
  }
  return autos;
};

const mockAutomations = generateMockAutomations();

export default function AutomationPage() {
  const [data, setData] = useState<AutomationRecord[]>(mockAutomations);
  const [filteredData, setFilteredData] = useState<AutomationRecord[]>(mockAutomations);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [viewModal, setViewModal] = useState<AutomationRecord | null>(null);
  const [editModal, setEditModal] = useState<Partial<AutomationRecord> | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [logsModal, setLogsModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: AutomationRecord[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(currentData.map(c => c.id)));
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return { bg: '#d1fae5', text: '#059669' };
      case 'Error': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Inactive': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal?.id) {
      setData(d => d.map(x => x.id === editModal.id ? { ...x, ...editModal as AutomationRecord } : x));
      setFilteredData(d => d.map(x => x.id === editModal.id ? { ...x, ...editModal as AutomationRecord } : x));
      showToast('Automation updated successfully');
    } else {
      const newAuto = { ...editModal, id: `WF-${Math.floor(Math.random()*1000)}`, status: 'Draft', executionCount: 0, lastRun: '-', nextRun: '-' } as AutomationRecord;
      setData([newAuto, ...data]);
      setFilteredData([newAuto, ...filteredData]);
      showToast('Automation created successfully');
    }
    setEditModal(null);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(x => x.id !== deleteModal));
      setFilteredData(d => d.filter(x => x.id !== deleteModal));
      setDeleteModal(null);
      showToast('Automation deleted successfully');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'trigger', label: 'Trigger', type: 'select', options: triggers }
  ];

  const exportMapping = [
    { key: 'id' as keyof AutomationRecord, label: 'WF ID' },
    { key: 'name' as keyof AutomationRecord, label: 'Name' },
    { key: 'trigger' as keyof AutomationRecord, label: 'Trigger' },
    { key: 'action' as keyof AutomationRecord, label: 'Action' },
    { key: 'status' as keyof AutomationRecord, label: 'Status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Automation</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage workflows and automated tasks.</p>
        </div>
        <button className="primary-btn" onClick={() => setEditModal({})}>
          <Zap size={18} /> Create Workflow
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['name', 'trigger', 'action']}
          searchPlaceholder="Search workflows..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedRows.has(c.id))}
          exportMapping={exportMapping}
          exportFilename="Automations"
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {selectedRows.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Workflow</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status & Stats</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Trigger</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Action</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(auto => (
                <tr key={auto.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(auto.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(auto.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(auto.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(auto.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{auto.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{auto.id}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: getStatusColor(auto.status).bg, color: getStatusColor(auto.status).text }}>
                        {auto.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Runs: {auto.executionCount.toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{auto.trigger}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{auto.action}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Automation', icon: <Eye size={16} />, onClick: () => setViewModal(auto) },
                      { label: 'Edit Automation', icon: <Edit size={16} />, onClick: () => setEditModal(auto) },
                      { label: 'Enable', icon: <Power size={16} color="#059669" />, onClick: () => {
                          setData(d => d.map(x => x.id === auto.id ? { ...x, status: 'Active' } : x));
                          setFilteredData(d => d.map(x => x.id === auto.id ? { ...x, status: 'Active' } : x));
                          showToast('Automation enabled');
                        }
                      },
                      { label: 'Disable', icon: <PowerOff size={16} color="#d97706" />, onClick: () => {
                          setData(d => d.map(x => x.id === auto.id ? { ...x, status: 'Inactive' } : x));
                          setFilteredData(d => d.map(x => x.id === auto.id ? { ...x, status: 'Inactive' } : x));
                          showToast('Automation disabled');
                        }
                      },
                      { label: 'Run Now', icon: <Play size={16} color="#2563eb" />, onClick: () => showToast(`Manually triggering ${auto.name}`) },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => {
                          const newAuto = { ...auto, id: `WF-${Math.floor(Math.random()*1000)}`, name: `${auto.name} (Copy)`, status: 'Draft', executionCount: 0 } as AutomationRecord;
                          setData([newAuto, ...data]);
                          setFilteredData([newAuto, ...filteredData]);
                          showToast('Automation duplicated');
                        }
                      },
                      { label: 'View Logs', icon: <Activity size={16} />, onClick: () => setLogsModal(auto.id) },
                      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(auto.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <Settings size={40} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{viewModal.name}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ListTree size={16}/> {viewModal.id} • Workflow
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Configuration</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Trigger</span> <span style={{ fontWeight: 500 }}>{viewModal.trigger}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Action</span> <span style={{ fontWeight: 500 }}>{viewModal.action}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Created By</span> <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> {viewModal.createdBy}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Execution Stats</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Total Executions</span> <span style={{ fontWeight: 500 }}>{viewModal.executionCount.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Last Run</span> <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {viewModal.lastRun}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Next Run</span> <span style={{ fontWeight: 500 }}>{viewModal.nextRun}</span></div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18}/> Recent Logs</h3>
                <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '8px' }}>[INFO] {viewModal.lastRun} 10:00:00 - Workflow triggered successfully.</div>
                  <div style={{ marginBottom: '8px' }}>[INFO] {viewModal.lastRun} 10:00:01 - Executing action: {viewModal.action}.</div>
                  <div style={{ color: '#059669' }}>[SUCCESS] {viewModal.lastRun} 10:00:02 - Action completed.</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Automation</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={24} color="var(--primary-color)" /> {editModal.id ? 'Edit Automation' : 'Create Automation'}</h2>
            
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Workflow Name</label>
                  <input type="text" required value={editModal.name || ''} onChange={e => setEditModal({...editModal, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trigger Event</label>
                  <select required value={editModal.trigger || ''} onChange={e => setEditModal({...editModal, trigger: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <option value="">Select Trigger...</option>
                    {triggers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Action to Perform</label>
                  <input type="text" required value={editModal.action || ''} onChange={e => setEditModal({...editModal, action: e.target.value})} placeholder="e.g. Send Email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                
                {editModal.id && (
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                    <select required value={editModal.status || 'Draft'} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGS MODAL */}
      {logsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={24} color="var(--primary-color)" /> Execution Logs</h2>
            <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '8px', height: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>[2024-05-15 10:00:00] INIT: Workflow {logsModal} started.</div>
              <div>[2024-05-15 10:00:01] INFO: Evaluating trigger conditions.</div>
              <div>[2024-05-15 10:00:02] INFO: Conditions met. Executing action.</div>
              <div style={{ color: '#4ade80' }}>[2024-05-15 10:00:03] SUCCESS: Action executed successfully.</div>
              <div>[2024-05-15 12:00:00] INIT: Workflow {logsModal} started.</div>
              <div>[2024-05-15 12:00:01] INFO: Evaluating trigger conditions.</div>
              <div>[2024-05-15 12:00:02] INFO: Conditions met. Executing action.</div>
              <div style={{ color: '#4ade80' }}>[2024-05-15 12:00:03] SUCCESS: Action executed successfully.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setLogsModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Close Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Automation?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete automation <strong>{deleteModal}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/automation/page.tsx", "w") as f:
    f.write(content)
print("Updated Automation Action Menus")
