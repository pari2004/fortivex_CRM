import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, ChevronDown } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function AddDocumentDrawer({ isOpen, onClose, lead }: Props) {
  const { updateLead, documentCategoriesTree } = useCRM();

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const CURRENT_USER = 'Abhay'; // Or get from auth context

  // Flatten the category tree for the dropdown
  const categories = useMemo(() => {
    const list: { id: string, name: string }[] = [];
    const traverse = (nodes: any[], prefix = '') => {
      nodes.forEach(n => {
        list.push({ id: n.id, name: prefix + n.name });
        if (n.subCategories && n.subCategories.length > 0) {
          traverse(n.subCategories, prefix + n.name + ' > ');
        }
      });
    };
    traverse(documentCategoriesTree || []);
    return list;
  }, [documentCategoriesTree]);

  const handleReset = () => {
    setTitle('');
    setSelectedCategory('');
    setNotes('');
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (!title || !selectedFile || !selectedCategory) return;

    let desc = `Category: ${selectedCategory}\nFilename: ${selectedFile.name}`;
    if (notes) desc += `\nNotes: ${notes}`;

    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityTime: new Date().toISOString(),
      lifecycle: lead.status || 'Contacted',
      activityType: 'Document',
      category: 'Document',
      title: title,
      description: desc,
      activityBy: CURRENT_USER
    };

    const updatedLead = {
      ...lead,
      activities: [newActivity, ...(lead.activities || [])]
    };

    updateLead(updatedLead);
    handleReset();
    onClose();
  };

  const isValid = title.trim() !== '' && selectedCategory !== '' && selectedFile !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div key="add-document-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
          <motion.div 
            key="add-document-drawer"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ 
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', 
              background: '#f8fafc', zIndex: 100005, display: 'flex', flexDirection: 'column', 
              boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  Upload Document for {lead?.name || lead?.phone || lead?.mobile || 'Contact'}
                </h3>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* Document Title */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Document Title <span style={{ color: '#ef4444' }}>*</span></h4>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Identity Proof"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                />
              </div>

              {/* Document Category */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Document Category <span style={{ color: '#ef4444' }}>*</span></h4>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select 
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px 38px 12px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: 'white', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {categories.length === 0 && <option value="Uncategorized">Uncategorized</option>}
                  </select>
                  <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* File Upload */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Upload File <span style={{ color: '#ef4444' }}>*</span></h4>
                <div 
                  style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => { if (e.target.files?.length) setSelectedFile(e.target.files[0]) }} />
                  <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                  {selectedFile ? (
                    <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{selectedFile.name}</div>
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      <span style={{ color: '#4f46e5', fontWeight: 600 }}>Upload Files</span> or drag & drop files here
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Note */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Description</h4>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Optional description"
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleReset} style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                Reset
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!isValid}
                style={{ padding: '10px 20px', background: isValid ? '#4f46e5' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
