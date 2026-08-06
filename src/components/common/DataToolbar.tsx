'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date';
  options?: string[]; // for select
}

interface DataToolbarProps<T> {
  data: T[];
  onFilteredDataChange: (filtered: T[]) => void;
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  exportFilename?: string;
  selectedItems?: T[];
  exportMapping?: { key: keyof T, label: string }[];
}

export function DataToolbar<T extends Record<string, any>>({ 
  data, 
  onFilteredDataChange, 
  searchKeys, 
  searchPlaceholder = 'Search...', 
  filterOptions = [],
  exportFilename = 'export',
  selectedItems = [],
  exportMapping
}: DataToolbarProps<T>) {
  
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  // State for active filters: Record<key, value>
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const applyFilters = (key: string, val: string) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (!val) {
        delete next[key];
      } else {
        next[key] = val;
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  // The actual filtering logic
  const searchKeysStr = searchKeys.join(',');
  const activeFiltersStr = JSON.stringify(activeFilters);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Search
      const matchesSearch = search === '' || searchKeys.some(k => 
        String(item[k] || '').toLowerCase().includes(search.toLowerCase())
      );
      if (!matchesSearch) return false;

      // 2. Filters
      for (const [fKey, fVal] of Object.entries(activeFilters)) {
        if (fVal && String(item[fKey]).toLowerCase() !== fVal.toLowerCase()) {
          return false; // exclude if it doesn't match an active filter
        }
      }
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, searchKeysStr, activeFiltersStr]);

  // Use a ref for the callback to prevent infinite loops if the parent passes an inline function
  const onFilteredDataChangeRef = React.useRef(onFilteredDataChange);
  useEffect(() => {
    onFilteredDataChangeRef.current = onFilteredDataChange;
  }, [onFilteredDataChange]);

  // Push back up to parent whenever it changes
  useEffect(() => {
    onFilteredDataChangeRef.current(filteredData);
  }, [filteredData]);

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf', exportScope: 'all' | 'filtered' | 'selected' = 'filtered') => {
    let dataToExport = filteredData;
    if (exportScope === 'all') dataToExport = data;
    if (exportScope === 'selected') dataToExport = selectedItems.length > 0 ? selectedItems : [];

    if (dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }
    
    // Create a generic notification element
    const toast = document.createElement('div');
    toast.innerText = `Download Started: ${exportFilename}_${exportScope}.${format}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.innerText = `Download Complete: ${exportFilename}_${exportScope}.${format}`;
      toast.style.background = '#10b981'; // green
      setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
      }, 3000);
    }, 1500);

    // Format data according to exportMapping if provided
    const formattedData = dataToExport.map(item => {
      if (!exportMapping) return item;
      const formatted: Record<string, any> = {};
      exportMapping.forEach(mapping => {
        formatted[mapping.label] = item[mapping.key];
      });
      return formatted;
    });

    if ((format as any) === 'print') {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Export</title>');
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; font-family: sans-serif; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f4f4f4; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Exported Data</h2>');
        printWindow.document.write('<table><thead><tr>');
        const keys = Object.keys(formattedData[0]);
        keys.forEach(k => printWindow.document.write(`<th>${k}</th>`));
        printWindow.document.write('</tr></thead><tbody>');
        formattedData.forEach(row => {
          printWindow.document.write('<tr>');
          keys.forEach(k => printWindow.document.write(`<td>${String(row[k] || '')}</td>`));
          printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
    else if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportFilename}_${exportScope}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } 
    else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, `${exportFilename}_${exportScope}.xlsx`);
    }
    else if (format === 'pdf') {
      const doc = new jsPDF();
      const keys = Object.keys(formattedData[0]);
      const tableData = formattedData.map(row => keys.map(k => String(row[k])));
      autoTable(doc, { head: [keys], body: tableData });
      doc.save(`${exportFilename}_${exportScope}.pdf`);
    }
    setShowExport(false);
  };

  return (
    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '8px', flex: 1, minWidth: '250px' }}>
          <Search size={18} color="var(--text-tertiary)" />
          <input 
            type="text" 
            placeholder={searchPlaceholder} 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {filterOptions.length > 0 && (
            <button 
              onClick={() => { setShowFilters(true); setShowExport(false); }}
              style={{ padding: '8px 16px', background: Object.keys(activeFilters).length ? 'var(--primary-light)' : 'transparent', color: Object.keys(activeFilters).length ? 'var(--primary-color)' : 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}
            >
              <Filter size={18} /> Filters {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowExport(!showExport); setShowFilters(false); }}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}
            >
              <Download size={18} /> Export
            </button>
            
            <AnimatePresence>
              {showExport && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '250px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <div style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>EXPORT FILTERED ({filteredData.length})</div>
                  <button onClick={() => handleExport('csv', 'filtered')} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Export Filtered as CSV</button>
                  <button onClick={() => handleExport('xlsx', 'filtered')} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Export Filtered as Excel</button>
                  <button onClick={() => handleExport('pdf', 'filtered')} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Export Filtered as PDF</button>
                  <button onClick={() => handleExport('print' as any, 'filtered')} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Print Filtered</button>

                  <div style={{ margin: '4px 0', borderBottom: '1px solid var(--glass-border)' }} />
                  
                  <div style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>EXPORT SELECTED ({selectedItems.length})</div>
                  <button onClick={() => handleExport('csv', 'selected')} disabled={selectedItems.length === 0} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', opacity: selectedItems.length > 0 ? 1 : 0.5, transition: 'background 0.2s', width: '100%' }}>Export Selected as CSV</button>
                  <button onClick={() => handleExport('xlsx', 'selected')} disabled={selectedItems.length === 0} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', opacity: selectedItems.length > 0 ? 1 : 0.5, transition: 'background 0.2s', width: '100%' }}>Export Selected as Excel</button>
                  <button onClick={() => handleExport('pdf', 'selected')} disabled={selectedItems.length === 0} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed', opacity: selectedItems.length > 0 ? 1 : 0.5, transition: 'background 0.2s', width: '100%' }}>Export Selected as PDF</button>

                  <div style={{ margin: '4px 0', borderBottom: '1px solid var(--glass-border)' }} />

                  <div style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>EXPORT ALL ({data.length})</div>
                  <button onClick={() => handleExport('xlsx', 'all')} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Export All as Excel</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', zIndex: 998 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'var(--bg-primary)', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', zIndex: 999, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={20} /> Advanced Filters</h2>
                <button onClick={() => setShowFilters(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filterOptions.map(opt => (
                  <div key={opt.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{opt.label}</label>
                    {opt.type === 'select' ? (
                      <select 
                        value={activeFilters[opt.key] || ''} 
                        onChange={e => applyFilters(opt.key, e.target.value)}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-primary)', fontSize: '0.95rem' }}
                      >
                        <option value="">All</option>
                        {opt.options?.map((o, index) => <option key={`${o}-${index}`} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="date" 
                        value={activeFilters[opt.key] || ''} 
                        onChange={e => applyFilters(opt.key, e.target.value)}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-primary)', fontSize: '0.95rem' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
                 <button onClick={clearAllFilters} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Clear All</button>
                 <button onClick={() => setShowFilters(false)} style={{ flex: 1, padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>Apply Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
