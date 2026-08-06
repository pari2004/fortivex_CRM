import os

FILES = {}

# 7. Help Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/help/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, PlayCircle, Plus, FileText, X, Send } from 'lucide-react';
import { SlidePanel } from '@/components/common/PremiumModal';

const TICKETS = [
  { id: 'T-1001', subject: 'Login issue', category: 'Access', priority: 'High', status: 'Closed', date: '2026-08-01', assigned: 'IT Dept' },
  { id: 'T-1002', subject: 'Dashboard not loading data', category: 'Bug', priority: 'High', status: 'Open', date: '2026-08-04', assigned: 'Dev Team' },
  { id: 'T-1003', subject: 'Requesting software access', category: 'Request', priority: 'Medium', status: 'Open', date: '2026-08-05', assigned: 'IT Dept' },
];

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState(TICKETS);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([{ sender: 'Agent', text: 'Hello! How can I assist you today?' }]);

  const handleCreateTicket = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setTickets([...tickets, {
      id: `T-${Date.now().toString().slice(-4)}`,
      subject: fd.get('subject') as string,
      category: fd.get('category') as string,
      priority: fd.get('priority') as string,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      assigned: 'Pending'
    }]);
    setIsTicketOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}><HelpCircle size={32} color="var(--primary-color)"/> Help & Support</h1>
           <p style={{ color: 'var(--text-secondary)' }}>Get assistance, view articles, or raise a support ticket.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setIsChatOpen(true)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <MessageSquare size={18}/> Live Chat
           </button>
           <button onClick={() => setIsTicketOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Plus size={18}/> Raise Ticket
           </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {['tickets', 'articles', 'contact'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, textTransform: 'capitalize'
            }}
          >
            {tab === 'tickets' ? 'My Tickets' : tab === 'articles' ? 'Help Articles & Videos' : 'Contact Support'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'tickets' && (
           <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '16px' }}>Ticket ID</th>
                    <th style={{ padding: '16px' }}>Subject</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Priority</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Created Date</th>
                    <th style={{ padding: '16px' }}>Assigned To</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{t.id}</td>
                      <td style={{ padding: '16px' }}>{t.subject}</td>
                      <td style={{ padding: '16px' }}>{t.category}</td>
                      <td style={{ padding: '16px' }}><span style={{ color: t.priority==='High'?'#ef4444':'inherit' }}>{t.priority}</span></td>
                      <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: t.status==='Closed'?'#d1fae5':'#fef3c7', color: t.status==='Closed'?'#059669':'#d97706', fontSize: '0.8rem' }}>{t.status}</span></td>
                      <td style={{ padding: '16px' }}>{t.date}</td>
                      <td style={{ padding: '16px' }}>{t.assigned}</td>
                      <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                         <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>View</button>
                         {t.status !== 'Closed' && <button onClick={() => setTickets(tickets.map(x => x.id === t.id ? {...x, status: 'Closed'} : x))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #10b981', color: '#10b981', background: 'transparent', fontSize: '0.8rem', fontWeight: 600 }}>Close</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}

        {activeTab === 'articles' && (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <FileText size={32} color="#3b82f6" style={{ marginBottom: '16px' }}/>
                <h3 style={{ marginBottom: '8px' }}>CRM Basics</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Learn how to navigate the Fortivex.AI CRM efficiently.</p>
                <button style={{ color: '#3b82f6', fontWeight: 600, background: 'none', border: 'none', padding: 0 }}>Read Article &rarr;</button>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <PlayCircle size={32} color="#8b5cf6" style={{ marginBottom: '16px' }}/>
                <h3 style={{ marginBottom: '8px' }}>Task Management Tutorial</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Video guide on managing your daily tasks.</p>
                <button style={{ color: '#8b5cf6', fontWeight: 600, background: 'none', border: 'none', padding: 0 }}>Watch Video &rarr;</button>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <FileText size={32} color="#10b981" style={{ marginBottom: '16px' }}/>
                <h3 style={{ marginBottom: '8px' }}>Meetings & Schedule</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>How to sync Google Calendar with the CRM.</p>
                <button style={{ color: '#10b981', fontWeight: 600, background: 'none', border: 'none', padding: 0 }}>Read Article &rarr;</button>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <PlayCircle size={32} color="#f59e0b" style={{ marginBottom: '16px' }}/>
                <h3 style={{ marginBottom: '8px' }}>Documents Security</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Understanding role-based access for your documents.</p>
                <button style={{ color: '#f59e0b', fontWeight: 600, background: 'none', border: 'none', padding: 0 }}>Watch Video &rarr;</button>
              </div>
           </div>
        )}

        {activeTab === 'contact' && (
           <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', maxWidth: '600px' }}>
              <h2 style={{ marginBottom: '24px' }}>Contact Support Team</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#3b82f620', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={24}/></div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Phone Support</div>
                       <div style={{ color: 'var(--text-secondary)' }}>+1 (800) 123-4567</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={24}/></div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Email Support</div>
                       <div style={{ color: 'var(--text-secondary)' }}>support@fortivex.ai</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#8b5cf620', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={24}/></div>
                    <div>
                       <div style={{ fontWeight: 600 }}>Working Hours</div>
                       <div style={{ color: 'var(--text-secondary)' }}>Mon - Fri, 9:00 AM - 6:00 PM EST</div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <SlidePanel isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} title="Raise Support Ticket" width="500px">
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Subject</label><input name="subject" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <select name="category" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                {['Bug', 'Request', 'Access', 'Hardware', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority</label>
              <select name="priority" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                {['Low', 'Medium', 'High'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label><textarea name="desc" required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
          <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Attachment</label><input type="file" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
          <button type="submit" style={{ padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, marginTop: '12px' }}>Submit Ticket</button>
        </form>
      </SlidePanel>

      {/* LIVE CHAT WIDGET MOCKUP */}
      {isChatOpen && (
         <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '350px', height: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={18}/> Support Chat</div>
               <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X size={18}/></button>
            </div>
            <div style={{ flex: 1, padding: '16px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-secondary)' }}>
               {chatMsgs.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender==='You'?'flex-end':'flex-start', background: m.sender==='You'?'var(--primary-color)':'white', color: m.sender==='You'?'white':'black', padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                     {m.text}
                  </div>
               ))}
            </div>
            <form onSubmit={e => {
               e.preventDefault();
               const fd = new FormData(e.currentTarget);
               const text = fd.get('msg') as string;
               if (!text) return;
               setChatMsgs([...chatMsgs, { sender: 'You', text }]);
               e.currentTarget.reset();
               setTimeout(() => setChatMsgs(prev => [...prev, { sender: 'Agent', text: 'Thank you for reaching out. An agent will be with you shortly.' }]), 1000);
            }} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'white' }}>
               <input name="msg" placeholder="Type a message..." style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}/>
               <button type="submit" style={{ padding: '10px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={18}/></button>
            </form>
         </div>
      )}
    </div>
  );
}
"""

for path, content in FILES.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Help files generated.")
