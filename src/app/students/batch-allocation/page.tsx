'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle, Clock, Search, Filter, Plus, Calendar,
  BookOpen, UserCheck, AlertCircle, ArrowRight, X, ChevronRight,
  Layers, Check, UserPlus, RefreshCw, Trash2, Shield, Eye, Monitor
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  enrollmentDate: string;
  preferredShift: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  status: 'Unallocated' | 'Allocated' | 'Pending Approval';
  currentBatch?: string;
}

interface Batch {
  id: string;
  code: string;
  name: string;
  program: string;
  mentor: string;
  capacity: number;
  enrolled: number;
  shift: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  timing: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Full' | 'Completed' | 'Cancelled';
  mode?: 'Online' | 'Offline' | 'Hybrid';
  location?: string;
  description?: string;
  students: Student[];
}

// Initial Mock Data
const INITIAL_UNALLOCATED_STUDENTS: Student[] = [
  { id: 'STU-2026-101', name: 'Rohan Sharma', email: 'rohan.s@example.com', phone: '+91 98765 43210', program: 'Full Stack Web Development', enrollmentDate: '05 Aug 2026', preferredShift: 'Morning', status: 'Unallocated' },
  { id: 'STU-2026-102', name: 'Ananya Gupta', email: 'ananya.g@example.com', phone: '+91 98765 43211', program: 'Data Science & AI', enrollmentDate: '06 Aug 2026', preferredShift: 'Evening', status: 'Unallocated' },
  { id: 'STU-2026-103', name: 'Kabir Mehta', email: 'kabir.m@example.com', phone: '+91 98765 43212', program: 'Full Stack Web Development', enrollmentDate: '07 Aug 2026', preferredShift: 'Morning', status: 'Unallocated' },
  { id: 'STU-2026-104', name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 98765 43213', program: 'UI/UX Design Masterclass', enrollmentDate: '07 Aug 2026', preferredShift: 'Weekend', status: 'Unallocated' },
  { id: 'STU-2026-105', name: 'Devansh Verma', email: 'devansh.v@example.com', phone: '+91 98765 43214', program: 'Cloud DevOps Engineering', enrollmentDate: '08 Aug 2026', preferredShift: 'Afternoon', status: 'Unallocated' },
  { id: 'STU-2026-106', name: 'Isha Patel', email: 'isha.p@example.com', phone: '+91 98765 43215', program: 'Data Science & AI', enrollmentDate: '08 Aug 2026', preferredShift: 'Evening', status: 'Unallocated' },
  { id: 'STU-2026-107', name: 'Tanya Roy', email: 'tanya.r@example.com', phone: '+91 98765 43216', program: 'Full Stack Web Development', enrollmentDate: '09 Aug 2026', preferredShift: 'Morning', status: 'Unallocated' },
  { id: 'STU-2026-108', name: 'Aditya Rao', email: 'aditya.r@example.com', phone: '+91 98765 43217', program: 'UI/UX Design Masterclass', enrollmentDate: '10 Aug 2026', preferredShift: 'Weekend', status: 'Unallocated' },
];

const INITIAL_BATCHES: Batch[] = [
  {
    id: 'BAT-01',
    code: 'FSD-2026-A1',
    name: 'Full Stack Morning Cohort 1',
    program: 'Full Stack Web Development',
    mentor: 'Arjun Kumar',
    capacity: 25,
    enrolled: 22,
    shift: 'Morning',
    timing: '09:00 AM - 11:30 AM (Mon - Fri)',
    startDate: '15 Aug 2026',
    endDate: '15 Dec 2026',
    status: 'Active',
    students: [
      { id: 'STU-2026-001', name: 'Aarav Patel', email: 'aarav.p@example.com', phone: '+91 99000 11101', program: 'Full Stack Web Development', enrollmentDate: '01 Aug 2026', preferredShift: 'Morning', status: 'Allocated', currentBatch: 'FSD-2026-A1' },
      { id: 'STU-2026-002', name: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 99000 11102', program: 'Full Stack Web Development', enrollmentDate: '02 Aug 2026', preferredShift: 'Morning', status: 'Allocated', currentBatch: 'FSD-2026-A1' },
    ],
  },
  {
    id: 'BAT-02',
    code: 'DS-2026-E1',
    name: 'Data Science Evening Batch',
    program: 'Data Science & AI',
    mentor: 'Priya Sharma',
    capacity: 20,
    enrolled: 20,
    shift: 'Evening',
    timing: '06:00 PM - 08:30 PM (Mon - Fri)',
    startDate: '20 Aug 2026',
    endDate: '20 Jan 2027',
    status: 'Full',
    students: [
      { id: 'STU-2026-003', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 99000 11103', program: 'Data Science & AI', enrollmentDate: '03 Aug 2026', preferredShift: 'Evening', status: 'Allocated', currentBatch: 'DS-2026-E1' },
    ],
  },
  {
    id: 'BAT-03',
    code: 'UIUX-2026-W1',
    name: 'UI/UX Weekend Masterclass',
    program: 'UI/UX Design Masterclass',
    mentor: 'Anita Desai',
    capacity: 30,
    enrolled: 14,
    shift: 'Weekend',
    timing: '10:00 AM - 04:00 PM (Sat - Sun)',
    startDate: '25 Aug 2026',
    endDate: '25 Nov 2026',
    status: 'Upcoming',
    students: [
      { id: 'STU-2026-004', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 99000 11104', program: 'UI/UX Design Masterclass', enrollmentDate: '04 Aug 2026', preferredShift: 'Weekend', status: 'Allocated', currentBatch: 'UIUX-2026-W1' },
    ],
  },
  {
    id: 'BAT-04',
    code: 'DEVOPS-2026-A1',
    name: 'Cloud DevOps Afternoon Cohort',
    program: 'Cloud DevOps Engineering',
    mentor: 'Suresh Iyer',
    capacity: 20,
    enrolled: 12,
    shift: 'Afternoon',
    timing: '02:00 PM - 04:30 PM (Mon - Fri)',
    startDate: '01 Sep 2026',
    endDate: '01 Feb 2027',
    status: 'Upcoming',
    students: [],
  },
  {
    id: 'BAT-05',
    code: 'BA-2026-M1',
    name: 'Business Analyst',
    program: 'Business Analyst',
    mentor: 'Arjun Kumar',
    capacity: 30,
    enrolled: 0,
    shift: 'Morning',
    timing: '09:00 AM - 11:30 AM (Mon - Fri)',
    startDate: '10 Sep 2026',
    endDate: '10 Jan 2027',
    status: 'Upcoming',
    students: [],
  },
  {
    id: 'BAT-06',
    code: 'AI-2026-E1',
    name: 'AI Program',
    program: 'AI Program',
    mentor: 'Vikram Singh',
    capacity: 25,
    enrolled: 0,
    shift: 'Evening',
    timing: '06:00 PM - 08:30 PM (Mon - Fri)',
    startDate: '15 Sep 2026',
    endDate: '15 Jan 2027',
    status: 'Upcoming',
    students: [],
  },
  {
    id: 'BAT-07',
    code: 'PG-AI-2026-W1',
    name: 'PG Executive Agentic AI & Generative AI',
    program: 'PG Executive Agentic AI & Generative AI',
    mentor: 'Anita Desai',
    capacity: 20,
    enrolled: 0,
    shift: 'Weekend',
    timing: '10:00 AM - 04:00 PM (Sat - Sun)',
    startDate: '01 Oct 2026',
    endDate: '01 Mar 2027',
    status: 'Upcoming',
    students: [],
  }
];


export interface UpcomingClass {
  id: string;
  course: string;
  subject: string;
  date: string;
  time: string;
  classType: string;
  batchCode: string;
  mentor: string;
  meetingLink: string;
  status: string;
  mode: 'Online' | 'Offline' | 'Experienced';
}

const INITIAL_UPCOMING_CLASSES: UpcomingClass[] = [
  // Cloud Computing & DevOps
  { id: 'UC-01', course: 'Cloud Computing & DevOps', subject: 'Linux Fundamentals', date: '24 Aug 2026', time: '07:00 AM', classType: 'Weekday Morning', batchCode: 'CCA-DEV-M01', mentor: 'Suresh Iyer', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-02', course: 'Cloud Computing & DevOps', subject: 'Cloud Computing Fundamentals', date: '24 Aug 2026', time: '07:00 PM', classType: 'Weekday Evening', batchCode: 'CCA-DEV-E01', mentor: 'Ramesh Singh', meetingLink: 'https://meet.google.com/xyz-uvwx-yz1', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-03', course: 'Cloud Computing & DevOps', subject: 'Docker', date: '25 Aug 2026', time: '02:00 PM', classType: 'Weekday Afternoon', batchCode: 'CCA-DEV-A01', mentor: 'Suresh Iyer', meetingLink: '', status: 'Scheduled', mode: 'Offline' },
  { id: 'UC-04', course: 'Cloud Computing & DevOps', subject: 'Kubernetes', date: '27 Aug 2026', time: '10:00 AM', classType: 'Weekend Morning', batchCode: 'CCA-DEV-W01', mentor: 'Ramesh Singh', meetingLink: 'https://meet.google.com/qwe-rtyu-iop', status: 'Scheduled', mode: 'Experienced' },
  
  // Cybersecurity (CEH v13)
  { id: 'UC-05', course: 'Cybersecurity (CEH v13)', subject: 'Cybersecurity Fundamentals', date: '24 Aug 2026', time: '07:00 AM', classType: 'Weekday Morning', batchCode: 'CEH-CYB-M01', mentor: 'Karthik Raja', meetingLink: 'https://meet.google.com/aaa-bbbb-ccc', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-06', course: 'Cybersecurity (CEH v13)', subject: 'Ethical Hacking', date: '24 Aug 2026', time: '07:00 PM', classType: 'Weekday Evening', batchCode: 'CEH-CYB-E01', mentor: 'Karthik Raja', meetingLink: '', status: 'Scheduled', mode: 'Offline' },
  { id: 'UC-07', course: 'Cybersecurity (CEH v13)', subject: 'Network Security', date: '25 Aug 2026', time: '02:00 PM', classType: 'Weekday Afternoon', batchCode: 'CEH-CYB-A01', mentor: 'Manoj Kumar', meetingLink: 'https://meet.google.com/ddd-eeee-fff', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-08', course: 'Cybersecurity (CEH v13)', subject: 'Penetration Testing', date: '27 Aug 2026', time: '10:00 AM', classType: 'Weekend Morning', batchCode: 'CEH-CYB-W01', mentor: 'Manoj Kumar', meetingLink: 'https://meet.google.com/ggg-hhhh-iii', status: 'Scheduled', mode: 'Experienced' },

  // Business Analyst and AI Program
  { id: 'UC-09', course: 'Business Analyst and AI Program', subject: 'Business Analysis Fundamentals', date: '24 Aug 2026', time: '07:00 AM', classType: 'Weekday Morning', batchCode: 'BA-2026-M1', mentor: 'Arjun Kumar', meetingLink: 'https://meet.google.com/123-4567-890', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-10', course: 'Business Analyst and AI Program', subject: 'Requirement Gathering', date: '25 Aug 2026', time: '02:00 PM', classType: 'Weekday Afternoon', batchCode: 'BAAI-A01', mentor: 'Arjun Kumar', meetingLink: '', status: 'Scheduled', mode: 'Offline' },
  { id: 'UC-11', course: 'Business Analyst and AI Program', subject: 'Data Analysis', date: '24 Aug 2026', time: '07:00 PM', classType: 'Weekday Evening', batchCode: 'BAAI-E01', mentor: 'Arjun Kumar', meetingLink: 'https://meet.google.com/456-7890-123', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-12', course: 'Business Analyst and AI Program', subject: 'Generative AI', date: '27 Aug 2026', time: '10:00 AM', classType: 'Weekend Morning', batchCode: 'BAAI-W01', mentor: 'Vikram Singh', meetingLink: '', status: 'Scheduled', mode: 'Experienced' },

  // PG Executive Agentic AI & Generative AI
  { id: 'UC-13', course: 'PG Executive Agentic AI & Generative AI', subject: 'Python for AI', date: '24 Aug 2026', time: '07:00 AM', classType: 'Weekday Morning', batchCode: 'PGAI-M01', mentor: 'Anita Desai', meetingLink: 'https://meet.google.com/zxv-cnmb-jkl', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-14', course: 'PG Executive Agentic AI & Generative AI', subject: 'Generative AI', date: '25 Aug 2026', time: '02:00 PM', classType: 'Weekday Afternoon', batchCode: 'PGAI-A01', mentor: 'Vikram Singh', meetingLink: '', status: 'Scheduled', mode: 'Offline' },
  { id: 'UC-15', course: 'PG Executive Agentic AI & Generative AI', subject: 'RAG', date: '24 Aug 2026', time: '07:00 PM', classType: 'Weekday Evening', batchCode: 'PG-AI-2026-E1', mentor: 'Anita Desai', meetingLink: 'https://meet.google.com/qqq-www-eee', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-16', course: 'PG Executive Agentic AI & Generative AI', subject: 'Agentic AI', date: '27 Aug 2026', time: '10:00 AM', classType: 'Weekend Morning', batchCode: 'PG-AI-2026-W1', mentor: 'Anita Desai', meetingLink: 'https://meet.google.com/rrr-ttt-yyy', status: 'Scheduled', mode: 'Experienced' },

  // Full Stack Development
  { id: 'UC-17', course: 'Full Stack Development', subject: 'JavaScript', date: '24 Aug 2026', time: '07:00 AM', classType: 'Weekday Morning', batchCode: 'FSD-2026-A1', mentor: 'Rahul Sharma', meetingLink: 'https://meet.google.com/asd-fghj-klz', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-18', course: 'Full Stack Development', subject: 'React', date: '25 Aug 2026', time: '02:00 PM', classType: 'Weekday Afternoon', batchCode: 'FSD-A01', mentor: 'Priya Sharma', meetingLink: '', status: 'Scheduled', mode: 'Offline' },
  { id: 'UC-19', course: 'Full Stack Development', subject: 'Node.js', date: '24 Aug 2026', time: '07:00 PM', classType: 'Weekday Evening', batchCode: 'FSD-E01', mentor: 'Rahul Sharma', meetingLink: 'https://meet.google.com/xcv-bnmq-wer', status: 'Scheduled', mode: 'Online' },
  { id: 'UC-20', course: 'Full Stack Development', subject: 'Full Stack Project', date: '27 Aug 2026', time: '10:00 AM', classType: 'Weekend Morning', batchCode: 'FSD-W01', mentor: 'Priya Sharma', meetingLink: '', status: 'Scheduled', mode: 'Experienced' },
];

const INITIAL_HISTORY = [
  { id: 'HIS-01', student: 'Aarav Patel', batch: 'FSD-2026-A1', allocatedBy: 'Admin User', date: '08 Aug 2026, 11:30 AM' },
  { id: 'HIS-02', student: 'Priya Sharma', batch: 'FSD-2026-A1', allocatedBy: 'Admin User', date: '08 Aug 2026, 10:15 AM' },
  { id: 'HIS-03', student: 'Vikram Singh', batch: 'DS-2026-E1', allocatedBy: 'Rahul Sharma', date: '07 Aug 2026, 04:45 PM' },
];

export default function BatchAllocationPage() {
  const { students: crmStudents, updateStudent } = useCRM();
  const [activeTab, setActiveTab] = useState<'batches' | 'unallocated' | 'history'>('batches');
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);

  // Derive batches with students mapped directly from crmStudents
  const mappedBatches = useMemo(() => {
    return batches.map(b => ({
      ...b,
      students: crmStudents
        .filter(s => s.batch === b.name || s.batch === b.code || s.program === b.program)
        .map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone,
          program: s.program || b.program,
          enrollmentDate: s.enrollmentDate || '-',
          preferredShift: (s as any).preferredShift || 'Morning',
          status: 'Allocated' as any,
          currentBatch: b.code
        }))
    }));
  }, [crmStudents, batches]);

  // Derive unallocated students from crmStudents
  const unallocatedStudents = useMemo(() => {
    return crmStudents
      .filter(s => !s.batch && !mappedBatches.some(b => b.students.some(bs => bs.id === s.id)))
      .map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        program: s.program || 'General',
        enrollmentDate: s.enrollmentDate || '-',
        preferredShift: (s as any).preferredShift || 'Morning',
        status: 'Unallocated' as any
      }));
  }, [crmStudents, mappedBatches]);
  
  const [history, setHistory] = useState(INITIAL_HISTORY);

  
  // Search & Filter State
  
  // Upcoming Batches State
  const [upcomingModeFilter, setUpcomingModeFilter] = useState('All');
  const [upcomingCourseFilter, setUpcomingCourseFilter] = useState('All Courses');
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [selectedUpcomingClass, setSelectedUpcomingClass] = useState<UpcomingClass | null>(null);

  const filteredUpcomingClasses = useMemo(() => {
    return INITIAL_UPCOMING_CLASSES.filter(uc => {
      const modeMatch = upcomingModeFilter === 'All' || uc.mode === upcomingModeFilter;
      const courseMatch = upcomingCourseFilter === 'All Courses' || uc.course === upcomingCourseFilter;
      return modeMatch && courseMatch;
    });
  }, [upcomingModeFilter, upcomingCourseFilter]);

  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');

  // Selection & Modal States
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [targetStudentForAllocation, setTargetStudentForAllocation] = useState<Student | null>(null);
  const [targetBatchId, setTargetBatchId] = useState('');
  const [viewingBatchRoster, setViewingBatchRoster] = useState<Batch | null>(null);
  
  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // New Batch Form State
  const [newBatchForm, setNewBatchForm] = useState({
    code: '',
    name: '',
    program: 'Full Stack Web Development',
    mentor: '',
    capacity: 25,
    shift: 'Morning' as 'Morning' | 'Afternoon' | 'Evening' | 'Weekend',
    timing: '09:00 AM - 11:30 AM (Mon - Fri)',
    startDate: '',
    endDate: '',
    mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
    location: '',
    description: '',
    status: 'Upcoming' as 'Upcoming' | 'Active' | 'Completed' | 'Cancelled'
  });

  // Calculate Metrics
  const totalUnallocated = unallocatedStudents.length;
  const activeBatchesCount = mappedBatches.filter(b => b.status === 'Active' || b.status === 'Upcoming').length;
  const totalCapacity = mappedBatches.reduce((acc, b) => acc + b.capacity, 0);
  const totalEnrolled = mappedBatches.reduce((acc, b) => acc + b.enrolled, 0);
  const capacityUtilization = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  // Single Student Allocation
  const handleAllocateStudent = (student: Student, batchId: string) => {
    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) return;
    const selectedBatch = batches[batchIndex];

    if (selectedBatch.enrolled >= selectedBatch.capacity) {
      showToast(`⚠️ Cannot allocate. Batch ${selectedBatch.code} is already full!`);
      return;
    }

    // Find in crmStudents and update globally
    const crmStudent = crmStudents.find(s => s.id === student.id);
    if (crmStudent) {
      updateStudent({ ...crmStudent, batch: selectedBatch.code });
    }

    const updatedBatches = [...batches];
    updatedBatches[batchIndex] = {
      ...selectedBatch,
      enrolled: selectedBatch.enrolled + 1,
      status: selectedBatch.enrolled + 1 >= selectedBatch.capacity ? 'Full' : selectedBatch.status,
    };
    setBatches(updatedBatches);
    
    // Log in history
    setHistory([
      {
        id: `HIS-${Date.now()}`,
        student: student.name,
        batch: selectedBatch.code,
        allocatedBy: 'Admin User',
        date: 'Just Now',
      },
      ...history,
    ]);

    showToast(`✅ Successfully allocated ${student.name} to ${selectedBatch.code}!`);
    setIsAllocateModalOpen(false);
    setTargetStudentForAllocation(null);
  };

  // Bulk Allocation
  const handleBulkAllocate = (batchId: string) => {
    if (!batchId || selectedStudentIds.length === 0) return;
    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) return;
    const selectedBatch = batches[batchIndex];

    const availableSeats = selectedBatch.capacity - selectedBatch.enrolled;
    if (selectedStudentIds.length > availableSeats) {
      showToast(`⚠️ Only ${availableSeats} seat(s) remaining in ${selectedBatch.code}. Select fewer students.`);
      return;
    }

    const studentsToAllocate = unallocatedStudents.filter(s => selectedStudentIds.includes(s.id));
    const updatedRoster = studentsToAllocate.map(s => ({ ...s, status: 'Allocated' as const, currentBatch: selectedBatch.code }));

    const updatedBatches = [...batches];
    updatedBatches[batchIndex] = {
      ...selectedBatch,
      enrolled: selectedBatch.enrolled + studentsToAllocate.length,
      status: selectedBatch.enrolled + studentsToAllocate.length >= selectedBatch.capacity ? 'Full' : selectedBatch.status,
      students: [...selectedBatch.students, ...updatedRoster],
    };

    setBatches(updatedBatches);
    
    const newHistoryEntries = studentsToAllocate.map(s => ({
      id: `HIS-${Date.now()}-${s.id}`,
      student: s.name,
      batch: selectedBatch.code,
      allocatedBy: 'Admin User',
      date: 'Just Now',
    }));

    setHistory([...newHistoryEntries, ...history]);
    setSelectedStudentIds([]);
    setIsAllocateModalOpen(false);
    showToast(`🎉 Allocated ${studentsToAllocate.length} student(s) to ${selectedBatch.code}!`);
  };

  // Remove student from batch (Re-unallocate)
  const handleRemoveFromBatch = (batchId: string, studentId: string) => {
    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) return;
    const targetBatch = batches[batchIndex];
    const studentToRemove = targetBatch.students.find(s => s.id === studentId);
    if (!studentToRemove) return;

    const updatedBatches = [...batches];
    updatedBatches[batchIndex] = {
      ...targetBatch,
      enrolled: targetBatch.enrolled - 1,
      status: targetBatch.status === 'Full' ? 'Active' : targetBatch.status,
      students: targetBatch.students.filter(s => s.id !== studentId),
    };

    setBatches(updatedBatches);

    // Return student back to unallocated list
    const unallocatedCopy = { ...studentToRemove, status: 'Unallocated' as const, currentBatch: undefined };

    // Update roster view if active
    if (viewingBatchRoster?.id === batchId) {
      setViewingBatchRoster({
        ...viewingBatchRoster,
        enrolled: viewingBatchRoster.enrolled - 1,
        students: viewingBatchRoster.students.filter(s => s.id !== studentId),
      });
    }

    showToast(`ℹ️ Removed ${studentToRemove.name} from ${targetBatch.code} and returned to Unallocated pool.`);
  };

  // Create Batch Submit
  const handleCreateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchForm.code || !newBatchForm.name || !newBatchForm.mentor) {
      showToast('⚠️ Please fill out all required batch fields.');
      return;
    }

    const newBatch: Batch = {
      id: `BAT-${Date.now()}`,
      code: newBatchForm.code,
      name: newBatchForm.name,
      program: newBatchForm.program,
      mentor: newBatchForm.mentor,
      capacity: newBatchForm.capacity,
      enrolled: 0,
      shift: newBatchForm.shift,
      timing: newBatchForm.timing,
      startDate: newBatchForm.startDate,
      endDate: newBatchForm.endDate,
      status: newBatchForm.status,
      mode: newBatchForm.mode,
      location: newBatchForm.location,
      description: newBatchForm.description,
      students: [],
    };

    setBatches([...batches, newBatch]);
    showToast(`✅ Successfully created batch ${newBatchForm.name}!`);
    setIsCreateBatchModalOpen(false);
    setNewBatchForm({
      code: '',
      name: '',
      program: 'Full Stack Web Development',
      mentor: '',
      capacity: 25,
      shift: 'Morning',
      timing: '',
      startDate: '',
      endDate: '',
      mode: 'Online',
      location: '',
      description: '',
      status: 'Upcoming'
    });
  };

  // Filtering Unallocated List
  const [unallocatedPage, setUnallocatedPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUnallocated = unallocatedStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'All' || s.program === programFilter;
    const matchesShift = shiftFilter === 'All' || s.preferredShift === shiftFilter;
    return matchesSearch && matchesProgram && matchesShift;
  });

  const totalUnallocatedPages = Math.ceil(filteredUnallocated.length / itemsPerPage) || 1;
  const paginatedUnallocated = filteredUnallocated.slice((unallocatedPage - 1) * itemsPerPage, unallocatedPage * itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '32px' }}>
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
              background: 'var(--card-bg, #1e293b)', color: '#fff', padding: '14px 20px',
              borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers color="#3b82f6" size={32} /> Batch Allocation & Cohort Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Assign admitted students to active batches, manage shift schedules, mentor assignments, and seat capacities.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsCreateBatchModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
              borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Plus size={18} /> Create New Batch
          </button>
          {unallocatedStudents.length > 0 && (
            <button
              onClick={() => {
                if (selectedStudentIds.length === 0) {
                  showToast('ℹ️ Please select unallocated students from the table first.');
                  setActiveTab('unallocated');
                } else {
                  setIsAllocateModalOpen(true);
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer'
              }}
            >
              <UserPlus size={18} /> Quick Batch Allocation ({selectedStudentIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Unallocated Students</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalUnallocated}</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Active & Upcoming Batches</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{activeBatchesCount}</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Capacity Utilization</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{capacityUtilization}%</div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Total Enrolled Seats</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalEnrolled} / {totalCapacity}</div>
          </div>
        </motion.div>

      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('batches')}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            background: activeTab === 'batches' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'batches' ? '#3b82f6' : 'var(--text-secondary)',
            border: activeTab === 'batches' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Layers size={18} /> Active Batches ({batches.length})
        </button>

        <button
          onClick={() => setActiveTab('unallocated')}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            background: activeTab === 'unallocated' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
            color: activeTab === 'unallocated' ? '#ef4444' : 'var(--text-secondary)',
            border: activeTab === 'unallocated' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Users size={18} /> Unallocated Students ({unallocatedStudents.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
            background: activeTab === 'history' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeTab === 'history' ? '#8b5cf6' : 'var(--text-secondary)',
            border: activeTab === 'history' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Clock size={18} /> Allocation History ({history.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE BATCHES GRID */}
      {activeTab === 'batches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {mappedBatches.map((batch, index) => {
            const fillPercentage = Math.round((batch.enrolled / batch.capacity) * 100);
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'Active': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
                case 'Upcoming': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
                case 'Full': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
                default: return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
              }
            };
            const statusStyle = getStatusColor(batch.status);

            return (
              <motion.div
                key={`${batch.id}-${index}`}
                whileHover={{ y: -5 }}
                className="glass-panel"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}
              >
                {/* Batch Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {batch.code}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '6px' }}>{batch.name}</h3>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{batch.program}</div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                    {batch.status}
                  </span>
                </div>

                {/* Schedule & Mentor info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Mentor / Trainer:</span>
                    <span style={{ fontWeight: 600 }}>{batch.mentor}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Shift & Timing:</span>
                    <span style={{ fontWeight: 600 }}>{batch.shift} ({batch.timing.split(' ')[0]})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
                    <span style={{ fontWeight: 600 }}>{batch.startDate} - {batch.endDate}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>Seat Capacity</span>
                    <span>{batch.enrolled} / {batch.capacity} Students ({fillPercentage}%)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${fillPercentage}%`,
                        background: fillPercentage >= 100 ? '#ef4444' : fillPercentage > 75 ? '#f59e0b' : '#10b981',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                  <button
                    onClick={() => setViewingBatchRoster(mappedBatches.find(b => b.id === batch.id) || batch)}
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Eye size={16} /> Roster ({batch.students.length})
                  </button>

                  <button
                    onClick={() => {
                      setTargetBatchId(batch.id);
                      setActiveTab('unallocated');
                      showToast(`👉 Select student(s) from table below to assign to ${batch.code}`);
                    }}
                    disabled={batch.enrolled >= batch.capacity}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', border: 'none',
                      background: batch.enrolled >= batch.capacity ? 'rgba(100, 116, 139, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                      color: batch.enrolled >= batch.capacity ? '#94a3b8' : '#3b82f6', fontSize: '0.85rem', fontWeight: 600,
                      cursor: batch.enrolled >= batch.capacity ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <UserPlus size={16} /> + Assign
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      
        {/* UPCOMING BATCHES SECTION */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316', textDecoration: 'underline', textUnderlineOffset: '6px', marginBottom: '24px' }}>
            Upcoming Batches
          </h2>

          {/* Mode Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['Online', 'Offline', 'Experienced'].map(mode => (
              <button
                key={mode}
                onClick={() => setUpcomingModeFilter(upcomingModeFilter === mode ? 'All' : mode)}
                style={{
                  padding: '6px 16px',
                  background: 'transparent',
                  border: upcomingModeFilter === mode ? '1px solid #f97316' : '1px solid transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                  fontWeight: upcomingModeFilter === mode ? 600 : 400
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Course Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['All Courses', 'Cloud Computing & DevOps', 'Cybersecurity (CEH v13)', 'Business Analyst and AI Program', 'PG Executive Agentic AI & Generative AI', 'Full Stack Development'].map(course => (
              <button
                key={course}
                onClick={() => setUpcomingCourseFilter(course)}
                style={{
                  padding: '6px 16px',
                  background: 'transparent',
                  border: upcomingCourseFilter === course ? '1px solid #f97316' : '1px solid transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  fontWeight: upcomingCourseFilter === course ? 600 : 400
                }}
              >
                {course}
              </button>
            ))}
          </div>

          {/* Tables by Course */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {['Cloud Computing & DevOps', 'Cybersecurity (CEH v13)', 'Business Analyst and AI Program', 'PG Executive Agentic AI & Generative AI', 'Full Stack Development']
              .filter(course => upcomingCourseFilter === 'All Courses' || upcomingCourseFilter === course)
              .map(course => {
                const courseClasses = filteredUpcomingClasses.filter(c => c.course === course);
                if (courseClasses.length === 0) return null;
                
                return (
                  <div key={course} className="glass-panel" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ color: '#f97316', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>{course}</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Action</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Subject</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Date</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Time</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Class Type</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>Batch Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseClasses.map((cls) => (
                            <tr key={cls.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <button
                                  onClick={() => {
                                    setSelectedUpcomingClass(cls);
                                    setIsClassroomModalOpen(true);
                                  }}
                                  style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
                                >
                                  Join Classroom
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>{cls.subject}</td>
                              <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 500 }}>{cls.date.replace(/ /g, '-')}</td>
                              <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 500 }}>{cls.time}</td>
                              <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#3b82f6' }}>{cls.classType.toLowerCase().replace(' ', '-')}</td>
                              <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{cls.batchCode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              
              {filteredUpcomingClasses.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No upcoming batches match the selected filters.
                </div>
              )}
          </div>
        </div>


      {/* TAB 2: UNALLOCATED STUDENTS TABLE */}
      {activeTab === 'unallocated' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search and Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search by student name, ID or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                    outline: 'none', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} color="var(--text-secondary)" />
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  style={{
                    padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.05)', outline: 'none', fontSize: '0.85rem'
                  }}
                >
                  <option value="All">All Programs</option>
                  <option value="Full Stack Web Development">Full Stack Web Development</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="UI/UX Design Masterclass">UI/UX Design Masterclass</option>
                  <option value="Cloud DevOps Engineering">Cloud DevOps Engineering</option>
                </select>

                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  style={{
                    padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.05)', outline: 'none', fontSize: '0.85rem'
                  }}
                >
                  <option value="All">All Preferred Shifts</option>
                  <option value="Morning">Morning Shift</option>
                  <option value="Afternoon">Afternoon Shift</option>
                  <option value="Evening">Evening Shift</option>
                  <option value="Weekend">Weekend Shift</option>
                </select>
              </div>
            </div>

            {/* Bulk Action Controls */}
            {selectedStudentIds.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 16px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>
                  {selectedStudentIds.length} Selected
                </span>
                <button
                  onClick={() => setIsAllocateModalOpen(true)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', background: '#3b82f6', color: '#fff',
                    border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Allocate Selected To Batch
                </button>
                <button
                  onClick={() => setSelectedStudentIds([])}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.length === filteredUnallocated.length && filteredUnallocated.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(filteredUnallocated.map(s => s.id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                    />
                  </th>
                  <th style={{ padding: '12px 16px' }}>Student Info</th>
                  <th style={{ padding: '12px 16px' }}>Enrolled Program</th>
                  <th style={{ padding: '12px 16px' }}>Preferred Shift</th>
                  <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnallocated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                      🎉 No unallocated students match your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedUnallocated.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds([...selectedStudentIds, student.id]);
                              } else {
                                setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                              }
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{student.id} • {student.phone}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{student.program}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', fontWeight: 500 }}>
                            {student.preferredShift}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{student.enrollmentDate}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                            Unallocated
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setTargetStudentForAllocation(student);
                              setIsAllocateModalOpen(true);
                            }}
                            style={{
                              padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)',
                              color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.82rem',
                              fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            Allocate Batch
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 10-Item Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>
              Showing {filteredUnallocated.length === 0 ? 0 : (unallocatedPage - 1) * itemsPerPage + 1} to {Math.min(unallocatedPage * itemsPerPage, filteredUnallocated.length)} of {filteredUnallocated.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setUnallocatedPage(prev => Math.max(prev - 1, 1))}
                disabled={unallocatedPage === 1}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)', cursor: unallocatedPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: unallocatedPage === 1 ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
                }}
              >
                Previous
              </button>
              <span style={{ padding: '0 8px', fontWeight: 600 }}>
                Page {unallocatedPage} of {totalUnallocatedPages}
              </span>
              <button
                onClick={() => setUnallocatedPage(prev => Math.min(prev + 1, totalUnallocatedPages))}
                disabled={unallocatedPage >= totalUnallocatedPages}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)', cursor: unallocatedPage >= totalUnallocatedPages ? 'not-allowed' : 'pointer',
                  opacity: unallocatedPage >= totalUnallocatedPages ? 0.5 : 1, color: 'var(--text-primary)', fontWeight: 500
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALLOCATION HISTORY */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Recent Batch Allocations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.student} allocated to <span style={{ color: '#3b82f6' }}>{item.batch}</span></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>By {item.allocatedBy}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE NEW BATCH */}
      <AnimatePresence>
        {isCreateBatchModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '520px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Create New Batch</h3>
                <button onClick={() => setIsCreateBatchModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateBatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch Code *</label>
                    <input type="text" placeholder="e.g. FSD-2026-B2" value={newBatchForm.code} onChange={(e) => setNewBatchForm({ ...newBatchForm, code: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch Name *</label>
                    <input type="text" placeholder="e.g. Full Stack Morning B2" value={newBatchForm.name} onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Program / Course *</label>
                  <select value={newBatchForm.program} onChange={(e) => setNewBatchForm({ ...newBatchForm, program: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }}>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="UI/UX Design Masterclass">UI/UX Design Masterclass</option>
                    <option value="Cloud DevOps Engineering">Cloud DevOps Engineering</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="AI Program">AI Program</option>
                    <option value="PG Executive Agentic AI & Generative AI">PG Executive Agentic AI & Generative AI</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mentor Name *</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" value={newBatchForm.mentor} onChange={(e) => setNewBatchForm({ ...newBatchForm, mentor: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Max Capacity Seats</label>
                    <input type="number" value={newBatchForm.capacity} onChange={(e) => setNewBatchForm({ ...newBatchForm, capacity: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date</label>
                    <input type="date" value={newBatchForm.startDate} onChange={(e) => setNewBatchForm({ ...newBatchForm, startDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>End Date</label>
                    <input type="date" value={newBatchForm.endDate} onChange={(e) => setNewBatchForm({ ...newBatchForm, endDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Schedule</label>
                    <select value={newBatchForm.shift} onChange={(e) => setNewBatchForm({ ...newBatchForm, shift: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }}>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Timing String</label>
                    <input type="text" placeholder="e.g. 09:00 AM - 11:30 AM" value={newBatchForm.timing} onChange={(e) => setNewBatchForm({ ...newBatchForm, timing: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mode</label>
                    <select value={newBatchForm.mode} onChange={(e) => setNewBatchForm({ ...newBatchForm, mode: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }}>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location / Meeting Link</label>
                    <input type="text" placeholder="e.g. Room 101 or Zoom Link" value={newBatchForm.location} onChange={(e) => setNewBatchForm({ ...newBatchForm, location: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                  </div>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch Status</label>
                  <select value={newBatchForm.status} onChange={(e) => setNewBatchForm({ ...newBatchForm, status: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                  <textarea rows={2} placeholder="Optional batch notes..." value={newBatchForm.description} onChange={(e) => setNewBatchForm({ ...newBatchForm, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '4px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsCreateBatchModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Create Batch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ALLOCATE STUDENT / BULK ALLOCATE */}
      <AnimatePresence>
        {isAllocateModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '460px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {targetStudentForAllocation ? `Allocate ${targetStudentForAllocation.name}` : `Allocate ${selectedStudentIds.length} Selected Student(s)`}
                </h3>
                <button onClick={() => { setIsAllocateModalOpen(false); setTargetStudentForAllocation(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Target Batch</label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', outline: 'none', marginTop: '6px', fontSize: '0.9rem' }}
                >
                  <option value="">-- Choose an active batch --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id} disabled={b.enrolled >= b.capacity}>
                      {b.code} ({b.name}) — {b.enrolled}/{b.capacity} seats {b.enrolled >= b.capacity ? '(FULL)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAllocateModalOpen(false); setTargetStudentForAllocation(null); }}
                  style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetBatchId}
                  onClick={() => {
                    if (targetStudentForAllocation) {
                      handleAllocateStudent(targetStudentForAllocation, targetBatchId);
                    } else {
                      handleBulkAllocate(targetBatchId);
                    }
                  }}
                  style={{
                    padding: '10px 20px', borderRadius: '8px',
                    background: targetBatchId ? '#10b981' : 'rgba(100, 116, 139, 0.3)',
                    color: '#fff', border: 'none', fontWeight: 600,
                    cursor: targetBatchId ? 'pointer' : 'not-allowed'
                  }}
                >
                  Confirm Allocation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: VIEW BATCH ROSTER */}
      <AnimatePresence>
        {viewingBatchRoster && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '600px', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Roster for {viewingBatchRoster.code}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{viewingBatchRoster.name} • Trainer: {viewingBatchRoster.mentor}</div>
                </div>
                <button onClick={() => setViewingBatchRoster(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {viewingBatchRoster.students.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No students currently allocated to this batch.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewingBatchRoster.students.map((st) => (
                      <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{st.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{st.id} • {st.email}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromBatch(viewingBatchRoster.id, st.id)}
                          title="Remove from batch"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
                        >
                          Unassign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setViewingBatchRoster(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL: JOIN CLASSROOM / SESSION DETAILS */}
      <AnimatePresence>
        {isClassroomModalOpen && selectedUpcomingClass && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '500px', padding: '0', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Session Details</h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Review class details and join classroom</div>
                </div>
                <button onClick={() => { setIsClassroomModalOpen(false); setSelectedUpcomingClass(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Course</span>
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>{selectedUpcomingClass.course}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Subject</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{selectedUpcomingClass.subject}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Mentor</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{selectedUpcomingClass.mentor}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Date & Time</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: '#3b82f6' }}>{selectedUpcomingClass.date} at {selectedUpcomingClass.time}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Class Type</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{selectedUpcomingClass.classType}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Batch Code</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '1px' }}>{selectedUpcomingClass.batchCode}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Status</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: '#10b981' }}>{selectedUpcomingClass.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Meeting Link</span>
                  {selectedUpcomingClass.meetingLink ? (
                    <a href={selectedUpcomingClass.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', wordBreak: 'break-all' }}>
                      {selectedUpcomingClass.meetingLink}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Offline / No Link Provided</span>
                  )}
                </div>
              </div>

              <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => { setIsClassroomModalOpen(false); setSelectedUpcomingClass(null); }}
                  style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  Close
                </button>
                {selectedUpcomingClass.meetingLink && (
                  <a
                    href={selectedUpcomingClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => { setIsClassroomModalOpen(false); setSelectedUpcomingClass(null); }}
                  >
                    <Monitor size={16} /> Open Meeting
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
