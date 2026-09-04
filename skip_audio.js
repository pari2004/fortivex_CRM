const fs = require('fs');
const file = 'src/components/dashboard/CallAudioPlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

const funcs = `
  const skipBack = () => setProgress(p => Math.max(p - 10, 0));
  const skipForward = () => setProgress(p => Math.min(p + 10, 15));
`;

content = content.replace("const togglePlay = () => {", funcs + "\n  const togglePlay = () => {");
content = content.replace(
  `<span style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}><RefreshCcw size={14} /> 10</span>`,
  `<span onClick={skipBack} style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', userSelect: 'none' }}><RefreshCcw size={14} /> 10</span>`
);
content = content.replace(
  `<span style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}><RefreshCw size={14} /> 10</span>`,
  `<span onClick={skipForward} style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', userSelect: 'none' }}><RefreshCw size={14} /> 10</span>`
);

fs.writeFileSync(file, content);
console.log("Updated skip forward/back");
