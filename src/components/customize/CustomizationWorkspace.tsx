'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextLink from 'next/link';
import { 
  Search, Settings, Users, Settings2, Sliders, Link as LinkIcon, 
  FileText, Shield, Briefcase, Plus, UserPlus, UploadCloud, 
  CheckSquare, MessageSquare, ArrowRight, ExternalLink, Activity
} from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { PremiumModal } from '@/components/common/PremiumModal';

export function CustomizationWorkspace() {
  const { addLead } = useCRM();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Frequently Used');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const closeModal = () => setActiveModal(null);

  const categories = [
    { id: 'Frequently Used', icon: Activity },
    { id: 'Users & Teams', icon: Users },
    { id: 'CRM & Lead Configuration', icon: Settings },
    { id: 'Work & Automation', icon: Sliders },
    { id: 'Integrations', icon: LinkIcon },
    { id: 'Message Templates', icon: MessageSquare },
    { id: 'Account & Permissions', icon: Shield },
    { id: 'Workspace / Business', icon: Briefcase },
  ];

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addLead({
      name: fd.get('name') as string,
      mobile: fd.get('mobile') as string,
      email: fd.get('email') as string,
      program: fd.get('program') as string,
      source: fd.get('source') as string,
      status: fd.get('status') as string,
      priority: fd.get('priority') as string,
      counselor: fd.get('counselor') as string,
      date: new Date().toISOString().split('T')[0]
    });
    showToast("Lead successfully added!");
    closeModal();
  };

  const allSearchableItems = [
    { type: 'card', category: 'Frequently Used', title: 'Add Single Lead', description: 'Open the Add Lead flow to manually enter a new prospect.', icon: <Plus size={20} />, onClick: () => setActiveModal('add-lead'), actionText: 'Add Lead' },
    { type: 'card', category: 'Frequently Used', title: 'Bulk Upload Leads', description: 'Import multiple leads from a CSV or Excel file.', icon: <UploadCloud size={20} />, onClick: () => setActiveModal('bulk-upload'), actionText: 'Upload' },
    { type: 'card', category: 'Frequently Used', title: 'Lead Distribution', description: 'Configure automatic lead assignment rules.', icon: <Users size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Configure' },
    { type: 'card', category: 'Frequently Used', title: 'Manage Users', description: 'View and manage CRM users and their roles.', icon: <UserPlus size={20} />, href: '/users', actionText: 'Go to Users' },
    { type: 'card', category: 'Users & Teams', title: 'Invite New User', description: 'Send an email invitation to join the CRM.', icon: <UserPlus size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Invite' },
    { type: 'card', category: 'Users & Teams', title: 'Manage Roles & Permissions', description: 'Define what users can see and do.', icon: <Shield size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Permissions' },
    { type: 'list', category: 'CRM & Lead Configuration', title: 'Lead Management', items: ['Lead Stages', 'Lead Sources', 'Lead Priority', 'Lead Categories', 'Lead Tags', 'Custom Lead Fields'] },
    { type: 'list', category: 'CRM & Lead Configuration', title: 'Contact Management', items: ['Contact Fields', 'Contact Categories', 'Custom Contact Properties'] },
    { type: 'list', category: 'CRM & Lead Configuration', title: 'Pipeline', items: ['Work Pipeline Configuration', 'Pipeline Stages', 'Follow-up Configuration'] },
    { type: 'list', category: 'Work & Automation', title: 'Workflows & Automation', items: ['Manage Work Types', 'Ad-hoc Tasks', 'Lead Tasks', 'Follow-up Rules', 'Automated Follow-ups', 'Task Categories', 'Reminder Settings', 'Lead Assignment Rules', 'Workflow Rules'] },
    { type: 'integration', category: 'Integrations', title: 'WhatsApp Business', status: 'Connected' },
    { type: 'integration', category: 'Integrations', title: 'Email (SMTP)', status: 'Connected' },
    { type: 'integration', category: 'Integrations', title: 'Google Calendar', status: 'Not Connected' },
    { type: 'integration', category: 'Integrations', title: 'Facebook Lead Ads', status: 'Coming soon' },
    { type: 'integration', category: 'Integrations', title: 'Razorpay', status: 'Coming soon' },
    { type: 'card', category: 'Message Templates', title: 'Create New Template', description: 'Design a new email or WhatsApp message.', icon: <Plus size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Create' },
    { type: 'card', category: 'Message Templates', title: 'WhatsApp Templates', description: 'Manage approved WhatsApp templates.', icon: <MessageSquare size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Manage' },
    { type: 'card', category: 'Message Templates', title: 'Email Templates', description: 'Standardized email responses.', icon: <FileText size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Manage' },
    { type: 'card', category: 'Message Templates', title: 'Follow-up Templates', description: 'Automated follow-up messaging.', icon: <Activity size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Manage' },
    { type: 'card', category: 'Account & Permissions', title: 'Role-Based Access', description: 'Configure global access levels.', icon: <Shield size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Configure' },
    { type: 'card', category: 'Account & Permissions', title: 'Manage Roles', description: 'Create or edit specific roles.', icon: <Users size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Roles' },
    { type: 'card', category: 'Account & Permissions', title: 'Default CRM Settings', description: 'Global preferences for the organization.', icon: <Settings size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Settings' },
    { type: 'card', category: 'Workspace / Business', title: 'Workspace Details', description: 'Name, timezone, and regional settings.', icon: <Briefcase size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Edit' },
    { type: 'card', category: 'Workspace / Business', title: 'CRM Branding', description: 'Logo, colors, and visual identity.', icon: <Settings2 size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Brand' },
    { type: 'card', category: 'Workspace / Business', title: 'Business Information', description: 'Legal entity and contact info.', icon: <FileText size={20} />, onClick: () => setActiveModal('generic-setting'), actionText: 'Info' },
  ];

  const filteredItems = searchQuery ? allSearchableItems.filter(item => {
    const term = searchQuery.toLowerCase();
    if (item.title.toLowerCase().includes(term)) return true;
    if (item.category.toLowerCase().includes(term)) return true;
    if (item.type === 'card' && item.description?.toLowerCase().includes(term)) return true;
    if (item.type === 'list' && item.items?.some(i => i.toLowerCase().includes(term))) return true;
    return false;
  }) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px', paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Customization</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>Manage your CRM configuration, users, workflows, lead management, integrations and account settings.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text"
            placeholder="Search customization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', 
              border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', outline: 'none' 
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '600px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '280px', flexShrink: 0, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', padding: '8px 12px', letterSpacing: '0.05em' }}>Overview</div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                background: !searchQuery && activeCategory === cat.id ? 'var(--primary-color)' : 'transparent',
                color: !searchQuery && activeCategory === cat.id ? 'white' : 'var(--text-primary)',
                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', fontWeight: !searchQuery && activeCategory === cat.id ? 600 : 400
              }}
              className={!searchQuery && activeCategory !== cat.id ? 'hover-bg-secondary' : ''}
            >
              <cat.icon size={18} />
              {cat.id}
            </button>
          ))}
        </div>

        <div className="glass-panel" style={{ flex: 1, borderRadius: '16px', padding: '32px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 24px 0', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {searchQuery && filteredItems.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No settings found matching "{searchQuery}"
              </div>
            )}
            
            {searchQuery && filteredItems.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredItems.map((item, idx) => {
                  if (item.type === 'card') return <SettingCard key={idx} title={item.title} description={item.description!} icon={item.icon} onClick={item.onClick} href={item.href} actionText={item.actionText!} />;
                  if (item.type === 'integration') return <IntegrationCard key={idx} name={item.title} status={item.status!} />;
                  if (item.type === 'list') {
                    // Filter inner items if they match, else show all
                    const term = searchQuery.toLowerCase();
                    const matchingItems = item.items!.filter(i => i.toLowerCase().includes(term));
                    const displayItems = matchingItems.length > 0 ? matchingItems : item.items!;
                    return (
                      <div style={{ gridColumn: '1 / -1' }} key={idx}>
                        <ConfigSection title={item.title} items={displayItems} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {!searchQuery && activeCategory === 'Frequently Used' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                <SettingCard title="Add Single Lead" description="Open the Add Lead flow to manually enter a new prospect." icon={<Plus size={20} />} onClick={() => setActiveModal('add-lead')} actionText="Add Lead" />
                <SettingCard title="Bulk Upload Leads" description="Import multiple leads from a CSV or Excel file." icon={<UploadCloud size={20} />} onClick={() => setActiveModal('bulk-upload')} actionText="Upload" />
                <SettingCard title="Lead Distribution" description="Configure automatic lead assignment rules." icon={<Users size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Configure" />
                <SettingCard title="Manage Users" description="View and manage CRM users and their roles." icon={<UserPlus size={20} />} href="/users" actionText="Go to Users" />
              </div>
            )}
            
            {!searchQuery && activeCategory === 'Users & Teams' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                  <SettingCard title="Manage Users" description="Full control over user accounts and details." icon={<Users size={20} />} href="/users" actionText="Manage" />
                  <SettingCard title="Invite New User" description="Send an email invitation to join the CRM." icon={<UserPlus size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Invite" />
                  <SettingCard title="Manage Roles & Permissions" description="Define what users can see and do." icon={<Shield size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Permissions" />
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Active Users (7)</h3>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                  {['Pavan SH', 'Thanushree BR', 'Parikshit', 'Spoorthi', 'Yashwanth', 'Abhishek', 'Padmesh'].map((user, idx) => (
                    <div key={user} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: idx < 6 ? '1px solid var(--glass-border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.charAt(0)}
                        </div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user}</div>
                      </div>
                      <NextLink href="/users" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>View</NextLink>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!searchQuery && activeCategory === 'CRM & Lead Configuration' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <ConfigSection title="Lead Management" items={['Lead Stages', 'Lead Sources', 'Lead Priority', 'Lead Categories', 'Lead Tags', 'Custom Lead Fields']} />
                <ConfigSection title="Contact Management" items={['Contact Fields', 'Contact Categories', 'Custom Contact Properties']} />
                <ConfigSection title="Pipeline" items={['Work Pipeline Configuration', 'Pipeline Stages', 'Follow-up Configuration']} />
              </div>
            )}
            
            {!searchQuery && activeCategory === 'Work & Automation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <ConfigSection title="Workflows & Automation" items={['Manage Work Types', 'Ad-hoc Tasks', 'Lead Tasks', 'Follow-up Rules', 'Automated Follow-ups', 'Task Categories', 'Reminder Settings', 'Lead Assignment Rules', 'Workflow Rules']} />
              </div>
            )}

            {!searchQuery && activeCategory === 'Integrations' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                <IntegrationCard name="WhatsApp Business" status="Connected" />
                <IntegrationCard name="Email (SMTP)" status="Connected" />
                <IntegrationCard name="Google Calendar" status="Not Connected" />
                <IntegrationCard name="Facebook Lead Ads" status="Coming soon" />
                <IntegrationCard name="Razorpay" status="Coming soon" />
              </div>
            )}

            {!searchQuery && activeCategory === 'Message Templates' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                <SettingCard title="Create New Template" description="Design a new email or WhatsApp message." icon={<Plus size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Create" />
                <SettingCard title="WhatsApp Templates" description="Manage approved WhatsApp templates." icon={<MessageSquare size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Manage" />
                <SettingCard title="Email Templates" description="Standardized email responses." icon={<FileText size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Manage" />
                <SettingCard title="Follow-up Templates" description="Automated follow-up messaging." icon={<Activity size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Manage" />
              </div>
            )}

            {!searchQuery && activeCategory === 'Account & Permissions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                 <SettingCard title="Role-Based Access" description="Configure global access levels." icon={<Shield size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Configure" />
                 <SettingCard title="Manage Roles" description="Create or edit specific roles." icon={<Users size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Roles" />
                 <SettingCard title="Default CRM Settings" description="Global preferences for the organization." icon={<Settings size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Settings" />
              </div>
            )}

            {!searchQuery && activeCategory === 'Workspace / Business' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                 <SettingCard title="Workspace Details" description="Name, timezone, and regional settings." icon={<Briefcase size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Edit" />
                 <SettingCard title="CRM Branding" description="Logo, colors, and visual identity." icon={<Settings2 size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Brand" />
                 <SettingCard title="Business Information" description="Legal entity and contact info." icon={<FileText size={20} />} onClick={() => setActiveModal('generic-setting')} actionText="Info" />
              </div>
            )}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', background: 'var(--success-color, #10b981)',
          color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 99999, fontWeight: 500
        }}>
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      {activeModal === 'add-lead' && (
        <PremiumModal title="Add New Lead" isOpen={true} onClose={closeModal}>
          <form onSubmit={handleAddLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label><input name="name" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mobile</label><input name="mobile" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label><input name="email" type="email" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Program</label><input name="program" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" onClick={closeModal} className="secondary-btn" style={{ padding: '10px 24px' }}>Cancel</button>
              <button type="submit" className="primary-btn" style={{ padding: '10px 24px' }}>Save Lead</button>
            </div>
          </form>
        </PremiumModal>
      )}

      {activeModal === 'bulk-upload' && (
        <PremiumModal title="Bulk Upload Leads" isOpen={true} onClose={closeModal}>
          <div style={{ padding: '32px', border: '2px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
            <UploadCloud size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Drag & drop your CSV file here</h3>
            <p style={{ color: 'var(--text-tertiary)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>or click to browse your files</p>
            <button className="primary-btn" onClick={() => { showToast('File upload simulation complete.'); closeModal(); }} style={{ padding: '10px 24px' }}>Browse Files</button>
          </div>
        </PremiumModal>
      )}

      {/* Generic mock modal for other settings */}
      {activeModal === 'generic-setting' && (
        <PremiumModal title="Configuration Setup" isOpen={true} onClose={closeModal}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Settings2 size={48} style={{ color: 'var(--primary-color)', marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Coming Soon</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>This configuration panel is currently under development. Please check back later.</p>
            <button className="primary-btn" onClick={closeModal} style={{ padding: '10px 24px' }}>Close</button>
          </div>
        </PremiumModal>
      )}
    </div>
  );
}

function SettingCard({ title, description, icon, onClick, href, actionText }: { title: string, description: string, icon: React.ReactNode, onClick?: () => void, href?: string, actionText: string }) {
  const CardWrapper = href ? NextLink : 'button';
  const wrapperProps = href ? { href, style: { textDecoration: 'none', display: 'block', width: '100%' } } : { onClick, style: { width: '100%', border: 'none', background: 'transparent', textAlign: 'left', padding: 0 } as const };

  return (
    <CardWrapper {...(wrapperProps as any)} className="hover-scale">
      <div style={{ 
        background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', 
        borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', 
        gap: '12px', height: '100%', cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
            {actionText} {href ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}

function ConfigSection({ title, items }: { title: string, items: string[] }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: '8px' }}>
        {items.map((item, idx) => (
          <div key={item} className="hover-bg-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item}</span>
            <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Configure</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({ name, status }: { name: string, status: string }) {
  const isConnected = status === 'Connected';
  const isComingSoon = status === 'Coming soon';
  
  return (
    <div style={{ 
      background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', 
      borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', 
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{name}</h3>
        <span style={{ 
          fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
          background: isConnected ? 'rgba(16, 185, 129, 0.1)' : isComingSoon ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
          color: isConnected ? '#10b981' : isComingSoon ? '#f59e0b' : '#6b7280'
        }}>
          {status}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
        {isConnected ? (
          <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Configure</button>
        ) : isComingSoon ? (
           <button disabled style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}>Coming Soon</button>
        ) : (
          <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Connect</button>
        )}
      </div>
    </div>
  );
}
