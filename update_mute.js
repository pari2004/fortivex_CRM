const fs = require('fs');
const file = 'src/components/dashboard/CallAudioPlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { Play, Pause, RefreshCcw, RefreshCw, Activity, Download, Volume2 } from 'lucide-react';",
  "import { Play, Pause, RefreshCcw, RefreshCw, Activity, Download, Volume2, VolumeX } from 'lucide-react';"
);

content = content.replace(
  "const [playbackRate, setPlaybackRate] = useState(1);",
  "const [playbackRate, setPlaybackRate] = useState(1);\n  const [isMuted, setIsMuted] = useState(false);"
);

const toggleMuteFunc = `
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const text = "Hello. This is a demo call recording. We discussed the product features, pricing plans, and the upcoming follow-up schedule. Thank you for your time.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.volume = nextMuted ? 0 : 1;
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

content = content.replace("const toggleSpeed = () => {", toggleMuteFunc + "\n  const toggleSpeed = () => {");

// Add volume to toggleSpeed
content = content.replace(
  "utterance.rate = nextSpeed;\n      utterance.onend = () => {",
  "utterance.rate = nextSpeed;\n      utterance.volume = isMuted ? 0 : 1;\n      utterance.onend = () => {"
);

// Add volume to togglePlay
content = content.replace(
  "utterance.rate = playbackRate;\n      utterance.onend = () => {",
  "utterance.rate = playbackRate;\n      utterance.volume = isMuted ? 0 : 1;\n      utterance.onend = () => {"
);

// Replace Volume2 icon with toggle
content = content.replace(
  `<Volume2 size={18} color="#64748b" cursor="pointer" />`,
  `{isMuted ? (
        <VolumeX size={18} color="#64748b" cursor="pointer" onClick={toggleMute} />
      ) : (
        <Volume2 size={18} color="#64748b" cursor="pointer" onClick={toggleMute} />
      )}`
);

fs.writeFileSync(file, content);
console.log("Updated Mute functionality");
