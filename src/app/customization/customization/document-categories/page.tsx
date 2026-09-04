'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, Folder, FolderOpen } from 'lucide-react';
import { PremiumModal } from '@/components/common/PremiumModal';

export default function DocumentCategoriesPage() {
  const { documentCategoriesTree, updateDocumentCategoriesTree } = useCRM();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(documentCategoriesTree);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateDocumentCategoriesTree(updated);
  };

  const handleOpenModal = (item?: any, parentId?: string | null) => {
    setParentCategory(parentId || null);
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name });
    } else {
      setEditingItem(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tree = [...documentCategoriesTree];

    if (editingItem) {
      // Find and update
      if (parentCategory) {
        const parentIndex = tree.findIndex(c => c.id === parentCategory);
        if (parentIndex > -1) {
          tree[parentIndex].subCategories = tree[parentIndex].subCategories.map(sub => 
            sub.id === editingItem.id ? { ...sub, name: formData.name } : sub
          );
        }
      } else {
        const idx = tree.findIndex(c => c.id === editingItem.id);
        if (idx > -1) tree[idx] = { ...tree[idx], name: formData.name };
      }
    } else {
      // Create new
      const newNode = { id: `DC-${Date.now()}`, name: formData.name, subCategories: [], order: 99 };
      if (parentCategory) {
        const parentIndex = tree.findIndex(c => c.id === parentCategory);
        if (parentIndex > -1) {
          tree[parentIndex].subCategories.push(newNode);
        }
      } else {
        tree.push(newNode);
      }
    }

    updateDocumentCategoriesTree(tree);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, parentId?: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    let tree = [...documentCategoriesTree];
    if (parentId) {
      const parentIndex = tree.findIndex(c => c.id === parentId);
      if (parentIndex > -1) {
        tree[parentIndex].subCategories = tree[parentIndex].subCategories.filter(c => c.id !== id);
      }
    } else {
      tree = tree.filter(c => c.id !== id);
    }
    updateDocumentCategoriesTree(tree);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Document Categories</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Organize the files uploaded to leads and deals into folders.</p>
        </div>
        <button 
          onClick={() => handleOpenModal(null, null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 500, fontSize: '0.9rem'
          }}
        >
          <Plus size={16} /> Add Root Category
        </button>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="document-categories-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {documentCategoriesTree.map((category, index) => {
                  const isExpanded = expanded[category.id] !== false; // Default true
                  return (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex', flexDirection: 'column',
                            padding: '0', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px',
                            boxShadow: snapshot.isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: snapshot.isDragging ? '#f1f5f9' : 'transparent' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div {...provided.dragHandleProps} style={{ color: '#94a3b8', cursor: 'grab' }}><GripVertical size={16} /></div>
                              <button onClick={() => toggleExpand(category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                {isExpanded ? <FolderOpen size={18} color="#2563eb" /> : <Folder size={18} color="#64748b" />}
                              </button>
                              <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{category.name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleOpenModal(null, category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }} title="Add Sub-category"><Plus size={16} /></button>
                              <button onClick={() => handleOpenModal(category, null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} title="Edit"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          
                          {isExpanded && category.subCategories && category.subCategories.length > 0 && (
                            <div style={{ padding: '0 0 12px 48px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #f1f5f9' }}>
                              {category.subCategories.map((sub) => (
                                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#f8fafc', borderRadius: '6px', marginRight: '16px', marginTop: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.9rem' }}>
                                    <Folder size={14} />
                                    {sub.name}
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleOpenModal(sub, category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(sub.id, category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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

      {isModalOpen && (
        <PremiumModal title={editingItem ? 'Edit Category' : 'Add Category'} isOpen={true} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {parentCategory && (
              <div style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px' }}>
                Adding under parent category
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Category Name</label>
              <input required value={formData.name} onChange={e => setFormData({ name: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} placeholder="e.g. Invoices" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 16px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '6px' }}>Save</button>
            </div>
          </form>
        </PremiumModal>
      )}
    </div>
  );
}
