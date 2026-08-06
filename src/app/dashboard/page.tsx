'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CounselorDashboard } from '@/components/dashboard/CounselorDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { MarketingDashboard } from '@/components/dashboard/MarketingDashboard';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';

export default function DashboardPage() {
  const { role } = useAuth();

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'counselor':
      return <CounselorDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'marketing':
      return <MarketingDashboard />;
    case 'member':
      return <MemberDashboard />;
    default:
      return <div>Access Denied</div>;
  }
}
