'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, Link as LinkIcon, X, ChevronDown } from 'lucide-react';
import type { LeadSourceItem } from '@/contexts/CRMContext';

export default function LeadSourcePage() {
  const { leadSourceList, updateLeadSourceList } = useCRM();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadSourceItem | null>(null);

  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // Dropdown state for Sub Categories
  const [subcatDropdownOpen, setSubcatDropdownOpen] = useState(false);
  const [subcatInputValue, setSubcatInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(leadSourceList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    const updated = items.map((item, index) => ({ ...item, order: index + 1 }));
    updateLeadSourceList(updated);
  };

  const openDrawer = (item?: LeadSourceItem) => {
    if (item) {
      setEditingItem(item);
      setCategoryName(item.name);
      setSubCategories(item.subcategories || (item.description ? [item.description] : []));
    } else {
      setEditingItem(null);
      setCategoryName('');
      setSubCategories([]);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
    setCategoryName('');
    setSubCategories([]);
    setSubcatInputValue('');
    setSubcatDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSubcatDropdownOpen(false);
      }
    };
    if (subcatDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [subcatDropdownOpen]);

  // ESC closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this source?')) {
      const filtered = leadSourceList.filter(s => s.id !== id);
      updateLeadSourceList(filtered);
    }
  };

  const handleReset = () => {
    setCategoryName('');
    setSubCategories([]);
    setSubcatInputValue('');
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    // Include whatever is currently typed in the input if they didn't press Enter
    let finalSubcats = [...subCategories];
    if (subcatInputValue.trim() && !finalSubcats.includes(subcatInputValue.trim())) {
      finalSubcats.push(subcatInputValue.trim());
    }

    if (editingItem) {
      const updated = leadSourceList.map(source =>
        source.id === editingItem.id
          ? {
              ...source,
              name: categoryName.trim(),
              // Fallback description to first subcategory for backwards compat
              description: finalSubcats.join(', '),
              subcategories: finalSubcats,
            }
          : source
      );
      updateLeadSourceList(updated);
    } else {
      // Check if category already exists
      const existing = leadSourceList.find(s => s.name.toLowerCase() === categoryName.trim().toLowerCase());
      if (existing) {
        // Merge subcategories
        const mergedSubcats = Array.from(new Set([...(existing.subcategories || []), ...finalSubcats]));
        const updated = leadSourceList.map(source =>
          source.id === existing.id
            ? { ...source, subcategories: mergedSubcats, description: mergedSubcats.join(', ') }
            : source
        );
        updateLeadSourceList(updated);
      } else {
        const newSource: LeadSourceItem = {
          id: `SRC-${Date.now()}`,
          name: categoryName.trim(),
          description: finalSubcats.join(', '),
          subcategories: finalSubcats,
          order: leadSourceList.length + 1,
        };
        updateLeadSourceList([...leadSourceList, newSource]);
      }
    }
    closeDrawer();
  };

  // Find existing subcategories for the typed category (to show in dropdown)
  const existingCategory = leadSourceList.find(s => s.name.toLowerCase() === categoryName.trim().toLowerCase());
  const availableSubcategories = existingCategory?.subcategories || [];

  const handleSubcatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && subcatInputValue.trim()) {
      e.preventDefault();
      if (!subCategories.includes(subcatInputValue.trim())) {
        setSubCategories([...subCategories, subcatInputValue.trim()]);
      }
      setSubcatInputValue('');
    }
  };

  const removeSubCategory = (subcat: string) => {
    setSubCategories(prev => prev.filter(s => s !== subcat));
  };

  const handleSelectExistingSubcat = (subcat: string) => {
    if (!subCategories.includes(subcat)) {
      setSubCategories([...subCategories, subcat]);
    }
    setSubcatDropdownOpen(false);
  };

  return (
    <>
      {/* Right-side Drawer */}
      {drawerOpen && (
        <>
          {/* Subtle overlay */}
          <div
            onClick={closeDrawer}
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

          {/* Drawer panel (RIGHT side) */}
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
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {editingItem ? 'Edit Lead Source Type' : 'Adding New Lead Source Type'}
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
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              gap: '24px',
              overflowY: 'auto',
            }}>
              {/* Define Lead Category */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#334155',
                }}>
                  Define a lead category
                </label>
                <input
                  autoFocus
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  placeholder="e.g. Marketing, Referral, Event"
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
              </div>

              {/* Sub Categories */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#334155',
                }}>
                  Enter Lead Source Sub Categories that belong to this category
                </label>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '8px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  minHeight: '46px',
                  alignItems: 'center',
                  position: 'relative',
                  background: '#ffffff',
                }}>
                  {subCategories.map(subcat => (
                    <div key={subcat} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.85rem',
                      color: '#334155',
                      fontWeight: 500,
                      border: '1px solid #e2e8f0',
                    }}>
                      {subcat}
                      <X size={14} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => removeSubCategory(subcat)} />
                    </div>
                  ))}
                  
                  <input
                    value={subcatInputValue}
                    onChange={e => {
                      setSubcatInputValue(e.target.value);
                      if (!subcatDropdownOpen) setSubcatDropdownOpen(true);
                    }}
                    onKeyDown={handleSubcatKeyDown}
                    placeholder={subCategories.length === 0 ? "Type and press Enter..." : ""}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.95rem',
                      background: 'transparent',
                    }}
                  />

                  {/* Dropdown Toggle Icon */}
                  <div
                    onClick={() => setSubcatDropdownOpen(!subcatDropdownOpen)}
                    style={{ cursor: 'pointer', padding: '4px', color: '#94a3b8' }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Subcategory Dropdown List */}
                {subcatDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {availableSubcategories.length > 0 ? (
                      availableSubcategories.filter(s => !subCategories.includes(s)).length > 0 ? (
                        availableSubcategories.filter(s => !subCategories.includes(s)).map(subcat => (
                          <div
                            key={subcat}
                            onClick={() => handleSelectExistingSubcat(subcat)}
                            style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              color: '#334155',
                              borderBottom: '1px solid #f1f5f9',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={e => e.currentTarget.style.background = '#ffffff'}
                          >
                            {subcat}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
                          All existing options selected
                        </div>
                      )
                    ) : (
                      <div style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
                        No items found
                      </div>
                    )}
                  </div>
                )}
                
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '8px 0 0 0' }}>
                  Press Enter to add multiple subcategories.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '20px 24px',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#475569',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = 'white'}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: 'none',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Slide-in animation */}
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}

      {/* Main Page Content */}
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Lead Sources</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Track where your leads are coming from.</p>
          </div>
          <button
            onClick={() => openDrawer()}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 500, fontSize: '0.9rem'
            }}
          >
            <Plus size={16} /> New Lead Source
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 2fr 80px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>
            <div></div>
            <div>Category</div>
            <div>Sub Categories</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="lead-source-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  {leadSourceList.map((source, index) => (
                    <Draggable key={source.id} draggableId={source.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'grid',
                            gridTemplateColumns: '40px 1.5fr 2fr 80px',
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
                            <LinkIcon size={16} color="#64748b" />
                            {source.name}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.9rem', paddingRight: '16px' }}>
                            {source.subcategories && source.subcategories.length > 0 
                              ? source.subcategories.join(', ')
                              : source.description || '-'}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => openDrawer(source)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(source.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
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
          
          {leadSourceList.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
              No lead sources configured. Click "+ New Lead Source" to add one.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
