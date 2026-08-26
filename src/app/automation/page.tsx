'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Download, CheckSquare, Square, Eye, Edit2, Play, PauseCircle, Trash2, Zap, Activity, Clock, Server, Terminal, Copy, CheckCircle, Search, Book, Video, HelpCircle, FileText, Settings, CreditCard, Users, Calendar, MessagesSquare, Headphones, Mail, PhoneCall, ChevronRight, File, PlayCircle, ExternalLink, Bot, BarChart2, Shield, ArrowLeft, Send, Link as LinkIcon, AlertCircle, Check } from 'lucide-react';
import { mockMembers, getRandomMember } from '@/lib/mockMembers';

export interface WorkflowRecord {
  id: string;
  name: string;
  trigger: string;
  action: string;
  createdBy: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Failed';
  lastRun: string;
  nextRun: string;
  successRate: number;
}

const triggers = ['On New Lead', 'On Payment Success', 'On Form Submit', 'Schedule (Daily)', 'On Application Approved'];
const statuses = ['Active', 'Paused', 'Draft', 'Failed'];

const generateMockWorkflows = (): WorkflowRecord[] => {
  const wfs: WorkflowRecord[] = [];
  const names = ['Send Welcome Email', 'Generate Receipt PDF', 'Assign Lead to Sales', 'Sync with Google Calendar', 'Follow-up WhatsApp Message'];
  const actions = ['Send Email via SendGrid', 'Generate PDF & Email', 'Update Lead Owner', 'Create G-Cal Event', 'Send WhatsApp Template'];
  
  for (let i = 1; i <= 20; i++) {
    const idx = Math.floor(Math.random() * names.length);
    wfs.push({
      id: `WF-${5000 + i}`,
      name: names[idx],
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      action: actions[idx],
      createdBy: getRandomMember().name,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      lastRun: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 10:30 AM',
      nextRun: new Date(Date.now() + Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 10:30 AM',
      successRate: Math.floor(Math.random() * 20) + 80
    });
  }
  return wfs;
};

const mockWorkflows = generateMockWorkflows();

export default function AutomationPage() {
  const [data, setData] = useState<WorkflowRecord[]>(mockWorkflows);
  const [filteredData, setFilteredData] = useState<WorkflowRecord[]>(mockWorkflows);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [viewModal, setViewModal] = useState<WorkflowRecord | null>(null);
  const [editModal, setEditModal] = useState<WorkflowRecord | null>(null);
  const [logsModal, setLogsModal] = useState<WorkflowRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: WorkflowRecord[]) => {
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
      case 'Failed': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Paused': return { bg: '#fef3c7', text: '#d97706' };
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

  const downloadSimulatedPDF = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${title}.pdf exported`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal) {
      setData(d => d.map(wf => wf.id === editModal.id ? editModal : wf));
      setFilteredData(d => d.map(wf => wf.id === editModal.id ? editModal : wf));
      setEditModal(null);
      showToast('Automation updated successfully');
    }
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(wf => wf.id !== deleteModal));
      setFilteredData(d => d.filter(wf => wf.id !== deleteModal));
      setDeleteModal(null);
      showToast('Automation workflow deleted');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'trigger', label: 'Trigger', type: 'select', options: triggers }
  ];

  const exportMapping = [
    { key: 'id' as keyof WorkflowRecord, label: 'WF ID' },
    { key: 'name' as keyof WorkflowRecord, label: 'Name' },
    { key: 'trigger' as keyof WorkflowRecord, label: 'Trigger' },
    { key: 'status' as keyof WorkflowRecord, label: 'Status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Automation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage workflows, triggers, and automated actions.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['name', 'id', 'trigger', 'createdBy']}
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
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Trigger & Action</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Success Rate</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Last Run</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(wf => (
                <tr key={wf.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(wf.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(wf.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(wf.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(wf.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--primary-color)' }}>
                        <Zap size={18}/>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{wf.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>By {wf.createdBy}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{wf.trigger}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>➔ {wf.action}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(wf.status).bg, color: getStatusColor(wf.status).text, display: 'inline-block' }}>
                      {wf.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${wf.successRate}%`, background: wf.successRate > 90 ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{wf.successRate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{wf.lastRun}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View', icon: <Eye size={16} />, onClick: () => setViewModal(wf) },
                      { label: 'Edit', icon: <Edit2 size={16} />, onClick: () => setEditModal(wf) },
                      { label: 'Run Now', icon: <Play size={16} color="#059669" />, onClick: () => showToast(`Executing workflow ${wf.name}...`) },
                      { label: 'Pause', icon: <PauseCircle size={16} color="#d97706" />, onClick: () => {
                          setData(d => d.map(x => x.id === wf.id ? { ...x, status: 'Paused' } : x));
                          setFilteredData(d => d.map(x => x.id === wf.id ? { ...x, status: 'Paused' } : x));
                          showToast(`Workflow paused`);
                        }
                      },
                      { label: 'Resume', icon: <Play size={16} color="#059669" />, onClick: () => {
                          setData(d => d.map(x => x.id === wf.id ? { ...x, status: 'Active' } : x));
                          setFilteredData(d => d.map(x => x.id === wf.id ? { ...x, status: 'Active' } : x));
                          showToast(`Workflow resumed`);
                        }
                      },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => {
                          const newWf = { ...wf, id: `WF-${Math.floor(Math.random()*10000)}`, name: `${wf.name} (Copy)` } as WorkflowRecord;
                          setData([newWf, ...data]);
                          setFilteredData([newWf, ...filteredData]);
                          showToast(`Automation duplicated`);
                        }
                      },
                      { label: 'View Logs', icon: <Terminal size={16} />, onClick: () => setLogsModal(wf) },
                      { label: 'Export', icon: <Download size={16} />, onClick: () => downloadSimulatedPDF(`Automation_Report_${wf.id}`, `AUTOMATION REPORT\n\nWorkflow: ${wf.name}\nTrigger: ${wf.trigger}\nAction: ${wf.action}\nCreated By: ${wf.createdBy}\nStatus: ${wf.status}\nSuccess Rate: ${wf.successRate}%`) },
                      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(wf.id) }
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
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '16px' }}>
                  <Zap size={32} color="var(--primary-color)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewModal.name}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {viewModal.id} • Created by {viewModal.createdBy}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Configuration</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Trigger Event</span> <span style={{ fontWeight: 500 }}>{viewModal.trigger}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Action</span> <span style={{ fontWeight: 500 }}>{viewModal.action}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Execution Stats</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Last Run</span> <span style={{ fontWeight: 500 }}>{viewModal.lastRun}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Next Run</span> <span style={{ fontWeight: 500 }}>{viewModal.nextRun}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Success Rate</span> <span style={{ fontWeight: 500, color: viewModal.successRate > 90 ? '#10b981' : '#f59e0b' }}>{viewModal.successRate}%</span></div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Execution History</h3>
                <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#10b981"/> Successfully ran at {viewModal.lastRun}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#10b981"/> Successfully ran at {new Date(Date.now() - 86400000).toISOString().split('T')[0]} 10:30 AM</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={14} color="#10b981"/> Successfully ran at {new Date(Date.now() - 172800000).toISOString().split('T')[0]} 10:30 AM</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setLogsModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Terminal size={16} /> View Logs</button>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit2 size={16} /> Edit Workflow</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit2 size={24} color="var(--primary-color)" /> Edit Workflow - {editModal.id}</h2>
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Workflow Name</label><input type="text" value={editModal.name} onChange={e => setEditModal({...editModal, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trigger Event</label>
                  <select value={editModal.trigger} onChange={e => setEditModal({...editModal, trigger: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {triggers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Action</label>
                  <input type="text" value={editModal.action} onChange={e => setEditModal({...editModal, action: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select value={editModal.status} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGS MODAL */}
      {logsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: '#1e1e2f', color: '#e2e8f0', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}><Terminal size={24} color="#10b981" /> System Logs: {logsModal.id}</h2>
              <button onClick={() => setLogsModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #475569', background: 'transparent', color: '#e2e8f0', cursor: 'pointer' }}>Close</button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6', background: '#0f172a', padding: '24px', borderRadius: '12px', overflowX: 'auto' }}>
              <div style={{ color: '#94a3b8' }}>[SYSTEM] Initializing log stream for {logsModal.name}...</div>
              <div style={{ color: '#94a3b8' }}>[SYSTEM] Connecting to worker nodes...</div>
              <br/>
              <div style={{ color: '#10b981' }}>[INFO] {logsModal.lastRun} - Trigger [{logsModal.trigger}] fired successfully.</div>
              <div style={{ color: '#38bdf8' }}>[DEBUG] Payload received: {"{ event_type: 'webhook_post', payload_size: '2kb' }"}</div>
              <div style={{ color: '#10b981' }}>[INFO] Executing action [{logsModal.action}]...</div>
              <div style={{ color: '#38bdf8' }}>[DEBUG] HTTP POST 200 OK - Target API resolved in 124ms.</div>
              <div style={{ color: '#10b981' }}>[INFO] Action completed successfully.</div>
              <br/>
              <div style={{ color: '#94a3b8' }}>[SYSTEM] Next scheduled run: {logsModal.nextRun}</div>
              <div style={{ color: '#f59e0b' }}>[WARN] Rate limit threshold approaching (85% utilization).</div>
              <div style={{ color: '#94a3b8' }}>[SYSTEM] End of stream.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => downloadSimulatedPDF(`Logs_${logsModal.id}`, `SYSTEM LOGS: ${logsModal.id}\n\n[INFO] ${logsModal.lastRun} - Trigger [${logsModal.trigger}] fired successfully.\n[DEBUG] Payload received: { event_type: 'webhook_post', payload_size: '2kb' }\n[INFO] Executing action [${logsModal.action}]...\n[DEBUG] HTTP POST 200 OK - Target API resolved in 124ms.\n[INFO] Action completed successfully.\n\n[SYSTEM] Next scheduled run: ${logsModal.nextRun}`)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #475569', background: '#334155', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Download size={16}/> Export Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Workflow?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete workflow <strong>{deleteModal}</strong>? This action cannot be undone.</p>
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
