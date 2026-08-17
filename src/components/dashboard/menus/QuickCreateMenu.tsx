import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, User, FileText, CheckSquare, CalendarPlus, PhoneCall, CreditCard, UploadCloud, FileBarChart, X } from 'lucide-react';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const quickActions = [
  { label: 'Add Lead', description: 'Create a new lead', icon: UserPlus, color: '#3b82f6' },
  { label: 'Add Student', description: 'Register a student', icon: User, color: '#10b981' },
  { label: 'Add Application', description: 'New admission form', icon: FileText, color: '#8b5cf6' },
  { label: 'Add Task', description: 'Assign a new task', icon: CheckSquare, color: '#f59e0b' },
  { label: 'Schedule Meeting', description: 'Plan a meeting', icon: CalendarPlus, color: '#ec4899' },
  { label: 'Log Call', description: 'Record a phone call', icon: PhoneCall, color: '#14b8a6' },
  { label: 'Add Payment', description: 'Record a payment', icon: CreditCard, color: '#f43f5e' },
  { label: 'Upload Document', description: 'Add a new file', icon: UploadCloud, color: '#6366f1' },
  { label: 'Add User', description: 'Create a new user', icon: UserPlus, color: '#84cc16' },
  { label: 'Create Report', description: 'Generate a report', icon: FileBarChart, color: '#0ea5e9' },
];

export function QuickCreateMenu({ isOpen, onClose, onAction }: Props) {
  if (!isOpen) return null;


  useGlobalEscape(!!isOpen, () => { onClose() });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Quick Create</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', 
              color: 'var(--text-secondary)', padding: '8px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
            }}
            className="hover-bg-primary"
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '32px', overflowY: 'auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px' 
          }}>
            {quickActions.map((action, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.03, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onAction(action.label); onClose(); }}
                style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '16px', 
                  padding: '24px', background: 'var(--bg-secondary)', 
                  border: '1px solid var(--glass-border)', borderRadius: '16px',
                  color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                }}
                className="quick-create-card"
              >
                <div style={{ 
                  background: `${action.color}15`, 
                  color: action.color, 
                  padding: '16px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <action.icon size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{action.label}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-secondary)' }}>
          <button onClick={onClose} className="secondary-btn" style={{ padding: '10px 24px', fontSize: '1rem' }}>Cancel</button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .quick-create-card:hover {
            border-color: var(--primary-color) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          }
          .hover-bg-primary:hover {
            background: var(--bg-primary) !important;
          }
        `}} />
      </motion.div>
    </div>
  );
}
