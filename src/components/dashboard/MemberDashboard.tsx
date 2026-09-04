'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CheckSquare, CheckCircle, Clock, Calendar, 
  Megaphone, UserCheck, FileText, User
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export function MemberDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const kpis = [
    { title: 'Assigned Tasks', value: '12', icon: CheckSquare, color: '#3b82f6', href: '/tasks?tab=assigned' },
    { title: 'Completed Tasks', value: '8', icon: CheckCircle, color: '#10b981', href: '/tasks?tab=completed' },
    { title: 'Pending Tasks', value: '4', icon: Clock, color: '#f59e0b', href: '/tasks?tab=pending' },
    { title: 'Upcoming Meetings', value: '3', icon: Calendar, color: '#8b5cf6', href: '/schedule' },
    { title: 'Announcements', value: '5', icon: Megaphone, color: '#ec4899', href: '/announcements' },
    { title: 'Attendance', value: '98%', icon: UserCheck, color: '#10b981', href: '/attendance' },
    { title: 'My Documents', value: '15', icon: FileText, color: '#3b82f6', href: '/documents' },
    { title: 'My Profile', value: '100%', icon: User, color: '#10b981', href: '/profile' },
  ];

  const weeklyData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 6 },
  ];

  const monthlyPerf = [
    { name: 'Week 1', score: 85 },
    { name: 'Week 2', score: 88 },
    { name: 'Week 3', score: 92 },
    { name: 'Week 4', score: 95 },
  ];

  const taskStatusData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Overdue', value: 5, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Member'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {kpis.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(stat.href)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Weekly Task Completion</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Monthly Performance Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPerf}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={taskStatusData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {taskStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Attendance & Productivity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Week 1', prod: 80, att: 100 },
              { name: 'Week 2', prod: 85, att: 100 },
              { name: 'Week 3', prod: 90, att: 95 },
              { name: 'Week 4', prod: 95, att: 100 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="prod" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Productivity %" />
              <Area type="monotone" dataKey="att" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} name="Attendance %" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
