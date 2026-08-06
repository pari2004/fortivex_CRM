import os

content = """import React from 'react';
import { Users, FileText, GraduationCap, CheckSquare, Calendar, Phone, MessageCircle, MailWarning, FolderOpen, PieChart, BarChart2, ShieldCheck, Settings, Book } from 'lucide-react';

export type SearchCategory = 'All' | 'Students' | 'Leads' | 'Applications' | 'Payments' | 'Documents' | 'Tasks' | 'Users' | 'Reports' | 'Automation';

export interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  url: string;
  icon: string;
}

const searchIndex: SearchResult[] = [
  { id: 'LD-01', title: 'Rahul Sharma', category: 'Leads', description: 'New Lead - Full Stack Development', url: '/leads', icon: 'Users' },
  { id: 'LD-02', title: 'Priya Reddy', category: 'Leads', description: 'Interested - Data Science', url: '/leads', icon: 'Users' },
  { id: 'ST-01', title: 'Arjun Kumar', category: 'Students', description: 'Student STU-5001 - Enrolled', url: '/students', icon: 'GraduationCap' },
  { id: 'ST-02', title: 'Sneha Patil', category: 'Students', description: 'Student STU-5002 - Completed', url: '/students', icon: 'GraduationCap' },
  { id: 'APP-1025', title: 'Application APP-1025', category: 'Applications', description: 'Submitted by Aditya Singh', url: '/applications', icon: 'FileText' },
  { id: 'APP-1026', title: 'Application APP-1026', category: 'Applications', description: 'Under Review - Rahul Sharma', url: '/applications', icon: 'FileText' },
  { id: 'PAY-1', title: 'Invoice INV-202301', category: 'Payments', description: 'Student: Arjun Kumar - Completed', url: '/payments', icon: 'PieChart' },
  { id: 'PAY-2', title: 'Invoice INV-202302', category: 'Payments', description: 'Student: Sneha Patil - Pending', url: '/payments', icon: 'PieChart' },
  { id: 'DOC-1', title: 'Aadhaar_Student1.pdf', category: 'Documents', description: 'Uploaded by Student 1', url: '/documents', icon: 'FolderOpen' },
  { id: 'DOC-2', title: '10th_Marks_Card.pdf', category: 'Documents', description: 'Uploaded by Arjun Kumar', url: '/documents', icon: 'FolderOpen' },
  { id: 'TSK-1', title: 'Call Lead for Demo', category: 'Tasks', description: 'Assigned to Rahul Sharma - High Priority', url: '/tasks', icon: 'CheckSquare' },
  { id: 'MOD-1', title: 'Payments', category: 'All', description: 'Manage invoices and transactions', url: '/payments', icon: 'PieChart' },
  { id: 'MOD-2', title: 'Analytics', category: 'All', description: 'View system analytics and charts', url: '/analytics', icon: 'BarChart2' },
  { id: 'MOD-3', title: 'Reports', category: 'All', description: 'Generate and download reports', url: '/reports', icon: 'FileText' },
  { id: 'MOD-4', title: 'Roles & Permissions', category: 'All', description: 'Manage user access control', url: '/roles', icon: 'ShieldCheck' },
  { id: 'MOD-5', title: 'Automation', category: 'All', description: 'Manage automated workflows', url: '/automation', icon: 'Settings' },
  { id: 'MOD-6', title: 'Help Center', category: 'All', description: 'Support, FAQs, and documentation', url: '/help', icon: 'Book' }
];

export const searchGlobal = (query: string, category: SearchCategory = 'All'): SearchResult[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  return searchIndex.filter(item => {
    const matchesCategory = category === 'All' || item.category === category || item.category === 'All';
    const matchesQuery = item.title.toLowerCase().includes(lowerQuery) || item.description.toLowerCase().includes(lowerQuery);
    return matchesCategory && matchesQuery;
  });
};
"""
os.makedirs("/Users/pavan.s.h/Desktop/crm fullstack development/src/lib", exist_ok=True)
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/lib/search.ts", "w") as f:
    f.write(content)
print("Created search index")
