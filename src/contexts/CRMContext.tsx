'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsData, studentsData } from '@/lib/data/mockData';

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  program: string;
  source: string;
  status: string;
  priority: string;
  counselor: string;
  date: string;
  [key: string]: any;
}

export interface Application {
  id: string;
  name: string;
  mobile: string;
  email: string;
  program: string;
  status: string;
  date: string;
  counselor: string;
  [key: string]: any;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  mobile: string;
  email: string;
  program: string;
  batch: string;
  fee: string;
  paymentStatus: string;
  date: string;
  [key: string]: any;
}

export interface Call {
  id: string;
  student: string;
  mobile: string;
  type: string;
  duration: string;
  date: string;
  time: string;
  counselor: string;
  outcome: string;
  notes: string;
}

export interface Demo {
  id: string;
  student: string;
  email: string;
  mobile: string;
  program: string;
  date: string;
  time: string;
  faculty: string;
  link: string;
}

export interface Document {
  id: string;
  student: string;
  studentId: string;
  type: string;
  name: string;
  date: string;
  uploadedBy: string;
  status: string;
}

interface CRMContextType {
  leads: Lead[];
  applications: Application[];
  students: Student[];
  calls: Call[];
  demos: Demo[];
  documents: Document[];
  addLead: (lead: Omit<Lead, 'id'>) => void;
  addApplication: (app: Omit<Application, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  logCall: (call: Omit<Call, 'id'>) => void;
  scheduleDemo: (demo: Omit<Demo, 'id'>) => void;
  uploadDocument: (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const loadData = (key: string, defaultData: any[]) => {
      const saved = localStorage.getItem(`crm_${key}`);
      return saved ? JSON.parse(saved) : defaultData;
    };

    setLeads(loadData('leads', leadsData));

    setApplications(loadData('applications', [
      { id: '1', name: 'Rahul Kumar', mobile: '+91 8877665544', email: 'rahul@example.com', program: 'AI & Machine Learning', status: 'Under Review', date: '2026-08-03', counselor: 'Sarah' }
    ]));

    setStudents(loadData('students', studentsData));

    setCalls(loadData('calls', []));
    setDemos(loadData('demos', []));
    setDocuments(loadData('documents', []));
    
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
      localStorage.setItem('crm_applications', JSON.stringify(applications));
      localStorage.setItem('crm_students', JSON.stringify(students));
      localStorage.setItem('crm_calls', JSON.stringify(calls));
      localStorage.setItem('crm_demos', JSON.stringify(demos));
      localStorage.setItem('crm_documents', JSON.stringify(documents));
    }
  }, [leads, applications, students, calls, demos, documents, isLoaded]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addLead = (lead: Omit<Lead, 'id'>) => setLeads(prev => [{ ...lead, id: generateId() } as Lead, ...prev]);
  const addApplication = (app: Omit<Application, 'id'>) => setApplications(prev => [{ ...app, id: generateId() } as Application, ...prev]);
  const addStudent = (student: Omit<Student, 'id'>) => setStudents(prev => [{ ...student, id: generateId() } as Student, ...prev]);
  const logCall = (call: Omit<Call, 'id'>) => setCalls(prev => [{ ...call, id: generateId() } as Call, ...prev]);
  const scheduleDemo = (demo: Omit<Demo, 'id'>) => setDemos(prev => [{ ...demo, id: generateId() } as Demo, ...prev]);
  const uploadDocument = (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => {
    setDocuments(prev => [{
      ...doc,
      id: generateId(),
      name: `${doc.type}_${doc.student.split(' ')[0]}.pdf`,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      status: 'Verified'
    } as Document, ...prev]);
  };

  return (
    <CRMContext.Provider value={{ leads, applications, students, calls, demos, documents, addLead, addApplication, addStudent, logCall, scheduleDemo, uploadDocument }}>
      {children}
    </CRMContext.Provider>
  );
};
