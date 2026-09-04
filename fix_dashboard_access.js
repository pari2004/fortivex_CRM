const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "{!['admin', 'counselor', 'manager', 'marketing', 'member'].includes(role) && <div>Access Denied</div>}",
  "{!['it', 'admin', 'counselor', 'manager', 'marketing', 'member'].includes(role) && <div>Access Denied</div>}"
);

content = content.replace(
  "{role === 'admin' && <AdminDashboard />}",
  "{(role === 'admin' || role === 'it') && <AdminDashboard />}"
);

fs.writeFileSync(file, content);
console.log("Fixed dashboard access for IT");
