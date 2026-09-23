export type SenderType = 'CUSTOMER' | 'AGENT';

export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

export interface OrderDto {
  id: number;
  orderNumber: string;
  customerName: string;
  brandName: string;
  itemSummary: string;
  orderStatus: OrderStatus;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
}

export interface MessageDto {
  id: number;
  conversationId: number;
  senderType: SenderType;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ConversationDto {
  id: number;
  brandId: number;
  brandName: string;
  brandCode: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  order?: OrderDto;
  channel: string;
  status: ConversationStatus;
  latestCustomerMessage?: string;
  messages: MessageDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  senderType: SenderType;
  senderName?: string;
  content: string;
}
