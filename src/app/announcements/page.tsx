'use client';

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
