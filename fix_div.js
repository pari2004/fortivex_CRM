const fs = require('fs');
const file = 'src/components/leads/tabs/LeadsDefaultView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldEnd = `          </table>
          {filteredData.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found. Try adjusting your filters.</div>
          )}
        </div>`;

const newEnd = `          </table>
          </div>
          {filteredData.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found. Try adjusting your filters.</div>
          )}
        </div>`;

content = content.replace(oldEnd, newEnd);
fs.writeFileSync(file, content);
console.log("Fixed missing div");
