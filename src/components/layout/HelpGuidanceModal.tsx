import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Pin, Users, Settings, Briefcase, 
  Link as LinkIcon, MessageSquare, User, Building2, CheckCircle2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import SetupWorkspaceCenter from './SetupWorkspaceCenter';
import UpdateTaxModal from '../dashboard/modals/UpdateTaxModal';

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
      { text: 'Bulk Upload Leads', link: '/leads?tab=Uploads' },
      { text: 'Add Single Lead', link: '/leads' },
      { text: 'View Exported Files', link: '/documents' },
      { text: 'Set Up Lead Distribution', link: '/leads?tab=Distribution' },
      { text: 'Invite New User', link: '/users' },
      { text: 'Create Custom Form', link: '/customization/customization/custom-forms' },
      { text: 'Manage Lead Lifecycle', link: '/customization/customization/lead-lifecycle' },
      { text: 'Set Up Deal Stages', link: '/customization/customization/deal-setup' },
      { text: 'Customize Call Outcomes', link: '/customization/customization/call-outcomes' },
      { text: 'Connect Integrations', link: '/customization/customization/integrations' }
    ]
  },
  {
    id: 2,
    title: 'Users & Teams',
    icon: <Users size={18} style={{ color: 'var(--primary-color)' }} />,
    items: [
      { text: 'Invite New User', link: '/users' },
      { text: 'Create New Team', link: '/team' },
      { text: 'Manage Roles & Permissions', link: '/roles' },
      { text: 'Manage Users', link: '/users' },
      { text: 'Review User Access', link: '/roles' }
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
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetOnboarding = () => setIsOnboardingMode(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsOnboardingMode(false);
      setSearchTerm('');
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

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            width: '95%', 
            maxWidth: '1400px', 
            height: '90vh', 
            background: '#ffffff', 
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden'
          }}
        >
          {/* LEFT SIDEBAR PANEL */}
          <div style={{ 
            width: '320px', 
            background: 'linear-gradient(180deg, #f0fdfa 0%, #e0e7ff 100%)', 
            borderRight: '1px solid #e2e8f0',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', color: '#1e293b', fontWeight: 700 }}>
              Salesmax Help Center
            </h2>
            <p style={{ margin: '0 0 32px 0', fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
              Welcome to your dedicated workspace setup and support center. Find everything you need to customize your CRM and empower your team.
            </p>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#334155' }}>Quick Start Guide</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#475569', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span>Customize your organization profile</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#475569', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span>Invite your team members</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#475569', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span>Import existing leads</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#475569', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span>Connect your integrations</span>
                </li>
              </ul>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
              <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={48} style={{ color: '#818cf8', opacity: 0.8 }} />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa', position: 'relative' }}>
            
            {/* Header / Close Button */}
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

            <div style={{ overflowY: 'auto', padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <AnimatePresence mode="wait">
                {isOnboardingMode ? (
                  <SetupWorkspaceCenter 
                    key="onboarding"
                    onClose={onClose}
                    onExit={resetOnboarding}
                  />
                ) : (
                  <motion.div 
                    key="help-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    
                    {/* Search */}
                    <div style={{ 
                      width: '100%', 
                      maxWidth: '700px', 
                      display: 'flex', 
                      marginBottom: '32px', 
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                      borderRadius: '16px', 
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s, border-color 0.2s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.2)';
                      e.currentTarget.style.borderColor = '#9333ea';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', background: 'transparent' }}>
                        <Search size={20} color="#64748b" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search: e.g., how to add user, upload leads..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '16px 16px 16px 0', border: 'none', outline: 'none', fontSize: '1.05rem', color: '#1e293b' }}
                      />
                    </div>

                    {/* Premium Top Banner */}
                    <div style={{ 
                      width: '100%', 
                      background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                      borderRadius: '20px',
                      padding: '48px 32px',
                      color: 'white',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '32px',
                      boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.4)'
                    }}>
                      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>NEW TO SALESMAX?</h1>
                      <div 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onClick={() => setIsOnboardingMode(true)}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                      >
                        <span style={{ fontSize: '1.15rem', fontWeight: 500 }}>Click here to get started in simple steps</span>
                        <ArrowRight size={20} />
                      </div>
                      <div 
                        onClick={() => setIsTaxModalOpen(true)}
                        style={{ 
                          marginTop: '16px',
                          background: 'white', 
                          color: '#4f46e5', 
                          padding: '10px 28px', 
                          borderRadius: '100px',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          display: 'inline-block',
                          textAlign: 'center'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Update Tax ID
                      </div>
                    </div>

                    {/* Warning Bar */}
                    <div style={{ 
                      width: '100%', 
                      background: '#fff1f2', 
                      border: '1px solid #fecdd3',
                      borderLeft: '4px solid #f43f5e', 
                      padding: '20px 24px',
                      borderRadius: '12px',
                      marginBottom: '40px',
                      color: '#9f1239',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      boxShadow: '0 4px 6px -1px rgba(225, 29, 72, 0.05)'
                    }}>
                      <strong style={{ color: '#e11d48' }}>IMPORTANT!!!</strong> All queries/support must go via <strong>Support Chat Channel only</strong> — no direct calls or WhatsApp. Write in detail with supporting screenshot/screen recording. <strong style={{ color: '#e11d48' }}>Strictly avoid direct call or WhatsApp.</strong>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ 
                      width: '100%', 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                      gap: '24px',
                      alignItems: 'start',
                      paddingBottom: '40px'
                    }}>
                      {filteredCards.map((card: any) => (
                        <div key={card.id} style={{ 
                          background: 'white', 
                          borderRadius: '16px', 
                          border: '1px solid #e2e8f0', 
                          padding: '28px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'default'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)';
                        }}
                        >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    {card.icon}
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#9333ea', fontWeight: 600 }}>{card.title}</h3>
                  </div>
                  
                  {card.description && (
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>
                      {card.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: card.buttonText ? '24px' : '0', overflowY: 'auto', maxHeight: '240px', paddingRight: '8px' }}>
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
                                padding: '12px', 
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '12px',
                                color: '#475569',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.color = '#334155';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#f8fafc';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#475569';
                              }}
                              >
                                {card.buttonText}
                              </button>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      </div>
      )}
      </AnimatePresence>
      <UpdateTaxModal isOpen={isTaxModalOpen} onClose={() => setIsTaxModalOpen(false)} />
    </>,
    document.body
  );
}
