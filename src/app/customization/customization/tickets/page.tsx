'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, ShieldAlert, Tag } from 'lucide-react';
import { X } from 'lucide-react';

export default function TicketsPage() {
  const { ticketStages, updateTicketStages, ticketCategories, updateTicketCategories } = useCRM();
  
  // Modals state
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stageModalOpen) setStageModalOpen(false);
        if (categoryModalOpen) setCategoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stageModalOpen, categoryModalOpen]);



  const [editingStage, setEditingStage] = useState<any>(null);
  const [stageFormData, setStageFormData] = useState({ name: '', description: '', stageType: 'Active' });

  
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });

  const handleStageDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(ticketStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateTicketStages(updated);
  };

  const handleCategoryDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(ticketCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateTicketCategories(updated);
  };

  // Stage Handlers
    const openStageModal = (item?: any) => {
    if (item) {
      setEditingStage(item);
      setStageFormData({ 
        name: item.name, 
        description: item.description || '', 
        stageType: item.isResolved ? 'Resolved' : item.isClosed ? 'Closed' : 'Active' 
      });
    } else {
      setEditingStage(null);
      setStageFormData({ name: '', description: '', stageType: 'Active' });
    }
    setStageModalOpen(true);
  };

    const submitStage = (e: React.FormEvent) => {
    e.preventDefault();
    const isResolved = stageFormData.stageType === 'Resolved';
    const isClosed = stageFormData.stageType === 'Closed';

    if (editingStage) {
      const wasResolved = editingStage.isResolved;
      const wasClosed = editingStage.isClosed;
      
      if (wasResolved && !isResolved) {
        const otherResolved = ticketStages.filter(s => s.isResolved && s.id !== editingStage.id);
        if (otherResolved.length === 0) {
          alert('Validation Error: At least one stage must be marked "Resolved" so SLA timers know a fix is waiting for confirmation.');
          return;
        }
      }
      
      if (wasClosed && !isClosed) {
        const otherClosed = ticketStages.filter(s => s.isClosed && s.id !== editingStage.id);
        if (otherClosed.length === 0) {
          alert('Validation Error: At least one stage must be marked "Closed" so tickets can leave the board properly.');
          return;
        }
      }

      const updated = ticketStages.map(stage => 
        stage.id === editingStage.id ? { ...stage, name: stageFormData.name, description: stageFormData.description, isResolved, isClosed } : stage
      );
      updateTicketStages(updated);
    } else {
      updateTicketStages([...ticketStages, { id: `TS-${Date.now()}`, name: stageFormData.name, description: stageFormData.description, isResolved, isClosed, order: ticketStages.length + 1 }]);
    }
    setStageModalOpen(false);
  };

  const deleteStage = (id: string) => {
    const stage = ticketStages.find(s => s.id === id);
    if (stage?.isResolved) {
      const otherResolved = ticketStages.filter(s => s.isResolved && s.id !== id);
      if (otherResolved.length === 0) {
        alert('Validation Error: At least one stage must be marked "Resolved". You cannot delete the only resolved stage.');
        return;
      }
    }
    if (stage?.isClosed) {
      const otherClosed = ticketStages.filter(s => s.isClosed && s.id !== id);
      if (otherClosed.length === 0) {
        alert('Validation Error: At least one stage must be marked "Closed". You cannot delete the only closed stage.');
        return;
      }
    }

    if (confirm('Delete this ticket stage?')) {
      updateTicketStages(ticketStages.filter(s => s.id !== id));
    }
  };

  // Category Handlers
    const openCategoryModal = (item?: any) => {
    if (item) {
      setEditingCategory(item);
      setCategoryFormData({ name: item.name, description: item.description || '' });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: '', description: '' });
    }
    setCategoryModalOpen(true);
  };

    const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const updated = ticketCategories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, name: categoryFormData.name, description: categoryFormData.description } : cat
      );
      updateTicketCategories(updated);
    } else {
      updateTicketCategories([...ticketCategories, { id: `TC-${Date.now()}`, name: categoryFormData.name, description: categoryFormData.description, order: ticketCategories.length + 1 }]);
    }
    setCategoryModalOpen(false);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Delete this ticket category?')) {
      updateTicketCategories(ticketCategories.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* Ticket Stages Column */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Ticket Stages</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Configure stages for support tickets.</p>
          </div>
          <button 
            onClick={() => openStageModal()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.85rem'
            }}
          >
            <Plus size={14} /> Add Stage
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <DragDropContext onDragEnd={handleStageDragEnd}>
            <Droppable droppableId="ticket-stages-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ticketStages.map((stage, index) => (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab' }}><GripVertical size={16} /></div>
                            <ShieldAlert size={16} color="#64748b" />
                            <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.95rem' }}>{stage.name}</div>
                            {stage.isResolved && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#dcfce7', color: '#166534', borderRadius: '4px' }}>Resolved</span>}
                            {stage.isClosed && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#f1f5f9', color: '#475569', borderRadius: '4px' }}>Closed</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => openStageModal(stage)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Edit2 size={14} /></button>
                            <button onClick={() => deleteStage(stage.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                          </div>
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

      {/* Ticket Categories Column */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>Ticket Categories</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Organize tickets by issue type.</p>
          </div>
          <button 
            onClick={() => openCategoryModal()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.85rem'
            }}
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <DragDropContext onDragEnd={handleCategoryDragEnd}>
            <Droppable droppableId="ticket-categories-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ticketCategories.map((category, index) => (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab' }}><GripVertical size={16} /></div>
                            <Tag size={16} color="#64748b" />
                            <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.95rem' }}>{category.name}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => openCategoryModal(category)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Edit2 size={14} /></button>
                            <button onClick={() => deleteCategory(category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                          </div>
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

      {/* Modals */}
                  {stageModalOpen && (
        <>
          <div onClick={() => setStageModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.25)', zIndex: 998, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh', background: '#ffffff', boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)', zIndex: 999, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{editingStage ? 'Edit Ticket Stage' : 'Create Ticket Stage'}</h3>
              <button onClick={() => setStageModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}><X size={20} /></button>
            </div>
            <form onSubmit={submitStage} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Stage Name*</label>
                  <input required autoFocus value={stageFormData.name} onChange={e => setStageFormData({...stageFormData, name: e.target.value})} placeholder="Stage Name*" style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Description</label>
                  <textarea value={stageFormData.description} onChange={e => setStageFormData({...stageFormData, description: e.target.value})} placeholder="Description" style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', minHeight: '100px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Stage Type*</label>
                  <select required value={stageFormData.stageType} onChange={e => setStageFormData({...stageFormData, stageType: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}>
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button type="button" onClick={() => { setStageFormData({ name: '', description: '', stageType: 'Active' }); }} style={{ flex: 1, padding: '12px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#475569' }}>Reset</button>
                <button type="submit" style={{ flex: 1, padding: '12px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Save</button>
              </div>
            </form>
          </div>
          <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </>
      )}

                  {categoryModalOpen && (
        <>
          <div onClick={() => setCategoryModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.25)', zIndex: 998, transition: 'opacity 0.3s' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh', background: '#ffffff', boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)', zIndex: 999, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{editingCategory ? 'Edit Ticket Category' : 'Create Ticket Category'}</h3>
              <button onClick={() => setCategoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}><X size={20} /></button>
            </div>
            <form onSubmit={submitCategory} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Category Name*</label>
                  <input required autoFocus value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} placeholder="Category Name*" style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Description</label>
                  <textarea value={categoryFormData.description} onChange={e => setCategoryFormData({...categoryFormData, description: e.target.value})} placeholder="Description" style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', minHeight: '100px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button type="button" onClick={() => { setCategoryFormData({ name: '', description: '' }); }} style={{ flex: 1, padding: '12px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#475569' }}>Reset</button>
                <button type="submit" style={{ flex: 1, padding: '12px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Save</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
