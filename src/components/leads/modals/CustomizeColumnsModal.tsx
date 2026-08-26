import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, GripVertical, Eye, EyeOff, RotateCcw, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ALL_LEADS_COLUMNS, DEFAULT_VISIBLE_COLUMNS } from '@/lib/data/leadsColumns';

interface CustomizeColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedColumns: { id: string; visible: boolean }[];
  onSave: (columns: { id: string; visible: boolean }[]) => void;
}

export function CustomizeColumnsModal({ isOpen, onClose, savedColumns, onSave }: CustomizeColumnsModalProps) {
  const [columns, setColumns] = useState<{ id: string; visible: boolean }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (savedColumns.length > 0) {
        setColumns(savedColumns);
      } else {
        setColumns(
          ALL_LEADS_COLUMNS.map(col => ({
            id: col,
            visible: DEFAULT_VISIBLE_COLUMNS.includes(col)
          }))
        );
      }
    }
  }, [isOpen, savedColumns]);

  const filteredColumns = useMemo(() => {
    if (!searchTerm) return columns;
    return columns.filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [columns, searchTerm]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // If filtering is active, we don't allow drag and drop reordering directly 
    // because index mapping is complex. We'll disable drag when searching.
    if (searchTerm) return;

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

  const handleShowAll = () => setColumns(prev => prev.map(c => ({ ...c, visible: true })));
  const handleHideAll = () => setColumns(prev => prev.map(c => ({ ...c, visible: false })));
  const handleReset = () => {
    setColumns(
      ALL_LEADS_COLUMNS.map(col => ({
        id: col,
        visible: DEFAULT_VISIBLE_COLUMNS.includes(col)
      }))
    );
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
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Customize Table Columns</h2>
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
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleShowAll} style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>Show All</button>
            <button onClick={handleHideAll} style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>Hide All</button>
            <button onClick={handleReset} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-secondary)' }}><RotateCcw size={14}/> Reset</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
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
                            ...provided.draggableProps.style,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 16px', background: snapshot.isDragging ? 'var(--bg-secondary)' : 'var(--bg-card)',
                            border: '1px solid var(--glass-border)', borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'none',
                            opacity: col.visible ? 1 : 0.6
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div {...provided.dragHandleProps} style={{ color: 'var(--text-tertiary)', cursor: !!searchTerm ? 'not-allowed' : 'grab', display: 'flex', alignItems: 'center' }}>
                              <GripVertical size={18} />
                            </div>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{col.id}</span>
                          </div>
                          
                          <button 
                            onClick={() => toggleVisibility(col.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: col.visible ? 'var(--primary-color)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                          >
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

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-card)' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} /> Save</button>
        </div>
      </motion.div>
    </div>
  );
}
