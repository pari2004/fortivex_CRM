'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, Edit, Download, FileSpreadsheet, Printer, RefreshCw, Share2, Settings, Copy, Pin, Trash2, PieChart, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  onAction: (action: string) => void;
  optionsGroup?: 'Work Pipeline' | 'Overall Activities' | 'KPI' | 'Default';
}

export function DashboardWidgetMenu({ onAction, optionsGroup = 'Default' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [isClient, setIsClient] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useGlobalEscape(!!isOpen, () => { setIsOpen(false) });

  const handleAction = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Calculate position
      let left = rect.right - 200; // 200px menu width
      if (left < 10) left = 10;
      
      let top = rect.bottom + 8;
      
      // Check for overflow at the bottom
      const estimatedMenuHeight = 300;
      if (top + estimatedMenuHeight > window.innerHeight) {
        top = rect.top - estimatedMenuHeight - 8;
        // If it goes off top, just stick it somewhere safe
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

  const getOptions = () => {
    switch(optionsGroup) {
      case 'Work Pipeline':
        return [
          { label: 'View Details', icon: Eye, color: 'var(--text-primary)', isDivider: false },
          { label: 'View Analytics', icon: PieChart, color: 'var(--text-primary)', isDivider: false },
          { label: 'Edit Widget', icon: Edit, color: 'var(--text-primary)', isDivider: false },
          { label: 'Duplicate Widget', icon: Copy, color: 'var(--text-primary)', isDivider: false },
          { label: 'Refresh', icon: RefreshCw, color: 'var(--text-primary)', isDivider: false },
          { label: 'divider1', isDivider: true },
          { label: 'Export PDF', icon: Download, color: 'var(--text-primary)', isDivider: false },
          { label: 'Export Excel', icon: FileSpreadsheet, color: 'var(--text-primary)', isDivider: false },
          { label: 'Export CSV', icon: FileSpreadsheet, color: 'var(--text-primary)', isDivider: false },
          { label: 'Print', icon: Printer, color: 'var(--text-primary)', isDivider: false },
        ];
      case 'Overall Activities':
        return [
          { label: 'View Details', icon: Eye, color: 'var(--text-primary)', isDivider: false },
          { label: 'View Analytics', icon: PieChart, color: 'var(--text-primary)', isDivider: false },
          { label: 'View Timeline', icon: Clock, color: 'var(--text-primary)', isDivider: false },
          { label: 'Refresh', icon: RefreshCw, color: 'var(--text-primary)', isDivider: false },
        ];
      case 'KPI':
        return [
          { label: 'View Details', icon: Eye, color: 'var(--text-primary)', isDivider: false },
        ];
      default:
        return [
          { label: 'View Details', icon: Eye, color: 'var(--text-primary)', isDivider: false },
          { label: 'View Analytics', icon: PieChart, color: 'var(--text-primary)', isDivider: false },
          { label: 'Refresh', icon: RefreshCw, color: 'var(--text-primary)', isDivider: false }
        ];
    }
  };

  const options = getOptions();

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleMenu} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
      >
        <MoreVertical size={16} />
      </button>

      {isClient && document.body && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-panel"
              style={{ 
                position: 'fixed', 
                left: `${menuCoords.left}px`, 
                top: `${menuCoords.top}px`, 
                zIndex: 99999, 
                padding: '8px', 
                display: 'flex', 
                flexDirection: 'column', 
                minWidth: '200px', 
                textAlign: 'left', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--glass-border)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)' 
              }}
            >
              {options.map((opt, idx) => {
                if (opt.isDivider) return <div key={`div-${idx}`} style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />;
                const Icon = opt.icon as any;
                return (
                  <button 
                    key={opt.label}
                    className="dropdown-item" 
                    onClick={(e) => { e.stopPropagation(); handleAction(opt.label || ''); }} 
                    style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: opt.color, borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <Icon size={14} /> {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
