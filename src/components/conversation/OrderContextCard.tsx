import React from 'react';
import { Package, Calendar, Truck, CreditCard, Clock } from 'lucide-react';
import type { OrderDto } from '../../types/conversation';
import { Badge, type BadgeVariant } from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface OrderContextCardProps {
  order: OrderDto;
}

export const OrderContextCard: React.FC<OrderContextCardProps> = ({ order }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
        return 'info';
      case 'CANCELLED':
        return 'danger';
      case 'RETURNED':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  // Calculate days since delivery for guardrail evaluation context
  const getDaysSinceDelivery = (): number | null => {
    if (!order.deliveryDate) return null;
    try {
      const delivered = new Date(order.deliveryDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.floor((now - delivered) / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return null;
    }
  };

  const daysSinceDelivery = getDaysSinceDelivery();

  return (
    <div className="order-context-card">
      <div className="order-card-header">
        <div className="order-title">
          <Package size={15} className="order-icon" />
          <span>Order #{order.orderNumber}</span>
        </div>
        <Badge variant={getStatusVariant(order.orderStatus)} size="sm">
          {order.orderStatus}
        </Badge>
      </div>

      <div className="order-items-preview">
        <strong>Items:</strong> {order.itemSummary}
      </div>

      <div className="order-details-grid">
        <div className="detail-item">
          <Calendar size={13} />
          <span>Placed: {formatDate(order.orderDate)}</span>
        </div>

        <div className="detail-item">
          <Truck size={13} />
          <span>Delivered: {formatDate(order.deliveryDate)}</span>
        </div>

        <div className="detail-item">
          <CreditCard size={13} />
          <span>Total: {formatCurrency(order.totalAmount, order.currency)}</span>
        </div>

        {daysSinceDelivery !== null && (
          <div className={`detail-item ${daysSinceDelivery > 7 ? 'text-amber' : 'text-green'}`}>
            <Clock size={13} />
            <span>Age: {daysSinceDelivery} days since delivery</span>
          </div>
        )}
      </div>
    </div>
  );
};
