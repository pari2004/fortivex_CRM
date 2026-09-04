'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Clock, CheckCircle, 
  Search, Filter, Eye, Bell, Send
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Assigned', value: '128', icon: Users, color: '#3b82f6' },
  { title: 'In Progress', value: '45', icon: Clock, color: '#8b5cf6' },
  { title: 'Pending Review', value: '12', icon: UserCheck, color: '#f59e0b' },
  { title: 'Completed', value: '71', icon: CheckCircle, color: '#10b981' },
];

const INITIAL_ASSIGNED_TASKS = [
  { id: 'ATSK-101', name: 'Follow up with FSD Batch', assignee: 'Rajesh Kumar', assignedBy: 'Manager - Admin', deadline: 'Today, 5:00 PM', status: 'In Progress' },
  { id: 'ATSK-102', name: 'Update Placement Portal', assignee: 'Neha Singh', assignedBy: 'System Auto', deadline: '12 Aug 2026', status: 'Pending' },
  { id: 'ATSK-103', name: 'Call Dropout Students', assignee: 'Pooja Verma', assignedBy: 'Counselor Lead', deadline: '14 Aug 2026', status: 'In Progress' },
  { id: 'ATSK-104', name: 'Review Mentor Feedback', assignee: 'Karan Mehta', assignedBy: 'Manager - Admin', deadline: 'Yesterday', status: 'Completed' },
  { id: 'ATSK-105', name: 'Onboard New Batch', assignee: 'Suresh Iyer', assignedBy: 'Admin', deadline: '25 Aug 2026', status: 'Pending' },
  { id: 'ATSK-106', name: 'Audit Payment Logs', assignee: 'Anita Desai', assignedBy: 'Finance Dept', deadline: '16 Aug 2026', status: 'In Progress' },
  { id: 'ATSK-107', name: 'Schedule React Workshop', assignee: 'Vikram Singh', assignedBy: 'Course Director', deadline: '10 Aug 2026', status: 'Completed' },
];

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_ASSIGNED_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Completed') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (status === 'In Progress') return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
    return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }; // Pending
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Assigned Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage tasks delegated to employees across departments.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => {
              const title = prompt('Enter task title to delegate:');
              if (title) {
                const assignee = prompt('Enter assignee employee name:', 'Rajesh Kumar');
                const newTask = {
                  id: `ATSK-${Math.floor(100 + Math.random() * 900)}`,
                  name: title,
                  assignee: assignee || 'Rajesh Kumar',
                  assignedBy: 'Manager - Admin',
                  deadline: 'Today',
                  status: 'Pending'
                };
                setTasks(prev => [newTask, ...prev]);
                alert(`Task "${title}" delegated to ${newTask.assignee}!`);
              }
            }}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Send size={16} /> Delegate Task
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
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

      {/* Data Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '350px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search by task, assignee, or assigner..." 
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
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
                <th style={{ padding: '16px', fontWeight: 600 }}>Assigned To (Employee)</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Assigned By</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Deadline</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, i) => {
                const statusStyle = getStatusStyle(task.status);
                const isOverdue = task.deadline.toLowerCase().includes('yesterday') || task.deadline.includes('ago');
                
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{task.id}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {task.assignee.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{task.assignee}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {task.assignedBy}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: isOverdue && task.status !== 'Completed' ? '#ef4444' : 'var(--text-secondary)' }}>
                      {task.deadline}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                          title="Remind Assignee"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Bell size={16} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05, background: 'rgba(16, 185, 129, 0.1)' }}
                          title="View Details"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
              No assigned tasks found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
