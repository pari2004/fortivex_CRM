'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, Tag, X } from 'lucide-react';

export default function LeadTagsPage() {
  const { leadTagsList, updateLeadTagsList } = useCRM();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(leadTagsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateLeadTagsList(updated);
  };

  const openDrawer = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name });
    } else {
      setEditingItem(null);
      setFormData({ name: '' });
    }
    setDrawerOpen(true);
  };

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
    setFormData({ name: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      const updated = leadTagsList.map(tag =>
        tag.id === editingItem.id ? { ...tag, name: formData.name.trim() } : tag
      );
      updateLeadTagsList(updated);
    } else {
      const newTag = {
        id: `TAG-${Date.now()}`,
        name: formData.name.trim(),
        order: leadTagsList.length + 1,
      };
      updateLeadTagsList([...leadTagsList, newTag]);
    }
    closeDrawer();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      const filtered = leadTagsList.filter(t => t.id !== id);
      updateLeadTagsList(filtered);
    }
  };

  return (
    <>
      {/* Left-side Drawer */}
      {drawerOpen && (
        <>
          {/* Subtle overlay — lets the page remain visible */}
          <div
            onClick={closeDrawer}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.15)',
              zIndex: 998,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Drawer panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '380px',
            height: '100vh',
            background: '#ffffff',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInLeft 0.25s ease-out',
          }}>
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {editingItem ? 'Edit Lead Tag' : 'Add New Lead Tag'}
              </h3>
              <button
                onClick={closeDrawer}
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

            {/* Drawer Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#334155',
                }}>
                  Tag Name
                </label>
                <input
                  autoFocus
                  required
                  value={formData.name}
                  onChange={e => setFormData({ name: e.target.value })}
                  placeholder="e.g. VIP, High Priority, Hot Lead"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '8px 0 0 0' }}>
                  This tag will be available across the CRM for categorizing leads.
                </p>
              </div>

              {/* Drawer Footer */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0',
                marginTop: '24px',
              }}>
                <button
                  type="button"
                  onClick={closeDrawer}
                  style={{
                    flex: 1,
                    padding: '11px 20px',
                    border: '1px solid #cbd5e1',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: '#475569',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px 20px',
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                >
                  {editingItem ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </form>
          </div>

          {/* Slide-in animation */}
          <style>{`
            @keyframes slideInLeft {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}

      {/* Main Lead Tags Page Content */}
      <div style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Lead Tags</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Organize and categorize your leads with custom tags.</p>
          </div>
          <button
            onClick={() => openDrawer()}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.9rem',
            }}
          >
            <Plus size={16} /> New Lead Tag
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="lead-tags-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {leadTagsList.map((tag, index) => (
                    <Draggable key={tag.id} draggableId={tag.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                              <GripVertical size={18} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, color: '#334155' }}>
                              <Tag size={16} color="#64748b" />
                              {tag.name}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => openDrawer(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </button>
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

          {leadTagsList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '0.9rem' }}>
              No lead tags yet. Click &quot;+ New Lead Tag&quot; to create one.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
