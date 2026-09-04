const fs = require('fs');
const file = 'src/components/dashboard/modals/UserWorkspaceModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { getEnrichedActivities }")) {
  content = content.replace("import { useCRM }", "import { getEnrichedActivities } from '@/utils/demoActivities';\nimport { useCRM }");
}

content = content.replace(/\(displayLeadForScope\?\.activities \|\| \[\]\)/g, "getEnrichedActivities(displayLeadForScope)");
content = content.replace("const filteredActivities = (displayLeadForScope?.activities || []).filter", "const filteredActivities = getEnrichedActivities(displayLeadForScope).filter");
// Wait, in UserWorkspaceModal it might be slightly different. Let's see:
fs.writeFileSync(file, content);
console.log("Updated UserWorkspaceModal");
