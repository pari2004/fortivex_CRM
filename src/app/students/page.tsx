'use client';

import React, { useState, useEffect, useRef } from 'react';
import { studentsData, Student, StudentStatus, PlacementStatus } from '@/lib/data/mockData';
import { useCRM } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { openWhatsApp, openEmail } from '@/lib/integrations';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Edit, RefreshCw, UserPlus, Calendar, BookOpen, Briefcase, 
  CreditCard, UploadCloud, FileText, PhoneCall, MessageCircle, Mail, 
  DownloadCloud, Printer, List, Trash2, XCircle, Users, Award, TrendingUp
} from 'lucide-react';

import { Student360View } from '@/components/students/views/Student360View';
import { PremiumModal, SlidePanel } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumTextArea, PremiumSection } from '@/components/common/PremiumForm';

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

// --- Modals Base Component ---
// Removed local ModalBase, now using PremiumModal from common components.

// --- Specific Modals ---



function EditStudentModal({ student, isOpen, onClose, onSave }: { student: Student | null; isOpen: boolean; onClose: () => void; onSave: (s: Student) => void }) {
  const crm = useCRM();
  const [formData, setFormData] = useState<Partial<Student>>(student || {});
  
  if (!student) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    onSave({ ...student, ...formData } as Student);
    showToast('Student updated successfully');
    onClose();
  };

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title={`Edit Student`} subtitle={student.name} icon={<Edit />} width="700px" footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Save Changes</button></>}>
      
      <PremiumSection title="Personal Information" icon={<User size={16} />}>
        <PremiumInput label="Student Name" name="name" value={formData.name || ''} onChange={handleChange} />
        <PremiumInput label="Mobile Number" name="phone" value={formData.phone || ''} onChange={handleChange} />
        <PremiumInput label="Email" name="email" value={formData.email || ''} onChange={handleChange} />
      </PremiumSection>
      
      <PremiumSection title="Program Information" icon={<BookOpen size={16} />}>
        <PremiumInput label="Batch" name="batch" value={formData.batch || ''} onChange={handleChange} />
        <PremiumSelect label="Mentor" name="mentor" value={formData.mentor || ''} onChange={handleChange} options={crm.users.map(u => u.name)} />
        <PremiumSelect label="Status" name="status" value={formData.status || ''} onChange={handleChange} options={['Active', 'Enrolled', 'Pending Documents', 'Pending Payment', 'Orientation Scheduled', 'In Progress', 'Internship', 'Placement Ready', 'Placed', 'Alumni', 'On Hold']} />
      </PremiumSection>

      <PremiumSection title="Financial & Placement" icon={<CreditCard size={16} />}>
        <PremiumSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus || ''} onChange={handleChange} options={['Paid', 'Pending', 'Overdue']} />
        <PremiumSelect label="Placement Status" name="placementStatus" value={formData.placementStatus || ''} onChange={handleChange} options={['Not Started', 'In Training', 'Interviewing', 'Placed', 'Opted Out']} />
      </PremiumSection>

      <PremiumSection title="Notes" icon={<FileText size={16} />}>
        <PremiumTextArea label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} />
      </PremiumSection>

    </SlidePanel>
  );
}

function UpdateStatusModal({ student, isOpen, onClose, onSave }: { student: Student | null; isOpen: boolean; onClose: () => void; onSave: (s: Student) => void }) {
  const [status, setStatus] = useState<StudentStatus>(student?.status as StudentStatus);
  if (!student) return null;
  const handleSave = () => { onSave({ ...student, status }); showToast('Status updated successfully'); onClose(); };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Update Status`} subtitle={student.name} icon={<RefreshCw />} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Save Status</button></>} maxWidth="400px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PremiumSelect label="Status" name="status" value={status} onChange={e => setStatus(e.target.value as StudentStatus)} options={['Active', 'Enrolled', 'Pending Documents', 'Pending Payment', 'Orientation Scheduled', 'In Progress', 'Internship', 'Placement Ready', 'Placed', 'Alumni', 'On Hold']} />
      </div>
    </PremiumModal>
  );
}

function AssignMentorModal({ student, isOpen, onClose, onSave }: { student: Student | null; isOpen: boolean; onClose: () => void; onSave: (s: Student) => void }) {
  const crm = useCRM();
  const [mentor, setMentor] = useState(student?.mentor || 'Rahul Sharma');
  if (!student) return null;
  const handleSave = () => { onSave({ ...student, mentor }); showToast(`Mentor assigned to ${student.name}`); onClose(); };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Assign Mentor`} subtitle={student.name} icon={<UserPlus />} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Assign</button></>} maxWidth="400px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PremiumSelect label="Mentor" name="mentor" value={mentor} onChange={e => setMentor(e.target.value)} options={crm.users.map(u => u.name)} />
      </div>
    </PremiumModal>
  );
}

function ViewAttendanceModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Attendance`} subtitle={student.name} icon={<Calendar />} footer={<button className="secondary-btn" onClick={onClose}>Close</button>} maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{student.attendance}%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Attendance</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{Math.floor(student.attendance * 0.9)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Present Days</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{90 - Math.floor(student.attendance * 0.9)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Absent Days</div>
          </div>
        </div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
          [Monthly Attendance Chart Placeholder]
        </div>
      </div>
    </PremiumModal>
  );
}

function ViewAssignmentsModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Assignments`} subtitle={student.name} icon={<BookOpen />} footer={<button className="secondary-btn" onClick={onClose}>Close</button>} maxWidth="700px">
      <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Assignment Name</th>
            <th style={{ padding: '12px' }}>Submission Date</th>
            <th style={{ padding: '12px' }}>Marks</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {['HTML/CSS Basics', 'JavaScript DOM', 'React Components', 'Node.js API'].map((a, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '12px' }}>{a}</td>
              <td style={{ padding: '12px' }}>{new Date(Date.now() - (10-i)*86400000).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>{80 + Math.floor(Math.random()*20)}/100</td>
              <td style={{ padding: '12px' }}><span style={{ color: '#10b981', fontWeight: 600 }}>Graded</span></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </PremiumModal>
  );
}

function ViewProjectsModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Projects`} subtitle={student.name} icon={<Briefcase />} footer={<button className="secondary-btn" onClick={onClose}>Close</button>} maxWidth="700px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { name: 'E-commerce Frontend', tech: 'React, Redux, Tailwind', status: 'Completed', review: 'Excellent component structure.' },
          { name: 'Task Management API', tech: 'Node.js, Express, MongoDB', status: 'Under Review', review: 'Pending mentor feedback.' },
        ].map((p, i) => (
          <div key={i} style={{ padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{p.name}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Technology:</strong> {p.tech}</div>
              <div><strong>Status:</strong> {p.status}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Mentor Review:</strong> {p.review}</div>
            </div>
          </div>
        ))}
      </div>
    </PremiumModal>
  );
}

function PaymentDetailsModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Payment Details`} subtitle={student.name} icon={<CreditCard />} footer={<button className="secondary-btn" onClick={onClose}>Close</button>} maxWidth="700px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{student.totalFee.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Fee</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>₹{student.paidAmount.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paid Amount</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>₹{(student.totalFee - student.paidAmount).toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending Amount</div>
          </div>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '12px' }}>Payment Timeline</h4>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Mode</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '12px' }}>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>₹50,000</td>
                <td style={{ padding: '12px' }}>UPI</td>
                <td style={{ padding: '12px' }}>
                  <button className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => showToast('Receipt Downloaded')}>Download Receipt</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="primary-btn" onClick={() => showToast('Invoice Generated successfully')}>Generate Invoice</button>
        </div>
      </div>
    </PremiumModal>
  );
}

function ViewDocumentsModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Documents`} subtitle={student.name} icon={<FileText />} footer={<button className="secondary-btn" onClick={onClose}>Close</button>} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {['Resume', 'Aadhaar', 'Degree Certificate', 'Marks Cards', 'Offer Letter', 'Certificates'].map(doc => (
          <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
            <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> {doc}.pdf</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>Preview</button>
              <button className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>Download</button>
              <button className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>Upload</button>
            </div>
          </div>
        ))}
      </div>
    </PremiumModal>
  );
}

function UploadDocumentsModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Upload Documents`} subtitle={student.name} icon={<UploadCloud />} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={() => { showToast('Uploaded'); onClose(); }}>Upload All</button></>} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {['Resume', 'Aadhaar', 'Degree Certificate', 'Marks Cards', 'Offer Letter', 'Certificates'].map(doc => (
          <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
            <span style={{ fontWeight: 500 }}>{doc}</span>
            <input type="file" style={{ fontSize: '0.85rem' }} />
          </div>
        ))}
      </div>
    </PremiumModal>
  );
}


