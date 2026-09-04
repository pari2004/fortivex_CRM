const fs = require('fs');
const file = 'src/components/dashboard/modals/LeadWorkspaceModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { getEnrichedActivities }")) {
  content = content.replace("import { useCRM }", "import { getEnrichedActivities } from '@/utils/demoActivities';\nimport { useCRM }");
}

content = content.replace(/\(currentLead\?\.activities \|\| \[\]\)/g, "getEnrichedActivities(currentLead)");

fs.writeFileSync(file, content);
console.log("Updated LeadWorkspaceModal filters");
