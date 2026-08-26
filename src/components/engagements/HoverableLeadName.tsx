import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Eye, MoreHorizontal } from 'lucide-react';
import { useInbox } from '@/contexts/InboxContext';

interface HoverableLeadNameProps {
  leadName: string;
  leadId?: string;
  phone?: string;
  hoveredRowId: string | null;
  rowId: string;
  onViewClick: () => void;
  textStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  avatarText?: string;
  onMoreClick?: () => void;
}

export function HoverableLeadName({
  leadName,
  leadId,
  phone,
  hoveredRowId,
  rowId,
  onViewClick,
  textStyle,
  containerStyle,
  avatarText,
  onMoreClick,
}: HoverableLeadNameProps) {
  const { openSharedInbox } = useInbox();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', ...containerStyle }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
        {avatarText && (
          <div style={{ 
            width: '24px', height: '24px', borderRadius: '6px', 
            background: 'linear-gradient(135deg, #db2777, #7c3aed)', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '0.65rem', fontWeight: 700, flexShrink: 0
          }}>
            {avatarText}
          </div>
        )}
        <span 
          onClick={(e) => { e.stopPropagation(); onViewClick(); }}
          className="hover-underline"
          style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...textStyle }}
        >
          {leadName}
        </span>
      </div>
      <AnimatePresence>
        {hoveredRowId === rowId && (
          <motion.div 
            initial={{ opacity: 0, x: 10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 10, width: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', flexShrink: 0 }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${phone || ''}`; }}
              style={{ padding: '4px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
              title="Call"
            >
              <Phone size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); openSharedInbox({ entityType: 'lead', entityId: leadId || '' }); }}
              style={{ padding: '4px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
              title="Message"
            >
              <MessageSquare size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onViewClick(); }}
              style={{ padding: '4px', background: '#e0e7ff', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center' }}
              title="View Details"
            >
              <Eye size={14} />
            </button>
            {onMoreClick && (
              <button 
                onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
                style={{ padding: '4px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                title="More Actions"
              >
                <MoreHorizontal size={14} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
