'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, Save, Search, ShieldCheck } from 'lucide-react';
import { SlidePanel } from '@/components/common/PremiumModal';
import { useAuth } from '@/contexts/AuthContext';
import { getDynamicAccounts, INITIAL_DEMO_ACCOUNTS } from '@/lib/data/mockUsers';
import { PermissionsManager } from '@/lib/PermissionsManager';

type PermissionMatrix = Record<string, Record<string, boolean>>;
type Account = (typeof INITIAL_DEMO_ACCOUNTS)[number];
const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Import', 'Assign', 'Manage', 'Configure'];
const MODULES = [
  ['Dashboard', ['Default', 'Activity Metrics', 'Source Report', 'User Leads', 'Attendance', 'Location', 'Custom']],
  ['Leads', ['Active Leads', 'All Leads', 'Work Leads', 'Business', 'Documents', 'Segments / Lists', 'Uploads', 'Distribution', 'Follow-ups', 'Data Exports', 'Email Leads']],
  ['Applications', ['Draft', 'Submitted', 'Under Review', 'Documents Pending', 'Approved', 'Rejected', 'Admission Completed']],
  ['Students', ['Admissions', 'Alumni', 'Assessments', 'Assignments', 'Attendance', 'Batch Allocation', 'Certificates', 'Internship', 'Placement', 'Profile']],
  ['Tasks', ['Assigned', 'Calendar', 'Completed', 'My Tasks', 'Overdue', 'Pending', 'Team']], ['Calendar', []], ['Calls', []], ['Email', []],
  ['Conversations', ['AI Chatbot', 'Auto Messaging', 'Broadcasts', 'Lead Inbox', 'Stats', 'Team Inbox', 'Tickets']], ['Engagements', ['Activities', 'All', 'Call Recordings', 'Messages', 'Video Calls', 'Visits']], ['Email Hub', []], ['WhatsApp Hub', []],
  ['Opportunities', ['Deals', 'Payments', 'Payments Tabular', 'Quotes']], ['Reports & Analytics', ['Admission', 'Attendance', 'Custom', 'Dashboard', 'Lead', 'Payment', 'Placement', 'Revenue', 'Student', 'Trainer']], ['Users', []], ['Customization', ['Organization', 'Account Defaults', 'Roles & Permissions', 'Properties', 'Customization', 'Manage Do Not Track']], ['Automation', []], ['Settings', []], ['Help Center', []],
] as const;
const roleName = (role: string) => ({ it: 'IT', admin: 'Admin', counselor: 'Admission Counselor', manager: 'Manager', marketing: 'Marketing', member: 'Member' }[role] || role);
const clone = (value: PermissionMatrix): PermissionMatrix => JSON.parse(JSON.stringify(value || {}));
const memberBaseline = (): PermissionMatrix => ({ Dashboard: { View: true }, Tasks: { View: true, Create: true, Edit: true }, Calendar: { View: true, Create: true, Edit: true }, 'Help Center': { View: true } });
const mergePermissions = (...matrices: PermissionMatrix[]): PermissionMatrix => matrices.reduce<PermissionMatrix>((merged, matrix) => { Object.entries(matrix || {}).forEach(([module, actions]) => { merged[module] = { ...merged[module] }; Object.entries(actions).forEach(([action, allowed]) => { merged[module][action] = Boolean(merged[module][action] || allowed); }); }); return merged; }, {});

function notify(message: string, error = false) {
  const element = document.createElement('div'); element.textContent = message;
  Object.assign(element.style, { position: 'fixed', right: '20px', bottom: '20px', zIndex: '10000', padding: '12px 18px', borderRadius: '8px', background: error ? '#dc2626' : '#059669', color: 'white', boxShadow: '0 8px 24px rgba(0,0,0,.18)' });
  document.body.appendChild(element); setTimeout(() => element.remove(), 3000);
}

function inheritedPermissions(account: Account): PermissionMatrix {
  try { const roles = PermissionsManager.getCustomRoles() || []; const permissions = roles.find((entry: { name: string }) => entry.name === roleName(account.role))?.permissions; return permissions && Object.keys(permissions).length ? clone(permissions) : {}; } catch { return {}; }
}

