const fs = require('fs');
const file = 'src/lib/data/systemData.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("'ROL-000'")) {
  content = content.replace(
    "export const rolesData: Role[] = [",
    "export const rolesData: Role[] = [\n  { id: 'ROL-000', name: 'IT', userCount: 1, status: 'Active', description: 'Ultimate Super Admin', lastUpdated: '2026-08-01T10:00:00Z' },"
  );
  fs.writeFileSync(file, content);
  console.log("Added IT role to systemData");
}
