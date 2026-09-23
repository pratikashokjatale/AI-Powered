import React, { useEffect, useRef } from 'react';
import type { MessageDto } from '../../types/conversation';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: MessageDto[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list-empty">
        <p>No messages in this conversation yet. Send a customer message to begin testing!</p>
      </div>
    );
  }

  return (
    <div className="message-list-viewport">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
