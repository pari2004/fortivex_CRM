const fs = require('fs');
const file = 'src/components/dashboard/modals/LeadWorkspaceModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("const filteredActivities = (currentLead.activities || []).filter", "const filteredActivities = getEnrichedActivities(currentLead).filter");

fs.writeFileSync(file, content);
console.log("Updated LeadWorkspaceModal render");
