import { useState, useEffect } from 'react';
import type { BrandDto } from './types/brand';
import type { SenderType } from './types/conversation';
import { brandApi } from './api/brandApi';
import { checkBackendHealth } from './api/axiosClient';
import { useToast } from './hooks/useToast';
import { useConversations } from './hooks/useConversations';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import { useAiReply } from './hooks/useAiReply';
import { useRoute } from './hooks/useRoute';

// Layout Components
import { Header, type ViewMode } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Conversation Components
import { ConversationHeader } from './components/conversation/ConversationHeader';
import { OrderContextCard } from './components/conversation/OrderContextCard';
import { MessageList } from './components/conversation/MessageList';
import { MessageComposer } from './components/conversation/MessageComposer';

// Dedicated Customer Chat Page & Layout
import { CustomerChatPage } from './pages/CustomerChatPage';
import { CustomerChatLayout } from './components/customer/CustomerChatLayout';

// AI Assistant Components
import { AiReplyPanel } from './components/ai-assistant/AiReplyPanel';

// Knowledge Base & Audit Modals
import { KnowledgeBaseModal } from './components/knowledge-base/KnowledgeBaseModal';
import { InteractionLogsModal } from './components/audit/InteractionLogsModal';
import { Toast } from './components/common/Toast';
import { Spinner } from './components/common/Spinner';

