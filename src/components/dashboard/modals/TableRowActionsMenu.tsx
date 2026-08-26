import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, Edit, UserPlus, Calendar, Activity, Clock, Download, Printer, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  onAction: (action: string) => void;
}

export function TableRowActionsMenu({ onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [isClient, setIsClient] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Calculate position
      let left = rect.right - 200; // 200px menu width
      if (left < 10) left = 10;
      
      let top = rect.bottom + 8;
      
      // Check for overflow at the bottom
      const estimatedMenuHeight = 350;
      if (top + estimatedMenuHeight > window.innerHeight) {
        top = rect.top - estimatedMenuHeight - 8;
        if (top < 10) top = window.innerHeight - estimatedMenuHeight - 10;
      }
      
      setMenuCoords({ top, left });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    onAction(action);
  };

  const actions = [
    { label: 'View Details', icon: Eye, color: 'var(--primary-color)' },
    { label: 'Edit', icon: Edit, color: 'var(--text-primary)' },
    { label: 'Assign', icon: UserPlus, color: 'var(--text-primary)' },
    { label: 'Change Status', icon: RefreshCw, color: 'var(--text-primary)' },
    { label: 'Add Follow-up', icon: Calendar, color: 'var(--text-primary)' },
    { label: 'View Activity', icon: Activity, color: 'var(--text-primary)' },
    { label: 'View Timeline', icon: Clock, color: 'var(--text-primary)' },
    { label: 'Download PDF', icon: Download, color: 'var(--text-primary)' },
    { label: 'Print', icon: Printer, color: 'var(--text-primary)' },
    { label: 'Refresh', icon: RefreshCw, color: 'var(--text-primary)' }
  ];


  useGlobalEscape(!!isOpen, () => { setIsOpen(false) });
  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleMenu} 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', color: 'var(--text-secondary)' }}
        className="hover-bg-secondary"
      >
        <MoreVertical size={18} />
      </button>

      {isClient && document.body && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              style={{ 
                position: 'fixed', 
                left: `${menuCoords.left}px`, 
                top: `${menuCoords.top}px`, 
                background: 'var(--bg-card)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                padding: '8px', 
                zIndex: 99999, 
                minWidth: '200px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px' 
              }}
            >
              {actions.map((act, i) => (
                <React.Fragment key={act.label}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAction(act.label); }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', 
                      background: 'transparent', border: 'none', color: act.color, 
                      textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem' 
                    }}
                    className="hover-bg-secondary"
                  >
                    <act.icon size={16} /> {act.label}
                  </button>
                  {/* Separators */}
                  {(i === 0 || i === 4 || i === 6 || i === 8) && <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />}
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
