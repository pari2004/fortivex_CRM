const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "export type Role = 'admin' | 'counselor' | 'manager' | 'marketing' | 'member';",
  "export type Role = 'it' | 'admin' | 'counselor' | 'manager' | 'marketing' | 'member';"
);

content = content.replace(
  "'admin': 'Admin',",
  "'it': 'IT',\n          'admin': 'Admin',"
);

content = content.replace(
  "if (role === 'admin') return true; // Admins see all for demo unless restricted",
  "if (role === 'it') return true; // IT is the ultimate super admin"
);

fs.writeFileSync(file, content);
console.log("Updated AuthContext for IT role");
