import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Mail, Building2, Users, List, PlayCircle, 
  MessageSquare, FileText, Video, Hash, ArrowDownToLine,
  RefreshCw, CheckCircle, Search, ChevronDown, Calendar, RotateCcw
} from 'lucide-react';

interface UserProfileModalProps {
  user: any;
  onClose: () => void;
}

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const tabs = [
    { id: 'Important', label: 'Important' },
    { id: 'All', label: 'All', count: 1 },
    { id: 'Calls', label: 'Calls' },
    { id: 'Video Call', label: 'Video Call' },
    { id: 'Notes', label: 'Notes' },
    { id: 'Emails', label: 'Emails' },
    { id: 'Whatsapp Templates', label: 'Whatsapp Templates' },
    { id: 'Broadcast', label: 'Broadcast' },
    { id: 'Visits', label: 'Visits' },
    { id: 'Quotes', label: 'Quotes' },
    { id: 'Payments', label: 'Payments' }
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
      zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '95vw', height: '95vh', background: 'var(--bg-primary)',
          borderRadius: '16px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden'
        }}
        onClick={(e) => {
            e.stopPropagation();
            if (actionMenuOpen) setActionMenuOpen(false);
        }}
      >
        {/* HEADER */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#c084fc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{user.name}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px' }}>
                  Call Attempted Lead
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* KPI Nav */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { icon: RefreshCw, label: 'Interactions', count: 1, active: true },
                { icon: List, label: 'Tasks', count: 0 },
                { icon: CheckCircle, label: 'Opportunities', count: 0 },
                { icon: MessageSquare, label: 'Tickets', count: 0 },
                { icon: MessageSquare, label: 'Conversations', count: 0 },
                { icon: FileText, label: 'Documents', count: 0 }
              ].map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  color: item.active ? 'var(--primary-color)' : 'var(--text-secondary)',
                  borderBottom: item.active ? '2px solid var(--primary-color)' : 'none',
                  paddingBottom: '4px', fontWeight: item.active ? 600 : 500
                }}>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  <span style={{ 
                    background: item.active ? 'var(--primary-color)' : 'var(--bg-secondary)', 
                    color: item.active ? 'white' : 'var(--text-secondary)', 
                    padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem' 
                  }}>{item.count}</span>
                </div>
              ))}
            </div>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setActionMenuOpen(!actionMenuOpen);
                }}
                style={{ 
                  background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', 
                  borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
                }}
              >
                ACTION <ChevronDown size={16} />
              </button>
              
              {/* ACTION DROPDOWN */}
              <AnimatePresence>
                {actionMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                      background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
                      borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      width: '600px', display: 'flex', zIndex: 100, padding: '16px'
                    }}
                  >
                    <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', paddingRight: '16px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '12px' }}>Contact</div>
                      {[
                        { icon: FileText, label: 'Edit Contact' },
                        { icon: Hash, label: 'Add Tag' },
                        { icon: Building2, label: 'Add Business' },
                        { icon: List, label: 'Add To List' },
                        { icon: RefreshCw, label: 'Change Category' },
                        { icon: X, label: 'Delete Contact', color: '#ef4444' }
                      ].map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', cursor: 'pointer', color: act.color || 'var(--text-primary)', borderRadius: '6px' }} className="hover-bg-secondary">
                          <act.icon size={16} /> <span>{act.label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', padding: '0 16px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '12px' }}>Activity</div>
                      {[
                        { icon: Phone, label: 'Log Call Outcome' },
                        { icon: FileText, label: 'Add Note' },
                        { icon: Calendar, label: 'Log Visit' },
                        { icon: Video, label: 'Video Call' },
                        { icon: ArrowDownToLine, label: 'Add Document' },
                        { icon: FileText, label: 'View Payments' }
                      ].map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', cursor: 'pointer', borderRadius: '6px' }} className="hover-bg-secondary">
                          <act.icon size={16} color="var(--text-secondary)" /> <span>{act.label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, paddingLeft: '16px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '12px' }}>Tasks / Sales</div>
                      {[
                        { icon: CheckCircle, label: 'Create Ad-hoc Task' },
                        { icon: FileText, label: 'Create/Update Deal' },
                        { icon: MessageSquare, label: 'Create/Update Ticket' },
                        { icon: FileText, label: 'Send Quote' },
                        { icon: FileText, label: 'Request Payment' },
                        { icon: Users, label: 'Assign' }
                      ].map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', cursor: 'pointer', borderRadius: '6px' }} className="hover-bg-secondary">
                          <act.icon size={16} color="var(--text-secondary)" /> <span>{act.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT SIDEBAR */}
          <div style={{ width: '350px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            
            <div style={{ padding: '20px' }}>
              {/* Primary Contact Card */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Owner: Pavan S H</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--primary-color)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                    <Phone size={16} />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <Calendar size={20} color="#64748b" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Set up follow...</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No date scheduled</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>CONTACT DETAILS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Phone size={16} color="var(--text-secondary)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>+918097248026</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Phone size={14} color="var(--primary-color)" />
                    <MessageSquare size={14} color="#10b981" />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Mail size={16} color="var(--text-secondary)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>nabiwishes@gmail.com</div>
                    </div>
                  </div>
                  <Mail size={14} color="var(--primary-color)" />
                </div>
              </div>

              {/* More On This Lead */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  <span>More On This Lead</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', cursor: 'pointer' }}>MODIFY</span>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Interested In?', value: 'Executive GenAI & Agentic AI', pill: true },
                    { label: 'Current Company Type', value: 'NA' },
                    { label: 'What are you looking...', value: 'NA' }
                  ].map((field, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{field.label}</span>
                      {field.pill ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{field.value}</span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{field.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* LEAD JOURNEY */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px', padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '16px' }}>LEAD JOURNEY</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { title: 'Started working', time: 'now', active: true },
                    { title: 'Lead assigned', time: '23h ago' },
                    { title: 'Lead created', time: '3w ago' }
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.active ? 'var(--primary-color)' : '#cbd5e1' }} />
                        <span style={{ fontWeight: step.active ? 'bold' : 500, color: step.active ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.title}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{step.time}</span>
                      {i < 2 && <div style={{ position: 'absolute', left: '3px', top: '16px', bottom: '-16px', width: '2px', background: '#cbd5e1' }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Businesses */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Associated Businesses</span>
                  <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Link Business</button>
                </div>
                <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Building2 size={32} color="#cbd5e1" />
                  <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>NA</span>
                </div>
              </div>

              {/* Associated Contacts */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Associated Contacts</span>
                  <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Link Contact</button>
                </div>
                <div style={{ padding: '24px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No contacts linked yet.
                </div>
              </div>

              {/* List Memberships */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>List Memberships</span>
                  <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Add to List</button>
                </div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>Jul 23 2026, 18:52</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>STATIC • bulk upload</div>
                  </div>
                  <span style={{ color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer' }}>Remove</span>
                </div>
              </div>

            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? (tab.id === 'Important' ? '#4f46e5' : '#3b82f6') : 'var(--bg-secondary)',
                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                    border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                  }}
                >
                  {tab.id === 'Important' && <CheckCircle size={14} />}
                  {tab.label}
                  {tab.count !== undefined && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0 6px', borderRadius: '10px', fontSize: '0.75rem' }}>{tab.count}</span>}
                </button>
              ))}
              
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                <Search size={16} color="var(--text-tertiary)" style={{ marginRight: '8px' }} />
                <input 
                  type="text" 
                  placeholder="Search timeline" 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '120px' }} 
                />
                <RefreshCw size={14} color="var(--text-tertiary)" style={{ marginLeft: '8px', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Timeline */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-20px', width: '2px', background: '#e2e8f0', zIndex: 0 }} />
                
                {/* Event 1 */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px' }}>
                  <div style={{ position: 'absolute', left: '-32px', top: 0, width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={16} />
                  </div>
                  <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px 16px', borderRadius: '8px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f766e' }}>Lifecycle changed</span>
                    <span style={{ color: '#3b82f6' }}>to Call Attempted Lead</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px' }}>
                  <div style={{ position: 'absolute', left: '-32px', top: 0, width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={16} />
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>placed a call</span>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 }}>0h:0m:46s</span>
                    </div>
                    <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 500 }}>Not Interested</span>
                  </div>

                  {/* Audio Player Mock */}
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '400px' }}>
                    <PlayCircle size={32} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                    <RotateCcw size={20} color="var(--text-tertiary)" style={{ transform: 'scaleX(-1)', cursor: 'pointer' }} />
                    <RotateCcw size={20} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>0:00</span>
                    <div style={{ flex: 1, height: '4px', background: 'var(--glass-border)', borderRadius: '2px', position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '2px', height: '16px', position: 'absolute', top: '-6px', left: 0, width: '100%' }}>
                        {[...Array(30)].map((_, i) => (
                          <div key={i} style={{ width: '3px', height: `${Math.random() * 100}%`, background: '#cbd5e1', alignSelf: 'center', borderRadius: '1px' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 3 */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ position: 'absolute', left: '-32px', top: 0, width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={16} />
                  </div>
                  <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px 16px', borderRadius: '8px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f766e' }}>Lifecycle changed</span>
                    <span style={{ color: '#22c55e' }}>to New Inquiry Lead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
