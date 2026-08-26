'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LayoutGrid, Download, RefreshCw, Save, MoreVertical, Expand, Plus, Printer, Share2, X, GripHorizontal, ChevronDown, CheckCircle, PieChart as PieChartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChartLibraryModal } from '../modals/ChartLibraryModal';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useCRM } from '@/contexts/CRMContext';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const reportOptions = ['Dashboard', 'Leads Report', 'Deal Report', 'Active Metrics'];

export function AdminDashboardCustom() {
  const { leads, calls, deals, users } = useCRM();

  const [widgets, setWidgets] = useState<any[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  const [reportType, setReportType] = useState('Dashboard');
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  
  const [layoutMode, setLayoutMode] = useState(false);
  const [viewMode, setViewMode] = useState('Grid');

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowReportDropdown(false);
      }
    }
    if (showReportDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReportDropdown]);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`crm_custom_dashboard_${reportType}`);
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        setWidgets(getDefaultWidgets(reportType));
      }
    } else {
      setWidgets(getDefaultWidgets(reportType));
    }
  }, [reportType]);

  const getDefaultWidgets = (type: string) => {
    switch (type) {
      case 'Leads Report':
        return [
          { id: 'lead-1', title: 'Lead Status Overview', chartType: 'Bar', width: 2 },
          { id: 'lead-2', title: 'Lead Sources', chartType: 'Pie', width: 2 }
        ];
      case 'Deal Report':
        return [
          { id: 'deal-1', title: 'Deal Pipeline Stages', chartType: 'Bar', width: 4 },
          { id: 'deal-2', title: 'Revenue vs Expected', chartType: 'Area', width: 2 }
        ];
      case 'Active Metrics':
        return [
          { id: 'metrics-1', title: 'Call Outcomes', chartType: 'Pie', width: 2 },
          { id: 'metrics-2', title: 'User Activities', chartType: 'Bar', width: 2 }
        ];
      case 'Dashboard':
      default:
        return [
          { id: 'dash-1', title: 'Overall Lead Growth', chartType: 'Line', width: 4 }
        ];
    }
  };

  const getDynamicData = (widgetTitle: string) => {
    if (reportType === 'Leads Report') {
      if (widgetTitle.includes('Status')) {
        const total = leads.length;
        const inquiry = leads.filter(l => (l.stage||'').toLowerCase().includes('inquiry')).length;
        const closed = leads.filter(l => (l.stage||'').toLowerCase().includes('closed')).length;
        return [
          { name: 'Total Leads', value1: total },
          { name: 'New Inquiry', value1: inquiry },
          { name: 'Closed', value1: closed }
        ];
      }
      if (widgetTitle.includes('Source')) {
        const sourceMap: any = {};
        leads.forEach(l => {
          const s = l.source || 'Unknown';
          sourceMap[s] = (sourceMap[s] || 0) + 1;
        });
        return Object.keys(sourceMap).map(k => ({ name: k, value: sourceMap[k] }));
      }
    }
    
    if (reportType === 'Deal Report') {
      if (widgetTitle.includes('Pipeline')) {
        return [
          { name: 'Prospecting', value1: deals.filter(d => d.stage === 'Prospecting').length },
          { name: 'Negotiation', value1: deals.filter(d => d.stage === 'Negotiation').length },
          { name: 'Closed Won', value1: deals.filter(d => d.stage === 'Closed Won').length },
          { name: 'Closed Lost', value1: deals.filter(d => d.stage === 'Closed Lost').length }
        ];
      }
      if (widgetTitle.includes('Revenue')) {
        return [
          { name: 'Q1', value1: 40000 },
          { name: 'Q2', value1: 85000 },
          { name: 'Q3', value1: deals.reduce((acc, d) => acc + (d.stage === 'Closed Won' ? (d.amount||0) : 0), 0) },
        ];
      }
    }

    if (reportType === 'Active Metrics') {
      if (widgetTitle.includes('Outcome')) {
        const outMap: any = {};
        calls.forEach(c => {
          const out = c.outcome || 'Unknown';
          outMap[out] = (outMap[out] || 0) + 1;
        });
        return Object.keys(outMap).map(k => ({ name: k, value: outMap[k] }));
      }
      if (widgetTitle.includes('Activities')) {
        return [
          { name: 'Calls Made', value1: calls.length },
          { name: 'Deals Closed', value1: deals.filter(d => d.stage === 'Closed Won').length }
        ];
      }
    }

    // Default Fallback
    return [
      { name: 'Metric A', value1: 10, value: 10 },
      { name: 'Metric B', value1: 25, value: 25 },
      { name: 'Metric C', value1: leads.length, value: leads.length }
    ];
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const handleSaveChart = (chart: any) => {
    setWidgets([...widgets, { ...chart, width: 2 }]);
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
        return { ...w, width: w.width === 2 ? 4 : 2 };
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

  const mockExport = () => {
    const csvRows = [];
    csvRows.push(['Widget Name', 'Metric', 'Value']);
    widgets.forEach(w => {
      const wData = getDynamicData(w.title);
      wData.forEach((d: any) => {
        csvRows.push([w.title, d.name, d.value1 || d.value || 0]);
      });
    });
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Custom_Export_${reportType.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpenId(null);
    showToast(`Exported ${reportType} as CSV`);
  };

  const saveDashboard = () => {
    localStorage.setItem(`crm_custom_dashboard_${reportType}`, JSON.stringify(widgets));
    showToast('Dashboard configuration saved successfully!');
  };

  const refreshDashboard = () => {
    setWidgets(getDefaultWidgets(reportType));
    showToast(`${reportType} data refreshed.`);
  };

  const renderChart = (widget: any) => {
    const data = getDynamicData(widget.title);
    switch (widget.chartType) {
      case 'Line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data as any}>
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
            <AreaChart data={data as any}>
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
                data={data as any}
                cx="50%"
                cy="50%"
                innerRadius={widget.chartType === 'Doughnut' ? 50 : 0}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'Bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data as any}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }} />
              <Bar dataKey="value1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Dropdown for Report Type */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              className="primary-btn" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReportDropdown(!showReportDropdown); }} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <PieChartIcon size={16} /> {reportType} <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {showReportDropdown && (
                <motion.div 
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    marginTop: '8px', 
                    width: '240px', 
                    padding: '8px', 
                    zIndex: 9999, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px', 
                    background: '#ffffff', 
                    borderRadius: '8px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                    {reportOptions.map(opt => (
                      <button 
                        type="button"
                        key={opt} 
                        onClick={(e) => { 
                          e.preventDefault(); e.stopPropagation(); 
                          setReportType(opt); 
                          setShowReportDropdown(false); 
                        }} 
                        style={{ padding: '8px 12px', textAlign: 'left', background: reportType === opt ? 'var(--primary-color)' : 'transparent', color: reportType === opt ? 'white' : '#333333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" className="secondary-btn" onClick={() => setIsLibraryOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={16} /> Chart Library
          </button>
          
          <button type="button" className="secondary-btn" onClick={() => setViewMode(viewMode === 'Grid' ? 'List' : 'Grid')}>
            View: {viewMode}
          </button>
          
          <button type="button" className="secondary-btn" onClick={() => setLayoutMode(!layoutMode)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: layoutMode ? 'var(--primary-color)' : 'var(--bg-secondary)', color: layoutMode ? 'white' : 'var(--text-primary)' }}>
            Layout Mode: {layoutMode ? 'ON' : 'OFF'}
          </button>

          <button type="button" className="secondary-btn" onClick={mockExport}><Download size={16} /> Export</button>
          <button type="button" className="secondary-btn" onClick={refreshDashboard}><RefreshCw size={16} /> Refresh</button>
          <button type="button" className="primary-btn" onClick={saveDashboard}><Save size={16} /> Save Dashboard</button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal" isDropDisabled={!layoutMode}>
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', minHeight: '400px', alignItems: 'flex-start', flexDirection: viewMode === 'List' ? 'column' : 'row' }}
            >
              {widgets.length === 0 ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '64px', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                  <LayoutGrid size={48} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>No charts yet</h3>
                  <p style={{ marginBottom: '24px' }}>Use the Chart Library to add visualizations to this dashboard.</p>
                  <button type="button" className="primary-btn" onClick={() => setIsLibraryOpen(true)} style={{ margin: '0 auto' }}>
                    Browse Chart Library
                  </button>
                </div>
              ) : (
                widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!layoutMode}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="glass-panel"
                        style={{
                          ...provided.draggableProps.style,
                          width: viewMode === 'List' ? '100%' : (widget.width === 4 ? '100%' : 'calc(50% - 12px)'),
                          height: '400px',
                          display: 'flex',
                          flexDirection: 'column',
                          background: snapshot.isDragging ? 'var(--bg-primary)' : 'var(--bg-card)',
                          zIndex: snapshot.isDragging ? 50 : 1,
                          boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.2)' : undefined,
                          opacity: (!layoutMode && snapshot.isDragging) ? 1 : 1
                        }}
                      >
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {layoutMode && (
                              <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>
                                <GripHorizontal size={16} />
                              </div>
                            )}
                            <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{widget.title}</h3>
                          </div>
                          
                          <div style={{ position: 'relative' }}>
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpenId(menuOpenId === widget.id ? null : widget.id); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            <AnimatePresence>
                              {menuOpenId === widget.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                    background: '#ffffff', border: '1px solid var(--glass-border)',
                                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    minWidth: '200px', zIndex: 100, overflow: 'hidden'
                                  }}
                                >
                                  <div style={{ padding: '4px' }}>
                                    <button type="button" onClick={() => toggleWidth(widget.id)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: '#333333', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><LayoutGrid size={14} /> Resize</button>
                                    <button type="button" onClick={() => duplicateWidget(widget)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: '#333333', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Plus size={14} /> Duplicate</button>
                                    <button type="button" onClick={mockExport} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: '#333333', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><Download size={14} /> Export Data</button>
                                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                                    <button type="button" onClick={() => removeWidget(widget.id)} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}><X size={14} /> Delete</button>
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
