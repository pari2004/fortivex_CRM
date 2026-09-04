const fs = require('fs');

const leadFile = 'src/components/dashboard/modals/LeadWorkspaceModal.tsx';
let leadContent = fs.readFileSync(leadFile, 'utf8');
leadContent = leadContent.replace("{ id: 'Tasks', label: 'Tasks', count: 0, icon: CheckSquare }", "{ id: 'Tasks', label: 'Tasks', count: (currentLead?.tasks || []).length, icon: CheckSquare }");
fs.writeFileSync(leadFile, leadContent);

const userFile = 'src/components/dashboard/modals/UserWorkspaceModal.tsx';
let userContent = fs.readFileSync(userFile, 'utf8');
userContent = userContent.replace("{ id: 'Tasks', label: 'Tasks', count: 0, icon: CheckSquare }", "{ id: 'Tasks', label: 'Tasks', count: (displayLeadForScope?.tasks || []).length, icon: CheckSquare }");
fs.writeFileSync(userFile, userContent);

console.log("Updated Task counts");
