const fs = require('fs');
const file = 'src/lib/data/mockData.ts';
let content = fs.readFileSync(file, 'utf8');

const replaceOwners = `const ownerList = ['Admin', 'Sales Manager', 'Pavan', 'Counselor', 'Member'];`;
content = content.replace(
  "const ownerList = ['Admin User', 'Sales Team', 'Marketing Team', 'Rahul Sharma', 'Priya Nair'];",
  replaceOwners
);

const replaceAddedBy = `const addedByList = ['Admin', 'Sales Manager', 'Pavan', 'Counselor', 'Member'];`;
content = content.replace(
  "const addedByList = ['Admin User', 'Sales Team', 'Marketing Team', 'Rahul Sharma', 'Priya Nair'];",
  replaceAddedBy
);

fs.writeFileSync(file, content);
console.log("Updated mockData owners");
