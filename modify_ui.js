const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTable = `{allowedModules.map((module, i) => (
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
                    ))}`;

const newTable = `{FLAT_MODULES.map((moduleObj, i) => {
                      const module = moduleObj.name;
                      const depth = moduleObj.depth;
                      return (
                      <tr key={module} style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                        <td 
                          onClick={() => handleNavigate(module)}
                          style={{ 
                            padding: '16px', 
                            paddingLeft: \`\${16 + depth * 24}px\`,
                            fontWeight: depth === 0 ? 600 : 400, 
                            position: 'sticky', 
                            left: 0, 
                            background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)', 
                            zIndex: 1, 
                            borderRight: '1px solid var(--glass-border)', 
                            cursor: 'pointer', 
                            color: depth === 0 ? 'var(--primary-color)' : 'var(--text-primary)' 
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {depth === 0 ? <LinkIcon size={14} /> : <div style={{width: '14px', height: '1px', background: 'var(--text-secondary)'}} />}
                            {module}
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
                    );
                    })}`;

content = content.replace(oldTable, newTable);
fs.writeFileSync(file, content);
console.log("Updated UI table");
