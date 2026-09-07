'use client';

import React, { Suspense } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#f8fafc' }} />}>
      <AuthScreen initialMode="login" />
    </Suspense>
  );
}
