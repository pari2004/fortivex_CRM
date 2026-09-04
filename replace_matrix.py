import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { Shield, ShieldCheck, Users, Edit, Copy, CheckSquare, Trash2, Plus, Clock, User, CheckCircle, Save, X, Search, Link as LinkIcon, RefreshCw } from 'lucide-react';",
    "import { Shield, ShieldCheck, Users, Edit, Copy, CheckSquare, Trash2, Plus, Clock, User, CheckCircle, Save, X, Search, Link as LinkIcon, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';"
)

# 2. Modules
modules_old = """const MODULES = [
  'Dashboard', 'Leads', 'Applications', 'Students', 'Tasks', 'Calendar', 'Calls',
  'Join Fortivex.AI CRM WhatsApp Community', 'Email', 'Conversations', 'Engagements',
  'Email Hub', 'WhatsApp Hub', 'Opportunities', 'Reports & Analytics', 'Users',
  'Customization', 'Automation', 'Settings', 'Help Center'
];"""

modules_new = """export interface ModuleDef {
  name: string;
  subModules: string[];
}

const MODULES_WITH_SUBS: ModuleDef[] = [
  { name: 'Dashboard', subModules: ['Revenue Stats', 'Team Activity', 'Goal Tracking'] },
  { name: 'Leads', subModules: ['Lead List', 'Import Leads', 'Export Leads', 'Bulk Assign'] },
  { name: 'Applications', subModules: ['View Applications', 'Approval Workflow'] },
  { name: 'Students', subModules: ['Student Directory', 'Academic Records', 'Fee Management'] },
  { name: 'Tasks', subModules: ['Task List', 'Assign Tasks', 'Task Calendar'] },
  { name: 'Calendar', subModules: ['My Calendar', 'Team Calendar', 'Event Management'] },
  { name: 'Calls', subModules: ['Call Logs', 'Recordings', 'Dialer Settings'] },
  { name: 'Join Fortivex.AI CRM WhatsApp Community', subModules: [] },
  { name: 'Email', subModules: ['Inbox', 'Compose', 'Email Templates'] },
  { name: 'Conversations', subModules: ['Chat History', 'Live Chat'] },
  { name: 'Engagements', subModules: ['Meetings', 'Visits', 'Feedback'] },
  { name: 'Email Hub', subModules: ['Campaigns', 'Automated Sequences'] },
  { name: 'WhatsApp Hub', subModules: ['Broadcasts', 'WhatsApp Templates', 'Integrations'] },
  { name: 'Opportunities', subModules: ['Pipeline View', 'Deal Stages', 'Forecasting'] },
  { name: 'Reports & Analytics', subModules: ['Standard Reports', 'Custom Reports', 'Export Reports'] },
  { name: 'Users', subModules: ['User Directory', 'Activity Logs'] },
  { name: 'Customization', subModules: ['Fields & Properties', 'Lead Sources', 'Tags'] },
  { name: 'Automation', subModules: ['Workflows', 'Triggers', 'Action Setup'] },
  { name: 'Settings', subModules: ['Organization Details', 'Billing', 'Integrations'] },
  { name: 'Help Center', subModules: ['Knowledge Base', 'Support Tickets'] }
];

const MODULES = MODULES_WITH_SUBS.map(m => m.name);"""
content = content.replace(modules_old, modules_new)

# 3. State for expanded modules
state_old = "const [searchUser, setSearchUser] = useState('');"
state_new = "const [searchUser, setSearchUser] = useState('');\n  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});\n\n  const toggleModule = (moduleName: string) => setExpandedModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));"
content = content.replace(state_old, state_new)

# 4. Handle Sub-module permissions
# Wait, handleTogglePermission takes moduleName and permName. Let's create one that takes subModule too.
toggle_old = """  const handleTogglePermission = (moduleName: string, permName: string) => {
    setTempPermissions(prev => {
      const current = { ...prev };
      if (!current[moduleName]) current[moduleName] = {};
      current[moduleName][permName] = !current[moduleName][permName];
      return current;
    });
  };"""
toggle_new = """  const handleTogglePermission = (moduleName: string, permName: string, subModuleName?: string) => {
    setTempPermissions(prev => {
      const current = { ...prev };
      const key = subModuleName ? `${moduleName}__${subModuleName}` : moduleName;
      if (!current[key]) current[key] = {};
      current[key][permName] = !current[key][permName];
      return current;
    });
  };
  
  const isPermissionChecked = (moduleName: string, permName: string, subModuleName?: string) => {
    const key = subModuleName ? `${moduleName}__${subModuleName}` : moduleName;
    return tempPermissions[key]?.[permName] || false;
  };"""
content = content.replace(toggle_old, toggle_new)

# 5. The Table Body
table_old = """                  <tbody>
                    {allowedModules.map((module, i) => (
                      <tr key={module} style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                        <td 
                          onClick={() => handleNavigate(module)}
                          style={{ padding: '16px', fontWeight: 600, position: 'sticky', left: 0, background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--primary-color)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <LinkIcon size={14} /> {module}
                          </div>
                        </td>
                        {PERMISSIONS.map(p => {
                          const isChecked = tempPermissions[module]?.[p] || false;
                          return (
                            <td key={p} style={{ padding: '16px', textAlign: 'center' }}>
                              <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(module, p)}
                                  style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    accentColor: 'var(--primary-color)',
                                    cursor: 'pointer'
                                  }} 
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>"""

table_new = """                  <tbody>
                    {allowedModules.map((module, i) => {
                      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
                      const hasSubs = moduleDef && moduleDef.subModules.length > 0;
                      const isExpanded = expandedModules[module];
                      
                      return (
                        <React.Fragment key={module}>
                          <tr style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                            <td 
                              onClick={() => hasSubs ? toggleModule(module) : handleNavigate(module)}
                              style={{ padding: '16px', fontWeight: 600, position: 'sticky', left: 0, background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--primary-color)' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {hasSubs ? (
                                  isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                ) : (
                                  <LinkIcon size={14} />
                                )}
                                {module}
                              </div>
                            </td>
                            {PERMISSIONS.map(p => (
                              <td key={p} style={{ padding: '16px', textAlign: 'center' }}>
                                <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={isPermissionChecked(module, p)}
                                    onChange={() => handleTogglePermission(module, p)}
                                    style={{ 
                                      width: '20px', 
                                      height: '20px', 
                                      accentColor: 'var(--primary-color)',
                                      cursor: 'pointer'
                                    }} 
                                  />
                                </label>
                              </td>
                            ))}
                          </tr>
                          
                          {/* Sub-modules rendering */}
                          {hasSubs && isExpanded && moduleDef.subModules.map((sub, j) => (
                            <tr key={`${module}-${sub}`} style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.01)' }}>
                              <td 
                                style={{ padding: '12px 16px 12px 40px', fontWeight: 500, fontSize: '0.9em', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                              >
                                {sub}
                              </td>
                              {PERMISSIONS.map(p => (
                                <td key={p} style={{ padding: '12px', textAlign: 'center' }}>
                                  <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={isPermissionChecked(module, p, sub)}
                                      onChange={() => handleTogglePermission(module, p, sub)}
                                      style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        accentColor: 'var(--primary-color)',
                                        cursor: 'pointer',
                                        opacity: 0.8
                                      }} 
                                    />
                                  </label>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>"""
content = content.replace(table_old, table_new)

# Add import React if missing because of React.Fragment
if "import React" not in content and "import * as React" not in content:
    content = content.replace("import { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Applied matrix changes")
