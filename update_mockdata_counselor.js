const fs = require('fs');
const file = 'src/lib/data/mockData.ts';
let content = fs.readFileSync(file, 'utf8');

const replaceCounselor = `export const counselorList = ['Pavan', 'Sales Manager', 'Admin', 'Rahul Sharma', 'Priya Nair'];`;
content = content.replace(
  "export const counselorList = ['Rahul Sharma', 'Priya Nair', 'Admin User', 'Sanjay Kumar', 'Aditi Rao'];",
  replaceCounselor
);

fs.writeFileSync(file, content);
console.log("Updated mockData counselors");
