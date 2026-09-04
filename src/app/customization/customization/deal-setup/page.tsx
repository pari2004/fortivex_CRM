'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useCRM } from '@/contexts/CRMContext';
import { GripVertical, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function DealSetupPage() {
  const { dealStages, updateDealStages } = useCRM();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ name: '', type: 'Normal' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const getStageInfo = (rawName: string) => {
    if (rawName.includes(' (Won)')) return { name: rawName.replace(' (Won)', ''), type: 'Won' };
    if (rawName.includes(' (Lost)')) return { name: rawName.replace(' (Lost)', ''), type: 'Lost' };
    if (rawName.toLowerCase().includes('won')) return { name: rawName, type: 'Won' };
    if (rawName.toLowerCase().includes('lost')) return { name: rawName, type: 'Lost' };
    return { name: rawName, type: 'Normal' };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(dealStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateDealStages(items);
  };

  const handleOpenDrawer = (index: number | null) => {
    if (index !== null) {
      const info = getStageInfo(dealStages[index]);
      setFormData({ name: info.name, type: info.type });
      setEditingIndex(index);
    } else {
      setFormData({ name: '', type: 'Normal' });
      setEditingIndex(null);
    }
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalName = formData.name.trim();
    finalName = finalName.replace(/ \((Won|Lost)\)$/i, '').trim();
    
    if (formData.type === 'Won' && !finalName.toLowerCase().includes('won')) {
      finalName += ' (Won)';
    } else if (formData.type === 'Lost' && !finalName.toLowerCase().includes('lost')) {
      finalName += ' (Lost)';
    }

    const updated = [...dealStages];
    if (editingIndex !== null) {
      updated[editingIndex] = finalName;
    } else {
      updated.push(finalName);
    }
    updateDealStages(updated);
    setDrawerOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this deal stage? Deals in this stage might lose their status.')) {
      const filtered = dealStages.filter((_, i) => i !== index);
      updateDealStages(filtered);
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Deal Stages</h1>
        <button 
          onClick={() => handleOpenDrawer(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', background: '#e0e7ff', color: '#4f46e5',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem'
          }}
        >
          <Plus size={16} /> New Stage
        </button>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="deal-stages-horizontal" direction="horizontal">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                style={{ display: 'flex', alignItems: 'center', minWidth: 'min-content' }}
              >
                {dealStages.map((stageRaw, index) => {
                  const info = getStageInfo(stageRaw);
                  const isFirst = index === 0;
                  const isLast = index === dealStages.length - 1;
                  
                  const bg = info.type === 'Won' ? '#4ade80' : info.type === 'Lost' ? '#fecaca' : '#e2e8f0';
                  const color = info.type === 'Won' ? '#14532d' : info.type === 'Lost' ? '#991b1b' : '#1e293b';
                  const badgeBg = info.type === 'Won' ? '#ffffff' : info.type === 'Lost' ? '#ffffff' : 'transparent';
                  
                  return (
                    <Draggable key={stageRaw + index} draggableId={stageRaw + index} index={index}>
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
                            background: bg,
                            color: color,
                            height: '52px',
                            padding: `0 ${isLast ? '24px' : '36px'} 0 ${isFirst ? '16px' : '32px'}`,
                            clipPath: isFirst 
                              ? 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)' 
                              : isLast 
                                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 16px 50%)'
                                : 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)',
                            marginLeft: isFirst ? '0' : '-4px', // Slight overlap to avoid white gaps, or we can use a white border trick
                            marginRight: '2px', // tiny gap
                            zIndex: dealStages.length - index,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'default',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div {...provided.dragHandleProps} style={{ color: color, opacity: 0.6, cursor: 'grab', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                            <GripVertical size={16} />
                          </div>
                          
                          <span style={{ whiteSpace: 'nowrap' }}>{info.name}</span>
                          
                          {info.type !== 'Normal' && (
                            <span style={{ 
                              background: badgeBg, 
                              color: color, 
                              fontSize: '0.65rem', 
                              padding: '2px 6px', 
                              borderRadius: '12px', 
                              marginLeft: '8px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {info.type}
                            </span>
                          )}

                          <div style={{
                            position: 'absolute',
                            right: isLast ? '12px' : '24px',
                            display: 'flex',
                            gap: '6px',
                            opacity: hoveredIndex === index ? 1 : 0,
                            transition: 'opacity 0.2s',
                            background: bg,
                            padding: '0 4px'
                          }}>
                            <button onClick={() => handleOpenDrawer(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, padding: '4px' }}>
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, padding: '4px' }}>
                              <X size={16} />
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
                {editingIndex !== null ? 'Edit Deal Stage' : 'Adding New Deal Stage'}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Stage Name</label>
                  <input 
                    required 
                    autoFocus
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Negotiation"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Stage Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  >
                    <option value="Normal">Normal Stage</option>
                    <option value="Won">Won Stage</option>
                    <option value="Lost">Lost Stage</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button type="button" onClick={() => { setFormData({ name: '', type: 'Normal' }); }} style={{ flex: 1, padding: '12px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#475569' }}>
                  Reset
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px 20px', border: 'none', background: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                  {editingIndex !== null ? 'Save / Submit' : 'Save / Submit'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
