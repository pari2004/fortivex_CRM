'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  GraduationCap, TrendingUp, IndianRupee, FileText, 
  Edit3, CheckCircle, Clock, Download, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentProfilePage() {
  const router = useRouter();

  // Mock data for the profile
  const student = {
    name: 'Rahul Sharma',
    id: 'FSD-2023-089',
    batch: 'FSD-Morning-B3',
    status: 'Active',
    course: 'Full Stack Development',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    dob: '15 Aug 1998',
    address: '123, Tech Park Road, Bengaluru, Karnataka 560001',
    academic: {
      highestDegree: 'B.Tech in Computer Science',
      university: 'Visvesvaraya Technological University',
      yearOfPassing: '2020',
      percentage: '78%'
    },
    attendance: {
      totalClasses: 45,
      attendedClasses: 41,
      percentage: '91%',
      status: 'Excellent'
    },
    performance: {
      assignmentsSubmitted: 12,
      totalAssignments: 15,
      averageScore: '85%',
      mockInterviews: 2
    },
    payment: {
      totalFees: '₹1,50,000',
      paidAmount: '₹1,00,000',
      pendingAmount: '₹50,000',
      nextInstallmentDate: '05 Sep 2026',
      status: 'On Track'
    },
    documents: [
      { name: '10th Marksheet', type: 'PDF', size: '1.2 MB', date: '10 Aug 2026' },
      { name: '12th Marksheet', type: 'PDF', size: '1.5 MB', date: '10 Aug 2026' },
      { name: 'Degree Certificate', type: 'PDF', size: '2.1 MB', date: '10 Aug 2026' },
      { name: 'Aadhar Card', type: 'PDF', size: '800 KB', date: '10 Aug 2026' }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Detailed view of student information, progress, and records.</p>
        </div>
        <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Column: Student Information Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              boxShadow: '0 10px 25px rgba(37,99,235,0.3)'
            }}>
              {student.name.charAt(0)}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>{student.name}</h2>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px' }}>
              {student.status}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              <div>{student.id}</div>
              <div style={{ fontWeight: 500, color: '#3b82f6', marginTop: '4px' }}>{student.course}</div>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Mail size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{student.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Phone size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{student.phone}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#64748b' }}><Calendar size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{student.dob}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ color: '#64748b', marginTop: '2px' }}><MapPin size={18} /></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{student.address}</div>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} color="#8b5cf6" /> Academic Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Highest Degree</div>
                <div style={{ fontWeight: 500 }}>{student.academic.highestDegree}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>University/College</div>
                <div style={{ fontWeight: 500 }}>{student.academic.university}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Passing Year</div>
                  <div style={{ fontWeight: 500 }}>{student.academic.yearOfPassing}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Percentage</div>
                  <div style={{ fontWeight: 500 }}>{student.academic.percentage}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Other Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Course Details */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="#3b82f6" /> Course Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Enrolled Course</div>
                  <div style={{ fontWeight: 600, color: '#3b82f6' }}>{student.course}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Batch Name</div>
                  <div style={{ fontWeight: 500 }}>{student.batch}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Admission Date</div>
                  <div style={{ fontWeight: 500 }}>12 Aug 2026</div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IndianRupee size={20} color="#10b981" /> Payment Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Fees</div>
                  <div style={{ fontWeight: 'bold' }}>{student.payment.totalFees}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Paid Amount</div>
                  <div style={{ fontWeight: 'bold', color: '#10b981' }}>{student.payment.paidAmount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pending Amount</div>
                  <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{student.payment.pendingAmount}</div>
                </div>
                <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '16px', marginTop: '4px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Next Installment</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <Clock size={16} color="#f59e0b" /> {student.payment.nextInstallmentDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Attendance Summary */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#f59e0b" /> Attendance
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${parseFloat(student.attendance.percentage) * 2.51} 251`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {student.attendance.percentage}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Classes</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{student.attendance.totalClasses}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classes Attended</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f59e0b' }}>{student.attendance.attendedClasses}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#ec4899" /> Performance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assignments Submitted</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{student.performance.assignmentsSubmitted} / {student.performance.totalAssignments}</div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(student.performance.assignmentsSubmitted / student.performance.totalAssignments) * 100}%`, height: '100%', background: '#ec4899', borderRadius: '4px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                  <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Average Score</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#ec4899' }}>{student.performance.averageScore}</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Mock Interviews</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#ec4899' }}>{student.performance.mockInterviews} Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#6366f1" /> Uploaded Documents
              </h3>
              <button className="secondary-btn" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Upload New</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {student.documents.map((doc, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{doc.size} • Uploaded {doc.date}</div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, background: 'rgba(99, 102, 241, 0.1)' }} 
                    style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer' }}
                  >
                    <Download size={16} />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
