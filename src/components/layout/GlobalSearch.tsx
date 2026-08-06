'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, FileText, GraduationCap, Calendar, CheckSquare, X, History, CreditCard, Folder, Phone, Mail, User, BarChart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { performGlobalSearch, SearchResult } from '@/lib/search';
import styles from './layout.module.css';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_recent_searches');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter(s => s !== term.trim())].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('crm_recent_searches', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setResults(performGlobalSearch(query).slice(0, 8));
  }, [query]);

  const handleResultClick = (url: string, term?: string) => {
    if (term) saveRecentSearch(term);
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      saveRecentSearch(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lead': return <Users size={16} />;
      case 'application': return <FileText size={16} />;
      case 'student': return <GraduationCap size={16} />;
      case 'task': return <CheckSquare size={16} />;
      case 'calendar': return <Calendar size={16} />;
      case 'payment': return <CreditCard size={16} />;
      case 'document': return <Folder size={16} />;
      case 'call': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      case 'user': return <User size={16} />;
      case 'report': return <BarChart size={16} />;
      case 'analytics': return <Activity size={16} />;
      default: return <Search size={16} />;
    }
  };

  const HighlightMatch = ({ text, match }: { text: string; match?: string }) => {
    if (!match || !text) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return (
      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
        Contains: {parts.map((part, i) => 
          part.toLowerCase() === match.toLowerCase() 
            ? <mark key={i} style={{ backgroundColor: 'rgba(37,99,235,0.2)', color: 'var(--primary-color)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div className={styles.headerSearch} style={{ position: 'relative', backgroundColor: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', flex: 1, maxWidth: '600px' }} ref={searchRef}>
      <Search size={18} className="text-text-tertiary" />
      <input 
        id="search-input"
        ref={inputRef}
        type="text" 
        placeholder="Search everything... (Ctrl+K or /)" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)' }}
      />
      {query && (
        <button onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <X size={14} color="var(--text-tertiary)" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 100,
              maxHeight: '450px',
              overflowY: 'auto'
            }}
          >
            {query.trim().length >= 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '8px', textTransform: 'uppercase' }}>Search Results</div>
                {results.length > 0 ? results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.url, result.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', flexShrink: 0 }}>
                      {getIcon(result.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{result.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{result.subtitle}</div>
                      {result.matchContext && <HighlightMatch text={result.matchContext} match={query.trim()} />}
                    </div>
                    <div style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {result.type}
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                    No results found for "{query}". Try searching for something else or press Enter to search all records.
                  </div>
                )}
                
                {results.length > 0 && (
                  <button 
                    onClick={() => handleKeyDown({ key: 'Enter' } as React.KeyboardEvent)}
                    style={{ margin: '8px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
                  >
                    View all results for "{query}"
                  </button>
                )}
              </div>
            ) : recentSearches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', padding: '8px', textTransform: 'uppercase' }}>Recent Searches</div>
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    onClick={() => { setQuery(term); document.getElementById('search-input')?.focus(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <History size={14} color="var(--text-tertiary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{term}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                Type at least 2 characters to search across all modules.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
