'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Sparkles, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles as SparklesIcon, Zap, Send, User, Mic, Volume2 } from 'lucide-react';
import * as THREE from 'three';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@ai-sdk/react';
import styles from './layout.module.css';

function NeuralLines() {
  const points = [];
  for (let i = 0; i < 5; i++) {
    points.push(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));
  }
  
  return (
    <group>
      {points.map((p, i) => (
        <Line key={i} points={[new THREE.Vector3(0,0,0), p]} color="#3b82f6" lineWidth={1} transparent opacity={0.3} />
      ))}
      {points.map((p, i) => (
        <mesh key={`dot-${i}`} position={p}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      ))}
    </group>
  );
}

function OrbMesh({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<any>(null);
  const coreRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.scale.setScalar(hovered ? 1.05 : 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.03);
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(hovered ? 1.2 : 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <MeshDistortMaterial color="#eff6ff" attach="material" distort={0.3} speed={2} roughness={0.1} metalness={0.9} transparent opacity={0.4} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={2} wireframe />
      </mesh>
      <Sparkles count={50} scale={3} size={2} speed={0.4} color="#60a5fa" />
      {hovered && <NeuralLines />}
    </Float>
  );
}

export function AiAssistantOrb() {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState(''); // Manage input state manually
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const initialMessage = { id: 'initial', role: 'assistant' as const, content: "Hello! I'm your AI assistant. How can I help you manage your leads today?" };
  
  const chat = useChat({
    api: '/api/chat',
    initialMessages: [initialMessage]
  } as any) as any;

  const messages = chat.messages || [];
  const error = chat.error;
  const isLoading = chat.isLoading || chat.status === 'streaming' || chat.status === 'submitted';
  const setMessages = chat.setMessages;

  useEffect(() => {
    const saved = sessionStorage.getItem('ai_assistant_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && typeof setMessages === 'function') {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 1) {
      sessionStorage.setItem('ai_assistant_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (!isLoading && textareaRef.current && isOpen) {
      textareaRef.current.focus();
    }
  }, [messages, isLoading, error, isOpen]);

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error', event.error);
      }
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev: string) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  const handleVoiceOutput = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const submitForm = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if ((input || '').trim() && !isLoading) {
      if (typeof chat.append === 'function') {
        chat.append({ role: 'user', content: input });
      } else if (typeof chat.sendMessage === 'function') {
        chat.sendMessage({ role: 'user', content: input });
      } else if (typeof chat.handleSubmit === 'function') {
        // Mocking an event if handleSubmit is the only option (rare)
        chat.handleSubmit({ preventDefault: () => {} } as any, { data: { content: input } });
      } else {
        console.error("No valid submit function found on useChat");
      }
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitForm(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', pointerEvents: 'none' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel"
            style={{ pointerEvents: 'auto', width: '400px', height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          >
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), transparent)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                <Zap size={20} /> AI-Powered Admissions
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              {error && (
                <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fca5a5' }}>
                  <strong>Error:</strong> Unable to contact AI. Please try again.
                </div>
              )}

              {(messages || []).map((m: any, i: number) => (
                <motion.div key={m.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.role !== 'user' ? 'var(--primary-light)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.role !== 'user' ? 'var(--primary-color)' : 'var(--text-secondary)', flexShrink: 0 }}>
                    {m.role !== 'user' ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: m.role !== 'user' ? 'var(--bg-primary)' : 'var(--primary-color)', color: m.role !== 'user' ? 'var(--text-primary)' : 'white', padding: '12px 16px', borderRadius: m.role !== 'user' ? '0 16px 16px 16px' : '16px 0 16px 16px', boxShadow: 'var(--shadow-sm)', fontSize: '0.95rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      {m.role === 'user' ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                      ) : (
                        <div className="prose prose-sm prose-blue" style={{ margin: 0 }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {m.role !== 'user' && (
                      <button onClick={() => handleVoiceOutput(m.content)} style={{ marginTop: '4px', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px' }}>
                        <Volume2 size={12} /> Listen
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}><Bot size={18} /></div>
                  <div style={{ background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '0 16px 16px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} style={{ width: '6px', height: '6px', background: 'var(--text-tertiary)', borderRadius: '50%' }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
              <form onSubmit={submitForm} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--glass-border)', position: 'relative', zIndex: 10 }}>
                <textarea 
                  ref={textareaRef}
                  value={input} 
                  onChange={handleInputChange} 
                  onKeyDown={handleKeyDown}
                  placeholder="Message AI..." 
                  rows={1}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', resize: 'none', overflowY: 'hidden', padding: '8px 0', minHeight: '40px', lineHeight: '24px' }} 
                />
                
                <button type="button" onClick={handleVoiceInput} style={{ pointerEvents: 'auto', zIndex: 20, color: isListening ? '#ef4444' : 'var(--text-tertiary)', background: 'transparent', border: 'none', padding: '4px 8px', cursor: 'pointer', transition: 'color 0.2s' }}>
                  <Mic size={18} />
                </button>
                <button type="submit" disabled={!(input || '').trim() || isLoading} style={{ pointerEvents: 'auto', zIndex: 20, color: ((input || '').trim() && !isLoading) ? 'var(--primary-color)' : 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: ((input || '').trim() && !isLoading) ? 'pointer' : 'default', padding: '4px 8px', transition: 'color 0.2s', opacity: ((input || '').trim() && !isLoading) ? 1 : 0.5 }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
        <AnimatePresence>
          {hovered && !isOpen && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel" style={{ padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              AI-Powered Admissions CRM
            </motion.div>
          )}
        </AnimatePresence>
        
        <div style={{ width: '100px', height: '100px', cursor: 'pointer', borderRadius: '50%', boxShadow: hovered ? '0 0 40px rgba(37, 99, 235, 0.4)' : '0 0 20px rgba(37, 99, 235, 0.2)', transition: 'box-shadow 0.3s' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => setIsOpen(!isOpen)}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <OrbMesh hovered={hovered} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
