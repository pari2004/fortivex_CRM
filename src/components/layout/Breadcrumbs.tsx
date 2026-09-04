'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') return null;

  const paths = pathname.split('/').filter(p => p);
  const tab = searchParams.get('tab');

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '24px',
        fontSize: '0.85rem',
        color: 'var(--text-tertiary)'
      }}
    >
      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
        <Home size={14} />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        // If there's a tab, the main path shouldn't be the last item structurally (so it should be a link)
        const isLast = (index === paths.length - 1) && !tab;
        let formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        if (pathname === '/activity' && path === 'activity') formattedPath = 'Active Table View';

        return (
          <React.Fragment key={href}>
            <ChevronRight size={14} style={{ opacity: 0.5 }} />
            {isLast ? (
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {formattedPath}
              </span>
            ) : (
              <Link href={href} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                {formattedPath}
              </Link>
            )}
          </React.Fragment>
        );
      })}

      {tab && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        </>
      )}
    </motion.div>
  );
}
