import { axiosClient } from './axiosClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/common';
import type { ConversationDto, MessageDto, SendMessageRequest } from '../types/conversation';

export const conversationApi = {
  getAllConversations: async (): Promise<ConversationDto[]> => {
    const res = await axiosClient.get<ApiResponse<ConversationDto[]>>(API_ENDPOINTS.CONVERSATIONS);
    return res.data.data;
  },

  getConversationById: async (id: number): Promise<ConversationDto> => {
    const res = await axiosClient.get<ApiResponse<ConversationDto>>(API_ENDPOINTS.CONVERSATION_BY_ID(id));
    return res.data.data;
  },

  sendMessage: async (conversationId: number, request: SendMessageRequest): Promise<MessageDto> => {
    const res = await axiosClient.post<ApiResponse<MessageDto>>(
      API_ENDPOINTS.SEND_MESSAGE(conversationId),
      request
    );
    return res.data.data;
  },
};
