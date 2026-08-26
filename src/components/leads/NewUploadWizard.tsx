'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileSpreadsheet, AlertCircle, X, Info } from 'lucide-react';
import { GenericModal } from '@/components/leads/GenericModal';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Add commonly mapped CRM fields
const CRM_FIELDS = [
  'Lead Name', 'Lead Owner', 'Mobile Number', 'Email', 'Lead Stage', 'Lead Priority', 'Lead Type', 'Lead Source',
  'Source - Level 2', 'Source - Level 3', 'Source - Level 4', 'Lead Disposition', 'Tags', 'Product or Service',
  'Business', 'Address', 'State', 'City', 'Area', 'Country', 'Zipcode', 'Designation', 'Primary Team',
  'Next Followup', 'Last Worked', 'Started Work On', 'Speed to First Call', 'Recent Actions', 'Unanswered Calls',
  'Unanswered After Missed', 'Missed Calls from Them', 'Last User Remark', 'Next Open Task', 'Open Ticket',
  'Last Closed Task', 'Last Engagement By Us', 'Last Engagement By Lead',
  'Last Call Time', 'Last Call Duration(s)', 'Last Call Direction', 'Last Call Outcome', 'Last Call Nature', 'Last Called By',
  'Last Visit', 'Last Visit Outcome', 'Last Visit Nature', 'Last Visit By',
  'Last Email', 'Last Email By', 'Last Whatsapp', 'Last Whatsapp By', 'Last Waba Broadcast', 'Last Broadcast Status',
  'Last Broadcast Reply', 'Last Broadcast Reply Type', 'Last Broadcast Reply Time',
  'Last Note', 'Last Note By', 'Last Task Done', 'Last Task By',
  'Last Payment Status', 'Last Payment Amount', 'Total Payment',
  'Lead Added By', 'Assign Status', 'Assigned On', 'Last Repeat Enquiry', 'Created', 'Last Updated', 'Is Duplicate',
  'Career Goal', 'Current Company Type', 'Enrollment Timeline', 'Experience Level', 'Interested In?', 'Technical Background',
  'What are you looking for?'
];

const AUTO_MAP: Record<string, string> = {
  'name': 'Lead Name', 'first name': 'Lead Name', 'full name': 'Lead Name', 'lead name': 'Lead Name',
  'phone': 'Mobile Number', 'mobile': 'Mobile Number', 'phone number': 'Mobile Number', 'contact number': 'Mobile Number',
  'email': 'Email', 'email address': 'Email', 'mail': 'Email',
  'owner': 'Lead Owner', 'lead owner': 'Lead Owner', 'assigned to': 'Lead Owner',
  'company': 'Business', 'business': 'Business', 'organization': 'Business',
  'stage': 'Lead Stage', 'status': 'Lead Stage', 'lead stage': 'Lead Stage',
  'priority': 'Lead Priority', 'lead priority': 'Lead Priority'
};

