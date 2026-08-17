'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsData, studentsData, generatedBusinessLeads, BusinessLead, generatedDeals, generatedQuotes, generatedPayments, Quote, generatedApplications, Application } from '@/lib/data/mockData';
export type { Application, Quote, BusinessLead };

export interface Task {
  id: string;
  title: string;
  assignTo: string;
  priority: string;
  dueDate: string;
  status: string;
  description: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: string;
}

export interface Report {
  id: string;
  name: string;
  module: string;
  dateRange: string;
  chartType: string;
  description: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  mobile?: string;
  email: string;
  program: string;
  source: string;
  status: string;
  priority: string;
  counselor: string;
  date: string;
  [key: string]: any;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  mobile?: string;
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
  mobile?: string;
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
  mobile?: string;
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

export interface Deal {
  id: string;
  leadName: string;
  dealOwner: string;
  program: string;
  revenue: number;
  stage: string;
  status: string;
  closeDate: string;
  [key: string]: any;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  studentName: string;
  date: string;
  method: string;
  [key: string]: any;
}

interface CRMContextType {
  leads: Lead[];
  applications: Application[];
  students: Student[];
  calls: Call[];
  demos: Demo[];
  documents: Document[];
  businessLeads: BusinessLead[];
  deals: Deal[];
  quotes: Quote[];
  payments: Payment[];
  tasks: Task[];
  users: User[];
  reports: Report[];
  addTask: (task: Omit<Task, 'id'>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  addReport: (report: Omit<Report, 'id'>) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  addApplication: (app: Omit<Application, 'id'>) => void;
  updateApplication: (app: Application) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  logCall: (call: Omit<Call, 'id'>) => void;
  scheduleDemo: (demo: Omit<Demo, 'id'>) => void;
  uploadDocument: (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => void;
  addBusinessLead: (lead: Omit<BusinessLead, 'id'>) => void;
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (deal: Deal) => void;
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (quote: Quote) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (payment: Payment) => void;
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
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const loadData = (key: string, defaultData: any[]) => {
      const saved = localStorage.getItem(`crm_${key}`);
      return saved ? JSON.parse(saved) : defaultData;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeads(loadData('leads', leadsData));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplications(loadData('applications', generatedApplications));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudents(loadData('students', studentsData));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalls(loadData('calls', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemos(loadData('demos', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDocuments(loadData('documents', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBusinessLeads(loadData('businessLeads', generatedBusinessLeads));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeals(loadData('deals', generatedDeals));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes(loadData('quotes', generatedQuotes));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPayments(loadData('payments', generatedPayments));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadData('tasks', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(loadData('users', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReports(loadData('reports', []));
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      localStorage.setItem('crm_businessLeads', JSON.stringify(businessLeads));
      localStorage.setItem('crm_deals', JSON.stringify(deals));
      localStorage.setItem('crm_quotes', JSON.stringify(quotes));
      localStorage.setItem('crm_payments', JSON.stringify(payments));
      localStorage.setItem('crm_tasks', JSON.stringify(tasks));
      localStorage.setItem('crm_users', JSON.stringify(users));
      localStorage.setItem('crm_reports', JSON.stringify(reports));
    }
  }, [leads, applications, students, calls, demos, documents, businessLeads, deals, quotes, payments, tasks, users, reports, isLoaded]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = (task: Omit<Task, 'id'>) => setTasks(prev => [{ ...task, id: generateId() } as Task, ...prev]);
  const addUser = (user: Omit<User, 'id'>) => setUsers(prev => [{ ...user, id: generateId() } as User, ...prev]);
  const addReport = (report: Omit<Report, 'id'>) => setReports(prev => [{ ...report, id: generateId() } as Report, ...prev]);

  const addLead = (lead: Omit<Lead, 'id'>) => setLeads(prev => [{ ...lead, id: generateId() } as Lead, ...prev]);
  const updateLead = (lead: Lead) => setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
  const addApplication = (app: Omit<Application, 'id'>) => setApplications(prev => [{ ...app, id: `APP-${generateId().toUpperCase()}` } as Application, ...prev]);
  const updateApplication = (app: Application) => setApplications(prev => prev.map(a => a.id === app.id ? app : a));
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

  const addBusinessLead = (lead: Omit<BusinessLead, 'id'>) => setBusinessLeads(prev => [{ ...lead, id: generateId() } as BusinessLead, ...prev]);

  const addDeal = (deal: Omit<Deal, 'id'>) => setDeals(prev => [{ ...deal, id: `DEAL-${generateId().toUpperCase()}` } as Deal, ...prev]);
  const updateDeal = (deal: Deal) => setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));

  const addQuote = (quote: Omit<Quote, 'id'>) => setQuotes(prev => [{ ...quote, id: `QT-${generateId().toUpperCase()}` } as Quote, ...prev]);
  const updateQuote = (quote: Quote) => setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));

  const addPayment = (payment: Omit<Payment, 'id'>) => setPayments(prev => [{ ...payment, id: `PAY-${generateId().toUpperCase()}` } as Payment, ...prev]);
  const updatePayment = (payment: Payment) => setPayments(prev => prev.map(p => p.id === payment.id ? payment : p));

  return (
    <CRMContext.Provider value={{ 
      leads, applications, students, calls, demos, documents, businessLeads, 
      deals, quotes, payments, tasks, users, reports,
      addLead, updateLead, addApplication, updateApplication, addStudent, logCall, scheduleDemo, uploadDocument, addBusinessLead,
      addDeal, updateDeal, addQuote, updateQuote, addPayment, updatePayment, addTask, addUser, addReport
    }}>
      {children}
    </CRMContext.Provider>
  );
};
