'use client';

import { useRouter } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';
import { motion } from 'framer-motion';
import { Users, Phone, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import { leadsData, tasksData, calendarEvents } from '@/lib/data/mockData';

export function CounselorDashboard() {
  const { leads, applications, students } = useCRM();
  const router = useRouter();
  const counselorLeads = leadsData.filter(l => l.counselor === 'Sarah Jenkins'); // Dummy logic
  const myTasks = tasksData.slice(0, 3);
  const myEvents = calendarEvents.slice(0, 3);

  const today = new Date().toISOString().split('T')[0];
  const followUpsToday = leads.filter(l => l.nextFollowUp === today && l.followUpStatus !== 'Completed').length;

  const stats = [
    { title: 'My Active Leads', value: counselorLeads.length, icon: Users, color: '#2563EB', href: '/leads' },
    { title: 'Follow-ups Today', value: followUpsToday, icon: Phone, color: '#f59e0b', href: '/leads?tab=Follow-ups' },
    { title: 'Demo Sessions', value: 3, icon: CalendarIcon, color: '#10b981', href: 'https://calendar.google.com/', external: true },
    { title: 'Pending Tasks', value: 5, icon: CheckSquare, color: '#8b5cf6', href: '/tasks' },
  ];

  return (
    <>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome back, Sarah 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here is your schedule and assigned leads for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (stat.external) {
                window.open(stat.href, '_blank', 'noopener,noreferrer');
              } else {
                router.push(stat.href);
              }
            }}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>My Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}</div>
                </div>
                <div style={{ color: task.priority === 'High' ? '#ef4444' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{task.priority}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Today's Calendar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myEvents.map(event => (
              <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{event.type}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
