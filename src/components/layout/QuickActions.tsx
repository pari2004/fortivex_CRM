'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserPlus, FileText, PhoneCall, CalendarPlus, UploadCloud, X, Calendar as CalendarIcon, Clock, Video, Monitor, Building } from 'lucide-react';
import styles from './layout.module.css';
import { PremiumModal } from '@/components/common/PremiumModal';

import { useCRM } from '@/contexts/CRMContext';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { addLead, addApplication, addStudent, logCall, scheduleDemo, uploadDocument } = useCRM();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActionClick = (modalName: string) => {
    setIsOpen(false);
    setActiveModal(modalName);
  };

  const closeModal = () => setActiveModal(null);

  const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'UI/UX Design', 'Digital Marketing', 'Java Full Stack', 'Python Full Stack', 'MERN Stack', 'MEAN Stack', 'React Development', 'Mobile App Development'];
  const degrees = ['B.E', 'B.Tech', 'BCA', 'MCA', 'B.Sc Computer Science', 'B.Sc IT', 'B.Com', 'M.Com', 'BBA', 'MBA', 'BA', 'MA', 'Diploma', 'Polytechnic', 'PUC', '10th Pass', 'M.Tech', 'M.Sc', 'PhD', 'Other'];
  const leadSources = ['Website', 'Instagram', 'Facebook', 'LinkedIn', 'Google Ads', 'Referral', 'Walk-in', 'WhatsApp', 'YouTube', 'Phone Call'];
  const leadStatuses = ['New', 'Contacted', 'Interested', 'Demo Scheduled', 'Follow-up', 'Converted', 'Lost'];

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addLead({
      name: fd.get('name') as string,
      mobile: fd.get('mobile') as string,
      email: fd.get('email') as string,
      program: fd.get('program') as string,
      source: fd.get('source') as string,
      status: fd.get('status') as string,
      priority: fd.get('priority') as string,
      counselor: fd.get('counselor') as string,
      date: new Date().toISOString().split('T')[0]
    });
    showToast("Lead successfully added!");
    closeModal();
  };

  const handleAddApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addApplication({
      name: fd.get('name') as string,
      mobile: fd.get('mobile') as string,
      email: fd.get('email') as string,
      program: fd.get('program') as string,
      status: fd.get('status') as string,
      counselor: fd.get('counselor') as string,
      date: new Date().toISOString().split('T')[0]
    });
    showToast("Application created successfully!");
    closeModal();
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addStudent({
      name: fd.get('name') as string,
      studentId: `FX${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
      mobile: fd.get('mobile') as string,
      email: fd.get('email') as string,
      program: fd.get('program') as string,
      batch: fd.get('batch') as string,
      fee: fd.get('fee') as string,
      paymentStatus: fd.get('paymentStatus') as string,
      date: new Date().toISOString().split('T')[0]
    });
    showToast("Student admitted successfully!");
    closeModal();
  };

  const handleLogCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    logCall({
      student: fd.get('student') as string,
      mobile: fd.get('mobile') as string,
      type: fd.get('type') as string,
      duration: fd.get('duration') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      counselor: fd.get('counselor') as string,
      outcome: fd.get('outcome') as string,
      notes: fd.get('notes') as string
    });
    showToast("Call logged successfully!");
    closeModal();
  };

  const handleScheduleDemo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    scheduleDemo({
      student: fd.get('student') as string,
      email: fd.get('email') as string,
      mobile: fd.get('mobile') as string,
      program: fd.get('program') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      faculty: fd.get('faculty') as string,
      link: fd.get('link') as string
    });
    showToast("Demo scheduled. Google Calendar event created & Email sent!");
    closeModal();
  };

  const handleUploadDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    uploadDocument({
      student: fd.get('student') as string,
      studentId: fd.get('studentId') as string,
      type: fd.get('type') as string,
    });
    showToast("Document uploaded successfully!");
    closeModal();
  };

  const actions = [
    { name: 'Add Lead', icon: <UserPlus size={16} />, color: 'var(--primary-color)', action: () => handleActionClick('AddLead') },
    { name: 'Create Application', icon: <FileText size={16} />, color: '#10b981', action: () => handleActionClick('CreateApplication') },
    { name: 'Add Student', icon: <UserPlus size={16} />, color: '#3b82f6', action: () => handleActionClick('AddStudent') },
    { name: 'Log Call', icon: <PhoneCall size={16} />, color: '#f59e0b', action: () => handleActionClick('LogCall') },
    { name: 'Schedule Demo', icon: <CalendarIcon size={16} />, color: '#ec4899', action: () => handleActionClick('ScheduleDemo') },
    { name: 'Upload Document', icon: <UploadCloud size={16} />, color: '#06b6d4', action: () => handleActionClick('UploadDocument') },
    { name: 'Open Google Calendar', icon: <CalendarPlus size={16} />, color: '#8b5cf6', action: () => window.open('https://calendar.google.com/', '_blank') },
  ];

  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-color)', color: 'white' }} 
          whileTap={{ scale: 0.9 }} 
          className={styles.iconButton}
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            backgroundColor: 'var(--primary-light)', 
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)'
          }}
        >
          <Plus size={20} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '12px',
                width: '220px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                zIndex: 100
              }}
            >
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '8px', textTransform: 'uppercase' }}>Quick Actions</div>
                {actions.map((action, idx) => {
                  const commonStyle = {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    textAlign: 'left' as const
                  };

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ backgroundColor: 'var(--bg-tertiary)', x: 4 }}
                      onClick={action.action}
                      style={commonStyle}
                    >
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', 
                        backgroundColor: `${action.color}15`, color: action.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {action.icon}
                      </div>
                      <span style={{ fontWeight: 500 }}>{action.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              backgroundColor: 'var(--success-color, #10b981)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '99px',
              fontWeight: 500,
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      {activeModal === 'AddLead' && (
        <PremiumModal isOpen={true} title="Add New Lead" icon={<UserPlus size={24} />} onClose={closeModal}>
          <form onSubmit={handleAddLead}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student Name</label><input name="name" required /></div>
              <div className={styles.formGroup}><label>Mobile Number</label><input name="mobile" required /></div>
              <div className={styles.formGroup}><label>Alternate Number</label><input name="alternate" /></div>
              <div className={styles.formGroup}><label>Email</label><input type="email" name="email" required /></div>
              <div className={styles.formGroup}><label>Gender</label><select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div className={styles.formGroup}><label>College</label><input name="college" /></div>
              <div className={styles.formGroup}><label>Degree / Program</label><select name="degree">{degrees.map(d => <option key={d}>{d}</option>)}</select></div>
              <div className={styles.formGroup}><label>Year of Study</label><select name="year"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Passed Out</option></select></div>
              <div className={styles.formGroup}><label>City</label><input name="city" /></div>
              <div className={styles.formGroup}><label>State</label><input name="state" /></div>
              <div className={styles.formGroup}><label>Lead Source</label><select name="source">{leadSources.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className={styles.formGroup}><label>Interested Course</label><select name="program">{programs.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className={styles.formGroup}><label>Counselor</label><input name="counselor" required /></div>
              <div className={styles.formGroup}><label>Priority</label><select name="priority"><option>High</option><option>Medium</option><option>Low</option></select></div>
              <div className={styles.formGroup}><label>Status</label><select name="status">{leadStatuses.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '20px' }}><label>Notes</label><textarea name="notes" rows={3}></textarea></div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}

      {activeModal === 'CreateApplication' && (
        <PremiumModal isOpen={true} title="New Application" icon={<FileText size={24} />} onClose={closeModal}>
          <form onSubmit={handleAddApplication}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student Name</label><input name="name" required /></div>
              <div className={styles.formGroup}><label>Mobile Number</label><input name="mobile" required /></div>
              <div className={styles.formGroup}><label>Email</label><input type="email" name="email" required /></div>
              <div className={styles.formGroup}><label>Program</label><select name="program">{programs.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className={styles.formGroup}><label>Qualification</label><select name="qualification">{degrees.map(d => <option key={d}>{d}</option>)}</select></div>
              <div className={styles.formGroup}><label>College</label><input name="college" /></div>
              <div className={styles.formGroup}><label>Graduation Year</label><input name="graduationYear" type="number" /></div>
              <div className={styles.formGroup}><label>Application Date</label><input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
              <div className={styles.formGroup}><label>Counselor</label><input name="counselor" required /></div>
              <div className={styles.formGroup}><label>Application Status</label><select name="status"><option>Draft</option><option>Submitted</option><option>Under Review</option><option>Approved</option><option>Rejected</option><option>Enrolled</option></select></div>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '20px' }}><label>Documents Uploaded</label><input type="file" multiple /></div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}

      {activeModal === 'AddStudent' && (
        <PremiumModal isOpen={true} title="Add Student" icon={<UserPlus size={24} />} onClose={closeModal}>
          <form onSubmit={handleAddStudent}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student Name</label><input name="name" required /></div>
              <div className={styles.formGroup}><label>Mobile</label><input name="mobile" required /></div>
              <div className={styles.formGroup}><label>Email</label><input type="email" name="email" required /></div>
              <div className={styles.formGroup}><label>Program</label><select name="program">{programs.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className={styles.formGroup}><label>Batch</label><input name="batch" defaultValue="August 2026" /></div>
              <div className={styles.formGroup}><label>Admission Date</label><input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
              <div className={styles.formGroup}><label>Fee</label><input name="fee" defaultValue="₹75,000" /></div>
              <div className={styles.formGroup}><label>Payment Status</label><select name="paymentStatus"><option>Paid</option><option>Partial</option><option>Pending</option></select></div>
              <div className={styles.formGroup}><label>Counselor</label><input name="counselor" required /></div>
              <div className={styles.formGroup}><label>Address</label><input name="address" /></div>
              <div className={styles.formGroup}><label>Parent Name</label><input name="parentName" /></div>
              <div className={styles.formGroup}><label>Parent Mobile</label><input name="parentMobile" /></div>
            </div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}

      {activeModal === 'LogCall' && (
        <PremiumModal isOpen={true} title="Log Call" icon={<PhoneCall size={24} />} onClose={closeModal}>
          <form onSubmit={handleLogCall}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student</label><input name="student" required /></div>
              <div className={styles.formGroup}><label>Mobile Number</label><input name="mobile" required /></div>
              <div className={styles.formGroup}><label>Call Type</label><select name="type"><option>Incoming</option><option>Outgoing</option></select></div>
              <div className={styles.formGroup}><label>Call Duration</label><input name="duration" placeholder="e.g. 5m 30s" /></div>
              <div className={styles.formGroup}><label>Date</label><input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
              <div className={styles.formGroup}><label>Time</label><input name="time" type="time" defaultValue="10:00" /></div>
              <div className={styles.formGroup}><label>Counselor</label><input name="counselor" required /></div>
              <div className={styles.formGroup}><label>Call Outcome</label><select name="outcome"><option>Interested</option><option>Not Interested</option><option>Call Back</option><option>Demo Scheduled</option><option>Admission Confirmed</option></select></div>
              <div className={styles.formGroup}><label>Follow-up Date</label><input name="followup" type="date" /></div>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '20px' }}><label>Notes</label><textarea name="notes" rows={3}></textarea></div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}

      {activeModal === 'ScheduleDemo' && (
        <PremiumModal isOpen={true} title="Schedule Demo" icon={<CalendarIcon size={24} />} onClose={closeModal}>
          <form onSubmit={handleScheduleDemo}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student Name</label><input name="student" required /></div>
              <div className={styles.formGroup}><label>Email</label><input type="email" name="email" required /></div>
              <div className={styles.formGroup}><label>Mobile</label><input name="mobile" required /></div>
              <div className={styles.formGroup}><label>Program</label><select name="program">{programs.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className={styles.formGroup}><label>Demo Date</label><input name="date" type="date" required /></div>
              <div className={styles.formGroup}><label>Demo Time</label><input name="time" type="time" required /></div>
              <div className={styles.formGroup}><label>Faculty</label><input name="faculty" required /></div>
              <div className={styles.formGroup}><label>Google Meet Link</label><input name="link" defaultValue="https://meet.google.com/abc-defg-hij" required /></div>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '20px' }}><label>Notes</label><textarea name="notes" rows={3}></textarea></div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}

      {activeModal === 'UploadDocument' && (
        <PremiumModal isOpen={true} title="Upload Document" icon={<UploadCloud size={24} />} onClose={closeModal}>
          <form onSubmit={handleUploadDocument}><div style={{ padding: "20px 0" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}><label>Student Name</label><input name="student" required /></div>
              <div className={styles.formGroup}><label>Student ID</label><input name="studentId" required /></div>
              <div className={styles.formGroup}><label>Document Type</label><select name="type"><option>Aadhaar</option><option>PAN</option><option>10th Marks Card</option><option>12th Marks Card</option><option>Degree Certificate</option><option>Transfer Certificate</option><option>Passport</option><option>Resume</option><option>Offer Letter</option><option>Fee Receipt</option><option>Other</option></select></div>
              <div className={styles.formGroup}><label>Upload File</label><input type="file" required /></div>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '20px' }}><label>Description</label><textarea name="description" rows={3}></textarea></div>
          </div><div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="primary-btn">Save</button></div></form>
        </PremiumModal>
      )}
    </>
  );
}
