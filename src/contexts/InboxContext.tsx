'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type EntityType = 'lead' | 'student' | 'user' | 'owner' | 'team';

export interface InboxMessage {
  id: string;
  conversationId: string;
  senderId: string; // ID of the user sending the message, or 'system'
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'attachment';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: { name: string; url: string; type: 'image' | 'document' }[];
}

export interface Conversation {
  id: string;
  entityType: EntityType;
  entityId: string;
  ownerId: string;
  status: 'Open' | 'Awaiting Response' | 'Resolved' | 'Expired';
  unreadCount: number;
  lastMessageAt: string;
  lastMessagePreview: string;
  isStarred: boolean;
  messages: InboxMessage[];
}

interface OpenInboxParams {
  entityType: EntityType;
  entityId: string;
}

interface InboxContextType {
  isOpen: boolean;
  activeConversationId: string | null;
  conversations: Conversation[];
  openSharedInbox: (params: OpenInboxParams) => void;
  closeSharedInbox: () => void;
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'system', senderId?: string) => void;
  toggleStar: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

// Generate dummy data
const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-001',
    entityType: 'lead',
    entityId: 'LD-001', // Assuming Dinesh
    ownerId: 'USR-002',
    status: 'Open',
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessagePreview: 'Hi, I wanted to know about the upcoming AI program.',
    isStarred: true,
    messages: [
      {
        id: 'MSG-001',
        conversationId: 'CONV-001',
        senderId: 'LD-001',
        content: 'Hi, I wanted to know about the upcoming AI program.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text',
        status: 'read'
      }
    ]
  },
  {
    id: 'CONV-002',
    entityType: 'student',
    entityId: 'STU-001', // Neha Gupta
    ownerId: 'USR-001',
    status: 'Awaiting Response',
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    lastMessagePreview: 'Assessment completed',
    isStarred: false,
    messages: [
      {
        id: 'MSG-002',
        conversationId: 'CONV-002',
        senderId: 'STU-001',
        content: 'Assessment completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'text',
        status: 'read'
      },
      {
        id: 'MSG-003',
        conversationId: 'CONV-002',
        senderId: 'USR-001',
        content: 'Great job Neha, I will review it today.',
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        type: 'text',
        status: 'read'
      }
    ]
  },
  {
    id: 'CONV-003',
    entityType: 'user',
    entityId: 'USR-002', // Pavan S H
    ownerId: 'USR-001',
    status: 'Open',
    unreadCount: 2,
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    lastMessagePreview: 'Please review the lead',
    isStarred: false,
    messages: [
      {
        id: 'MSG-004',
        conversationId: 'CONV-003',
        senderId: 'USR-002',
        content: 'Hey, I forwarded a new business lead to your queue.',
        timestamp: new Date(Date.now() - 7300000).toISOString(),
        type: 'text',
        status: 'read'
      },
      {
        id: 'MSG-005',
        conversationId: 'CONV-003',
        senderId: 'USR-002',
        content: 'Please review the lead when you get a chance.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'text',
        status: 'delivered'
      }
    ]
  }
];

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);

  const openSharedInbox = ({ entityType, entityId }: OpenInboxParams) => {
    // Check if conversation already exists for this entity
    const existing = conversations.find(c => c.entityType === entityType && c.entityId === entityId);
    let convToOpen: Conversation;
    
    if (existing) {
      convToOpen = existing;
    } else {
      // Create a new blank conversation
      convToOpen = {
        id: `CONV-${Date.now()}`,
        entityType,
        entityId,
        ownerId: 'current-user', // Will map to Auth context later if needed
        status: 'Open',
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: 'New Conversation started',
        isStarred: false,
        messages: [{
          id: `MSG-${Date.now()}`,
          conversationId: `CONV-${Date.now()}`,
          senderId: 'system',
          content: 'Conversation created',
          timestamp: new Date().toISOString(),
          type: 'system',
          status: 'read'
        }]
      };
      setConversations(prev => [convToOpen, ...prev]);
    }
    
    setActiveConversationId(convToOpen.id);
    setIsOpen(true);
    markAsRead(convToOpen.id);
  };

  const closeSharedInbox = () => {
    setIsOpen(false);
    setActiveConversationId(null);
  };

  const sendMessage = (conversationId: string, content: string, type: 'text' | 'system' = 'text', senderId: string = 'me') => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const newMessage: InboxMessage = {
          id: `MSG-${Date.now()}`,
          conversationId,
          senderId,
          content,
          timestamp: new Date().toISOString(),
          type,
          status: 'sent'
        };
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessagePreview: type === 'system' ? c.lastMessagePreview : content,
          lastMessageAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const toggleStar = (conversationId: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, isStarred: !c.isStarred } : c));
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  };

  return (
    <InboxContext.Provider value={{
      isOpen,
      activeConversationId,
      conversations,
      openSharedInbox,
      closeSharedInbox,
      sendMessage,
      toggleStar,
      markAsRead
    }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
}
