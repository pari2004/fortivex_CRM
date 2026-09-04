'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Wand2, PhoneCall, Link, Mail, MessageCircle, ArrowRight, Server, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IntegrationStatus = 'Configured' | 'Not connected' | 'Healthy' | 'Action needed' | 'Reconnect' | 'Mapping pending' | 'No events yet' | 'Stale';

type Integration = {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  description: string;
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
  hasSetupCharges?: boolean;
  isPaid?: boolean;
  lastEventTime?: string;
  issues?: string[];
  connections?: number;
  maxConnections?: number;
  mappings?: number;
  maxMappings?: number;
  icon?: React.ReactNode;
};

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'web_contact_form', name: 'Web Contact Form', category: 'Forms', status: 'Not connected', description: 'Automatically Capture Leads from Web Contact Form', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3b82f6' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect><line x1='3' y1='9' x2='21' y2='9'></line><line x1='9' y1='21' x2='9' y2='9'></line></svg>, connected: false },
  { id: 'leads_api', name: 'Leads Through API Call', category: 'API', status: 'Healthy', description: 'Automatically Capture Leads through Custom API calls', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#4f46e5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg>, connected: true, lastEventTime: '5d ago', connections: 1, maxConnections: 1, mappings: 1, maxMappings: 1 },
  { id: 'aajjo', name: 'AAjjo', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from aajjo.com', icon: <img src='https://aajjo.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Aajjo' onError={(e)=>{e.currentTarget.style.display='none'}} />, connected: false },
  { id: 'bon_voice', name: 'Bon Voice', category: 'Telephony', status: 'Not connected', description: 'Connect your Bon Voice Cloudphony Account', icon: <div style={{width:24, height:24, borderRadius: '4px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>BV</div>, connected: false, hasSetupCharges: true },
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', status: 'Not connected', description: 'Automatically Capture Leads from Calendly Bookings', icon: <img src='https://calendly.com/favicon.ico' style={{width: 24, height: 24}} alt='Calendly' />, connected: false },
  { id: 'caller_desk', name: 'Caller Desk', category: 'Telephony', status: 'Not connected', description: 'Connect your Caller Desk Cloudphony Account', icon: <div style={{width:24, height:24, borderRadius: '4px', background: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>CD</div>, connected: false, hasSetupCharges: true },
  { id: 'cashfree', name: 'Cashfree', category: 'Payments', status: 'Not connected', description: 'Integrate Cashfree & Manage Payments', icon: <img src='https://www.cashfree.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Cashfree' />, connected: false },
  { id: 'commonfloor', name: 'Commonfloor', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from Commonfloor', icon: <img src='https://www.commonfloor.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Commonfloor' />, connected: false },
  { id: 'exotel', name: 'Exotel', category: 'Telephony', status: 'Not connected', description: 'Connect your Exotel Cloud Telephony Account', icon: <img src='https://exotel.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Exotel' />, connected: false, hasSetupCharges: true },
  { id: 'facebook', name: 'Facebook', category: 'Social', status: 'Not connected', description: 'Automatically Capture Leads from Facebook', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#1877F2'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>, connected: false },
  { id: 'gmail', name: 'Gmail', category: 'Email', status: 'Not connected', description: 'Connect you Gmail Account', icon: <svg width='24' height='24' viewBox='0 0 24 24'><path d='M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z' fill='#EA4335'/><path d='M12 9.548 5.455 4.64 3.927 3.493a1.66 1.66 0 0 0-1.527-.249v.001l-.039.014v8.471L12 16.64l9.639-7.23V3.259a1.66 1.66 0 0 0-1.566.234l-1.528 1.145L12 9.548z' fill='#C5221F'/><path d='M22.364 21.002h1.636V5.457c0-1.04-.648-1.954-1.636-2.26v17.805z' fill='#FABB05'/><path d='M1.636 21.002H0V3.197c.988.306 1.636 1.22 1.636 2.26v17.805z' fill='#34A853'/><path d='M18.545 11.73v9.273h3.819v-17.805l-3.819 8.532z' fill='#FBBC04'/><path d='M5.455 11.73v9.273H1.636v-17.805l3.819 8.532z' fill='#4285F4'/></svg>, connected: false },
  { id: 'google_meet', name: 'Google Meet', category: 'Meetings', status: 'Not connected', description: 'Connect your Google Meet Account', icon: <svg width='24' height='24' viewBox='0 0 24 24'><path d='M24 10.9v2.2c0 2.2-.4 3.7-1.1 5.3-.8 1.6-1.8 2.6-3.4 3.4-1.6.7-3.1 1.1-5.3 1.1H9.8c-2.2 0-3.7-.4-5.3-1.1-1.6-.8-2.6-1.8-3.4-3.4C.4 16.8 0 15.3 0 13.1V9.8c0-2.2.4-3.7 1.1-5.3.8-1.6 1.8-2.6 3.4-3.4 1.6-.7 3.1-1.1 5.3-1.1h4.4c2.2 0 3.7.4 5.3 1.1 1.6.8 2.6 1.8 3.4 3.4.7 1.6 1.1 3.1 1.1 5.3v1.1z' fill='#fff'/><path d='M15.3 7.6l2.8 2.3c.4.3.4.9 0 1.2l-2.8 2.3c-.4.3-1.1.1-1.1-.4V8c0-.5.7-.7 1.1-.4z' fill='#00832d'/><path d='M8 7.3h3.5v9.5H8z' fill='#0066da'/><path d='M8 7.3h-1.8c-1.3 0-2.4 1.1-2.4 2.4v5c0 1.3 1.1 2.4 2.4 2.4H8z' fill='#e94235'/><path d='M11.5 7.3h2.7v9.5h-2.7z' fill='#fbbc04'/></svg>, connected: false, isPaid: true },
  { id: 'google_drive', name: 'Google Drive', category: 'Storage', status: 'Not connected', description: 'Take out call recordings and other data from Salesmax to Google Drive Folder', icon: <svg width='24' height='24' viewBox='0 0 24 24'><path d='M15.2 2H8.8L2 14h6.4l6.8-12z' fill='#FFC107'/><path d='M16.8 4.8L24 16.8 17.2 22 10 10l6.8-5.2z' fill='#1976D2'/><path d='M3.6 16.8L10 22H24l-6.4-5.2H3.6z' fill='#4CAF50'/></svg>, connected: false, isPaid: true },
  { id: 'google_forms', name: 'Google Forms', category: 'Forms', status: 'Not connected', description: 'Connect your Google Form and create lead Salesmax', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#7248b9'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'/><path d='M14 2v6h6'/><path fill='#fff' d='M8 12h8v2H8zm0 4h8v2H8zm0-8h4v2H8z'/></svg>, connected: false },
  { id: 'google_ads_lead', name: 'Google Ads Lead Form', category: 'Ads', status: 'Not connected', description: 'Automatically Capture Leads from Google Ads Lead Forms', connected: false },
  { id: 'google_sheets', name: 'Google Sheets', category: 'Data', status: 'Not connected', description: 'Connect your Google Sheet and create lead in Salesmax', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#0f9d58'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'/><path d='M14 2v6h6'/><path fill='#fff' d='M8 12h3v3H8zm5 0h3v3h-3zm-5 4h3v3H8zm5 0h3v3h-3z'/></svg>, connected: false },
  { id: 'housing', name: 'Housing', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from Housing.com', icon: <img src='https://housing.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Housing' />, connected: false },
  { id: 'indiamart', name: 'Indiamart', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from Indiamart', icon: <div style={{width: 24, height: 24, background: '#e31e24', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '10px'}}>IM</div>, connected: false },
  { id: 'instagram', name: 'Instagram DM', category: 'Social', status: 'Not connected', description: 'Integrate Instagram DM', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#E1306C' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='2' y='2' width='20' height='20' rx='5' ry='5'></rect><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path><line x1='17.5' y1='6.5' x2='17.51' y2='6.5'></line></svg>, connected: false },
  { id: 'jotform', name: 'Jotform', category: 'Forms', status: 'Not connected', description: 'Automatically Capture data from Jotform', icon: <img src='https://www.jotform.com/favicon.ico' style={{width: 24, height: 24}} alt='Jotform' />, connected: false },
  { id: 'justdial', name: 'Justdial', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from Justdial', icon: <img src='https://www.justdial.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Justdial' />, connected: false },
  { id: 'knowlarity', name: 'Knowlarity', category: 'Telephony', status: 'Not connected', description: 'Connect your Knowlarity Cloud Telephony Account', icon: <div style={{width:24, height:24, borderRadius: '4px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>K</div>, connected: false, hasSetupCharges: true },
  { id: 'magicbricks', name: 'MagicBricks', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from MagicBricks', icon: <img src='https://www.magicbricks.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='MagicBricks' />, connected: false },
  { id: 'meta_conversion', name: 'Meta Conversion API', category: 'Ads', status: 'Not connected', description: 'Send lead events back to Meta for better performing ADs', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#0668E1'><path d='M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm2.083-9.529h-2.187v2.463c0 1.258.894 1.229 2.187 1.229v2.302c-3.155.086-4.664-1.282-4.664-3.531v-2.463H7.502v-2.302h1.917V9.739l2.477-1.396v3.826h2.187v2.302z'/></svg>, connected: false, isPaid: true },
  { id: 'openai', name: 'OpenAI', category: 'AI', status: 'Not connected', description: 'Add your OpenAI api key here', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#10a37f'><path d='M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.0192 19.818a5.9847 5.9847 0 0 0 3.9977-2.9 6.0462 6.0462 0 0 0-.735-7.0969zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829v-2.3324a.0804.0804 0 0 1 .0332-.0615L17.46 3.1939a4.4992 4.4992 0 0 1 2.81 7.6696l-.142-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685v-2.3324a.0804.0804 0 0 1 .0332-.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956z' /></svg>, connected: false },
  { id: 'razorpay', name: 'Razorpay', category: 'Payments', status: 'Not connected', description: 'Integrate Razorpay & Manage Payments', icon: <img src='https://razorpay.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Razorpay' />, connected: false },
  { id: 'add_webhook', name: 'Add Webhook', category: 'API', status: 'Not connected', description: 'Take Data out of Salesmax', connected: false, isPaid: true },
  { id: 'website_chat', name: 'Website Chat Widget', category: 'Chat', status: 'Not connected', description: 'Add Chat Widget on Your Website & Optionally Link AI Chatbot', connected: false },
  { id: 'leads_from_email', name: 'Leads from Email to Salesmax', category: 'Email', status: 'Not connected', description: 'Forward leads you receive on Email to Salesmax', connected: false },
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', status: 'Not connected', description: 'Connect with your Shopify Account and get updates in Salesmax', icon: <img src='https://cdn.shopify.com/static/shopify-favicon.png' style={{width: 24, height: 24}} alt='Shopify' />, connected: false },
  { id: 'tata_tele', name: 'Tata Tele Smart Flo', category: 'Telephony', status: 'Not connected', description: 'Connect your Tata Tele Cloudphony Account', icon: <div style={{width:24, height:24, borderRadius: '4px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>TT</div>, connected: false, hasSetupCharges: true },
  { id: 'trade_india', name: 'Trade India', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from Trade India', icon: <img src='https://www.tradeindia.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Trade India' />, connected: false },
  { id: 'urbanpro', name: 'UrbanPro', category: 'Lead Source', status: 'Not connected', description: 'Automatically Capture Leads from UrbanPro', icon: <img src='https://www.urbanpro.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='UrbanPro' />, connected: false },
  { id: 'whatsapp_cloud_api', name: 'WhatsApp', category: 'Messaging', status: 'Not connected', description: 'Integrate Whatsapp Cloud Api', connected: false },
  { id: 'wix', name: 'Wix Contact Form', category: 'Forms', status: 'Not connected', description: 'Automatically Capture Leads from Wix Website Contact Form', connected: false },
  { id: 'zenoti', name: 'Zenoti', category: 'Booking', status: 'Not connected', description: 'Integrate Zenoti with Salesmax', icon: <img src='https://www.zenoti.com/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Zenoti' />, connected: false, isPaid: true },
  { id: 'zoho_books', name: 'ZOHO Books', category: 'Finance', status: 'Not connected', description: 'Integrate Zoho Books & Manage Invoices', icon: <img src='https://www.zoho.com/books/favicon.ico' style={{width: 24, height: 24, borderRadius: '4px'}} alt='Zoho Books' />, connected: false },
  { id: 'zoho_crm', name: 'ZOHO CRM', category: 'CRM', status: 'Not connected', description: 'Integrate Zoho CRM & create leads from Salesmax in Zoho', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#2463d1'><path d='M2.44 2.44H8.8V6.52H6.52V8.8H2.44V2.44ZM2.44 15.2H6.52V17.48H8.8V21.56H2.44V15.2ZM15.2 2.44H21.56V6.52H19.28V8.8H15.2V2.44ZM15.2 15.2H19.28V17.48H21.56V21.56H15.2V15.2ZM8.8 8.8H15.2V15.2H8.8V8.8Z' /></svg>, connected: false },
  { id: 'zoho_recruit', name: 'ZOHO Recruit', category: 'HR', status: 'Not connected', description: 'Integrate Zoho Recruit with Salesmax', icon: <svg width='24' height='24' viewBox='0 0 24 24' fill='#4caf50'><path d='M2 2H8.5V6H6V8.5H2V2ZM2 15.5H6V18H8.5V22H2V15.5ZM15.5 2H22V6H19.5V8.5H15.5V2ZM15.5 15.5H19.5V18H22V22H15.5V15.5ZM8.5 8.5H15.5V15.5H8.5V8.5Z' /></svg>, connected: false }
];

export default function BroadcastIntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<{ query: string, text: string } | null>(null);
  
  // Setup Modal State
  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);
  const [activePanelTab, setActivePanelTab] = useState<'Overview' | 'Forms' | 'Issues' | 'Sources'>('Overview');
  const [domainInput, setDomainInput] = useState('');
  
  // Generic Setup Form State
  const [setupFields, setSetupFields] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('crm_integrations_setup') || '{}');
      setIntegrations(prev => prev.map(i => existing[i.id] ? { ...i, connected: true, status: 'Healthy' } : i));
    } catch(e) {}
  }, []);

  
  // WhatsApp Specific State
  const [waMetaAccount, setWaMetaAccount] = useState('');
  const [waWabaId, setWaWabaId] = useState('');
  const [waPhoneId, setWaPhoneId] = useState('');
  const [waAppId, setWaAppId] = useState('');
  const [waAppSecret, setWaAppSecret] = useState('');
  const [waVerifyToken, setWaVerifyToken] = useState('fortivex_wa_verify_2026');
  const [waAccessToken, setWaAccessToken] = useState('');

  useEffect(() => {
    // Load WhatsApp connection state if it exists
    const waStatus = localStorage.getItem('wa_connected');
    if (waStatus === 'true') {
      setIntegrations(prev => prev.map(i => i.id === 'whatsapp_cloud_api' ? { ...i, connected: true, status: 'Healthy' } : i));
    }
  }, []);


  const handleConnect = (id: string) => {
    // In a real app we'd validate setupFields here
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true, status: 'Healthy' } : i));
    
    // Persist to local storage
    try {
      const existing = JSON.parse(localStorage.getItem('crm_integrations_setup') || '{}');
      existing[id] = true;
      localStorage.setItem('crm_integrations_setup', JSON.stringify(existing));
    } catch(e) {}
    
    // Switch to Overview to show it's connected
    setActivePanelTab('Overview');
  };

  const counts: Record<string, number> = {
    'All': integrations.length,
    'Configured': integrations.filter(i => i.connected || i.status !== 'Not connected').length,
    'Not connected': integrations.filter(i => i.status === 'Not connected').length,
    'Healthy': integrations.filter(i => i.status === 'Healthy').length,
    'Action needed': integrations.filter(i => i.status === 'Action needed').length,
    'Reconnect': integrations.filter(i => i.status === 'Reconnect').length,
    'Mapping pending': integrations.filter(i => i.status === 'Mapping pending').length,
    'No events yet': integrations.filter(i => i.status === 'No events yet').length,
    'Stale': integrations.filter(i => i.status === 'Stale').length,
  };

  const filteredIntegrations = integrations.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = activeFilter === 'All' ? true : (
      activeFilter === 'Configured' ? (i.connected || i.status !== 'Not connected') : i.status === activeFilter
    );
    return matchSearch && matchFilter;
  });

  const needsAttention = filteredIntegrations.filter(i => i.status === 'Action needed' || i.status === 'Reconnect' || i.status === 'Stale');
  const active = filteredIntegrations.filter(i => i.status === 'Healthy' || i.status === 'Configured');
  const available = filteredIntegrations.filter(i => i.status === 'Not connected' || i.status === 'No events yet' || i.status === 'Mapping pending');

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    const query = aiQuery.toLowerCase();
    let response = "I couldn't find specific troubleshooting steps for that issue. Please check the documentation or contact support.";
    
    if (query.includes('fb') || query.includes('facebook')) {
      const isConnected = integrations.find(i => i.id === 'facebook')?.connected;
      response = `Facebook Lead Ads Issue:\n\nCurrent Status: ${isConnected ? 'Connected' : 'Not Connected'}\n\nPossible reasons:\n1. The page permissions might have expired.\n2. The lead form fields are not correctly mapped to Salesmax.\n\nSuggested Action: Click "Set up" on the Facebook integration and check the "Mappings" tab to ensure all required fields are correctly aligned.`;
    } else if (query.includes('whatsapp')) {
      const isConnected = integrations.find(i => i.id === 'whatsapp_cloud_api')?.connected;
      response = `WhatsApp Cloud API Issue:\n\nCurrent Status: ${isConnected ? 'Connected' : 'Not Connected'}\n\nPossible reasons:\n1. The Webhook Verify Token might be mismatched.\n2. The Permanent Access Token has expired.\n\nSuggested Action: Open the WhatsApp integration setup and verify that the 'Webhook Verify Token' matches the one set in your Meta App Dashboard.`;
    } else if (query.includes('gmail')) {
      response = `Gmail Integration Issue:\n\nPossible reasons:\n1. OAuth token has expired.\n2. App password was revoked.\n\nSuggested Action: Re-authenticate by clicking "Set up" on the Gmail integration and following the Google Sign-in flow.`;
    } else if (query.includes('webhook')) {
      response = `Webhook Issue:\n\nPossible reasons:\n1. The endpoint URL is unreachable.\n2. The payload structure changed.\n\nSuggested Action: Check the "Add Webhook" integration logs to view the latest delivery attempts and HTTP response codes.`;
    }

    setAiResponse({ query: aiQuery, text: response });
    setAiQuery('');
  };



  const renderCard = (i: Integration) => {
    const isActionNeeded = i.status === 'Action needed';
    const isConnected = i.connected || i.status === 'Healthy';
    
    return (
      <div key={i.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             {i.icon ? (
               <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {i.icon}
               </div>
             ) : (
               <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#334155' }}>{i.name.charAt(0)}</span>
               </div>
             )}
             <div>
               <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{i.name}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActionNeeded ? '#f59e0b' : isConnected ? '#10b981' : '#94a3b8' }} />
                 <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                    {isActionNeeded ? 'Setup incomplete' : isConnected ? 'Connected' : 'Not connected'}
                 </span>
               </div>
             </div>
          </div>
          {i.hasSetupCharges && <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px' }}>SET-UP CHARGES</span>}
          {i.isPaid && <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'rgba(168,85,247,0.1)', color: '#a855f7', padding: '4px 8px', borderRadius: '4px' }}>PAID</span>}
        </div>
        
        {isActionNeeded && i.issues && (
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#b45309', marginTop: '-4px' }}>
             <span style={{ fontWeight: 700 }}>⚠️</span> {i.issues[0]}
             {i.issues[1] && <div style={{ marginTop: '8px', fontWeight: 600 }}>{i.issues[1]}</div>}
          </div>
        )}

        <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, flex: 1 }}>{i.description}</div>
        
        <div style={{ borderTop: '1px dashed rgba(226,232,240,0.8)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
             {i.lastEventTime && <span style={{ marginRight: '8px', color: isActionNeeded ? '#ef4444' : '#10b981' }}>⏱ {i.lastEventTime}</span>}
             {i.connections !== undefined && <span>{i.connections}/{i.maxConnections} connections • {i.mappings}/{i.maxMappings} mapping</span>}
          </div>
          <button 
             onClick={() => { setActiveSidePanel(i.id); setActivePanelTab('Overview'); setSetupFields({}); }}
             style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(226,232,240,0.8)', background: '#f8fafc', color: '#3b82f6', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
             {isConnected || isActionNeeded ? 'Open' : 'Set up'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const statusFilterKeys = ['All', 'Configured', 'Not connected', 'Healthy', 'Action needed', 'Reconnect', 'Mapping pending', 'No events yet', 'Stale'];

  return (
    <div style={{ minHeight: '100vh', background: '#fdfaef' }}>
      
      {/* ── HEADER ── */}
      <div style={{ background: 'white', padding: '24px 40px', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
             <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Integrations</h1>
             <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{integrations.length} total</span>
           </div>

           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or category"
                  style={{ width: '280px', height: '40px', paddingLeft: '36px', paddingRight: '36px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none' }}
                />
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <ChevronDown size={16} />
                </button>
                
                {showDropdown && (
                  <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, background: 'white', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto', zIndex: 50 }}>
                    {filteredIntegrations.map(i => (
                      <div key={i.id} onClick={() => { setActiveSidePanel(i.id); setActivePanelTab('Overview'); setSetupFields({}); setShowDropdown(false); }} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(226,232,240,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {i.icon ? (
                          <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {i.icon}
                          </div>
                        ) : (
                          <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                             {i.name.charAt(0)}
                          </div>
                        )}
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{i.name}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          {statusFilterKeys.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{ 
                padding: '6px 12px', borderRadius: '20px', border: activeFilter === f ? '1px solid #0f172a' : '1px solid rgba(226,232,240,0.8)', 
                background: activeFilter === f ? '#0f172a' : 'white', color: activeFilter === f ? 'white' : '#475569', 
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {f}
              <span style={{ background: activeFilter === f ? 'rgba(255,255,255,0.2)' : 'rgba(241,245,249,1)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', paddingBottom: '120px' }}>
        
        {needsAttention.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>NEEDS YOUR ATTENTION <span style={{ background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{needsAttention.length}</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {needsAttention.map(renderCard)}
            </div>
          </div>
        )}

        {active.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>ACTIVE <span style={{ background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{active.length}</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {active.map(renderCard)}
            </div>
          </div>
        )}

        {available.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>AVAILABLE TO CONNECT <span style={{ background: 'rgba(100,116,139,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{available.length}</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {available.map(renderCard)}
            </div>
          </div>
        )}

      </div>

      {/* ── AI ASSISTANT BOTTOM BAR ── */}
      <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '800px', maxWidth: '90vw', zIndex: 100 }}>
         {aiResponse && (
           <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginBottom: '12px', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#334155', position: 'relative' }}>
             <button onClick={() => setAiResponse(null)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
             <strong>Q: {aiResponse.query}</strong><br/><br/>
             {aiResponse.text}
           </div>
         )}
         <form onSubmit={handleAskAI} style={{ display: 'flex', background: 'white', borderRadius: '40px', padding: '8px 12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(226,232,240,0.8)', alignItems: 'center' }}>
            <Wand2 size={20} style={{ color: '#8b5cf6', marginLeft: '12px' }} />
            <input 
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              placeholder="Ask about integrations related issues — e.g. 'FB lead not coming'"
              style={{ flex: 1, height: '40px', padding: '0 16px', border: 'none', fontSize: '0.95rem', outline: 'none', color: '#0f172a' }}
            />
            <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <ArrowRight size={20} />
            </button>
            <button type="button" style={{ height: '40px', padding: '0 20px', borderRadius: '20px', background: '#800080', color: 'white', border: 'none', marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}>
               <Wand2 size={16} /> Assist
            </button>
         </form>
      </div>

      {/* ── SETUP MODAL ── */}
      

      {/* ── WEB CONTACT FORM SIDE PANEL ── */}
      {activeSidePanel === 'web_contact_form' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          {/* Backdrop */}
          <div onClick={() => setActiveSidePanel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} />
          
          {/* Panel */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '700px', maxWidth: '100%', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Web Contact Form</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} /> Setup incomplete
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'white', color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Wand2 size={14} /> AI Assist
                 </button>
                 <button onClick={() => setActiveSidePanel(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
              </div>
            </div>

            {/* Tabs Header */}
            <div style={{ display: 'flex', padding: '0 32px', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
              {['Overview', 'Forms', 'Issues'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActivePanelTab(tab as any)}
                   style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: activePanelTab === tab ? 700 : 600, color: activePanelTab === tab ? '#4f46e5' : '#64748b', background: 'transparent', border: 'none', borderBottom: activePanelTab === tab ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer' }}
                 >{tab}</button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc' }}>
               
               {activePanelTab === 'Overview' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, alignItems: 'center' }}>
                       <span style={{ color: '#b91c1c', background: '#fee2e2', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ 29d ago</span>
                       <span>1 connection</span>
                       <span>0/1 mapping</span>
                    </div>

                    <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                       <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>NEXT ACTION</div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Map the phone field</h3>
                            <button style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              ▶ Show technical detail
                            </button>
                          </div>
                          <button onClick={() => alert('Opening mapping editor...')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Open mapping editor ›
                          </button>
                       </div>
                    </div>

                    <div style={{ background: '#f1f5f9', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '20px 24px', fontSize: '0.9rem', color: '#475569', fontWeight: 600, display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                       <span style={{ color: '#94a3b8' }}>MORE:</span>
                       <a href="#" style={{ color: '#b45309', textDecoration: 'underline' }}>View form</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Add another</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>View events</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Configure mapping</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Manage manually</a>
                    </div>
                 </div>
               )}

               {activePanelTab === 'Forms' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Add your website domain</h3>
                         <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                         Enter the domain where your contact form lives. We'll generate a script for you to install, then look for the first test submission.
                       </p>
                       
                       <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>USED FOR</div>
                          <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '20px' }}>Capturing leads from contact forms on your own website.</div>
                          
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>HOW IT WORKS</div>
                          <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.8 }}>
                            <li>Add the website domain where your form lives.</li>
                            <li>Install the SalesMax script on any page that hosts the form.</li>
                            <li>Submit a test entry — we'll detect it automatically.</li>
                            <li>Map each form's fields once detected, and leads start flowing.</li>
                          </ol>
                       </div>

                       <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>Your website domain</label>
                       <input 
                         value={domainInput} 
                         onChange={e => setDomainInput(e.target.value)} 
                         placeholder="shop.acme.com"
                         style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                       />
                       <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', marginBottom: '20px' }}>No https:// or www. — just the bare domain.</div>
                       
                       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Set up</button>
                       </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                         <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>2 domains</h3>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Issues appear first.</div>
                         </div>
                         <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid #4f46e5', background: '#eef2ff', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 600 }}>By status</button>
                            <button style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid #cbd5e1', background: 'transparent', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>By name</button>
                         </div>
                      </div>

                      <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                               <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>empowersacademy.com</div>
                               <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Last lead 29d ago</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} /> Warning
                               </span>
                               <span style={{ color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>•••</span>
                            </div>
                         </div>

                         <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ width: '1px', background: '#cbd5e1', margin: '0 10px' }} />
                            <div style={{ flex: 1 }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                     <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>empowersacademy.com</div>
                                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Paused · 0/3 mapped · Last lead 29d ago</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                     <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} /> Setup incomplete
                                     </span>
                                     <span style={{ color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>•••</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>
               )}

               {activePanelTab === 'Issues' && (
                 <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>2 issues</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Most urgent issues appear first.</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', color: '#b45309' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
                             <span style={{ fontSize: '1rem' }}>⚠️</span>
                             <div>No phone number property present for connection: empowersacademy.com with child: empowersacademy.com of network: WEBFORM</div>
                          </div>
                          <div style={{ fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8, marginLeft: '24px' }}>Guided steps aren't available for this yet.</div>
                       </div>

                       <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', color: '#b45309' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
                             <span style={{ fontSize: '1rem' }}>⚠️</span>
                             <div>Phone number field is not mapped. Submissions will be missing phone numbers.</div>
                          </div>
                          <button style={{ marginLeft: '24px', background: 'white', border: '1px solid #fcd34d', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Show steps to fix ⌄</button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
      {/* ── LEADS THROUGH API CALL SIDE PANEL ── */}
      {activeSidePanel === 'leads_api' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          {/* Backdrop */}
          <div onClick={() => setActiveSidePanel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} />
          
          {/* Panel */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '700px', maxWidth: '100%', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Leads Through API Call</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Connected
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: 'white', color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Wand2 size={14} /> AI Assist
                 </button>
                 <button onClick={() => setActiveSidePanel(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
              </div>
            </div>

            {/* Tabs Header */}
            <div style={{ display: 'flex', padding: '0 32px', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
              {['Overview', 'Forms', 'Issues'].map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActivePanelTab(tab as any)}
                   style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: activePanelTab === tab ? 700 : 600, color: activePanelTab === tab ? '#4f46e5' : '#64748b', background: 'transparent', border: 'none', borderBottom: activePanelTab === tab ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer' }}
                 >{tab}</button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc' }}>
               
               {activePanelTab === 'Overview' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, alignItems: 'center' }}>
                       <span style={{ color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ 5d ago</span>
                       <span>1 connection</span>
                       <span>1/1 mapping</span>
                    </div>

                    <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                       <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>NEXT ACTION</div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>All setup looks good</h3>
                            <button style={{ background: 'transparent', border: 'none', padding: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              ▶ Show technical detail
                            </button>
                          </div>
                          <button onClick={() => alert('Opening mapping editor...')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Open mapping editor ›
                          </button>
                       </div>
                    </div>

                    <div style={{ background: '#f1f5f9', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '20px 24px', fontSize: '0.9rem', color: '#475569', fontWeight: 600, display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                       <span style={{ color: '#94a3b8' }}>MORE:</span>
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>View events</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Configure mapping</a> · 
                       <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Manage manually</a>
                    </div>
                 </div>
               )}

               {activePanelTab === 'Forms' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Configure API Connection</h3>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                         Use this endpoint to post JSON payloads to SalesMax to automatically generate new Leads.
                       </p>
                       
                       <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>API ENDPOINT</div>
                          <div style={{ fontSize: '0.9rem', color: '#0369a1', background: '#e0f2fe', padding: '8px', borderRadius: '6px', fontFamily: 'monospace', marginBottom: '20px' }}>POST https://api.fortivex.ai/v1/leads/capture</div>
                          
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>HOW IT WORKS</div>
                          <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.8 }}>
                            <li>Generate an API Key for authentication.</li>
                            <li>Send a test payload to the endpoint.</li>
                            <li>Map the incoming JSON fields to your CRM Lead properties.</li>
                          </ol>
                       </div>

                       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Generate New API Key</button>
                       </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                         <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>1 Connection</h3>
                         </div>
                      </div>

                      <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
                         <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                     <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Primary API Connection</div>
                                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Active · 1/1 mapped · Last lead 5d ago</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                     <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Connected
                                     </span>
                                     <span style={{ color: '#94a3b8', fontWeight: 700, cursor: 'pointer' }}>•••</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>
               )}

               {activePanelTab === 'Issues' && (
                 <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>0 issues</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Everything is working properly.</div>

                    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                       No API connection issues detected.
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
      {/* ── UNIFIED SIDE PANEL ── */}
      {activeSidePanel && activeSidePanel !== 'web_contact_form' && activeSidePanel !== 'leads_api' && (() => {
        const i = integrations.find(intg => intg.id === activeSidePanel);
        if (!i) return null;
        
        const isConnected = i.connected || i.status === 'Healthy';
        const tabs = ['Overview', 'Sources'];
        
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
            {/* Backdrop */}
            <div onClick={() => setActiveSidePanel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} />
            
            {/* Panel */}
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '700px', maxWidth: '100%', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Header */}
              <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {i.icon ? (
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i.icon}</div>
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}>{i.name.charAt(0)}</div>
                  )}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{i.name}</h2>
                  {isConnected ? (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Connected
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }} /> Not connected
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                   <button onClick={() => setActiveSidePanel(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
                </div>
              </div>

              {/* Tabs Header */}
              <div style={{ display: 'flex', padding: '0 32px', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
                {tabs.map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setActivePanelTab(tab as any)}
                     style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: activePanelTab === tab ? 700 : 600, color: activePanelTab === tab ? '#4f46e5' : '#64748b', background: 'transparent', border: 'none', borderBottom: activePanelTab === tab ? '2px solid #4f46e5' : '2px solid transparent', cursor: 'pointer' }}
                   >{tab}</button>
                ))}
              </div>

              {/* Tab Content Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                 
                 {activePanelTab === 'Overview' && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                      {isConnected ? (
                        <>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, alignItems: 'center' }}>
                             <span style={{ color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ Just now</span>
                             <span>1 connection</span>
                          </div>
                          <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>STATUS</div>
                             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Connected and active</h3>
                          </div>
                        </>
                      ) : (
                        <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>NEXT ACTION</div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Connect</h3>
                              </div>
                              <button onClick={() => setActivePanelTab('Sources')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Connect ›
                              </button>
                           </div>
                        </div>
                      )}

                      <div style={{ background: '#f1f5f9', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '20px 24px', fontSize: '0.9rem', color: '#475569', fontWeight: 600, display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                         <span style={{ color: '#94a3b8' }}>MORE:</span>
                         <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setActivePanelTab('Sources')}>Connect</span> · 
                         <span style={{ color: '#475569', cursor: 'pointer' }}>Manage manually</span>
                      </div>
                   </div>
                 )}
                 
                 {activePanelTab === 'Sources' && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                     {isConnected ? (
                       <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>1 source</h3>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                           <div>
                             <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Primary Connection</div>
                             <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Active · Connected successfully</div>
                           </div>
                           <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: '16px' }}>Connected</span>
                         </div>
                       </div>
                     ) : (
                       <div style={{ background: 'white', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '24px' }}>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Connect your {i.name} account</h3>
                         <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
                           Provide the required configuration details to enable integration with SalesMax.
                         </p>
                         
                         <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                           <div style={{ fontWeight: 700, color: '#64748b', marginBottom: '8px', fontSize: '0.75rem', letterSpacing: '0.5px' }}>HOW IT WORKS</div>
                           <ol style={{ margin: 0, paddingLeft: '20px' }}>
                             <li>Sign in to your {i.name} account.</li>
                             <li>Find the required credentials in your settings.</li>
                             <li>Paste them below and click Connect.</li>
                           </ol>
                         </div>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                           {/* Dynamic Fields based on integration ID */}
                           {['whatsapp_cloud_api'].includes(i.id) ? (
                             <>
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                 <div>
                                   <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Meta Business Account ID</label>
                                   <input value={setupFields['wa_meta'] || ''} onChange={e => setSetupFields({...setupFields, wa_meta: e.target.value})} placeholder="e.g. 10482930291" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                                 </div>
                                 <div>
                                   <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>WABA ID</label>
                                   <input value={setupFields['wa_waba'] || ''} onChange={e => setSetupFields({...setupFields, wa_waba: e.target.value})} placeholder="WhatsApp Business Account ID" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                                 </div>
                               </div>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Permanent Access Token</label>
                                 <input type="password" value={setupFields['wa_token'] || ''} onChange={e => setSetupFields({...setupFields, wa_token: e.target.value})} placeholder="EAAG... token" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                             </>
                           ) : ['google_meet', 'google_drive', 'google_forms', 'google_sheets', 'google_ads_lead', 'gmail'].includes(i.id) ? (
                             <>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Google Account</label>
                                 <button style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', background: '#fff', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                                   Sign in with Google
                                 </button>
                               </div>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Integration Name</label>
                                 <input value={setupFields['name'] || ''} onChange={e => setSetupFields({...setupFields, name: e.target.value})} placeholder="e.g. My Google Account" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                             </>
                           ) : ['openai', 'cashfree', 'razorpay', 'exotel', 'knowlarity'].includes(i.id) ? (
                             <>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Account ID / Merchant ID</label>
                                 <input value={setupFields['acc_id'] || ''} onChange={e => setSetupFields({...setupFields, acc_id: e.target.value})} placeholder="Enter ID" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Secret API Key</label>
                                 <input type="password" value={setupFields['api_key'] || ''} onChange={e => setSetupFields({...setupFields, api_key: e.target.value})} placeholder="Secret Key" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                             </>
                           ) : (
                             <>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Brand Name</label>
                                 <input value={setupFields['brand'] || ''} onChange={e => setSetupFields({...setupFields, brand: e.target.value})} placeholder="Enter brand name to identify this integration" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>{i.name} Username</label>
                                 <input value={setupFields['user'] || ''} onChange={e => setSetupFields({...setupFields, user: e.target.value})} placeholder={`Add your ${i.name} username`} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                               <div>
                                 <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>{i.name} API Key</label>
                                 <input type="password" value={setupFields['apikey'] || ''} onChange={e => setSetupFields({...setupFields, apikey: e.target.value})} placeholder={`Add your ${i.name} API key`} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                               </div>
                             </>
                           )}
                           
                           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                             <button onClick={() => handleConnect(i.id)} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                               Connect {i.name}
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
