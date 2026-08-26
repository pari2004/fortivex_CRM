'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, CheckSquare, Clock, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { useCRM } from '@/contexts/CRMContext';

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
  const { tasks, addTask, leads } = useCRM();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMessage, setViewMessage] = useState<any | null>(null);
  const [nlpInput, setNlpInput] = useState('');
  
  useGlobalEscape(!!viewMessage, () => setViewMessage(null));
  
  const handleWrapperClick = () => {
    if (viewMessage) {
      setViewMessage(null);
    } else {
      onClose();
    }
  };

  const handleAction = (task: any) => {
    setViewMessage(task);
  };

  const parseNLPTask = (text: string) => {
    // Simple mock NLP processing
    const lower = text.toLowerCase();
    
    // Default task details
    const taskDetails: any = {
      title: text,
      dueDate: new Date().toISOString(),
      priority: 'Medium',
      status: 'Pending',
      owner: 'Current User',
      assignedBy: 'System',
      description: text,
      program: 'General'
    };

    // Find if a lead name is mentioned
    const matchedLead = leads.find(l => lower.includes(l.name.toLowerCase().split(' ')[0]));
    if (matchedLead) {
        taskDetails.leadId = matchedLead.id;
        taskDetails.title = `Task for ${matchedLead.name}: ${text}`;
    }

    // Time hints
    if (lower.includes('tomorrow')) {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        taskDetails.dueDate = t.toISOString();
    } else if (lower.includes('next week') || lower.includes('monday')) {
        const t = new Date();
        t.setDate(t.getDate() + 7);
        taskDetails.dueDate = t.toISOString();
    }

    return taskDetails;
  };

  const handleCreateTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!nlpInput.trim()) return;
      
      const parsedTask = parseNLPTask(nlpInput);
      addTask(parsedTask);
      showToast('Task successfully created from text!');
      setNlpInput('');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeTab === 'Today') return new Date(t.dueDate).toDateString() === new Date().toDateString();
      if (activeTab === 'Overdue') return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
      if (activeTab === 'Completed') return t.status === 'Completed';
      return true;
    });
  }, [tasks, activeTab, searchQuery]);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={handleWrapperClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'var(--bg-primary)', width: '800px', maxWidth: '95vw', height: '80vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--glass-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={22} color="var(--primary-color)"/> Ad-Hoc Tasks
          </h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 24px', display: 'flex', gap: '16px', overflowX: 'auto', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          {TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ padding: '16px 0', border: 'none', background: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: activeTab === tab ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <MessageCircle size={18} color="var(--text-tertiary)" />
                    <input 
                    type="text" 
                    placeholder="E.g. Remind me to call Sarah tomorrow at 5 PM..." 
                    value={nlpInput}
                    onChange={(e) => setNlpInput(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: 'var(--text-primary)' }}
                    />
                </div>
                <button type="submit" className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}>
                    <Send size={16}/> Create Task
                </button>
            </form>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.map(task => (
              <div key={task.id} style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{task.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14}/> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span>Status: {task.status}</span>
                  </div>
                </div>
                <button onClick={() => handleAction(task)} className="secondary-btn" style={{ padding: '8px 16px', borderRadius: '8px' }}>Action</button>
              </div>
            ))}
            {filteredTasks.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No tasks found in this view. Try creating one!</div>
            )}
          </div>
        </div>

        {viewMessage && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setViewMessage(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'var(--bg-card)', width: '400px', borderRadius: '16px', padding: '24px', border: '1px solid var(--glass-border)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Task Action</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Complete action for <strong>{viewMessage.title}</strong>?</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setViewMessage(null)} className="secondary-btn" style={{ padding: '8px 16px', borderRadius: '8px' }}>Cancel</button>
                <button onClick={() => { showToast('Task marked as complete'); setViewMessage(null); }} className="primary-btn" style={{ padding: '8px 16px', borderRadius: '8px' }}>Complete</button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
