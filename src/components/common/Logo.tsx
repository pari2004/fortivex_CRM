'use client';
import React from 'react';
import Image from 'next/image';
import { useSettings } from '@/contexts/SettingsContext';

interface LogoProps {
  size?: number; // Intended height
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  const { companyLogo } = useSettings();

  return (
    <div 
      style={{ 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0' 
      }} 
      className={className}
    >
      <Image 
        src={companyLogo || "/logo.png"} 
        alt="FORTIVEX.AI CRM" 
        width={size * 2.5} 
        height={size}
        style={{ 
          objectFit: 'contain', 
          width: 'auto', 
          height: `${size}px`,
          maxHeight: '100%'
        }}
        priority
      />
    </div>
  );
}
