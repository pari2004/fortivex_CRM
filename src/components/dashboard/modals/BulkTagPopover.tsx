import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';

export const BulkTagPopover = ({ onClose, onSelect, leadTagsList, updateLeadTagsList }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const filteredTags = leadTagsList?.filter((t: any) => t.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  
  const handleCreate = () => {
    if (!newTagName.trim()) return;
    const newTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
      order: (leadTagsList?.length || 0) + 1,
      createdAt: new Date().toISOString()
    };
    updateLeadTagsList([...(leadTagsList || []), newTag]);
    setIsCreating(false);
    setNewTagName('');
  };

  return (
    <div ref={popoverRef} style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', width: '260px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', zIndex: 10000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
      {!isCreating ? (
        <>
          <div style={{ padding: '16px 16px 12px 16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>Add tag</h4>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{leadTagsList?.length || 0} tag{leadTagsList?.length === 1 ? '' : 's'} available</span>
          </div>
          
          <div style={{ padding: '0 16px 12px 16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="#6b7280" style={{ position: 'absolute', left: '10px' }} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search tags" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.85rem', transition: 'border-color 0.2s', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '0 8px 8px 8px' }}>
            {!leadTagsList || leadTagsList.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>No tags available</div>
            ) : filteredTags.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>No tags found</div>
            ) : (
              filteredTags.map((tag: any) => (
                <div 
                  key={tag.id}
                  onClick={() => onSelect(tag.name)}
                  style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: tag.color || '#e5e7eb', marginRight: '10px' }} />
                  <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>{tag.name}</span>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', padding: '4px' }}>
            <div 
              onClick={() => setIsCreating(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#4338ca', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '4px', background: '#e0e7ff' }}>
                <Plus size={14} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Create new tag</span>
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>Create new tag</h4>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Tag Name</label>
            <input 
              autoFocus
              type="text" 
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="E.g. VIP"
              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.85rem', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Tag Color</label>
            <input 
              type="color" 
              value={newTagColor}
              onChange={e => setNewTagColor(e.target.value)}
              style={{ width: '100%', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleCreate}
              style={{ flex: 1, background: '#4338ca', color: 'white', padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Create Tag
            </button>
            <button 
              onClick={() => setIsCreating(false)}
              style={{ flex: 1, background: 'white', color: '#4b5563', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
