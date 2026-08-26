'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInbox } from '@/contexts/InboxContext';
import { Paperclip, Send, Image as ImageIcon, FileText, Smile, CheckCheck, Clock } from 'lucide-react';

export function ChatArea() {
  const { conversations, activeConversationId, sendMessage } = useInbox();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    // Scroll to bottom when active conversation changes or new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  if (!activeConv) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        Select a conversation to start messaging
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(activeConv.id, inputText.trim(), 'text', 'me');
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <span style={{ padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Conversation started
          </span>
        </div>

        {activeConv.messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  <span>{msg.content}</span>
                  <span style={{ opacity: 0.5 }}>• {formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start',
              width: '100%'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: isMe ? '4px' : '16px',
                borderBottomLeftRadius: !isMe ? '4px' : '16px',
                background: isMe ? 'var(--brand-primary)' : 'var(--bg-primary)',
                color: isMe ? '#fff' : 'var(--text-primary)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: isMe ? 'none' : '1px solid var(--glass-border)',
                lineHeight: 1.5,
                fontSize: '0.95rem'
              }}>
                {msg.content}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {formatTime(msg.timestamp)}
                {isMe && <CheckCheck size={14} color={msg.status === 'read' ? 'var(--brand-primary)' : 'inherit'} />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div style={{ padding: '16px 24px', background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            style={{
              width: '100%',
              minHeight: '80px',
              maxHeight: '200px',
              padding: '16px',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderTop: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button title="Attach File" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><Paperclip size={20} /></button>
              <button title="Attach Image" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><ImageIcon size={20} /></button>
              <button title="Templates" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><FileText size={20} /></button>
              <button title="Emoji" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}><Smile size={20} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  sendMessage(activeConv.id, `Task created for ${activeConv.entityId}`, 'system');
                }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >Create Task</button>
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                style={{
                  background: 'var(--brand-primary)',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                  opacity: inputText.trim() ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
