const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Disable delete for IT role
content = content.replace(
  "onClick={() => setDeleteConfirm(role.id)}",
  "onClick={() => { if (role.name !== 'IT') setDeleteConfirm(role.id); }}"
);
content = content.replace(
  "style={{ cursor: 'pointer' }}",
  "style={{ cursor: role.name === 'IT' ? 'not-allowed' : 'pointer', opacity: role.name === 'IT' ? 0.3 : 1 }}"
); // Applies opacity to the <td> containing edit and delete buttons

fs.writeFileSync(file, content);
console.log("Updated roles UI for IT delete");
