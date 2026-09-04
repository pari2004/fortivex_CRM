const fs = require('fs');
const file = 'src/components/common/DataToolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRoot = `<div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>`;
const newRoot = `<div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 30 }}>`;
content = content.replace(oldRoot, newRoot);

fs.writeFileSync(file, content);
console.log("Fixed DataToolbar z-index");
