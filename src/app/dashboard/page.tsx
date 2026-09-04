'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
