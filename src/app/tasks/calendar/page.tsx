'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Users, Video, 
  ChevronLeft, ChevronRight, Search, Filter, Plus, 
  AlertCircle, CheckCircle, Bell
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { CreateReminderModal } from '@/components/reminders/CreateReminderModal';

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarViewPage() {
  const { reminders } = useCRM();
  const [view, setView] = useState('Month');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const todayDate = new Date();
  const currentDayNum = todayDate.getDate();

  // Helper for generating events & reminders for calendar days
  const getDayEvents = (day: number) => {
    // Map reminders to calendar day matching August 2026
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const datePattern = `2026-08-${dayStr}`;

    const matchingReminders = reminders.filter(r => r.dueDate === datePattern || (day === 13 && r.dueDate.includes('08-13')));
    const reminderItems = matchingReminders.map(r => ({
      title: `🔔 ${r.title}`,
      color: r.priority === 'High' ? '#ef4444' : r.priority === 'Medium' ? '#f59e0b' : '#3b82f6'
    }));

    if (day === 5) return [{ title: 'Design Review', color: '#8b5cf6' }, ...reminderItems];
    if (day === 12) return [{ title: 'Team Standup', color: '#3b82f6' }, ...reminderItems];
    if (day === 18) return [{ title: 'Client Meeting', color: '#10b981' }, ...reminderItems];
    if (day === 25) return [{ title: 'Quarterly Planning', color: '#f59e0b' }, ...reminderItems];
    return reminderItems;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Calendar & Reminders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your daily agenda, upcoming follow-ups, and meetings.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Create Reminder
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', flex: 1 }}>
        
        {/* Main Calendar Area */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Calendar Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <ChevronLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '150px', textAlign: 'center' }}>August 2026</h2>
                <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '4px' }}>
                {['Month', 'Week', 'Day'].map(v => (
                  <button 
                    key={v}
                    onClick={() => setView(v)}
                    style={{ 
                      padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                      background: view === v ? 'white' : 'transparent', 
                      color: view === v ? '#3b82f6' : 'var(--text-secondary)',
                      boxShadow: view === v ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="text" placeholder="Search events & reminders..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          {view === 'Month' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {weekDays.map(day => (
                  <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)', padding: '8px' }}>
                    {day}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }} />
                ))}
                
                {calendarDays.map(day => {
                  const events = getDayEvents(day);
                  const isToday = day === 13;
                  return (
                    <div 
                      key={day} 
                      style={{ 
                        background: isToday ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.4)', 
                        border: isToday ? '1px solid #3b82f6' : '1px solid var(--glass-border)', 
                        borderRadius: '12px', padding: '8px', minHeight: '100px',
                        display: 'flex', flexDirection: 'column'
                      }}
                    >
                      <div style={{ 
                        fontWeight: 'bold', marginBottom: '8px',
                        background: isToday ? '#3b82f6' : 'transparent',
                        color: isToday ? 'white' : 'var(--text-primary)',
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                        {events.map((ev, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              background: `${ev.color}20`, color: ev.color, 
                              fontSize: '0.75rem', fontWeight: 600, padding: '4px 6px', 
                              borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                            }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view !== 'Month' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', flexDirection: 'column', gap: '16px' }}>
              <CalendarIcon size={48} opacity={0.2} />
              <p>{view} View coming soon. Please use Month view.</p>
            </div>
          )}
        </div>

        {/* Sidebar: Daily Agenda & Reminders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#3b82f6" /> Today's Reminders
            </h3>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 500 }}>
              13 Aug 2026
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reminders.filter(r => !r.isCompleted).slice(0, 4).map((rem) => (
                <div key={rem.id} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{rem.title}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>{rem.dueTime}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {rem.relatedEntityName ? `Lead: ${rem.relatedEntityName}` : rem.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <CreateReminderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
