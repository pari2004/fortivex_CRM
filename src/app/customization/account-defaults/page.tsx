"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

const ALL_CURRENCIES = [
  "Afghanistan Afghanis – AFN", "Albania Leke – ALL", "Algeria Dinars – DZD", "Argentina Pesos – ARS",
  "Australia Dollars – AUD", "Austria Schillings – ATS", "Bahamas Dollars – BSD", "Bahrain Dinars – BHD",
  "Bangladesh Taka – BDT", "Barbados Dollars – BBD", "Belgium Francs – BEF", "Bermuda Dollars – BMD",
  "Brazil Reais – BRL", "Bulgaria Leva – BGN", "Canada Dollars – CAD", "Chile Pesos – CLP",
  "China Yuan Renminbi – CNY", "Colombia Pesos – COP", "Costa Rica Colones – CRC", "Croatia Kuna – HRK",
  "Cyprus Pounds – CYP", "Czech Republic Koruny – CZK", "Denmark Kroner – DKK", "Dominican Republic Pesos – DOP",
  "Eastern Caribbean Dollars – XCD", "Egypt Pounds – EGP", "Estonia Krooni – EEK", "Euro – EUR",
  "Fiji Dollars – FJD", "Finland Markkaa – FIM", "France Francs – FRF", "Germany Deutsche Marks – DEM",
  "Greece Drachmae – GRD", "Hong Kong Dollars – HKD", "Hungary Forint – HUF", "Iceland Kronur – ISK",
  "India Rupees – INR", "Indonesia Rupiahs – IDR", "Ireland Pounds – IEP", "Israel New Shekels – ILS",
  "Italy Lire – ITL", "Jamaica Dollars – JMD", "Japan Yen – JPY", "Jordan Dinars – JOD",
  "Kenya Shillings – KES", "Kuwait Dinars – KWD", "Lebanon Pounds – LBP", "Luxembourg Francs – LUF",
  "Malaysia Ringgits – MYR", "Malta Liri – MTL", "Mauritius Rupees – MUR", "Mexico Pesos – MXN",
  "Morocco Dirhams – MAD", "Netherlands Guilders – NLG", "New Zealand Dollars – NZD", "Norway Kroner – NOK",
  "Oman Rials – OMR", "Pakistan Rupees – PKR", "Peru Nuevos Soles – PEN", "Philippines Pesos – PHP",
  "Poland Zlotych – PLN", "Portugal Escudos – PTE", "Qatar Riyals – QAR", "Romania New Lei – RON",
  "Russia Rubles – RUB", "Saudi Arabia Riyals – SAR", "Singapore Dollars – SGD", "Slovakia Koruny – SKK",
  "South Africa Rand – ZAR", "South Korea Won – KRW", "Spain Pesetas – ESP", "Sri Lanka Rupees – LKR",
  "Sudan Pounds – SDG", "Sweden Kronor – SEK", "Switzerland Francs – CHF", "Taiwan New Dollars – TWD",
  "Thailand Baht – THB", "Trinidad and Tobago Dollars – TTD", "Tunisia Dinars – TND", "Turkey Lira – TRY",
  "United Arab Emirates Dirhams – AED", "United Kingdom Pounds – GBP", "United States Dollars – USD",
  "Venezuela Bolivares – VEF", "Vietnam Dong – VND", "Zambia Kwacha – ZMK"
];