// --- Component Utilities ---
const StatusBadge = ({ status }: { status: string }) => {
  let bg = '#e2e8f0', color = '#475569';
  if (status === 'Active' || status === 'Enrolled' || status === 'Placed') { bg = '#dcfce7'; color = '#166534'; }
  else if (status === 'Pending Documents' || status === 'Pending Payment') { bg = '#fef3c7'; color = '#92400e'; }
  else if (status === 'Orientation Scheduled' || status === 'In Progress' || status === 'Internship') { bg = '#e0e7ff'; color = '#3730a3'; }
  else if (status === 'Placement Ready') { bg = '#f3e8ff'; color = '#6b21a8'; }
  else if (status === 'Alumni') { bg = '#f1f5f9'; color = '#0f172a'; }
  else if (status === 'On Hold') { bg = '#fecaca'; color = '#991b1b'; }
  return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: bg, color: color }}>{status}</span>;
};

const PaymentBadge = ({ status }: { status: string }) => {
  let bg = '#e2e8f0', color = '#475569';
  if (status === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
  else if (status === 'Pending') { bg = '#fef3c7'; color = '#92400e'; }
  else if (status === 'Overdue') { bg = '#fee2e2'; color = '#991b1b'; }
  return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: bg, color: color }}>{status}</span>;
};

function AddStudentModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (student: Student) => void }) {
  const crm = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'Full Stack Development',
    batch: 'FSD-2026-A',
    mentor: 'Arjun Kumar',
    totalFee: 75000,
    paidAmount: 25000,
    paymentStatus: 'Partial',
    status: 'Active',
    qualification: 'B.Tech CS',
    city: 'Bangalore',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name || 'New Student',
      email: formData.email || 'student@example.com',
      phone: formData.phone || '+91 98765 43210',
      program: formData.program,
      batch: formData.batch,
      mentor: formData.mentor,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: formData.status as any,
      qualification: formData.qualification,
      city: formData.city,
      totalFee: Number(formData.totalFee),
      paidAmount: Number(formData.paidAmount),
      paymentStatus: formData.paymentStatus as any,
      progress: 0,
      attendance: 100,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      dob: '2001-05-15',
      gender: 'Male',
      placementStatus: 'In Training',
      notes: '',
      documents: [],
    };

    onAdd(newStudent);
    showToast(`🎉 Student ${newStudent.name} added successfully!`);
    onClose();
  };

  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title="Add New Student" icon={<UserPlus />}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <PremiumInput label="Full Name *" name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PremiumInput label="Email *" name="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <PremiumInput label="Phone *" name="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PremiumSelect label="Program" name="program" value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} options={['Full Stack Development', 'Data Science', 'UI/UX Design']} />
          <PremiumInput label="Batch" name="batch" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PremiumInput label="Total Fee (₹)" name="totalFee" type="number" value={formData.totalFee} onChange={e => setFormData({ ...formData, totalFee: Number(e.target.value) })} />
          <PremiumInput label="Paid Amount (₹)" name="paidAmount" type="number" value={formData.paidAmount} onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">Save Student</button>
        </div>
      </form>
    </PremiumModal>
  );
}

