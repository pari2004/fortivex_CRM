import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

export function AddToListDrawer({ isOpen, onClose, lead, onSave }: any) {
  const { lists, addList } = useCRM();
  
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [selectedListId, setSelectedListId] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode('existing');
      setSelectedListId('');
      setNewListName('');
      setNewListDesc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mode === 'existing') {
      if (!selectedListId) {
        alert("Please select a list");
        return;
      }
      const listObj = lists.find(l => l.id === selectedListId);
      if (listObj) {
        onSave(listObj.name);
      }
    } else {
      if (!newListName) {
        alert("Please enter a name for the new list");
        return;
      }
      addList({
        name: newListName,
        description: newListDesc,
        sourceCategory: 'Lead Form',
        allowDuplicates: false,
        disallowAutoRechain: false,
        owner: 'System',
        contains: 1,
        distribution: 'Unassigned',
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        listStatus: 'Active'
      });
      onSave(newListName);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', justifyContent: 'flex-end' }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }} 
      />

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Add To List</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '6px', borderRadius: '8px' }}>
            <button 
              onClick={() => setMode('existing')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                background: mode === 'existing' ? 'white' : 'transparent',
                color: mode === 'existing' ? '#4f46e5' : '#64748b',
                border: 'none', boxShadow: mode === 'existing' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Add to existing static list
            </button>
            <button 
              onClick={() => setMode('new')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                background: mode === 'new' ? 'white' : 'transparent',
                color: mode === 'new' ? '#4f46e5' : '#64748b',
                border: 'none', boxShadow: mode === 'new' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Create new list
            </button>
          </div>

          {mode === 'existing' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Select List Option</label>
              <select 
                value={selectedListId}
                onChange={e => setSelectedListId(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: selectedListId ? '#1e293b' : '#94a3b8', outline: 'none', background: 'white' }}
              >
                <option value="" disabled>Select an existing list</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Name of your list</label>
                <input 
                  type="text" 
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  placeholder="E.g. Hot Leads 2026"
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Description or objective of this list</label>
                <textarea 
                  value={newListDesc}
                  onChange={e => setNewListDesc(e.target.value)}
                  placeholder="E.g. Leads to contact by next week"
                  rows={3}
                  style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', resize: 'none' }} 
                />
              </div>
            </div>
          )}

        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button 
            onClick={handleSubmit}
            style={{ width: '100%', background: '#4f46e5', border: 'none', borderRadius: '6px', padding: '10px 24px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            Add to List
          </button>
        </div>
      </motion.div>
    </div>
  );
}
