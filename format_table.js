const fs = require('fs');
const file = 'src/components/dashboard/modals/WorkPipelineListModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update renderCell
const oldRenderCell = `  const renderCell = (col: string, lead: any) => {
    if (col === 'Lead Name') return lead.name;
    if (col === 'Mobile Number') return lead.phone || lead.mobile;
    if (col === 'Email') return lead.email;
    if (col === 'Lead Stage') return lead.status;
    if (col === 'Lead Owner') return lead.counselor || lead.assignedTo;
    if (col === 'Next Follow-up') return lead.nextFollowUp || '-';
    if (col === 'Lead Priority') return lead.priority || '-';
    if (col === 'Created') return lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-';
    
    // Map dynamically or return placeholder
    const mapped = lead[col.replace(/\\s/g, '')];
    if (mapped !== undefined) return mapped;
    return '-';
  };`;

const newRenderCell = `  const renderCell = (col: string, lead: any) => {
    if (col === 'Lead Name') return lead.name;
    if (col === 'Mobile Number') return lead.phone || lead.mobile;
    if (col === 'Email') return lead.email;
    if (col === 'Lead Stage') return (
      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} />
        {lead.status}
      </span>
    );
    if (col === 'Lead Owner') return lead.counselor || lead.assignedTo || lead.owner || '-';
    if (col === 'Next Follow-up') return lead.nextFollowUp || <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
    if (col === 'Lead Priority') {
      const p = lead.priority || '-';
      if (p === '-') return <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
      const bg = p === 'High' ? '#fee2e2' : p === 'Medium' ? '#fef3c7' : '#f3f4f6';
      const color = p === 'High' ? '#991b1b' : p === 'Medium' ? '#92400e' : '#374151';
      return <span style={{ background: bg, color, padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>{p}</span>;
    }
    if (col === 'Created') return lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
    
    const mapped = lead[col.replace(/\\s/g, '')];
    if (mapped !== undefined) return mapped;
    return <span style={{ color: 'var(--text-tertiary)' }}>-</span>;
  };`;

content = content.replace(oldRenderCell, newRenderCell);

// Update Table Layout
const oldTableArea = `{/* Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <table style={{ width: 'max-content', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 2, minWidth: '50px' }}>
                  <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === filteredData.length} onChange={handleSelectAll} />
                </th>
                {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map(col => (
                  <th key={col} style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 'bold', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 2, minWidth: '150px' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d: any) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }} className="hover-bg-secondary">
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <input type="checkbox" checked={selectedIds.has(d.id)} onChange={() => handleSelectOne(d.id)} onClick={e => e.stopPropagation()} />
                  </td>
                  {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx) => (
                    <td key={col} style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                      {idx === 0 ? (
                        <div 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#8b5cf6', fontWeight: 500 }}
                          onClick={() => setFullViewLead(d)}
                        >
                          <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4f46e5' }}>
                            {String(d.name).charAt(0) || 'L'}
                          </div>
                          {renderCell(col, d)}
                        </div>
                      ) : (
                        renderCell(col, d)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.size + 1} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>`;

const newTableArea = `{/* Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', background: '#eef2ff', color: '#3730a3', fontWeight: 600, borderRight: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 2, width: '40px' }}>
                    <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === filteredData.length} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                  </th>
                  {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => (
                    <th key={col} style={{ padding: '14px 24px', textAlign: 'left', fontWeight: 600, color: '#3730a3', background: '#eef2ff', borderRight: idx === arr.length - 1 ? 'none' : '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 2, whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d: any, rowIdx: number) => (
                  <tr key={d.id} style={{ borderBottom: rowIdx === filteredData.length - 1 ? 'none' : '1px solid var(--glass-border)', transition: 'background 0.2s', background: 'var(--bg-card)' }} className="hover-bg-secondary" onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}>
                    <td style={{ padding: '14px 16px', textAlign: 'left', borderRight: '1px solid var(--glass-border)' }}>
                      <input type="checkbox" checked={selectedIds.has(d.id)} onChange={() => handleSelectOne(d.id)} onClick={e => e.stopPropagation()} style={{ cursor: 'pointer' }} />
                    </td>
                    {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => (
                      <td key={col} style={{ padding: '14px 24px', whiteSpace: 'nowrap', borderRight: idx === arr.length - 1 ? 'none' : '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                        {idx === 0 ? (
                          <div 
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#4f46e5', fontWeight: 500 }}
                            onClick={() => setFullViewLead(d)}
                          >
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#4338ca', fontWeight: 'bold' }}>
                              {String(d.name).charAt(0).toUpperCase() || 'L'}
                            </div>
                            {renderCell(col, d)}
                          </div>
                        ) : (
                          renderCell(col, d)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={visibleColumns.size + 1} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>`;

content = content.replace(oldTableArea, newTableArea);
fs.writeFileSync(file, content);
console.log("Updated Table Styles");
