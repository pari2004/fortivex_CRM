const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<tr key={module} style={{ borderBottom: \'1px solid var(--glass-border)\', background: i % 2 === 0 ? \'transparent\' : \'rgba(0,0,0,0.02)\' }}>',
  '<tr key={`${module}-${i}`} style={{ borderBottom: \'1px solid var(--glass-border)\', background: i % 2 === 0 ? \'transparent\' : \'rgba(0,0,0,0.02)\' }}>'
);

fs.writeFileSync(file, content);
console.log("Fixed duplicate React key in Permissions table");
