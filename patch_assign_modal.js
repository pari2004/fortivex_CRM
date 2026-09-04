const fs = require('fs');
const file = 'src/components/dashboard/modals/AssignLeadsModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Wrap the return in AnimatePresence and remove early return
content = content.replace(
  `  if (!isOpen) return null;\n\n  return (\n    <div style={{ position: 'fixed'`,
  `  return (\n    <AnimatePresence>\n      {isOpen && (\n        <div style={{ position: 'fixed'`
);

content = content.replace(
  `      </motion.div>\n    </div>\n  );\n}`,
  `      </motion.div>\n    </div>\n      )}\n    </AnimatePresence>\n  );\n}`
);

// Increase zIndex just in case
content = content.replace(/zIndex: 100000/g, 'zIndex: 999999');

fs.writeFileSync(file, content);
console.log("Patched AssignLeadsModal");
