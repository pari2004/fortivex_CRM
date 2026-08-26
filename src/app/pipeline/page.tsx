'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { leadsData, LeadStatus, Lead } from '@/lib/data/mockData';
import { DataToolbar } from '@/components/common/DataToolbar';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Clock, Plus, UserCheck, Edit2, Calendar, PhoneCall, MessageCircle, Mail, UploadCloud, RefreshCw, CheckCircle, Trash2, XCircle, FileText, UserPlus } from 'lucide-react';
import { ActionMenu } from '@/components/common/ActionMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumModal, SlidePanel } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumTextArea, PremiumSection, PremiumCard } from '@/components/common/PremiumForm';

const STAGES: LeadStatus[] = [
  'New Lead', 'Contacted', 'Interested', 'Demo Scheduled', 
  'Counselling Done', 'Application Started', 'Documents Pending', 
  'Payment Pending', 'Admitted', 'Rejected', 'Lost'
];

// --- Toast Utility ---
const showToast = (message: string, color: string = '#10b981') => {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = color;
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

// --- Specific Modals ---

function ViewLeadModal({ lead, isOpen, onClose }: { lead: Lead | null; isOpen: boolean; onClose: () => void }) {
  if (!lead) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Lead Details: ${lead.name}`} footer={<button className="secondary-btn" onClick={onClose}>Close</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div>
          <img src={`https://i.pravatar.cc/150?u=${lead.id}`} alt={lead.name} style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>{lead.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{lead.email}</p>
          <span style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{lead.status}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '8px' }}>Personal Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Lead ID:</strong> {lead.id}</div>
              <div><strong>Phone:</strong> {lead.phone}</div>
              <div><strong>City:</strong> {lead.city || 'N/A'}</div>
              <div><strong>Gender:</strong> Male</div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '8px' }}>Academic & Professional</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Qualification:</strong> {lead.qualification || 'N/A'}</div>
              <div><strong>Experience:</strong> {lead.experience || 'N/A'}</div>
              <div><strong>Current Company:</strong> {lead.currentCompany || 'N/A'}</div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '8px' }}>Program Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Program:</strong> {lead.program}</div>
              <div><strong>Counselor:</strong> {lead.counselor}</div>
              <div><strong>Source:</strong> {lead.source}</div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '8px' }}>Sales Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Lead Score:</strong> {lead.leadScore}</div>
              <div><strong>Priority:</strong> {lead.priority}</div>
              <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </PremiumModal>
  );
}

