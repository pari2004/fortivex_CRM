'use client';

import React, { useState } from 'react';
import { useInbox, Conversation, EntityType } from '@/contexts/InboxContext';
import { Search, Filter, MessageSquarePlus, User, Users, Check, CheckCheck } from 'lucide-react';

export function ConversationList() {
  const { conversations, activeConversationId, openSharedInbox } = useInbox();
  const [filter, setFilter] = useState<'all' | 'unread' | 'open'>('all');
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter(c => {
    if (filter === 'unread' && c.unreadCount === 0) return false;
    if (filter === 'open' && c.status !== 'Open') return false;
    if (search) {
      // In a real app, we'd search names/messages. For now, match dummy preview
      return c.lastMessagePreview.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const getIcon = (type: EntityType) => {
    switch (type) {
      case 'team': return <Users size={16} />;
      default: return <User size={16} />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header Actions */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setFilter('all')}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                border: 'none',
                background: filter === 'all' ? 'var(--brand-primary)' : 'var(--glass-bg)',
                color: filter === 'all' ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >All</button>
            <button 
              onClick={() => setFilter('unread')}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                border: 'none',
                background: filter === 'unread' ? 'var(--brand-primary)' : 'var(--glass-bg)',
                color: filter === 'unread' ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >Unread</button>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer',
            fontWeight: 500
          }}>
            <MessageSquarePlus size={16} /> New
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search or start a new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredConversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => openSharedInbox({ entityType: conv.entityType, entityId: conv.entityId })}
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--glass-border)',
              cursor: 'pointer',
              background: activeConversationId === conv.id ? 'var(--glass-bg)' : 'transparent',
              transition: 'background 0.2s',
              display: 'flex',
              gap: '12px'
            }}
            onMouseEnter={e => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
            onMouseLeave={e => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'transparent' }}
          >
            {/* Avatar */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              flexShrink: 0, position: 'relative'
            }}>
              {getIcon(conv.entityType)}
              {conv.unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -2, right: -2,
                  background: 'var(--status-error)', color: '#fff',
                  width: '18px', height: '18px', borderRadius: '50%',
                  fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', border: '2px solid var(--bg-primary)'
                }}>
                  {conv.unreadCount}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {conv.entityId} {/* In a real app, map this to actual name using CRM data */}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {/* Simulated message status */}
                {conv.messages[conv.messages.length - 1]?.senderId === 'me' && (
                  <CheckCheck size={14} color="var(--brand-primary)" />
                )}
                <span style={{
                  fontSize: '0.85rem',
                  color: conv.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: conv.unreadCount > 0 ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  flex: 1
                }}>
                  {conv.lastMessagePreview}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--glass-bg)', borderRadius: '4px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                  {conv.entityType}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '4px', color: 'var(--brand-primary)' }}>
                  {conv.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredConversations.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
}
