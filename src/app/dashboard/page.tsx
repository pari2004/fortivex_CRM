'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CounselorDashboard } from '@/components/dashboard/CounselorDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { MarketingDashboard } from '@/components/dashboard/MarketingDashboard';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      {role === 'admin' && <AdminDashboard />}
      {role === 'counselor' && <CounselorDashboard />}
      {role === 'manager' && <ManagerDashboard />}
      {role === 'marketing' && <MarketingDashboard />}
      {role === 'member' && <MemberDashboard />}
      {!['admin', 'counselor', 'manager', 'marketing', 'member'].includes(role) && <div>Access Denied</div>}
    </Suspense>
  );
}