const ALL_TIMEZONES = [
  "(UTC-12:00) International Date Line West", "(UTC-11:00) Coordinated Universal Time-11", "(UTC-10:00) Hawaii",
  "(UTC-09:00) Alaska", "(UTC-08:00) Baja California", "(UTC-07:00) Pacific Daylight Time (US & Canada)",
  "(UTC-07:00) Chihuahua, La Paz, Mazatlan", "(UTC-07:00) Arizona", "(UTC-06:00) Central Time (US & Canada)",
  "(UTC-06:00) Saskatchewan", "(UTC-06:00) Guadalajara, Mexico City, Monterrey", "(UTC-05:00) Eastern Time (US & Canada)",
  "(UTC-05:00) Indiana (East)", "(UTC-05:00) Bogota, Lima, Quito, Rio Branco", "(UTC-04:00) Atlantic Time (Canada)",
  "(UTC-04:00) Caracas, La Paz", "(UTC-04:00) Santiago", "(UTC-03:30) Newfoundland", "(UTC-03:00) Brasilia",
  "(UTC-03:00) Buenos Aires, Georgetown", "(UTC-03:00) Greenland", "(UTC-02:00) Mid-Atlantic", "(UTC-01:00) Azores",
  "(UTC-01:00) Cape Verde Is.", "(UTC+00:00) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London",
  "(UTC+00:00) Casablanca, Monrovia, Reykjavik", "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
  "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
  "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb", "(UTC+01:00) West Central Africa", "(UTC+02:00) Amman",
  "(UTC+02:00) Athens, Bucharest, Istanbul", "(UTC+02:00) Beirut", "(UTC+02:00) Cairo", "(UTC+02:00) Harare, Pretoria",
  "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "(UTC+02:00) Jerusalem", "(UTC+02:00) Minsk",
  "(UTC+03:00) Baghdad", "(UTC+03:00) Kuwait, Riyadh", "(UTC+03:00) Moscow, St. Petersburg, Volgograd",
  "(UTC+03:00) Nairobi", "(UTC+03:30) Tehran", "(UTC+04:00) Abu Dhabi, Muscat", "(UTC+04:00) Baku",
  "(UTC+04:00) Yerevan", "(UTC+04:30) Kabul", "(UTC+05:00) Ekaterinburg", "(UTC+05:00) Islamabad, Karachi, Tashkent",
  "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi", "(UTC+05:30) Sri Jayawardenepura", "(UTC+05:45) Kathmandu",
  "(UTC+06:00) Almaty, Novosibirsk", "(UTC+06:00) Astana, Dhaka", "(UTC+06:30) Yangon (Rangoon)",
  "(UTC+07:00) Bangkok, Hanoi, Jakarta", "(UTC+07:00) Krasnoyarsk", "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
  "(UTC+08:00) Irkutsk, Ulaanbaatar", "(UTC+08:00) Kuala Lumpur, Singapore", "(UTC+08:00) Perth", "(UTC+08:00) Taipei",
  "(UTC+09:00) Osaka, Sapporo, Tokyo", "(UTC+09:00) Seoul", "(UTC+09:00) Yakutsk", "(UTC+09:30) Adelaide",
  "(UTC+09:30) Darwin", "(UTC+10:00) Brisbane", "(UTC+10:00) Canberra, Melbourne, Sydney", "(UTC+10:00) Guam, Port Moresby",
  "(UTC+10:00) Hobart", "(UTC+10:00) Vladivostok", "(UTC+11:00) Magadan, Solomon Is., New Caledonia",
  "(UTC+12:00) Auckland, Wellington", "(UTC+12:00) Fiji, Kamchatka, Marshall Is.", "(UTC+13:00) Nuku'alofa"
];

const DEFAULT_DAYS = [
  { day: 'MONDAY', enabled: true, start: '09:00', end: '18:00' },
  { day: 'TUESDAY', enabled: true, start: '09:00', end: '18:00' },
  { day: 'WEDNESDAY', enabled: true, start: '09:00', end: '18:00' },
  { day: 'THURSDAY', enabled: true, start: '09:00', end: '18:00' },
  { day: 'FRIDAY', enabled: true, start: '09:00', end: '18:00' },
  { day: 'SATURDAY', enabled: false, start: '09:00', end: '18:00' },
  { day: 'SUNDAY', enabled: false, start: '09:00', end: '18:00' }
];

type Toast = { message: string, type: 'success' | 'error' } | null;

