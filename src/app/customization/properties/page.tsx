'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { CRMProperty } from '@/lib/data/systemData';
import { Search, Plus, ListOrdered, Edit2, Trash2, X, MoreVertical, SearchIcon, AlertCircle, GripVertical, Filter, ArrowUpDown, ChevronRight, UploadCloud, FileSpreadsheet, Check } from 'lucide-react';

export default function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty, reorderProperties } = useCRM();
  
  const showToast = (message: string, isError: boolean = false) => {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = isError ? '#ef4444' : '#10b981';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.fontWeight = '600';
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3000);
  };
  
  
    const [activeTab, setActiveTab] = useState<'All' | 'Contact' | 'Engagement' | 'User'>('All');
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Selection state
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // Column Filters state

  // Column Widths State
  const defaultWidths = {
    checkbox: 40,
    name: 180,
    relatedTo: 140,
    description: 220,
    type: 150,
    deleted: 110,
    multipleValues: 180,
    searchable: 130,
    isSystem: 150,
    createdAt: 160
  };
  
  const [colWidths, setColWidths] = useState(defaultWidths);
  
  useEffect(() => {
    const saved = localStorage.getItem('properties_column_widths');
    if (saved) {
      try {
        setColWidths(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const startResize = (colName: keyof typeof defaultWidths, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.pageX;
    const startWidth = colWidths[colName];
    
    const doDrag = (dragEvent: MouseEvent) => {
      let newWidth = startWidth + (dragEvent.pageX - startX);
      if (newWidth < defaultWidths[colName]) newWidth = defaultWidths[colName];
      
      setColWidths(prev => {
        const next = { ...prev, [colName]: newWidth };
        localStorage.setItem('properties_column_widths', JSON.stringify(next));
        return next;
      });
    };
    
    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const [colFilters, setColFilters] = useState({
    relatedTo: 'All',
    type: 'All',
    deleted: 'No',
    multiple: 'All',
    searchable: 'All',
    system: 'All'
  });

  const [sortConfig, setSortConfig] = useState<{key: keyof CRMProperty | 'none', direction: 'asc'|'desc'}>({key: 'displayOrder', direction: 'asc'});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Modals state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<CRMProperty | null>(null);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCascadingModalOpen, setIsCascadingModalOpen] = useState(false);
  const [isDisplayOrderModalOpen, setIsDisplayOrderModalOpen] = useState(false);
  const [reorderedProperties, setReorderedProperties] = useState<CRMProperty[]>([]);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<CRMProperty | null>(null);

  // Import Options Workflow
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1: Define, 2: Upload, 3: Map, 4: Import
  const [importData, setImportData] = useState({ name: '', file: null as File | null, rows: 0 });

  // Form State
  const initialFormState = {
    name: '',
    description: '',
    relatedTo: 'Contact',
    type: 'Text',
    multipleValues: false,
    searchable: false,
    options: [] as string[]
  };
  const [formData, setFormData] = useState(initialFormState);
  const [newOptionText, setNewOptionText] = useState('');

  const handleTabClick = (tab: 'All' | 'Contact' | 'Engagement' | 'User') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedProperties([]);
  };

  const handleSort = (key: keyof CRMProperty) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') setSortConfig({key, direction: 'desc'});
      else setSortConfig({key: 'displayOrder', direction: 'asc'}); // reset
    } else {
      setSortConfig({key, direction: 'asc'});
    }
  };

  const processedData = useMemo(() => {
    let data = [...properties];
    if (activeTab !== 'All') data = data.filter(p => p.relatedTo === activeTab);
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (colFilters.relatedTo !== 'All') data = data.filter(p => p.relatedTo === colFilters.relatedTo);
    if (colFilters.type !== 'All') data = data.filter(p => p.type === colFilters.type);
    if (colFilters.deleted === 'No') data = data.filter(p => !p.deleted);
    else if (colFilters.deleted === 'Yes') data = data.filter(p => p.deleted);
    if (colFilters.multiple !== 'All') data = data.filter(p => (p.multipleValues ? 'Yes' : 'No') === colFilters.multiple);
    if (colFilters.searchable !== 'All') data = data.filter(p => (p.searchable ? 'Yes' : 'No') === colFilters.searchable);
    if (colFilters.system !== 'All') data = data.filter(p => (p.isSystem ? 'System' : 'Custom') === colFilters.system);

    data.sort((a, b) => {
      if (sortConfig.key === 'none' || sortConfig.key === 'displayOrder') return a.displayOrder - b.displayOrder;
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [properties, activeTab, globalSearch, colFilters, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / itemsPerPage));
  const currentData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedProperties.length === currentData.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(currentData.map(p => p.id));
    }
  };

  const toggleSelectProperty = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedProperties(prev => [...prev, id]);
    }
  };

  const openNewModal = () => {
    setEditingProperty(null);
    setFormData(initialFormState);
    setIsPropertyModalOpen(true);
  };

  const openEditModal = (prop: CRMProperty) => {
    if (prop.isSystem) {
      showToast('System properties have restricted editing capabilities.', true);
    }
    setEditingProperty(prop);
    setFormData({
      name: prop.name,
      description: prop.description,
      relatedTo: prop.relatedTo,
      type: prop.type,
      multipleValues: prop.multipleValues,
      searchable: prop.searchable,
      options: prop.options ? [...prop.options] : []
    });
    setIsPropertyModalOpen(true);
  };

  const confirmDelete = (props: CRMProperty[]) => {
    const sysProps = props.filter(p => p.isSystem);
    if (sysProps.length > 0) {
      showToast(`Cannot delete system properties.`, true);
      if (props.length === 1) return;
    }
    const customProps = props.filter(p => !p.isSystem);
    if (customProps.length === 0) return;

    if (confirm(`Are you sure you want to delete ${customProps.length} custom property(ies)?`)) {
      customProps.forEach(p => deleteProperty(p.id));
      setSelectedProperties([]);
      showToast('Properties deleted successfully');
    }
  };

  const handleResetForm = () => {
    if (editingProperty) {
      setFormData({
        name: editingProperty.name,
        description: editingProperty.description,
        relatedTo: editingProperty.relatedTo,
        type: editingProperty.type,
        multipleValues: editingProperty.multipleValues,
        searchable: editingProperty.searchable,
        options: editingProperty.options ? [...editingProperty.options] : []
      });
    } else {
      setFormData(initialFormState);
    }
  };

  const handleSaveProperty = () => {
    if (!formData.name.trim()) {
      showToast('Property name is required', true);
      return;
    }

    const isSelectionType = ['Option', 'Multi-select'].includes(formData.type);

    if (editingProperty) {
      updateProperty({
        ...editingProperty,
        name: formData.name,
        description: formData.description,
        relatedTo: formData.relatedTo as any,
        type: formData.type as any,
        multipleValues: formData.multipleValues,
        searchable: formData.searchable,
        options: isSelectionType ? formData.options : undefined,
      });
      showToast('Property updated successfully');
    } else {
      const newProp: CRMProperty = {
        id: `PROP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: formData.name,
        description: formData.description,
        relatedTo: formData.relatedTo as any,
        type: formData.type as any,
        multipleValues: formData.multipleValues,
        searchable: formData.searchable,
        options: isSelectionType ? formData.options : undefined,
        isSystem: false,
        deleted: false,
        displayOrder: properties.length + 1,
        createdAt: new Date().toISOString()
      };
      addProperty(newProp);
      showToast('Property created successfully');
    }
    setIsPropertyModalOpen(false);
  };

  const addOption = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newOptionText.trim()) {
      setFormData(prev => ({ ...prev, options: [...prev.options, newOptionText.trim()] }));
      setNewOptionText('');
    }
  };

  const removeOption = (idx: number) => {
    setFormData(prev => ({
      ...prev, 
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  // Drag and Drop ordering
  const [orderItems, setOrderItems] = useState<CRMProperty[]>([]);
  const openOrderModal = () => {
    setOrderItems([...properties.filter(p => !p.deleted).sort((a,b) => a.displayOrder - b.displayOrder)]);
    setIsOrderModalOpen(true);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newItems = [...orderItems];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setOrderItems(newItems);
    } else if (direction === 'down' && index < orderItems.length - 1) {
      const newItems = [...orderItems];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      setOrderItems(newItems);
    }
  };

  const saveOrder = () => {
    const reordered = orderItems.map((item, index) => ({...item, displayOrder: index + 1}));
    const deletedItems = properties.filter(p => p.deleted);
    reorderProperties([...reordered, ...deletedItems]);
    setIsOrderModalOpen(false);
    showToast('Display order updated successfully');
  };

  const renderSortableHeader = (colKey: keyof typeof defaultWidths, label: string, sortKey: keyof CRMProperty | null, filterKey?: keyof typeof colFilters, filterOptions?: string[]) => {
    return (
      <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', position: 'relative', width: colWidths[colKey], minWidth: colWidths[colKey] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', paddingRight: '8px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: sortKey ? 'pointer' : 'default', userSelect: 'none', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            onClick={() => sortKey && handleSort(sortKey)}
          >
            {label}
            {sortKey && (
              <ArrowUpDown size={12} color={sortConfig.key === sortKey ? '#0284c7' : '#cbd5e1'} style={{ flexShrink: 0 }} />
            )}
          </div>
          {filterOptions && filterKey && (
            <select 
              value={colFilters[filterKey]} 
              onChange={(e) => {
                setColFilters(prev => ({...prev, [filterKey]: e.target.value}));
                setCurrentPage(1);
              }}
              style={{ fontSize: '0.7rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', flexShrink: 0 }}
            >
              <option value="All">All</option>
              {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}
        </div>
        <div 
          onMouseDown={(e) => startResize(colKey, e)}
          style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', cursor: 'col-resize', backgroundColor: 'transparent', zIndex: 10 }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#cbd5e1'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        />
      </th>
    );
  };

  // Cascading logic
  const [cascadeStep, setCascadeStep] = useState(1);
  const [selectedParentCascade, setSelectedParentCascade] = useState<CRMProperty | null>(null);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Properties</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Contact', 'Engagement', 'User'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab as any)}
                style={{
                  padding: '6px 16px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                  border: '1px solid', backgroundColor: activeTab === tab ? '#e0f2fe' : '#ffffff',
                  borderColor: activeTab === tab ? '#bae6fd' : '#e2e8f0', color: activeTab === tab ? '#0369a1' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                }}
              >
                {activeTab === tab && <div style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#0284c7'}}></div>}
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => { setCascadeStep(1); setSelectedParentCascade(null); setIsCascadingModalOpen(true); }}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            Cascading Properties
          </button>
          <button
            onClick={openOrderModal}
            style={{ padding: '8px 16px', backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#be185d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ListOrdered size={16} /> Display Order
          </button>
          <button
            onClick={openNewModal}
            style={{ padding: '8px 16px', backgroundColor: '#0284c7', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <Plus size={16} /> New Property
          </button>
        </div>
      </div>

      
      {/* Selected Action Bar */}
      {selectedProperties.length > 0 && (
        <div style={{ 
          backgroundColor: '#e0f2fe', padding: '12px 24px', 
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '16px', border: '1px solid #bae6fd'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0369a1' }}>
              {selectedProperties.length} property{selectedProperties.length > 1 ? 'ies' : ''} selected
            </span>
            <button onClick={() => setSelectedProperties([])} style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Clear Selection</button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                const p = properties.find(x => x.id === selectedProperties[0]);
                if (p) openEditModal(p);
              }} 
              disabled={selectedProperties.length > 1}
              style={{ 
                padding: '6px 16px', borderRadius: '6px', backgroundColor: '#ffffff', 
                border: '1px solid #cbd5e1', color: '#334155', cursor: selectedProperties.length > 1 ? 'not-allowed' : 'pointer',
                opacity: selectedProperties.length > 1 ? 0.5 : 1, fontWeight: 500, fontSize: '0.875rem'
              }}
            >
              Edit Property
            </button>
            <button 
              onClick={() => confirmDelete(properties.filter(p => selectedProperties.includes(p.id)))}
              style={{ 
                padding: '6px 16px', borderRadius: '6px', backgroundColor: '#ef4444', 
                border: 'none', color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem'
              }}
            >
              Delete Property
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <SearchIcon size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Search properties..." value={globalSearch} onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }} style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }} />
          </div>
          <button 
            onClick={() => {
              setColWidths(defaultWidths);
              localStorage.removeItem('properties_column_widths');
              showToast('Column widths reset successfully.');
            }}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}
          >
            Reset Column Widths
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', position: 'relative', width: colWidths.checkbox, minWidth: colWidths.checkbox }}>
                  <input type="checkbox" checked={selectedProperties.length === currentData.length && currentData.length > 0} onChange={toggleSelectAll} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <div 
                    onMouseDown={(e) => startResize('checkbox', e)}
                    style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', cursor: 'col-resize', backgroundColor: 'transparent', zIndex: 10 }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#cbd5e1'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                  />
                </th>
                {renderSortableHeader("name", "Property", "name")}
                {renderSortableHeader("relatedTo", "Related To", "relatedTo", "relatedTo", ["Contact", "Engagement", "User"])}
                {renderSortableHeader("description", "Description", "description")}
                {renderSortableHeader("type", "Type", "type", "type", ["Text", "Option", "Number", "Date", "Boolean"])}
                {renderSortableHeader("deleted", "Deleted?", "deleted", "deleted", ["Yes", "No"])}
                {renderSortableHeader("multipleValues", "Multiple Vals", "multipleValues", "multiple", ["Yes", "No"])}
                {renderSortableHeader("searchable", "Searchable", "searchable", "searchable", ["Yes", "No"])}
                {renderSortableHeader("isSystem", "System Property", "isSystem", "system", ["System", "Custom"])}
                {renderSortableHeader("createdAt", "Created At", "createdAt")}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((prop) => (
                <tr 
                  key={prop.id} 
                  style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.1s', opacity: prop.deleted ? 0.6 : 1, backgroundColor: selectedProperties.includes(prop.id) ? '#f1f5f9' : 'transparent' }} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedProperties.includes(prop.id) ? '#f1f5f9' : 'transparent'}
                >
                  <td style={{ padding: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={selectedProperties.includes(prop.id)} onChange={() => toggleSelectProperty(prop.id)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => toggleSelectProperty(prop.id)}>
                    {prop.name}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', fontSize:'0.75rem' }}>{prop.relatedTo}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.description}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.type}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.deleted ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.multipleValues ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.searchable ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.isSystem ? 'System' : 'Custom'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{new Date(prop.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No properties found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {processedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', fontSize: '0.875rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>First</button>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', fontSize: '0.875rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === totalPages || totalPages === 0 ? '#f8fafc' : '#fff', color: currentPage === totalPages || totalPages === 0 ? '#94a3b8' : '#334155', fontSize: '0.875rem', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === totalPages || totalPages === 0 ? '#f8fafc' : '#fff', color: currentPage === totalPages || totalPages === 0 ? '#94a3b8' : '#334155', fontSize: '0.875rem', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}>Last</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Property Modal */}
      {isPropertyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '800px', backgroundColor: '#ffffff', borderRadius: '12px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>{editingProperty ? 'Modifying Custom Property' : 'Modifying Custom Property'}</h2>
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Related To Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: '#334155', marginBottom: '12px' }}>What are you creating this custom property for?</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Contact', 'User', 'Engagement', 'Payment'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({...formData, relatedTo: opt})}
                      style={{
                        padding: '8px 16px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                        border: '1px solid', backgroundColor: formData.relatedTo === opt ? '#c7d2fe' : '#f1f5f9',
                        borderColor: formData.relatedTo === opt ? '#a5b4fc' : '#e2e8f0', color: formData.relatedTo === opt ? '#ffffff' : '#64748b',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                      }}
                    >
                      {formData.relatedTo === opt && <Check size={14} color="#ffffff" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Name Input */}
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Name of the property as visible to users*</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => { if (e.target.value.length <= 60) setFormData({...formData, name: e.target.value}) }}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #cbd5e1', fontSize: '1rem', padding: '4px 0', outline: 'none', color: '#0f172a' }} 
                />
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{formData.name.length}/60</div>
              </div>

              {/* Type of Value */}
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, color: '#334155', marginBottom: '12px' }}>What type of value this property will have?</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['Option', 'Text', 'Multi Line Text', 'Number', 'Phone Number', 'Whatsapp Number', 'Email Address', 'Website/URL', 'Date/Time'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({...formData, type: opt})}
                      style={{
                        padding: '8px 16px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                        border: '1px solid', backgroundColor: formData.type === opt ? '#c7d2fe' : '#f1f5f9',
                        borderColor: formData.type === opt ? '#a5b4fc' : '#e2e8f0', color: formData.type === opt ? '#ffffff' : '#64748b',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                      }}
                    >
                      {formData.type === opt && <Check size={14} color="#ffffff" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection Specific Options */}
              {['Option', 'Multi-select'].includes(formData.type) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Can have multiple values</span>
                    <button 
                      onClick={() => setFormData({...formData, multipleValues: !formData.multipleValues})}
                      style={{ width: '40px', height: '24px', borderRadius: '12px', backgroundColor: formData.multipleValues ? '#4f46e5' : '#cbd5e1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: formData.multipleValues ? '19px' : '3px', transition: 'left 0.2s' }} />
                    </button>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Need to add a larger list?</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Import a spreadsheet. Existing options will be preserved and moved into the new searchable list.</p>
                    </div>
                    <button onClick={() => setIsImportModalOpen(true)} style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileSpreadsheet size={16} /> Import more options
                    </button>
                  </div>

                  <div>
                    <input 
                      type="text" 
                      placeholder="Type an option and press Enter" 
                      value={newOptionText}
                      onChange={e => setNewOptionText(e.target.value)}
                      onKeyDown={addOption}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {formData.options.map((opt, i) => (
                        <div key={i} style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '999px', fontSize: '0.875rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {opt}
                          <button onClick={() => removeOption(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex' }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>Best for short lists that are easy to review at a glance.</p>
                </div>
              )}

              {/* Global Contact Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'auto' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Include in global contact search</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Matches on this field will appear when you search contacts. Up to 3 Contact properties can be searchable.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, searchable: !formData.searchable})}
                  style={{ width: '40px', height: '24px', borderRadius: '12px', backgroundColor: formData.searchable ? '#4f46e5' : '#cbd5e1', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: formData.searchable ? '19px' : '3px', transition: 'left 0.2s' }} />
                </button>
              </div>

            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button onClick={handleResetForm} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: '#334155' }}>Reset</button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsPropertyModalOpen(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', color: '#64748b' }}>Cancel</button>
                <button onClick={handleSaveProperty} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cascading Properties Modal */}
      {isCascadingModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '800px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Create Cascading Properties</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>Use this only for linked dropdowns such as State -&gt; City -&gt; Area.</p>
              </div>
              <button onClick={() => setIsCascadingModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[1,2,3].map(step => (
                  <div key={step} style={{ padding: '8px 16px', borderRadius: '999px', backgroundColor: cascadeStep === step ? '#e0f2fe' : '#f1f5f9', color: cascadeStep === step ? '#0369a1' : '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                    {step}. {step === 1 ? 'Choose Hierarchy' : step === 2 ? 'Name Properties' : 'Review & Create'}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              {cascadeStep === 1 && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '24px' }}>Standard option properties stay simple. Use this advanced flow only when one dropdown should filter the next.</p>
                  
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Reuse an existing cascading hierarchy</h3>
                  
                  <div 
                    onClick={() => {
                      const p = properties.find(x => x.name === 'Interested In?');
                      if (p) setSelectedParentCascade(p);
                    }}
                    style={{ padding: '20px', border: `1px solid ${selectedParentCascade?.name === 'Interested In?' ? '#4f46e5' : '#e2e8f0'}`, borderRadius: '8px', marginBottom: '24px', cursor: 'pointer', backgroundColor: selectedParentCascade?.name === 'Interested In?' ? '#eff6ff' : '#fff' }}
                  >
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Interested In?</h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>Currently used for Contact</p>
                  </div>

                  <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Import hierarchy from Excel</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>Create a new hierarchy from a spreadsheet, then create all linked properties together.</p>
                    </div>
                    <button onClick={() => { setIsCascadingModalOpen(false); setImportStep(1); setIsImportModalOpen(true); }} style={{ padding: '8px 16px', backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#4338ca', cursor: 'pointer' }}>Import Excel</button>
                  </div>
                </div>
              )}

              {cascadeStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Define Hierarchy Names</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Parent Property Name</label>
                      <input type="text" value={selectedParentCascade?.name || 'State'} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#e2e8f0' }} />
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Child Property Name*</label>
                      <input type="text" defaultValue="City" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }} />
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Nested Property Name (Optional)</label>
                      <input type="text" defaultValue="Area" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }} />
                    </div>
                  </div>
                </div>
              )}

              {cascadeStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Review & Create</h3>
                  <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', padding: '8px' }}>State</div>
                    <div style={{ color: '#94a3b8' }}>↓</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', padding: '8px' }}>City</div>
                    <div style={{ color: '#94a3b8' }}>↓</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', padding: '8px' }}>Area</div>
                    <p style={{ marginTop: '24px', fontSize: '0.875rem', color: '#64748b' }}>This will create 3 linked properties. Hierarchy configuration will be saved in the CRM.</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => { if (cascadeStep > 1) setCascadeStep(cascadeStep - 1); else setIsCascadingModalOpen(false); }} style={{ padding: '10px 20px', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', cursor: 'pointer' }}>{cascadeStep > 1 ? 'Back' : 'Cancel'}</button>
              
              <button 
                onClick={() => {
                  if (cascadeStep < 3) setCascadeStep(cascadeStep + 1);
                  else {
                    showToast('Cascading properties successfully created and linked in the CRM.');
                    setIsCascadingModalOpen(false);
                  }
                }} 
                disabled={cascadeStep === 1 && !selectedParentCascade}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: cascadeStep === 1 && !selectedParentCascade ? '#e2e8f0' : '#4f46e5', color: cascadeStep === 1 && !selectedParentCascade ? '#94a3b8' : '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: cascadeStep === 1 && !selectedParentCascade ? 'not-allowed' : 'pointer' }}
              >
                {cascadeStep < 3 ? 'Continue' : 'Create Cascading Properties'}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Import Options Workflow Modal */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 110, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '900px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Import Hierarchy Options</h2>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>
                {[
                  {num:1, label:'Define'}, {num:2, label:'Upload'}, {num:3, label:'Map Columns'}, {num:4, label:'Import'}
                ].map(step => (
                  <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, backgroundColor: '#fff', padding: '0 8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '12px', backgroundColor: importStep >= step.num ? '#4f46e5' : '#e2e8f0', color: importStep >= step.num ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>{step.num}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: importStep >= step.num ? '#0f172a' : '#94a3b8' }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
              {importStep === 1 && (
                <div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Option Set Name*</label>
                    <input type="text" value={importData.name} onChange={e => setImportData({...importData, name: e.target.value})} placeholder="e.g. Regions and Cities" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #cbd5e1', fontSize: '1rem', padding: '8px 0', outline: 'none', color: '#0f172a' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '24px' }}>Upload an Excel/CSV file and hierarchy levels will be detected from the column headers.</p>
                  <button style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Edit2 size={16} /> Define levels manually
                  </button>
                </div>
              )}
              
              {importStep === 2 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                    <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Click to upload or drag and drop</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Excel or CSV file (Max 10MB)</p>
                    <input type="file" accept=".csv, .xlsx, .xls" style={{ display: 'none' }} id="import-upload" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImportData({...importData, file: e.target.files[0], rows: 1245 });
                        showToast('File analyzed successfully.');
                      }
                    }} />
                    <label htmlFor="import-upload" style={{ display: 'inline-block', marginTop: '24px', padding: '8px 24px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Browse Files</label>
                  </div>
                  {importData.file && (
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e40af' }}>{importData.file.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '4px' }}>Detected {importData.rows} rows and 3 columns</p>
                    </div>
                  )}
                </div>
              )}

              
                {importStep === 3 && (
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Map Columns</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>Please map the columns from your file to the CRM properties.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>File Column</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>CRM Property</div>
                    </div>
                    {['lead_name', 'email'].map((col, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px', alignItems: 'center' }}>
                        <div style={{ padding: '10px 12px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', color: '#475569' }}>
                          {col}
                        </div>
                        <select 
                          style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                          defaultValue={
                            col.toLowerCase().includes('name') ? 'name' : 
                            col.toLowerCase().includes('email') ? 'email' : 
                            (col.toLowerCase().includes('phone') || col.toLowerCase().includes('mobile')) ? 'phone' : 
                            ''
                          }
                        >
                          <option value="">Unmapped</option>
                          <option value="name">Lead Name</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="option">Dropdown Option Value</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              <button 
                onClick={() => {
                  if (importStep < 4) {
                    setImportStep(s => (s + 1) as any);
                  } else {
                    showToast('Import completed successfully.');
                    setIsImportModalOpen(false);
                    setImportStep(1);
                  }
                }} 
                disabled={(importStep === 1 && !importData.name.trim()) || (importStep === 2 && !importData.file)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: ((importStep === 1 && !importData.name.trim()) || (importStep === 2 && !importData.file)) ? '#e2e8f0' : '#4f46e5', color: ((importStep === 1 && !importData.name.trim()) || (importStep === 2 && !importData.file)) ? '#94a3b8' : '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: ((importStep === 1 && !importData.name.trim()) || (importStep === 2 && !importData.file)) ? 'not-allowed' : 'pointer' }}
              >
                {importStep === 4 ? 'Import' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal remains the same */}
            {isOrderModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 110, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '400px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Display Order</h2>
              <button onClick={() => setIsOrderModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>Drag and drop to reorder properties.</p>
              {orderItems.map((item, index) => (
                <div key={item.id} style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ArrowUpDown size={16} color="#94a3b8" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} style={{ padding: '6px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>▲</button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === orderItems.length - 1} style={{ padding: '6px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: index === orderItems.length - 1 ? 'not-allowed' : 'pointer' }}>▼</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsOrderModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveOrder} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#be185d', color: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Save Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}