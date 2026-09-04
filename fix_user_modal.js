const fs = require('fs');
const file = 'src/components/dashboard/modals/UserWorkspaceModal.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("const filteredActivities = (displayLeadForScope.activities || []).filter", "const filteredActivities = getEnrichedActivities(displayLeadForScope).filter");
fs.writeFileSync(file, content);
console.log("Fixed UserWorkspaceModal");
