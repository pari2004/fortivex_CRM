'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Video, MapPin, X } from 'lucide-react';
import { SlidePanel } from '@/components/common/PremiumModal';
import { ActionMenu } from '@/components/common/ActionMenu';

const MOCK_EVENTS = [
  { id: 'E1', title: 'Weekly Team Sync', type: 'Meeting', date: new Date().toISOString().split('T')[0], time: '10:00 AM', location: 'Google Meet', link: 'meet.google.com/xyz', organizer: 'Manager A', agenda: 'Discuss weekly KPIs' },
  { id: 'E2', title: 'Client Demo', type: 'Demo', date: new Date().toISOString().split('T')[0], time: '02:00 PM', location: 'Zoom', link: 'zoom.us/xyz', organizer: 'Self', agenda: 'CRM product tour' }
];

export default function SchedulePage() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState<any>(null);

  const handleCreate = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ev = {
      id: `E${Date.now()}`,
      title: fd.get('title') as string,
      type: fd.get('type') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      location: fd.get('location') as string,
      agenda: fd.get('agenda') as string,
      link: '',
      organizer: 'Self'
    };
    setEvents([...events, ev]);
    setIsCreateOpen(false);
  };

  const getMenu = (ev: any) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <CalendarIcon size={16}/>, onClick: () => setViewEvent(ev) },
      { label: 'Reschedule', icon: <Clock size={16}/>, onClick: () => {} },
      { label: 'Cancel', icon: <X size={16} color="red"/>, onClick: () => setEvents(events.filter(e => e.id !== ev.id)) }
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Schedule</h1>
        <button onClick={() => setIsCreateOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Plus size={18} /> Schedule Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, overflow: 'hidden' }}>
        <div className="glass-panel" style={{ padding: '24px', overflow: 'auto' }}>
          <h2 style={{ marginBottom: '16px' }}>Timeline</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ width: '80px', textAlign: 'center', color: 'var(--primary-color)', fontWeight: 'bold' }}>{ev.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>{ev.title}</h3>
                    {getMenu(ev)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={14}/> {ev.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {ev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>Calendar View</h2>
          <div style={{ height: '300px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            [Calendar Grid Mockup]
          </div>
        </div>
      </div>

      <SlidePanel isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Schedule Event" width="500px">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Event Title</label><input name="title" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Type</label>
            <select name="type" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
              {['Meeting', 'Task', 'Reminder', 'Training', 'Interview', 'Demo'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date</label><input type="date" name="date" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Time</label><input type="time" name="time" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          </div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Location / Link</label><input name="location" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Agenda / Description</label><textarea name="agenda" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
          <button type="submit" style={{ padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, marginTop: '12px' }}>Save Event</button>
        </form>
      </SlidePanel>
      
      <SlidePanel isOpen={!!viewEvent} onClose={() => setViewEvent(null)} title="Event Details" width="400px">
        {viewEvent && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <h3>{viewEvent.title}</h3>
             <div><strong>Type:</strong> {viewEvent.type}</div>
             <div><strong>Date:</strong> {viewEvent.date}</div>
             <div><strong>Time:</strong> {viewEvent.time}</div>
             <div><strong>Organizer:</strong> {viewEvent.organizer}</div>
             <div><strong>Location:</strong> {viewEvent.location}</div>
             <div><strong>Agenda:</strong> {viewEvent.agenda}</div>
             {viewEvent.link && <button style={{ padding: '10px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none' }}>Join Meeting</button>}
           </div>
        )}
      </SlidePanel>
    </div>
  );
}
