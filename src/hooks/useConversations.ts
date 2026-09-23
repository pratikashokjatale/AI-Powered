import { useState, useEffect, useCallback } from 'react';
import type { ConversationDto, MessageDto, SenderType } from '../types/conversation';
import { conversationApi } from '../api/conversationApi';

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await conversationApi.getAllConversations();
      setConversations(data);
      if (data.length > 0 && activeId === null) {
        setActiveId(data[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const sendMessage = async (
    conversationId: number,
    senderType: SenderType,
    content: string,
    senderName?: string
  ): Promise<MessageDto> => {
    setSending(true);
    try {
      const newMsg = await conversationApi.sendMessage(conversationId, {
        senderType,
        senderName,
        content,
      });

      // Update local state reactively
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, newMsg],
              latestCustomerMessage: senderType === 'CUSTOMER' ? content : c.latestCustomerMessage,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );

      return newMsg;
    } finally {
      setSending(false);
    }
  };

  const appendAgentMessage = (conversationId: number, message: MessageDto) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, message],
            status: 'WAITING_CUSTOMER',
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    loading,
    sending,
    error,
    refreshConversations: fetchConversations,
    sendMessage,
    appendAgentMessage,
  };
}
