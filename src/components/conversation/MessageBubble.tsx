import React from 'react';
import { User, Sparkles } from 'lucide-react';
import type { MessageDto } from '../../types/conversation';
import { formatTime } from '../../utils/formatters';
import { MessageContentRenderer } from '../common/MessageContentRenderer';

interface MessageBubbleProps {
  message: MessageDto;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAgent = message.senderType === 'AGENT';
  const isAiAssisted = isAgent && message.senderName.includes('AI');

  return (
    <div className={`message-bubble-wrapper ${isAgent ? 'agent-wrapper' : 'customer-wrapper'}`}>
      <div className="message-avatar">
        {isAgent ? (
          <div className="agent-avatar-icon">
            <Sparkles size={14} />
          </div>
        ) : (
          <div className="customer-avatar-icon">
            <User size={14} />
          </div>
        )}
      </div>

      <div className="message-bubble-content">
        <div className="message-meta-row">
          <span className="sender-name">{message.senderName}</span>
          {isAiAssisted && <span className="ai-tag">AI-Assisted</span>}
          <span className="message-timestamp">{formatTime(message.createdAt)}</span>
        </div>

        <div className={`bubble-body ${isAgent ? 'agent-bubble' : 'customer-bubble'}`}>
          <MessageContentRenderer content={message.content} isAgent={isAgent} />
        </div>
      </div>
    </div>
  );
};