function EditLeadModal({ lead, isOpen, onClose, onSave }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onSave: (lead: Lead) => void }) {
  const [formData, setFormData] = useState<Partial<Lead>>(lead || {});
  
  if (!lead) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    onSave({ ...lead, ...formData } as Lead);
    showToast('Lead updated successfully');
    onClose();
  };

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Edit Lead: ${lead.name}`} subtitle="Update lead information and status." icon={<span style={{fontSize: '24px'}}>✏️</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Save Changes</button></>}>
      <PremiumCard title="Lead Information" icon={<span style={{fontSize: '18px'}}>👤</span>}>
        <PremiumInput label="Student Name" name="name" value={formData.name || ''} onChange={handleChange} icon={<span style={{fontSize: '16px'}}>👤</span>} />
        <PremiumInput label="Mobile Number" name="phone" value={formData.phone || ''} onChange={handleChange} icon={<span style={{fontSize: '16px'}}>📞</span>} />
        <PremiumInput label="Email" name="email" value={formData.email || ''} onChange={handleChange} icon={<span style={{fontSize: '16px'}}>📧</span>} />
        <PremiumInput label="Qualification" name="qualification" value={formData.qualification || ''} onChange={handleChange} icon={<span style={{fontSize: '16px'}}>🎓</span>} />
      </PremiumCard>
      
      <PremiumCard title="Pipeline & Assignment" icon={<span style={{fontSize: '18px'}}>🔄</span>}>
        <PremiumSelect label="Pipeline Stage" name="status" value={formData.status || ''} onChange={handleChange} options={STAGES} icon={<span style={{fontSize: '16px'}}>📊</span>} />
        <PremiumInput label="Counselor" name="counselor" value={formData.counselor || ''} onChange={handleChange} icon={<span style={{fontSize: '16px'}}>👨‍💼</span>} />
        <PremiumSelect label="Priority" name="priority" value={formData.priority || ''} onChange={handleChange} options={['Low', 'Medium', 'High']} icon={<span style={{fontSize: '16px'}}>⭐</span>} />
      </PremiumCard>

      <PremiumCard title="Additional Notes" icon={<span style={{fontSize: '18px'}}>📝</span>}>
        <div style={{ gridColumn: '1 / -1' }}>
          <PremiumTextArea label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} icon={<span style={{fontSize: '16px'}}>📝</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function ScheduleDemoModal({ lead, isOpen, onClose, onSave }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onSave: (lead: Lead) => void }) {
  if (!lead) return null;
  const handleSave = () => {
    onSave({ ...lead, status: 'Demo Scheduled' });
    showToast('Demo added to calendar successfully');
    onClose();
  };

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Schedule Demo: ${lead.name}`} subtitle="Book a live demonstration session." icon={<span style={{fontSize: '24px'}}>📅</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Schedule Demo</button></>} maxWidth="500px">
      <PremiumCard title="Demo Details" icon={<span style={{fontSize: '18px'}}>📅</span>}>
        <PremiumInput label="Date" type="date" defaultValue="2026-08-10" icon={<span style={{fontSize: '16px'}}>📅</span>} />
        <PremiumInput label="Time" type="time" defaultValue="14:00" icon={<span style={{fontSize: '16px'}}>⏰</span>} />
        <div style={{ gridColumn: '1 / -1' }}>
          <PremiumSelect label="Platform" options={['Zoom', 'Google Meet', 'Microsoft Teams']} defaultValue="Zoom" icon={<span style={{fontSize: '16px'}}>💻</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function ScheduleFollowUpModal({ lead, isOpen, onClose }: { lead: Lead | null; isOpen: boolean; onClose: () => void }) {
  if (!lead) return null;
  const handleSave = () => {
    showToast('Follow-up scheduled and added to tasks.');
    onClose();
  };

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Schedule Follow-up: ${lead.name}`} subtitle="Plan your next interaction." icon={<span style={{fontSize: '24px'}}>📞</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Schedule</button></>} maxWidth="500px">
      <PremiumCard title="Follow-up Details" icon={<span style={{fontSize: '18px'}}>📅</span>}>
        <PremiumInput type="date" label="Date" defaultValue={new Date().toISOString().split('T')[0]} icon={<span style={{fontSize: '16px'}}>📅</span>} />
        <PremiumInput type="time" label="Time" defaultValue="10:00" icon={<span style={{fontSize: '16px'}}>⏰</span>} />
        <div style={{ gridColumn: '1 / -1' }}>
          <PremiumSelect label="Type" options={['Phone Call', 'WhatsApp', 'Email']} icon={<span style={{fontSize: '16px'}}>📲</span>} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <PremiumTextArea label="Notes" rows={2} icon={<span style={{fontSize: '16px'}}>📝</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function AssignCounselorModal({ lead, isOpen, onClose, onSave }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onSave: (lead: Lead) => void }) {
  const [counselor, setCounselor] = useState(lead?.counselor || '');
  if (!lead) return null;
  const handleSave = () => {
    onSave({ ...lead, counselor });
    showToast(`Lead assigned to ${counselor}`);
    onClose();
  };

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Assign Counselor`} subtitle="Delegate lead to a team member." icon={<span style={{fontSize: '24px'}}>👨‍💼</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Assign</button></>} maxWidth="400px">
      <PremiumCard title="Counselor Assignment" icon={<span style={{fontSize: '18px'}}>🤝</span>}>
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assigning lead <strong>{lead.name}</strong> to:</p>
          <PremiumSelect label="Select Counselor" value={counselor} onChange={e => setCounselor(e.target.value)} options={['Select Counselor', 'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh']} icon={<span style={{fontSize: '16px'}}>👨‍💼</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function UploadDocumentsModal({ lead, isOpen, onClose }: { lead: Lead | null; isOpen: boolean; onClose: () => void }) {
  if (!lead) return null;
  const handleSave = () => {
    showToast('Documents uploaded successfully');
    onClose();
  };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Upload Documents: ${lead.name}`} subtitle="Attach necessary files." icon={<span style={{fontSize: '24px'}}>📂</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Upload</button></>} maxWidth="600px">
      <PremiumCard title="Required Documents" icon={<span style={{fontSize: '18px'}}>📑</span>}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['Resume', 'Aadhaar', 'Degree Certificate', 'Mark Sheets', 'Passport Photo'].map(doc => (
            <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }}>
              <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{fontSize: '18px'}}>📄</span> {doc}</span>
              <button className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Select File</button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function GenerateNotesModal({ lead, isOpen, onClose, onSave }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onSave: (lead: Lead) => void }) {
  const [notes, setNotes] = useState('');
  if (!lead) return null;
  const handleSave = () => {
    onSave({ ...lead, notes: lead.notes ? `${lead.notes}\n${notes}` : notes });
    showToast('Notes added to timeline');
    onClose();
  };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Generate Notes: ${lead.name}`} subtitle="Add conversation notes to timeline." icon={<span style={{fontSize: '24px'}}>📝</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Save Note</button></>} maxWidth="500px">
      <PremiumCard title="Quick Note" icon={<span style={{fontSize: '18px'}}>✍️</span>}>
        <div style={{ gridColumn: '1 / -1' }}>
          <PremiumTextArea label="Notes" rows={6} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type notes here..." icon={<span style={{fontSize: '16px'}}>📝</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}

function MarkAsLostModal({ lead, isOpen, onClose, onSave }: { lead: Lead | null; isOpen: boolean; onClose: () => void; onSave: (lead: Lead) => void }) {
  if (!lead) return null;
  const handleSave = () => {
    onSave({ ...lead, status: 'Lost' });
    showToast('Lead marked as Lost', '#ef4444');
    onClose();
  };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Mark as Lost: ${lead.id}`} subtitle="Close this lead." icon={<span style={{fontSize: '24px'}}>❌</span>} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" style={{ background: 'var(--status-rejected)' }} onClick={handleSave}>Confirm Lost</button></>} maxWidth="500px">
      <PremiumCard title="Lost Reason" icon={<span style={{fontSize: '18px'}}>📉</span>}>
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem' }}>Are you sure you want to mark <strong>{lead.name}</strong> as Lost?</p>
          <PremiumSelect label="Reason for lost" options={['Price too high', 'Not interested anymore', 'Joined competitor', 'Unreachable', 'Timing not right', 'Other']} icon={<span style={{fontSize: '16px'}}>❓</span>} />
        </div>
      </PremiumCard>
    </PremiumModal>
  );
}


// --- Kanban Card Component ---
function KanbanCard({ lead, index, activeMenuId, setActiveMenuId, openModal, executeAction }: { lead: Lead, index: number, activeMenuId: string | null, setActiveMenuId: (id: string | null) => void, openModal: (type: string, lead: Lead) => void, executeAction: (action: string, lead: Lead) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--status-admitted)'; // Green
    if (score >= 50) return 'var(--status-contacted)'; // Orange
    return 'var(--status-rejected)'; // Red
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            boxShadow: snapshot.isDragging ? '0 15px 30px rgba(0,0,0,0.15)' : 'none',
            transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} scale(1.02)` : provided.draggableProps.style?.transform,
            marginBottom: '12px'
          }}
        >
          <div className="glass-panel" style={{ padding: '16px', background: snapshot.isDragging ? 'var(--bg-primary)' : 'rgba(255,255,255,0.8)', border: snapshot.isDragging ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{lead.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{lead.phone}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>{lead.program}</div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <ActionMenu 
                  isOpen={activeMenuId === lead.id}
                  onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === lead.id ? null : lead.id); }}
                  onClose={() => setActiveMenuId(null)}
                  items={[
                    { label: 'View Lead Details', icon: <UserCheck size={16} />, onClick: () => openModal('view', lead) },
                    { label: 'Edit Lead', icon: <Edit2 size={16} />, onClick: () => openModal('edit', lead) },
                    { label: 'Schedule Demo', icon: <Calendar size={16} />, onClick: () => openModal('demo', lead) },
                    { label: 'Schedule Follow-up', icon: <Clock size={16} />, onClick: () => openModal('followup', lead) },
                    { label: 'Assign Counselor', icon: <UserPlus size={16} />, onClick: () => openModal('assign', lead) },
                    { divider: true, label: '' },
                    { label: 'Call Student', icon: <PhoneCall size={16} />, onClick: () => executeAction('call', lead) },
                    { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageCircle size={16} />, onClick: () => executeAction('whatsapp', lead) },
                    { label: 'Send Email', icon: <Mail size={16} />, onClick: () => executeAction('email', lead) },
                    { divider: true, label: '' },
                    { label: 'Upload Documents', icon: <UploadCloud size={16} />, onClick: () => openModal('upload', lead) },
                    { label: 'View Documents', icon: <FileText size={16} />, onClick: () => openModal('view_docs', lead) },
                    { label: 'Convert to Application', icon: <RefreshCw size={16} />, onClick: () => executeAction('convert', lead) },
                    { label: 'Generate Notes', icon: <FileText size={16} />, onClick: () => openModal('notes', lead) },
                    { divider: true, label: '' },
                    { label: 'Mark as Won', icon: <CheckCircle size={16} />, color: 'var(--status-admitted)', onClick: () => executeAction('won', lead) },
                    { label: 'Mark as Lost', icon: <XCircle size={16} />, color: 'var(--status-rejected)', onClick: () => openModal('lost', lead) },
                    { label: 'Delete Lead', icon: <Trash2 size={16} />, color: 'var(--status-rejected)', onClick: () => openModal('delete', lead) }
                  ]}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: '4px', fontWeight: 600 }}>{lead.priority} Priority</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: '4px', fontWeight: 600, color: getScoreColor(lead.leadScore) }}>Score: {lead.leadScore}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <Clock size={12} /> Follow-up: {new Date(lead.createdAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div title={lead.counselor} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {lead.counselor.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </Draggable>
  );
}


// --- Main Page Component ---
export default function PipelinePage() {
  const crm = useCRM();
  const [isMounted, setIsMounted] = useState(false);
  const [localData, setLocalData] = useState<Lead[]>([]);
  const [filteredData, setFilteredData] = useState<Lead[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [addModalStage, setAddModalStage] = useState<LeadStatus>('New Lead');
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '', qualification: '', experience: '', 
    currentCompany: '', program: 'Full Stack Development', source: 'Website', 
    counselor: 'Rahul Sharma', priority: 'Medium' as 'High' | 'Medium' | 'Low', notes: ''
  });

  useEffect(() => {
    setIsMounted(true);
    setLocalData(leadsData);
    setFilteredData(leadsData);
  }, []);

  const openModal = (type: string, lead: Lead | null = null) => {
    setSelectedLead(lead);
    setActiveModal(type);
    setActiveMenuId(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLead(null);
  };

  const updateLead = (updatedLead: Lead) => {
    setLocalData(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setFilteredData(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as LeadStatus;
    
    // Optimistic update
    setLocalData(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l));
    setFilteredData(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l));

    showToast(`Successfully moved to ${newStatus}`);
  };

  const executeAction = (action: string, lead: Lead) => {
    setActiveMenuId(null);
    if (action === 'call') {
      window.open(`tel:${lead.phone}`);
    } else if (action === 'whatsapp') {
      window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, '_blank');
    } else if (action === 'email') {
      window.open(`mailto:${lead.email}`);
    } else if (action === 'convert') {
      updateLead({ ...lead, status: 'Application Started' });
      showToast(`${lead.name} converted to Application`, '#10b981');
    } else if (action === 'won') {
      updateLead({ ...lead, status: 'Admitted' });
      showToast(`${lead.name} marked as Admitted!`, '#10b981');
    }
  };

  const deleteLead = (leadId: string) => {
    setLocalData(prev => prev.filter(l => l.id !== leadId));
    setFilteredData(prev => prev.filter(l => l.id !== leadId));
    showToast(`Lead deleted successfully.`, '#ef4444');
    closeModal();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `L-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      qualification: formData.qualification,
      experience: formData.experience,
      currentCompany: formData.currentCompany,
      program: formData.program as any,
      source: formData.source,
      counselor: formData.counselor,
      priority: formData.priority,
      notes: formData.notes,
      status: addModalStage,
      leadScore: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString()
    };

    setLocalData(prev => [newLead, ...prev]);
    setFilteredData(prev => [newLead, ...prev]);
    setActiveModal(null);
    showToast(`Lead ${newLead.name} added to ${addModalStage}`);
    // Reset form
    setFormData({ name: '', phone: '', email: '', city: '', qualification: '', experience: '', currentCompany: '', program: 'Full Stack Development', source: 'Website', counselor: 'Rahul Sharma', priority: 'Medium', notes: '' });
  };

  const getLeadsByStage = (stage: LeadStatus) => filteredData.filter(l => l.status === stage);

  if (!isMounted) return null; // Avoid hydration mismatch on initial render

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Dynamic Modals */}
      <ViewLeadModal isOpen={activeModal === 'view'} onClose={closeModal} lead={selectedLead} />
      <EditLeadModal isOpen={activeModal === 'edit'} onClose={closeModal} lead={selectedLead} onSave={updateLead} />
      <ScheduleDemoModal isOpen={activeModal === 'demo'} onClose={closeModal} lead={selectedLead} onSave={updateLead} />
      <ScheduleFollowUpModal isOpen={activeModal === 'followup'} onClose={closeModal} lead={selectedLead} />
      <AssignCounselorModal isOpen={activeModal === 'assign'} onClose={closeModal} lead={selectedLead} onSave={updateLead} />
      <UploadDocumentsModal isOpen={activeModal === 'upload'} onClose={closeModal} lead={selectedLead} />
      <GenerateNotesModal isOpen={activeModal === 'notes'} onClose={closeModal} lead={selectedLead} onSave={updateLead} />
      <MarkAsLostModal isOpen={activeModal === 'lost'} onClose={closeModal} lead={selectedLead} onSave={updateLead} />
      
      {/* Delete Lead Modal */}
      <PremiumModal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Lead" subtitle="Remove lead permanently." icon={<span style={{fontSize: '24px'}}>🗑️</span>} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{ background: 'var(--status-rejected)' }} onClick={() => selectedLead && deleteLead(selectedLead.id)}>Delete</button></>} maxWidth="400px">
        <PremiumCard title="Confirm Deletion" icon={<span style={{fontSize: '18px'}}>⚠️</span>}>
          <div style={{ gridColumn: '1 / -1' }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Are you sure you want to permanently delete lead <strong>{selectedLead?.name}</strong>? This action cannot be undone.</p>
          </div>
        </PremiumCard>
      </PremiumModal>
      
      {/* View Documents Modal (Mock) */}
      <PremiumModal isOpen={activeModal === 'view_docs'} onClose={closeModal} title={`Documents: ${selectedLead?.name}`} subtitle="View uploaded files." icon={<span style={{fontSize: '24px'}}>📁</span>} footer={<button className="secondary-btn" onClick={closeModal}>Close</button>} maxWidth="600px">
        <PremiumCard title="Uploaded Documents" icon={<span style={{fontSize: '18px'}}>📑</span>}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Resume.pdf', 'Degree_Certificate.pdf', 'Marks_Cards.pdf', 'Aadhaar.pdf'].map(doc => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{fontSize: '18px'}}>📄</span> {doc}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Preview</button>
                  <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>
      </PremiumModal>
      
      {/* Add Lead Modal */}
      <PremiumModal isOpen={activeModal === 'add'} onClose={closeModal} title={`Add New Lead to ${addModalStage}`} subtitle="Create a new lead." icon={<span style={{fontSize: '24px'}}>✨</span>} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" form="add-lead-form" className="primary-btn">Save Lead</button></>}>
        <form id="add-lead-form" onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumCard title="Lead Information" icon={<span style={{fontSize: '18px'}}>👤</span>}>
            <PremiumInput label="Full Name *" name="name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} icon={<span style={{fontSize: '16px'}}>👤</span>} required />
            <PremiumInput label="Mobile Number *" name="phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} icon={<span style={{fontSize: '16px'}}>📞</span>} required />
            <PremiumInput label="Email" name="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} icon={<span style={{fontSize: '16px'}}>📧</span>} />
            <PremiumInput label="City" name="city" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} icon={<span style={{fontSize: '16px'}}>🏢</span>} />
          </PremiumCard>
          <PremiumCard title="Academic & Assignment" icon={<span style={{fontSize: '18px'}}>🎓</span>}>
            <PremiumInput label="Qualification" name="qualification" value={formData.qualification || ''} onChange={e => setFormData({...formData, qualification: e.target.value})} icon={<span style={{fontSize: '16px'}}>🎓</span>} />
            <PremiumInput label="Experience" name="experience" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} icon={<span style={{fontSize: '16px'}}>💼</span>} />
            <PremiumInput label="Program" name="program" value={formData.program || 'Full Stack Development'} disabled icon={<span style={{fontSize: '16px'}}>💻</span>} />
            <PremiumInput label="Counselor" name="counselor" value={formData.counselor || ''} onChange={e => setFormData({...formData, counselor: e.target.value})} icon={<span style={{fontSize: '16px'}}>👨‍💼</span>} />
          </PremiumCard>
        </form>
      </PremiumModal>

      <div style={{ paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sales Pipeline</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Drag and drop leads to track progression across stages.</p>
      </div>

      <div style={{ margin: '0 -24px' }}>
        <DataToolbar 
          data={localData} 
          onFilteredDataChange={setFilteredData}
          searchKeys={['name', 'email', 'phone', 'program']}
          searchPlaceholder="Search leads by name, email, phone or program..."
          exportFilename="pipeline_export"
          filterOptions={[
            { key: 'program', label: 'Program', type: 'select', options: Array.from(new Set(localData.map(l => l.program))) },
            { key: 'status', label: 'Status', type: 'select', options: STAGES },
            { key: 'counselor', label: 'Counselor', type: 'select', options: Array.from(new Set(localData.map(l => l.counselor))) },
            { key: 'city', label: 'City', type: 'select', options: Array.from(new Set(localData.map(l => l.city).filter(Boolean))) as string[] },
            { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
            { key: 'source', label: 'Lead Source', type: 'select', options: Array.from(new Set(localData.map(l => l.source))) }
          ]}
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ flex: 1, display: 'flex', gap: '20px', overflowX: 'auto', padding: '24px 0' }}>
          {STAGES.map(stage => {
            const leads = getLeadsByStage(stage);
            return (
              <div key={stage} style={{ minWidth: '320px', width: '320px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{stage}</h3>
                  <span style={{ padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{leads.length}</span>
                </div>
                
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ 
                        flex: 1, 
                        padding: '16px', 
                        overflowY: 'auto',
                        background: snapshot.isDraggingOver ? 'rgba(0,0,0,0.03)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      {leads.map((lead, index) => (
                        <KanbanCard key={lead.id} lead={lead} index={index} activeMenuId={activeMenuId} setActiveMenuId={setActiveMenuId} openModal={openModal} executeAction={executeAction} />
                      ))}
                      {provided.placeholder}
                      
                      <button 
                        onClick={() => { setAddModalStage(stage); openModal('add'); }}
                        style={{ width: '100%', padding: '12px', border: '2px dashed var(--glass-border)', borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: '8px' }} 
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Plus size={16} /> Add Lead
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
