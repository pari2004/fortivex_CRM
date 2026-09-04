const fs = require('fs');

function processFile(file, leadVarName) {
    let content = fs.readFileSync(file, 'utf8');

    const timelineStartMarker = "{/* Timeline Content */}";
    const timelineStartIdx = content.indexOf(timelineStartMarker);
    if (timelineStartIdx === -1) {
        console.log(`Could not find Timeline Content in ${file}`);
        return;
    }

    // find the matching end of the Timeline Content div
    // It's the `</div>` that matches `<div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>`
    // Let's just find `})()}\n\n                </div>\n              </div>`
    const endMatchRegex = /}\)\(\)\}[\s\n]*<\/div>[\s\n]*<\/div>/;
    const match = content.match(endMatchRegex);
    if (!match) {
        console.log(`Could not find end of Timeline Content in ${file}`);
        return;
    }

    const timelineEndIdx = match.index + match[0].length;

    let before = content.slice(0, timelineStartIdx);
    let timelineContent = content.slice(timelineStartIdx, timelineEndIdx);
    let after = content.slice(timelineEndIdx);

    const tasksBlock = `

              {/* Tasks Content */}
              {activeTab === 'Tasks' && (
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>
                  <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {(${leadVarName}?.tasks && ${leadVarName}.tasks.length > 0) ? (
                      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ position: 'absolute', top: '20px', bottom: '20px', left: '19px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                        {${leadVarName}.tasks.map((task: any, idx: number) => (
                          <div key={task.id || idx} style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, border: '4px solid #f8fafc' }}>
                              <CheckSquare size={18} />
                            </div>
                            <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '1.05rem' }}>{task.title}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{task.dueDate instanceof Date ? task.dueDate.toLocaleDateString() : task.dueDate}</div>
                              </div>
                              {task.description && (
                                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
                                  {task.description}
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', background: task.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: task.status === 'Completed' ? '#166534' : '#854d0e' }}>
                                  {task.status || 'Pending'}
                                </span>
                                {task.priority && (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px', background: task.priority === 'High' ? '#fee2e2' : '#f1f5f9', color: task.priority === 'High' ? '#991b1b' : '#475569' }}>
                                    {task.priority} Priority
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              )}
`;

    // Wrap timelineContent in {activeTab === 'Integration' && ( ... )}
    // BUT timelineContent already includes `{/* Timeline Content */}`
    // Let's strip it from timelineContent and put it outside.
    timelineContent = timelineContent.replace("{/* Timeline Content */}", "");
    
    const newTimelineContent = `
              {/* Timeline Content */}
              {activeTab === 'Integration' && (
                ${timelineContent}
              )}
`;

    fs.writeFileSync(file, before + newTimelineContent + tasksBlock + after);
    console.log(`Processed ${file}`);
}

processFile('src/components/dashboard/modals/LeadWorkspaceModal.tsx', 'currentLead');
processFile('src/components/dashboard/modals/UserWorkspaceModal.tsx', 'displayLeadForScope');
