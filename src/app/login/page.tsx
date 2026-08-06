'use client';

import React, { Suspense } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#0f111a' }} />}>
      <AuthScreen initialMode="login" />
    </Suspense>
  );
}
