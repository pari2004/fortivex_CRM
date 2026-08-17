'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserPlus, Phone, Calendar, 
  MessageSquare, FileText, Settings, BarChart2, Briefcase, 
  Target, GraduationCap, CheckCircle, PieChart, ShieldCheck, User, FolderOpen, Megaphone, Share2, MailWarning, MessageCircle, CheckSquare,
  Search, ChevronDown, ChevronRight, LogOut, Bell
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuth, Role } from '@/contexts/AuthContext';

type NavItem = {
  name: string;
  href?: string;
  icon: any;
  external?: boolean;
  badge?: string | number;
  subItems?: { name: string; href: string }[];
};

type NavGroup = {
  name: string;
  items: NavItem[];
};

const navMenus: Record<Role, NavGroup[]> = {
  admin: [
    {
      name: '',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Leads', href: '/leads', icon: Users },
        { name: 'Pipeline', href: '/pipeline', icon: BarChart2 },
        { name: 'Applications', href: '/applications', icon: Briefcase },
        { name: 'Students', icon: GraduationCap, subItems: [
          { name: 'All Students', href: '/students' },
          { name: 'Student Admissions', href: '/students/admissions' },
          { name: 'Batch Allocation', href: '/students/batch-allocation' },
          { name: 'Attendance', href: '/students/attendance' },
          { name: 'Assignments (Inactive)', href: '/students/assignments' },
          { name: 'Assessments (Inactive)', href: '/students/assessments' },
          { name: 'Internship', href: '/students/internship' },
          { name: 'Certificates', href: '/students/certificates' },
          { name: 'Placement Tracking', href: '/students/placement' },
          { name: 'Alumni', href: '/students/alumni' }
        ] },
        { name: 'Tasks', icon: CheckSquare, subItems: [
          { name: 'My Reminders', href: '/tasks/my-tasks' },
          { name: 'Assigned Tasks', href: '/tasks/assigned' },
          { name: 'Pending Tasks', href: '/tasks/pending' },
          { name: 'Completed Tasks', href: '/tasks/completed' },
          { name: 'Overdue Tasks', href: '/tasks/overdue' },
          { name: 'Team Tasks', href: '/tasks/team' },
          { name: 'Calendar View', href: '/tasks/calendar' }
        ] },
        { name: 'Calendar', href: 'https://calendar.google.com/', icon: Calendar, external: true },
        { name: 'Calls', href: '/calls', icon: Phone },
        { name: 'Join Fortivex.AI CRM WhatsApp Community', href: 'https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', icon: MessageCircle, external: true },
        { name: 'Email', href: 'https://mail.google.com/', icon: MailWarning, external: true },
        { name: 'Documents', href: '/documents', icon: FolderOpen },
        { name: 'Payments', href: '/payments', icon: PieChart },
        { name: 'Reports & Analytics', icon: FileText, subItems: [
          { name: 'Dashboard Analytics', href: '/analytics' },
          { name: 'Lead Reports', href: '/reports/lead' },
          { name: 'Admission Reports', href: '/reports/admission' },
          { name: 'Student Reports', href: '/reports/student' },
          { name: 'Payment Reports', href: '/reports/payment' },
          { name: 'Attendance Reports', href: '/reports/attendance' },
          { name: 'Trainer Reports', href: '/reports/trainer' },
          { name: 'Placement Reports', href: '/reports/placement' },
          { name: 'Revenue Reports', href: '/reports/revenue' },
          { name: 'Custom Reports', href: '/reports/custom' }
        ] },
        { name: 'Users', href: '/users', icon: UserPlus },
        { name: 'Roles & Permissions', href: '/roles', icon: ShieldCheck },
        { name: 'Automation', href: '/automation', icon: Settings },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help Center', href: '/help', icon: ShieldCheck },
      ]
    }
  ],
  counselor: [
    {
      name: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      name: 'CRM',
      items: [
        { name: 'My Leads', href: '/leads', icon: Users, badge: 45 },
        { name: 'Follow-ups', href: '/follow-ups', icon: Phone, badge: 12 },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Admissions', href: '/admissions', icon: CheckCircle, badge: 5 },
      ]
    }
  ],
  manager: [
    {
      name: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Reports & Analytics', icon: FileText, subItems: [
          { name: 'Dashboard Analytics', href: '/analytics' },
          { name: 'Lead Reports', href: '/reports/lead' },
          { name: 'Admission Reports', href: '/reports/admission' },
          { name: 'Student Reports', href: '/reports/student' },
          { name: 'Payment Reports', href: '/reports/payment' },
          { name: 'Attendance Reports', href: '/reports/attendance' },
          { name: 'Trainer Reports', href: '/reports/trainer' },
          { name: 'Placement Reports', href: '/reports/placement' },
          { name: 'Revenue Reports', href: '/reports/revenue' },
          { name: 'Custom Reports', href: '/reports/custom' }
        ] },
      ]
    },
    {
      name: 'CRM',
      items: [
        { name: 'Team Performance', href: '/team', icon: Users },
        { name: 'Pipeline', href: '/pipeline', icon: BarChart2 },
        { name: 'Targets', href: '/targets', icon: Target },
      ]
    }
  ],
  marketing: [
    {
      name: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Reports & Analytics', icon: FileText, subItems: [
          { name: 'Dashboard Analytics', href: '/analytics' },
          { name: 'Lead Reports', href: '/reports/lead' },
          { name: 'Admission Reports', href: '/reports/admission' },
          { name: 'Student Reports', href: '/reports/student' },
          { name: 'Payment Reports', href: '/reports/payment' },
          { name: 'Attendance Reports', href: '/reports/attendance' },
          { name: 'Trainer Reports', href: '/reports/trainer' },
          { name: 'Placement Reports', href: '/reports/placement' },
          { name: 'Revenue Reports', href: '/reports/revenue' },
          { name: 'Custom Reports', href: '/reports/custom' }
        ] },
      ]
    },
    {
      name: 'MARKETING',
      items: [
        { name: 'Campaigns', href: '/campaigns', icon: Megaphone, badge: 3 },
        { name: 'Social Media', href: '/social', icon: Share2 },
        { name: 'Email Campaigns', href: 'https://mail.google.com/', icon: MailWarning, external: true },
        { name: 'Join Fortivex.AI CRM WhatsApp Community', href: 'https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', icon: MessageCircle, external: true },
      ]
    },
    {
      name: 'CRM',
      items: [
        { name: 'Calendar', href: 'https://calendar.google.com/', icon: Calendar, external: true },
      ]
    },
    {
      name: 'SYSTEM',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ],
  member: [
    {
      name: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Announcements', href: '/announcements', icon: Megaphone },
      ]
    },
    {
      name: 'CRM',
      items: [
        { name: 'Leads', href: '/member-leads', icon: Target },
        { name: 'Tasks', icon: CheckSquare, badge: 8, subItems: [
          { name: 'My Reminders', href: '/tasks/my-tasks' },
          { name: 'Assigned Tasks', href: '/tasks/assigned' },
          { name: 'Pending Tasks', href: '/tasks/pending' },
          { name: 'Completed Tasks', href: '/tasks/completed' },
          { name: 'Overdue Tasks', href: '/tasks/overdue' },
          { name: 'Team Tasks', href: '/tasks/team' },
          { name: 'Calendar View', href: '/tasks/calendar' }
        ] },
        { name: 'My Schedule', href: '/schedule', icon: Calendar },
        { name: 'Calendar', href: 'https://calendar.google.com/', icon: Calendar, external: true },
        { name: 'Documents', href: '/documents', icon: FolderOpen },
      ]
    },
    {
      name: 'SYSTEM',
      items: [
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help & Support', href: '/help', icon: ShieldCheck },
      ]
    }
  ]
};

