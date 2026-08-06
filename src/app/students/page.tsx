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
  DownloadCloud, Printer, Trash2, XCircle
} from 'lucide-react';

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

function ViewStudentModal({ student, isOpen, onClose }: { student: Student | null; isOpen: boolean; onClose: () => void }) {
  if (!student) return null;
  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title={`Student Profile`} subtitle={student.id} icon={<User />} width="800px">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div>
          <img src={student.photo} alt={student.name} style={{ width: '150px', height: '150px', borderRadius: '12px', marginBottom: '16px', objectFit: 'cover' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '4px' }}>{student.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{student.email}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{student.phone}</p>
          <StatusBadge status={student.status} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <PremiumSection title="Personal Information" icon={<User size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Date of Birth:</strong> {student.dob}</div>
              <div><strong>Gender:</strong> {student.gender}</div>
              <div><strong>City:</strong> {student.city}, {student.state}</div>
            </div>
          </PremiumSection>
          
          <PremiumSection title="Academic Details" icon={<BookOpen size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Qualification:</strong> {student.qualification}</div>
              <div><strong>College:</strong> {student.college || 'N/A'}</div>
              <div><strong>Graduation:</strong> {student.graduationYear || 'N/A'} (CGPA: {student.cgpa || 'N/A'})</div>
            </div>
          </PremiumSection>

          <PremiumSection title="Program Details" icon={<Briefcase size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Program:</strong> {student.program}</div>
              <div><strong>Batch:</strong> {student.batch} (Mentor: {student.mentor})</div>
              <div><strong>Attendance:</strong> {student.attendance}% | <strong>Completion:</strong> {student.progress}%</div>
            </div>
          </PremiumSection>

          <PremiumSection title="Payment Details" icon={<CreditCard size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div><strong>Total Fee:</strong> ₹{student.totalFee.toLocaleString()}</div>
              <div><strong>Paid Amount:</strong> ₹{student.paidAmount.toLocaleString()}</div>
              <div><strong>Payment Status:</strong> {student.paymentStatus}</div>
            </div>
          </PremiumSection>

        </div>
      </div>
    </SlidePanel>
  );
}

function EditStudentModal({ student, isOpen, onClose, onSave }: { student: Student | null; isOpen: boolean; onClose: () => void; onSave: (s: Student) => void }) {
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
        <PremiumSelect label="Mentor" name="mentor" value={formData.mentor || ''} onChange={handleChange} options={['Rahul Sharma', 'Sneha Reddy', 'Arjun Kumar', 'Priya Sharma']} />
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
  const [mentor, setMentor] = useState(student?.mentor || 'Rahul Sharma');
  if (!student) return null;
  const handleSave = () => { onSave({ ...student, mentor }); showToast(`Mentor assigned to ${student.name}`); onClose(); };
  return (
    <PremiumModal isOpen={isOpen} onClose={onClose} title={`Assign Mentor`} subtitle={student.name} icon={<UserPlus />} footer={<><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={handleSave}>Assign</button></>} maxWidth="400px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PremiumSelect label="Mentor" name="mentor" value={mentor} onChange={e => setMentor(e.target.value)} options={['Rahul Sharma', 'Sneha Reddy', 'Arjun Kumar', 'Priya Sharma']} />
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
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
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
      </table>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
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
          </table>
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

// --- Main Page ---
export default function StudentsPage() {
  const { students: crmStudents } = useCRM();
  const allStudents = [...crmStudents, ...studentsData]; // Merge context and static mock data for demo
  const [isMounted, setIsMounted] = useState(false);
  const [localData, setLocalData] = useState<Student[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setLocalData(studentsData);
    setFilteredData(studentsData);
  }, []);

  const openModal = (type: string, student: Student | null = null) => {
    setSelectedStudent(student);
    setActiveModal(type);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Modals */}
      <ViewStudentModal isOpen={activeModal === 'view'} onClose={closeModal} student={selectedStudent} />
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


      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Students</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage all enrolled students, track attendance, assignments, and placement progress.</p>
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

      <div className="glass-panel">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Student</th>
              <th style={{ padding: '16px' }}>Program / Batch</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Enrollment Date</th>
              <th style={{ padding: '16px' }}>Payment</th>
              <th style={{ padding: '16px' }}>Progress</th>
              <th style={{ padding: '16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={student.photo} alt={student.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.id} • {student.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 500 }}>{student.program}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.batch}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <StatusBadge status={student.status} />
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                  {new Date(student.enrollmentDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <PaymentBadge status={student.paymentStatus} />
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--glass-border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${student.progress}%`, background: 'var(--primary-color)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: '35px' }}>{student.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', position: 'relative' }}>
                  <ActionMenu 
                    isOpen={activeMenuId === student.id}
                    onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === student.id ? null : student.id); }}
                    onClose={() => setActiveMenuId(null)}
                    items={[
                      { label: 'View Student Profile', icon: <User size={16} />, onClick: () => openModal('view', student) },
                      { label: 'Edit Student', icon: <Edit size={16} />, onClick: () => openModal('edit', student) },
                      { label: 'Update Status', icon: <RefreshCw size={16} />, onClick: () => openModal('status', student) },
                      { label: 'Assign Mentor', icon: <UserPlus size={16} />, onClick: () => openModal('mentor', student) },
                      { divider: true, label: '' },
                      { label: 'View Attendance', icon: <Calendar size={16} />, onClick: () => openModal('attendance', student) },
                      { label: 'View Assignments', icon: <BookOpen size={16} />, onClick: () => openModal('assignments', student) },
                      { label: 'View Projects', icon: <Briefcase size={16} />, onClick: () => openModal('projects', student) },
                      { label: 'Payment Details', icon: <CreditCard size={16} />, onClick: () => openModal('payments', student) },
                      { divider: true, label: '' },
                      { label: 'Upload Documents', icon: <UploadCloud size={16} />, onClick: () => openModal('upload', student) },
                      { label: 'View Documents', icon: <FileText size={16} />, onClick: () => openModal('view_docs', student) },
                      { divider: true, label: '' },
                      { label: 'Call Student', icon: <PhoneCall size={16} />, onClick: () => executeAction('call', student) },
                      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageCircle size={16} />, onClick: () => executeAction('whatsapp', student) },
                      { label: 'Send Email', icon: <Mail size={16} />, onClick: () => executeAction('email', student) },
                      { divider: true, label: '' },
                      { label: 'Download Student Profile', icon: <DownloadCloud size={16} />, onClick: () => generateProfilePDF(student) },
                      { label: 'Print Profile', icon: <Printer size={16} />, onClick: () => executeAction('print', student) },
                      { label: 'Delete Student', icon: <Trash2 size={16} />, color: 'var(--status-rejected)', onClick: () => openModal('delete', student) }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
