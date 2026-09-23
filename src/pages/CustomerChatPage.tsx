import React, { useState, useEffect, useCallback } from 'react';
import { conversationApi } from '../api/conversationApi';
import { brandApi } from '../api/brandApi';
import type { ConversationDto } from '../types/conversation';
import type { BrandDto } from '../types/brand';
import { CustomerChatLayout } from '../components/customer/CustomerChatLayout';
import { Spinner } from '../components/common/Spinner';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/common/Toast';

interface CustomerChatPageProps {
  conversationId: number;
  onNavigateToAgent: () => void;
  onNavigateToConversation: (id: number) => void;
}

export const CustomerChatPage: React.FC<CustomerChatPageProps> = ({
  conversationId,
  onNavigateToAgent,
  onNavigateToConversation,
}) => {
  const [conversation, setConversation] = useState<ConversationDto | null>(null);
  const [brand, setBrand] = useState<BrandDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  const loadData = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const conv = await conversationApi.getConversationById(conversationId);
      setConversation(conv);

      if (!brand || brand.id !== conv.brandId) {
        const brandData = await brandApi.getBrandById(conv.brandId);
        setBrand(brandData);
      }
      setError(null);
    } catch (err) {
      if (!isPolling) {
        setError('Failed to load customer conversation. Please ensure backend is running.');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [conversationId, brand]);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Polling every 3.5 seconds to receive agent replies in real time
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;
    setIsSending(true);
    try {
      const newMsg = await conversationApi.sendMessage(conversation.id, {
        senderType: 'CUSTOMER',
        senderName: conversation.customerName,
        content,
      });

      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMsg],
              latestCustomerMessage: content,
              updatedAt: new Date().toISOString(),
            }
          : prev
      );

      addToast('success', 'Message Sent', 'Your message has been sent to customer support.');
    } catch {
      addToast('error', 'Send Failed', 'Could not send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading && !conversation) {
    return (
      <div className="customer-page-loading">
        <Spinner size="lg" />
        <p>Loading customer support chat...</p>
      </div>
    );
  }

  if (error || !conversation || !brand) {
    return (
      <div className="customer-page-error">
        <h3>Unable to load chat</h3>
        <p>{error || `Conversation #${conversationId} was not found.`}</p>
        <div className="error-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => loadData(false)}
          >
            Retry Connection
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNavigateToAgent}
          >
            Go to Agent Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-standalone-page">
      {/* Top Standalone Customer Bar with quick conversation selector & agent switch */}
      <nav className="customer-portal-nav">
        <div className="nav-brand-title">
          <span className="brand-dot"></span>
          <span>{brand.name} Customer Portal</span>
        </div>

        <div className="nav-right-controls">
          <span className="conv-selector-label">Chat ID:</span>
          <select
            className="conv-picker-select"
            value={conversationId}
            onChange={(e) => onNavigateToConversation(Number(e.target.value))}
          >
            <option value={1}>Chat #1 (Sarah Jenkins - Aura Skincare)</option>
            <option value={2}>Chat #2 (Michael Chang - Aura Skincare)</option>
            <option value={3}>Chat #3 (Elena Rostova - Apex Electronics)</option>
          </select>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="customer-standalone-body">
        <CustomerChatLayout
          conversation={conversation}
          brand={brand}
          onSendMessage={handleSendMessage}
          onSwitchToAgent={onNavigateToAgent}
          isSending={isSending}
          onRefresh={() => loadData(false)}
        />
      </div>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
