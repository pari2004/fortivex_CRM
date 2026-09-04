const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "hasPermission: (module: string, action?: string) => boolean;",
  "hasPermission: (module: string, action?: string) => boolean;\n  canViewUser: (targetUserId?: string) => boolean;\n  canManageUser: (targetUserId?: string) => boolean;"
);

fs.writeFileSync(file, content);
console.log("Fixed AuthContextType");
