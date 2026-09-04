import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

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
  isOpen?: boolean;
  onToggle?: (e: React.MouseEvent) => void;
  onClose?: () => void;
}

export function ActionMenu({ items, isOpen: isOpenProp, onToggle, onClose }: ActionMenuProps) {
  const [selfOpen, setSelfOpen] = useState(false);
  const [position, setPosition] = useState<{ top: string | number, bottom: string | number, left: string | number, right: string | number }>({ top: '100%', bottom: 'auto', left: 'auto', right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : selfOpen;

  const updatePosition = () => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const menuWidth = 220;
      const menuHeight = items.length * 40 + 10;
      
      let newPos = { top: '100%' as string | number, bottom: 'auto' as string | number, left: 'auto' as string | number, right: 0 as string | number };
      
      // Vertical adjustment
      if (rect.bottom + menuHeight > windowHeight && rect.top - menuHeight > 0) {
        // Open upwards
        newPos.top = 'auto';
        newPos.bottom = '100%';
      } else {
        // Default downwards
        newPos.top = '100%';
        newPos.bottom = 'auto';
      }
      
      // Horizontal adjustment
      // The default is right: 0 (which means it aligns its right edge with the button's right edge)
      // This is usually fine if the button is on the right.
      // Let's check if the left edge of the menu would go offscreen.
      const estimatedLeftEdge = rect.right - menuWidth;
      if (estimatedLeftEdge < 10) {
        // Align left edge with button's left edge
        newPos.right = 'auto';
        newPos.left = 0;
      }
      
      setPosition(newPos);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Optional: add resize listener
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, items.length]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isControlled]);

  useGlobalEscape(isOpen, handleClose);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <button 
        ref={buttonRef}
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
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: position.top === 'auto' ? 10 : -10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: position.top === 'auto' ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute', 
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              marginTop: position.top === '100%' ? '4px' : '0',
              marginBottom: position.bottom === '100%' ? '4px' : '0',
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
