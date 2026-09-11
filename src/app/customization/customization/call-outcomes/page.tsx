'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM, CallOutcome } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function CallOutcomesPage({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { callOutcomes, updateCallOutcomes } = useCRM();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CallOutcome>({
    id: '',
    name: '',
    type: 'Neutral',
    description: '',
    order: 0
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(callOutcomes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateCallOutcomes(updatedItems);
  };

  const handleOpenDrawer = (index: number | null) => {
    if (index !== null) {
      setFormData(callOutcomes[index]);
      setEditingIndex(index);
    } else {
      setFormData({ id: Math.random().toString(36).substring(7), name: '', type: 'Neutral', description: '', order: callOutcomes.length + 1 });
      setEditingIndex(null);
    }
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const newItems = [...callOutcomes];
      newItems[editingIndex] = formData;
      updateCallOutcomes(newItems);
    } else {
      updateCallOutcomes([...callOutcomes, formData]);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm(`Are you sure you want to delete the "${callOutcomes[index].name}" outcome?`)) {
      const newItems = callOutcomes.filter((_, i) => i !== index);
      updateCallOutcomes(newItems);
    }
  };

  return (
    <div style={{ maxWidth: hideHeader ? '100%' : '1000px', background: hideHeader ? 'transparent' : '#fff' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Call Outcomes</h1>
          <button 
            onClick={() => handleOpenDrawer(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: '#e0e7ff', color: '#4f46e5',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <Plus size={16} /> New Outcome
          </button>
        </div>
      )}
      
      {hideHeader && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button 
            onClick={() => handleOpenDrawer(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <Plus size={16} /> Add Custom Outcome
          </button>
        </div>
      )}

      <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="call-outcomes-droppable" direction="vertical">
            {(provided) => (
              <div 
                ref={provided.innerRef} 
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                {callOutcomes.map((outcome, index) => {
                  let badgeBg = '#f1f5f9', badgeColor = '#475569';
                  if (outcome.type === 'Positive') { badgeBg = '#dcfce7'; badgeColor = '#166534'; }
                  else if (outcome.type === 'Negative') { badgeBg = '#fee2e2'; badgeColor = '#991b1b'; }
                  else if (outcome.type === 'Neutral') { badgeBg = '#eff6ff'; badgeColor = '#1e40af'; }
                  
                  return (
                    <Draggable key={outcome.id || `${outcome.name}-${index}`} draggableId={outcome.id || `${outcome.name}-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          style={{
                            ...provided.draggableProps.style,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '16px',
                            zIndex: callOutcomes.length - index,
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'box-shadow 0.2s',
                          }}
                        >
                          <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab', display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                            <GripVertical size={20} />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>{outcome.name}</span>
                              <span style={{ 
                                background: badgeBg, 
                                color: badgeColor, 
                                fontSize: '0.7rem', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                {outcome.type}
                              </span>
                            </div>
                            {outcome.description && (
                              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{outcome.description}</div>
                            )}
                          </div>

                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            opacity: hoveredIndex === index ? 1 : 0,
                            transition: 'opacity 0.2s',
                          }}>
                            <button onClick={() => handleOpenDrawer(index)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#475569', padding: '8px' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(index)} style={{ background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', padding: '8px' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
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
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.25)', zIndex: 998, transition: 'opacity 0.3s',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
            background: '#ffffff', boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)', zIndex: 999,
            display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease-out',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {editingIndex !== null ? 'Edit Call Outcome' : 'Add New Call Outcome'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}
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
                    placeholder="e.g. Connected"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Outcome Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as 'Positive' | 'Neutral' | 'Negative' })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  >
                    <option value="Positive">Positive (e.g. Interested, Connected)</option>
                    <option value="Neutral">Neutral (e.g. Follow-up, Call Back)</option>
                    <option value="Negative">Negative (e.g. No Answer, Lost)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of when to use this outcome"
                    rows={3}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button type="button" onClick={() => { setFormData({ id: '', name: '', type: 'Neutral', description: '', order: 0 }); }} style={{ flex: 1, padding: '12px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#475569' }}>
                  Reset
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                  Save / Submit
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
