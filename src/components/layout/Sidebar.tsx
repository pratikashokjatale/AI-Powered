import React, { useState } from 'react';
import { MessageSquare, Search, MessageCircle, Mail, Globe } from 'lucide-react';
import type { ConversationDto } from '../../types/conversation';
import { Badge } from '../common/Badge';
import { formatTime } from '../../utils/formatters';

interface SidebarProps {
  conversations: ConversationDto[];
  activeId: number | null;
  onSelect: (id: number) => void;
  brandFilterId: number | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  brandFilterId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((c) => {
    const matchesBrand = brandFilterId ? c.brandId === brandFilterId : true;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.latestCustomerMessage || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.order?.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel.toUpperCase()) {
      case 'WHATSAPP':
        return <MessageCircle size={13} className="text-emerald-400" />;
      case 'EMAIL':
        return <Mail size={13} className="text-sky-400" />;
      default:
        return <Globe size={13} className="text-amber-400" />;
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <div className="sidebar-title">
            <MessageSquare size={16} />
            <span>Conversations</span>
          </div>
          <Badge variant="neutral" size="sm">
            {filteredConversations.length}
          </Badge>
        </div>

        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search customer, order, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="conversation-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-sidebar">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                className={`conversation-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(conv.id)}
              >
                <div className="conv-card-top">
                  <div className="customer-avatar-mini">
                    {conv.customerName.charAt(0)}
                  </div>
                  <div className="customer-meta">
                    <span className="customer-name">{conv.customerName}</span>
                    <span className="brand-tag">{conv.brandName}</span>
                  </div>
                  <span className="conv-time">{formatTime(conv.updatedAt)}</span>
                </div>

                <p className="latest-message-preview">
                  {conv.latestCustomerMessage || 'No messages yet'}
                </p>

                <div className="conv-card-footer">
                  <span className="channel-chip">
                    {getChannelIcon(conv.channel)}
                    <span>{conv.channel}</span>
                  </span>

                  {conv.order && (
                    <span className="order-chip">
                      #{conv.order.orderNumber}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
