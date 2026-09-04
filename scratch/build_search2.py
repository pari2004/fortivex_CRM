import os

content = """export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  url: string;
  matchContext?: string;
}

const mockData: SearchResult[] = [
  { id: '1', title: 'Rahul Sharma', subtitle: 'New Lead - Full Stack Development', type: 'Lead', url: '/leads' },
  { id: '2', title: 'Aditya Singh', subtitle: 'Enrolled Student STU-5001', type: 'Student', url: '/students' },
  { id: '3', title: 'Priya Reddy', subtitle: 'Application Under Review', type: 'Application', url: '/applications' },
  { id: '4', title: 'Invoice INV-202301', subtitle: 'Rahul Sharma - ₹50,000', type: 'Payment', url: '/payments' },
  { id: '5', title: 'Call Lead for Demo', subtitle: 'Assigned to Sales Team', type: 'Task', url: '/tasks' },
  { id: '6', title: 'Aadhaar_Card.pdf', subtitle: 'Document uploaded by Aditya Singh', type: 'Document', url: '/documents' },
  { id: '7', title: 'Demo Meeting', subtitle: 'Scheduled with Priya', type: 'Calendar', url: '/calendar' },
  { id: '8', title: 'Welcome Automation', subtitle: 'Active workflow', type: 'Automation', url: '/automation' },
  { id: '9', title: 'Roles & Permissions', subtitle: 'Manage access control', type: 'System', url: '/roles' },
  { id: '10', title: 'Monthly Revenue', subtitle: 'Report generation', type: 'Report', url: '/reports' },
];

export const performGlobalSearch = (query: string): SearchResult[] => {
  if (!query || query.trim().length < 2) return [];
  const lowerQuery = query.toLowerCase();
  
  return mockData.filter(item => {
    return item.title.toLowerCase().includes(lowerQuery) || 
           item.subtitle.toLowerCase().includes(lowerQuery) || 
           item.type.toLowerCase().includes(lowerQuery);
  }).map(item => {
    // Basic match context extraction
    let matchContext = undefined;
    if (item.subtitle.toLowerCase().includes(lowerQuery)) {
      matchContext = item.subtitle;
    } else if (item.title.toLowerCase().includes(lowerQuery)) {
      matchContext = item.title;
    }
    return { ...item, matchContext };
  });
};
"""
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/lib/search.ts", "w") as f:
    f.write(content)
print("Created search index match")
