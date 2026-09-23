import React, { useState } from 'react';
import { Send, User, UserCheck } from 'lucide-react';
import type { SenderType } from '../../types/conversation';
import { Button } from '../common/Button';

interface MessageComposerProps {
  onSendMessage: (senderType: SenderType, content: string) => Promise<void>;
  activeRole: SenderType;
  onToggleRole: () => void;
  isSending: boolean;
  customerName: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  activeRole,
  onToggleRole,
  isSending,
  customerName,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isSending) return;

    const textToSend = content.trim();
    setContent('');
    await onSendMessage(activeRole, textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickFill = (text: string) => {
    setContent(text);
  };

  return (
    <div className="message-composer-container">
      {/* Perspective / Role Banner */}
      <div className="composer-role-bar">
        <div className="role-indicator">
          {activeRole === 'CUSTOMER' ? (
            <>
              <User size={14} className="text-emerald-400" />
              <span>Sending as <strong>Customer ({customerName})</strong></span>
            </>
          ) : (
            <>
              <UserCheck size={14} className="text-indigo-400" />
              <span>Sending as <strong>Support Agent (Manual Direct Message)</strong></span>
            </>
          )}
        </div>

        <button
          type="button"
          className="role-switch-link"
          onClick={onToggleRole}
        >
          Switch to {activeRole === 'CUSTOMER' ? 'Agent Mode' : 'Customer Mode'}
        </button>
      </div>

      {/* Quick Test Message Presets for Reviewers */}
      {activeRole === 'CUSTOMER' && (
        <div className="quick-presets-bar">
          <span className="preset-label">Test Prompts:</span>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('My order was delivered but the bottle is broken. What can I do?')}
          >
            "Bottle is broken"
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('I received this 20 days ago. Can I get a refund?')}
          >
            "Received 20 days ago (Guardrail test)"
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handleQuickFill('How long will standard shipping take to arrive?')}
          >
            "Shipping time"
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="composer-form">
        <textarea
          className="composer-textarea"
          placeholder={
            activeRole === 'CUSTOMER'
              ? `Type a customer message as ${customerName}...`
              : 'Compose manual reply directly to the customer (independent of AI)...'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />

        <div className="composer-action-row">
          <span className="composer-hint">Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline</span>
          <Button
            type="submit"
            variant={activeRole === 'CUSTOMER' ? 'primary' : 'secondary'}
            size="sm"
            isLoading={isSending}
            disabled={!content.trim()}
            rightIcon={<Send size={14} />}
          >
            Send as {activeRole === 'CUSTOMER' ? 'Customer' : 'Agent'}
          </Button>
        </div>
      </form>
    </div>
  );
};
