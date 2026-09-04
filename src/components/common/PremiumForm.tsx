import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function PremiumInput({ label, icon, error, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;
  
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        color: isFocused ? '#2563eb' : 'var(--text-secondary)',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isFocused ? '#2563eb' : 'var(--text-tertiary)', transition: 'color 0.2s', pointerEvents: 'none' }}>
            {icon}
          </div>
        )}
        <input 
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            padding: `14px 16px 14px ${icon ? '44px' : '16px'}`,
            borderRadius: '16px',
            border: `1px solid ${error ? '#ef4444' : isFocused ? '#2563eb' : 'rgba(0,0,0,0.1)'}`,
            background: isFocused ? '#fff' : 'rgba(255,255,255,0.7)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: isFocused ? '0 4px 12px rgba(37, 99, 235, 0.1), 0 0 0 3px rgba(37, 99, 235, 0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            ...props.style
          }}
        />
        {error && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ fontSize: '0.8rem', color: '#ef4444' }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  options: { label: string; value: string }[] | string[];
}

export function PremiumSelect({ label, icon, options, ...props }: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        color: isFocused ? '#2563eb' : 'var(--text-secondary)',
        transition: 'color 0.2s'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isFocused ? '#2563eb' : 'var(--text-tertiary)', transition: 'color 0.2s', pointerEvents: 'none' }}>
            {icon}
          </div>
        )}
        <select 
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            padding: `14px 40px 14px ${icon ? '44px' : '16px'}`,
            borderRadius: '16px',
            border: `1px solid ${isFocused ? '#2563eb' : 'rgba(0,0,0,0.1)'}`,
            background: isFocused ? '#fff' : 'rgba(255,255,255,0.7)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: isFocused ? '0 4px 12px rgba(37, 99, 235, 0.1), 0 0 0 3px rgba(37, 99, 235, 0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            appearance: 'none',
            ...props.style
          }}
        >
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return <option key={i} value={val}>{lbl}</option>;
          })}
        </select>
        {/* Custom Chevron */}
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isFocused ? '#2563eb' : 'var(--text-tertiary)' }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PremiumTextArea({ label, icon, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, icon?: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: isFocused ? '#2563eb' : 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '16px', top: '16px', color: isFocused ? '#2563eb' : 'var(--text-tertiary)', transition: 'color 0.2s', pointerEvents: 'none' }}>
            {icon}
          </div>
        )}
        <textarea 
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            padding: `14px 16px 14px ${icon ? '44px' : '16px'}`,
            borderRadius: '16px',
            border: `1px solid ${isFocused ? '#2563eb' : 'rgba(0,0,0,0.1)'}`,
            background: isFocused ? '#fff' : 'rgba(255,255,255,0.7)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: isFocused ? '0 4px 12px rgba(37, 99, 235, 0.1), 0 0 0 3px rgba(37, 99, 235, 0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            minHeight: '100px',
            resize: 'vertical',
            ...props.style
          }}
        />
      </div>
    </div>
  );
}

export function PremiumCard({ title, icon, children, badge }: { title: string; icon?: React.ReactNode; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '20px', 
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
      padding: '24px',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
          {icon && <span style={{ color: '#2563eb', background: 'rgba(37, 99, 235, 0.1)', padding: '6px', borderRadius: '10px', display: 'flex' }}>{icon}</span>}
          {title}
        </h4>
        {badge && <div>{badge}</div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export function PremiumSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  // Alias to preserve backward compatibility if used anywhere
  return <PremiumCard title={title} icon={icon}>{children}</PremiumCard>;
}

export function ToggleSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: (c: boolean) => void; label?: string; description?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 0' }}>
      {(label || description) && (
        <div>
          {label && <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>}
          {description && <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{description}</div>}
        </div>
      )}
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? 'var(--primary-color)' : 'rgba(0,0,0,0.1)',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        <motion.div 
          initial={false}
          animate={{ x: checked ? 20 : 2 }}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      </button>
    </div>
  );
}
