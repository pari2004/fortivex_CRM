const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("managerId?: string;")) {
  content = content.replace(
    "role: Role;",
    "role: Role;\n  managerId?: string;\n  teamId?: string;"
  );
}

if (!content.includes("canViewUser")) {
  content = content.replace(
    "hasPermission: (module: string) => boolean;",
    "hasPermission: (module: string) => boolean;\n  canViewUser: (targetUserId?: string) => boolean;\n  canManageUser: (targetUserId?: string) => boolean;"
  );
}

fs.writeFileSync(file, content);
console.log("Updated AuthContext types");
