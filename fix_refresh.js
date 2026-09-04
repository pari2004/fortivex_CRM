const fs = require('fs');
const files = ['src/components/dashboard/modals/LeadWorkspaceModal.tsx', 'src/components/dashboard/modals/UserWorkspaceModal.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("setSubFilter('All');", "");
  fs.writeFileSync(file, content);
});
console.log("Fixed refresh to preserve tab");
