'use client';

import React, { useState } from 'react';
import { Calendar, Clock, User, AlertCircle, Save, Plus, CheckCircle2, ChevronDown, List, X } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface FollowUpsPageProps {
  hideHeader?: boolean;
}

export default function FollowUpsPage({ hideHeader = false }: FollowUpsPageProps) {
  const { tasks, addTask, updateTask, users, leads } = useCRM();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Follow-up form state
  const [newFollowUp, setNewFollowUp] = useState({
    title: '',
    type: 'Call',
    relatedTo: '',
    date: '',
    time: '',
    assignee: '',
    priority: 'Medium',
    reminder: 'At follow-up time',
    notes: ''
  });

  const handleCreateFollowUp = () => {
    if (!newFollowUp.title || !newFollowUp.date || !newFollowUp.time) return;

    addTask({
      title: `${newFollowUp.type}: ${newFollowUp.title}`,
      assignTo: newFollowUp.assignee || 'Me',
      priority: newFollowUp.priority,
      dueDate: `${newFollowUp.date}T${newFollowUp.time}`,
      status: 'Pending',
      description: newFollowUp.notes,
      relatedTo: newFollowUp.relatedTo
    });

    setShowCreateModal(false);
    setNewFollowUp({
      title: '',
      type: 'Call',
      relatedTo: '',
      date: '',
      time: '',
      assignee: '',
      priority: 'Medium',
      reminder: 'At follow-up time',
      notes: ''
    });
  };

  const handleCompleteTask = (taskId: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      updateTask(taskId, { ...taskToUpdate, status: 'Completed' });
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');

  // Demo data for preview
  const demoTasks = [
    { id: 'd1', title: 'Follow-up Call', relatedTo: 'Priya Singh', assignTo: 'Sales Team', dueDate: '2026-09-12T10:00', priority: 'High', status: 'Pending', description: 'Call customer regarding proposal' },
    { id: 'd2', title: 'WhatsApp Follow-up', relatedTo: 'Rahul Sharma', assignTo: 'Sales Team', dueDate: '2026-09-13T14:30', priority: 'Medium', status: 'Pending', description: 'Send product brochure' }
  ];

  const allTasks = [...pendingTasks, ...demoTasks].slice(0, 5);

  return (
    <div style={{ padding: hideHeader ? '0' : '24px', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {!hideHeader && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Follow-ups & Reminders</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Configure follow-up behaviors and manage reminders.</p>
        </div>
      )}

      {/* 1. Follow-up Setup Configuration */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon /> Follow-up Configuration
        </h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#64748b' }}>Configure default behavior for follow-ups created in Leads and Opportunities.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Default Follow-up Type</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
              <option>Call</option>
              <option>Email</option>
              <option>Meeting</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Default Reminder Time</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
              <option>At follow-up time</option>
              <option>15 minutes before</option>
              <option>1 hour before</option>
              <option>1 day before</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2 & 3. Create Follow-up Button & Preview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Active Follow-ups</h3>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Create Follow-up
        </button>
      </div>

      {/* Preview Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Title / Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Related To</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Assigned To</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Due Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((task, idx) => (
              <tr key={task.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>{task.title}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#64748b' }}>{task.relatedTo || 'N/A'}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#64748b' }}>{task.assignTo}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#64748b' }}>
                  {new Date(task.dueDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500,
                    background: task.status === 'Completed' ? '#dcfce7' : task.status === 'Overdue' ? '#fee2e2' : '#fef9c3',
                    color: task.status === 'Completed' ? '#166534' : task.status === 'Overdue' ? '#991b1b' : '#854d0e'
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {task.status !== 'Completed' && (
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle2 size={14} /> Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {allTasks.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No active follow-ups found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Create Follow-up</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Title / Subject</label>
                <input 
                  type="text" 
                  value={newFollowUp.title}
                  onChange={e => setNewFollowUp({...newFollowUp, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  placeholder="e.g. Discuss proposal pricing"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Type</label>
                  <select 
                    value={newFollowUp.type}
                    onChange={e => setNewFollowUp({...newFollowUp, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    <option>Call</option>
                    <option>Email</option>
                    <option>Meeting</option>
                    <option>WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Related Lead/Deal</label>
                  <input 
                    type="text" 
                    value={newFollowUp.relatedTo}
                    onChange={e => setNewFollowUp({...newFollowUp, relatedTo: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    placeholder="Search Lead or Deal..."
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="date" 
                    value={newFollowUp.date}
                    onChange={e => setNewFollowUp({...newFollowUp, date: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Time</label>
                  <input 
                    type="time" 
                    value={newFollowUp.time}
                    onChange={e => setNewFollowUp({...newFollowUp, time: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Reminder</label>
                <select 
                  value={newFollowUp.reminder}
                  onChange={e => setNewFollowUp({...newFollowUp, reminder: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option>At follow-up time</option>
                  <option>5 minutes before</option>
                  <option>15 minutes before</option>
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                  <option>1 day before</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Remarks / Notes</label>
                <textarea 
                  value={newFollowUp.notes}
                  onChange={e => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                  placeholder="Add any context or notes for the follow-up..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'white', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFollowUp}
                disabled={!newFollowUp.title || !newFollowUp.date || !newFollowUp.time}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 500, cursor: (!newFollowUp.title || !newFollowUp.date || !newFollowUp.time) ? 'not-allowed' : 'pointer', opacity: (!newFollowUp.title || !newFollowUp.date || !newFollowUp.time) ? 0.6 : 1 }}
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