// --- Main Page ---
export default function StudentsPage() {
  const crm = useCRM();
  const { students: crmStudents } = useCRM();
  const allStudents = [...crmStudents, ...studentsData]; // Merge context and static mock data for demo
  const [isMounted, setIsMounted] = useState(false);
  const [localData, setLocalData] = useState<Student[]>(studentsData);
  const [filteredData, setFilteredData] = useState<Student[]>(studentsData);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Modals state
  const [activeModal, setActiveModal] = useState<'view' | 'edit' | 'delete' | 'add' | 'status' | 'mentor' | 'attendance' | 'assignments' | 'projects' | 'payments' | 'upload' | 'view_docs' | null | 'bulk_add_to_list' | 'bulk_mentor' | 'bulk_batch' | 'bulk_followup' | 'bulk_email' | 'bulk_whatsapp' | 'bulk_delete'>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const toggleStudentSelection = (id: string) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleAllSelection = () => setSelectedStudents(prev => prev.length === paginatedData.length ? [] : paginatedData.map(s => s.id));
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setLocalData(studentsData);
    setFilteredData(studentsData);
  }, []);

  const openModal = (type: string, student: Student | null = null) => {
    setSelectedStudent(student);
    setActiveModal(type as any);
    setActiveMenuId(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedStudent(null);
  };

  const updateStudent = (updatedStudent: Student) => {
    setLocalData(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setFilteredData(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleBulkUpdate = (ids: string[], updates: Partial<Student>) => {
    setLocalData(prev => {
      const updated = prev.map(s => ids.includes(s.id) ? { ...s, ...updates } : s);
      setFilteredData(updated);
      return updated;
    });
    setSelectedStudents([]);
    setActiveModal(null);
  };
  
  const handleBulkDelete = () => {
    setLocalData(prev => {
      const remaining = prev.filter(s => !selectedStudents.includes(s.id));
      setFilteredData(remaining);
      return remaining;
    });
    setSelectedStudents([]);
    setActiveModal(null);
    showToast(`${selectedStudents.length} students deleted`);
  };

  const handleExport = () => {
    const exportedStudents = localData.filter(s => selectedStudents.includes(s.id));
    const header = ['ID', 'Name', 'Phone', 'Email', 'DOB', 'Gender', 'Address', 'Qualification', 'College', 'Graduation Year', 'Technical Skills', 'Course', 'Batch', 'Admission Date', 'Enrollment ID', 'Attendance', 'Academic Progress', 'Fee Status', 'Internship Status', 'Certificate Status', 'Placement Status', 'Mentor', 'Counselor'].join(',');
    const rows = exportedStudents.map(s => [
      s.id, s.name, s.phone, s.email, s.dob || '', s.gender || '', `"${s.address || ''}"`, s.qualification || '', `"${s.college || ''}"`, s.graduationYear || '', s.technicalSkills || '', s.program || '', s.batch || '', s.enrollmentDate || '', s.enrollmentId || '', s.attendance || 0, s.progress || 0, s.paymentStatus || '', s.internshipStatus || '', s.certificateStatus || '', s.placementStatus || '', s.mentor || '', s.counselor || ''
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selectedStudents.length} students`);
  };

  const deleteStudent = (studentId: string) => {
    setLocalData(prev => prev.filter(s => s.id !== studentId));
    setFilteredData(prev => prev.filter(s => s.id !== studentId));
    showToast('Student deleted successfully', '#ef4444');
    closeModal();
  };

  const generateProfilePDF = (student: Student) => {
    const htmlContent = `
      <html><head><title>Student Profile: ${student.name}</title>
      <style>body{font-family:sans-serif;padding:40px;color:#333;line-height:1.6}h1,h2{color:#0f172a}.card{border:1px solid #e2e8f0;padding:20px;border-radius:8px;margin-bottom:20px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}img{width:150px;border-radius:8px}</style>
      </head><body>
      <h1>Student Profile</h1>
      <div class="card grid">
        <div>
          <h2>${student.name}</h2>
          <p><strong>ID:</strong> ${student.id}</p>
          <p><strong>Program:</strong> ${student.program} (${student.batch})</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone}</p>
        </div>
        <div><img src="${student.photo}" /></div>
      </div>
      <div class="card grid">
        <div>
          <h2>Academic & Admission</h2>
          <p><strong>Status:</strong> ${student.status}</p>
          <p><strong>Mentor:</strong> ${student.mentor}</p>
          <p><strong>Qualification:</strong> ${student.qualification}</p>
          <p><strong>Attendance:</strong> ${student.attendance}%</p>
        </div>
        <div>
          <h2>Payment & Placement</h2>
          <p><strong>Fee Status:</strong> ${student.paymentStatus} (₹${student.paidAmount} / ₹${student.totalFee})</p>
          <p><strong>Placement:</strong> ${student.placementStatus} ${student.company ? `(${student.company})` : ''}</p>
        </div>
      </div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name.replace(/\s+/g, '_')}_Profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Profile downloaded successfully');
    setActiveMenuId(null);
  };

  const executeAction = (action: string, student: Student) => {
    setActiveMenuId(null);
    if (action === 'call') window.open(`tel:${student.phone}`);
    else if (action === 'whatsapp') window.open(`https://wa.me/${student.phone?.replace(/[^0-9]/g, '')}`, '_blank');
    else if (action === 'email') window.open(`mailto:${student.email}`);
    else if (action === 'print') {
      // Simulate print
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`<h1>${student.name} - Profile</h1><p>ID: ${student.id}</p><p>Status: ${student.status}</p><p>Batch: ${student.batch}</p><p>Phone: ${student.phone}</p>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  if (!isMounted) return null;

  const handleAddStudent = (newStudent: Student) => {
    setLocalData(prev => [newStudent, ...prev]);
    setFilteredData(prev => [newStudent, ...prev]);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Modals */}
      {activeModal === 'view' && selectedStudent && <Student360View student={selectedStudent} onClose={closeModal} />}
      <EditStudentModal isOpen={activeModal === 'edit'} onClose={closeModal} student={selectedStudent} onSave={updateStudent} />
      <UpdateStatusModal isOpen={activeModal === 'status'} onClose={closeModal} student={selectedStudent} onSave={updateStudent} />
      <AssignMentorModal isOpen={activeModal === 'mentor'} onClose={closeModal} student={selectedStudent} onSave={updateStudent} />
      <ViewAttendanceModal isOpen={activeModal === 'attendance'} onClose={closeModal} student={selectedStudent} />
      <ViewAssignmentsModal isOpen={activeModal === 'assignments'} onClose={closeModal} student={selectedStudent} />
      <ViewProjectsModal isOpen={activeModal === 'projects'} onClose={closeModal} student={selectedStudent} />
      <PaymentDetailsModal isOpen={activeModal === 'payments'} onClose={closeModal} student={selectedStudent} />
      <UploadDocumentsModal isOpen={activeModal === 'upload'} onClose={closeModal} student={selectedStudent} />
      <ViewDocumentsModal isOpen={activeModal === 'view_docs'} onClose={closeModal} student={selectedStudent} />
      <PremiumModal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Student" icon={<Trash2 />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{ background: 'var(--status-rejected)' }} onClick={() => selectedStudent && deleteStudent(selectedStudent.id)}>Delete</button></>} maxWidth="400px">
        <p>Are you sure you want to permanently delete student <strong>{selectedStudent?.name}</strong>? This action cannot be undone.</p>
      </PremiumModal>

      <AddStudentModal isOpen={activeModal === 'add'} onClose={closeModal} onAdd={handleAddStudent} />
      {/* BULK MODALS */}
      <PremiumModal isOpen={activeModal === 'bulk_add_to_list'} onClose={closeModal} title={`Add ${selectedStudents.length} Students to List`} icon={<List />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { showToast(`Added ${selectedStudents.length} students to list`); closeModal(); setSelectedStudents([]); }}>Add to List</button></>} maxWidth="400px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumSelect label="Select List" name="list" value="" onChange={() => {}} options={['Hot Leads', 'Weekend Batch Prospects', 'Needs Follow-up', 'Placed Students']} />
          <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--text-secondary)' }}>or</div>
          <PremiumInput label="Create New List" name="newList" value="" onChange={() => {}} placeholder="List name" />
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_mentor'} onClose={closeModal} title={`Assign Mentor to ${selectedStudents.length} Students`} icon={<UserPlus />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { handleBulkUpdate(selectedStudents, { mentor: 'Sneha Reddy' }); showToast(`Mentor assigned to ${selectedStudents.length} students`); }}>Assign</button></>} maxWidth="400px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumSelect label="Mentor" name="mentor" value="Sneha Reddy" onChange={() => {}} options={crm.users.map(u => u.name)} />
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_batch'} onClose={closeModal} title={`Assign Batch to ${selectedStudents.length} Students`} icon={<Users />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { handleBulkUpdate(selectedStudents, { batch: 'FSD-2026-B' }); showToast(`Batch assigned to ${selectedStudents.length} students`); }}>Assign</button></>} maxWidth="400px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumSelect label="Select Batch" name="batch" value="FSD-2026-B" onChange={() => {}} options={['FSD-2026-A', 'FSD-2026-B', 'FSD-2026-C', 'FSD-Weekend-01']} />
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_followup'} onClose={closeModal} title={`Add Follow-up for ${selectedStudents.length} Students`} icon={<Calendar />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { showToast(`Follow-up created for ${selectedStudents.length} students`); closeModal(); setSelectedStudents([]); }}>Save Follow-up</button></>} maxWidth="500px">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <PremiumInput label="Follow-up Date" name="date" type="date" value="" onChange={() => {}} />
          <PremiumInput label="Follow-up Time" name="time" type="time" value="" onChange={() => {}} />
          <PremiumSelect label="Follow-up Type" name="type" value="Call" onChange={() => {}} options={['Call', 'WhatsApp', 'Email', 'Meeting', 'Task']} />
          <PremiumSelect label="Priority" name="priority" value="High" onChange={() => {}} options={['High', 'Medium', 'Low']} />
          <PremiumSelect label="Assigned To" name="assigned" value="Rahul Sharma" onChange={() => {}} options={crm.users.map(u => u.name)} />
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumInput label="Notes / Follow-up Reason" name="notes" value="" onChange={() => {}} placeholder="Enter details..." />
          </div>
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_email'} onClose={closeModal} title={`Send Email to ${selectedStudents.length} Students`} icon={<Mail />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { showToast(`Email sent to ${selectedStudents.length} students`); closeModal(); setSelectedStudents([]); }}>Send Email</button></>} maxWidth="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PremiumInput label="Subject" name="subject" value="" onChange={() => {}} placeholder="Email Subject" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Message</label>
            <textarea style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minHeight: '150px' }} placeholder="Type your message here..."></textarea>
          </div>
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_whatsapp'} onClose={closeModal} title={`Send WhatsApp to ${selectedStudents.length} Students`} icon={<MessageCircle />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={() => { showToast(`WhatsApp message sent to ${selectedStudents.length} students`); closeModal(); setSelectedStudents([]); }}>Send Message</button></>} maxWidth="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#25D366' }}>
            <MessageCircle size={24} />
            <div style={{ fontWeight: 600 }}>WhatsApp Integration Not Configured</div>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Please configure your WhatsApp Business API credentials in Settings to enable bulk messaging.
          </div>
        </div>
      </PremiumModal>

      <PremiumModal isOpen={activeModal === 'bulk_delete'} onClose={closeModal} title={`Delete ${selectedStudents.length} Students`} icon={<Trash2 />} footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{ background: 'var(--status-rejected)' }} onClick={handleBulkDelete}>Delete</button></>} maxWidth="400px">
        <div style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'}? This action cannot be undone.
        </div>
      </PremiumModal>

      {activeModal === 'view' && selectedStudent && <Student360View student={selectedStudent} onClose={closeModal} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Students</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all enrolled students, track attendance, assignments, and placement progress.</p>
        </div>
        <button
          onClick={() => openModal('add')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}
        >
          <UserPlus size={18} /> + Add New Student
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <motion.div whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Total Enrolled</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0' }}>{localData.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>+12% vs last month</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Avg Course Progress</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0' }}>
              {localData.length ? Math.round(localData.reduce((acc, s) => acc + (s.progress || 0), 0) / localData.length) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Across all programs</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Placed & Ready</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0' }}>
              {localData.filter(s => s.status === 'Placed' || (s.progress && s.progress >= 80)).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 500 }}>Career track eligible</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Total Fees Collected</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0' }}>
              ₹{(localData.reduce((acc, s) => acc + (s.paidAmount || 0), 0) / 100000).toFixed(1)}L
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>92% collection rate</div>
          </div>
        </motion.div>
      </div>

      <DataToolbar 
        data={localData} 
        onFilteredDataChange={setFilteredData}
        searchKeys={['name', 'id', 'email', 'phone', 'batch']}
        searchPlaceholder="Search students by name, ID, phone, email or batch..."
        exportFilename="students_export"
        filterOptions={[
            { key: 'createdAt', label: 'Date', type: 'date' as const },
            { key: 'program', label: 'Program', type: 'select' as const, options: ['Full Stack Development', 'Data Science', 'UI/UX Design'] },
            { key: 'batch', label: 'Batch', type: 'select' as const, options: ['Cohort 1', 'Cohort 2', 'Cohort 3'] },
            { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Completed', 'Dropped'] },
            { key: 'counselor', label: 'Counselor', type: 'select' as const, options: ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'] },
            { key: 'city', label: 'City', type: 'select' as const, options: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida'] },
            { key: 'paymentStatus', label: 'Payment Status', type: 'select' as const, options: ['Pending', 'Partial', 'Completed'] },
            { key: 'priority', label: 'Priority', type: 'select' as const, options: ['High', 'Medium', 'Low'] },
            { key: 'experience', label: 'Experience', type: 'select' as const, options: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'] },
            { key: 'currentCompany', label: 'Company', type: 'select' as const, options: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Tech Mahindra', 'None'] }
          ]}
      />

            {selectedStudents.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--primary-color)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'} selected</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedStudents.length === 1 && (
              <button onClick={() => {
                const s = paginatedData.find(x => x.id === selectedStudents[0]);
                if (s) {
                  setSelectedStudent(s);
                  setActiveModal('view');
                }
              }} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>View Details</button>
            )}
                        <button onClick={() => setActiveModal('bulk_add_to_list')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Add to List</button>
            <button onClick={() => setActiveModal('bulk_mentor')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Assign Mentor</button>
            <button onClick={() => setActiveModal('bulk_batch')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Assign Batch</button>
            <button onClick={() => setActiveModal('bulk_followup')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Add Follow-up</button>
            <button onClick={() => setActiveModal('bulk_email')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Send Email</button>
            <button onClick={() => setActiveModal('bulk_whatsapp')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>WhatsApp</button>
            <button onClick={handleExport} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Export</button>
            <button onClick={() => setActiveModal('bulk_delete')} className="secondary-btn" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', color: '#dc2626', borderColor: '#fee2e2', background: '#fee2e2' }}>Delete</button>
          </div>
        </div>
      )}
<div className="glass-panel">
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
                        <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <th style={{ padding: '16px' }}><input type="checkbox" checked={paginatedData.length > 0 && selectedStudents.length === paginatedData.length} onChange={toggleAllSelection} style={{ cursor: 'pointer' }} /></th>
              <th style={{ padding: '16px' }}>Student Name</th>
              <th style={{ padding: '16px' }}>Enrollment ID</th>
              <th style={{ padding: '16px' }}>Qualification</th>
              <th style={{ padding: '16px' }}>College</th>
              <th style={{ padding: '16px' }}>Graduation Year</th>
              <th style={{ padding: '16px' }}>Mentor</th>
              <th style={{ padding: '16px' }}>Counselor</th>
              <th style={{ padding: '16px' }}>Course / Program</th>
              <th style={{ padding: '16px' }}>Batch</th>
              <th style={{ padding: '16px' }}>Admission Date</th>
              <th style={{ padding: '16px' }}>Attendance %</th>
              <th style={{ padding: '16px' }}>Academic Progress %</th>
              <th style={{ padding: '16px' }}>Fee Status</th>
              <th style={{ padding: '16px' }}>Internship Status</th>
              <th style={{ padding: '16px' }}>Placement Status</th>
              <th style={{ padding: '16px' }}>Certificate Status</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(student => (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px' }}><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} style={{ cursor: 'pointer' }} /></td>
                <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => { setSelectedStudent(student); setActiveModal('view'); }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={student.photo} alt={student.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.id} • {student.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>{student.enrollmentId || student.id}</td>
                <td style={{ padding: '16px' }}>{student.qualification || '-'}</td>
                <td style={{ padding: '16px' }}>{student.college || '-'}</td>
                <td style={{ padding: '16px' }}>{student.graduationYear || '-'}</td>
                <td style={{ padding: '16px' }}>{student.mentor || '-'}</td>
                <td style={{ padding: '16px' }}>{student.counselor || '-'}</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>{student.program}</td>
                <td style={{ padding: '16px' }}>{student.batch}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>{student.attendance || 0}%</td>
                <td style={{ padding: '16px' }}>{student.progress || 0}%</td>
                <td style={{ padding: '16px' }}><PaymentBadge status={student.paymentStatus} /></td>
                <td style={{ padding: '16px' }}>{student.internshipStatus || '-'}</td>
                <td style={{ padding: '16px' }}>{student.placementStatus || '-'}</td>
                <td style={{ padding: '16px' }}>{student.certificateStatus || '-'}</td>
                <td style={{ padding: '16px' }}><StatusBadge status={student.status} /></td>
              </tr>
            ))}
          </tbody>
        </table></div>

        {/* 10 Items / Page Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Previous
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
