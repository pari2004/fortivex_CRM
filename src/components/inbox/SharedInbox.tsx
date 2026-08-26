'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInbox } from '@/contexts/InboxContext';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';
import { ContactDetails } from './ContactDetails';
import { X } from 'lucide-react';

export function SharedInbox() {
  const { isOpen, closeSharedInbox } = useInbox();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSharedInbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSharedInbox]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999, // Ensure it sits above everything
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none' // Allow clicks to pass through overlay background if needed, but we'll use a backdrop
        }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'auto'
            }}
            onClick={closeSharedInbox}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative',
              width: '95vw',
              maxWidth: '1600px',
              height: '90vh',
              background: 'var(--bg-primary)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              overflow: 'hidden',
              pointerEvents: 'auto',
              flexDirection: 'column'
            }}
          >
            {/* Inbox Header */}
            <div style={{
              height: '60px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              background: 'rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Shared Inbox</div>
              <button 
                onClick={closeSharedInbox}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* 3-Panel Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '320px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <ConversationList />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                <ChatArea />
              </div>
              <div style={{ width: '350px', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <ContactDetails />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