export function Sidebar() {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();
  const activeGroups = navMenus[role] || [];
  
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleMenu = (e: React.MouseEvent, menuName: string) => {
    e.preventDefault();
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        width: '300px',
        minWidth: '300px',
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        margin: '16px 0 16px 16px',
        height: 'calc(100vh - 32px)'
      }}
    >
      {/* Header / Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <Logo size={68} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '10px', letterSpacing: '-0.5px' }}>
          FORTIVEX.<span style={{ background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span> CRM
        </h2>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          <Search size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Search menu..." 
          style={{
            width: '100%',
            height: '42px',
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            paddingLeft: '40px',
            fontSize: '0.9rem',
            color: '#0f172a',
            outline: 'none',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)'; e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
        />
      </div>

      {/* Navigation */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: '8px', 
        marginRight: '-8px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0,0,0,0.1) transparent'
      }}>
        {activeGroups.map((group, gIndex) => (
          <div key={group.name} style={{ marginBottom: '20px' }}>
            {group.name && (<div 
              onClick={() => toggleGroup(group.name)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0 8px', 
                marginBottom: '8px', 
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {group.name}
              </span>
              <motion.div animate={{ rotate: collapsedGroups[group.name] ? -90 : 0 }}>
                <ChevronDown size={14} />
              </motion.div>
            </div>)}
            
            <AnimatePresence>
              {!collapsedGroups[group.name] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  {group.items.map((item, index) => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isSubMenuActive = hasSubItems && item.subItems!.some(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
                    const isActive = (!hasSubItems && item.href && pathname === item.href) || isSubMenuActive;
                    const isExpanded = expandedMenus[item.name] || isSubMenuActive;
                    const Icon = item.icon;

                    const activeStyle = isActive ? {
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                    } : {};

                    const activeIconStyle = isActive ? { color: '#2563eb' } : { color: '#64748b' };
                    const activeIndicator = isActive ? (
                      <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '4px', background: '#2563eb', borderRadius: '0 4px 4px 0' }} />
                    ) : null;

                    const itemContent = (
                      <motion.div
                        whileHover={isActive ? {} : { scale: 1.02, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                        onClick={hasSubItems ? (e) => toggleMenu(e, item.name) : undefined}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          height: '48px',
                          padding: '0 16px',
                          borderRadius: '14px',
                          color: isActive ? 'white' : '#334155',
                          fontWeight: 500,
                          fontSize: '15px',
                          transition: 'all 0.25s ease',
                          cursor: 'pointer',
                          gap: '14px',
                          ...activeStyle
                        }}
                      >
                        {activeIndicator}
                        <Icon size={20} style={{ ...activeIconStyle, transition: 'all 0.25s' }} />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        {item.badge && (
                          <span style={{ 
                            background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.1)', 
                            color: isActive ? 'white' : '#2563eb', 
                            padding: '2px 8px', 
                            borderRadius: '99px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700 
                          }}>
                            {item.badge}
                          </span>
                        )}
                        {hasSubItems && (
                          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                            <ChevronRight size={16} style={{ color: isActive ? '#2563eb' : '#94a3b8' }} />
                          </motion.div>
                        )}
                      </motion.div>
                    );

                    const renderContent = () => {
                      if (item.external && item.href) {
                        if (item.href.includes('chat.whatsapp.com')) {
                          return (
                            <div key={index} onClick={() => {
                              if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) {
                                window.open(item.href, '_blank', 'noopener,noreferrer');
                              }
                            }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                              {itemContent}
                            </div>
                          );
                        }
                        return (
                          <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            {itemContent}
                          </a>
                        );
                      }

                      if (hasSubItems) {
                        return (
                          <div key={index}>
                            {itemContent}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}
                                >
                                  {item.subItems!.map((sub, sIndex) => {
                                    const isSubActive = pathname === sub.href;
                                    return (
                                      <Link key={sIndex} href={sub.href} style={{ textDecoration: 'none' }}>
                                        <motion.div
                                          whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                                          style={{
                                            padding: '8px 16px 8px 48px',
                                            borderRadius: '10px',
                                            color: isSubActive ? '#2563eb' : '#64748b',
                                            fontSize: '0.85rem',
                                            fontWeight: isSubActive ? 600 : 500,
                                            background: isSubActive ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            position: 'relative'
                                          }}
                                        >
                                          {isSubActive && (
                                            <div style={{ position: 'absolute', left: '22px', width: '4px', height: '4px', borderRadius: '50%', background: '#2563eb' }} />
                                          )}
                                          {!isSubActive && (
                                            <div style={{ position: 'absolute', left: '22px', width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                                          )}
                                          {sub.name}
                                        </motion.div>
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      return (
                        <Link key={index} href={item.href || '#'} style={{ textDecoration: 'none' }}>
                          {itemContent}
                        </Link>
                      );
                    };

                    return renderContent();
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bottom Profile Area */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              background: '#10b981',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Current User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
              {role}
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            onClick={logout}
            style={{ 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '10px', 
              color: '#64748b',
              transition: 'all 0.2s',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
