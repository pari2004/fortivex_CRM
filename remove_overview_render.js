const fs = require('fs');
const file = 'src/components/dashboard/modals/UserWorkspaceModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const overviewStart = content.indexOf("{activeTab === 'Overview' ? (");
const timelineStart = content.indexOf("<div style={{ maxWidth: '800px'");

if (overviewStart !== -1 && timelineStart !== -1) {
    const before = content.slice(0, overviewStart);
    let after = content.slice(timelineStart);
    
    // find the matching closing bracket for the ternary operator
    // it looks like 
    //   </div>
    // )}
    // </div>
    // at the end of the timeline Content
    after = after.replace(/}\)\(\)}[\s\n]*<\/div>[\s\n]*\)}[\s\n]*<\/div>/g, "})()}</div></div>");
    
    fs.writeFileSync(file, before + after);
    console.log("Successfully removed overview render block");
} else {
    console.log("Could not find start points");
}
