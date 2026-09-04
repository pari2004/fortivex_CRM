const fs = require('fs');
const file = 'src/components/auth/AuthScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const toReplace = `const DEMO_ACCOUNTS: User[] = [
  { id: '0', name: 'IT Super Admin', mobile: '0000000000', role: 'it'      },
  { id: '1', name: 'Admin',         mobile: '9876543210', role: 'admin'      },
  { id: '2', name: 'Counselor',     mobile: '9876543211', role: 'counselor'  },
  { id: '3', name: 'Sales Manager', mobile: '9876543212', role: 'manager'    },
  { id: '4', name: 'Marketing',     mobile: '9876543213', role: 'marketing'  },
  { id: '5', name: 'Member',        mobile: '9876543214', role: 'member'     },
];

const DEMO_PASSWORDS: Record<string, string> = {
  it:         'IT@123',
  admin:      'Admin@123',
  counselor:  'Counselor@123',
  manager:    'Sales@123',
  marketing:  'Marketing@123',
  member:     'Member@123',
};`;

content = content.replace(toReplace, "");
content = content.replace(
  "import { Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';",
  "import { Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';\nimport { DEMO_ACCOUNTS, DEMO_PASSWORDS } from '@/lib/data/mockUsers';"
);

// We also need to fix `loginPassword !== DEMO_PASSWORDS[account.role]` to use account.name if there are multiple counselors.
// Oh! DEMO_PASSWORDS in `AuthScreen` is keyed by role. But since Pavan's role is counselor and name is Pavan, I should key it by id or name if role is not enough. Let's fix that.
content = content.replace(
  "loginPassword !== DEMO_PASSWORDS[account.role]",
  "loginPassword !== (DEMO_PASSWORDS[account.name.toLowerCase()] || DEMO_PASSWORDS[account.role])"
);
content = content.replace(
  "setLoginPassword(DEMO_PASSWORDS[acc.role]);",
  "setLoginPassword(DEMO_PASSWORDS[acc.name.toLowerCase()] || DEMO_PASSWORDS[acc.role]);"
);

fs.writeFileSync(file, content);
console.log("Updated AuthScreen for external mock users");
