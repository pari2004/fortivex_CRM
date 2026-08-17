'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, AlertCircle, AlertTriangle, Calendar as CalendarIcon, 
  Search, Filter, PlayCircle, Eye, CalendarClock
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Pending', value: '45', icon: Clock, color: '#f59e0b' },
  { title: 'High Priority', value: '12', icon: AlertCircle, color: '#ef4444' },
  { title: 'Overdue Tasks', value: '5', icon: AlertTriangle, color: '#dc2626' },
  { title: 'Due This Week', value: '18', icon: CalendarIcon, color: '#3b82f6' },
];

const INITIAL_PENDING_TASKS = [
  { id: 'TSK-201', name: 'Review Admissions for FSD-B1', assignee: 'Rajesh Kumar', priority: 'High', due: 'Today', remaining: '0 days', status: 'Pending' },
  { id: 'TSK-202', name: 'Update Placement Portal', assignee: 'Neha Singh', priority: 'Medium', due: '12 Aug 2026', remaining: '4 days', status: 'Pending' },
  { id: 'TSK-203', name: 'Call Dropout Students', assignee: 'Pooja Verma', priority: 'High', due: '05 Aug 2026', remaining: 'Overdue by 3 days', status: 'Overdue' },
  { id: 'TSK-204', name: 'Review Mentor Feedback', assignee: 'Karan Mehta', priority: 'Low', due: '20 Aug 2026', remaining: '12 days', status: 'Pending' },
  { id: 'TSK-205', name: 'Onboard New Batch', assignee: 'Suresh Iyer', priority: 'Medium', due: '25 Aug 2026', remaining: '17 days', status: 'Pending' },
  { id: 'TSK-206', name: 'Audit Payment Logs', assignee: 'Anita Desai', priority: 'High', due: '06 Aug 2026', remaining: 'Overdue by 2 days', status: 'Overdue' },
  { id: 'TSK-207', name: 'Schedule React Workshop', assignee: 'Vikram Singh', priority: 'Medium', due: '10 Aug 2026', remaining: '2 days', status: 'Pending' },
];

export default function PendingTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_PENDING_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
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
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pending Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Identify bottlenecks, review priority distributions, and manage unresolved tasks.</p>
        </div>
        <button
          onClick={() => {
            const title = prompt('Enter new task title:');
            if (title) {
              const assignee = prompt('Enter assignee name:', 'Rahul Sharma');
              const newTask = {
                id: `TSK-${Math.floor(200 + Math.random() * 800)}`,
                name: title,
                assignee: assignee || 'Unassigned',
                priority: 'High',
                due: 'Today',
                remaining: '0 days',
                status: 'Pending'
              };
              setTasks(prev => [newTask, ...prev]);
              alert(`Added new task "${title}"`);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Clock size={18} /> + Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Dashboard Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
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
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Priority Distribution */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="#8b5cf6" /> Priority Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '26%' }} style={{ height: '100%', background: '#ef4444' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, width: '90px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>High</span> <span>12</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '53%' }} style={{ height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, width: '90px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Medium</span> <span>24</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} style={{ height: '100%', background: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, width: '90px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Low</span> <span>9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '350px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by task name or assignee..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)',
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
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Task Name & ID</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Assignee</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Deadline</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Remaining Days</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, i) => {
                const priorityStyle = getPriorityStyle(task.priority);
                const isOverdue = task.status === 'Overdue';
                
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{task.id}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {task.assignee.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{task.assignee}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: priorityStyle.bg, color: priorityStyle.color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {task.priority === 'High' && <AlertCircle size={12} />}
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {task.due}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        color: isOverdue ? '#ef4444' : (task.remaining === '0 days' ? '#f59e0b' : '#10b981'),
                        fontWeight: 600, fontSize: '0.9rem' 
                      }}>
                        <CalendarClock size={16} /> {task.remaining}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                          title="View Details"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                          title="Start Progress"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <PlayCircle size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredTasks.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No pending tasks found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
