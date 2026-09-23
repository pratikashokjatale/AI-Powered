export const API_ENDPOINTS = {
  // Brands
  BRANDS: '/api/brands',
  BRAND_BY_ID: (id: number | string) => `/api/brands/${id}`,

  // Knowledge Base
  KNOWLEDGE_BASE: '/api/knowledge-base',
  KNOWLEDGE_BASE_BY_ID: (id: number | string) => `/api/knowledge-base/${id}`,
  KNOWLEDGE_BASE_BY_BRAND: (brandId: number | string) => `/api/knowledge-base/brand/${brandId}`,
  KNOWLEDGE_BASE_SEARCH: (brandId: number | string) => `/api/knowledge-base/brand/${brandId}/search`,

  // Conversations
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_BY_ID: (id: number | string) => `/api/conversations/${id}`,
  SEND_MESSAGE: (conversationId: number | string) => `/api/conversations/${conversationId}/messages`,

  // AI Reply Assistant
  AI_GENERATE_REPLY: '/api/ai/generate-reply',
  AI_APPROVE_REPLY: '/api/ai/approve-reply',
  AI_LOGS: '/api/ai/logs',

  // Actuator / Health
  HEALTH: '/actuator/health',
} as const;
