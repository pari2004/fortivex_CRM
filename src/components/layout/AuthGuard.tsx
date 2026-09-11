'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';

const ROUTE_TO_MODULE_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/applications': 'Applications',
  '/students': 'Students',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/calls': 'Calls',
  '/conversations': 'Conversations',
  '/engagements': 'Engagements',
  '/email-hub': 'Email Hub',
  '/whatsapp-hub': 'WhatsApp Hub',
  '/opportunities': 'Opportunities',
  '/reports': 'Reports & Analytics',
  '/users': 'Users',
  '/customization': 'Customization',
  '/automation': 'Automation',
  '/settings': 'Settings',
  '/help': 'Help Center'
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasPermission, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    // Only redirect if not authenticated AND not already on the login or signup page
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
      return;
    }

    // Determine authorization for the current route
    if (isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      let requiredModule = '';
      
      // Find matching module by route prefix
      for (const [route, module] of Object.entries(ROUTE_TO_MODULE_MAP)) {
        if (pathname.startsWith(route)) {
          requiredModule = module;
          break;
        }
      }

      if (requiredModule) {
        const canView = hasPermission(requiredModule, 'View');
        setIsAuthorized(canView);
        if (!canView && pathname !== '/dashboard') {
          // Instead of redirecting instantly which might cause loops if Dashboard is also blocked,
          // we just render a lock screen. But if Dashboard is allowed, we could redirect there.
        }
      } else {
        // If route is not in the map (e.g. root /), allow access
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, pathname, router, hasPermission]);

  // Don't render anything if we're redirecting to login
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', padding: '20px' }}>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '50%', marginBottom: '24px' }}>
          <Lock size={48} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Access Denied</h1>
        <p style={{ color: '#64748b', maxWidth: '400px', lineHeight: 1.6, marginBottom: '24px' }}>
          You do not have the required "View" permissions to access this page. Please contact your CRM Administrator if you believe this is a mistake.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