export default function RolesPage({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { role, forceRefreshPermissions } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_DEMO_ACCOUNTS);
  const [selected, setSelected] = useState<Account | null>(null);
  const [draft, setDraft] = useState<PermissionMatrix>({});
  const [search, setSearch] = useState(''); const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isAdmin = role === 'it' || role === 'admin';
  useEffect(() => { setAccounts(getDynamicAccounts()); setExpanded(Object.fromEntries(MODULES.map(([name]) => [name, true]))); }, []);
  const explicitPermissions = (account: Account): PermissionMatrix | null => { 
    if (account.id === '0') {
      const allPerms: any = {};
      MODULES.forEach(([name]) => allPerms[name] = { View: true, Create: true, Edit: true, Delete: true });
      return allPerms;
    }
    try { const all = PermissionsManager.getUserPermissions(); const perms = all[account.id]; return perms && Object.keys(perms).length > 0 ? clone(perms) : null; } catch { return null; } 
  };
  const effectivePermissions = (account: Account) => mergePermissions(explicitPermissions(account) || memberBaseline(), inheritedPermissions(account));
  const filteredAccounts = useMemo(() => accounts.filter(account => `${account.name} ${account.email || ''} ${account.role}`.toLowerCase().includes(search.toLowerCase())), [accounts, search]);
  const openPermissions = (account: Account) => { setSelected(account); setDraft(clone(effectivePermissions(account))); };
  const updatePermission = (module: string, permission: string, value?: boolean) => setDraft(previous => {
    const next = clone(previous); const enabled = value ?? !next[module]?.[permission]; next[module] = { ...next[module], [permission]: enabled };
    const subs = MODULES.find(([name]) => name === module)?.[1] || []; subs.forEach(sub => { const key = `${module}-${sub}`; next[key] = { ...next[key], [permission]: enabled }; }); return next;
  });
  const toggleRow = (module: string) => { const enabled = !PERMISSIONS.every(permission => draft[module]?.[permission]); let next = clone(draft); PERMISSIONS.forEach(permission => { next[module] = { ...next[module], [permission]: enabled }; }); const subs = MODULES.find(([name]) => name === module)?.[1] || []; subs.forEach(sub => PERMISSIONS.forEach(permission => { const key = `${module}-${sub}`; next[key] = { ...next[key], [permission]: enabled }; })); setDraft(next); };
  const savePermissions = async () => { if (!selected) return; if ((selected.role === 'admin' || selected.role === 'it') && draft.Customization?.View === false && !window.confirm('Removing Customization access can lock this administrator out. Continue?')) return; try { const stored = PermissionsManager.getUserPermissions(); const all = stored ? { ...stored } : {}; all[selected.id] = draft; await PermissionsManager.saveUserPermissions(all); forceRefreshPermissions(); setAccounts(prev => [...prev]); notify(`${selected.name}'s permissions were saved.`); } catch { notify('Could not save user permissions.', true); } };
  const resetToRole = async () => { if (!selected) return; try { const stored = PermissionsManager.getUserPermissions(); const all = stored ? { ...stored } : {}; all[selected.id] = memberBaseline(); await PermissionsManager.saveUserPermissions(all); setDraft(effectivePermissions(selected)); forceRefreshPermissions(); setAccounts(prev => [...prev]); notify(`${selected.name} now uses the Member baseline plus role elevation.`); } catch { notify('Could not reset user permissions.', true); } };
  return <div style={{ padding: hideHeader ? 0 : '24px', maxWidth: '1400px', margin: '0 auto' }}>
    {!hideHeader && <div style={{ marginBottom: '28px' }}><h1 style={{ margin: '0 0 8px', fontSize: '1.75rem', color: 'var(--text-primary)' }}>User Permissions</h1><p style={{ margin: 0, color: 'var(--text-secondary)' }}>Each person starts at the Member baseline. Roles elevate access for everyone assigned to them.</p></div>}
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', maxWidth: '480px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '10px 12px' }}><Search size={18} color="var(--text-tertiary)" /><input aria-label="Search users" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search users" style={{ border: 0, outline: 0, background: 'transparent', color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem' }} /></div>
    <div style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'var(--bg-card)' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}><thead><tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}><th style={{ padding: '14px 18px' }}>User</th><th style={{ padding: '14px 18px' }}>Role</th><th style={{ padding: '14px 18px' }}>Permission baseline</th><th style={{ padding: '14px 18px', textAlign: 'right' }}>Access</th></tr></thead><tbody>{filteredAccounts.map(account => { const customized = explicitPermissions(account) !== null; const allowed = Object.values(effectivePermissions(account)).reduce((count, row) => count + Object.values(row).filter(Boolean).length, 0); return <tr key={account.id} onClick={() => openPermissions(account)} style={{ cursor: 'pointer', borderTop: '1px solid var(--glass-border)' }}><td style={{ padding: '14px 18px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: 700 }}>{account.name[0]}</div><div><div style={{ fontWeight: 700 }}>{account.name}</div><div style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{account.email || account.mobile}</div></div></div></td><td style={{ padding: '14px 18px' }}>{roleName(account.role)}</td><td style={{ padding: '14px 18px', color: customized ? '#059669' : 'var(--text-secondary)' }}>{customized ? 'Individual permissions' : 'Member baseline'}</td><td style={{ padding: '14px 18px', textAlign: 'right' }}>{allowed} permissions</td></tr>; })}</tbody></table></div>
    {!filteredAccounts.length && <div style={{ color: 'var(--text-secondary)', padding: '32px 0' }}>No users match your search.</div>}
    <SlidePanel isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Permissions for ${selected.name}` : 'User permissions'} subtitle={selected ? `${roleName(selected.role)} • ${explicitPermissions(selected) ? 'custom access' : 'currently using role defaults'}` : ''} icon={<ShieldCheck />} width="1180px">
      {!isAdmin ? <p>You do not have permission to change access settings.</p> : <><div style={{ padding: '14px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--text-secondary)', fontSize: '.9rem' }}>Individual permissions are the baseline. Role permissions elevate access for every member of that role.</div><div style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', borderRadius: '10px' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem', minWidth: '950px' }}><thead><tr style={{ background: 'var(--bg-secondary)' }}><th style={{ padding: '13px', textAlign: 'left' }}>Module</th>{PERMISSIONS.map(permission => <th key={permission} style={{ padding: '13px', textAlign: 'center' }}>{permission}</th>)}<th style={{ padding: '13px' }}>All</th></tr></thead><tbody>{MODULES.map(([module, subs]) => <React.Fragment key={module}><tr style={{ borderTop: '1px solid var(--glass-border)' }}><td onClick={() => subs.length && setExpanded(value => ({ ...value, [module]: !value[module] }))} style={{ padding: '13px', fontWeight: 700, cursor: subs.length ? 'pointer' : 'default' }}>{subs.length ? (expanded[module] ? <ChevronDown size={15} /> : <ChevronRight size={15} />) : null} <span style={{ marginLeft: subs.length ? 6 : 0 }}>{module}</span></td>{PERMISSIONS.map(permission => <td key={permission} style={{ textAlign: 'center' }}><input type="checkbox" checked={Boolean(draft[module]?.[permission])} onChange={() => updatePermission(module, permission)} /></td>)}<td style={{ textAlign: 'center' }}><input type="checkbox" checked={PERMISSIONS.every(permission => draft[module]?.[permission])} onChange={() => toggleRow(module)} /></td></tr>{subs.length > 0 && expanded[module] && subs.map(sub => { const key = `${module}-${sub}`; return <tr key={key} style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,.015)' }}><td style={{ padding: '10px 13px 10px 38px', color: 'var(--text-secondary)' }}>{sub}</td>{PERMISSIONS.map(permission => <td key={permission} style={{ textAlign: 'center' }}><input type="checkbox" checked={Boolean(draft[key]?.[permission])} onChange={() => updatePermission(key, permission)} /></td>)}<td style={{ textAlign: 'center' }}><input type="checkbox" checked={PERMISSIONS.every(permission => draft[key]?.[permission])} onChange={() => { const enabled = !PERMISSIONS.every(permission => draft[key]?.[permission]); PERMISSIONS.forEach(permission => updatePermission(key, permission, enabled)); }} /></td></tr>; })}</React.Fragment>)}</tbody></table></div><div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}><button className="secondary-btn" onClick={resetToRole} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><RefreshCw size={16} /> Reset to Member baseline</button><button className="primary-btn" onClick={savePermissions} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Save size={16} /> Save user permissions</button></div></>}
    </SlidePanel>
  </div>;
}
