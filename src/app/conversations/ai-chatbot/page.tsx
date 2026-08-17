'use client';

import React, { useState } from 'react';
import { Bot, Send, CheckCheck, ToggleLeft, ToggleRight, Edit2, BarChart2, MessageSquare, Zap, Settings, RefreshCw } from 'lucide-react';

const CHAT_PREVIEW = [
  { from: 'user', text: 'Hi, I want to know about the MBA program.' },
  { from: 'bot', text: 'Hello! Welcome to Fortivex.AI 👋 I\'m your AI admissions assistant. I\'d love to help you explore our MBA program!\n\nOur MBA is an 18-month blended learning program with 100% placement support. Are you interested in the full-time or evening batch?' },
  { from: 'user', text: 'Evening batch. What are the timings?' },
  { from: 'bot', text: 'Great choice! Our evening batch is designed for working professionals:\n\n📅 Mon–Fri: 7:00 PM – 9:00 PM\n📅 Saturday: 9:00 AM – 1:00 PM\n\nWould you like to know about the fee structure or eligibility criteria?' },
  { from: 'user', text: 'Fee structure please' },
  { from: 'bot', text: 'Here\'s our fee structure for the MBA Evening Batch:\n\n💰 Total Fee: ₹2,40,000\n📦 Available EMI Plans: 6, 12, 18 months\n🎓 Merit Scholarship: Up to 30% off\n\nShall I connect you with an admission counselor to discuss further? Type YES and I\'ll arrange a call! 📞' },
];

type BotSetting = {
  id: string;
  label: string;
  description: string;
  value: boolean;
};

const BOT_SETTINGS: BotSetting[] = [
  { id: 'auto_reply', label: 'Auto-Reply to New Leads', description: 'Instantly respond to every new inbound lead message', value: true },
  { id: 'handoff', label: 'Auto Handoff to Counselor', description: 'Transfer conversation when lead requests a human', value: true },
  { id: 'after_hours', label: 'After-Hours Responses', description: 'Reply 24/7 outside business hours', value: true },
  { id: 'sentiment', label: 'Sentiment Analysis', description: 'Detect negative sentiment and escalate to counselor', value: false },
  { id: 'lead_qualify', label: 'Lead Qualification Flow', description: 'Ask qualifying questions before handoff', value: true },
  { id: 'faq', label: 'FAQ Auto-Resolution', description: 'Answer common questions without human involvement', value: true },
];

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
};

export default function AIChatbotPage() {
  const [settings, setSettings] = useState(BOT_SETTINGS);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState(CHAT_PREVIEW);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value: !s.value } : s));
  };

  const sendMessage = () => {
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: userInput }]);
    const resp = userInput;
    setUserInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: `Thanks for your message: "${resp}". Our AI is processing your query. A counselor will follow up shortly if needed. 😊` }]);
    }, 800);
  };

  const activeSettings = settings.filter(s => s.value).length;

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(37,99,235,0.12))' }}>
              <Bot size={24} style={{ color: '#7c3aed' }} />
            </div>
            AI Chatbot
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Configure and preview your AI-powered admissions assistant.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.8)', color: '#475569', border: '1px solid rgba(226,232,240,0.8)', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}>
            <Edit2 size={14} /> Edit Script
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer' }}>
            <Settings size={14} /> Deploy Bot
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Conversations', value: '1,204', color: '#7c3aed', icon: <MessageSquare size={18} /> },
          { label: 'Auto-Resolved', value: '876', color: '#059669', icon: <Zap size={18} /> },
          { label: 'Handed Off', value: '328', color: '#2563eb', icon: <RefreshCw size={18} /> },
          { label: 'Active Settings', value: `${activeSettings}/${settings.length}`, color: '#d97706', icon: <BarChart2 size={18} /> },
        ].map(k => (
          <div key={k.label} style={{ ...card, padding: '18px 22px', flex: '1 1 130px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Settings panel */}
        <div style={{ ...card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Bot Configuration</h2>
          {settings.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', borderRadius: '12px', background: s.value ? 'rgba(124,58,237,0.04)' : 'rgba(248,250,252,0.5)', border: `1px solid ${s.value ? 'rgba(124,58,237,0.1)' : 'rgba(226,232,240,0.5)'}`, transition: 'all 0.2s' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{s.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{s.description}</div>
              </div>
              <button onClick={() => toggleSetting(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: s.value ? '#7c3aed' : '#94a3b8', transition: 'color 0.2s', flexShrink: 0 }}>
                {s.value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          ))}
        </div>

        {/* Chat Preview */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Bot size={18} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Fortivex AI Assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Online
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(148,163,184,0.1)', padding: '3px 10px', borderRadius: '99px' }}>Preview Mode</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px' }}>
            {messages.map((msg, i) => {
              const isUser = msg.from === 'user';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  {!isUser && <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '8px', flexShrink: 0 }}><Bot size={14} /></div>}
                  <div style={{ maxWidth: '75%', background: isUser ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))' : 'rgba(248,250,252,0.9)', border: isUser ? '1px solid rgba(37,99,235,0.15)' : '1px solid rgba(226,232,240,0.6)', borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '10px 13px' }}>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#0f172a', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px', borderTop: '1px solid rgba(226,232,240,0.5)', display: 'flex', gap: '8px' }}>
            <input value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }} placeholder="Test the chatbot…" style={{ flex: 1, height: '38px', paddingLeft: '14px', borderRadius: '10px', border: '1px solid rgba(226,232,240,0.8)', background: 'rgba(248,250,252,0.8)', fontSize: '0.85rem', outline: 'none', color: '#0f172a' }} />
            <button onClick={sendMessage} style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
