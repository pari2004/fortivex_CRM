import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, GripVertical, Eye, EyeOff, RotateCcw, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const ALL_COLUMNS = [
  'Lead',
  'Lead Source',
  'Engagement Type',
  'Engagement Status',
  'Engagement Owner',
  'Team',
  'Last Updated'
];

interface CustomizeColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedColumns: { id: string; visible: boolean }[];
  onSave: (columns: { id: string; visible: boolean }[]) => void;
}

export function CustomizeEngagementsColumnsModal({ isOpen, onClose, savedColumns, onSave }: CustomizeColumnsModalProps) {
  const [columns, setColumns] = useState<{ id: string; visible: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (savedColumns.length > 0) {
        setColumns(savedColumns);
      } else {
        setColumns(ALL_COLUMNS.map(col => ({ id: col, visible: true })));
      }
    }
  }, [isOpen, savedColumns]);

  const filteredColumns = useMemo(() => {
    if (!searchTerm) return columns;
    return columns.filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [columns, searchTerm]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || searchTerm) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const newCols = Array.from(columns);
    const [removed] = newCols.splice(sourceIndex, 1);
    newCols.splice(destIndex, 0, removed);
    setColumns(newCols);
  };

  const toggleVisibility = (id: string) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleReset = () => {
    setColumns(ALL_COLUMNS.map(col => ({ id: col, visible: true })));
    setSearchTerm('');
  };

  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '90vw', maxWidth: '500px', height: '80vh', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Customize Table</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={24} /></button>
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search columns..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '14px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="columns-list" isDropDisabled={!!searchTerm}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredColumns.map((col, index) => (
                    <Draggable key={col.id} draggableId={col.id} index={index} isDragDisabled={!!searchTerm}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 16px', background: snapshot.isDragging ? 'var(--bg-secondary)' : 'var(--bg-card)',
                            border: '1px solid var(--glass-border)', borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'none',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div {...provided.dragHandleProps} style={{ color: 'var(--text-tertiary)', cursor: !!searchTerm ? 'default' : 'grab', opacity: !!searchTerm ? 0.3 : 1 }}>
                              <GripVertical size={18} />
                            </div>
                            <input 
                              type="checkbox" 
                              checked={col.visible} 
                              onChange={() => toggleVisibility(col.id)} 
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', fontWeight: 500, color: col.visible ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                              {col.id}
                            </span>
                          </div>
                          <button onClick={() => toggleVisibility(col.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
                            {col.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
          <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            <RotateCcw size={16} /> Reset to Default
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              <Check size={16} /> Save For Yourself
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
