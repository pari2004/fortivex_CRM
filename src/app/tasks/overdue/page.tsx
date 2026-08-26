'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Flame, ShieldAlert, Clock, 
  Search, Filter, Send, Eye, MessageSquareWarning
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Overdue', value: '18', icon: AlertTriangle, color: '#ef4444' },
  { title: 'Critical Alerts', value: '7', icon: Flame, color: '#dc2626' },
  { title: 'Escalated', value: '4', icon: ShieldAlert, color: '#f97316' },
  { title: 'Avg Days Overdue', value: '4.5', icon: Clock, color: '#f59e0b' },
];

const INITIAL_OVERDUE_TASKS = [
  { id: 'TSK-301', name: 'Follow up with FSD Batch Dropout', assignee: 'Rajesh Kumar', priority: 'High', dueDate: '02 Aug 2026', daysOverdue: 6, escalation: 'Level 2' },
  { id: 'TSK-302', name: 'Submit Monthly Financial Report', assignee: 'Anita Desai', priority: 'Critical', dueDate: '01 Aug 2026', daysOverdue: 7, escalation: 'Level 3' },
  { id: 'TSK-303', name: 'Call Pending Admissions Leads', assignee: 'Pooja Verma', priority: 'Medium', dueDate: '05 Aug 2026', daysOverdue: 3, escalation: 'None' },
  { id: 'TSK-304', name: 'Review Mentor Feedback', assignee: 'Karan Mehta', priority: 'Low', dueDate: '06 Aug 2026', daysOverdue: 2, escalation: 'None' },
  { id: 'TSK-305', name: 'Onboard New UI/UX Batch', assignee: 'Suresh Iyer', priority: 'High', dueDate: '04 Aug 2026', daysOverdue: 4, escalation: 'Level 1' },
  { id: 'TSK-306', name: 'Audit Payment Gateway Logs', assignee: 'Anita Desai', priority: 'Critical', dueDate: '30 Jul 2026', daysOverdue: 9, escalation: 'Level 3' },
  { id: 'TSK-307', name: 'Finalize React Workshop Schedule', assignee: 'Vikram Singh', priority: 'Medium', dueDate: '07 Aug 2026', daysOverdue: 1, escalation: 'None' },
];

export default function OverdueTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_OVERDUE_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [escalationFilter, setEscalationFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEscalation = escalationFilter === 'All' || task.escalation === escalationFilter;
    return matchesSearch && matchesEscalation;
  });

  const getPriorityStyle = (priority: string) => {
    if (priority === 'Critical') return { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', icon: <Flame size={12} /> };
    if (priority === 'High') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <AlertTriangle size={12} /> };
    if (priority === 'Medium') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }; // Low
  };

  const getEscalationStyle = (level: string) => {
    if (level === 'Level 3') return { color: '#dc2626', fontWeight: 'bold' }; // Red
    if (level === 'Level 2') return { color: '#ea580c', fontWeight: 'bold' }; // Orange
    if (level === 'Level 1') return { color: '#f59e0b', fontWeight: 'bold' }; // Amber
    return { color: 'var(--text-secondary)', fontWeight: 'normal' }; // None
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>Overdue Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Identify delayed tasks, assign escalation levels, and request immediate extensions.</p>
        </div>
        <button
          onClick={() => {
            const title = prompt('Enter task title:');
            if (title) {
              const assignee = prompt('Enter assignee name:', 'Rahul Sharma');
              const newTask = {
                id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
                name: title,
                assignee: assignee || 'Rahul Sharma',
                priority: 'High',
                dueDate: 'Yesterday',
                daysOverdue: 1,
                escalation: 'Level 1'
              };
              setTasks(prev => [newTask, ...prev]);
              alert(`Added overdue task "${title}"`);
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
          }}
        >
          <AlertTriangle size={18} /> + Add Overdue Task
        </button>
      </div>

      {/* Alert Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(239,68,68,0.15)' }}
            className="glass-panel" 
            style={{ 
              padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', 
              borderLeft: `4px solid ${stat.color}` 
            }}
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

      {/* Data Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '350px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search overdue tasks or assignees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(255,255,255,0.5)',
                  outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select 
                value={escalationFilter}
                onChange={(e) => setEscalationFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Escalation Levels</option>
                <option value="Level 3">Level 3 (Critical)</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 1">Level 1</option>
                <option value="None">None</option>
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
                <th style={{ padding: '16px', fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Days Overdue</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Escalation</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, i) => {
                const priorityStyle = getPriorityStyle(task.priority);
                const escStyle = getEscalationStyle(task.escalation);
                
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', background: task.escalation === 'Level 3' ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{task.id}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {task.assignee.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{task.assignee}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: priorityStyle.bg, color: priorityStyle.color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {priorityStyle.icon} {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {task.dueDate}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        color: task.daysOverdue >= 5 ? '#dc2626' : '#ef4444',
                        fontWeight: 'bold', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Clock size={16} /> {task.daysOverdue} days
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {task.escalation !== 'None' && <ShieldAlert size={14} color={escStyle.color} />}
                        <span style={{ ...escStyle, fontSize: '0.9rem' }}>{task.escalation}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.1)' }}
                          title="Escalate Manually"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <MessageSquareWarning size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                          title="View Details"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={16} />
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
              Excellent! No overdue tasks matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
