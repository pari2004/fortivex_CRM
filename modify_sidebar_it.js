const fs = require('fs');
const file = 'src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// I just need to add 'it: [],' to the start of navMenus, because Sidebar dynamic filtering already falls back to admin menu if needed, or I can copy admin menu.
// Actually, `const activeGroups = masterMenu.map(group => {` where `masterMenu = navMenus['admin'] || navMenus[role] || [];`. So empty array for `it` is fine.

content = content.replace(
  "const navMenus: Record<Role, NavGroup[]> = {",
  "const navMenus: Record<Role, NavGroup[]> = {\n  it: [],"
);

fs.writeFileSync(file, content);
console.log("Updated Sidebar for IT role type requirement");
