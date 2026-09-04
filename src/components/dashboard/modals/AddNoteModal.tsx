import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function AddNoteModal({ isOpen, onClose, lead }: Props) {
  const { updateLead } = useCRM();
  const [noteText, setNoteText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setNoteText('');
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (!noteText.trim() && !selectedFile) return;
    
    // Log the note as an activity
    const CURRENT_USER = 'Abhay';
    let desc = noteText;
    if (selectedFile) {
      desc += `\n[Attached: ${selectedFile.name}]`;
    }

    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityTime: new Date().toISOString(),
      lifecycle: lead.status || 'Contacted',
      activityType: 'Note',
      category: 'Activity',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="add-note-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ background: 'white', borderRadius: '12px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Add Note</h3>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              <textarea 
                value={noteText} 
                onChange={e => setNoteText(e.target.value)} 
                placeholder="Type your note here..." 
                style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', resize: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }} 
              />
              
              <div 
                style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '24px', cursor: 'pointer', background: '#f8fafc' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                {selectedFile ? (
                  <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{selectedFile.name}</div>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    <span style={{ color: '#4f46e5', fontWeight: 600 }}>Click to upload</span> or drag & drop files here
                    <br/>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• 1 file</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={handleReset} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}>Reset</button>
                <button onClick={handleSubmit} style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
