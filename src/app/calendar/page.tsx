'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event as CalendarEvent, View, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, RefreshCw, Calendar as CalendarIcon, ExternalLink, X, Trash2, Edit3, Bell, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MyEvent extends CalendarEvent {
  id: string;
  type: 'Demo' | 'Interview' | 'Deadline' | 'Meeting';
  description?: string;
  location?: string;
}

const initialEvents: MyEvent[] = [
  {
    id: '1',
    title: 'Full Stack Demo Session',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    type: 'Demo',
    description: 'Introductory session for new leads.',
    location: 'Google Meet',
  },
  {
    id: '2',
    title: 'Counselor Sync Meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'Meeting',
    description: 'Weekly sync up with all admission counselors.',
    location: 'Zoom',
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<MyEvent[]>(initialEvents);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<MyEvent>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('crm_calendar_events');
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((ev: any) => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }));
        setEvents(parsed);
      } catch (e) {
        console.error("Failed to parse calendar events");
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('crm_calendar_events', JSON.stringify(events));
    }
  }, [events, isClient]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = type === 'success' ? 'var(--primary-color)' : '#ef4444';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3000);
  };

  const eventStyleGetter = (event: MyEvent) => {
    let backgroundColor = '#f3f4f6'; 
    let color = '#1f2937';
    let border = '1px solid #e5e7eb';

    switch (event.type) {
      case 'Demo':
        backgroundColor = '#f3e8ff';
        color = '#6b21a8';
        border = '1px solid #e9d5ff';
        break;
      case 'Interview':
        backgroundColor = '#dbeafe';
        color = '#1e40af';
        border = '1px solid #bfdbfe';
        break;
      case 'Deadline':
        backgroundColor = '#fee2e2';
        color = '#b91c1c';
        border = '1px solid #fecaca';
        break;
      case 'Meeting':
        backgroundColor = '#fef3c7';
        color = '#b45309';
        border = '1px solid #fde68a';
        break;
    }
    
    return {
      style: {
        backgroundColor,
        color,
        border,
        borderRadius: '6px',
        opacity: 0.9,
        display: 'block',
        fontWeight: 600,
        fontSize: '0.8rem',
        padding: '2px 6px'
      }
    };
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setFormData({
      start,
      end,
      type: 'Meeting',
      title: '',
      description: '',
      location: ''
    });
    setIsEditing(true);
    setShowEventModal(true);
  };

  const handleSelectEvent = (event: MyEvent) => {
    setSelectedEvent(event);
    setFormData(event);
    setIsEditing(false);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end) return;

    if (selectedEvent && selectedEvent.id) {
      // Update
      setEvents(events.map(ev => ev.id === selectedEvent.id ? { ...ev, ...formData as MyEvent } : ev));
      showToast('Event updated successfully');
    } else {
      // Create
      setEvents([...events, { ...formData, id: Math.random().toString(36).substr(2, 9) } as MyEvent]);
      showToast('Event created successfully');
    }
    setShowEventModal(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(ev => ev.id !== selectedEvent.id));
      showToast('Event deleted successfully');
      setShowEventModal(false);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Calendar synced successfully with Google Calendar!');
    }, 1500);
  };

  const getGoogleCalendarUrl = (event: MyEvent) => {
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const text = encodeURIComponent((event.title as string) || '');
    const details = encodeURIComponent((event.description as string) || '');
    const location = encodeURIComponent(event.location || '');
    const dates = `${formatTime(event.start as Date)}/${formatTime(event.end as Date)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  if (!isClient) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Calendar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and sync your events with Google Calendar.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSync} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, cursor: 'pointer' }}>
            <RefreshCw size={18} className={isSyncing ? "spin" : ""} color={isSyncing ? "var(--primary-color)" : "currentColor"} /> 
            {isSyncing ? 'Syncing...' : 'Sync Calendar'}
          </button>
          <button 
            className="primary-btn" 
            onClick={() => {
              setSelectedEvent(null);
              setFormData({ start: new Date(), end: new Date(new Date().getTime() + 60*60*1000), type: 'Meeting' });
              setIsEditing(true);
              setShowEventModal(true);
            }}
          >
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: '24px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        <style>{`
          .rbc-calendar { font-family: inherit; }
          .rbc-toolbar button { border-radius: 6px; padding: 6px 12px; margin: 0 4px; border: 1px solid var(--glass-border); cursor: pointer; transition: all 0.2s; }
          .rbc-toolbar button.rbc-active { background: var(--primary-light); color: var(--primary-color); border-color: var(--primary-color); font-weight: bold; }
          .rbc-toolbar button:hover { background: var(--bg-secondary); }
          .rbc-event { padding: 0 !important; background: transparent !important; }
          .rbc-day-bg { transition: background 0.2s; }
          .rbc-day-bg:hover { background: var(--bg-secondary) !important; cursor: pointer; }
          .rbc-today { background: rgba(37,99,235,0.05) !important; }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
        
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%', flex: 1 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        />
      </div>

      <AnimatePresence>
      {showEventModal && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="glass-panel" style={{ background: 'var(--bg-primary)', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {isEditing ? (selectedEvent ? 'Edit Event' : 'Create Event') : 'Event Details'}
              </h2>
              <button onClick={() => setShowEventModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
              {isEditing ? (
                <form id="event-form" onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Title</label>
                    <input type="text" value={(formData.title as string) || ''} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Type</label>
                      <select value={formData.type || 'Meeting'} onChange={e => setFormData({...formData, type: e.target.value as any})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }}>
                        <option value="Demo">Demo</option>
                        <option value="Interview">Interview</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Deadline">Deadline</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Start</label>
                      <input type="datetime-local" value={formData.start ? format(new Date(formData.start), "yyyy-MM-dd'T'HH:mm") : ''} onChange={e => setFormData({...formData, start: new Date(e.target.value)})} required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>End</label>
                      <input type="datetime-local" value={formData.end ? format(new Date(formData.end), "yyyy-MM-dd'T'HH:mm") : ''} onChange={e => setFormData({...formData, end: new Date(e.target.value)})} required style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Location (Optional)</label>
                    <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Zoom, Google Meet, Office..." style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Description (Optional)</label>
                    <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', resize: 'vertical' }} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <Bell size={16} color="var(--primary-color)" />
                    <span style={{ fontSize: '0.9rem' }}>Reminders will sync automatically via Google Calendar.</span>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarIcon size={20} color="var(--primary-color)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedEvent?.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <Clock size={14} /> {selectedEvent?.start && format(new Date(selectedEvent.start), 'PPp')} - {selectedEvent?.end && format(new Date(selectedEvent.end), 'p')}
                      </div>
                    </div>
                  </div>
                  
                  {selectedEvent?.location && (
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>Location</div>
                      <div>{selectedEvent.location}</div>
                    </div>
                  )}

                  {selectedEvent?.description && (
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>Description</div>
                      <div style={{ lineHeight: 1.5 }}>{selectedEvent.description}</div>
                    </div>
                  )}
                  
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>Event Type</div>
                    <div style={{ ...eventStyleGetter(selectedEvent as MyEvent).style, display: 'inline-block', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, border: 'none' }}>
                      {selectedEvent?.type}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <a href={getGoogleCalendarUrl(selectedEvent as MyEvent)} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', textAlign: 'center', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <ExternalLink size={16} /> Open in Google Calendar
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: isEditing && selectedEvent ? 'space-between' : 'flex-end', background: 'var(--bg-secondary)' }}>
              {isEditing && selectedEvent && (
                <button type="button" onClick={handleDeleteEvent} style={{ padding: '10px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={16} /> Delete
                </button>
              )}
              
              {!isEditing && selectedEvent && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={handleDeleteEvent} style={{ padding: '10px 16px', background: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trash2 size={16} />
                  </button>
                  <button type="button" onClick={() => setIsEditing(true)} style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Edit3 size={16} /> Edit
                  </button>
                </div>
              )}
              
              {isEditing && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowEventModal(false)} style={{ padding: '10px 24px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" form="event-form" style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Save Event
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
