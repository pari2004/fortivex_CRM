import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  readOnly?: boolean;
  width?: string | number;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export const GlobalSearchInput = React.forwardRef<HTMLInputElement, Props>(({ 
  placeholder = 'Search menu...', 
  value, 
  onChange, 
  onClick,
  readOnly = false,
  width = '300px',
  autoFocus = false,
  onKeyDown,
  onClear,
  isLoading = false
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: width, 
        cursor: onClick ? 'pointer' : 'text' 
      }}
      onClick={onClick}
    >
      <Search 
        size={18} 
        style={{ 
          position: 'absolute', 
          left: '16px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          color: isFocused ? 'var(--primary-color)' : '#9CA3AF',
          transition: 'color 0.2s ease',
          pointerEvents: 'none'
        }} 
      />
      <input 
        ref={ref}
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        style={{ 
          width: '100%',
          padding: `12px ${onClear || isLoading ? '42px' : '16px'} 12px 42px`,
          background: '#ffffff',
          border: `1px solid ${isFocused ? 'var(--primary-color)' : '#E5E7EB'}`,
          borderRadius: '16px',
          boxShadow: isFocused ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
          outline: 'none',
          color: '#111827',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          cursor: onClick ? 'pointer' : 'text'
        }}
        className="global-search-input-hover"
      />
      {isLoading ? (
        <Loader2 
          size={16} 
          className="search-spin-anim"
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }}
        />
      ) : onClear && value ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          className="search-clear-btn"
        >
          <X size={16} />
        </button>
      ) : null}
      <style dangerouslySetInnerHTML={{__html: `
        .global-search-input-hover:hover {
          border-color: ${isFocused ? 'var(--primary-color)' : '#D1D5DB'} !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .global-search-input-hover::placeholder {
          color: #9CA3AF;
        }
        .search-clear-btn:hover {
          background: #F3F4F6 !important;
          color: #4B5563 !important;
        }
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
        .search-spin-anim {
          animation: spin 1s linear infinite;
        }
      `}} />
    </div>
  );
});