export default function App() {
  const route = useRoute();
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('AGENT');
  const [activeRole, setActiveRole] = useState<SenderType>('AGENT');
  const [showOrderCard, setShowOrderCard] = useState<boolean>(true);
  const [isKbOpen, setIsKbOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const { toasts, addToast, removeToast } = useToast();

  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    loading: conversationsLoading,
    sending: messageSending,
    sendMessage,
    appendAgentMessage,
    refreshConversations,
  } = useConversations();

  const {
    articles,
    createArticle,
    updateArticle,
    deleteArticle,
    refreshArticles,
  } = useKnowledgeBase(activeBrandId);

  const {
    suggestion,
    isGenerating,
    isApproving,
    error: aiError,
    generateReply,
    approveReply,
    clearSuggestion,
  } = useAiReply();

  // Initial load: Fetch brands and check backend health
  useEffect(() => {
    async function init() {
      try {
        const loadedBrands = await brandApi.getAllBrands();
        setBrands(loadedBrands);
        if (loadedBrands.length > 0) {
          setActiveBrandId(loadedBrands[0].id);
        }
      } catch (err) {
        console.error('Failed to load brands:', err);
      }

      const connected = await checkBackendHealth();
      setIsBackendConnected(connected);
      if (connected) {
        addToast('success', 'Backend Connected', 'Spring Boot API is connected and responding at port 8080');
      } else {
        addToast(
          'warning',
          'Backend Disconnected',
          'Connecting to Spring Boot backend at http://localhost:8080... Please ensure your backend is running.'
        );
      }
    }
    init();
  }, [addToast]);

  // Sync active brand when changing conversation
  useEffect(() => {
    if (activeConversation && activeConversation.brandId !== activeBrandId) {
      setActiveBrandId(activeConversation.brandId);
    }
  }, [activeConversation, activeBrandId]);

  // Handle URL route directly: If accessing /customer/:id, render dedicated CustomerChatPage
  if (route.isCustomerView && route.customerId) {
    return (
      <CustomerChatPage
        conversationId={route.customerId}
        onNavigateToAgent={() => route.navigate('/')}
        onNavigateToConversation={(id) => route.navigate(`/customer/${id}`)}
      />
    );
  }

  // Handle switching view mode from header
  const handleSetViewMode = (mode: ViewMode) => {
    if (mode === 'CUSTOMER') {
      route.navigate(`/customer/${activeId || 1}`);
      return;
    }
    setViewMode(mode);
    setActiveRole(mode === 'CUSTOMER' ? 'CUSTOMER' : 'AGENT');
    addToast(
      'info',
      `Layout: ${mode === 'AGENT' ? 'Agent Workspace' : 'Side-by-Side Test Mode'}`,
      mode === 'SPLIT'
        ? 'Customer chat on the left, Agent AI copilot on the right.'
        : 'Viewing as Support Agent.'
    );
  };

  const handleToggleRole = () => {
    const nextRole: SenderType = activeRole === 'AGENT' ? 'CUSTOMER' : 'AGENT';
    setActiveRole(nextRole);
    if (nextRole === 'CUSTOMER') {
      route.navigate(`/customer/${activeId || 1}`);
    }
  };

  // Handle sending message from composer or customer chat
  const handleSendMessage = async (senderType: SenderType, content: string) => {
    if (!activeId) return;
    try {
      await sendMessage(activeId, senderType, content);
      addToast(
        'success',
        `${senderType === 'CUSTOMER' ? 'Customer' : 'Agent'} Message Sent`,
        'Message added to live conversation thread.'
      );
      if (senderType === 'CUSTOMER') {
        clearSuggestion();
      }
    } catch {
      addToast('error', 'Failed to send message', 'Please check your connection and try again.');
    }
  };

  // Handle generating AI reply
  const handleGenerateAiReply = async (instruction?: string) => {
    if (!activeId || !activeConversation) return;

    const res = await generateReply(
      activeId,
      activeConversation.latestCustomerMessage,
      instruction
    );

    if (res) {
      if (res.guardrailTriggered) {
        addToast('warning', 'Guardrail Notice', res.guardrailNotes);
      } else {
        addToast('success', 'AI Reply Ready', 'Drafted response grounded in brand policies.');
      }
    }
  };

  // Handle approving and sending AI reply
  const handleApproveReply = async (finalText: string, wasEdited: boolean) => {
    if (!activeId) return;

    const sentMessage = await approveReply(activeId, finalText, wasEdited);
    if (sentMessage) {
      appendAgentMessage(activeId, sentMessage);
      addToast(
        'success',
        wasEdited ? 'Edited Reply Sent!' : 'AI Reply Approved & Sent!',
        'Response delivered to customer and interaction logged for audit.'
      );
    }
  };

  const activeBrand = brands.find((b) => b.id === activeBrandId) || {
    id: 1,
    name: 'Aura Skincare',
    code: 'AURA',
    description: 'Clean luxury skincare',
    toneGuidelines: 'Warm, empathetic and reassuring',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        brands={brands}
        activeBrandId={activeBrandId}
        onSelectBrand={setActiveBrandId}
        viewMode={viewMode}
        onSetViewMode={handleSetViewMode}
        onOpenKnowledgeBase={() => setIsKbOpen(true)}
        onOpenAuditLogs={() => setIsLogsOpen(true)}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Layout depending on viewMode */}
      {viewMode === 'SPLIT' ? (
        /* Split Screen: Customer on Left, Agent on Right */
        <div className="split-screen-workspace">
          {/* Left: Customer View */}
          <div className="split-left-pane">
            {activeConversation ? (
              <CustomerChatLayout
                conversation={activeConversation}
                brand={activeBrand}
                onSendMessage={(text) => handleSendMessage('CUSTOMER', text)}
                onSwitchToAgent={() => handleSetViewMode('AGENT')}
                isSending={messageSending}
                onRefresh={refreshConversations}
              />
            ) : (
              <div className="flex-center h-full text-muted">No conversation selected</div>
            )}
          </div>

          {/* Right: Agent AI Copilot Pane */}
          <div className="split-right-pane">
            <section className="conversation-pane">
              {activeConversation && (
                <>
                  <ConversationHeader
                    conversation={activeConversation}
                    showOrderCard={showOrderCard}
                    onToggleOrderCard={() => setShowOrderCard(!showOrderCard)}
                    onOpenCustomerUrl={() => route.navigate(`/customer/${activeConversation.id}`)}
                  />
                  {showOrderCard && activeConversation.order && (
                    <OrderContextCard order={activeConversation.order} />
                  )}
                  <MessageList messages={activeConversation.messages} />
                  <MessageComposer
                    onSendMessage={handleSendMessage}
                    activeRole="AGENT"
                    onToggleRole={handleToggleRole}
                    isSending={messageSending}
                    customerName={activeConversation.customerName}
                  />
                </>
              )}
            </section>

            <AiReplyPanel
              suggestion={suggestion}
              onGenerate={handleGenerateAiReply}
              onApprove={handleApproveReply}
              onDiscard={clearSuggestion}
              isGenerating={isGenerating}
              isApproving={isApproving}
              error={aiError}
              brandName={activeBrand.name}
              latestCustomerMessage={activeConversation?.latestCustomerMessage}
            />
          </div>
        </div>
      ) : (
        /* Standard 3-Column Agent Workspace */
        <main className="app-workspace">
          {/* Left Column: Conversations List */}
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
            brandFilterId={activeBrandId}
          />

          {/* Center Column: Conversation Thread & Manual Composer */}
          <section className="conversation-pane">
            {conversationsLoading ? (
              <div className="flex-center h-full">
                <Spinner size="lg" />
              </div>
            ) : !activeConversation ? (
              <div className="flex-center h-full text-muted">
                Select a conversation to start
              </div>
            ) : (
              <>
                {/* Customer and Conversation Details Header */}
                <ConversationHeader
                  conversation={activeConversation}
                  showOrderCard={showOrderCard}
                  onToggleOrderCard={() => setShowOrderCard(!showOrderCard)}
                  onOpenCustomerUrl={() => route.navigate(`/customer/${activeConversation.id}`)}
                />

                {/* Collapsible Order Context Card */}
                {showOrderCard && activeConversation.order && (
                  <OrderContextCard order={activeConversation.order} />
                )}

                {/* Scrollable Message List */}
                <MessageList messages={activeConversation.messages} />

                {/* Message Composer with Role Testing Switcher */}
                <MessageComposer
                  onSendMessage={handleSendMessage}
                  activeRole={activeRole}
                  onToggleRole={handleToggleRole}
                  isSending={messageSending}
                  customerName={activeConversation.customerName}
                />
              </>
            )}
          </section>

          {/* Right Column: AI Reply Copilot & Grounding Panel */}
          <AiReplyPanel
            suggestion={suggestion}
            onGenerate={handleGenerateAiReply}
            onApprove={handleApproveReply}
            onDiscard={clearSuggestion}
            isGenerating={isGenerating}
            isApproving={isApproving}
            error={aiError}
            brandName={activeBrand.name}
            latestCustomerMessage={activeConversation?.latestCustomerMessage}
          />
        </main>
      )}

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKbOpen}
        onClose={() => {
          setIsKbOpen(false);
          refreshArticles();
        }}
        brands={brands}
        activeBrandId={activeBrandId}
        onSelectBrand={setActiveBrandId}
        articles={articles}
        onCreateArticle={createArticle}
        onUpdateArticle={updateArticle}
        onDeleteArticle={deleteArticle}
      />

      {/* Audit & Interaction Logs Modal */}
      <InteractionLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