export default function AccountDefaultsPage() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Main Display State
  const [viewAbsolute, setViewAbsolute] = useState(false);
  const [dateFormat, setDateFormat] = useState('dd-mm');
  const [timeFormat, setTimeFormat] = useState('12 Hour Format');
  const [denomination, setDenomination] = useState('Indian - Lakhs/Crores');
  const [timezone, setTimezone] = useState('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
  const [currency, setCurrency] = useState('India Rupees – INR');
  const [workingHours, setWorkingHours] = useState(DEFAULT_DAYS);

  // Edit State
  const [editDateFormat, setEditDateFormat] = useState(dateFormat);
  const [editTimeFormat, setEditTimeFormat] = useState(timeFormat);
  const [editDenomination, setEditDenomination] = useState(denomination);
  const [editTimezone, setEditTimezone] = useState(timezone);
  const [editCurrency, setEditCurrency] = useState(currency);
  const [editWorkingHours, setEditWorkingHours] = useState(workingHours);

  // Dropdown states
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [timezoneSearch, setTimezoneSearch] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('crm_account_defaults');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.viewAbsolute !== undefined) setViewAbsolute(parsed.viewAbsolute);
        if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
        if (parsed.timeFormat) setTimeFormat(parsed.timeFormat);
        if (parsed.denomination) setDenomination(parsed.denomination);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.workingHours) setWorkingHours(parsed.workingHours);
      }
    } catch (e) {}
  }, []);

  const openEditor = () => {
    setEditDateFormat(dateFormat);
    setEditTimeFormat(timeFormat);
    setEditDenomination(denomination);
    setEditTimezone(timezone);
    setEditCurrency(currency);
    setEditWorkingHours(JSON.parse(JSON.stringify(workingHours)));
    setIsEditing(true);
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Simulate an API call
  const simulateApiCall = async () => {
    return new Promise((resolve) => setTimeout(resolve, 600));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      await simulateApiCall(); // Simulate backend persistence
      
      const changes: string[] = [];
      if (editDateFormat !== dateFormat) changes.push('Account date format updated');
      if (editTimeFormat !== timeFormat) changes.push('Account time format updated');
      if (editDenomination !== denomination) changes.push('Account denomination updated');
      if (editTimezone !== timezone) changes.push('Working timezone updated');
      if (editCurrency !== currency) changes.push('Default currency updated');
      if (JSON.stringify(editWorkingHours) !== JSON.stringify(workingHours)) changes.push('Working hours updated');

      setDateFormat(editDateFormat);
      setTimeFormat(editTimeFormat);
      setDenomination(editDenomination);
      setTimezone(editTimezone);
      setCurrency(editCurrency);
      setWorkingHours(editWorkingHours);
      
      localStorage.setItem('crm_account_defaults', JSON.stringify({
        viewAbsolute,
        dateFormat: editDateFormat,
        timeFormat: editTimeFormat,
        denomination: editDenomination,
        timezone: editTimezone,
        currency: editCurrency,
        workingHours: editWorkingHours
      }));
      
      setIsEditing(false);
      
      if (changes.length > 0) {
        // Show first change as the main toast, or join them if multiple. 
        // For exact compliance with "Examples: ✓ Account date format updated":
        changes.forEach((msg, i) => {
          setTimeout(() => {
            showNotification(msg, 'success');
          }, i * 500); // Stagger if multiple
        });
      } else {
        showNotification('Account defaults saved.', 'success');
      }
      
    } catch (e) {
      showNotification('Error: Could not update account defaults.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEditDateFormat(dateFormat);
    setEditTimeFormat(timeFormat);
    setEditDenomination(denomination);
    setEditTimezone(timezone);
    setEditCurrency(currency);
    setEditWorkingHours(JSON.parse(JSON.stringify(workingHours)));
  };

  const handleToggleAbsolute = async () => {
    if (isToggling) return;
    setIsToggling(true);
    
    const newVal = !viewAbsolute;
    const oldVal = viewAbsolute;
    
    try {
      await simulateApiCall(); // Simulate backend persistence
      
      setViewAbsolute(newVal);
      const saved = JSON.parse(localStorage.getItem('crm_account_defaults') || '{}');
      saved.viewAbsolute = newVal;
      localStorage.setItem('crm_account_defaults', JSON.stringify(saved));
      
      showNotification('Updating Account for date format', 'success');
    } catch (e) {
      setViewAbsolute(oldVal); // revert
      showNotification('Error: Absolute date format could not be set in account', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  const filteredCurrencies = ALL_CURRENCIES.filter(c => c.toLowerCase().includes(currencySearch.toLowerCase()));
  const filteredTimezones = ALL_TIMEZONES.filter(t => t.toLowerCase().includes(timezoneSearch.toLowerCase()));

  if (!mounted) return null;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      {toast && toast.message && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 99999,
            background: toast.type === 'success' ? '#15803D' : '#DC2626',
            color: '#FFFFFF',
            border: toast.type === 'success' ? '1px solid #166534' : '1px solid #B91C1C',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            width: 'max-content',
            maxWidth: '420px',
            minHeight: '52px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            animation: 'fadeInUp 0.3s ease-out forwards'
          }}
        >
          {toast.type === 'success' ? (
            <Check size={20} color="#FFFFFF" style={{ flexShrink: 0 }} />
          ) : (
            <X size={20} color="#FFFFFF" style={{ flexShrink: 0 }} />
          )}
          <span style={{ color: '#FFFFFF', flex: 1, fontSize: '15px' }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#FFFFFF', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              padding: '4px',
              flexShrink: 0
            }}
          >
            <X size={16} color="#FFFFFF" />
          </button>
          
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* Main Page Content */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
        <button 
          onClick={openEditor}
          style={{ background: '#7c8cd8', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          Edit Account Defaults
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Absolute Date Toggle Row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '24px 0', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={handleToggleAbsolute}
              style={{ width: '40px', height: '20px', borderRadius: '12px', background: viewAbsolute ? '#475569' : '#cbd5e1', position: 'relative', cursor: isToggling ? 'not-allowed' : 'pointer', transition: '0.2s', opacity: isToggling ? 0.7 : 1 }}
            >
              <div style={{ position: 'absolute', top: '2px', left: viewAbsolute ? '22px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>View in Absolute Date Format</span>
          </div>
        </div>

        {/* Info Rows */}
        <InfoRow label="Date Format" value={dateFormat} />
        <InfoRow label="Time Format" value={timeFormat} />
        <InfoRow label="Denomination" value={denomination} />
        <InfoRow label="Timezone" value={timezone} />
        <InfoRow label="Default Currency" value={currency} />

      </div>

      {/* Drawer Overlay */}
      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>
          {/* Darkened Background */}
          <div onClick={() => !isSubmitting && setIsEditing(false)} style={{ flex: 1, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(2px)' }} />
          
          {/* Drawer Panel */}
          <div style={{ width: '650px', maxWidth: '100vw', background: '#f8fafc', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.15)' }}>
            
            {/* Drawer Header */}
            <div style={{ padding: '24px 32px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Updating Account Defaults : Empowers Academy</h2>
              <button disabled={isSubmitting} onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
              
              {/* Form Groups */}
              
              {/* 1. Date Format */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Default Date Format</label>
                <div style={{ display: 'flex' }}>
                  <SelectionButton active={editDateFormat === 'dd-mm'} onClick={() => setEditDateFormat('dd-mm')} text="dd-mm" rounded="left" />
                  <SelectionButton active={editDateFormat === 'mm-dd'} onClick={() => setEditDateFormat('mm-dd')} text="mm-dd" rounded="right" />
                </div>
              </div>

              {/* 2. Time Format */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Default Time Format</label>
                <div style={{ display: 'flex' }}>
                  <SelectionButton active={editTimeFormat === '12 Hour Format'} onClick={() => setEditTimeFormat('12 Hour Format')} text="12 Hour Format" rounded="left" />
                  <SelectionButton active={editTimeFormat === '24 hour format'} onClick={() => setEditTimeFormat('24 hour format')} text="24 hour format" rounded="right" />
                </div>
              </div>

              {/* 3. Denomination */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Default Denominations</label>
                <div style={{ display: 'flex' }}>
                  <SelectionButton active={editDenomination === 'Indian - Lakhs/Crores'} onClick={() => setEditDenomination('Indian - Lakhs/Crores')} text="Indian - Lakhs/Crores" rounded="left" />
                  <SelectionButton active={editDenomination === 'Metric - Million/Billion'} onClick={() => setEditDenomination('Metric - Million/Billion')} text="Metric - Million/Billion" rounded="right" />
                </div>
              </div>

              {/* 4. Currencies */}
              <div style={{ marginBottom: '32px', position: 'relative' }}>
                <div 
                  onClick={() => { setShowCurrencyDropdown(!showCurrencyDropdown); setShowTimezoneDropdown(false); }}
                  style={{ background: '#7c8cd8', color: 'white', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}
                >
                  {editCurrency || 'Select Applicable Currencies'}
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid white' }} />
                </div>
                {showCurrencyDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '4px' }}>
                        <Search size={14} color="#64748b" />
                        <input autoFocus value={currencySearch} onChange={e => setCurrencySearch(e.target.value)} placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                      </div>
                    </div>
                    {filteredCurrencies.map(c => (
                      <div 
                        key={c} 
                        onClick={() => { setEditCurrency(c); setShowCurrencyDropdown(false); setCurrencySearch(''); }}
                        style={{ padding: '12px 16px', fontSize: '0.95rem', color: '#334155', cursor: 'pointer', background: editCurrency === c ? '#f1f5f9' : 'white', borderBottom: '1px solid #f1f5f9' }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Timezones */}
              <div style={{ marginBottom: '40px', position: 'relative' }}>
                <div 
                  onClick={() => { setShowTimezoneDropdown(!showTimezoneDropdown); setShowCurrencyDropdown(false); }}
                  style={{ background: '#7c8cd8', color: 'white', padding: '12px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}
                >
                  {editTimezone || 'Select Working Timezone'}
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid white' }} />
                </div>
                {showTimezoneDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '4px' }}>
                        <Search size={14} color="#64748b" />
                        <input autoFocus value={timezoneSearch} onChange={e => setTimezoneSearch(e.target.value)} placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                      </div>
                    </div>
                    {filteredTimezones.map(t => (
                      <div 
                        key={t} 
                        onClick={() => { setEditTimezone(t); setShowTimezoneDropdown(false); setTimezoneSearch(''); }}
                        style={{ padding: '12px 16px', fontSize: '0.95rem', color: '#334155', cursor: 'pointer', background: editTimezone === t ? '#f1f5f9' : 'white', borderBottom: '1px solid #f1f5f9' }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Working Hours */}
              <div>
                <label style={{ display: 'block', fontSize: '0.95rem', color: '#334155', marginBottom: '24px', fontWeight: 600 }}>Set Working Hours</label>
                
                {/* Headers */}
                <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '160px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Day</div>
                  <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>Start Time</div>
                  <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>End Time</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {editWorkingHours.map((wh, idx) => (
                    <div key={wh.day} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Day toggle */}
                      <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          onClick={() => {
                            const newWh = [...editWorkingHours];
                            newWh[idx].enabled = !newWh[idx].enabled;
                            setEditWorkingHours(newWh);
                          }}
                          style={{ width: '36px', height: '20px', borderRadius: '10px', background: wh.enabled ? '#475569' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
                        >
                          <div style={{ position: 'absolute', top: '2px', left: wh.enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: '0.2s' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{wh.day}</span>
                      </div>
                      
                      {/* Start Time */}
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        {wh.enabled ? (
                          <TimeSelector 
                            value={wh.start} 
                            onChange={(val) => {
                              const newWh = [...editWorkingHours];
                              newWh[idx].start = val;
                              setEditWorkingHours(newWh);
                            }} 
                          />
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                        )}
                      </div>

                      {/* End Time */}
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        {wh.enabled ? (
                          <TimeSelector 
                            value={wh.end} 
                            onChange={(val) => {
                              const newWh = [...editWorkingHours];
                              newWh[idx].end = val;
                              setEditWorkingHours(newWh);
                            }} 
                          />
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer / Buttons */}
            <div style={{ padding: '24px 32px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button disabled={isSubmitting} onClick={handleReset} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#475569', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>Reset</button>
              <button disabled={isSubmitting} onClick={handleSave} style={{ padding: '10px 24px', background: '#3b5998', border: 'none', borderRadius: '4px', color: 'white', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '24px 0', alignItems: 'center' }}>
      <div style={{ width: '250px', fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
        {label}
      </div>
      <div style={{ flex: 1, fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function SelectionButton({ active, onClick, text, rounded }: { active: boolean, onClick: () => void, text: string, rounded: 'left' | 'right' }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '10px 24px',
        border: '1px solid #cbd5e1',
        borderRightWidth: rounded === 'left' ? 0 : 1,
        borderTopLeftRadius: rounded === 'left' ? '4px' : 0,
        borderBottomLeftRadius: rounded === 'left' ? '4px' : 0,
        borderTopRightRadius: rounded === 'right' ? '4px' : 0,
        borderBottomRightRadius: rounded === 'right' ? '4px' : 0,
        background: active ? 'white' : 'transparent',
        color: active ? '#334155' : '#64748b',
        fontWeight: active ? 600 : 400,
        fontSize: '0.9rem',
        cursor: 'pointer',
        boxShadow: active ? 'inset 0 0 0 1px #94a3b8' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {active && <span style={{ color: '#3b5998', display: 'flex' }}><Check size={16} strokeWidth={3} /></span>}
      {text}
    </div>
  );
}

function TimeSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [hh, mm] = value.split(':');
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onChange(`${String((parseInt(hh) + 1) % 24).padStart(2, '0')}:${mm}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: 0 }}>▲</button>
        <div style={{ borderBottom: '1px solid #cbd5e1', padding: '2px 4px', fontSize: '0.9rem', color: '#334155' }}>{hh}</div>
        <button onClick={() => onChange(`${String((parseInt(hh) - 1 + 24) % 24).padStart(2, '0')}:${mm}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: 0 }}>▼</button>
      </div>
      <span style={{ fontWeight: 600, color: '#334155' }}>:</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onChange(`${hh}:${String((parseInt(mm) + 15) % 60).padStart(2, '0')}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: 0 }}>▲</button>
        <div style={{ borderBottom: '1px solid #cbd5e1', padding: '2px 4px', fontSize: '0.9rem', color: '#334155' }}>{mm}</div>
        <button onClick={() => onChange(`${hh}:${String((parseInt(mm) - 15 + 60) % 60).padStart(2, '0')}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: 0 }}>▼</button>
      </div>
    </div>
  );
}
