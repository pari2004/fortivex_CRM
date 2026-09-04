const fs = require('fs');

// Fix AuthContext.tsx
let authContext = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
authContext = authContext.replace("import { DEMO_ACCOUNTS } from '@/lib/data/mockUsers';", "import { getDynamicAccounts } from '@/lib/data/mockUsers';");
authContext = authContext.replace(/DEMO_ACCOUNTS\.find/g, "getDynamicAccounts().find");
fs.writeFileSync('src/contexts/AuthContext.tsx', authContext);

// Fix AuthScreen.tsx
let authScreen = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');
authScreen = authScreen.replace("import { DEMO_ACCOUNTS, DEMO_PASSWORDS } from '@/lib/data/mockUsers';", "import { getDynamicAccounts, getDynamicPasswords } from '@/lib/data/mockUsers';");
authScreen = authScreen.replace(/DEMO_ACCOUNTS/g, "getDynamicAccounts()");
authScreen = authScreen.replace(/DEMO_PASSWORDS/g, "getDynamicPasswords()");
fs.writeFileSync('src/components/auth/AuthScreen.tsx', authScreen);

console.log("Updated references to dynamic mock users");
