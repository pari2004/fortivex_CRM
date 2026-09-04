import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Add Password to Add Member State
state_replace = """  const [newMemberData, setNewMemberData] = useState({ name: '', email: '', department: 'General', phone: '', password: '' });"""
content = re.sub(r"const \[newMemberData, setNewMemberData\] = useState.*?;\n", state_replace + "\n", content)

# 2. Add Password to handleAddNewMember
content = content.replace("email: newMemberData.email,", "email: newMemberData.email,\n        password: newMemberData.password,")
content = content.replace("setNewMemberData({ name: '', email: '', department: 'General', phone: '' });", "setNewMemberData({ name: '', email: '', department: 'General', phone: '', password: '' });")

# 3. Add Password field to the form UI
password_input = """<PremiumInput label="Email Address" value={newMemberData.email} onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})} placeholder="e.g. jane@fortivex.com" type="email" required />
            <PremiumInput label="Password" value={newMemberData.password} onChange={(e) => setNewMemberData({...newMemberData, password: e.target.value})} placeholder="Enter temporary password" type="password" required />"""
content = content.replace('<PremiumInput label="Email Address" value={newMemberData.email} onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})} placeholder="e.g. jane@fortivex.com" type="email" required />', password_input)


# 4. Add "All" to Permissions Matrix
# Add handleToggleAllRow function
handle_all_row = """  const isPermissionChecked = (module: string, permission: string) => {
    return tempPermissions[module]?.[permission] || false;
  };

  const handleToggleRow = (module: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) newPerms[module] = {};
      
      // Check if all are already selected
      const allSelected = PERMISSIONS.every(p => newPerms[module][p]);
      
      PERMISSIONS.forEach(p => {
        newPerms[module][p] = !allSelected;
      });
      
      return newPerms;
    });
  };"""
content = content.replace("""  const isPermissionChecked = (module: string, permission: string) => {
    return tempPermissions[module]?.[permission] || false;
  };""", handle_all_row)

# 5. Add "All" Header
content = content.replace("""{PERMISSIONS.map(p => (
                        <th key={p} style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{p}</th>
                      ))}
                    </tr>""", """{PERMISSIONS.map(p => (
                        <th key={p} style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{p}</th>
                      ))}
                      <th style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center', color: 'var(--primary-color)' }}>All</th>
                    </tr>""")

# 6. Add "All" Checkbox to Main Module row
main_module_row = """</label>
                              </td>
                            ))}
                          </tr>"""
new_main_module_row = """</label>
                              </td>
                            ))}
                            <td style={{ padding: '16px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                              <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox" 
                                  checked={PERMISSIONS.every(p => isPermissionChecked(module, p))}
                                  onChange={() => handleToggleRow(module)}
                                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} 
                                />
                              </label>
                            </td>
                          </tr>"""
content = content.replace(main_module_row, new_main_module_row, 1)

# 7. Add "All" Checkbox to Sub Module row
sub_module_row = """</label>
                                </td>
                              ))}
                            </tr>"""
new_sub_module_row = """</label>
                                </td>
                              ))}
                              <td style={{ padding: '12px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                                <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={PERMISSIONS.every(p => isPermissionChecked(`${module}-${sub}`, p))}
                                    onChange={() => handleToggleRow(`${module}-${sub}`)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} 
                                  />
                                </label>
                              </td>
                            </tr>"""
content = content.replace(sub_module_row, new_sub_module_row, 1)


with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

