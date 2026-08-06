import os

content = """'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Edit, Trash2, CheckCircle, Clock, Square, CheckSquare, Plus, AlertCircle, FileText, UserPlus, Eye, Download, Copy, MessagesSquare } from 'lucide-react';

export interface TaskRecord {
  id: string;
  taskName: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  description: string;
  category: 'Admissions' | 'Sales' | 'Marketing' | 'Finance' | 'Support' | 'Administration';
}

const categories = ['Admissions', 'Sales', 'Marketing', 'Finance', 'Support', 'Administration'];
const assignees = ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor', 'Aditi Verma'];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Open', 'In Progress', 'Completed', 'Overdue'];

const generateMockTasks = (): TaskRecord[] => {
  const tasks: TaskRecord[] = [];
  const taskNames = [
    'Call Lead for Demo', 'Follow up on payment', 'Send Welcome Email', 
    'Verify Documents', 'Assign batch', 'Create marketing campaign', 
    'Review admission criteria', 'Generate monthly report'
  ];

  for (let i = 1; i <= 40; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    tasks.push({
      id: `TSK-${3000 + i}`,
      taskName: taskNames[Math.floor(Math.random() * taskNames.length)],
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
      dueDate: new Date(Date.now() + (Math.floor(Math.random() * 20) - 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: status,
      progress: status === 'Completed' ? 100 : (status === 'Open' ? 0 : Math.floor(Math.random() * 80) + 10),
      description: 'Please complete this task by the due date. Follow up with the respective teams if blocked.',
      category: categories[Math.floor(Math.random() * categories.length)] as any
    });
  }
  return tasks;
};

const mockTasks = generateMockTasks();

export default function TasksPage() {
  const [data, setData] = useState<TaskRecord[]>(mockTasks);
  const [filteredData, setFilteredData] = useState<TaskRecord[]>(mockTasks);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [viewModal, setViewModal] = useState<TaskRecord | null>(null);
  const [editModal, setEditModal] = useState<Partial<TaskRecord> | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: TaskRecord[]) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#d1fae5', text: '#059669' };
      case 'Overdue': return { bg: '#fee2e2', text: '#dc2626' };
      case 'In Progress': return { bg: '#dbeafe', text: '#2563eb' };
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

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal?.id) {
      setData(d => d.map(t => t.id === editModal.id ? { ...t, ...editModal as TaskRecord } : t));
      setFilteredData(d => d.map(t => t.id === editModal.id ? { ...t, ...editModal as TaskRecord } : t));
      showToast('Task updated successfully');
    } else {
      const newTask = { ...editModal, id: `TSK-${Math.floor(Math.random()*10000)}`, status: 'Open', progress: 0 } as TaskRecord;
      setData([newTask, ...data]);
      setFilteredData([newTask, ...filteredData]);
      showToast('Task created successfully');
    }
    setEditModal(null);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(app => app.id !== deleteModal));
      setFilteredData(d => d.filter(app => app.id !== deleteModal));
      setDeleteModal(null);
      showToast('Task deleted');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'category', label: 'Category', type: 'select', options: categories },
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'priority', label: 'Priority', type: 'select', options: priorities },
    { key: 'assignedTo', label: 'Assignee', type: 'select', options: assignees },
    { key: 'dueDate', label: 'Due Date', type: 'date' }
  ];

  const exportMapping = [
    { key: 'id' as keyof TaskRecord, label: 'Task ID' },
    { key: 'taskName' as keyof TaskRecord, label: 'Task' },
    { key: 'category' as keyof TaskRecord, label: 'Category' },
    { key: 'priority' as keyof TaskRecord, label: 'Priority' },
    { key: 'status' as keyof TaskRecord, label: 'Status' },
    { key: 'assignedTo' as keyof TaskRecord, label: 'Assignee' },
    { key: 'dueDate' as keyof TaskRecord, label: 'Due Date' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your daily activities and follow-ups.</p>
        </div>
        <button className="primary-btn" onClick={() => setEditModal({})}>
          <Plus size={18} /> Create Task
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['taskName', 'id', 'assignedTo', 'description']}
          searchPlaceholder="Search tasks..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedRows.has(c.id))}
          exportMapping={exportMapping}
          exportFilename="Tasks"
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
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Task Name</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Category</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Priority</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status & Progress</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Due Date</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(task.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(task.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(task.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(task.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{task.taskName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <UserPlus size={12}/> {task.assignedTo} | {task.id}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{task.category}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: getPriorityColor(task.priority), fontWeight: 600, fontSize: '0.9rem' }}>
                      <AlertCircle size={14}/> {task.priority}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content', background: getStatusColor(task.status).bg, color: getStatusColor(task.status).text }}>
                        {task.status}
                      </span>
                      <div style={{ width: '100%', maxWidth: '100px', height: '6px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${task.progress}%`, background: 'var(--primary-color)' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="var(--text-tertiary)"/> {task.dueDate}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Task', icon: <Eye size={16} />, onClick: () => setViewModal(task) },
                      { label: 'Edit Task', icon: <Edit size={16} />, onClick: () => setEditModal(task) },
                      { label: 'Assign Task', icon: <UserPlus size={16} />, onClick: () => showToast(`Assigning ${task.id}`) },
                      { label: 'Mark Completed', icon: <CheckCircle size={16} color="#059669" />, onClick: () => {
                          setData(d => d.map(x => x.id === task.id ? { ...x, status: 'Completed', progress: 100 } : x));
                          setFilteredData(d => d.map(x => x.id === task.id ? { ...x, status: 'Completed', progress: 100 } : x));
                          showToast(`Task ${task.id} marked as complete`);
                        }
                      },
                      { label: 'Duplicate Task', icon: <Copy size={16} />, onClick: () => {
                          const newTask = { ...task, id: `TSK-${Math.floor(Math.random()*10000)}`, status: 'Open', progress: 0 } as TaskRecord;
                          setData([newTask, ...data]);
                          setFilteredData([newTask, ...filteredData]);
                          showToast(`Task duplicated as ${newTask.id}`);
                        }
                      },
                      { label: 'Download PDF', icon: <Download size={16} />, onClick: () => showToast(`Downloading ${task.id}.pdf...`) },
                      { label: 'Delete Task', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(task.id) }
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
                  <CheckSquare size={40} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{viewModal.taskName}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16}/> {viewModal.id} • {viewModal.category}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Task Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Assigned To</span> <span style={{ fontWeight: 500 }}>{viewModal.assignedTo}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Priority</span> <span style={{ fontWeight: 600, color: getPriorityColor(viewModal.priority) }}>{viewModal.priority}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Due Date</span> <span style={{ fontWeight: 500 }}>{viewModal.dueDate}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Description</h3>
                <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-secondary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <p>{viewModal.description}</p>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Activity Timeline</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ marginBottom: '8px' }}><strong>{new Date().toISOString().split('T')[0]}</strong> - Task Created by System</div>
                  <div style={{ marginBottom: '8px' }}><strong>+2 hours</strong> - Assigned to {viewModal.assignedTo}</div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessagesSquare size={18}/> Comments</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" placeholder="Add a comment..." style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  <button onClick={() => showToast('Comment added')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Post</button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Task</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={24} color="var(--primary-color)" /> {editModal.id ? 'Edit Task' : 'Create Task'}</h2>
            
            <form onSubmit={handleSaveTask}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Task Name</label>
                  <input type="text" required value={editModal.taskName || ''} onChange={e => setEditModal({...editModal, taskName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                    <select required value={editModal.category || ''} onChange={e => setEditModal({...editModal, category: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
                    <select required value={editModal.priority || ''} onChange={e => setEditModal({...editModal, priority: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                      <option value="">Select...</option>
                      {priorities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Assignee</label>
                    <select required value={editModal.assignedTo || ''} onChange={e => setEditModal({...editModal, assignedTo: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                      <option value="">Select...</option>
                      {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Due Date</label>
                    <input required type="date" value={editModal.dueDate || ''} onChange={e => setEditModal({...editModal, dueDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                    <select value={editModal.status || 'Open'} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                  <textarea rows={4} value={editModal.description || ''} onChange={e => setEditModal({...editModal, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Task?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete task <strong>{deleteModal}</strong>? This action cannot be undone.</p>
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
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/tasks/page.tsx", "w") as f:
    f.write(content)
print("Updated Tasks Action Menus")
