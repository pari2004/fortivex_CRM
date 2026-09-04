import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Pin, Users, Settings, Briefcase, 
  Link as LinkIcon, MessageSquare, User, Building2 
} from 'lucide-react';
import Link from 'next/link';

interface HelpGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARDS_DATA = [
  {
    id: 1,
    title: 'Frequently Used',
    icon: <Pin size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Bulk Upload Leads from Excel/CSV', link: '/leads' },
      { text: 'Add Single Lead', link: '/leads' },
      { text: 'View Exported Files', link: '/documents' },
      { text: 'Set up Lead Distribution', link: '/customization/customization/lead-lifecycle' },
      { text: 'Invite New User to Workspace', link: '/users' }
    ]
  },
  {
    id: 2,
    title: 'Users & Teams',
    icon: <Users size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Invite New User', link: '/users' },
      { text: 'Create New Team', link: '/team' }
    ],
    buttonText: 'Go to Users & Teams',
    buttonLink: '/users'
  },
  {
    id: 3,
    title: 'Customize for Your Business',
    icon: <Settings size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Your Products or Services', link: '/customization/customization' },
      { text: 'Create New Custom Property', link: '/customization/properties' },
      { text: 'Create New Form', link: '/customization/customization' },
      { text: 'Link Form to Calls, Tasks', link: '/customization/customization' },
      { text: 'Customize Call Outcomes, Tasks', link: '/customization/customization/call-outcomes' },
      { text: 'Quotation Defaults', link: '/customization/customization', isNew: true }
    ],
    buttonText: 'View All Customization',
    buttonLink: '/customization/customization'
  },
  {
    id: 4,
    title: 'Work & Automations',
    icon: <Briefcase size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Manage Work Types', link: '/customization/customization/deal-mode', isNew: true }
    ]
  },
  {
    id: 5,
    title: 'Integrations',
    icon: <LinkIcon size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Connect WhatsApp Cloud API', link: '/conversations/broadcasts/integrations' }
    ],
    buttonText: 'View All Integrations',
    buttonLink: '/conversations/broadcasts/integrations'
  },
  {
    id: 6,
    title: 'Message Templates',
    icon: <MessageSquare size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Create New Template', link: '/whatsapp-hub' },
      { text: 'View All Templates', link: '/whatsapp-hub' }
    ]
  },
  {
    id: 7,
    title: 'Account',
    icon: <User size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Manage Role-Based Access', link: '/customization/roles-permissions' },
      { text: 'Modify Workspace/Account Detail', link: '/customization/organization' },
      { text: 'Modify Workspace Defaults', link: '/customization/account-defaults' },
      { text: 'Manage Do Not Track Leads', link: '/customization/manage-do-not-track' }
    ],
    buttonText: 'View Account Details',
    buttonLink: '/customization/organization'
  },
  {
    id: 8,
    title: 'Have another business?',
    icon: <Building2 size={18} style={{ color: 'var(--primary-color)' }} />,
    description: 'Create a separate Workspace & manage sales for multiple businesses in one place.',
    items: [],
    buttonText: 'Create New Workspace',
    buttonLink: '/customization/organization'
  }
];

export function HelpGuidanceModal({ isOpen, onClose }: HelpGuidanceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Search logic: filter cards if the title or any item text matches
  const filteredCards = CARDS_DATA.map(card => {
    const matchesTitle = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesc = card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingItems = card.items.filter(item => 
      item.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // If the title/desc matches, return the whole card, otherwise return only matching items
    if (matchesTitle || matchesDesc) {
      return card;
    }
    
    if (matchingItems.length > 0) {
      return { ...card, items: matchingItems };
    }
    
    return null;
  }).filter(Boolean);

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{ 
            position: 'relative',
            width: '90%', 
            maxWidth: '1200px', 
            height: '90vh', 
            background: '#f8fafc', 
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#64748b' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Top Banner */}
            <div style={{ 
              width: '100%', 
              maxWidth: '900px',
              background: 'linear-gradient(to right, #9333ea, #3b82f6)',
              borderRadius: '16px',
              padding: '40px 24px',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>NEW TO SALESMAX?</h1>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9, cursor: 'pointer' }} onClick={onClose}>
                <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                  Click here to get started in simple steps &rarr;
                </Link>
              </p>
              <Link href="/customization/organization" onClick={onClose}>
                <button style={{ 
                  marginTop: '8px',
                  background: 'rgba(255,255,255,0.2)', 
                  border: '1px solid rgba(255,255,255,0.4)', 
                  color: 'white', 
                  padding: '8px 24px', 
                  borderRadius: '24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}>
                  Update Tax ID
                </button>
              </Link>
            </div>

            {/* Search */}
            <div style={{ width: '100%', maxWidth: '700px', display: 'flex', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', background: 'white' }}>
                <Search size={20} color="#94a3b8" />
              </div>
              <input 
                type="text" 
                placeholder="Search: e.g., how to add user, upload leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '16px', border: 'none', outline: 'none', fontSize: '1.05rem' }}
              />
              <button style={{ 
                background: '#9333ea', 
                color: 'white', 
                border: 'none', 
                padding: '0 32px', 
                fontSize: '1.05rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Find
              </button>
            </div>

            {/* Warning Bar */}
            <div style={{ 
              width: '100%', 
              background: '#fef2f2', 
              borderLeft: '4px solid #ef4444', 
              padding: '16px 24px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '40px',
              color: '#7f1d1d',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: '#b91c1c' }}>IMPORTANT!!!</strong> All queries/support must go via <strong>Support Chat Channel only</strong> — no direct calls or WhatsApp. Write in detail with supporting screenshot/screen recording. <strong style={{ color: '#b91c1c' }}>Strictly avoid direct call or WhatsApp.</strong>
            </div>

            {/* Cards Grid */}
            <div style={{ 
              width: '100%', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px',
              alignItems: 'start'
            }}>
              {filteredCards.map((card: any) => (
                <div key={card.id} style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    {card.icon}
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#9333ea', fontWeight: 600 }}>{card.title}</h3>
                  </div>
                  
                  {card.description && (
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>
                      {card.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: card.buttonText ? '24px' : '0' }}>
                    {card.items.map((item: any, idx: number) => (
                      <Link href={item.link} key={idx} onClick={onClose} style={{ textDecoration: 'none', color: '#334155', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '4px', 
                          height: '4px', 
                          borderRadius: '50%', 
                          background: '#cbd5e1', 
                          flexShrink: 0
                        }}></span>
                        <span style={{ cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.color = '#9333ea'} onMouseOut={(e) => e.currentTarget.style.color = '#334155'}>
                          {item.text}
                        </span>
                        {item.isNew && (
                          <span style={{ 
                            background: '#dbeafe', 
                            color: '#2563eb', 
                            fontSize: '0.65rem', 
                            fontWeight: 700, 
                            padding: '2px 6px', 
                            borderRadius: '4px' 
                          }}>NEW</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {card.buttonText && (
                    <Link href={card.buttonLink} onClick={onClose} style={{ textDecoration: 'none', width: '100%' }}>
                      <button style={{ 
                        width: '100%', 
                        padding: '10px', 
                        background: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        color: '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#9333ea';
                        e.currentTarget.style.color = '#9333ea';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#64748b';
                      }}
                      >
                        {card.buttonText}
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
