import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

export function AddTagDrawer({ isOpen, onClose, lead, onSave }: any) {
  const { leadTagsList } = useCRM();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && lead) {
      setSelectedTags(lead.tags || []);
      setSearchQuery('');
    }
  }, [isOpen, lead]);

  if (!isOpen) return null;

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleReset = () => {
    if (lead) {
      setSelectedTags(lead.tags || []);
    }
    setSearchQuery('');
  };

  const handleSubmit = () => {
    const oldTags = lead.tags || [];
    const addedTags = selectedTags.filter(t => !oldTags.includes(t));
    const removedTags = oldTags.filter((t: string) => !selectedTags.includes(t));
    
    const changes: string[] = [];
    if (addedTags.length > 0) changes.push(`Added tags: ${addedTags.join(', ')}`);
    if (removedTags.length > 0) changes.push(`Removed tags: ${removedTags.join(', ')}`);

    const updatedLead = { ...lead, tags: selectedTags };
    onSave(updatedLead, changes);
  };

  const filteredTags = leadTagsList.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }} 
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          width: '400px', background: 'white', height: '100%', position: 'relative', 
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' 
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Add Tag</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Selected Tags Display */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedTags.length > 0 ? selectedTags.map(t => (
              <span key={t} style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {t}
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleTagToggle(t)} />
              </span>
            )) : <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No tags selected.</span>}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          {/* Tags List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredTags.length > 0 ? filteredTags.map(tag => (
              <div 
                key={tag.id}
                onClick={() => handleTagToggle(tag.name)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                  background: selectedTags.includes(tag.name) ? '#f8fafc' : 'white',
                  border: selectedTags.includes(tag.name) ? '1px solid #cbd5e1' : '1px solid transparent'
                }}
              >
                <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: selectedTags.includes(tag.name) ? 600 : 400 }}>
                  {tag.name}
                </span>
                {selectedTags.includes(tag.name) && <Check size={18} color="#4f46e5" />}
              </div>
            )) : (
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No tags found.</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
          <button 
            onClick={handleReset}
            style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 24px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset
          </button>
          <button 
            onClick={handleSubmit}
            style={{ background: '#4f46e5', border: 'none', borderRadius: '6px', padding: '8px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
