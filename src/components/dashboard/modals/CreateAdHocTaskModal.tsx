import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronDown, Flag, Bell, MapPin, Activity, UploadCloud, File as FileIcon, User as UserIcon } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function CreateAdHocTaskModal({ isOpen, onClose, lead }: Props) {
  const { systemUsers, addTask } = useCRM();

  // Form State
  const [taskNote, setTaskNote] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [assignType, setAssignType] = useState('Yourself'); // Yourself, Assign Later, Employee
  const [selectedUserId, setSelectedUserId] = useState('');

  const [priority, setPriority] = useState('None');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);

  const [remind, setRemind] = useState('None');
  const [showRemindOptions, setShowRemindOptions] = useState(false);

  const [place, setPlace] = useState('');
  const [showPlaceInput, setShowPlaceInput] = useState(false);

  const [activityType, setActivityType] = useState('Task');
  const [showActivityOptions, setShowActivityOptions] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize date/time on open
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
    }
  }, [isOpen]);

  // Handlers
  const handleReset = () => {
    setTaskNote('');
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
    setAssignType('Yourself');
    setSelectedUserId('');
    setPriority('None');
    setRemind('None');
    setPlace('');
    setActivityType('Task');
    setFiles([]);
    setShowPriorityOptions(false);
    setShowRemindOptions(false);
    setShowPlaceInput(false);
    setShowActivityOptions(false);
  };

  const handleSubmit = () => {
    if (!taskNote.trim()) {
      alert("Please enter a task note.");
      return;
    }

    let finalAssignee = 'Unassigned';
    if (assignType === 'Yourself') {
      finalAssignee = 'Abhay'; // Or whoever the logged-in user is meant to be in this demo context
    } else if (assignType === 'Employee' && selectedUserId) {
      const user = systemUsers.find(u => u.id === selectedUserId);
      if (user) finalAssignee = user.name;
    }

    // Combine date and time
    let dueDateStr = '';
    if (date && time) {
      dueDateStr = `${date}T${time}:00Z`;
    }

    const newTask = {
      title: taskNote.length > 30 ? taskNote.substring(0, 30) + '...' : taskNote,
      description: taskNote,
      assignTo: finalAssignee,
      priority: priority !== 'None' ? priority : 'Medium',
      dueDate: dueDateStr || new Date().toISOString(),
      status: 'Pending',
      leadId: lead?.id,
      leadName: lead?.name,
      type: activityType,
      place,
      reminder: remind,
      attachments: files.map(f => f.name),
      createdAt: new Date().toISOString()
    };

    addTask(newTask);
    handleReset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '650px', maxHeight: '90vh',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Adding Task</h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Target Lead Context (Visual indicator) */}
          {lead && (
            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserIcon size={14} /> For Lead: <span style={{ fontWeight: 600, color: '#4f46e5' }}>{lead.name}</span>
            </div>
          )}

          {/* Task Note */}
          <div>
            <textarea 
              value={taskNote} onChange={e => setTaskNote(e.target.value)}
              placeholder="Add detailed task note..."
              style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#334155' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Clock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#334155' }} />
            </div>
          </div>

          {/* Assignment Dropdown */}
          <div style={{ position: 'relative' }}>
            <UserIcon size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <select 
              value={assignType} onChange={(e) => setAssignType(e.target.value)}
              style={{ width: '100%', padding: '12px 32px 12px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', appearance: 'none', background: 'white', cursor: 'pointer', color: '#334155' }}
            >
              <option value="Yourself">Yourself</option>
              <option value="Assign Later">Assign Later</option>
              <option value="Employee">Employee</option>
            </select>
            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          {/* Employee Selection if AssignType == 'Employee' */}
          {assignType === 'Employee' && (
            <div style={{ position: 'relative' }}>
              <select 
                value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                style={{ width: '100%', padding: '12px 32px 12px 12px', borderRadius: '8px', border: '1px solid #4f46e5', fontSize: '0.9rem', appearance: 'none', background: '#f8fafc', cursor: 'pointer', color: '#334155' }}
              >
                <option value="" disabled>Select an employee...</option>
                {systemUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
              <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          )}

          {/* Task Options (Priority, Remind, Place, Activity) */}
          <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
            
            {/* Priority Option */}
            <div style={{ position: 'relative', flex: 1 }}>
              <div 
                onClick={() => setShowPriorityOptions(!showPriorityOptions)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: priority !== 'None' ? '#e0e7ff' : 'transparent' }}
              >
                <Flag size={20} color={priority !== 'None' ? '#4f46e5' : '#64748b'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: priority !== 'None' ? '#4f46e5' : '#64748b' }}>{priority !== 'None' ? priority : 'Priority'}</span>
              </div>
              {showPriorityOptions && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10 }}>
                  {['High', 'Medium', 'Low', 'None'].map(p => (
                    <div key={p} onClick={() => { setPriority(p); setShowPriorityOptions(false); }} style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>{p}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Remind Option */}
            <div style={{ position: 'relative', flex: 1 }}>
              <div 
                onClick={() => setShowRemindOptions(!showRemindOptions)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: remind !== 'None' ? '#e0e7ff' : 'transparent' }}
              >
                <Bell size={20} color={remind !== 'None' ? '#4f46e5' : '#64748b'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: remind !== 'None' ? '#4f46e5' : '#64748b' }}>{remind !== 'None' ? remind : 'Remind'}</span>
              </div>
              {showRemindOptions && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px' }}>
                  {['5 mins before', '15 mins before', '1 hour before', '1 day before', 'None'].map(r => (
                    <div key={r} onClick={() => { setRemind(r); setShowRemindOptions(false); }} style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>{r}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Place Option */}
            <div style={{ position: 'relative', flex: 1 }}>
              <div 
                onClick={() => setShowPlaceInput(!showPlaceInput)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: place ? '#e0e7ff' : 'transparent' }}
              >
                <MapPin size={20} color={place ? '#4f46e5' : '#64748b'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: place ? '#4f46e5' : '#64748b' }}>{place ? 'Set' : 'Place'}</span>
              </div>
              {showPlaceInput && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, padding: '12px', width: '250px' }}>
                  <input type="text" placeholder="Enter location..." value={place} onChange={e => setPlace(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }} autoFocus/>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button onClick={() => setShowPlaceInput(false)} style={{ background: '#4f46e5', color: 'white', padding: '4px 12px', borderRadius: '4px', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>OK</button>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Option */}
            <div style={{ position: 'relative', flex: 1 }}>
              <div 
                onClick={() => setShowActivityOptions(!showActivityOptions)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: activityType !== 'Task' ? '#e0e7ff' : 'transparent' }}
              >
                <Activity size={20} color={activityType !== 'Task' ? '#4f46e5' : '#64748b'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: activityType !== 'Task' ? '#4f46e5' : '#64748b' }}>{activityType}</span>
              </div>
              {showActivityOptions && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px' }}>
                  {['Task', 'Call', 'Meeting', 'Email'].map(a => (
                    <div key={a} onClick={() => { setActivityType(a); setShowActivityOptions(false); }} style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>{a}</div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* File Upload Area */}
          <div 
            onDragOver={handleDragOver} onDrop={handleDrop}
            style={{ 
              border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px 20px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', 
              background: '#f8fafc', cursor: 'pointer' 
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            <div style={{ background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <UploadCloud size={24} color="#4f46e5" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>Upload Files</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>or drag & drop files here</div>
            </div>
          </div>

          {/* Attached Files List */}
          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {files.map((file, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileIcon size={16} color="#64748b" />
                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>{file.name}</span>
                  </div>
                  <X size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeFile(i)} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleReset} style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            Reset
          </button>
          <button onClick={handleSubmit} style={{ padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
            Submit
          </button>
        </div>

      </motion.div>
    </div>
  );
}
