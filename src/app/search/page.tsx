'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { performGlobalSearch, SearchResult } from '@/lib/search';
import { Users, FileText, GraduationCap, Calendar, CheckSquare, Search, CreditCard, Folder, Phone, Mail, User, BarChart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const router = useRouter();

  useEffect(() => {
    if (q) {
      setResults(performGlobalSearch(q));
    } else {
      setResults([]);
    }
  }, [q]);

  const tabs = [
    'All', 'Leads', 'Students', 'Applications', 'Payments', 
    'Documents', 'Tasks', 'Emails', 'Calls', 'Reports', 'Analytics'
  ];

  const getFilteredResults = () => {
    if (activeTab === 'All') return results;
    // Map plural tab names to singular types
    const tabToTypeMap: Record<string, string> = {
      'Leads': 'Lead',
      'Students': 'Student',
      'Applications': 'Application',
      'Payments': 'Payment',
      'Documents': 'Document',
      'Tasks': 'Task',
      'Emails': 'Email',
      'Calls': 'Call',
      'Reports': 'Report',
      'Analytics': 'Analytics'
    };
    return results.filter(r => r.type === tabToTypeMap[activeTab]);
  };

  const filteredResults = getFilteredResults();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lead': return <Users size={18} />;
      case 'application': return <FileText size={18} />;
      case 'student': return <GraduationCap size={18} />;
      case 'task': return <CheckSquare size={18} />;
      case 'calendar': return <Calendar size={18} />;
      case 'payment': return <CreditCard size={18} />;
      case 'document': return <Folder size={18} />;
      case 'call': return <Phone size={18} />;
      case 'email': return <Mail size={18} />;
      case 'user': return <User size={18} />;
      case 'report': return <BarChart size={18} />;
      case 'analytics': return <Activity size={18} />;
      default: return <Search size={18} />;
    }
  };

  const HighlightMatch = ({ text, match }: { text: string; match: string }) => {
    if (!match || !text) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === match.toLowerCase() 
            ? <mark key={i} style={{ backgroundColor: 'rgba(37,99,235,0.2)', color: 'var(--primary-color)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Search Results for "{q}"
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Found {results.length} matching {results.length === 1 ? 'record' : 'records'} across all modules.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
        {tabs.map(tab => {
          const typeMap: Record<string, string> = {
            'Leads': 'Lead', 'Students': 'Student', 'Applications': 'Application', 'Payments': 'Payment',
            'Documents': 'Document', 'Tasks': 'Task', 'Emails': 'Email', 'Calls': 'Call', 'Reports': 'Report', 'Analytics': 'Analytics'
          };
          const count = tab === 'All' ? results.length : results.filter(r => r.type === typeMap[tab]).length;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: activeTab === tab ? 'var(--primary-color)' : 'var(--bg-secondary)',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab} <span style={{ opacity: 0.8, fontSize: '0.8rem', background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'var(--border-color)', padding: '2px 8px', borderRadius: '12px' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      {filteredResults.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredResults.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => router.push(result.url)}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', flexShrink: 0 }}>
                {getIcon(result.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                    <HighlightMatch text={result.title} match={q} />
                  </h3>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 500, border: '1px solid var(--border-color)' }}>
                    {result.type}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 8px 0' }}>
                  <HighlightMatch text={result.subtitle} match={q} />
                </p>
                {result.matchContext && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
                    <span style={{ fontWeight: 600 }}>Matched Context:</span> <HighlightMatch text={result.matchContext} match={q} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <Search size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No matching records found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              We couldn't find anything matching "{q}" in {activeTab === 'All' ? 'any module' : `the ${activeTab} module`}. Try adjusting your search or create a new record.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              onClick={() => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
              }}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear Search
            </button>
            <button 
              onClick={() => router.push('/leads/new')}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
            >
              Create New Lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
