'use client';

import React, { useState, useRef, useMemo } from 'react';
import { UploadCloud, FileText, ChevronRight, CheckCircle2, AlertCircle, Trash2, ArrowRight, Settings } from 'lucide-react';
import Papa from 'papaparse';
import { useCRM } from '@/contexts/CRMContext';

interface LeadImportPageProps {
  hideHeader?: boolean;
  onComplete?: () => void;
}

type ImportStep = 'upload' | 'map' | 'settings' | 'preview' | 'summary';

const CRM_FIELDS = [
  { id: 'name', label: 'Lead Name (Required)' },
  { id: 'email', label: 'Email (Required)' },
  { id: 'mobile', label: 'Mobile Number' },
  { id: 'program', label: 'Program/Product' },
  { id: 'source', label: 'Lead Source' },
  { id: 'status', label: 'Lead Stage' },
  { id: 'priority', label: 'Priority' },
  { id: 'counselor', label: 'Lead Owner' },
  { id: 'date', label: 'Date' }
];

export default function LeadImportPage({ hideHeader = false, onComplete }: LeadImportPageProps) {
  const { addLead, leads, systemUsers, leadLifecycleStages, leadSourceList } = useCRM();
  const [step, setStep] = useState<ImportStep>('upload');
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  
  // Settings
  const [defaultOwner, setDefaultOwner] = useState('');
  const [defaultStage, setDefaultStage] = useState('');
  const [defaultSource, setDefaultSource] = useState('');
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');
  
  // Results
  const [summary, setSummary] = useState({ total: 0, imported: 0, skipped: 0, invalid: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
          
          // Auto-map based on common names
          const initialMapping: Record<string, string> = {};
          results.meta.fields.forEach(header => {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes('name')) initialMapping[header] = 'name';
            else if (lowerHeader.includes('email')) initialMapping[header] = 'email';
            else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) initialMapping[header] = 'mobile';
            else if (lowerHeader.includes('program') || lowerHeader.includes('product')) initialMapping[header] = 'program';
            else if (lowerHeader.includes('source')) initialMapping[header] = 'source';
          });
          setFieldMapping(initialMapping);
          setParsedData(results.data);
          setStep('map');
        }
      }
    });
  };

  const processedRecords = useMemo(() => {
    return parsedData.map(row => {
      const record: any = {};
      let isValid = true;
      let isDuplicate = false;
      const errors: string[] = [];

      // Map fields
      Object.keys(fieldMapping).forEach(header => {
        const crmField = fieldMapping[header];
        if (crmField && row[header]) {
          record[crmField] = row[header];
        }
      });

      // Apply defaults
      if (!record.counselor) record.counselor = defaultOwner || (systemUsers[0]?.name || 'Unassigned');
      if (!record.status) record.status = defaultStage || (leadLifecycleStages[0]?.name || 'New Lead');
      if (!record.source) record.source = defaultSource || 'Import';
      if (!record.priority) record.priority = 'Medium';
      if (!record.date) record.date = new Date().toISOString().split('T')[0];
      if (!record.program) record.program = 'Not Specified';

      // Validation
      if (!record.name) {
        isValid = false;
        errors.push("Missing Name");
      }
      if (!record.email) {
        isValid = false;
        errors.push("Missing Email");
      } else {
        // Check duplicates
        const exists = leads.some(l => l.email.toLowerCase() === record.email.toLowerCase() || (record.mobile && l.mobile === record.mobile));
        if (exists) {
          isDuplicate = true;
          if (duplicateAction === 'skip') isValid = false;
        }
      }

      return { record, isValid, isDuplicate, errors };
    });
  }, [parsedData, fieldMapping, defaultOwner, defaultStage, defaultSource, duplicateAction, leads, systemUsers, leadLifecycleStages]);

  const stats = useMemo(() => {
    return processedRecords.reduce((acc, row) => {
      acc.total++;
      if (row.isValid) acc.valid++;
      else acc.invalid++;
      if (row.isDuplicate) acc.duplicates++;
      return acc;
    }, { total: 0, valid: 0, invalid: 0, duplicates: 0 });
  }, [processedRecords]);

  const executeImport = () => {
    let imported = 0;
    let skipped = 0;
    let invalid = 0;

    processedRecords.forEach(row => {
      if (row.isValid) {
        addLead({
          ...row.record,
          id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });
        imported++;
      } else if (row.isDuplicate && duplicateAction === 'skip') {
        skipped++;
      } else {
        invalid++;
      }
    });

    setSummary({ total: parsedData.length, imported, skipped, invalid });
    setStep('summary');
  };

  const renderStepper = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '12px', flexWrap: 'wrap' }}>
      {[
        { id: 'upload', label: '1. Upload' },
        { id: 'map', label: '2. Map Fields' },
        { id: 'settings', label: '3. Settings' },
        { id: 'preview', label: '4. Preview & Import' }
      ].map((s, idx) => (
        <React.Fragment key={s.id}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            color: step === s.id ? '#3b82f6' : (['upload', 'map', 'settings', 'preview', 'summary'].indexOf(step) > idx ? '#10b981' : '#94a3b8'),
            fontWeight: step === s.id ? 700 : 500,
            fontSize: '0.95rem'
          }}>
            {s.label}
          </div>
          {idx < 3 && <ChevronRight size={16} color="#cbd5e1" />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ 
      padding: hideHeader ? '16px 24px' : '24px', 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box'
    }}>
      
      {!hideHeader && (
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Lead Import</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1.05rem' }}>Upload a CSV or Excel file to import leads into your CRM.</p>
        </div>
      )}

      {step !== 'summary' && renderStepper()}

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* STEP 1: UPLOAD */}
        {step === 'upload' && (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div 
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '60px 40px',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
              }}
            >
              <UploadCloud size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '1.2rem' }}>Drag & drop your CSV file here</h3>
              <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem' }}>or click to browse from your computer</p>
              
              <button style={{
                padding: '10px 24px', backgroundColor: 'white', border: '1px solid #cbd5e1', 
                borderRadius: '8px', color: '#334155', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                Browse File
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" style={{ display: 'none' }} />
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
              <FileText size={16} /> Supported formats: .CSV (Max 10MB)
            </div>
          </div>
        )}

        {/* STEP 2: MAP FIELDS */}
        {step === 'map' && (
          <div>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}>Map Columns to CRM Fields</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Match the headers from your file to the correct fields in the CRM.</p>
            </div>
            <div style={{ padding: '24px', maxHeight: '500px', overflowY: 'auto' }}>
              {headers.map((header) => (
                <div key={header} style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>File Column</div>
                    <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>{header}</div>
                  </div>
                  <ArrowRight size={20} color="#cbd5e1" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>CRM Field</div>
                    <select 
                      value={fieldMapping[header] || ''}
                      onChange={(e) => setFieldMapping({ ...fieldMapping, [header]: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', fontSize: '0.95rem' }}
                    >
                      <option value="">-- Do not import --</option>
                      {CRM_FIELDS.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setStep('upload')} style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep('settings')} style={{ padding: '10px 24px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SETTINGS */}
        {step === 'settings' && (
          <div>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}>Import Settings</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Set default values for missing fields and handle duplicates.</p>
            </div>
            
            <div style={{ padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Default Lead Owner</label>
                <select value={defaultOwner} onChange={e => setDefaultOwner(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                  <option value="">Auto-assign / Unassigned</option>
                  {systemUsers.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Default Lead Stage</label>
                <select value={defaultStage} onChange={e => setDefaultStage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                  {leadLifecycleStages.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Default Source</label>
                <select value={defaultSource} onChange={e => setDefaultSource(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                  {leadSourceList.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Duplicate Handling</label>
                <select value={duplicateAction} onChange={e => setDuplicateAction(e.target.value as any)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                  <option value="skip">Skip duplicate records</option>
                  <option value="update">Update existing records</option>
                </select>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Duplicates are identified by Email or Mobile Number.</p>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setStep('map')} style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep('preview')} style={{ padding: '10px 24px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Preview Import <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW */}
        {step === 'preview' && (
          <div>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}>Preview & Validate</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Review the data before executing the import.</p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{stats.valid}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Valid</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{stats.invalid}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Invalid</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{stats.duplicates}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Duplicates</div>
                </div>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 10, borderBottom: '2px solid #cbd5e1' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>Status</th>
                    {Object.values(fieldMapping).map((field, idx) => (
                      <th key={idx} style={{ padding: '12px 16px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
                        {CRM_FIELDS.find(f => f.id === field)?.label || field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedRecords.slice(0, 50).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: row.isValid ? 'white' : '#fef2f2' }}>
                      <td style={{ padding: '12px 16px' }}>
                        {row.isValid ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Ready
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }} title={row.errors.join(', ')}>
                            <AlertCircle size={14} /> {row.isDuplicate ? 'Duplicate' : 'Invalid'}
                          </div>
                        )}
                      </td>
                      {Object.values(fieldMapping).map((field, fIdx) => (
                        <td key={fIdx} style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                          {row.record[field] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
              <button onClick={() => setStep('settings')} style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Back</button>
              <button 
                onClick={executeImport}
                disabled={stats.valid === 0}
                style={{ 
                  padding: '10px 24px', 
                  backgroundColor: stats.valid === 0 ? '#94a3b8' : '#10b981', 
                  border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, 
                  cursor: stats.valid === 0 ? 'not-allowed' : 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '8px' 
                }}
              >
                Execute Import ({stats.valid} Leads) <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUMMARY */}
        {step === 'summary' && (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <CheckCircle2 size={40} color="#16a34a" />
            </div>
            <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: 800 }}>Import Complete!</h2>
            <p style={{ margin: '0 0 32px 0', color: '#64748b', fontSize: '1.05rem' }}>Your leads have been successfully imported into the CRM.</p>

            <div style={{ display: 'inline-flex', gap: '24px', backgroundColor: '#f8fafc', padding: '24px 40px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '40px', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Total Rows</div>
                <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800 }}>{summary.total}</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#cbd5e1' }}></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Imported</div>
                <div style={{ fontSize: '1.5rem', color: '#166534', fontWeight: 800 }}>{summary.imported}</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#cbd5e1' }}></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Skipped</div>
                <div style={{ fontSize: '1.5rem', color: '#b45309', fontWeight: 800 }}>{summary.skipped}</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#cbd5e1' }}></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Failed</div>
                <div style={{ fontSize: '1.5rem', color: '#991b1b', fontWeight: 800 }}>{summary.invalid}</div>
              </div>
            </div>

            <div>
              {onComplete && (
                <button 
                  onClick={onComplete}
                  style={{ padding: '12px 32px', backgroundColor: '#0f172a', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                >
                  Continue Setup <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
