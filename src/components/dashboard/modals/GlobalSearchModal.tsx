'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, FileText, User, Users, Briefcase, Phone, Video, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { GlobalSearchInput } from '../../ui/GlobalSearchInput';
import { useCRM } from '@/contexts/CRMContext';
import { useRouter } from 'next/navigation';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <strong key={i} style={{ color: 'var(--primary-color)' }}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

const recentSearches = ['Rahul Sharma', 'Admissions 2024', 'Marketing ROI', 'Pending Tasks'];

const mockResults = [
  { id: '1', title: 'Rahul Sharma', subtitle: 'Lead • Admission In Progress', icon: User, type: 'Lead', route: '/leads' },
  { id: '2', title: 'Admissions 2024', subtitle: 'Report • 4,500 Applications', icon: FileText, type: 'Report', route: '/dashboard/reports' },
  { id: '3', title: 'Marketing ROI', subtitle: 'Campaign • Q3 Analytics', icon: TrendingUp, type: 'Analytics', route: '/dashboard/marketing' },
  { id: '4', title: 'Call with Sneha', subtitle: 'Activity • Today, 2:30 PM', icon: Phone, type: 'Activity', route: '/activity' },
  { id: '5', title: 'Product Review Meeting', subtitle: 'Meeting • Tomorrow, 10:00 AM', icon: Video, type: 'Meeting', route: '/calendar' },
];

export function GlobalSearchModal({ isOpen, onClose, onNavigate }: Props) {
  const { leads, students, applications, calls, documents } = useCRM();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setActiveIdx(-1);
  }, [query]);

  if (!isOpen) return null;

  const getResults = () => {
    if (query.length <= 1) return [];
    const q = query.toLowerCase();
    const results: any[] = [];

    leads.forEach(l => {
      if (l.name?.toLowerCase().includes(q) || l.mobile?.includes(q) || l.email?.toLowerCase().includes(q)) {
        results.push({ id: `lead-${l.id}`, title: l.name, subtitle: `Lead • ${l.status}`, icon: User, type: 'Lead', route: '/leads' });
      }
    });

    students.forEach(s => {
      if (s.name?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q) || s.mobile?.includes(q) || s.email?.toLowerCase().includes(q)) {
        results.push({ id: `student-${s.id}`, title: s.name, subtitle: `Student • ID: ${s.studentId}`, icon: Users, type: 'Student', route: '/students' });
      }
    });

    applications.forEach(a => {
      if (a.studentName?.toLowerCase().includes(q) || a.id?.toLowerCase().includes(q)) {
        results.push({ id: `app-${a.id}`, title: `${a.studentName} - ${a.program}`, subtitle: `Application • ${a.status}`, icon: FileText, type: 'Application', route: '/applications' });
      }
    });

    calls.forEach(c => {
      if (c.student?.toLowerCase().includes(q) || c.mobile?.includes(q)) {
        results.push({ id: `call-${c.id}`, title: `Call with ${c.student}`, subtitle: `Activity • ${c.date} ${c.time}`, icon: Phone, type: 'Activity', route: '/activity' });
      }
    });

    return results.slice(0, 10); // Limit results to 10
  };

  const results = getResults();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < results.length) {
        handleNavigate(results[activeIdx].route);
      }
    }
  };


  useGlobalEscape(!!isOpen, () => { onClose() });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', zIndex: 99999 }}>
      <div 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '650px', background: 'var(--bg-primary)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 100000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <GlobalSearchInput 
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onClear={() => { setQuery(''); inputRef.current?.focus(); }}
            isLoading={isSearching}
            placeholder="Search across CRM (Leads, Students, Payments...)"
            width="100%"
          />
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>ESC</button>
        </div>

        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {query.length <= 1 ? (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Recent Searches</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentSearches.map((search, i) => (
                  <button 
                    key={i} 
                    onClick={() => setQuery(search)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }}
                    className="hover-bg-secondary"
                  >
                    <Clock size={16} color="var(--text-secondary)" />
                    <span style={{ flex: 1, fontSize: '1rem' }}>{search}</span>
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Quick Links</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['New Leads', 'Today\'s Tasks', 'Active Campaigns', 'Attendance Report'].map((link, i) => (
                    <button key={i} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Search Results</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.map((result, idx) => (
                  <button 
                    key={result.id} 
                    onClick={() => handleNavigate(result.route)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', 
                      background: activeIdx === idx ? 'var(--bg-secondary)' : 'transparent', 
                      border: `1px solid ${activeIdx === idx ? 'var(--primary-color)' : 'var(--glass-border)'}`, 
                      color: 'var(--text-primary)', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' 
                    }}
                  >
                    <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px', color: 'var(--primary-color)', border: '1px solid var(--glass-border)' }}>
                      <result.icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        <HighlightText text={result.title} highlight={query} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <HighlightText text={result.subtitle} highlight={query} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Search size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto', color: 'var(--text-secondary)' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No matching records found.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.7 }}>Try adjusting your search terms or check for typos.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
