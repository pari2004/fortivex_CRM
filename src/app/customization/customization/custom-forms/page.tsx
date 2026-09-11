'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Copy, Trash2, Eye, GripVertical, Settings, FileText, ChevronRight, X, Layout, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCRM, CustomForm, CustomFormField } from '@/contexts/CRMContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function CustomFormsPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { customForms, updateCustomForms } = useCRM();
  
  const [view, setView] = useState<'list' | 'builder' | 'preview'>('list');
  const [activeForm, setActiveForm] = useState<CustomForm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Inactive'>('All');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredForms = customForms.filter(f => {
    if (statusFilter !== 'All' && f.status !== statusFilter) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateNew = () => {
    setActiveForm({
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Custom Form',
      description: '',
      module: 'Leads',
      status: 'Draft',
      fields: [],
      createdBy: 'Admin',
      lastUpdated: new Date().toISOString(),
      settings: {
        allowDuplicateSubmission: false,
        requireLogin: false,
        successMessage: 'Form submitted successfully.',
        redirectAfterSubmission: '',
        emailNotification: '',
        assignSubmissionTo: 'Abhay',
        createLeadAutomatically: true,
        createTaskAutomatically: false,
        addTagsAutomatically: []
      }
    });
    setView('builder');
  };

  const handleEdit = (form: CustomForm) => {
    setActiveForm(JSON.parse(JSON.stringify(form)));
    setView('builder');
  };

  const handleDuplicate = (form: CustomForm) => {
    const newForm = {
      ...JSON.parse(JSON.stringify(form)),
      id: Math.random().toString(36).substr(2, 9),
      name: `${form.name} - Copy`,
      status: 'Draft',
      lastUpdated: new Date().toISOString()
    };
    updateCustomForms([newForm, ...customForms]);
    showToast('Form duplicated successfully');
  };

  const handleDelete = (id: string) => {
    updateCustomForms(customForms.filter(f => f.id !== id));
    setShowDeleteConfirm(null);
    showToast('Form deleted');
  };

  const toggleStatus = (form: CustomForm) => {
    const updated = { ...form, status: form.status === 'Active' ? 'Inactive' : 'Active' as any };
    updateCustomForms(customForms.map(f => f.id === form.id ? updated : f));
    showToast(`Form marked as ${updated.status}`);
  };

  const saveForm = (formToSave: CustomForm, newStatus?: 'Active' | 'Draft' | 'Inactive') => {
    const finalForm = { ...formToSave, lastUpdated: new Date().toISOString() };
    if (newStatus) finalForm.status = newStatus;

    const exists = customForms.find(f => f.id === finalForm.id);
    if (exists) {
      updateCustomForms(customForms.map(f => f.id === finalForm.id ? finalForm : f));
    } else {
      updateCustomForms([finalForm, ...customForms]);
    }
    
    setView('list');
    showToast(`Form saved as ${finalForm.status}`);
  };

  // ==========================================
  // LIST VIEW
  // ==========================================
  if (view === 'list') {
    return (
      <div style={{ 
        padding: hideHeader ? '16px 24px' : '24px', 
        width: '100%', 
        maxWidth: hideHeader ? '100%' : '1400px', 
        margin: '0 auto', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}>
        
        {/* Header */}
        {!hideHeader && (
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Custom Forms</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Create and manage forms to collect the information your team needs from leads, applications, students, and other CRM records.</p>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 auto' }}>
            <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search forms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', flexWrap: 'wrap', gap: '4px' }}>
              {['All', 'Active', 'Draft', 'Inactive'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: statusFilter === status ? 'white' : 'transparent',
                    color: statusFilter === status ? '#0f172a' : '#64748b',
                    fontWeight: statusFilter === status ? 600 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: statusFilter === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleCreateNew}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={18} />
            Create Custom Form
          </button>
        </div>

        {/* Table Container with Horizontal Scrolling */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', width: '100%', display: 'block' }}>
          <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Form Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Module</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Fields</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Created By</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Last Updated</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredForms.length > 0 ? filteredForms.map((form, idx) => (
                <tr key={form.id} style={{ borderBottom: idx === filteredForms.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layout size={18} color="#8b5cf6" />
                      </div>
                      <div>
                        {form.name}
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>{form.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500 }}>
                      {form.module}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: form.status === 'Active' ? '#dcfce7' : form.status === 'Draft' ? '#fef9c3' : '#f1f5f9',
                      color: form.status === 'Active' ? '#166534' : form.status === 'Draft' ? '#854d0e' : '#475569'
                    }}>
                      {form.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                    {form.fields.length}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                    {form.createdBy}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                    {new Date(form.lastUpdated).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => { setActiveForm(form); setView('preview'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748b', borderRadius: '6px' }} title="Preview" onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Eye size={16} /></button>
                      <button onClick={() => handleEdit(form)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#3b82f6', borderRadius: '6px' }} title="Edit" onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Edit2 size={16} /></button>
                      <button onClick={() => handleDuplicate(form)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748b', borderRadius: '6px' }} title="Duplicate" onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Copy size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(form.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', borderRadius: '6px' }} title="Delete" onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <FileText size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>No custom forms found</h3>
                    <p style={{ margin: 0 }}>Try adjusting your filters or create a new form.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#0f172a' }}>Delete Custom Form?</h3>
                <p style={{ color: '#475569', margin: '0 0 24px 0', fontSize: '0.95rem' }}>
                  Are you sure you want to delete "<b>{customForms.find(f => f.id === showDeleteConfirm)?.name}</b>"? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowDeleteConfirm(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10000 }}
            >
              <CheckCircle2 size={18} /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  // ==========================================
  // BUILDER / PREVIEW VIEW
  // ==========================================
  if (view === 'builder' || view === 'preview') {
    return (
      <FormBuilder 
        form={activeForm!} 
        onSave={(f, status) => saveForm(f, status)}
        onCancel={() => setView('list')}
        initialMode={view}
        hideHeader={hideHeader}
      />
    );
  }

  return null;
}

// -------------------------------------------------------------
// Form Builder Component
// -------------------------------------------------------------

function FormBuilder({ form: initialForm, onSave, onCancel, initialMode, hideHeader = false }: { form: CustomForm, onSave: (f: CustomForm, status?: any) => void, onCancel: () => void, initialMode: 'builder' | 'preview', hideHeader?: boolean }) {
  const [form, setForm] = useState<CustomForm>(initialForm);
  const [activeTab, setActiveTab] = useState<'fields' | 'settings'>('fields');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const AVAILABLE_MODULES = ['Leads', 'Applications', 'Students', 'Tasks', 'Engagements', 'Opportunities', 'Users'];
  const FIELD_TYPES = ['Text', 'Long Text', 'Number', 'Email', 'Phone', 'Date', 'Date & Time', 'Dropdown', 'Multi Select', 'Checkbox', 'Radio Button', 'File Upload', 'Address', 'State', 'City', 'Area', 'Tags'];

  const addField = (type: any) => {
    const newField: CustomFormField = {
      id: 'field_' + Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type} Field`,
      name: `field_${Math.random().toString(36).substr(2, 5)}`,
      required: false,
      order: form.fields.length + 1,
      options: ['Dropdown', 'Multi Select', 'Radio Button'].includes(type) ? ['Option 1', 'Option 2'] : undefined
    };
    setForm({ ...form, fields: [...form.fields, newField] });
    setEditingFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<CustomFormField>) => {
    setForm({
      ...form,
      fields: form.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeField = (id: string) => {
    setForm({
      ...form,
      fields: form.fields.filter(f => f.id !== id)
    });
    if (editingFieldId === id) setEditingFieldId(null);
  };

  const duplicateField = (id: string) => {
    const fieldToCopy = form.fields.find(f => f.id === id);
    if (!fieldToCopy) return;
    
    const newField = {
      ...JSON.parse(JSON.stringify(fieldToCopy)),
      id: 'field_' + Math.random().toString(36).substr(2, 9),
      label: `${fieldToCopy.label} (Copy)`,
      name: `${fieldToCopy.name}_copy`,
      order: form.fields.length + 1
    };
    
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(form.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const reorderedFields = items.map((item, index) => ({ ...item, order: index + 1 }));
    setForm({ ...form, fields: reorderedFields });
  };

  if (initialMode === 'preview') {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Forms
        </button>
        
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', color: '#0f172a' }}>{form.name}</h1>
          {form.description && <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>{form.description}</p>}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {form.fields.map(field => (
              <div key={field.id}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                
                {['Text', 'Email', 'Phone', 'Number', 'Date', 'Date & Time', 'Address', 'State', 'City', 'Area'].includes(field.type) && (
                  <input type={field.type === 'Number' ? 'number' : field.type === 'Date' ? 'date' : field.type === 'Date & Time' ? 'datetime-local' : 'text'} placeholder={field.placeholder} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                )}
                
                {field.type === 'Long Text' && (
                  <textarea placeholder={field.placeholder} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                )}

                {field.type === 'Dropdown' && (
                  <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box', backgroundColor: 'white' }}>
                    <option value="">Select...</option>
                    {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>
                )}

                {field.type === 'Radio Button' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {field.options?.map((opt, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#334155' }}>
                        <input type="radio" name={field.name} /> {opt}
                      </label>
                    ))}
                  </div>
                )}
                
                {field.type === 'Checkbox' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#334155' }}>
                    <input type="checkbox" /> Yes, I agree
                  </label>
                )}
                
                {field.type === 'File Upload' && (
                  <div style={{ border: '1px dashed #cbd5e1', padding: '24px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8fafc', color: '#64748b' }}>
                    Click to upload file
                  </div>
                )}

                {field.helpText && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>{field.helpText}</div>}
              </div>
            ))}
          </div>

          <button style={{ marginTop: '32px', width: '100%', padding: '14px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      height: hideHeader ? '65vh' : 'calc(100vh - 100px)', 
      minHeight: '600px', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderTop: hideHeader ? '1px solid #e2e8f0' : 'none',
      borderBottom: hideHeader ? '1px solid #e2e8f0' : 'none'
    }}>
      
      {/* LEFT PANEL */}
      <div style={{ flex: '1 1 350px', maxWidth: '450px', minWidth: '300px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('fields')}
            style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'fields' ? '2px solid #8b5cf6' : '2px solid transparent', color: activeTab === 'fields' ? '#8b5cf6' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Form Fields
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'settings' ? '2px solid #8b5cf6' : '2px solid transparent', color: activeTab === 'settings' ? '#8b5cf6' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Form Settings
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'settings' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Form Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Form Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Module</label>
                <select value={form.module} onChange={e => setForm({...form, module: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white', fontSize: '0.9rem' }}>
                  {AVAILABLE_MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }}></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.settings.allowDuplicateSubmission} onChange={e => setForm({...form, settings: {...form.settings, allowDuplicateSubmission: e.target.checked}})} />
                Allow Duplicate Submission
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.settings.requireLogin} onChange={e => setForm({...form, settings: {...form.settings, requireLogin: e.target.checked}})} />
                Require Login to Submit
              </label>
              
              {form.module === 'Leads' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.settings.createLeadAutomatically} onChange={e => setForm({...form, settings: {...form.settings, createLeadAutomatically: e.target.checked}})} />
                  Create Lead Automatically
                </label>
              )}
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Success Message</label>
                <input type="text" value={form.settings.successMessage} onChange={e => setForm({...form, settings: {...form.settings, successMessage: e.target.value}})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
              </div>
            </div>
          ) : (
            <div>
              {/* Field Editor */}
              {editingFieldId ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <button onClick={() => setEditingFieldId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}><ArrowLeft size={16} /></button>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Edit Field</h3>
                  </div>
                  
                  {(() => {
                    const field = form.fields.find(f => f.id === editingFieldId);
                    if (!field) return null;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Field Label</label>
                          <input type="text" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Field Name (API Key)</label>
                          <input type="text" value={field.name} onChange={e => updateField(field.id, { name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Placeholder text</label>
                          <input type="text" value={field.placeholder || ''} onChange={e => updateField(field.id, { placeholder: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '0.9rem' }} />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#334155', cursor: 'pointer' }}>
                          <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} />
                          Required Field
                        </label>
                        
                        {/* Options editor for Dropdown/Radio */}
                        {['Dropdown', 'Multi Select', 'Radio Button'].includes(field.type) && (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Options (One per line)</label>
                            <textarea 
                              value={field.options?.join('\n') || ''} 
                              onChange={e => updateField(field.id, { options: e.target.value.split('\n') })}
                              rows={6} 
                              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }} 
                            />
                          </div>
                        )}
                        
                        <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }}></div>
                        <button onClick={() => removeField(field.id)} style={{ width: '100%', padding: '12px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s' }}>
                          <Trash2 size={16} /> Delete Field
                        </button>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#0f172a' }}>Add New Field</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {FIELD_TYPES.map(type => (
                      <button 
                        key={type}
                        onClick={() => addField(type)}
                        style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '20px', backgroundColor: 'white', color: '#475569', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.15s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        + {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - LIVE PREVIEW */}
      <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Top bar */}
        <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>Form Builder</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Cancel
            </button>
            <button onClick={() => onSave(form, 'Draft')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #8b5cf6', backgroundColor: 'white', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Save Draft
            </button>
            <button onClick={() => onSave(form, 'Active')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)', transition: 'all 0.2s' }}>
              Save & Activate
            </button>
          </div>
        </div>

        {/* Builder Canvas */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#f1f5f9' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '32px' }}>
            
            <div style={{ marginBottom: '32px', borderBottom: '2px solid #f1f5f9', paddingBottom: '24px' }}>
              <h1 style={{ margin: '0 0 12px 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 800 }}>{form.name}</h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>{form.description || 'Add a description in settings'}</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    style={{ 
                      minHeight: '250px',
                      backgroundColor: snapshot.isDraggingOver ? '#f8fafc' : 'transparent',
                      borderRadius: '12px',
                      padding: snapshot.isDraggingOver ? '12px' : '0',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {form.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            onClick={() => { setEditingFieldId(field.id); setActiveTab('fields'); }}
                            style={{
                              ...provided.draggableProps.style,
                              padding: '16px',
                              marginBottom: '16px',
                              backgroundColor: snapshot.isDragging ? '#ffffff' : editingFieldId === field.id ? '#f5f3ff' : 'white',
                              border: `1px solid ${editingFieldId === field.id ? '#8b5cf6' : '#e2e8f0'}`,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px',
                              boxShadow: snapshot.isDragging ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' : editingFieldId === field.id ? '0 0 0 1px #8b5cf6' : '0 1px 3px rgba(0,0,0,0.05)',
                              transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
                              opacity: snapshot.isDragging ? 0.9 : 1,
                              transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} scale(1.02)` : provided.draggableProps.style?.transform
                            }}
                          >
                            <div {...provided.dragHandleProps} style={{ color: '#94a3b8', marginTop: '4px', cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px' }}>
                              <GripVertical size={20} />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                                  {field.label} {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                                </label>
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.02em' }}>{field.type}</span>
                              </div>
                              
                              {/* Pseudo Input Render */}
                              <div style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#94a3b8', fontSize: '0.95rem' }}>
                                {field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                              </div>
                            </div>
                            
                            {editingFieldId === field.id && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Duplicate"><Copy size={16} /></button>
                                <button onClick={(e) => { e.stopPropagation(); removeField(field.id); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete"><Trash2 size={16} /></button>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {form.fields.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '48px', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layout size={24} color="#94a3b8" />
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#334155' }}>Your form is empty</p>
                          <p style={{ margin: 0, fontSize: '0.9rem' }}>Click a field type on the left to start building.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {form.fields.length > 0 && (
              <button disabled style={{ marginTop: '24px', width: '100%', padding: '16px', backgroundColor: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.01em' }}>
                Submit Button
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
