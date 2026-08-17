'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, Plus, X, MoreVertical, LayoutGrid, Download, Printer, Share2, Expand, GripHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ChartLibraryModal } from '../modals/ChartLibraryModal';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function AdminDashboardCustom() {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const handleSaveChart = (chart: any) => {
    setWidgets([...widgets, { ...chart, width: 2 }]); // Default to half width
    setIsLibraryOpen(false);
    showToast(`Added ${chart.title} to dashboard!`);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setMenuOpenId(null);
    showToast('Widget removed.');
  };

  const toggleWidth = (id: string) => {
    setWidgets(widgets.map(w => {
      if (w.id === id) {
        return { ...w, width: w.width === 2 ? 4 : 2 }; // Toggle between half (2) and full (4) width
      }
      return w;
    }));
    setMenuOpenId(null);
  };

  const duplicateWidget = (widget: any) => {
    setWidgets([...widgets, { ...widget, id: `custom-${Date.now()}` }]);
    setMenuOpenId(null);
    showToast('Widget duplicated.');
  };

  const mockExport = (format: string) => {
    setMenuOpenId(null);
    showToast(`Exporting as ${format}...`);
  };

  const renderChart = (widget: any) => {
    const data = widget.data;
    switch (widget.chartType) {
      case 'Line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="value1" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Area type="monotone" dataKey="value1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'Pie':
      case 'Doughnut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{name: 'A', value: 400}, {name: 'B', value: 300}, {name: 'C', value: 300}, {name: 'D', value: 200}]}
                cx="50%"
                cy="50%"
                innerRadius={widget.chartType === 'Doughnut' ? 50 : 0}
                outerRadius={80}
                dataKey="value"
              >
                {PIE_COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'Radar':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Radar Chart Preview
          </div>
        );
      case 'Bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Bar dataKey="value1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value2" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Custom Dashboard Builder</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create your own reports, KPI dashboards and analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" onClick={() => setIsLibraryOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={16} /> Chart Library
          </button>
          <button className="secondary-btn" onClick={() => mockExport('PDF')}><Download size={16} /> Export</button>
          <button className="secondary-btn" onClick={() => showToast('Refreshing dashboard...')}><RefreshCw size={16} /> Refresh</button>
          <button className="primary-btn" onClick={() => showToast('Dashboard saved successfully!')}><Save size={16} /> Save Dashboard</button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', minHeight: '400px', alignItems: 'flex-start' }}
            >
              {widgets.length === 0 ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '64px', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                  <LayoutGrid size={48} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>No charts yet</h3>
                  <p style={{ marginBottom: '24px' }}>Use the Chart Library to add visualizations to this dashboard.</p>
                  <button className="primary-btn" onClick={() => setIsLibraryOpen(true)} style={{ margin: '0 auto' }}>
                    Browse Chart Library
                  </button>
                </div>
              ) : (
                widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="glass-panel"
                        style={{
                          ...provided.draggableProps.style,
                          width: widget.width === 4 ? '100%' : 'calc(50% - 12px)',
                          height: '400px',
                          display: 'flex',
                          flexDirection: 'column',
                          background: snapshot.isDragging ? 'var(--bg-primary)' : 'var(--bg-card)',
                          zIndex: snapshot.isDragging ? 50 : 1,
                          boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.2)' : undefined
                        }}
                      >
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>
                              <GripHorizontal size={16} />
                            </div>
                            <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{widget.title}</h3>
                          </div>
                          
                          <div style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setMenuOpenId(menuOpenId === widget.id ? null : widget.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {/* Three Dot Menu Dropdown */}
                            <AnimatePresence>
                              {menuOpenId === widget.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                    background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                                    borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                    minWidth: '200px', zIndex: 100, overflow: 'hidden'
                                  }}
                                >
                                  <div style={{ padding: '4px' }}>
                                    <button onClick={() => showToast('Viewing widget...')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Expand size={14} /> View</button>
                                    <button onClick={() => toggleWidth(widget.id)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><LayoutGrid size={14} /> Resize</button>
                                    <button onClick={() => duplicateWidget(widget)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Plus size={14} /> Duplicate</button>
                                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                                    <button onClick={() => mockExport('PDF')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Download size={14} /> Download PDF</button>
                                    <button onClick={() => mockExport('Excel')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Download size={14} /> Export Excel</button>
                                    <button onClick={() => mockExport('CSV')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Download size={14} /> Export CSV</button>
                                    <button onClick={() => mockExport('Print')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Printer size={14} /> Print</button>
                                    <button onClick={() => showToast('Share link copied!')} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Share2 size={14} /> Share</button>
                                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                                    <button onClick={() => removeWidget(widget.id)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><X size={14} /> Delete</button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div style={{ flex: 1, padding: '24px' }}>
                          {renderChart(widget)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isLibraryOpen && (
        <ChartLibraryModal 
          onClose={() => setIsLibraryOpen(false)} 
          onSaveChart={handleSaveChart}
        />
      )}
    </div>
  );
}
