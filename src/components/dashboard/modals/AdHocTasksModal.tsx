'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, CheckSquare, Clock, MessageCircle, Send, Plus, CheckCircle, Calendar, User, Building, Flag, Hourglass, ChevronLeft, ChevronRight, ChevronDown, Filter, ArrowDownUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';
import { ActionMenu } from '@/components/common/ActionMenu';

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '999999';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
}

const TABS = ['All', 'Ad-hoc Tasks', 'Lead Tasks', 'Today', 'Overdue', 'Upcoming', 'Completed'];

export function AdHocTasksModal({ onClose }: { onClose: () => void }) {
  const { tasks, addTask, updateTask, deleteTask, leads, users } = useCRM();
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Creation form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignTo, setNewTaskAssignTo] = useState('');
  const [newTaskLeadId, setNewTaskLeadId] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskType, setNewTaskType] = useState('Ad-hoc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useGlobalEscape(true, () => {
    if (isCreating) {
      setIsCreating(false);
    } else {
      onClose();
    }
  });

  const handleWrapperClick = () => {
    if (isCreating) {
      setIsCreating(false);
    } else {
      onClose();
    }
  };

  // Metrics calculation
  const totalTasks = tasks.length;
  const todayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      dueDate: newTaskDueDate || new Date().toISOString(),
      priority: newTaskPriority,
      status: 'Pending',
      owner: newTaskAssignTo || 'Current User',
      assignedBy: 'Current User',
      description: newTaskTitle,
      program: 'General',
      taskType: newTaskType,
      leadId: newTaskLeadId || undefined,
    });
    
    showToast('Task successfully created!');
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskAssignTo('');
    setNewTaskLeadId('');
    setIsCreating(false);
  };

  const markComplete = (task: any) => {
    updateTask(task.id, { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' });
    if (task.status !== 'Completed') showToast('Task marked as completed!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      showToast('Task deleted');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      const tDate = new Date(t.dueDate).toDateString();
      const today = new Date().toDateString();
      const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'Completed';

      if (activeTab === 'Ad-hoc Tasks') return t.taskType === 'Ad-hoc' || !t.leadId;
      if (activeTab === 'Lead Tasks') return t.leadId;
      if (activeTab === 'Today') return tDate === today;
      if (activeTab === 'Overdue') return isOverdue;
      if (activeTab === 'Upcoming') return new Date(t.dueDate) >= new Date() && t.status !== 'Completed';
      if (activeTab === 'Completed') return t.status === 'Completed';
      return true;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, activeTab, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage) || 1;
  const currentTasks = filteredTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'urgent': return '#dc2626';
      case 'low': return '#6b7280';
      case 'medium': default: return '#f59e0b';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: '#dcfce7', color: '#16a34a' };
      case 'overdue': return { bg: '#fee2e2', color: '#ef4444' };
      case 'in progress': return { bg: '#dbeafe', color: '#2563eb' };
      case 'pending': default: return { bg: '#fef3c7', color: '#d97706' };
    }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }} onClick={handleWrapperClick}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}
        style={{ background: 'var(--bg-primary)', width: '1100px', maxWidth: '95vw', height: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--glass-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Ad-Hoc Tasks</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage follow-ups and tasks across your leads</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
            <X size={20} />
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ padding: '24px 32px', display: 'flex', gap: '16px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--glass-border)' }}>
          {[
            { label: 'Total Tasks', count: totalTasks, sub: 'View all tasks', icon: <CheckSquare size={20} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
            { label: 'Today', count: todayTasks, sub: 'Tasks for today', icon: <Calendar size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            { label: 'Pending', count: pendingTasks, sub: 'Pending tasks', icon: <Hourglass size={20} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            { label: 'Completed', count: completedTasks, sub: 'Completed tasks', icon: <CheckCircle size={20} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
          ].map((card, i) => (
            <div key={i} style={{ flex: 1, padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', gap: '16px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{card.count}</div>
                <div style={{ fontSize: '0.75rem', color: card.color, fontWeight: 500 }}>{card.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 32px', display: 'flex', gap: '24px', overflowX: 'auto', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          {TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              style={{ 
                padding: '16px 0', 
                border: 'none', 
                background: 'none', 
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent', 
                color: activeTab === tab ? '#3b82f6' : 'var(--text-secondary)', 
                fontWeight: activeTab === tab ? 600 : 500, 
                cursor: 'pointer', 
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab}
              {/* Badges for specific tabs */}
              {tab === 'Today' && todayTasks > 0 && <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{todayTasks}</span>}
              {tab === 'Overdue' && <span style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>2</span>}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
          <div style={{ padding: '24px 32px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Create Task Section */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '8px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '8px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <MessageCircle size={18} color="var(--text-tertiary)" />
                  <input 
                    type="text" 
                    placeholder="E.g. Remind me to call Sarah tomorrow at 5 PM..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onFocus={() => setIsCreating(true)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', padding: '12px 0' }}
                  />
                </div>
                {!isCreating && (
                  <button onClick={() => setIsCreating(true)} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', borderRadius: '8px', fontWeight: 600 }}>
                    <Plus size={18}/> Create Task
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {isCreating && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <form onSubmit={handleCreateTask} style={{ padding: '16px 8px 8px 8px', borderTop: '1px solid var(--glass-border)', marginTop: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Assign To</label>
                          <select value={newTaskAssignTo} onChange={e => setNewTaskAssignTo(e.target.value)} className="crm-input" style={{ width: '100%', padding: '10px' }}>
                            <option value="">Select User</option>
                            {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Related Lead</label>
                          <select value={newTaskLeadId} onChange={e => setNewTaskLeadId(e.target.value)} className="crm-input" style={{ width: '100%', padding: '10px' }}>
                            <option value="">None</option>
                            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Due Date</label>
                          <input type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} className="crm-input" style={{ width: '100%', padding: '10px' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Priority</label>
                          <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} className="crm-input" style={{ width: '100%', padding: '10px' }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" onClick={() => setIsCreating(false)} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>Cancel</button>
                        <button type="submit" disabled={!newTaskTitle.trim()} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, opacity: !newTaskTitle.trim() ? 0.5 : 1 }}>
                          <Send size={16}/> Save Task
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter/Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '300px' }}>
                <Search size={16} color="var(--text-tertiary)" />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-card)', fontSize: '0.9rem' }}>
                  <Filter size={16} /> Filter <ChevronDown size={14} />
                </button>
                <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-card)', fontSize: '0.9rem' }}>
                  <ArrowDownUp size={16} /> Sort: Due Date <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                {activeTab.toUpperCase()} ({filteredTasks.length})
              </div>
              
              {currentTasks.map((task, idx) => {
                const statusStyle = getStatusStyle(task.status);
                const leadName = task.leadId ? leads.find(l => l.id === task.leadId)?.name : null;
                
                return (
                  <div key={task.id || idx} style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                    {/* Checkbox */}
                    <button 
                      onClick={() => markComplete(task)}
                      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: task.status === 'Completed' ? '#10b981' : 'var(--text-tertiary)', flexShrink: 0, marginTop: '2px' }}
                    >
                      {task.status === 'Completed' ? <CheckCircle size={22} /> : <div style={{ width: '20px', height: '20px', border: '2px solid var(--border-color)', borderRadius: '6px' }} />}
                    </button>
                    
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '1.05rem', margin: 0, color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                          {task.title}
                        </h4>
                        
                        {/* Status & Priority & Menu */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {/* Status Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: statusStyle.bg, color: statusStyle.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.color }} />
                            {task.status}
                          </div>
                          
                          {/* Priority Flag */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: getPriorityColor(task.priority), width: '80px' }}>
                            <Flag size={14} fill={getPriorityColor(task.priority)} /> {task.priority}
                          </div>

                          {/* Action Menu */}
                          <ActionMenu 
                            items={[
                              { label: 'View Details' },
                              { label: 'Edit Task' },
                              { divider: true, label: '' },
                              { label: task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed', onClick: () => markComplete(task) },
                              { divider: true, label: '' },
                              { label: 'Delete', color: '#ef4444', onClick: () => handleDelete(task.id) }
                            ]}
                          />
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} /> {task.assignTo || task.owner || 'Unassigned'}
                        </div>
                        {leadName && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6' }}>
                            <Building size={14} /> {leadName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {currentTasks.length === 0 && (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--text-tertiary)' }}>
                    <CheckSquare size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0' }}>No tasks found</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Create your first task to start managing follow-ups.</p>
                  <button onClick={() => setIsCreating(true)} className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Create Task
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredTasks.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 0', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{ 
                        padding: '8px 16px', 
                        background: currentPage === i + 1 ? '#3b82f6' : 'var(--bg-card)', 
                        color: currentPage === i + 1 ? '#fff' : 'var(--text-primary)',
                        border: '1px solid',
                        borderColor: currentPage === i + 1 ? '#3b82f6' : 'var(--glass-border)', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: currentPage === i + 1 ? 600 : 500
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Rows per page:
                  <select 
                    value={rowsPerPage} 
                    onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
