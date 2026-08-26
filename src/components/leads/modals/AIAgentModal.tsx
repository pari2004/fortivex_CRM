import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Sparkles, Filter } from 'lucide-react';

interface AIAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (query: string) => void;
}

const SUGGESTIONS = [
  "Show my leads not called this week",
  "Show all active leads without next followup",
  "Show leads assigned to Pavan S.H",
  "Show call attempted leads with priority High",
  "Show leads from the last 7 days",
  "Show leads jinko call nahi kiya"
];

export function AIAgentModal({ isOpen, onClose, onApplyFilter }: AIAgentModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onApplyFilter(query);
      onClose();
    }
  };

  const handleSuggestion = (sug: string) => {
    setQuery(sug);
    onApplyFilter(sug);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', pointerEvents: 'auto' }}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '400px', background: 'var(--bg-primary)', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', pointerEvents: 'auto', borderLeft: '1px solid var(--glass-border)' }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
              <Sparkles size={20} /> Ask AI
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Filter leads in plain words — in your preferred language</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => { setQuery(''); onApplyFilter(''); }} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} className="hover-bg-card">Start over</button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} /> Try asking...
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSuggestion(sug)}
                  style={{ textAlign: 'left', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}
                  className="hover-border-primary"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="e.g. mere leads jinko call nahi kiya..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
            />
            <button 
              type="submit" 
              disabled={!query.trim()}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: query.trim() ? 'var(--primary-color)' : 'transparent', color: query.trim() ? 'white' : 'var(--text-tertiary)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: query.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
