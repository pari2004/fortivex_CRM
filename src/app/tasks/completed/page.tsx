'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, Calendar as CalendarIcon, 
  Search, Filter, Eye, Award, CheckSquare, RefreshCw, UserCheck
} from 'lucide-react';

// Mock Data for Completed Tasks
const stats = [
  { title: 'Total Completed', value: '128', icon: CheckCircle, color: '#10b981' },
  { title: 'Completed This Week', value: '34', icon: CheckSquare, color: '#3b82f6' },
  { title: 'On-Time Completion', value: '94%', icon: Award, color: '#8b5cf6' },
  { title: 'Avg Turnaround', value: '1.4 Days', icon: Clock, color: '#f59e0b' },
];

const INITIAL_COMPLETED_TASKS = [
  { id: 'TSK-101', name: 'Finalize Attendance Report for July', assignee: 'Rahul Sharma', priority: 'High', completedDate: '08 Aug 2026', completionTime: '2 hours', category: 'Reports', feedback: 'Submitted on time' },
  { id: 'TSK-102', name: 'Conduct Mock Interviews for FSD-B1', assignee: 'Arjun Kumar', priority: 'High', completedDate: '07 Aug 2026', completionTime: '1 day', category: 'Placement', feedback: 'All 15 students cleared' },
  { id: 'TSK-103', name: 'Verify Student Fee Receipts', assignee: 'Pooja Verma', priority: 'Medium', completedDate: '06 Aug 2026', completionTime: '3 hours', category: 'Finance', feedback: 'Verified 45 receipts' },
  { id: 'TSK-104', name: 'Update Course Curriculum (AI module)', assignee: 'Priya Sharma', priority: 'High', completedDate: '05 Aug 2026', completionTime: '2 days', category: 'Curriculum', feedback: 'Approved by Lead Trainer' },
  { id: 'TSK-105', name: 'Issue Certificates for Web Batch #12', assignee: 'Anita Desai', priority: 'Low', completedDate: '04 Aug 2026', completionTime: '4 hours', category: 'Certificates', feedback: '24 digital certificates issued' },
  { id: 'TSK-106', name: 'Resolve Parent Queries on WhatsApp', assignee: 'Suresh Iyer', priority: 'Medium', completedDate: '03 Aug 2026', completionTime: '1 hour', category: 'Support', feedback: 'Resolved all 8 tickets' },
  { id: 'TSK-107', name: 'Publish Weekly Placement Newsletter', assignee: 'Neha Singh', priority: 'Low', completedDate: '01 Aug 2026', completionTime: '5 hours', category: 'Marketing', feedback: 'Sent to 1,200 alumni' },
];

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_COMPLETED_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const getPriorityStyle = (priority: string) => {
    if (priority === 'High') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
    if (priority === 'Medium') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }; // Low
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle color="#10b981" size={28} /> Completed Tasks
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review completed assignments, resolution velocity, and task completion logs.
          </p>
        </div>
        <button
          onClick={() => {
            const title = prompt('Enter completed task title:');
            if (title) {
              const assignee = prompt('Enter assignee name:', 'Rahul Sharma');
              const newTask = {
                id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
                name: title,
                assignee: assignee || 'Rahul Sharma',
                priority: 'High',
                completedDate: 'Today',
                completionTime: '1 hour',
                category: 'General',
                feedback: 'Log entry added'
              };
              setTasks(prev => [newTask, ...prev]);
              alert(`Added task "${title}"`);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}
        >
          <CheckCircle size={18} /> + Add Completed Task
        </button>
      </div>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completed Tasks Table */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search task, assignee or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                  outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)', outline: 'none', fontSize: '0.9rem'
                }}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)', outline: 'none', fontSize: '0.9rem'
                }}
              >
                <option value="All">All Categories</option>
                <option value="Reports">Reports</option>
                <option value="Placement">Placement</option>
                <option value="Finance">Finance</option>
                <option value="Curriculum">Curriculum</option>
                <option value="Certificates">Certificates</option>
                <option value="Support">Support</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>Task Info</th>
                <th style={{ padding: '16px' }}>Assignee</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Priority</th>
                <th style={{ padding: '16px' }}>Completion Date</th>
                <th style={{ padding: '16px' }}>Remarks / Resolution</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                    No completed tasks found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const pStyle = getPriorityStyle(task.priority);
                  return (
                    <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={16} color="#10b981" /> {task.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{task.id}</div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{task.assignee}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                          {task.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: pStyle.bg, color: pStyle.color }}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <div>{task.completedDate}</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Took {task.completionTime}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {task.feedback}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
