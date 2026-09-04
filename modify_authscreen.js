const fs = require('fs');
const file = 'src/components/auth/AuthScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const DEMO_ACCOUNTS: User[] = [",
  "const DEMO_ACCOUNTS: User[] = [\n  { id: '0', name: 'IT Super Admin', mobile: '0000000000', role: 'it'      },"
);

content = content.replace(
  "const DEMO_PASSWORDS: Record<string, string> = {",
  "const DEMO_PASSWORDS: Record<string, string> = {\n  it:         'IT@123',"
);

fs.writeFileSync(file, content);
console.log("Updated AuthScreen credentials");
