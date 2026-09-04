import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface AddNewLeadModalProps {
  onClose: () => void;
  onSuccess: (leadData: any) => void;
  isQuickPhoneAdd?: boolean;
}

const COUNTRIES = [
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'USA' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'UK' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' }
];

const TEAMS = ["FA Sales Team"];
const STAGES = ["New Lead", "Attempted", "Contacted", "Interested", "Demo Scheduled", "Lost", "Converted"];

export function AddNewLeadModal({ onClose, onSuccess, isQuickPhoneAdd = false }: AddNewLeadModalProps) {
  const { addLead } = useCRM();
  const { user } = useAuth();
  
  const initialFormState = {
    // Basic Info
    name: isQuickPhoneAdd ? 'Unknown Lead' : '', // Fallback name if only phone is provided
    mobile: '',
    email: '',
    business: '',
    designation: '',
    leadType: 'Individual',
    team: 'FA Sales Team',
    owner: 'Pavan S.H',
    counselor: 'Pavan S.H',
    
    // Sourcing & Priority
    source: 'Website',
    sourceL2: '',
    sourceL3: '',
    sourceL4: '',
    productOrService: '',
    tags: '',
    priority: 'Medium',
    interestedIn: '',
    
    // Address Details
    address: '',
    area: '',
    city: '',
    state: '',
    country: 'India',
    zipcode: '',
    
    // Background Details
    careerGoal: '',
    currentCompanyType: '',
    enrollmentTimeline: '',
    experienceLevel: '',
    technicalBackground: '',
    whatAreYouLookingFor: '',
    
    // Sales & Activity Tracking
    stage: 'New Lead',
    nextFollowUp: '',
    dealStage: '',
    dealUpdatedOn: '',
    leadDisposition: '',
    lastDispositionOn: '',
    awaitingFirstTouch: 'Yes',
    attempts: '0',
    lastWorked: '',
    startedWorkOn: '',
    speedToFirstCall: '',
    becameOpportunity: '',
    recentActions: '',
    unansweredCalls: '0',
    unansweredAfterMissed: '0',
    missedCallsFromThem: '0',
    timesReEngaged: '0',
    nextOpenTask: '',
    openTicket: 'No',
    lastClosedTask: '',
    lastUserRemark: ''
  };

  const [formData, setFormData] = useState<Record<string, any>>(initialFormState);
  const [activeTab, setActiveTab] = useState('Basic Info');
  const tabs = ['Basic Info', 'Sourcing', 'Address', 'Background', 'Sales Activity'];

  // Quick Phone Add state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'mobile') setPhoneError('');
    if (e.target.name === 'owner') {
      setFormData({ ...formData, owner: e.target.value, counselor: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    if (isQuickPhoneAdd) {
      setSelectedCountry(COUNTRIES[0]);
      setPhoneError('');
    }
  };

  const validate = () => {
    if (isQuickPhoneAdd) {
      if (!formData.mobile.trim()) {
        setPhoneError('Field is required');
        return false;
      }
      return true;
    }

    if (!formData.name.trim()) { alert("Lead Name is required!"); return false; }
    if (!formData.mobile.trim()) { alert("Mobile Number is required!"); return false; }
    if (formData.owner === 'Select Owner') { alert("Please select a Lead Owner!"); return false; }
    return true;
  };

  const finalizeLead = (): Record<string, any> => {
    const now = new Date().toISOString();
    return {
      ...formData,
      mobile: isQuickPhoneAdd ? `${selectedCountry.dial} ${formData.mobile}` : formData.mobile,
      createdAt: now,
      createdDate: now,
      updatedAt: now,
      lastUpdated: now,
      leadAddedBy: user?.name || 'System',
      assignedOn: now,
      phone: isQuickPhoneAdd ? `${selectedCountry.dial} ${formData.mobile}` : formData.mobile,
      leadStage: formData.stage,
      leadPriority: formData.priority,
      leadSource: formData.source,
      lastCalledBy: '',
      lastCallTime: '',
      lastCallOutcome: '',
      lastEmail: '',
      lastWhatsapp: '',
      lastNote: '',
      lastTaskDone: ''
    };
  };

  const handleSave = () => {
    if (!validate()) return;
    const lead = finalizeLead();
    addLead(lead as any);
    onSuccess(lead);
    onClose();
  };

  const handleSaveAndAddAnother = () => {
    if (!validate()) return;
    const lead = finalizeLead();
    addLead(lead as any);
    onSuccess(lead.name);
    handleReset();
    setActiveTab('Basic Info');
  };

  useGlobalEscape(true, () => { onClose() });

  if (isQuickPhoneAdd) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }} 
          style={{ 
            background: 'var(--bg-primary)', 
            padding: '0', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'visible'
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Adding Lead Detail</h2>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ padding: '32px 24px', minHeight: '150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: phoneError ? '1px solid #ef4444' : '1px solid var(--border-color)', borderRadius: '8px', overflow: 'visible', background: 'var(--bg-primary)', position: 'relative' }}>
              
              {/* Country Selector */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div 
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', cursor: 'pointer', borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{selectedCountry.flag}</span>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </div>
                
                <AnimatePresence>
                  {isCountryDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, width: '200px', maxHeight: '250px', overflowY: 'auto' }}
                    >
                      {COUNTRIES.map(country => (
                        <div 
                          key={country.code}
                          onClick={() => { setSelectedCountry(country); setIsCountryDropdownOpen(false); }}
                          className="hover-bg-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)' }}
                        >
                          <span style={{ fontSize: '1.1rem' }}>{country.flag}</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{country.name} ({country.dial})</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone Input */}
              <input 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange}
                placeholder="+91XXXXXXXXXX"
                style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            
            {/* Validation Message */}
            <AnimatePresence>
              {phoneError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
                  {phoneError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '0 0 16px 16px' }}>
            <button onClick={handleReset} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }} className="hover-bg-secondary">
              Reset
            </button>
            <button onClick={handleSave} style={{ padding: '10px 32px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }} 
        style={{ 
          background: 'var(--bg-primary)', 
          padding: '0', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '1000px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Add New Lead</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', color: 'var(--text-tertiary)' }}>
            <X size={20} />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)', padding: '0 24px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              style={{ 
                padding: '16px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === t ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeTab === t ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: BASIC INFO */}
          <div style={{ display: activeTab === 'Basic Info' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label className="form-label">Lead Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Business / Company</label><input type="text" name="business" value={formData.business} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Designation</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} className="form-input" /></div>
              <div>
                <label className="form-label">Lead Type</label>
                <select name="leadType" value={formData.leadType} onChange={handleChange} className="form-input">
                  <option>Individual</option><option>Business</option><option>Student</option><option>Corporate</option>
                </select>
              </div>
              <div>
                <label className="form-label">Primary Team</label>
                <select name="team" value={formData.team} onChange={handleChange} className="form-input">
                  {TEAMS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lead Owner *</label>
                <select name="owner" value={formData.owner} onChange={handleChange} className="form-input" style={{ border: '1px solid var(--primary-color)' }}>
                  {['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* TAB 2: SOURCING */}
          <div style={{ display: activeTab === 'Sourcing' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label className="form-label">Lead Source</label>
                <select name="source" value={formData.source} onChange={handleChange} className="form-input">
                  <option>Website</option><option>Organic Search</option><option>Facebook Ads</option><option>Google Ads</option><option>LinkedIn</option><option>Referral</option><option>Walk-in</option>
                </select>
              </div>
              <div><label className="form-label">Source - Level 2</label><input type="text" name="sourceL2" value={formData.sourceL2} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Source - Level 3</label><input type="text" name="sourceL3" value={formData.sourceL3} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Source - Level 4</label><input type="text" name="sourceL4" value={formData.sourceL4} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Product or Service</label><input type="text" name="productOrService" value={formData.productOrService} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Tags (comma separated)</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} className="form-input" /></div>
              <div>
                <label className="form-label">Lead Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <div><label className="form-label">Interested In?</label><input type="text" name="interestedIn" value={formData.interestedIn} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* TAB 3: ADDRESS */}
          <div style={{ display: activeTab === 'Address' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}><label className="form-label">Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Area</label><input type="text" name="area" value={formData.area} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Zipcode</label><input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* TAB 4: BACKGROUND */}
          <div style={{ display: activeTab === 'Background' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div><label className="form-label">Career Goal</label><input type="text" name="careerGoal" value={formData.careerGoal} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Current Company Type</label><input type="text" name="currentCompanyType" value={formData.currentCompanyType} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Enrollment Timeline</label><input type="text" name="enrollmentTimeline" value={formData.enrollmentTimeline} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Experience Level</label><input type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Technical Background</label><input type="text" name="technicalBackground" value={formData.technicalBackground} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">What are you looking for?</label><input type="text" name="whatAreYouLookingFor" value={formData.whatAreYouLookingFor} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* TAB 5: SALES ACTIVITY */}
          <div style={{ display: activeTab === 'Sales Activity' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label className="form-label">Lead Stage</label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="form-input">
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="form-label">Next Follow-up Date</label><input type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Deal Stage</label><input type="text" name="dealStage" value={formData.dealStage} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Lead Disposition</label><input type="text" name="leadDisposition" value={formData.leadDisposition} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Awaiting First Touch</label>
                <select name="awaitingFirstTouch" value={formData.awaitingFirstTouch} onChange={handleChange} className="form-input">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div><label className="form-label">Attempts</label><input type="number" name="attempts" value={formData.attempts} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Speed to First Call</label><input type="text" name="speedToFirstCall" value={formData.speedToFirstCall} onChange={handleChange} className="form-input" placeholder="e.g. 5 mins" /></div>
              <div><label className="form-label">Became Opportunity (Date)</label><input type="date" name="becameOpportunity" value={formData.becameOpportunity} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Unanswered Calls</label><input type="number" name="unansweredCalls" value={formData.unansweredCalls} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Missed Calls from Them</label><input type="number" name="missedCallsFromThem" value={formData.missedCallsFromThem} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Times Re-engaged</label><input type="number" name="timesReEngaged" value={formData.timesReEngaged} onChange={handleChange} className="form-input" /></div>
              <div><label className="form-label">Open Ticket</label>
                <select name="openTicket" value={formData.openTicket} onChange={handleChange} className="form-input">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label className="form-label">Last User Remark</label><input type="text" name="lastUserRemark" value={formData.lastUserRemark} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

        </div>
        
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            System fields (Created Date, Added By, etc.) will be auto-generated.
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>Cancel</button>
            <button onClick={handleReset} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>Reset</button>
            <button onClick={handleSaveAndAddAnother} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}>Save & Add Another</button>
            <button onClick={handleSave} className="primary-btn" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>Save Lead</button>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .form-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: var(--bg-primary);
            font-size: 0.95rem;
            margin-top: 8px;
            outline: none;
            transition: all 0.2s;
            color: var(--text-primary);
          }
          .form-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          }
          .form-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
          }
        `}} />
      </motion.div>
    </div>
  );
}
