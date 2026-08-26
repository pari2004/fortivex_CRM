import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, GripVertical, Check, RotateCcw } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CustomizeBusinessColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  currentVisibleColumns: string[];
  onSave: (visibleColumns: string[]) => void;
  onResetToDefault: () => void;
}

export function CustomizeBusinessColumnsModal({
  isOpen,
  onClose,
  availableColumns,
  currentVisibleColumns,
  onSave,
  onResetToDefault
}: CustomizeBusinessColumnsModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedColumns([...currentVisibleColumns]);
    }
  }, [isOpen, currentVisibleColumns]);

  if (!isOpen) return null;

  const handleToggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(prev => prev.filter(c => c !== col));
    } else {
      setSelectedColumns(prev => [...prev, col]);
    }
  };

  const handleRemoveColumn = (col: string) => {
    setSelectedColumns(prev => prev.filter(c => c !== col));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const newCols = Array.from(selectedColumns);
    const [removed] = newCols.splice(sourceIndex, 1);
    newCols.splice(destIndex, 0, removed);
    setSelectedColumns(newCols);
  };

  const unselectedColumns = availableColumns.filter(c => !selectedColumns.includes(c));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '900px',
          maxWidth: '95vw',
          height: '700px',
          maxHeight: '90vh',
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Customize Table Columns</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select & Order the columns you want to see</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Pane - Available Columns */}
          <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available Business Columns</span>
              <button 
                onClick={onResetToDefault}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={14} /> Reset To Default
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableColumns.map(col => {
                const isSelected = selectedColumns.includes(col);
                return (
                  <div key={col} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)', borderRadius: '8px', border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => handleToggleColumn(col)}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--text-tertiary)'}`, background: isSelected ? 'var(--primary-color)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                    </div>
                    <span style={{ fontWeight: 500, color: isSelected ? 'var(--primary-color)' : 'var(--text-primary)' }}>{col}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Pane - Selected Columns (Draggable) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected Columns ({selectedColumns.length})</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="selected-columns">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedColumns.map((col, index) => (
                        <Draggable key={col} draggableId={col} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 16px', background: snapshot.isDragging ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                                border: '1px solid var(--glass-border)', borderRadius: '8px',
                                boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div {...provided.dragHandleProps} style={{ color: 'var(--text-tertiary)', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                                  <GripVertical size={18} />
                                </div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{col}</span>
                              </div>
                              <button 
                                onClick={() => handleRemoveColumn(col)}
                                style={{ background: 'var(--bg-secondary)', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                              >
                                <X size={14} />
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
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <button 
            onClick={() => { setSelectedColumns([...currentVisibleColumns]); }}
            style={{ padding: '12px 24px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            Reset
          </button>
          
          <button 
            onClick={() => { onSave(selectedColumns); onClose(); }}
            style={{ padding: '12px 32px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
          >
            Save For Yourself
          </button>
        </div>
      </motion.div>
    </div>
  );
}
