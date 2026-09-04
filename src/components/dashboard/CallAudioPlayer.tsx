import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCcw, RefreshCw, Activity, Download, Volume2, VolumeX } from 'lucide-react';

export default function CallAudioPlayer({ duration }: { duration: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  
  
  
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

  const toggleSpeed = () => {
    const nextSpeed = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1;
    setPlaybackRate(nextSpeed);
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const text = "Hello. This is a demo call recording. We discussed the product features, pricing plans, and the upcoming follow-up schedule. Thank you for your time.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = nextSpeed;
      utterance.volume = isMuted ? 0 : 1;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  
  const skipBack = () => setProgress(p => Math.max(p - 10, 0));
  const skipForward = () => setProgress(p => Math.min(p + 10, 15));

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      const text = "Hello. This is a demo call recording. We discussed the product features, pricing plans, and the upcoming follow-up schedule. Thank you for your time.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.volume = isMuted ? 0 : 1;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Simulate progress
      timerRef.current = setInterval(() => {
        setProgress(p => Math.min(p + 1, 15)); // 15 seconds demo
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
      <div 
        onClick={togglePlay}
        style={{ background: '#334155', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
        <span onClick={skipBack} style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', userSelect: 'none' }}><RefreshCcw size={14} /> 10</span>
        <span onClick={skipForward} style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', userSelect: 'none' }}><RefreshCw size={14} /> 10</span>
      </div>
      
      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{formatTime(progress)}</span>
      
      {/* Audio Waveform Mockup */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px', position: 'relative' }}>
        {Array.from({length: 50}).map((_, i) => (
          <div key={i} style={{ 
            height: i % 4 === 0 ? '12px' : '6px', 
            width: '2px', 
            background: i < (progress / 15) * 50 ? '#4f46e5' : '#cbd5e1', 
            borderRadius: '1px',
            transition: 'background 0.3s ease'
          }}></div>
        ))}
      </div>
      
      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
        {duration || '0:00'}
      </span>
      
      <div onClick={toggleSpeed} style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer', userSelect: 'none' }}>
        <Activity size={14} /> {playbackRate} x
      </div>
      
      {isMuted ? (
        <VolumeX size={18} color="#64748b" cursor="pointer" onClick={toggleMute} />
      ) : (
        <Volume2 size={18} color="#64748b" cursor="pointer" onClick={toggleMute} />
      )}
      <Download size={18} color="#64748b" cursor="pointer" onClick={handleDownload} />
    </div>
  );
}
