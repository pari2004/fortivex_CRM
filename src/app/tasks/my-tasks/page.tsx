'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, Bell, Clock, AlertCircle, 
  CheckCircle2, Calendar, Phone, RefreshCw, ChevronDown
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { CreateReminderModal } from '@/components/reminders/CreateReminderModal';
import { SnoozeModal } from '@/components/reminders/SnoozeModal';
import { Reminder, ReminderType, ReminderPriority } from '@/lib/types/reminder';

export default function MyRemindersPage() {
  const { reminders, addReminder } = useCRM();

  const handleTestPopupAlert = () => {
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addReminder({
      title: 'Call Priya Sharma regarding FSD admission',
      description: 'Scheduled follow-up discussion for admissions & fees.',
      type: 'Call',
      priority: 'High',
      dueDate: todayStr,
      dueTime: currentTimeStr,
      status: 'PENDING',
      relatedEntityType: 'Lead',
      relatedEntityId: '1',
      relatedEntityName: 'Priya Sharma',
      assignedTo: 'Current User',
      createdBy: 'Current User',
      repeatRule: 'Does not repeat'
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Overdue' | 'Today' | 'Upcoming' | 'Completed'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [snoozingReminder, setSnoozingReminder] = useState<Reminder | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Categorize reminders
  const categorizedReminders = useMemo(() => {
    const overdue: Reminder[] = [];
    const today: Reminder[] = [];
    const upcoming: Reminder[] = [];
    const completed: Reminder[] = [];

    reminders.forEach(reminder => {
      // Filter logic
      const matchesSearch = 
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reminder.description && reminder.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reminder.relatedEntityName && reminder.relatedEntityName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'All' || reminder.type === typeFilter;
      const matchesPriority = priorityFilter === 'All' || reminder.priority === priorityFilter;

      if (!matchesSearch || !matchesType || !matchesPriority) return;

      if (reminder.isCompleted || reminder.status === 'COMPLETED') {
        completed.push(reminder);
      } else if (reminder.dueDate < todayStr) {
        overdue.push(reminder);
      } else if (reminder.dueDate === todayStr) {
        today.push(reminder);
      } else {
        upcoming.push(reminder);
      }
    });

    return { overdue, today, upcoming, completed };
  }, [reminders, searchTerm, typeFilter, priorityFilter, todayStr]);

  const totalOverdue = categorizedReminders.overdue.length;
  const totalToday = categorizedReminders.today.length;
  const totalUpcoming = categorizedReminders.upcoming.length;
  const totalCompleted = categorizedReminders.completed.length;

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsCreateModalOpen(true);
  };

  const handleSnooze = (reminder: Reminder) => {
    setSnoozingReminder(reminder);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '32px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            My Reminders
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
            Stay on top of your follow-ups, calls, meetings, and important actions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleTestPopupAlert}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Bell size={16} /> Test Live Popup Alert
          </button>

          <button
            onClick={() => {
              setEditingReminder(null);
              setIsCreateModalOpen(true);
            }}
            className="primary-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Plus size={18} /> Create Reminder
          </button>
        </div>
      </div>

      {/* Summary Pills Bar (Minimalist Header Summary) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        <div 
          onClick={() => setActiveTab(activeTab === 'Overdue' ? 'All' : 'Overdue')}
          className="glass-panel" 
          style={{ 
            padding: '16px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: activeTab === 'Overdue' ? '2px solid #ef4444' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Overdue</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{totalOverdue}</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab(activeTab === 'Today' ? 'All' : 'Today')}
          className="glass-panel" 
          style={{ 
            padding: '16px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: activeTab === 'Today' ? '2px solid #f59e0b' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Today</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{totalToday}</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab(activeTab === 'Upcoming' ? 'All' : 'Upcoming')}
          className="glass-panel" 
          style={{ 
            padding: '16px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: activeTab === 'Upcoming' ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upcoming</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6' }}>{totalUpcoming}</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab(activeTab === 'Completed' ? 'All' : 'Completed')}
          className="glass-panel" 
          style={{ 
            padding: '16px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: activeTab === 'Completed' ? '2px solid #10b981' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Completed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{totalCompleted}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Category Tabs, Type Filter, Priority Filter */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search reminders by title, lead name, or details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 42px', borderRadius: '12px',
                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)',
                outline: 'none', fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Filter Selectors */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View Tab selector */}
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              style={{
                padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.7)', outline: 'none', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <option value="All">All Sections</option>
              <option value="Overdue">Overdue Only</option>
              <option value="Today">Today Only</option>
              <option value="Upcoming">Upcoming Only</option>
              <option value="Completed">Completed Only</option>
            </select>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.7)', outline: 'none', fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              <option value="All">All Types</option>
              <option value="Call">Call</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Meeting">Meeting</option>
              <option value="Payment">Payment</option>
              <option value="Document">Document</option>
              <option value="Application">Application</option>
              <option value="Custom">Custom</option>
            </select>

            {/* Priority selector */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.7)', outline: 'none', fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🔵 Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Reminders List Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* 🔴 OVERDUE SECTION */}
        {(activeTab === 'All' || activeTab === 'Overdue') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={16} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ef4444' }}>
                🔴 Overdue ({categorizedReminders.overdue.length})
              </h3>
            </div>

            {categorizedReminders.overdue.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {categorizedReminders.overdue.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEdit}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', borderRadius: '16px', fontSize: '0.9rem' }}>
                No overdue reminders. Great job!
              </div>
            )}
          </div>
        )}

        {/* 🟡 TODAY SECTION */}
        {(activeTab === 'All' || activeTab === 'Today') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#d97706' }}>
                🟡 Today ({categorizedReminders.today.length})
              </h3>
            </div>

            {categorizedReminders.today.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {categorizedReminders.today.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEdit}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', borderRadius: '16px', fontSize: '0.9rem' }}>
                No reminders scheduled for today.
              </div>
            )}
          </div>
        )}

        {/* 🔵 UPCOMING SECTION */}
        {(activeTab === 'All' || activeTab === 'Upcoming') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#2563eb' }}>
                🔵 Upcoming ({categorizedReminders.upcoming.length})
              </h3>
            </div>

            {categorizedReminders.upcoming.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {categorizedReminders.upcoming.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEdit}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', borderRadius: '16px', fontSize: '0.9rem' }}>
                No upcoming reminders found.
              </div>
            )}
          </div>
        )}

        {/* 🟢 COMPLETED SECTION */}
        {(activeTab === 'All' || activeTab === 'Completed') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#059669' }}>
                🟢 Completed ({categorizedReminders.completed.length})
              </h3>
            </div>

            {categorizedReminders.completed.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {categorizedReminders.completed.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEdit}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', borderRadius: '16px', fontSize: '0.9rem' }}>
                No completed reminders yet.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modals */}
      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingReminder(null);
        }}
        initialData={editingReminder}
      />

      <SnoozeModal
        isOpen={!!snoozingReminder}
        onClose={() => setSnoozingReminder(null)}
        reminder={snoozingReminder}
      />

    </div>
  );
}
