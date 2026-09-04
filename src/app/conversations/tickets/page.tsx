'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { CreateUpdateTicketModal } from '@/components/dashboard/modals/CreateUpdateTicketModal';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, ChevronDown, AlertTriangle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketsPage() {
  const router = useRouter();
  const { 
    supportTickets, 
    ticketStages, 
    ticketCategories, 
    systemUsers, 
    addSupportTicket,
    updateSupportTicket
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'My' | 'All'>('All');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  const [activePopover, setActivePopover] = useState<'filter' | 'updated' | 'created' | 'category' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modals
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    categoryId: '',
    stageId: '',
    assignedTo: ''
  });

  const handleNewTicketClick = () => {
    if (ticketStages.length === 0 || ticketCategories.length === 0) {
      setShowSetupModal(true);
    } else {
      setShowCreateDrawer(true);
    }
  };

  const handleGoToCustomizations = () => {
    router.push('/customization/customization/tickets');
  };

  const submitNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.categoryId || !newTicket.stageId) return;

    addSupportTicket({
      id: `TKT-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      categoryId: newTicket.categoryId,
      stageId: newTicket.stageId,
      assignedTo: newTicket.assignedTo || systemUsers[0]?.id || '',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setShowCreateDrawer(false);
    setNewTicket({ title: '', description: '', categoryId: '', stageId: '', assignedTo: '' });
  };

  const filteredTickets = useMemo(() => {
    let result = supportTickets;

    if (activeTab === 'My') {
      // Assuming USR-001 is current user for demo purposes
      result = result.filter(t => t.assignedTo === 'USR-001');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }

    if (selectedUser) {
      result = result.filter(t => t.assignedTo === selectedUser);
    }

    if (selectedCategory) {
      result = result.filter(t => t.categoryId === selectedCategory);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [supportTickets, activeTab, searchQuery, selectedUser, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FDF7FC' }}>
      {/* Toolbar - Exact visual match */}
      <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* My / All Toggle */}
          <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <button 
              onClick={() => setActiveTab('My')} 
              style={{ 
                padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                background: activeTab === 'My' ? '#ec4899' : 'transparent', 
                color: activeTab === 'My' ? 'white' : '#64748b' 
              }}>
              My
            </button>
            <button 
              onClick={() => setActiveTab('All')} 
              style={{ 
                padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                background: activeTab === 'All' ? '#ec4899' : 'transparent', 
                color: activeTab === 'All' ? 'white' : '#64748b' 
              }}>
              All
            </button>
          </div>

          {/* Filter Icon */}
          <button 
            onClick={() => setActivePopover(activePopover === 'filter' ? null : 'filter')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '36px', height: '36px', background: 'transparent', border: 'none', 
              cursor: 'pointer', color: '#475569' 
            }}
          >
            <Filter size={18} />
          </button>

          {/* Filter Pills */}
          <button 
            onClick={() => setActivePopover(activePopover === 'updated' ? null : 'updated')}
            style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '20px', color: '#334155', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            Updated
          </button>
          <button 
            onClick={() => setActivePopover(activePopover === 'created' ? null : 'created')}
            style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '20px', color: '#334155', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            Created
          </button>
          <button 
            onClick={() => setActivePopover(activePopover === 'category' ? null : 'category')}
            style={{ padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '20px', color: '#334155', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            Category {selectedCategory && <span style={{display: 'inline-block', width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', marginLeft: '6px'}}></span>}
          </button>

        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets" 
              style={{ 
                padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', 
                borderRadius: '6px', outline: 'none', fontSize: '0.9rem', width: '240px', color: '#334155' 
              }} 
            />
          </div>
          <button 
            onClick={handleNewTicketClick}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', 
              background: '#5c6bc0', color: 'white', border: 'none', borderRadius: '6px', 
              cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}
          >
            <Plus size={16} /> New Ticket
          </button>
        </div>

        {/* POPOVERS */}
        <AnimatePresence>
          {activePopover === 'filter' && (
            <motion.div 
              ref={popoverRef}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ position: 'absolute', top: '70px', left: '160px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, width: '260px' }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1e293b' }}>Filter by User / Team</h4>
              <select 
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', marginBottom: '12px' }}
              >
                <option value="">All Users</option>
                {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setSelectedUser(''); setActivePopover(null); }} style={{ padding: '6px 12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                <button onClick={() => setActivePopover(null)} style={{ padding: '6px 12px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
              </div>
            </motion.div>
          )}

          {activePopover === 'category' && (
            <motion.div 
              ref={popoverRef}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ position: 'absolute', top: '70px', left: '320px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, width: '260px' }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1e293b' }}>Filter by Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} /> All Categories
                </label>
                {ticketCategories.map(c => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="radio" checked={selectedCategory === c.id} onChange={() => setSelectedCategory(c.id)} /> {c.name}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button onClick={() => { setSelectedCategory(''); setActivePopover(null); }} style={{ padding: '6px 12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                <button onClick={() => setActivePopover(null)} style={{ padding: '6px 12px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
              </div>
            </motion.div>
          )}

          {(activePopover === 'updated' || activePopover === 'created') && (
            <motion.div 
              ref={popoverRef}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ position: 'absolute', top: '70px', left: activePopover === 'updated' ? '200px' : '280px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, width: '220px' }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1e293b' }}>Filter by {activePopover === 'updated' ? 'Updated' : 'Created'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="radio" name="date" checked={false} onChange={() => {}} /> Today</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="radio" name="date" checked={false} onChange={() => {}} /> Last 7 Days</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="radio" name="date" checked={false} onChange={() => {}} /> Last 30 Days</label>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button onClick={() => setActivePopover(null)} style={{ padding: '6px 12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
                <button onClick={() => setActivePopover(null)} style={{ padding: '6px 12px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '0 32px 32px 32px', overflowY: 'auto' }}>
        {filteredTickets.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredTickets.map(ticket => {
              const category = ticketCategories.find(c => c.id === ticket.categoryId);
              const stage = ticketStages.find(s => s.id === ticket.stageId);
              const user = systemUsers.find(u => u.id === ticket.assignedTo);

              return (
                <div key={ticket.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px' }}>
                      {ticket.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px' }}>
                      {category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>{ticket.title}</h3>
                  <p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ticket.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'white' }}>
                        {user?.name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{user?.name || 'Unassigned'}</span>
                    </div>
                    {stage?.isResolved && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Resolved</span>}
                    {stage?.isClosed && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Closed</span>}
                    {!stage?.isResolved && !stage?.isClosed && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>{stage?.name || 'Active'}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>No tickets found.</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* TICKET SETUP REQUIRED MODAL */}
      {showSetupModal && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 9998 }} onClick={() => setShowSetupModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: '8px', padding: '48px 40px', width: '500px', zIndex: 9999, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #f9a826', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span style={{ color: '#f9a826', fontSize: '40px', fontWeight: 300, lineHeight: 1 }}>!</span>
            </div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>Ticket setup required</h2>
            <p style={{ margin: '0 auto 32px auto', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '380px' }}>
              Superadmins should create Ticket Categories and Stages before creating a ticket - Visit Get Support &gt; Customize for your business to define them.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={handleGoToCustomizations} style={{ padding: '10px 20px', background: '#6366f1', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Go to Customizations
              </button>
              <button onClick={() => setShowSetupModal(false)} style={{ padding: '10px 20px', background: '#64748b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                Not now
              </button>
            </div>
          </div>
        </>
      )}

      {/* CREATE TICKET DRAWER */}
      <CreateUpdateTicketModal isOpen={showCreateDrawer} onClose={() => setShowCreateDrawer(false)} />
    </div>
  );
}
