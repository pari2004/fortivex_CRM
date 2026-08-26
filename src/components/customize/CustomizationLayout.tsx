'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  { label: 'Lead Lifecycle', href: '/customization/customization/lead-lifecycle' },
  { label: 'Prospecting Criteria', href: '/customization/customization/prospecting-criteria' },
  { label: 'Deal Mode', href: '/customization/customization/deal-mode' },
  { label: 'Lead Tags', href: '/customization/customization/lead-tags' },
  { label: 'Lead Source', href: '/customization/customization/lead-source' },
  { label: 'Call Outcomes', href: '/customization/customization/call-outcomes' },
  { label: 'Visit Outcomes', href: '/customization/customization/visit-outcomes' },
  { label: 'Deal Setup', href: '/customization/customization/deal-setup' },
  { label: 'Tickets', href: '/customization/customization/tickets' },
  { label: 'Document Categories', href: '/customization/customization/document-categories' },
];

export function CustomizationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', minHeight: '100vh', padding: '0 24px' }}>
      {/* Horizontal Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', paddingTop: '16px' }}>
        <button 
          onClick={scrollLeft}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b' }}
        >
          <ChevronLeft size={18} />
        </button>
        
        <div 
          ref={scrollContainerRef}
          style={{ 
            display: 'flex', 
            overflowX: 'hidden', 
            scrollBehavior: 'smooth',
            flex: 1,
            whiteSpace: 'nowrap',
            msOverflowStyle: 'none', /* IE and Edge */
            scrollbarWidth: 'none', /* Firefox */
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
          {TABS.map((tab) => {
            const isActive = pathname === tab.href || (pathname === '/customization/customization' && tab.href === '/customization/customization/lead-lifecycle');
            return (
              <Link 
                key={tab.href} 
                href={tab.href}
                style={{
                  padding: '12px 20px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563eb' : '#64748b',
                  borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  top: '1px' // Cover the parent border
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        
        <button 
          onClick={scrollRight}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
