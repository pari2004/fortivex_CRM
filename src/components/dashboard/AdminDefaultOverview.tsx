'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, BookOpen, FileText, MonitorPlay, PhoneForwarded, IndianRupee, Wallet, UsersRound, Building2, ListTodo, CheckSquare, Calendar, FileDown, CreditCard, Activity, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';

const demoData = {
  totalLeads: 1254,
  newLeadsToday: 42,
  activeStudents: 342,
  newApplications: 15,
  demoSessionsToday: 8,
  followupsPending: 24,
  revenueToday: '₹45,000',
  totalRevenue: '₹24,50,000',
  activeUsers: 12,
  activeTeams: 4,
  openTasks: 56,
  completedTasks: 128,
  todaysMeetings: 6,
  documentsUploaded: 34,
  paymentsReceived: 12,
  conversionRate: '18.4%'
};

export function AdminDefaultOverview() {
  const router = useRouter();
  const { leads, applications, students } = useCRM();

  const handleCardClick = (metric: string) => {
    // Dynamic route to the enterprise detail page
    router.push(`/dashboard/details/${metric}`);
  };

  const panelItems = [
    { id: 'total-leads', title: 'Total Leads', value: (demoData.totalLeads + leads.length).toString(), icon: Users, color: '#3b82f6' },
    { id: 'new-leads-today', title: 'New Leads Today', value: demoData.newLeadsToday.toString(), icon: UserPlus, color: '#10b981' },
    { id: 'active-students', title: 'Active Students', value: (demoData.activeStudents + students.length).toString(), icon: BookOpen, color: '#f59e0b' },
    { id: 'new-applications', title: 'New Applications', value: (demoData.newApplications + applications.length).toString(), icon: FileText, color: '#8b5cf6' },
    { id: 'demo-sessions-today', title: 'Demo Sessions Today', value: demoData.demoSessionsToday.toString(), icon: MonitorPlay, color: '#ec4899' },
    { id: 'follow-ups-pending', title: 'Follow-ups Pending', value: demoData.followupsPending.toString(), icon: PhoneForwarded, color: '#ef4444' },
    { id: 'revenue-today', title: 'Revenue Today', value: demoData.revenueToday, icon: IndianRupee, color: '#10b981' },
    { id: 'total-revenue', title: 'Total Revenue', value: demoData.totalRevenue, icon: Wallet, color: '#059669' },
    { id: 'active-users', title: 'Active Users', value: demoData.activeUsers.toString(), icon: UsersRound, color: '#6366f1' },
    { id: 'active-teams', title: 'Active Teams', value: demoData.activeTeams.toString(), icon: Building2, color: '#8b5cf6' },
    { id: 'open-tasks', title: 'Open Tasks', value: demoData.openTasks.toString(), icon: ListTodo, color: '#f59e0b' },
    { id: 'completed-tasks', title: 'Completed Tasks', value: demoData.completedTasks.toString(), icon: CheckSquare, color: '#10b981' },
    { id: 'todays-meetings', title: 'Today\'s Meetings', value: demoData.todaysMeetings.toString(), icon: Calendar, color: '#3b82f6' },
    { id: 'documents-uploaded', title: 'Documents Uploaded', value: demoData.documentsUploaded.toString(), icon: FileDown, color: '#8b5cf6' },
    { id: 'payments-received', title: 'Payments Received', value: demoData.paymentsReceived.toString(), icon: CreditCard, color: '#10b981' },
    { id: 'conversion-rate', title: 'Conversion Rate', value: demoData.conversionRate, icon: Activity, color: '#ec4899' },
  ];

  return (
    <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', height: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Default</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Enterprise Admin Overview</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {panelItems.map((item, i) => (
          <motion.div 
            key={item.id}
            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleCardClick(item.id)}
            style={{ 
              padding: '16px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: i < panelItems.length - 1 ? '1px solid var(--glass-border)' : 'none',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}20`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={20} />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.value}</div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
