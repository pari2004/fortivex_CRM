const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Disable edit for IT role
content = content.replace(
  "onClick={() => handleEditRole(role)}",
  "onClick={() => { if (role.name !== 'IT') handleEditRole(role); }}"
);
content = content.replace(
  "<Edit2 size={16} />",
  "{role.name === 'IT' ? <Lock size={16} color=\"var(--text-tertiary)\" /> : <Edit2 size={16} />}"
);

// Prevent IT role from showing the hover effect or cursor pointer if needed, but simple lock icon is fine.
// Wait, I need to make sure Lock is imported from lucide-react. Let's see if Lock is imported.
if (!content.includes("Lock,")) {
  content = content.replace("import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Users, Shield, Check, X, ShieldAlert } from 'lucide-react';", "import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Users, Shield, Check, X, ShieldAlert, Lock } from 'lucide-react';");
}

fs.writeFileSync(file, content);
console.log("Updated roles UI for IT role");
