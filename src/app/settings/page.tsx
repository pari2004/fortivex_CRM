'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building, Shield, Bell, Palette, Key, Database, LogOut, Settings as SettingsIcon, 
  CheckCircle2, Download, RefreshCw, Trash2, Edit2, Plus, Monitor, LayoutDashboard, Copy, 
  AlertCircle, Smartphone, Globe, Mail, MapPin, Hash, ShieldCheck, Sun, Moon, Calendar,
  Upload, Search, Phone, PhoneCall, FileText, X, Check, Link as LinkIcon, ExternalLink, Layers, ArrowRight
} from 'lucide-react';
import { PremiumInput, PremiumSelect, PremiumTextArea, PremiumCard, ToggleSwitch } from '@/components/common/PremiumForm';
import Image from 'next/image';

const INITIAL_INTEGRATIONS_DATA = [
  { id: 'aajjo', name: 'AAJJO', category: 'Lead Source', status: 'Healthy', description: 'B2B marketplace lead auto-capture engine.', connected: true, apiKey: 'aajjo_live_883492', webhookUrl: 'https://api.fortivex.ai/aajjo/webhook', badge: 'SET-UP CHARGES' },
  { id: 'bonvoice', name: 'Bon Voice', category: 'Telephony', status: 'Healthy', description: 'Cloud telephony, call recording & agent metrics.', connected: true, apiKey: 'bon_live_994821', webhookUrl: 'https://api.fortivex.ai/bonvoice/webhook' },
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', status: 'Healthy', description: 'Automated demo & interview calendar booking.', connected: true, apiKey: 'cal_live_109283', webhookUrl: 'https://api.fortivex.ai/calendly/webhook' },
  { id: 'callerdesk', name: 'Caller Desk', category: 'Telephony', status: 'Not connected', description: 'Smart IVR and virtual receptionist system.', connected: false },
  { id: 'cashfree', name: 'Cashfree', category: 'Payments', status: 'Healthy', description: 'Payment gateway for instant fee collection.', connected: true, apiKey: 'cf_live_993810', badge: 'PAID' },
  { id: 'commonfloor', name: 'Commonfloor', category: 'Lead Source', status: 'Not connected', description: 'Real estate & institutional inquiry sync.', connected: false },
  { id: '3cx', name: '3CX', category: 'Telephony', status: 'Action needed', description: 'IP PBX phone system integration.', connected: false },
  { id: 'exotel', name: 'Exotel', category: 'Telephony', status: 'Healthy', description: 'Enterprise telephony API for call logs & recording.', connected: true, apiKey: 'exotel_live_983742918', webhookUrl: 'https://api.fortivex.ai/telephony/exotel/webhook' },
  { id: 'facebook', name: 'Facebook', category: 'Marketing', status: 'Healthy', description: 'Facebook Lead Ads & Meta business integration.', connected: true, apiKey: 'fb_meta_993810', webhookUrl: 'https://api.fortivex.ai/facebook/webhook' },
  { id: 'gmail', name: 'Gmail', category: 'Email', status: 'Healthy', description: 'Google Workspace email sync & mail merge.', connected: true, apiKey: 'gmail_auth_token_99182' },
  { id: 'google_meet', name: 'Google Meet', category: 'Video Calls', status: 'Healthy', description: 'Instant video demo link generator.', connected: true },
  { id: 'google_drive', name: 'Google Drive', category: 'Storage', status: 'Healthy', description: 'Cloud document storage & student dossier sync.', connected: true },
  { id: 'google_forms', name: 'Google Forms', category: 'Forms', status: 'Healthy', description: 'Web inquiry form responses auto-ingestion.', connected: true },
  { id: 'google_ads', name: 'Google Ads Lead Form', category: 'Marketing', status: 'Healthy', description: 'Sync PPC lead extensions in real-time.', connected: true },
  { id: 'google_sheets', name: 'Google Sheets', category: 'Data', status: 'Healthy', description: 'Live 2-way sync with Google Spreadsheets.', connected: true },
  { id: 'housing', name: 'Housing', category: 'Lead Source', status: 'Not connected', description: 'Lead stream from Housing property portal.', connected: false },
  { id: 'indiamart', name: 'Indiamart', category: 'Lead Source', status: 'Healthy', description: 'B2B buyer leads auto-import engine.', connected: true, apiKey: 'im_live_44921' },
  { id: 'instagram', name: 'Instagram DM', category: 'Social', status: 'Healthy', description: 'Direct message automation & lead capture.', connected: true },
  { id: 'jotform', name: 'Jotform', category: 'Forms', status: 'Not connected', description: 'Form builder integration for online applications.', connected: false },
  { id: 'justdial', name: 'Justdial', category: 'Lead Source', status: 'Healthy', description: 'Local business lead API webhook stream.', connected: true, apiKey: 'jd_live_19827' },
  { id: 'razorpay', name: 'Razorpay', category: 'Payments', status: 'Healthy', description: 'Online payment links, subscriptions & fee receipts.', connected: true, apiKey: 'rzp_live_8839201', badge: 'PAID' },
  { id: 'email_parser', name: 'Leads from Email to Salesmax', category: 'Parser', status: 'Healthy', description: 'Parse inbound email inquiries into CRM leads.', connected: true },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Messaging', status: 'Healthy', description: 'Official WhatsApp Business BSP API integration.', connected: true, apiKey: 'interakt_live_77364512', webhookUrl: 'https://api.fortivex.ai/whatsapp/interakt/webhook' },
];
function IntegrationBrandLogo({ id, name }: { id: string; name: string }) {
  const logoStyles: Record<string, { bg: string; color: string; label?: string; icon?: React.ReactNode }> = {
    'aajjo':        { bg: 'linear-gradient(135deg, #ff6b00, #1e3a8a)', color: '#ffffff', label: 'AA' },
    'bonvoice':     { bg: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#ffffff', icon: <Phone size={20} /> },
    'calendly':     { bg: 'linear-gradient(135deg, #006bfc, #0045a5)', color: '#ffffff', icon: <Calendar size={20} /> },
    'callerdesk':   { bg: 'linear-gradient(135deg, #8b5cf6, #4c1d95)', color: '#ffffff', icon: <Phone size={20} /> },
    'cashfree':     { bg: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#ffffff', label: '₹' },
    'commonfloor': { bg: 'linear-gradient(135deg, #0f766e, #0d9488)', color: '#ffffff', icon: <Building size={20} /> },
    '3cx':          { bg: 'linear-gradient(135deg, #dc2626, #991b1b)', color: '#ffffff', label: '3CX' },
    'exotel':       { bg: 'linear-gradient(135deg, #0284c7, #1d4ed8)', color: '#ffffff', icon: <PhoneCall size={20} /> },
    'facebook':     { bg: 'linear-gradient(135deg, #1877f2, #0d52b5)', color: '#ffffff', label: 'f' },
    'gmail':        { bg: 'linear-gradient(135deg, #ea4335, #c5221f)', color: '#ffffff', icon: <Mail size={20} /> },
    'google_meet':  { bg: 'linear-gradient(135deg, #00832d, #00ac47)', color: '#ffffff', icon: <Globe size={20} /> },
    'google_drive': { bg: 'linear-gradient(135deg, #ffba00, #00ac47, #006bfc)', color: '#ffffff', icon: <Upload size={20} /> },
    'google_forms': { bg: 'linear-gradient(135deg, #7248b9, #5e35b1)', color: '#ffffff', icon: <FileText size={20} /> },
    'google_ads':   { bg: 'linear-gradient(135deg, #fbbc04, #4285f4)', color: '#ffffff', icon: <Search size={20} /> },
    'google_sheets':{ bg: 'linear-gradient(135deg, #0f9d58, #0b8043)', color: '#ffffff', label: '田' },
    'housing':      { bg: 'linear-gradient(135deg, #e11d48, #be123c)', color: '#ffffff', icon: <Building size={20} /> },
    'indiamart':    { bg: 'linear-gradient(135deg, #d97706, #b45309)', color: '#ffffff', label: 'IM' },
    'instagram':    { bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#ffffff', label: 'IG' },
    'jotform':      { bg: 'linear-gradient(135deg, #ff6100, #e65100)', color: '#ffffff', icon: <Edit2 size={20} /> },
    'justdial':     { bg: 'linear-gradient(135deg, #ff9900, #003399)', color: '#ffffff', label: 'JD' },
    'razorpay':     { bg: 'linear-gradient(135deg, #0c2340, #0284c7)', color: '#ffffff', label: 'R' },
    'email_parser': { bg: 'linear-gradient(135deg, #1e293b, #3b82f6)', color: '#ffffff', icon: <Mail size={20} /> },
    'whatsapp':     { bg: 'linear-gradient(135deg, #25d366, #128c7e)', color: '#ffffff', icon: <PhoneCall size={20} /> },
  };

  const style = logoStyles[id] || { bg: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#ffffff', label: name.charAt(0) };

  return (
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px', background: style.bg, color: style.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)', flexShrink: 0, letterSpacing: '-0.5px'
    }}>
      {style.label ? style.label : style.icon}
    </div>
  );
}

const INITIAL_SESSIONS = [
  { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome 120.0', ip: '192.168.1.42', time: 'Just now', status: 'Active', isCurrent: true },
  { id: 2, device: 'iPhone 15 Pro', browser: 'Safari Mobile', ip: '117.220.45.10', time: '2 hours ago', status: 'Success', isCurrent: false },
  { id: 3, device: 'Windows Desktop', browser: 'Edge 119.0', ip: '45.112.33.100', time: 'Yesterday', status: 'Success', isCurrent: false },
  { id: 4, device: 'Unknown Device', browser: 'Firefox 118.0', ip: '198.51.100.22', time: '3 days ago', status: 'Failed', isCurrent: false },
];

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { 
    companyLogo, updateCompanyLogo, businessHours, updateBusinessHours, notifications, updateNotifications, resetNotifications,
    appearance, updateAppearance, apiKeys, updateApiKeys, backups, updateBackups, backupSettings, updateBackupSettings
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // User Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    department: user?.department || 'Management',
    designation: user?.designation || '',
    address: user?.address || '',
    city: user?.city || 'Bengaluru',
    state: user?.state || 'Karnataka',
    country: user?.country || 'India',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        mobile: user.mobile || '',
        email: user.email || '',
        department: user.department || 'Management',
        designation: user.designation || '',
        address: user.address || '',
        city: user.city || 'Bengaluru',
        state: user.state || 'Karnataka',
        country: user.country || 'India',
      });
    }
  }, [user]);

  // Company Profile Form State
  const [hoursForm, setHoursForm] = useState(businessHours);
  
  // Security Form State
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const [appForm, setAppForm] = useState(appearance);
  useEffect(() => setAppForm(appearance), [appearance]);

  const [showApiModal, setShowApiModal] = useState(false);
  const [showStorageAnalytics, setShowStorageAnalytics] = useState(false);
  const [importDragActive, setImportDragActive] = useState(false);
  const [editingApi, setEditingApi] = useState<any>(null);
  const [apiForm, setApiForm] = useState({ name: '', key: '', env: 'Production', description: '' });
  const [isTesting, setIsTesting] = useState(false);
  
  const [isBackingUp, setIsBackingUp] = useState(false);


  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  
  const handleSaveAppearance = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateAppearance(appForm);
      setIsSaving(false);
      showToast('Appearance updated globally.');
    }, 600);
  };

  const handleDashboardBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppForm({ ...appForm, dashboardBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApiSave = () => {
    if (!apiForm.name || !apiForm.key) return showToast('Name and Key are required.');
    setIsSaving(true);
    setTimeout(() => {
      if (editingApi) {
        updateApiKeys(apiKeys.map(k => k.id === editingApi.id ? { ...k, ...apiForm, env: apiForm.env as 'Development' | 'Production', lastUpdated: 'Just now' } : k));
      } else {
        updateApiKeys([...apiKeys, { id: Date.now().toString(), serviceName: apiForm.name, name: apiForm.name, key: apiForm.key, env: apiForm.env as 'Development' | 'Production', description: apiForm.description, status: 'Connected', lastUpdated: 'Just now', lastTested: 'Never' }]);
      }
      setIsSaving(false);
      setShowApiModal(false);
      showToast(editingApi ? 'API Key updated.' : 'API Key added.');
    }, 600);
  };

  const testApiConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      showToast('Connection Successful.');
      if (editingApi) {
        updateApiKeys(apiKeys.map(k => k.id === editingApi.id ? { ...k, status: 'Connected', lastTested: 'Just now' } : k));
      }
    }, 1500);
  };

  const deleteApiKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      updateApiKeys(apiKeys.filter(k => k.id !== id));
      showToast('API Key deleted.');
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast('API Key copied to clipboard.');
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: any = { id: Date.now().toString(), name: `backup_full_${new Date().toISOString().split('T')[0]}.zip`, date: 'Just now', createdBy: user?.name || 'System', size: '1.25 GB', status: 'Completed' };
      updateBackups([newBackup, ...backups]);
      setIsBackingUp(false);
      showToast('Backup completed successfully.');
    }, 2000);
  };

  const deleteBackup = (id: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      updateBackups(backups.filter(b => b.id !== id));
      showToast('Backup deleted.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isLogo) {
          updateCompanyLogo(base64String);
          showToast('Company logo updated successfully.');
        } else {
          updateUser({ avatar: base64String });
          showToast('Profile picture updated successfully.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUser(profileForm);
      setIsSaving(false);
      showToast('Profile updated successfully.');
    }, 600);
  };

  const handleSaveCompany = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateBusinessHours(hoursForm);
      setIsSaving(false);
      showToast('Company profile updated successfully.');
    }, 600);
  };

  const handleChangePassword = () => {
    const { new: newPass, confirm } = passwordForm;
    if (newPass !== confirm) return showToast('Passwords do not match.');
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPass)) return showToast('Password must meet complexity requirements.');
    setIsSaving(true);
    setTimeout(() => {
      setPasswordForm({ current: '', new: '', confirm: '' });
      setIsSaving(false);
      showToast('Password changed successfully.');
    }, 600);
  };

  const terminateSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    showToast('Session terminated.');
  };

  // Integrations Tab State
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS_DATA);
  const [integrationFilterChip, setIntegrationFilterChip] = useState<string>('All');
  const [integrationSearch, setIntegrationSearch] = useState<string>('');
  const [selectedIntegrationSetup, setSelectedIntegrationSetup] = useState<any | null>(null);
  const [setupApiKey, setSetupApiKey] = useState('');
  const [setupWebhook, setSetupWebhook] = useState('');
  const [isTestingIntegration, setIsTestingIntegration] = useState(false);

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <User size={18} /> },
    { id: 'company', label: 'Company Profile', icon: <Building size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'api_keys', label: 'API Keys', icon: <Key size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe size={18} /> },
    { id: 'backup', label: 'Backup & Data', icon: <Database size={18} /> },
  ];

  const filteredTabs = tabs.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', position: 'relative' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed', top: '20px', left: '50%', zIndex: 10000,
              background: '#10b981', color: 'white', padding: '12px 24px',
              borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <CheckCircle2 size={20} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your account settings, preferences, and system configurations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Sidebar Tabs */}
        <div className="glass-panel" style={{ width: '250px', padding: '16px', borderRadius: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', backgroundColor: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 500, cursor: 'pointer', textAlign: 'left'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {/* TAB 1: USER PROFILE */}
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>User Profile</h2>
                  
                  <PremiumCard title="Personal Information" icon={<User size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                        {user?.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.charAt(0) || 'U')}
                      </div>
                      <div>
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, false)} />
                        <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={14} /> Upload Profile Picture</button>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>JPG, PNG or WEBP.</p>
                      </div>
                    </div>
                    <PremiumInput label="Full Name" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} icon={<User size={18} />} />
                    <PremiumInput label="Mobile Number" value={profileForm.mobile} onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})} icon={<Smartphone size={18} />} />
                    <PremiumInput label="Email Address" type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} icon={<Mail size={18} />} />
                    <PremiumSelect label="Department" options={['Management', 'Sales', 'Admissions', 'Support', 'Training']} value={profileForm.department} onChange={(e) => setProfileForm({...profileForm, department: e.target.value})} icon={<Building size={18} />} />
                    <PremiumInput label="Designation" value={profileForm.designation} onChange={(e) => setProfileForm({...profileForm, designation: e.target.value})} />
                  </PremiumCard>

                  <PremiumCard title="Contact Information" icon={<MapPin size={18} />}>
                    <div style={{ gridColumn: '1 / -1' }}><PremiumTextArea label="Address" value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} rows={2} /></div>
                    <PremiumSelect label="City" options={['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Delhi']} value={profileForm.city} onChange={(e) => setProfileForm({...profileForm, city: e.target.value})} />
                    <PremiumSelect label="State" options={['Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Andhra Pradesh']} value={profileForm.state} onChange={(e) => setProfileForm({...profileForm, state: e.target.value})} />
                    <PremiumSelect label="Country" options={['India', 'United States', 'United Kingdom', 'UAE', 'Singapore']} value={profileForm.country} onChange={(e) => setProfileForm({...profileForm, country: e.target.value})} />
                  </PremiumCard>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={handleSaveProfile} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isSaving ? <RefreshCw size={18} className="spin" /> : <CheckCircle2 size={18} />} Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPANY PROFILE */}
              {activeTab === 'company' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Company Profile</h2>
                  
                  <PremiumCard title="Company Details" icon={<Building size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', padding: '12px' }}>
                        <Image src={companyLogo || "/logo.png"} alt="Logo" width={50} height={50} style={{ objectFit: 'contain' }} />
                      </div>
                      <div>
                        <input type="file" accept="image/*" ref={logoInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, true)} />
                        <button onClick={() => logoInputRef.current?.click()} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={14} /> Upload Logo</button>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Updates logo globally.</p>
                      </div>
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Business Hours" icon={<Calendar size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {hoursForm.map((day, idx) => (
                        <div key={day.day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '100px', fontWeight: 600, color: 'var(--text-primary)' }}>{day.day}</div>
                          <ToggleSwitch checked={day.isOpen} onChange={(v) => { const newH = [...hoursForm]; newH[idx].isOpen = v; setHoursForm(newH); }} label="" />
                          {day.isOpen ? (
                            <>
                              <input type="time" value={day.openingTime} onChange={(e) => { const newH = [...hoursForm]; newH[idx].openingTime = e.target.value; setHoursForm(newH); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                              <span style={{ color: 'var(--text-secondary)' }}>to</span>
                              <input type="time" value={day.closingTime} onChange={(e) => { const newH = [...hoursForm]; newH[idx].closingTime = e.target.value; setHoursForm(newH); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>Closed</span>
                          )}
                        </div>
                      ))}
                      <div style={{ marginTop: '16px' }}>
                        <a href="https://calendar.google.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} /> Sync with Google Calendar
                        </a>
                      </div>
                    </div>
                  </PremiumCard>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={handleSaveCompany} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isSaving ? <RefreshCw size={18} className="spin" /> : <CheckCircle2 size={18} />} Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {activeTab === 'security' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Security Settings</h2>
                  
                  <PremiumCard title="Change Password" icon={<Shield size={18} />}>
                    <PremiumInput label="Current Password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} placeholder="••••••••" />
                    <PremiumInput label="New Password" type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} placeholder="••••••••" />
                    <PremiumInput label="Confirm New Password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} placeholder="••••••••" />
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                      <button onClick={handleChangePassword} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Change Password</button>
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Two-Factor Authentication" icon={<Smartphone size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(37,99,235,0.05)', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.1)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Authenticator App</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Use Google Authenticator or Authy to generate one-time codes.</p>
                      </div>
                      <button onClick={() => setShow2FAModal(true)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#22c55e', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Enable 2FA</button>
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Session Management" icon={<Monitor size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You are currently logged in on <strong>{sessions.length} devices</strong>.</p>
                      <button onClick={() => logout()} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={16} /> Logout from All Devices
                      </button>
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Login History</h4>
                      <div style={{ overflowX: 'auto', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Device</th>
                              <th style={{ padding: '12px 16px', fontWeight: 600 }}>IP Address</th>
                              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Time</th>
                              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessions.map(row => (
                              <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{row.device} {row.isCurrent && <span style={{ color: '#22c55e', fontSize: '10px', marginLeft: '4px' }}>(Current)</span>}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.ip}</td>
                                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.time}</td>
                                <td style={{ padding: '12px 16px' }}>
                                  {!row.isCurrent && <button onClick={() => terminateSession(row.id)} style={{ padding: '4px 8px', borderRadius: '6px', background: '#ef444422', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Terminate</button>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </PremiumCard>
                </div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Notification Preferences</h2>
                  
                  <PremiumCard title="Email & System Alerts" icon={<Bell size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <ToggleSwitch checked={notifications.newLead} onChange={(c) => updateNotifications({...notifications, newLead: c})} label="New Lead Notifications" description="Receive alerts when a new lead is assigned to you." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.demoReminder} onChange={(c) => updateNotifications({...notifications, demoReminder: c})} label="Demo Reminder" description="Reminders for scheduled demos 30 minutes prior." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.paymentReminder} onChange={(c) => updateNotifications({...notifications, paymentReminder: c})} label="Payment Reminder" description="Alerts for upcoming or overdue student payments." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.studentRegistration} onChange={(c) => updateNotifications({...notifications, studentRegistration: c})} label="Student Registration" description="Alerts when a student successfully registers on the portal." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.newAdmission} onChange={(c) => updateNotifications({...notifications, newAdmission: c})} label="New Admission" description="Notifications for completed admissions." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.taskReminder} onChange={(c) => updateNotifications({...notifications, taskReminder: c})} label="Task Reminder" description="Daily digest and individual task alerts." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.systemAlerts} onChange={(c) => updateNotifications({...notifications, systemAlerts: c})} label="System Alerts" description="Important CRM updates and maintenance windows." />
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Delivery Channels" icon={<MapPin size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <ToggleSwitch checked={notifications.whatsapp} onChange={(c) => updateNotifications({...notifications, whatsapp: c})} label="WhatsApp Notifications" description="Receive instant updates via WhatsApp." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={notifications.email} onChange={(c) => updateNotifications({...notifications, email: c})} label="Email Notifications" description="Receive detailed updates via Email." />
                    </div>
                  </PremiumCard>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={() => showToast('Notification preferences updated successfully.')} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> Save Preferences
                    </button>
                    <button onClick={() => { resetNotifications(); showToast('Preferences reset to default.'); }} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
                  </div>
                </div>
              )}

            
              {/* TAB 5: APPEARANCE */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Appearance Settings</h2>
                  
                  <PremiumCard title="Theme & Accent" icon={<Palette size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Theme Mode</h4>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {['light', 'dark', 'system'].map(t => (
                            <button key={t} onClick={() => setAppForm({...appForm, theme: t})} style={{ padding: '12px 24px', borderRadius: '12px', background: appForm.theme === t ? 'var(--primary-color)' : 'var(--bg-secondary)', color: appForm.theme === t ? 'white' : 'var(--text-primary)', border: '1px solid', borderColor: appForm.theme === t ? 'var(--primary-color)' : 'var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, textTransform: 'capitalize' }}>
                              {t === 'light' ? <Sun size={18}/> : t === 'dark' ? <Moon size={18}/> : <Monitor size={18}/>} {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Accent Color</h4>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {[ 
                            { id: 'blue', color: '#2563eb' }, { id: 'purple', color: '#8b5cf6' }, { id: 'green', color: '#10b981' }, 
                            { id: 'orange', color: '#f59e0b' }, { id: 'cyan', color: '#06b6d4' }, { id: 'red', color: '#ef4444' }, 
                            { id: 'pink', color: '#ec4899' }, { id: 'indigo', color: '#6366f1' }, { id: 'teal', color: '#14b8a6' } 
                          ].map(c => (
                            <button key={c.id} onClick={() => setAppForm({...appForm, accent: c.id})} style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.color, border: appForm.accent === c.id ? '3px solid white' : 'none', outline: appForm.accent === c.id ? `2px solid ${c.color}` : 'none', cursor: 'pointer' }} title={c.id} />
                          ))}
                        </div>
                      </div>

                    </div>
                  </PremiumCard>

                  <PremiumCard title="Layout & Effects" icon={<LayoutDashboard size={18} />}>
                    <PremiumSelect label="Sidebar Mode" value={appForm.sidebar} onChange={(e) => setAppForm({...appForm, sidebar: e.target.value})} options={[{label:'Expanded', value:'expanded'}, {label:'Collapsed', value:'collapsed'}, {label:'Auto Collapse', value:'auto'}]} />
                    <PremiumSelect label="Dashboard Density" value={appForm.density} onChange={(e) => setAppForm({...appForm, density: e.target.value})} options={[{label:'Compact', value:'compact'}, {label:'Comfortable', value:'comfortable'}, {label:'Spacious', value:'spacious'}]} />
                    <PremiumSelect label="Font Size" value={appForm.fontSize} onChange={(e) => setAppForm({...appForm, fontSize: e.target.value})} options={[{label:'Small', value:'small'}, {label:'Medium', value:'medium'}, {label:'Large', value:'large'}]} />
                    
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                      <ToggleSwitch checked={appForm.animations} onChange={(c) => setAppForm({...appForm, animations: c})} label="Enable Animations" description="Smooth transitions and micro-interactions." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={appForm.glassEffect} onChange={(c) => setAppForm({...appForm, glassEffect: c})} label="Glassmorphism Effect" description="Blurry transparent backgrounds for cards." />
                      <div style={{ height: '1px', background: 'var(--border-color)' }} />
                      <ToggleSwitch checked={appForm.smoothScroll} onChange={(c) => setAppForm({...appForm, smoothScroll: c})} label="Smooth Scroll" description="Enable smooth scrolling throughout the application." />
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Dashboard Background" icon={<Palette size={18} />}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'thin' }}>
                        {['default', 'blue_abstract', 'purple_gradient', 'ai_network', 'cyber_grid', 'dark_waves', 'glass_blur', 'tech_mesh', 'space', 'digital_circuit', 'corporate', 'ai_brain', 'neon', 'hexagon', 'minimal'].map(bg => (
                          <div key={bg} onClick={() => setAppForm({...appForm, dashboardBackground: bg})} style={{ minWidth: '120px', height: '80px', borderRadius: '8px', background: 'var(--bg-secondary)', border: appForm.dashboardBackground === bg ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.8)', textAlign: 'center', textTransform: 'capitalize' }}>{bg.replace('_', ' ')}</div>
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.5, background: 'linear-gradient(45deg, rgba(0,0,0,0.8), rgba(255,255,255,0.1))' }} />
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button onClick={() => document.getElementById('bg-upload')?.click()} style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px dashed var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <Upload size={16}/> Upload Custom Background
                        </button>
                        <input id="bg-upload" type="file" accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} onChange={handleDashboardBgUpload} />
                        {appForm.dashboardBackground.startsWith('data:') && <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14}/> Custom Image Applied</span>}
                      </div>
                    </div>
                  </PremiumCard>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={handleSaveAppearance} disabled={isSaving} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isSaving ? <RefreshCw size={18} className="spin" /> : <CheckCircle2 size={18} />} Save Changes
                    </button>
                    <button onClick={() => setAppForm(appearance)} style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
                  </div>
                </div>
              )}

              {/* TAB 6: API KEYS */}
              {activeTab === 'api_keys' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>API Management</h2>
                    <button onClick={() => { setEditingApi(null); setApiForm({name:'', key:'', env:'Production', description:''}); setShowApiModal(true); }} style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={18} /> Add API Key
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {apiKeys.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase())).map(api => (
                      <div key={api.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{api.name}</h3>
                            <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: api.env === 'Production' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: api.env === 'Production' ? '#60a5fa' : '#fbbf24' }}>{api.env}</span>
                          </div>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: api.status === 'Connected' ? '#10b981' : '#ef4444' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: api.status === 'Connected' ? '#10b981' : '#ef4444' }} /> {api.status}
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '16px', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <code style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{api.key.substring(0,4)}...{api.key.substring(api.key.length - 4)}</code>
                          <button onClick={() => copyApiKey(api.key)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Copy Key"><Copy size={16}/></button>
                        </div>
                        
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                          <div><strong>Last Updated:</strong> {api.lastUpdated}</div>
                          <div><strong>Last Tested:</strong> {api.lastTested}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditingApi(api); setApiForm({name:api.name, key:api.key, env:api.env, description:api.description}); setShowApiModal(true); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                            <Edit2 size={14}/> Edit
                          </button>
                          <button onClick={() => deleteApiKey(api.id)} style={{ padding: '8px', borderRadius: '8px', background: '#ef444422', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: INTEGRATIONS */}
              {activeTab === 'integrations' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Integrations · <span style={{ color: '#2563eb' }}>{integrations.length} total</span>
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', margin: 0 }}>
                        Connect external telephony providers, payment gateways, lead channels, and Google Workspace.
                      </p>
                    </div>
                  </div>

                  {/* Filter Chips Row */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {[
                      'All', 'Configured', 'Not connected', 'Healthy', 'Action needed', 'Reconnect', 'Mapping pending', 'No events yet', 'Stale'
                    ].map(chip => {
                      const count = chip === 'All' 
                        ? integrations.length 
                        : chip === 'Configured' 
                        ? integrations.filter(i => i.connected).length 
                        : integrations.filter(i => i.status.toLowerCase() === chip.toLowerCase() || (chip === 'Not connected' && !i.connected)).length;

                      const isSelected = integrationFilterChip === chip;

                      return (
                        <button
                          key={chip}
                          onClick={() => setIntegrationFilterChip(chip)}
                          style={{
                            padding: '6px 14px', borderRadius: '20px', border: isSelected ? 'none' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--primary-color)' : 'var(--bg-secondary)', color: isSelected ? 'white' : 'var(--text-secondary)',
                            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          {chip} <span style={{ background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(100,116,139,0.1)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.72rem' }}>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar & Category Filter */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="text" 
                        value={integrationSearch}
                        onChange={e => setIntegrationSearch(e.target.value)}
                        placeholder="Search by name or category..." 
                        style={{ width: '100%', height: '42px', paddingLeft: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* 23 App Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {integrations.filter(app => {
                      const matchSearch = app.name.toLowerCase().includes(integrationSearch.toLowerCase()) || app.category.toLowerCase().includes(integrationSearch.toLowerCase());
                      if (!matchSearch) return false;
                      if (integrationFilterChip === 'Configured') return app.connected;
                      if (integrationFilterChip === 'Not connected') return !app.connected;
                      if (integrationFilterChip !== 'All') return app.status.toLowerCase() === integrationFilterChip.toLowerCase();
                      return true;
                    }).map(app => {
                      const isConnected = app.connected;
                      return (
                        <div key={app.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                          
                          {/* Header: App Name & Status */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <IntegrationBrandLogo id={app.id} name={app.name} />
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{app.name}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{app.category}</span>
                              </div>
                            </div>

                            {app.badge && (
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#d97706' }}>
                                {app.badge}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                            {app.description}
                          </p>

                          {/* Connection Status & Set up Button */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#10b981' : '#94a3b8' }} />
                              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isConnected ? '#10b981' : 'var(--text-tertiary)' }}>
                                {isConnected ? app.status : 'Not connected'}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedIntegrationSetup(app);
                                setSetupApiKey(app.apiKey || '');
                                setSetupWebhook(app.webhookUrl || '');
                              }}
                              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: isConnected ? 'rgba(37,99,235,0.06)' : 'var(--primary-color)', color: isConnected ? 'var(--primary-color)' : 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              Set up <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Set Up Modal Side Panel */}
              {selectedIntegrationSetup && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '540px', maxHeight: '85vh', overflowY: 'auto' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <IntegrationBrandLogo id={selectedIntegrationSetup.id} name={selectedIntegrationSetup.name} /> {selectedIntegrationSetup.name} Integration
                        </h2>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                          Status: <strong style={{ color: selectedIntegrationSetup.connected ? '#10b981' : '#94a3b8' }}>{selectedIntegrationSetup.connected ? 'Connected' : 'Not Connected'}</strong>
                        </div>
                      </div>
                      <button onClick={() => setSelectedIntegrationSetup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                    </div>

                    {/* NEXT ACTION Section */}
                    <div style={{ padding: '16px', background: 'rgba(37,99,235,0.06)', borderRadius: '14px', border: '1px solid rgba(37,99,235,0.15)', marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        NEXT ACTION
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#1e3a8a', fontWeight: 600, marginBottom: '12px' }}>
                        {selectedIntegrationSetup.connected ? 'Manage credentials & API sync parameters' : `Authenticate and link ${selectedIntegrationSetup.name} to FORTIVEX.AI CRM`}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            setIsTestingIntegration(true);
                            setTimeout(() => {
                              setIsTestingIntegration(false);
                              const updated = integrations.map(i => i.id === selectedIntegrationSetup.id ? { ...i, connected: true, status: 'Healthy', apiKey: setupApiKey, webhookUrl: setupWebhook } : i);
                              setIntegrations(updated);
                              setSelectedIntegrationSetup({ ...selectedIntegrationSetup, connected: true, status: 'Healthy' });
                              showToast(`${selectedIntegrationSetup.name} successfully connected!`);
                            }, 1200);
                          }}
                          style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <CheckCircle2 size={15} /> Connect →
                        </button>
                        
                        {selectedIntegrationSetup.connected && (
                          <button
                            onClick={() => {
                              const updated = integrations.map(i => i.id === selectedIntegrationSetup.id ? { ...i, connected: false, status: 'Not connected' } : i);
                              setIntegrations(updated);
                              setSelectedIntegrationSetup(null);
                              showToast(`Disconnected ${selectedIntegrationSetup.name}`);
                            }}
                            style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                          >
                            Disconnect
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>API Key / Client Token</label>
                        <input
                          type="text"
                          value={setupApiKey}
                          onChange={e => setSetupApiKey(e.target.value)}
                          placeholder={`Enter ${selectedIntegrationSetup.name} API Key...`}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Webhook Callback URL</label>
                        <input
                          type="text"
                          value={setupWebhook}
                          onChange={e => setSetupWebhook(e.target.value)}
                          placeholder={`https://api.fortivex.ai/${selectedIntegrationSetup.id}/webhook`}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Bottom Links */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: '#64748b' }}>
                      <span style={{ fontWeight: 600 }}>MORE:</span>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="#" onClick={e => { e.preventDefault(); showToast('Redirecting to OAuth authentication...'); }} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Connect</a>
                        <span>·</span>
                        <a href="#" onClick={e => { e.preventDefault(); showToast('Manual API documentation opened.'); }} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Manage manually</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: BACKUP & DATA */}
              {activeTab === 'backup' && (
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>Backup & Data</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Last Backup</p>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{backups[0]?.date || 'Never'}</h3>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Next Scheduled</p>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{backupSettings.frequency}</h3>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'border-color 0.2s' }} onClick={() => setShowStorageAnalytics(true)} onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')} onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Storage Used <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', marginLeft: '8px', background: 'rgba(37,99,235,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Click to Analyze</span></p>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>2.4 GB <span style={{fontSize:'0.8rem', color:'#10b981'}}>/ 10GB</span></h3>
                    </div>
                  </div>

                  <PremiumCard title="Storage Analytics" icon={<Database size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '150px', height: '150px', borderRadius: '50%',
                        background: 'conic-gradient(#2563eb 0% 40%, #10b981 40% 70%, #f59e0b 70% 90%, #8b5cf6 90% 100%)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#2563eb' }} /> Documents</span>
                          <span style={{ fontWeight: 600 }}>40% (960 MB)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }} /> Student Records</span>
                          <span style={{ fontWeight: 600 }}>30% (720 MB)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f59e0b' }} /> Applications</span>
                          <span style={{ fontWeight: 600 }}>20% (480 MB)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#8b5cf6' }} /> Reports & Others</span>
                          <span style={{ fontWeight: 600 }}>10% (240 MB)</span>
                        </div>
                      </div>
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Backup Actions & Settings" icon={<Database size={18} />}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <button onClick={handleBackupNow} disabled={isBackingUp} style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isBackingUp ? <RefreshCw size={18} className="spin"/> : <Database size={18}/>} Backup Now
                      </button>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <PremiumSelect label="" value={backupSettings.frequency} onChange={(e) => updateBackupSettings({...backupSettings, frequency: e.target.value})} options={[{label:'Daily', value:'Daily'}, {label:'Weekly', value:'Weekly'}, {label:'Monthly', value:'Monthly'}]} />
                        <ToggleSwitch checked={backupSettings.autoBackup} onChange={(c) => updateBackupSettings({...backupSettings, autoBackup: c})} label="Auto Backup" description="" />
                      </div>
                    </div>
                  </PremiumCard>

                  <PremiumCard title="Backup History" icon={<Database size={18} />}>
                    <div style={{ gridColumn: '1 / -1', overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '12px', fontWeight: 600 }}>Backup Name</th>
                            <th style={{ padding: '12px', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '12px', fontWeight: 600 }}>Size</th>
                            <th style={{ padding: '12px', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backups.map(b => (
                            <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                              <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{b.name}</td>
                              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{b.date}</td>
                              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{b.size}</td>
                              <td style={{ padding: '12px', color: '#10b981' }}>{b.status}</td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                <button onClick={() => { showToast('Backup download started.'); }} style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', marginRight: '8px' }}><Download size={14}/></button>
                                <button onClick={() => { if(confirm('Restore this backup? System will restart.')) showToast('Restoring backup...'); }} style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', cursor: 'pointer', marginRight: '8px', fontWeight: 600 }}>Restore</button>
                                <button onClick={() => deleteBackup(b.id)} style={{ padding: '6px 10px', borderRadius: '6px', background: '#ef444422', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={14}/></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </PremiumCard>

                  <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <PremiumCard title="Export Data" icon={<Download size={18} />}>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {['Export CSV', 'Export Excel', 'Export JSON'].map(btn => (
                            <button key={btn} onClick={() => showToast(`${btn} started.`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 600 }}>{btn}</button>
                          ))}
                        </div>
                      </PremiumCard>
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <PremiumCard title="Import Data" icon={<Upload size={18} />}>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upload CSV, Excel, or JSON to bulk import data.</p>
                          <button onClick={() => document.getElementById('data-upload')?.click()} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px dashed var(--primary-color)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                            <Upload size={18} /> Choose File
                          </button>
                          <input id="data-upload" type="file" style={{ display: 'none' }} onChange={() => showToast('File loaded. Preview ready.')} />
                        </div>
                      </PremiumCard>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '90%', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Enable 2FA</h3>
                <button onClick={() => setShow2FAModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20}/></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '150px', height: '150px', background: 'white', padding: '8px', borderRadius: '8px' }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/FortivexCRM:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=FortivexCRM" alt="QR Code" style={{ width: '100%', height: '100%' }} />
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>Scan this QR code with Google Authenticator or Authy.</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 8px 0', fontWeight: 600 }}>Backup Codes</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  <span>A8X9-2K1P</span>
                  <span>M4L2-9Q8Z</span>
                  <span>T7Y3-5R6N</span>
                  <span>W1B8-4C2X</span>
                </div>
              </div>

              <button onClick={() => { setShow2FAModal(false); showToast('Two-Factor Authentication Enabled'); }} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Verify & Enable</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    
      {/* API Modal */}
      <AnimatePresence>
        {showApiModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90%', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{editingApi ? 'Edit API Key' : 'Add API Key'}</h3>
                <button onClick={() => setShowApiModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20}/></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <PremiumInput label="API Name" type="text" value={apiForm.name} onChange={e => setApiForm({...apiForm, name: e.target.value})} placeholder="e.g. OpenAI Production" />
                <PremiumInput label="API Key" type="text" value={apiForm.key} onChange={e => setApiForm({...apiForm, key: e.target.value})} placeholder="sk-..." />
                <PremiumSelect label="Environment" value={apiForm.env} onChange={e => setApiForm({...apiForm, env: e.target.value})} options={[{label:'Development', value:'Development'}, {label:'Production', value:'Production'}]} />
                <PremiumTextArea label="Description" value={apiForm.description} onChange={e => setApiForm({...apiForm, description: e.target.value})} placeholder="What is this key used for?" rows={3} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleApiSave} disabled={isSaving} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {isSaving ? <RefreshCw size={18} className="spin"/> : <CheckCircle2 size={18}/>} Save API Key
                </button>
                <button onClick={testApiConnection} disabled={isTesting || !apiForm.key} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {isTesting ? <RefreshCw size={18} className="spin"/> : <Globe size={18}/>} {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showStorageAnalytics && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', maxWidth: '600px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={24} color="var(--primary-color)"/> Storage Analytics
                </h2>
                <button onClick={() => setShowStorageAnalytics(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24}/></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Storage</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>10 GB</h3>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Used Storage</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-color)' }}>2.4 GB</h3>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available</p>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#10b981' }}>7.6 GB</h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '150px', height: '150px', borderRadius: '50%',
                  background: 'conic-gradient(#2563eb 0% 40%, #10b981 40% 70%, #f59e0b 70% 85%, #8b5cf6 85% 95%, #ef4444 95% 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {[ {label: 'Student Files (Documents/Images)', color: '#2563eb', pct: '40%', val: '960 MB'},
                     {label: 'Database (Leads/Apps/Reports)', color: '#10b981', pct: '30%', val: '720 MB'},
                     {label: 'Backup Files', color: '#f59e0b', pct: '15%', val: '360 MB'},
                     {label: 'API Cache', color: '#8b5cf6', pct: '10%', val: '240 MB'},
                     {label: 'System Logs', color: '#ef4444', pct: '5%', val: '120 MB'} ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: item.color }} /> {item.label}</span>
                      <span style={{ fontWeight: 600 }}>{item.pct} ({item.val})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Storage Optimization</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => showToast('Clearing Temporary Cache... Freed 150MB')} style={{ padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Trash2 size={14}/> Clear Cache</button>
                  <button onClick={() => showToast('System Logs Deleted! Freed 120MB')} style={{ padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Trash2 size={14}/> Delete Logs</button>
                  <button onClick={() => showToast('Database Optimized! Queries run 15% faster.')} style={{ padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Database size={14}/> Optimize Database</button>
                  <button onClick={() => showToast('Old Backups Cleared! Freed 800MB')} style={{ padding: '10px 16px', borderRadius: '8px', background: '#ef444422', color: '#ef4444', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}><Trash2 size={14}/> Clear Old Backups</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
