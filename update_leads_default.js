const fs = require('fs');
const file = 'src/components/leads/tabs/LeadsDefaultView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Table Area Wrapper
const oldTableStart = `<div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: '16px 24px', width: '40px', borderBottom: '1px solid var(--glass-border)' }}><input type="checkbox" checked={selectedRows.size > 0 && selectedRows.size === paginatedData.length} onChange={toggleAll} style={{ cursor: 'pointer' }}/></th>
                {activeColumns.filter(c => c.visible).map(col => (
                  <th key={col.id} style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid var(--glass-border)' }}>{col.id}</th>
                ))}
                <th style={{ padding: '16px 24px', width: '50px', borderBottom: '1px solid var(--glass-border)', position: 'sticky', right: 0, background: 'var(--bg-secondary)', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => {`;

const newTableStart = `<div style={{ flex: 1, overflow: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: '14px 16px', width: '40px', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', background: '#eef2ff', color: '#3730a3', fontWeight: 600 }}><input type="checkbox" checked={selectedRows.size > 0 && selectedRows.size === paginatedData.length} onChange={toggleAll} style={{ cursor: 'pointer' }}/></th>
                {activeColumns.filter(c => c.visible).map(col => (
                  <th key={col.id} style={{ padding: '14px 24px', background: '#eef2ff', color: '#3730a3', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>{col.id}</th>
                ))}
                <th style={{ padding: '14px 24px', width: '50px', borderBottom: '1px solid var(--glass-border)', position: 'sticky', right: 0, background: '#eef2ff', color: '#3730a3', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => {`;

content = content.replace(oldTableStart, newTableStart);

// Update TR styling
const oldTrStart = `<tr key={row.id || idx} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(row.id) ? 'var(--bg-secondary)' : 'transparent', transition: 'background 0.2s' }} className="hover-bg-secondary">
                    <td style={{ padding: '16px 24px' }}>
                      <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => { const next = new Set(selectedRows); if (next.has(row.id)) next.delete(row.id); else next.add(row.id); setSelectedRows(next); }} style={{ cursor: 'pointer' }} />
                    </td>`;

const newTrStart = `<tr key={row.id || idx} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(row.id) ? '#f8fafc' : 'var(--bg-card)', transition: 'background 0.2s' }} className="hover-bg-secondary" onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = selectedRows.has(row.id) ? '#f8fafc' : 'var(--bg-card)'}>
                    <td style={{ padding: '14px 16px', borderRight: '1px solid var(--glass-border)' }}>
                      <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => { const next = new Set(selectedRows); if (next.has(row.id)) next.delete(row.id); else next.add(row.id); setSelectedRows(next); }} style={{ cursor: 'pointer' }} />
                    </td>`;

content = content.replace(oldTrStart, newTrStart);

fs.writeFileSync(file, content);
console.log("Updated TR start");
