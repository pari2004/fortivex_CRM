'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  activeForm: string | null;
  onClose: () => void;
}

const formConfigs: Record<string, { fields: { name: string; label: string; type: string; options?: string[] }[], onSubmit: (data: any, crm: any) => void }> = {
  'Add Lead': {
    fields: [
      { name: 'name', label: 'Lead Name', type: 'text' },
      { name: 'mobile', label: 'Phone Number', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'source', label: 'Lead Source', type: 'select', options: ['Website', 'Referral', 'Social Media', 'Direct'] },
      { name: 'course', label: 'Course', type: 'text' },
      { name: 'program', label: 'Program', type: 'text' },
      { name: 'counselor', label: 'Assigned Counselor', type: 'text' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
      { name: 'status', label: 'Status', type: 'select', options: ['New', 'Contacted', 'Qualified', 'Lost'] },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.addLead({ ...data, date: new Date().toISOString().split('T')[0] })
  },
  'Add Student': {
    fields: [
      { name: 'name', label: 'Student Name', type: 'text' },
      { name: 'studentId', label: 'Student ID', type: 'text' },
      { name: 'mobile', label: 'Mobile', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'course', label: 'Course', type: 'text' },
      { name: 'batch', label: 'Batch', type: 'text' },
      { name: 'date', label: 'Admission Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Graduated'] }
    ],
    onSubmit: (data, crm) => crm.addStudent({ ...data, program: data.course, fee: '0', paymentStatus: 'Pending' })
  },
  'Add Application': {
    fields: [
      { name: 'id', label: 'Application Number', type: 'text' },
      { name: 'studentName', label: 'Student Name', type: 'text' },
      { name: 'program', label: 'Program', type: 'text' },
      { name: 'course', label: 'Course', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Submitted', 'Under Review', 'Approved', 'Rejected'] },
      { name: 'counselor', label: 'Assigned Counselor', type: 'text' },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.addApplication({ ...data, date: new Date().toISOString().split('T')[0] })
  },
  'Add Task': {
    fields: [
      { name: 'title', label: 'Task Title', type: 'text' },
      { name: 'assignTo', label: 'Assign To', type: 'text' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'] },
      { name: 'description', label: 'Description', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.addTask({ ...data })
  },
  'Schedule Meeting': {
    fields: [
      { name: 'title', label: 'Meeting Title', type: 'text' },
      { name: 'participants', label: 'Participants', type: 'text' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'time', label: 'Time', type: 'time' },
      { name: 'location', label: 'Location/Link', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.scheduleDemo({ student: data.participants, email: '', mobile: '', program: data.title, date: data.date, time: data.time, faculty: '', link: data.location })
  },
  'Log Call': {
    fields: [
      { name: 'student', label: 'Lead Name', type: 'text' },
      { name: 'mobile', label: 'Phone', type: 'text' },
      { name: 'type', label: 'Call Type', type: 'select', options: ['Outbound', 'Inbound'] },
      { name: 'duration', label: 'Duration (mins)', type: 'text' },
      { name: 'outcome', label: 'Outcome', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.logCall({ ...data, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString(), counselor: 'Self' })
  },
  'Add Payment': {
    fields: [
      { name: 'studentName', label: 'Student', type: 'text' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'method', label: 'Payment Mode', type: 'select', options: ['Credit Card', 'Bank Transfer', 'UPI', 'Cash'] },
      { name: 'invoiceNumber', label: 'Transaction ID', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Completed', 'Pending', 'Failed'] }
    ],
    onSubmit: (data, crm) => crm.addPayment({ ...data, date: new Date().toISOString().split('T')[0] })
  },
  'Upload Document': {
    fields: [
      { name: 'name', label: 'Document Name', type: 'text' },
      { name: 'type', label: 'Document Type', type: 'select', options: ['ID Proof', 'Certificate', 'Receipt', 'Other'] },
      { name: 'student', label: 'Student', type: 'text' },
      { name: 'file', label: 'Upload File', type: 'file' },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.uploadDocument({ type: data.type, student: data.student, studentId: '' })
  },
  'Add User': {
    fields: [
      { name: 'name', label: 'Employee Name', type: 'text' },
      { name: 'employeeId', label: 'Employee ID', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }
    ],
    onSubmit: (data, crm) => crm.addUser({ ...data })
  },
  'Create Report': {
    fields: [
      { name: 'name', label: 'Report Name', type: 'text' },
      { name: 'module', label: 'Module', type: 'select', options: ['Leads', 'Students', 'Revenue', 'Activity'] },
      { name: 'dateRange', label: 'Date Range', type: 'text' },
      { name: 'chartType', label: 'Chart Type', type: 'select', options: ['Bar', 'Line', 'Pie'] },
      { name: 'description', label: 'Description', type: 'textarea' }
    ],
    onSubmit: (data, crm) => crm.addReport({ ...data, date: new Date().toISOString().split('T')[0] })
  }
};

export function QuickCreateModalManager({ activeForm, onClose }: Props) {
  const crm = useCRM();
  const [formData, setFormData] = useState<any>({});

  if (!activeForm || !formConfigs[activeForm]) return null;

  const config = formConfigs[activeForm];

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    config.onSubmit(formData, crm);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', background: 'var(--bg-primary)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeForm}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {config.fields.map(field => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{field.label}</label>
              {field.type === 'select' ? (
                <select 
                  className="glass-input" 
                  style={{ width: '100%', padding: '12px' }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea 
                  className="glass-input" 
                  style={{ width: '100%', padding: '12px', minHeight: '100px', resize: 'vertical' }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input 
                  type={field.type} 
                  className="glass-input" 
                  style={{ width: '100%', padding: '12px' }}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'rgba(0,0,0,0.02)' }}>
          <button onClick={onClose} className="secondary-btn" style={{ padding: '10px 24px' }}>Cancel</button>
          <button onClick={handleSave} className="primary-btn" style={{ padding: '10px 24px' }}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}
