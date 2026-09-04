const fs = require('fs');
const files = [
  'src/components/dashboard/modals/LeadWorkspaceModal.tsx',
  'src/components/dashboard/modals/UserWorkspaceModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<span>Owner: \{currentLead\.owner\}<\/span>/g, '<span>Owner: {currentLead.owner || currentLead.counselor || currentLead.assignedTo || "Unassigned"}</span>');
  content = content.replace(/<span>Owner: \{displayLead\.owner \|\| currentUser\.name\}<\/span>/g, '<span>Owner: {displayLead.owner || displayLead.counselor || displayLead.assignedTo || currentUser?.name || "Unassigned"}</span>');
  fs.writeFileSync(file, content);
  console.log("Updated", file);
});