export function NewUploadWizard({ onClose, onSuccess }: { onClose: () => void, onSuccess: (data: any) => void }) {
  const [wizardStep, setWizardStep] = useState(1);
  const [newUploadName, setNewUploadName] = useState('');
  const [newUploadDesc, setNewUploadDesc] = useState('');
  const [newUploadSource, setNewUploadSource] = useState('Direct Upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);

  // Mapping State
  const [assignmentMethod, setAssignmentMethod] = useState('Yourself');
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [mappings, setMappings] = useState<{[key: string]: string}>({});
  
  const requiredFields = ['Lead Name', 'Mobile Number'];
  
  // Validation State
  const [validationStats, setValidationStats] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);

    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data, results.meta.fields || []);
        }
      });
    } else if (ext === 'xls' || ext === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 0) {
          const headers = data[0] as string[];
          const rows = data.slice(1).map((row: any) => {
            const rowData: any = {};
            headers.forEach((h, i) => {
              rowData[h] = row[i];
            });
            return rowData;
          });
          processParsedData(rows, headers);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format. Please upload CSV or Excel.");
      setUploadedFile(null);
    }
  };

  const processParsedData = (data: any[], headers: string[]) => {
    setParsedData(data);
    setFileHeaders(headers);
    
    // Auto-map headers
    const newMappings: {[key: string]: string} = {};
    headers.forEach(h => {
      const lower = h.toLowerCase().trim();
      if (AUTO_MAP[lower]) {
        newMappings[h] = AUTO_MAP[lower];
      } else {
        newMappings[h] = '';
      }
    });
    setMappings(newMappings);
  };

  const validateData = () => {
    let valid = 0;
    let invalid = 0;
    let dupes = 0; // simplistic dup check for demo

    parsedData.forEach(row => {
      let isRowValid = true;
      requiredFields.forEach(rf => {
        // Find which CSV header maps to this required field
        const headerName = Object.keys(mappings).find(k => mappings[k] === rf);
        if (!headerName || !row[headerName] || String(row[headerName]).trim() === '') {
          isRowValid = false;
        }
      });
      if (isRowValid) valid++;
      else invalid++;
    });

    setValidationStats({ total: parsedData.length, valid, invalid, duplicates: dupes });
  };

  const handleWizardNext = () => {
    if (wizardStep === 1) {
      if (!newUploadName.trim()) {
        alert("Please provide a Lead List Name.");
        return;
      }
      if (!uploadedFile || parsedData.length === 0) {
        alert("Please upload a valid CSV or Excel file first.");
        return;
      }
      setWizardStep(2);
    } else if (wizardStep === 2) {
      const mappedValues = Object.values(mappings);
      const isMappingValid = requiredFields.every(field => mappedValues.includes(field));
      
      if (!isMappingValid) {
        alert("Please map all required CRM fields (Lead Name, Mobile Number) before continuing.");
        return;
      }
      
      validateData();
      setWizardStep(3); // Go to Validation step instead of directly saving
    } else if (wizardStep === 3) {
       // Save step
       if (validationStats.valid === 0) {
         alert("No valid rows found. Please fix mapping or data.");
         return;
       }

       setIsProcessing(true);
       setTimeout(() => {
         setIsProcessing(false);
         
         const mappedLeads = parsedData.map((row, idx) => {
           const leadData: any = {
             stage: 'New', // default
             priority: 'Medium', // default
             active: true, // default
           };
           Object.keys(mappings).forEach(csvCol => {
             const crmField = mappings[csvCol];
             if (crmField && crmField !== 'Skip/Ignore') {
                // map special fields
                if (crmField === 'Lead Name') leadData.name = row[csvCol];
                else if (crmField === 'Mobile Number') leadData.mobile = row[csvCol];
                else if (crmField === 'Email') leadData.email = row[csvCol];
                else if (crmField === 'Lead Stage') leadData.stage = row[csvCol];
                else if (crmField === 'Lead Owner') leadData.owner = row[csvCol];
                else if (crmField === 'Lead Priority') leadData.priority = row[csvCol];
                else leadData[crmField] = row[csvCol];
             }
           });
           
           if (!leadData.owner) leadData.owner = assignmentMethod === 'Yourself' ? 'Rahul Sharma' : 'Unassigned';
           leadData.tags = uploadTags;
           return leadData;
         }).filter(lead => lead.name && lead.mobile); // Only valid

         const newUploadRecord = {
           listName: newUploadName,
           listStatus: 'Completed',
           success: validationStats.valid,
           duplicate: validationStats.duplicates,
           doNotTrack: 0,
           invalidNumber: 0,
           invalidEmail: 0,
           failed: validationStats.invalid,
           totalRecords: validationStats.total,
           distribution: assignmentMethod,
           uploadedFile: uploadedFile?.name || 'upload.xlsx',
           listDescription: newUploadDesc || 'Imported via Global Upload Wizard',
           tags: uploadTags,
           uploadedBy: 'Rahul Sharma',
           bulkUploadSource: newUploadSource,
           createdOn: new Date().toISOString(),
         };

         onSuccess({ uploadRecord: newUploadRecord, importedLeads: mappedLeads });
         setWizardStep(4);
       }, 1500);
    }
  };

  return (
    <GenericModal key="wizard" title={wizardStep === 1 ? "New Upload: Step 1" : (wizardStep === 2 ? "New Upload: Map Attributes" : (wizardStep === 3 ? "New Upload: Validation" : "Upload Complete"))} width={wizardStep === 4 ? "500px" : "700px"} onClose={onClose} onSave={isProcessing || wizardStep === 4 ? undefined : handleWizardNext} saveText={isProcessing ? "Processing..." : (wizardStep === 1 ? "Next / Map Attributes" : (wizardStep === 2 ? "Validate Data" : "Save / Import"))}>
      {wizardStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Lead List Name <span style={{color: 'red'}}>*</span></label>
                <input type="text" value={newUploadName} onChange={e => setNewUploadName(e.target.value)} placeholder="e.g. Q3 Expo Leads" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
             </div>
             <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Bulk Upload Source</label>
                <select value={newUploadSource} onChange={e => setNewUploadSource(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                   <option>Direct Upload</option><option>API Sync</option><option>Facebook Ads</option><option>Google Ads</option>
                </select>
             </div>
          </div>
          <div>
             <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>List Description</label>
             <input type="text" value={newUploadDesc} onChange={e => setNewUploadDesc(e.target.value)} placeholder="Short description of this list..." style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div>
             <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Upload CSV or Excel File <span style={{color: 'red'}}>*</span></label>
             <div style={{ marginTop: '8px', border: uploadedFile ? '2px solid var(--primary-color)' : '2px dashed var(--border-color)', borderRadius: '12px', padding: '40px', textAlign: 'center', background: uploadedFile ? '#f0fdf4' : '#f8fafc', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
               {uploadedFile ? (
                 <>
                   <FileSpreadsheet size={40} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
                   <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{uploadedFile.name}</h3>
                   <p style={{ margin: '8px 0 0', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>{(uploadedFile.size / 1024).toFixed(2)} KB • {parsedData.length} records parsed</p>
                 </>
               ) : (
                 <>
                   <UploadCloud size={40} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
                   <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Click or drag file to this area to upload</h3>
                   <p style={{ margin: '8px 0 0', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Supports CSV, XLS, XLSX formats</p>
                 </>
               )}
               <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".csv,.xls,.xlsx" onChange={handleFileUpload} />
             </div>
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
             <Info size={24} color="#3b82f6" />
             <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a' }}>Auto-mapping applied! We mapped <b>{Object.values(mappings).filter(v => v !== '').length}</b> columns automatically. Please verify below. 'Lead Name' and 'Mobile Number' are required.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '400px', overflowY: 'auto' }}>
             <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Map Attributes</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fileHeaders.map((csvField, i) => {
                const mappedVal = mappings[csvField] || '';
                const isMapped = mappedVal !== '' && mappedVal !== 'Skip/Ignore';
                
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ padding: '10px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }} title={csvField}>{csvField}</div>
                    <div style={{ color: 'var(--text-tertiary)' }}>→</div>
                    <select 
                      value={mappedVal}
                      onChange={(e) => setMappings({ ...mappings, [csvField]: e.target.value })}
                      style={{ padding: '10px', background: isMapped ? '#f0fdf4' : '#fff', border: `1px solid ${isMapped ? '#86efac' : 'var(--border-color)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                    >
                       <option value="">Select CRM Field...</option>
                       <option value="Skip/Ignore">🚫 Skip/Ignore Column</option>
                       <optgroup label="Required Fields">
                         <option value="Lead Name">Lead Name *</option>
                         <option value="Mobile Number">Mobile Number *</option>
                       </optgroup>
                       <optgroup label="CRM Fields">
                         {CRM_FIELDS.filter(f => f !== 'Lead Name' && f !== 'Mobile Number').map(field => (
                           <option key={field} value={field}>{field}</option>
                         ))}
                       </optgroup>
                    </select>
                  </div>
                );
              })}
             </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assignment Method</label>
              <select value={assignmentMethod} onChange={e => setAssignmentMethod(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option>Yourself</option><option>Round Robin</option><option>Unassigned</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Apply Tags</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Type & hit enter" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    setUploadTags([...uploadTags, tagInput.trim()]);
                    setTagInput('');
                  }
                }} />
                <button type="button" onClick={() => { if(tagInput.trim()) { setUploadTags([...uploadTags, tagInput.trim()]); setTagInput(''); } }} style={{ padding: '0 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Add</button>
              </div>
              {uploadTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {uploadTags.map(tag => (
                    <div key={tag} style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {tag} <span style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setUploadTags(uploadTags.filter(t => t !== tag))}>×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {wizardStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Validation Summary</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review the validation results before importing leads into the CRM.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{validationStats.total}</div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Rows</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{validationStats.valid}</div>
               <div style={{ fontSize: '0.9rem', color: '#15803d' }}>Valid Rows</div>
            </div>
            <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{validationStats.invalid}</div>
               <div style={{ fontSize: '0.9rem', color: '#b91c1c' }}>Invalid Rows</div>
            </div>
            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{validationStats.duplicates}</div>
               <div style={{ fontSize: '0.9rem', color: '#b45309' }}>Duplicates</div>
            </div>
          </div>

          {validationStats.invalid > 0 && (
             <div style={{ display: 'flex', gap: '12px', padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
               <AlertCircle color="#dc2626" />
               <p style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c' }}><b>{validationStats.invalid} rows</b> are missing required mapped fields (Lead Name, Mobile Number) or contain invalid data. These rows will be skipped during import to prevent broken CRM records.</p>
             </div>
          )}
        </div>
      )}

      {wizardStep === 4 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
           <CheckCircle size={60} color="#10b981" style={{ margin: '0 auto 16px' }} />
           <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>Upload Complete!</h2>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Your leads have been successfully imported and routed into your CRM based on rules.</p>
           <button onClick={() => onClose()} style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
             View Uploads
           </button>
        </div>
      )}
    </GenericModal>
  );
}
