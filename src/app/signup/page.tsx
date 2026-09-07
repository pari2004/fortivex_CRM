'use client';

import React, { Suspense } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#f8fafc' }} />}>
      <AuthScreen initialMode="signup" />
    </Suspense>
  );
}
