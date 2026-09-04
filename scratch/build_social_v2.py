import os

FILE_PATH = "/Users/pavan.s.h/Desktop/crm fullstack development/src/app/social/page.tsx"

CONTENT = """'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, Users, Eye, ThumbsUp, MessageCircle, Link, Target, 
  BarChart2, FileText, Download, Calendar, Activity, Edit, Copy, 
  Trash2, Plus, Clock, ExternalLink, Image as ImageIcon, Send,
  TrendingUp, MousePointer, Hash, PlayCircle, Zap, Video
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';

// --- MOCK DATA ---
const generateSocialData = () => {
  const data = [];
  const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)', 'YouTube', 'WhatsApp Business'];
  const platformColors = ['#1877F2', '#E4405F', '#0A66C2', '#000000', '#FF0000', '#25D366'];
  const captions = [
    'Check out our latest AI CRM features! 🚀',
    'Boost your sales team productivity by 50% 📈',
    'Join our webinar this Friday to learn more.',
    'Customer success story: How Company X scaled.',
    'New integration with leading platforms is live!',
    '5 tips to improve your conversion rate today.',
    'Happy Monday! Start your week strong 💪'
  ];
  const statuses = ['Published', 'Scheduled', 'Draft', 'Archived'];
  const campaigns = ['Q3 Product Launch', 'Webinar Promo', 'Organic Growth', 'Partner Program', 'Customer Spotlight'];
  
  for (let i = 0; i < 50; i++) {
    const platIdx = Math.floor(Math.random() * platforms.length);
    const reach = Math.floor(Math.random() * 25000) + 1000;
    const impressions = Math.floor(reach * (Math.random() * 0.4 + 1.1));
    const likes = Math.floor(reach * (Math.random() * 0.1 + 0.01));
    const comments = Math.floor(likes * (Math.random() * 0.2));
    const shares = Math.floor(likes * (Math.random() * 0.1));
    const saves = Math.floor(likes * (Math.random() * 0.05));
    const clicks = Math.floor(reach * (Math.random() * 0.08));
    const leads = Math.floor(clicks * (Math.random() * 0.15));
    
    // Dates
    const publish = new Date(2026, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1);

    data.push({
      id: `POST-${5000 + i}`,
      platform: platforms[platIdx],
      color: platformColors[platIdx],
      caption: captions[Math.floor(Math.random() * captions.length)],
      campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      publishDate: publish.toISOString().split('T')[0],
      reach,
      impressions,
      likes,
      comments,
      shares,
      saves,
      clicks,
      leads,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  return data.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
};

const generateLeadsData = () => {
  const d = [];
  const names = ['Neha Gupta', 'Rohan Verma', 'Priya Singh', 'Kabir Das', 'Arjun N'];
  const platforms = ['LinkedIn', 'Facebook', 'Instagram'];
  for(let i=0; i<20; i++) {
    d.push({
      id: `L-${200+i}`, name: names[i%names.length], platform: platforms[i%platforms.length], campaign: 'Q3 Product Launch', program: 'Enterprise CRM', status: 'Contacted', counselor: 'Amit Patel'
    });
  }
  return d;
};

const INITIAL_DATA = generateSocialData();
const MOCK_LEADS = generateLeadsData();

const CONNECTED_ACCOUNTS = [
  { platform: 'Facebook', account: 'Fortivex AI Official', followers: '45.2K', engagement: '4.8%', lastPost: '2 hours ago', status: 'Connected', color: '#1877F2' },
  { platform: 'Instagram', account: '@fortivex.ai', followers: '82.5K', engagement: '6.2%', lastPost: '5 hours ago', status: 'Connected', color: '#E4405F' },
  { platform: 'LinkedIn', account: 'Fortivex.AI', followers: '112K', engagement: '3.9%', lastPost: '1 day ago', status: 'Connected', color: '#0A66C2' },
  { platform: 'X (Twitter)', account: '@FortivexAI', followers: '28.4K', engagement: '2.1%', lastPost: '3 hours ago', status: 'Connected', color: '#000000' },
  { platform: 'YouTube', account: 'Fortivex CRM', followers: '15.6K', engagement: '8.5%', lastPost: '1 week ago', status: 'Connected', color: '#FF0000' },
  { platform: 'WhatsApp Business', account: '+91 9876543210', followers: '12K Opt-ins', engagement: '45%', lastPost: 'Today', status: 'Connected', color: '#25D366' },
];

const TREND_DATA = [
  { name: 'Jan', facebook: 4000, instagram: 6000, linkedin: 3000, reach: 120000 },
  { name: 'Feb', facebook: 4500, instagram: 6500, linkedin: 3500, reach: 135000 },
  { name: 'Mar', facebook: 4800, instagram: 7200, linkedin: 4000, reach: 150000 },
  { name: 'Apr', facebook: 5200, instagram: 7800, linkedin: 4500, reach: 165000 },
  { name: 'May', facebook: 5800, instagram: 8500, linkedin: 5000, reach: 180000 },
  { name: 'Jun', facebook: 6500, instagram: 9200, linkedin: 5800, reach: 210000 },
];
const COLORS = ['#1877F2', '#E4405F', '#0A66C2', '#000000', '#FF0000', '#25D366'];

// --- GLOBAL TOAST ---
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors: Record<string, string> = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${colors[type]};color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

const simulateDownload = (filename: string) => {
  const blob = new Blob([`Fortivex.AI CRM\n${filename}\nGenerated: ${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

export default function SocialMediaPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState(INITIAL_DATA);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modals
  const [viewPostModal, setViewPostModal] = useState<any>(null);
  const [editPostModal, setEditPostModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // KPIs
  const totalFollowers = "283.7K"; 
  const totalReach = data.reduce((sum, d) => sum + d.reach, 0);
  const totalEngagement = data.reduce((sum, d) => sum + d.likes + d.comments + d.shares + d.saves, 0);
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const postsPublished = data.filter(d => d.status === 'Published').length;
  const postsScheduled = data.filter(d => d.status === 'Scheduled').length;
  const engagementRate = totalReach ? ((totalEngagement / totalReach) * 100).toFixed(1) : 0;

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Scheduled', 'Draft', 'Archived'] },
    { key: 'platform', label: 'Platform', type: 'select', options: ['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)', 'YouTube', 'WhatsApp Business'] },
  ];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDuplicate = (post: any) => {
    const copy = { ...post, id: `POST-${Date.now().toString().slice(-4)}`, status: 'Draft' };
    setData([copy, ...data]);
    setFilteredData([copy, ...data]);
    showToast('Post duplicated successfully.');
  };

  const getActionMenu = (post: any) => (
    <ActionMenu items={[
      { label: 'View Post', icon: <Eye size={16}/>, onClick: () => setViewPostModal(post) },
      { label: 'Edit Post', icon: <Edit size={16}/>, onClick: () => setEditPostModal(post) },
      { label: 'Duplicate Post', icon: <Copy size={16}/>, onClick: () => handleDuplicate(post) },
      { divider: true, label: '' },
      { label: 'Schedule Post', icon: <Calendar size={16}/>, onClick: () => showToast('Opened scheduler.') },
      { label: 'Publish Now', icon: <Send size={16}/>, onClick: () => {
        const updated = { ...post, status: 'Published', publishDate: new Date().toISOString().split('T')[0] };
        setData(prev => prev.map(d => d.id === post.id ? updated : d));
        setFilteredData(prev => prev.map(d => d.id === post.id ? updated : d));
        showToast('Post published immediately.');
      }},
      { label: 'Archive', icon: <Trash2 size={16}/>, onClick: () => {
        const updated = { ...post, status: 'Archived' };
        setData(prev => prev.map(d => d.id === post.id ? updated : d));
        setFilteredData(prev => prev.map(d => d.id === post.id ? updated : d));
        showToast('Post archived.');
      }},
      { divider: true, label: '' },
      { label: 'View Analytics', icon: <BarChart2 size={16}/>, onClick: () => setViewPostModal(post) },
      { label: 'Download PDF Report', icon: <Download size={16}/>, onClick: () => simulateDownload(`Post_Report_${post.id}.pdf`) },
      { label: 'Export Excel', icon: <Download size={16}/>, onClick: () => simulateDownload(`Post_Report_${post.id}.xlsx`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => window.print() },
      { divider: true, label: '' },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(post.id) }
    ]} />
  );

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const platform = fd.get('platform') as string;
    const pIdx = ['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)', 'YouTube', 'WhatsApp Business'].indexOf(platform);
    
    const newPost = {
      id: `POST-${Date.now().toString().slice(-4)}`,
      platform,
      color: ['#1877F2', '#E4405F', '#0A66C2', '#000000', '#FF0000', '#25D366'][pIdx >= 0 ? pIdx : 0],
      caption: fd.get('caption') as string,
      campaign: fd.get('campaign') as string,
      publishDate: action === 'Published' ? new Date().toISOString().split('T')[0] : (fd.get('scheduledDate') as string || new Date().toISOString().split('T')[0]),
      reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, leads: 0,
      status: action
    };
    setData([newPost, ...data]);
    setFilteredData([newPost, ...data]);
    setIsCreateModalOpen(false);
    showToast(`Post ${action.toLowerCase()} successfully.`);
  };

  const renderKpiModalContent = () => {
    if (activeKpiModal === 'Published Posts' || activeKpiModal === 'Scheduled Posts') {
      const filterStatus = activeKpiModal.split(' ')[0]; // 'Published' or 'Scheduled'
      const listData = data.filter(d => d.status === filterStatus);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {listData.map(post => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', borderLeft: `4px solid ${post.color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{post.platform} <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-primary)', marginLeft: '8px' }}>{post.id}</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{post.caption}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setViewPostModal(post)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 600 }}>View</button>
                {post.status === 'Published' && <button onClick={() => showToast('Post Boost Initiated.')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Boost</button>}
                {post.status === 'Scheduled' && <button onClick={() => setEditPostModal(post)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>}
                {post.status === 'Scheduled' && <button onClick={() => {
                  const updated = { ...post, status: 'Published' };
                  setData(prev => prev.map(d => d.id === post.id ? updated : d));
                  setFilteredData(prev => prev.map(d => d.id === post.id ? updated : d));
                  setActiveKpiModal(null);
                  showToast('Post published immediately.');
                }} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#10b981', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Publish Now</button>}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (activeKpiModal === 'Total Followers') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {CONNECTED_ACCOUNTS.map((acc, i) => (
               <div key={i} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: `4px solid ${acc.color}` }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.platform}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{acc.followers}</div>
                 <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>+1.2% this week</div>
               </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Audience Growth</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#E4405F" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#0A66C2" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (activeKpiModal === 'Leads Generated') {
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <th style={{ padding: '12px' }}>Lead Name</th><th style={{ padding: '12px' }}>Platform</th><th style={{ padding: '12px' }}>Campaign</th><th style={{ padding: '12px' }}>Status</th>
          </tr></thead>
          <tbody>
            {MOCK_LEADS.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{l.name}</td>
                <td style={{ padding: '12px' }}><span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}>{l.platform}</span></td>
                <td style={{ padding: '12px' }}><div style={{ fontSize: '0.85rem' }}>{l.campaign}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{l.program}</div></td>
                <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#d1fae5', color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeKpiModal === 'Total Reach' || activeKpiModal === 'Total Engagement') {
      const isEngagement = activeKpiModal === 'Total Engagement';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {isEngagement ? [
              { l: 'Total Likes', v: data.reduce((s, d) => s + d.likes, 0) },
              { l: 'Total Comments', v: data.reduce((s, d) => s + d.comments, 0) },
              { l: 'Total Shares', v: data.reduce((s, d) => s + d.shares, 0) },
              { l: 'Total Saves', v: data.reduce((s, d) => s + d.saves, 0) },
            ].map(k => (
              <div key={k.l} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.l}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{k.v.toLocaleString()}</div>
              </div>
            )) : [
              { l: 'Daily Reach', v: Math.floor(totalReach / 30) },
              { l: 'Weekly Reach', v: Math.floor(totalReach / 4) },
              { l: 'Monthly Reach', v: totalReach },
              { l: 'Avg per Post', v: Math.floor(totalReach / data.length) },
            ].map(k => (
              <div key={k.l} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.l}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{k.v.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>{isEngagement ? 'Engagement Trend' : 'Reach Trend'}</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey={isEngagement ? "facebook" : "reach"} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    if (activeKpiModal === 'Total Clicks') {
      return (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { l: 'Link Clicks', v: totalClicks },
              { l: 'Website Visits', v: Math.floor(totalClicks * 0.8) },
              { l: 'Landing Page', v: Math.floor(totalClicks * 0.6) },
              { l: 'CTR (Click-Through)', v: totalReach ? ((totalClicks / totalReach)*100).toFixed(2) + '%' : '0%' },
            ].map(k => (
              <div key={k.l} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.l}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{typeof k.v === 'number' ? k.v.toLocaleString() : k.v}</div>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Click Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{name: 'Facebook', value: 45}, {name: 'Instagram', value: 25}, {name: 'LinkedIn', value: 20}, {name: 'Twitter', value: 10}]} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (activeKpiModal === 'Engagement Rate') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 100%)' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Overall Engagement Rate</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ec4899' }}>{engagementRate}%</div>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '300px' }}>
              <h4 style={{ margin: '0 0 16px' }}>Platform Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'FB', rate: 4.8 }, { name: 'IG', rate: 6.2 }, { name: 'LI', rate: 3.9 }, { name: 'X', rate: 2.1 }, { name: 'YT', rate: 8.5 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="rate" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Social Media Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage posts, analyze engagement, and track leads across platforms.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsCalendarOpen(true)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Calendar size={18} /> View Calendar
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Plus size={18} /> Create Post
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Followers', val: totalFollowers, icon: <Users size={20}/>, color: '#3b82f6' },
          { label: 'Total Reach', val: totalReach.toLocaleString(), icon: <Eye size={20}/>, color: '#10b981' },
          { label: 'Total Engagement', val: totalEngagement.toLocaleString(), icon: <ThumbsUp size={20}/>, color: '#8b5cf6' },
          { label: 'Total Clicks', val: totalClicks.toLocaleString(), icon: <MousePointer size={20}/>, color: '#f59e0b' },
          { label: 'Leads Generated', val: totalLeads, icon: <Target size={20}/>, color: '#0ea5e9' },
          { label: 'Published Posts', val: postsPublished, icon: <FileText size={20}/>, color: '#10b981' },
          { label: 'Scheduled Posts', val: postsScheduled, icon: <Calendar size={20}/>, color: '#f59e0b' },
          { label: 'Engagement Rate', val: `${engagementRate}%`, icon: <Activity size={20}/>, color: '#ec4899' },
        ].map((k, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setActiveKpiModal(k.label)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer', transition: 'background 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{k.label}</div>
              <div style={{ color: k.color, background: `${k.color}15`, padding: '6px', borderRadius: '8px' }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{k.val}</div>
          </motion.div>
        ))}
      </div>

      {/* DATA TABLE */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={d => { setFilteredData(d); setPage(1); }} 
          searchKeys={['caption', 'id', 'platform', 'campaign']}
          searchPlaceholder="Search posts..."
          exportFilename="Social_Media_Report"
          filterOptions={filterOptions}
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Post / Platform</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Caption & Campaign</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Reach & Eng</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Clicks & Leads</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Publish Date</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-bg">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 'bold' }}>{post.platform}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{post.id}</div>
                  </td>
                  <td style={{ padding: '16px 12px', maxWidth: '250px' }}>
                    <div style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.caption}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{post.campaign}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>Reach: <strong>{post.reach.toLocaleString()}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Likes: {post.likes} | Comments: {post.comments}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{post.clicks} Clicks</div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{post.leads} Leads</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(post.publishDate).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, 
                      background: post.status === 'Published' ? '#d1fae5' : post.status === 'Draft' ? '#fef3c7' : post.status === 'Archived' ? '#f3f4f6' : '#e0f2fe', 
                      color: post.status === 'Published' ? '#059669' : post.status === 'Draft' ? '#d97706' : post.status === 'Archived' ? '#4b5563' : '#0284c7' }}>
                      {post.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {getActionMenu(post)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* KPI MODAL */}
      <SlidePanel isOpen={!!activeKpiModal} onClose={() => setActiveKpiModal(null)} title={activeKpiModal || ''} subtitle="Detailed Analytics" icon={<BarChart2 />} width="700px">
        {renderKpiModalContent()}
      </SlidePanel>

      {/* CREATE NEW POST MODAL */}
      <SlidePanel isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Social Media Post" subtitle="Draft, schedule or publish content" icon={<Share2 />} width="600px">
        <form onSubmit={e => handleCreatePost(e, 'Published')} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Post Title (Internal)</label>
              <input name="title" required placeholder="e.g. Q3 Launch Announcement" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Caption</label>
              <textarea name="caption" required rows={4} placeholder="Write your post content here..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)', resize: 'none' }}></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Platform</label>
                <select name="platform" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)', 'YouTube', 'WhatsApp Business'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Post Type</label>
                <select name="postType" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  {['Image', 'Video', 'Carousel', 'Story', 'Reel', 'Poll', 'Text Post'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campaign Link</label>
                <select name="campaign" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }}>
                  <option value="None">None</option>
                  <option value="Q3 Product Launch">Q3 Product Launch</option>
                  <option value="Webinar Promo">Webinar Promo</option>
                  <option value="Organic Growth">Organic Growth</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Call to Action (CTA)</label>
                <input name="cta" placeholder="e.g. Sign up today!" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scheduled Date</label>
                <input type="date" name="scheduledDate" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scheduled Time</label>
                <input type="time" name="scheduledTime" defaultValue="10:00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hashtags</label>
              <input name="hashtags" placeholder="#FortivexAI #CRM #Growth" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', background: 'var(--bg-secondary)' }} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
               <div style={{ flex: 1, padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <ImageIcon size={24} style={{ margin: '0 auto 8px' }}/> Upload Image
               </div>
               <div style={{ flex: 1, padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <Video size={24} style={{ margin: '0 auto 8px' }}/> Upload Video
               </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
            <div style={{ flex: 1 }}></div>
            <button type="button" onClick={(e) => handleCreatePost(e as any, 'Draft')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontWeight: 600 }}>Save Draft</button>
            <button type="button" onClick={(e) => handleCreatePost(e as any, 'Scheduled')} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', fontWeight: 600 }}>Schedule Post</button>
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Publish Now</button>
          </div>
        </form>
      </SlidePanel>

      {/* VIEW POST MODAL */}
      <SlidePanel isOpen={!!viewPostModal} onClose={() => setViewPostModal(null)} title="Post Analytics Dashboard" subtitle={viewPostModal?.id} icon={<BarChart2 />} width="600px">
        {viewPostModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* POST PREVIEW */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: viewPostModal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Share2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{viewPostModal.platform}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(viewPostModal.publishDate).toLocaleString()}</div>
                </div>
                <span style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, background: viewPostModal.status === 'Published' ? '#d1fae5' : viewPostModal.status === 'Draft' ? '#fef3c7' : viewPostModal.status === 'Archived' ? '#f3f4f6' : '#e0f2fe', color: viewPostModal.status === 'Published' ? '#059669' : viewPostModal.status === 'Draft' ? '#d97706' : viewPostModal.status === 'Archived' ? '#4b5563' : '#0284c7' }}>
                  {viewPostModal.status}
                </span>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>{viewPostModal.caption}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>Campaign: {viewPostModal.campaign}</div>
              <div style={{ height: '200px', background: 'var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <ImageIcon size={48} />
                <span style={{ marginLeft: '12px' }}>Image Preview Unavailable</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={16}/> Total Reach</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{viewPostModal.reach.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{viewPostModal.impressions.toLocaleString()} Impressions</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderTop: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Link size={16}/> Total Clicks</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{viewPostModal.clicks.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{viewPostModal.reach ? ((viewPostModal.clicks / viewPostModal.reach)*100).toFixed(1) : 0}% CTR</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Likes</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsUp size={14} color="#ef4444"/> {viewPostModal.likes}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Comments</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} color="#3b82f6"/> {viewPostModal.comments}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Shares</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Share2 size={14} color="#10b981"/> {viewPostModal.shares}</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Saves</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckSquare size={14} color="#8b5cf6"/> {viewPostModal.saves}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lead Conversions</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{viewPostModal.leads}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Engagement Rate</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewPostModal.reach ? (((viewPostModal.likes + viewPostModal.comments + viewPostModal.shares + viewPostModal.saves) / viewPostModal.reach)*100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0' }}>Activity Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
                {[
                  { title: 'Post achieved 1k reach milestone', time: '1 hour ago', icon: <Zap size={12}/>, color: '#f59e0b' },
                  { title: 'Post Published', time: new Date(viewPostModal.publishDate).toLocaleDateString(), icon: <Send size={12}/>, color: '#10b981' },
                  { title: 'Post Scheduled', time: new Date(viewPostModal.publishDate).toLocaleDateString(), icon: <Clock size={12}/>, color: '#3b82f6' },
                ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-primary)', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color }}>
                      {act.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{act.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => simulateDownload(`Post_Analytics_${viewPostModal.id}.pdf`)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18}/> Download PDF Report</button>
              <button onClick={() => setViewPostModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Close Dashboard</button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* EDIT POST MODAL */}
      {editPostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Post</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editPostModal.id} on {editPostModal.platform}</p>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const updated = {
                ...editPostModal,
                caption: fd.get('caption'),
                status: fd.get('status')
              };
              setData(prev => prev.map(d => d.id === editPostModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === editPostModal.id ? updated : d));
              setEditPostModal(null);
              showToast('Post updated successfully.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Caption</label>
                  <textarea name="caption" defaultValue={editPostModal.caption} required rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }} />
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select name="status" defaultValue={editPostModal.status} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {['Published', 'Scheduled', 'Draft', 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setEditPostModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW MODAL */}
      <SlidePanel isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} title="Social Media Content Calendar" subtitle="Monthly View" icon={<Calendar />} width="800px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
             {/* Mock Calendar Grid for Aug 2026 */}
             {Array.from({length: 31}).map((_, i) => {
               const day = i + 1;
               const hasPost = data.find(d => new Date(d.publishDate).getDate() === day);
               return (
                 <div key={i} className="glass-panel" style={{ height: '80px', padding: '8px', borderRadius: '8px', border: hasPost ? `2px solid ${hasPost.color}` : '1px solid var(--border-color)' }}>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600, color: hasPost ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{day}</div>
                   {hasPost && <div style={{ fontSize: '0.7rem', color: 'white', background: hasPost.color, padding: '2px 4px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hasPost.platform}</div>}
                 </div>
               )
             })}
           </div>
        </div>
      </SlidePanel>

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Post?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure? This action cannot be undone and will delete associated analytics.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setData(prev => prev.filter(d => d.id !== deleteModal));
                setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
                setDeleteModal(null);
                showToast('Post deleted successfully.', 'error');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg:hover { background: var(--bg-tertiary) !important; }
      `}} />
    </div>
  );
}
"""

os.makedirs(os.path.dirname(FILE_PATH), exist_ok=True)
with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(CONTENT)
print("File written successfully.")
