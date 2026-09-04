import os

FILES = {}

# 2. Tasks Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/tasks/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';
import { Eye, Edit, CheckCircle, Plus, FileText, Download, Clock, AlertTriangle, Play, Calendar } from 'lucide-react';

const MOCK_TASKS = Array.from({ length: 30 }).map((_, i) => ({
  id: `TSK-${1000 + i}`,
  name: `Task Module Development ${i}`,
  priority: i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low',
  assignedBy: 'Manager A',
  dueDate: new Date(Date.now() + (i - 10) * 86400000).toISOString().split('T')[0],
  status: i % 5 === 0 ? 'Pending' : i % 3 === 0 ? 'Completed' : 'Assigned',
  progress: i % 3 === 0 ? 100 : i * 2,
  category: 'Development',
  description: 'Complete the task module implementation.',
  timeTaken: i % 3 === 0 ? '4h 30m' : null,
  performanceScore: i % 3 === 0 ? 95 : null,
  supervisorRemarks: i % 3 === 0 ? 'Excellent work.' : null
}));

export default function TasksPage() {
  const searchParams = useSearchParams();
  const initTab = searchParams.get('tab') || 'assigned';
  const [activeTab, setActiveTab] = useState(initTab);
  const [data, setData] = useState(MOCK_TASKS);
  const [filteredData, setFilteredData] = useState(MOCK_TASKS);
  
  const [viewModal, setViewModal] = useState<any>(null);

  const getActionMenu = (task: any) => {
    let items = [{ label: 'View', icon: <Eye size={16}/>, onClick: () => setViewModal(task) }];
    if (task.status === 'Assigned') {
      items.push({ label: 'Edit', icon: <Edit size={16}/>, onClick: () => {} });
      items.push({ label: 'Mark Complete', icon: <CheckCircle size={16}/>, onClick: () => {
         const up = { ...task, status: 'Completed', progress: 100, timeTaken: '2h', performanceScore: 100 };
         setData(d => d.map(x => x.id === task.id ? up : x));
      }});
      items.push({ label: 'Add Notes', icon: <FileText size={16}/>, onClick: () => {} });
      items.push({ label: 'Download PDF', icon: <Download size={16}/>, onClick: () => {} });
    } else if (task.status === 'Completed') {
      items.push({ label: 'Download Report', icon: <Download size={16}/>, onClick: () => {} });
    } else if (task.status === 'Pending') {
      items.push({ label: 'Start Task', icon: <Play size={16}/>, onClick: () => {} });
      items.push({ label: 'Reschedule', icon: <Calendar size={16}/>, onClick: () => {} });
      items.push({ label: 'Request Extension', icon: <Clock size={16}/>, onClick: () => {} });
    }
    return <ActionMenu items={items} />;
  };

  const currentList = filteredData.filter(d => 
    activeTab === 'assigned' ? d.status === 'Assigned' :
    activeTab === 'completed' ? d.status === 'Completed' :
    d.status === 'Pending'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Tasks</h1>
      
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {['assigned', 'completed', 'pending'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, textTransform: 'capitalize'
            }}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
        <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['name', 'id']} exportFilename="Tasks_Report" />
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Task ID</th>
              <th style={{ padding: '16px' }}>Task Name</th>
              <th style={{ padding: '16px' }}>Priority</th>
              <th style={{ padding: '16px' }}>Due Date</th>
              <th style={{ padding: '16px' }}>Status</th>
              {activeTab === 'completed' && <th style={{ padding: '16px' }}>Performance</th>}
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{task.id}</td>
                <td style={{ padding: '16px' }}>{task.name}</td>
                <td style={{ padding: '16px' }}><span style={{ color: task.priority==='High'?'#ef4444':task.priority==='Medium'?'#f59e0b':'#10b981', fontWeight:600 }}>{task.priority}</span></td>
                <td style={{ padding: '16px' }}>{task.dueDate}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', fontSize: '0.8rem' }}>{task.status}</span></td>
                {activeTab === 'completed' && <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>{task.performanceScore}/100</td>}
                <td style={{ padding: '16px', textAlign: 'right' }}>{getActionMenu(task)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlidePanel isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Task Details" width="500px">
        {viewModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <h3>{viewModal.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>ID: {viewModal.id} • Assigned By: {viewModal.assignedBy}</p>
            </div>
            <div><strong>Priority:</strong> {viewModal.priority}</div>
            <div><strong>Due Date:</strong> {viewModal.dueDate}</div>
            <div><strong>Progress:</strong> {viewModal.progress}%</div>
            <div><strong>Description:</strong> {viewModal.description}</div>
            {viewModal.status === 'Completed' && (
              <>
                <div><strong>Time Taken:</strong> {viewModal.timeTaken}</div>
                <div><strong>Supervisor Remarks:</strong> {viewModal.supervisorRemarks}</div>
              </>
            )}
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
"""

# 3. Schedule Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/schedule/page.tsx"] = """'use client';

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
"""

# 4. Announcements Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/announcements/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Paperclip, Clock } from 'lucide-react';
import { SlidePanel } from '@/components/common/PremiumModal';

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: 'CRM Version 2.5 Released', category: 'Technology', date: '2026-08-01', priority: 'High', postedBy: 'Admin', desc: 'New modules added.', color: '#3b82f6' },
  { id: 2, title: 'Monthly Team Meeting', category: 'Company', date: '2026-08-05', priority: 'Medium', postedBy: 'HR', desc: 'Join us in the main hall.', color: '#10b981' },
  { id: 3, title: 'Office Holiday', category: 'Holiday', date: '2026-08-15', priority: 'Low', postedBy: 'HR', desc: 'Independence Day off.', color: '#ec4899' },
  { id: 4, title: 'AI Training Session', category: 'Training', date: '2026-08-10', priority: 'High', postedBy: 'Training Dept', desc: 'Mandatory for all.', color: '#8b5cf6' },
];

export default function AnnouncementsPage() {
  const [data, setData] = useState(MOCK_ANNOUNCEMENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nv = {
      id: Date.now(),
      title: fd.get('title') as string,
      category: fd.get('category') as string,
      date: fd.get('publishDate') as string,
      priority: fd.get('priority') as string,
      postedBy: 'Current User',
      desc: fd.get('desc') as string,
      color: '#f59e0b'
    };
    setData([nv, ...data]);
    setIsCreateOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Company Announcements</h1>
        <button onClick={() => setIsCreateOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {data.map(a => (
          <div key={a.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderTop: `4px solid ${a.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: a.color, background: `${a.color}20`, padding: '4px 8px', borderRadius: '4px' }}>{a.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {a.date}</span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{a.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 16px 0' }}>{a.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span>By {a.postedBy}</span>
              <span style={{ color: a.priority==='High'?'#ef4444':'inherit' }}>Priority: {a.priority}</span>
            </div>
          </div>
        ))}
      </div>

      <SlidePanel isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Announcement" width="500px">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title</label><input name="title" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <select name="category" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                {['Company', 'HR', 'Training', 'Events', 'Holiday', 'Emergency', 'Technology'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
              <select name="priority" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                {['Low', 'Medium', 'High'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label><textarea name="desc" required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Publish Date</label><input type="date" name="publishDate" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <button type="submit" style={{ padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, marginTop: '12px' }}>Publish Announcement</button>
        </form>
      </SlidePanel>
    </div>
  );
}
"""

for path, content in FILES.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Files generated.")
