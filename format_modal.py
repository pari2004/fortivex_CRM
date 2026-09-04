import re

with open('src/components/dashboard/modals/WorkPipelineListModal.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
import_lucide = "import { X, Search, Filter, RefreshCw, LayoutTemplate, Save } from 'lucide-react';"
new_import_lucide = "import { X, Search, Filter, RefreshCw, LayoutTemplate, Save, User, Flag, Calendar, Phone, Star, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical } from 'lucide-react';"
content = content.replace(import_lucide, new_import_lucide)

# 2. Add pagination states
state_search = "const [searchQuery, setSearchQuery] = useState('');"
state_replace = """const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;"""
content = content.replace(state_search, state_replace)

# 3. Update pagination logic (just visually in the table)
# Actually let's just replace the entire return statement.
return_idx = content.find("return createPortal(")
if return_idx != -1:
    before_return = content[:return_idx]
    
    # We will reconstruct the return statement.
    new_return = """return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: 'white', width: '95vw', height: '90vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--glass-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{title}</h2>
            <div style={{ background: '#4338ca', color: 'white', padding: '4px 16px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
              Showing Filtered Leads - {filteredData.length}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ padding: '8px 24px 16px 24px', display: 'flex', gap: '12px', alignItems: 'center', background: 'white', position: 'relative', zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '8px', width: '320px', border: '1px solid #e5e7eb' }}>
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search name or phone number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '8px', color: '#111827', fontSize: '0.9rem' }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
              <Filter size={16} color="#6b7280" /> Filter
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Filters</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    <option>All Stages</option>
                    <option>New Lead</option>
                    <option>Working</option>
                  </select>
                  <button onClick={() => setFilterOpen(false)} className="primary-btn" style={{ padding: '8px', borderRadius: '6px' }}>Apply Filters</button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => { showToast('Data refreshed'); setData([...data]); }} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
            <RefreshCw size={16} color="#6b7280" /> Refresh
          </button>
          
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowCustomize(!showCustomize); setTempVisibleColumns(new Set(visibleColumns)); }} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
              <LayoutTemplate size={16} color="#6b7280" /> Customize Columns
            </button>
            {showCustomize && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                   <h4 style={{ fontWeight: 'bold' }}>Visible Columns</h4>
                   <button onClick={handleSaveColumns} className="primary-btn" style={{ padding: '4px 12px', fontSize: '12px' }}><Save size={12} style={{ marginRight: '4px' }}/> Save</button>
                </div>
                {ALL_COLUMNS.map(col => (
                  <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={tempVisibleColumns.has(col)}
                      onChange={(e) => {
                        const newSet = new Set(tempVisibleColumns);
                        if (e.target.checked) newSet.add(col);
                        else newSet.delete(col);
                        setTempVisibleColumns(newSet);
                      }}
                    />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px', background: 'white' }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', borderRight: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 2, width: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={selectedIds.size > 0 && selectedIds.size === filteredData.length} onChange={handleSelectAll} style={{ cursor: 'pointer', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #4338ca' }} />
                    </div>
                  </th>
                  {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => {
                    let icon = null;
                    if (col === 'Lead Name') icon = <User size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Owner') icon = <User size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Stage') icon = <Flag size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Next Follow-up') icon = <Calendar size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Mobile Number') icon = <Phone size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Lead Priority') icon = <Star size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;
                    else if (col === 'Created') icon = <Calendar size={14} style={{ marginRight: '6px', color: '#4338ca' }} />;

                    return (
                      <th key={col} style={{ padding: '14px 24px', textAlign: 'left', fontWeight: 600, color: '#4338ca', background: '#f8fafc', borderRight: idx === arr.length - 1 ? 'none' : '1px solid #f3f4f6', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 2, whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {icon}
                            {col}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px', opacity: 0.3 }}>
                            <ChevronUp size={10} style={{ marginBottom: '-2px' }} />
                            <ChevronDown size={10} style={{ marginTop: '-2px' }} />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, rowsPerPage).map((d: any, rowIdx: number) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', background: 'white' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #f3f4f6' }}>
                      <input type="checkbox" checked={selectedIds.has(d.id)} onChange={() => handleSelectOne(d.id)} onClick={e => e.stopPropagation()} style={{ cursor: 'pointer', width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
                    </td>
                    {ALL_COLUMNS.filter(col => visibleColumns.has(col)).map((col, idx, arr) => (
                      <td key={col} style={{ padding: '12px 24px', whiteSpace: 'nowrap', borderRight: idx === arr.length - 1 ? 'none' : '1px solid #f3f4f6', color: '#374151' }}>
                        {col === 'Lead Name' ? (
                          <div 
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#4338ca', fontWeight: 500 }}
                            onClick={() => setFullViewLead(d)}
                          >
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#4338ca', fontWeight: 'bold' }}>
                              {String(d.name).charAt(0).toUpperCase() || 'M'}
                            </div>
                            {d.name}
                          </div>
                        ) : col === 'Lead Owner' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.counselor || d.assignedTo || 'Owner')}&background=random&size=24`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <span style={{ fontWeight: 500 }}>{d.counselor || d.assignedTo || 'Owner'}</span>
                          </div>
                        ) : col === 'Lead Stage' ? (
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                            {d.status || 'New Lead'}
                          </span>
                        ) : col === 'Lead Priority' ? (
                          <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {d.priority || '--'}
                          </span>
                        ) : col === 'Created' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                            <span style={{ color: '#111827' }}>10/05/2024</span>
                            <span style={{ color: '#6b7280' }}>10:30 AM</span>
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
                    <td colSpan={visibleColumns.size + 1} style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination Footer */}
            <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', background: 'white' }}>
              <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                Showing 1 to {Math.min(filteredData.length, rowsPerPage)} of {filteredData.length} leads
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronsLeft size={16} /></button>
                <button style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                <button style={{ background: '#4338ca', border: '1px solid #4338ca', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>1</button>
                <button style={{ background: 'white', border: '1px solid #e5e7eb', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>2</button>
                <button style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                <button style={{ background: 'white', border: '1px solid #e5e7eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}><ChevronsRight size={16} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                <span>Rows per page:</span>
                <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', outline: 'none' }}>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {viewLead && (
            <LeadPreviewModal isOpen={!!viewLead} onClose={() => setViewLead(null)} lead={viewLead} onViewLead={(l) => { setViewLead(null); setFullViewLead(l); }} />
        )}
        {fullViewLead && (
            <LeadWorkspaceModal isOpen={!!fullViewLead} onClose={() => setFullViewLead(null)} lead={fullViewLead} />
        )}
      </motion.div>
    </div>,
    document.body
  );
}
"""

    with open('src/components/dashboard/modals/WorkPipelineListModal.tsx', 'w') as out_f:
        out_f.write(before_return + new_return)

