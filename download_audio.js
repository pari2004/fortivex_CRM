const fs = require('fs');
const file = 'src/components/dashboard/CallAudioPlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

const downloadFunc = `
  const handleDownload = () => {
    const text = "Hello. This is a demo call recording. We discussed the product features, pricing plans, and the upcoming follow-up schedule. Thank you for your time.";
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo_call_transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
`;

content = content.replace("const toggleMute = () => {", downloadFunc + "\n  const toggleMute = () => {");
content = content.replace(
  `onClick={() => alert("Downloading recording...")}`,
  `onClick={handleDownload}`
);

fs.writeFileSync(file, content);
console.log("Updated download functionality");
