const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/CallAudioPlayer.tsx', 'utf8');

content = content.replace("const [progress, setProgress] = useState(0);", "const [progress, setProgress] = useState(0);\n  const [playbackRate, setPlaybackRate] = useState(1);");

const toggleSpeedStr = `
  const toggleSpeed = () => {
    const nextSpeed = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1;
    setPlaybackRate(nextSpeed);
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const text = "Hello. This is a demo call recording. We discussed the product features, pricing plans, and the upcoming follow-up schedule. Thank you for your time.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = nextSpeed;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };
`;

content = content.replace("const togglePlay = () => {", toggleSpeedStr + "\n  const togglePlay = () => {");
content = content.replace("const utterance = new SpeechSynthesisUtterance(text);", "const utterance = new SpeechSynthesisUtterance(text);\n      utterance.rate = playbackRate;");

content = content.replace(
  `<div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>\n        <Activity size={14} /> 1 x\n      </div>`,
  `<div onClick={toggleSpeed} style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer', userSelect: 'none' }}>\n        <Activity size={14} /> {playbackRate} x\n      </div>`
);

fs.writeFileSync('src/components/dashboard/CallAudioPlayer.tsx', content);
console.log("Updated CallAudioPlayer.tsx");
