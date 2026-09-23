import React from 'react';
import { User, Phone, Mail, Package, ShieldCheck, ExternalLink } from 'lucide-react';
import type { ConversationDto } from '../../types/conversation';
import { Badge } from '../common/Badge';

interface ConversationHeaderProps {
  conversation: ConversationDto;
  onToggleOrderCard: () => void;
  showOrderCard: boolean;
  onOpenCustomerUrl?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onToggleOrderCard,
  showOrderCard,
  onOpenCustomerUrl,
}) => {
  return (
    <div className="conversation-header">
      <div className="conv-header-main">
        <div className="conv-customer-avatar">
          <User size={20} />
        </div>
        <div className="conv-customer-info">
          <div className="name-and-brand">
            <h2 className="customer-full-name">{conversation.customerName}</h2>
            <Badge variant="primary" size="sm">
              {conversation.brandName}
            </Badge>
            <Badge variant="neutral" size="sm">
              {conversation.channel}
            </Badge>
          </div>
          <div className="customer-contact-row">
            <span className="contact-item">
              <Mail size={12} />
              {conversation.customerEmail}
            </span>
            <span className="contact-item">
              <Phone size={12} />
              {conversation.customerPhone}
            </span>
            <span className="contact-item verified-badge">
              <ShieldCheck size={12} />
              Verified Customer
            </span>
          </div>
        </div>
      </div>

      <div className="conv-header-actions">
        {onOpenCustomerUrl && (
          <button
            type="button"
            className="order-quick-btn customer-url-btn"
            onClick={onOpenCustomerUrl}
            title={`Open dedicated customer chat URL: /customer/${conversation.id}`}
          >
            <ExternalLink size={14} />
            <span>Customer URL (/customer/{conversation.id})</span>
          </button>
        )}

        {conversation.order && (
          <button
            type="button"
            className={`order-quick-btn ${showOrderCard ? 'active' : ''}`}
            onClick={onToggleOrderCard}
          >
            <Package size={15} />
            <span>Order #{conversation.order.orderNumber}</span>
          </button>
        )}
      </div>
    </div>
  );
};
