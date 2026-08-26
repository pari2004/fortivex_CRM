'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') return null;

  const paths = pathname.split('/').filter(p => p);

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
        const isLast = index === paths.length - 1;
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
    </motion.div>
  );
}
