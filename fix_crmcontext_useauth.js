const fs = require('fs');
const file = 'src/contexts/CRMContext.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { useAuth } from '@/contexts/AuthContext';")) {
  content = content.replace(
    "import { CRMProperty, defaultPropertiesData } from '@/lib/data/propertiesData';",
    "import { CRMProperty, defaultPropertiesData } from '@/lib/data/propertiesData';\nimport { useAuth } from '@/contexts/AuthContext';"
  );
}

fs.writeFileSync(file, content);
console.log("Added useAuth to CRMContext imports");
