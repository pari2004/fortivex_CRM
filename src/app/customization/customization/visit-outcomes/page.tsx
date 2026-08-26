'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, MapPin } from 'lucide-react';
import { X } from 'lucide-react';

export default function VisitOutcomesPage() {
  const { visitOutcomes, updateVisitOutcomes } = useCRM();
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ESC closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Neutral' as 'Positive' | 'Neutral' | 'Negative',
    description: ''
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(visitOutcomes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateVisitOutcomes(updated);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, type: item.type, description: item.description });
    } else {
      setEditingItem(null);
      setFormData({ name: '', type: 'Neutral', description: '' });
    }
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = visitOutcomes.map(outcome => 
        outcome.id === editingItem.id ? { ...outcome, ...formData } : outcome
      );
      updateVisitOutcomes(updated);
    } else {
      const newOutcome = {
        id: `VO-${Date.now()}`,
        ...formData,
        order: visitOutcomes.length + 1
      };
      updateVisitOutcomes([...visitOutcomes, newOutcome]);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this outcome?')) {
      const filtered = visitOutcomes.filter(o => o.id !== id);
      updateVisitOutcomes(filtered);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Positive': return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
      case 'Negative': return { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' };
      default: return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Visit Outcomes</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Define the possible results of an in-person meeting or office visit.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 500, fontSize: '0.9rem'
          }}
        >
          <Plus size={16} /> Add Outcome
        </button>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 2fr 80px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>
          <div></div>
          <div>Outcome Name</div>
          <div>Type</div>
          <div>Description</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="visit-outcomes-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {visitOutcomes.map((outcome, index) => {
                  const style = getTypeStyle(outcome.type);
                  return (
                    <Draggable key={outcome.id} draggableId={outcome.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'grid',
                            gridTemplateColumns: '40px 1.5fr 1fr 2fr 80px',
                            alignItems: 'center',
                            padding: '16px',
                            background: snapshot.isDragging ? '#ffffff' : '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                          }}
                        >
                          <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                            <GripVertical size={18} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                            <MapPin size={16} color="#64748b" />
                            {outcome.name}
                          </div>
                          <div>
                            <span style={{ 
                              background: style.bg, color: style.color, border: `1px solid ${style.border}`,
                              padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 
                            }}>
                              {outcome.type}
                            </span>
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.9rem', paddingRight: '16px' }}>{outcome.description}</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => handleOpenModal(outcome)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(outcome.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

            {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.25)',
              zIndex: 998,
              transition: 'opacity 0.3s',
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '420px',
            height: '100vh',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.25s ease-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {editingItem ? 'Edit Visit Outcome' : 'Adding New Visit Outcome'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Outcome Name</label>
                  <input 
                    required 
                    autoFocus
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Campus Visit Completed"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  >
                    <option value="Positive">Positive (Moves deal forward)</option>
                    <option value="Neutral">Neutral (Needs follow-up)</option>
                    <option value="Negative">Negative (Deal lost/stalled)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description of this outcome..."
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', minHeight: '100px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button type="button" onClick={() => { setFormData({ name: '', type: 'Neutral', description: '' }); }} style={{ flex: 1, padding: '12px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#475569' }}>
                  Reset
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                  {editingItem ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
