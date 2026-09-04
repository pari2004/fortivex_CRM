const fs = require('fs');
const file = 'src/components/leads/tabs/LeadsDefaultView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldMapStart = `{activeColumns.filter(c => c.visible).map(col => {
                      // Render logic for each column
                      let content: React.ReactNode = '—';
                      
                      switch (col.id) {
                        case 'Lead Name': 
                          content = <div style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => setViewLead(row)}>{row.name}</div>; break;`;

const newMapStart = `{activeColumns.filter(c => c.visible).map(col => {
                      // Render logic for each column
                      let content: React.ReactNode = <span style={{ color: 'var(--text-tertiary)' }}>—</span>;
                      
                      switch (col.id) {
                        case 'Lead Name': 
                          content = (
                            <div 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }}
                              onClick={() => setViewLead(row)}
                            >
                              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#4338ca', fontWeight: 'bold' }}>
                                {String(row.name).charAt(0).toUpperCase() || 'L'}
                              </div>
                              {row.name}
                            </div>
                          ); 
                          break;`;
content = content.replace(oldMapStart, newMapStart);

const oldStage = `case 'Lead Stage':
                          content = (
                            <select 
                              value={row.status || 'New Lead'} 
                              onChange={(e) => {
                                if (updateLead) updateLead({ ...row, status: e.target.value as any });
                              }}
                              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', fontSize: '0.85rem' }}
                            >
                              {['New Lead', 'Attempted', 'Contacted', 'Nurturing', 'Closed Won', 'Closed Lost'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          );
                          break;`;

const newStage = `case 'Lead Stage':
                          content = (
                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', cursor: 'pointer' }} onClick={() => {}}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} />
                              <select 
                                value={row.status || 'New Lead'} 
                                onChange={(e) => {
                                  if (updateLead) updateLead({ ...row, status: e.target.value as any });
                                }}
                                style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', outline: 'none', cursor: 'pointer' }}
                              >
                                {['New Lead', 'Attempted', 'Contacted', 'Nurturing', 'Closed Won', 'Closed Lost'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </span>
                          );
                          break;`;
content = content.replace(oldStage, newStage);

const oldPriority = `case 'Lead Priority':
                          content = (
                            <select 
                              value={row.priority || 'Medium'} 
                              onChange={(e) => {
                                if (updateLead) updateLead({ ...row, priority: e.target.value as any });
                              }}
                              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', fontSize: '0.85rem' }}
                            >
                              {['High', 'Medium', 'Low'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          );
                          break;`;

const newPriority = `case 'Lead Priority':
                          content = (
                            <select 
                              value={row.priority || 'Medium'} 
                              onChange={(e) => {
                                if (updateLead) updateLead({ ...row, priority: e.target.value as any });
                              }}
                              style={{ 
                                padding: '4px 10px', borderRadius: '16px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none',
                                background: row.priority === 'High' ? '#fee2e2' : row.priority === 'Medium' ? '#fef3c7' : '#f3f4f6',
                                color: row.priority === 'High' ? '#991b1b' : row.priority === 'Medium' ? '#92400e' : '#374151'
                              }}
                            >
                              {['High', 'Medium', 'Low'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          );
                          break;`;
content = content.replace(oldPriority, newPriority);

const oldTdWrapper = `return (
                        <td key={col.id} style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          {content}
                        </td>
                      );`;
const newTdWrapper = `return (
                        <td key={col.id} style={{ padding: '14px 24px', whiteSpace: 'nowrap', borderRight: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                          {content}
                        </td>
                      );`;
content = content.replace(oldTdWrapper, newTdWrapper);

fs.writeFileSync(file, content);
console.log("Updated cell contents");
