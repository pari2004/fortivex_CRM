'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApplicationsDashboard } from '@/components/applications/ApplicationsDashboard';
import { useCRM } from '@/contexts/CRMContext';

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('All Applications');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  return (
    <ApplicationsDashboard activeStatus={status} />
  );
}
