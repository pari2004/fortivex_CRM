import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string;
  divider?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  // These props are optional — if omitted, ActionMenu self-manages open/close state
  isOpen?: boolean;
  onToggle?: (e: React.MouseEvent) => void;
  onClose?: () => void;
}

export function ActionMenu({ items, isOpen: isOpenProp, onToggle, onClose }: ActionMenuProps) {
  const [selfOpen, setSelfOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine whether we're in controlled or self-managed mode
  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : selfOpen;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isControlled && onToggle) {
      onToggle(e);
    } else {
      setSelfOpen(prev => !prev);
    }
  };

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setSelfOpen(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    // Close on Escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button 
        onClick={handleToggle} 
        style={{ 
          background: isOpen ? 'var(--bg-secondary)' : 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '4px',
          borderRadius: '8px',
          transition: 'background 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)'
        }}
        title="Actions"
      >
        <MoreHorizontal size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute', 
              right: 0, 
              top: '100%', 
              marginTop: '4px',
              background: 'var(--bg-primary)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '12px', 
              boxShadow: 'var(--shadow-lg)', 
              zIndex: 50, 
              width: '220px', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '4px'
            }}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={`div-${index}`} style={{ borderBottom: '1px solid var(--glass-border)', margin: '4px 0' }} />;
              }

              const content = (
                <>
                  {item.icon && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>}
                  {item.label}
                </>
              );
              
              const itemStyle = {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left' as const,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                borderRadius: '8px',
                transition: 'background 0.2s',
                color: item.color || 'var(--text-primary)',
                textDecoration: 'none'
              };

              if (item.href) {
                return (
                  <a 
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className="action-menu-item-hover"
                    style={itemStyle}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button 
                  key={index}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (item.onClick) item.onClick();
                    handleClose(); 
                  }} 
                  className="action-menu-item-hover"
                  style={itemStyle}
                >
                  {content}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .action-menu-item-hover:hover { background: var(--bg-secondary) !important; }
      `}} />
    </div>
  );
}
