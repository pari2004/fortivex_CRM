import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function PremiumModal({ isOpen, onClose, title, subtitle, icon, children, footer, maxWidth = '650px' }: PremiumModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Blurred Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }}
          />

          {/* Right-Side Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: maxWidth === '600px' ? '650px' : maxWidth, // Default to 650px as per requirements
              height: '100vh',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              borderRadius: '24px 0 0 24px',
              boxShadow: '-25px 0 50px -12px rgba(0,0,0,0.25), inset 1px 0 0 rgba(255,255,255,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* AI Themed Abstract Background with 5% Opacity */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
              backgroundImage: `radial-gradient(circle at 100% 0%, #2563eb 0%, transparent 40%), radial-gradient(circle at 0% 100%, #7c3aed 0%, transparent 40%), url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10H10V10zM30 30h10v10H30V30zM50 50h10v10H50V50zM70 70h10v10H70V70zM90 90h10v10H90V90z' fill='%231d4ed8' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover, cover, 60px 60px'
            }} />

            {/* Premium Gradient Header */}
            <div style={{
              padding: '32px 32px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {icon && (
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', color: 'white', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                    {icon}
                  </div>
                )}
                <div style={{ color: 'white' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 6px 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{title}</h2>
                  {subtitle && <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4 }}>{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{
                padding: '24px 32px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px',
                position: 'relative',
                zIndex: 1
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SlidePanel({ isOpen, onClose, title, subtitle, icon, children, footer, width = '700px' }: PremiumModalProps & { width?: string }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: width,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '-20px 0 50px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {icon && <div style={{ color: 'var(--primary-color)' }}>{icon}</div>}
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
                  {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f8fafc' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
