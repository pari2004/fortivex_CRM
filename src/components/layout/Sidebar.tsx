'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserPlus, Phone, PhoneCall, Calendar,
  MessageSquare, FileText, Settings, BarChart2, Briefcase,
  Target, GraduationCap, CheckCircle, PieChart, ShieldCheck, User, FolderOpen, Megaphone, Share2, MailWarning, MessageCircle, CheckSquare,
  Search, ChevronDown, ChevronRight, LogOut, Bell, Mail, Video
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
  it: [],
  admin: [
    {
      name: '',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          subItems: [
            { name: 'Default', href: '/dashboard?tab=Default' },
            { name: 'Activity Metrics', href: '/dashboard?tab=Activity Metrics' },
            { name: 'Source Report', href: '/dashboard?tab=Source Report' },
            { name: 'User Leads', href: '/dashboard?tab=User Leads' },
            { name: 'Custom', href: '/dashboard?tab=Custom' },
          ]
        },
        {
          name: 'Leads',
          href: '/leads',
          icon: Users,
          subItems: [
            { name: 'Active Leads', href: '/leads?tab=Active Leads' },
            { name: 'Work Leads', href: '/leads?tab=Work Leads' },
            { name: 'Business', href: '/leads?tab=Business' },
            { name: 'Documents', href: '/leads?tab=Documents' },
            { name: 'Segments / Lists', href: '/leads?tab=Segments / Lists' },
            { name: 'Uploads', href: '/leads?tab=Uploads' },
            { name: 'Distribution', href: '/leads?tab=Distribution' },
            { name: 'Follow-ups', href: '/leads?tab=Follow-ups' },
            { name: 'Data Exports', href: '/leads?tab=Data Exports' },
            { name: 'Email Leads', href: '/leads?tab=Email Leads' }
          ]
        },
        {
          name: 'Applications',
          href: '/applications',
          icon: FileText,
          subItems: [
            { name: 'All Applications', href: '/applications?status=All Applications' },
            { name: 'Draft', href: '/applications?status=Draft' },
            { name: 'Submitted', href: '/applications?status=Submitted' },
            { name: 'Under Review', href: '/applications?status=Under Review' },
            { name: 'Documents Pending', href: '/applications?status=Documents Pending' },
            { name: 'Approved', href: '/applications?status=Approved' },
            { name: 'Rejected', href: '/applications?status=Rejected' },
            { name: 'Admission Completed', href: '/applications?status=Admission Completed' }
          ]
        },
        {
          name: 'Students',
          href: '/students',
          icon: GraduationCap,
          subItems: [
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
          ]
        },
        {
          name: 'Tasks',
          href: '/tasks',
          icon: CheckSquare,
          subItems: [
            { name: 'My Reminders', href: '/tasks/my-tasks' },
            { name: 'Assigned Tasks', href: '/tasks/assigned' },
            { name: 'Pending Tasks', href: '/tasks/pending' },
            { name: 'Completed Tasks', href: '/tasks/completed' },
            { name: 'Overdue Tasks', href: '/tasks/overdue' },
            { name: 'Team Tasks', href: '/tasks/team' },
            { name: 'Calendar View', href: '/tasks/calendar' }
          ]
        },
        { name: 'Calendar', href: 'https://calendar.google.com/', icon: Calendar, external: true },
        { name: 'Calls', href: '/calls', icon: Phone },
        { name: 'Join Fortivex.AI CRM WhatsApp Community', href: 'https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', icon: MessageCircle, external: true },
        { name: 'Email', href: 'https://mail.google.com/', icon: MailWarning, external: true },

        {
          name: 'Conversations',
          href: '/conversations',
          icon: MessageSquare,
          subItems: [
            { name: 'Team Inbox', href: '/conversations/team-inbox' },
            { name: 'Lead Inbox', href: '/conversations/lead-inbox' },
            { name: 'AI Chatbot', href: '/conversations/ai-chatbot' },
            { name: 'Auto Messaging', href: '/conversations/auto-messaging' },
            { name: 'Broadcasts', href: '/conversations/broadcasts' },
            { name: 'Tickets', href: '/conversations/tickets' },
            { name: 'Stats', href: '/conversations/stats' }
          ]
        },
        {
          name: 'Engagements',
          href: '/engagements',
          icon: Video,
          subItems: [
            { name: 'All Engagements', href: '/engagements/all' },
            { name: 'All Activities', href: '/engagements/activities' },
            { name: 'Messages', href: '/engagements/messages' },
            { name: 'Calls', href: '/engagements/call-recordings' },
            { name: 'Video Calls', href: '/engagements/video-calls' },
            { name: 'Active Table View', href: '/activity' },
            { name: 'Visits', href: '/engagements/visits' }
          ]
        },
        { name: 'Email Hub', href: '/email-hub', icon: Mail },
        { name: 'WhatsApp Hub', href: '/whatsapp-hub', icon: MessageCircle },
        {
          name: 'Opportunities',
          href: '/opportunities',
          icon: Target,
          subItems: [
            { name: 'Deals', href: '/opportunities?tab=Deals' },
            { name: 'Payments', href: '/opportunities?tab=Payments' },
            { name: 'Payments Tabular', href: '/opportunities?tab=Payments Tabular' },
            { name: 'Quotes', href: '/opportunities?tab=Quotes' }
          ]
        },
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
        {
          name: 'Customization',
          href: '/customization',
          icon: Settings,
          subItems: [
            { name: 'Organization', href: '/customization/organization' },
            { name: 'Account Defaults', href: '/customization/account-defaults' },
            { name: 'Roles & Permissions', href: '/customization/roles-permissions' },
            { name: 'Properties', href: '/customization/properties' },
            { name: 'Customization', href: '/customization/customization' },
            { name: 'Manage Do Not Track', href: '/customization/manage-do-not-track' }
          ]
        },
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
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const router = useRouter();
  const { role, user, rolePermissions, hasPermission, logout } = useAuth();
  
  // Use admin menu as the master template of all available features
  const masterMenu = navMenus['admin'] || navMenus[role] || [];
  
  // Dynamically filter master menu based on user's custom permissions
  const activeGroups = masterMenu.map(group => {
    const filteredItems = group.items.filter(item => {
      // Certain generic system links might not be in the permission matrix.
      // If it's a completely external link like calendar or mail, keep it.
      if (item.external) return true;
      return hasPermission(item.name, 'View');
    }).map(item => {
      if (item.subItems) {
        // For Dashboard, subItems are like "Activity Metrics", which aren't in the permission list.
        // We only filter subItems if they represent major modules (like in Customization).
        // Let's check if the parent itself is "Customization" or "Tasks"
        if (['Customization', 'Conversations', 'Opportunities', 'Engagements'].includes(item.name)) {
           const filteredSub = item.subItems.filter(sub => hasPermission(sub.name, 'View'));
           return { ...item, subItems: filteredSub.length > 0 ? filteredSub : undefined };
        }
        // Otherwise, assume subItems are just dashboard tabs or similar un-permissioned internal links
      }
      return item;
    });
    
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);
  
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [expandedNavItems, setExpandedNavItems] = useState<Record<string, boolean>>({
    'Dashboard': pathname === '/dashboard',
    'Leads': pathname === '/leads',
    'Opportunities': pathname === '/opportunities',
    'Applications': pathname === '/applications'
  });

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleNavItem = (itemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNavItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
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
                    // Check view permission
                    // Special cases where item.name doesn't match module name directly
                    let moduleName = item.name;
                    if (item.name === 'Reports') moduleName = 'Reports & Analytics';
                    // External links or special static links can bypass permission check if needed,
                    // but we apply it broadly for CRM modules.
                    if (!item.external) {
                       if (!hasPermission(moduleName, 'View')) return null;
                    }

                    const isExactMatch = pathname === item.href && !item.subItems;
                    const isParentMatch = pathname === item.href && item.subItems;
                    const isActive = isExactMatch || (isParentMatch && !currentTab);
                    const isExpanded = expandedNavItems[item.name];

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
                        onClick={(e) => {
                          if (item.subItems) {
                            toggleNavItem(item.name, e);
                          }
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
                        {item.subItems && (
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} style={{ color: '#64748b' }}>
                            <ChevronDown size={16} />
                          </motion.div>
                        )}
                      </motion.div>
                    );

                    let linkWrapper = null;

                    if (item.external) {
                      if (item.href?.includes('chat.whatsapp.com')) {
                        linkWrapper = (
                          <div key={`ext-${index}`} onClick={() => {
                            if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) {
                              window.open(item.href, '_blank', 'noopener,noreferrer');
                            }
                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            {itemContent}
                          </div>
                        );
                      } else {
                        linkWrapper = (
                          <a key={`link-${index}`} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            {itemContent}
                          </a>
                        );
                      }
                    } else if (item.subItems) {
                      linkWrapper = <div key={`sub-${index}`}>{itemContent}</div>;
                    } else {
                      linkWrapper = (
                        <Link key={`link-${index}`} href={item.href || '#'} style={{ textDecoration: 'none' }}>
                          {itemContent}
                        </Link>
                      );
                    }

                    return (
                      <React.Fragment key={index}>
                        {linkWrapper}

                        {/* Render SubItems if expanded */}
                        <AnimatePresence>
                          {item.subItems && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '46px' }}
                            >
                              {item.subItems.map((subItem, sIdx) => {
                                // For active state, we check if the currentTab from URL matches this subItem name
                                // e.g. subItem.name is "Source Report", currentTab is "Source Report"
                                // or if currentTab is empty and subItem.name is "Default"
                                const isSubActive = currentTab === subItem.name || (!currentTab && subItem.name === 'Default') || pathname === subItem.href;

                                // Submodule permission check (optional, but robust)
                                // format module: "Leads-Active Leads"
                                const subModuleName = `${moduleName}-${subItem.name}`;
                                // If the backend has granular sub-module permissions, check here
                                // But let's keep it simple: if you have view to the main module, you can see its subs unless specifically disabled.
                                if (!hasPermission(subModuleName, 'View') && rolePermissions[subModuleName] !== undefined) {
                                  // return null; // We could hide it, but the UI is simpler if we just let them click and get "Access Denied" or handle it natively
                                  // Wait, let's actually hide it if we have specific permissions tracking it
                                  // To be safe and meet the requirement, we check it.
                                  // If the submodule doesn't exist in permissions object, fallback to true.
                                  if (rolePermissions[subModuleName] && !hasPermission(subModuleName, 'View')) return null;
                                }

                                return (
                                  <Link key={sIdx} href={subItem.href} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                                      style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '40px',
                                        padding: '0 16px',
                                        borderRadius: '10px',
                                        color: isSubActive ? '#2563eb' : '#64748b',
                                        fontWeight: isSubActive ? 600 : 500,
                                        fontSize: '14px',
                                        transition: 'all 0.25s ease',
                                        background: isSubActive ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                      }}
                                    >
                                      {isSubActive && <div style={{ position: 'absolute', left: '-10px', width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />}
                                      {subItem.name}
                                    </motion.div>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
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
          
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer', borderRadius: '12px', padding: '4px', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={() => router.push('/users/USR-002')}
          >
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
