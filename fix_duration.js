const fs = require('fs');
const files = ['src/components/dashboard/modals/LeadWorkspaceModal.tsx', 'src/components/dashboard/modals/UserWorkspaceModal.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\{activity\.duration\.split\('m:'\)\[0\]\.split\('h:'\)\[1\]\}:\{activity\.duration\.split\('m:'\)\[1\]\?\.replace\('s', ''\)\}/g, "{activity.duration || '0:00'}");
  fs.writeFileSync(file, content);
});
console.log("Fixed duration display");
