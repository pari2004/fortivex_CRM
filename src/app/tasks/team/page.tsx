'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, CheckCircle, AlertTriangle, 
  Search, Filter, Eye, BarChart2, MessageCircle
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Team Tasks', value: '156', icon: Users, color: '#3b82f6' },
  { title: 'Completion Rate', value: '84%', icon: Activity, color: '#8b5cf6' },
  { title: 'Completed This Week', value: '38', icon: CheckCircle, color: '#10b981' },
  { title: 'Team Overdue', value: '6', icon: AlertTriangle, color: '#ef4444' },
];

const INITIAL_TEAM_TASKS = [
  { id: 'TTSK-401', name: 'Finalize Marketing Assets', member: 'Pooja Verma', role: 'Marketing Lead', priority: 'High', progress: 85, status: 'In Progress' },
  { id: 'TTSK-402', name: 'Develop API Endpoints', member: 'Karan Mehta', role: 'Backend Engineer', priority: 'Critical', progress: 100, status: 'Completed' },
  { id: 'TTSK-403', name: 'Draft Counselor Scripts', member: 'Rajesh Kumar', role: 'Sales Manager', priority: 'Medium', progress: 40, status: 'In Progress' },
  { id: 'TTSK-404', name: 'Design Admission Portal UI', member: 'Neha Singh', role: 'UI/UX Designer', priority: 'High', progress: 0, status: 'Pending' },
  { id: 'TTSK-405', name: 'Run Payroll for August', member: 'Anita Desai', role: 'Finance Head', priority: 'Medium', progress: 100, status: 'Completed' },
  { id: 'TTSK-406', name: 'Update Placement Database', member: 'Suresh Iyer', role: 'Placement Officer', priority: 'High', progress: 20, status: 'In Progress' },
  { id: 'TTSK-407', name: 'Organize React Workshop', member: 'Vikram Singh', role: 'Course Director', priority: 'Low', progress: 0, status: 'Pending' },
];

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TEAM_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.role.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Team Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor team performance, track member workloads, and ensure project alignment.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              const title = prompt('Enter team task title:');
              if (title) {
                const assignee = prompt('Enter team member name:', 'Rahul Sharma');
                const newTask = {
                  id: `TTSK-${Math.floor(100 + Math.random() * 900)}`,
                  name: title,
                  member: assignee || 'Rahul Sharma',
                  role: 'Team Member',
                  priority: 'High',
                  progress: 0,
                  status: 'In Progress'
                };
                setTasks(prev => [newTask, ...prev]);
                alert(`Added team task "${title}"`);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
              borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Users size={18} /> + Add Team Task
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
                placeholder="Search by task, member, or role..." 
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
                <th style={{ padding: '16px', fontWeight: 600 }}>Team Member</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '16px', fontWeight: 600, width: '200px' }}>Task Progress</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, i) => {
                const statusStyle = getStatusStyle(task.status);
                
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px' }}>{task.id}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {task.member.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{task.member}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{task.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 600, color: task.priority === 'Critical' ? '#dc2626' : (task.priority === 'High' ? '#ef4444' : 'var(--text-secondary)') }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--glass-border)', borderRadius: '99px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 1 }}
                            style={{ 
                              height: '100%', 
                              background: task.progress === 100 ? '#10b981' : (task.progress > 0 ? '#8b5cf6' : 'transparent'),
                              borderRadius: '99px'
                            }} 
                          />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', width: '35px' }}>
                          {task.progress}%
                        </span>
                      </div>
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
                          title="Message Member"
                          style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <MessageCircle size={16} />
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
              No team tasks found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
