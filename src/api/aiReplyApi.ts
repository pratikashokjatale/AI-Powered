import { axiosClient } from './axiosClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/common';
import type {
  AiReplySuggestionDto,
  GenerateReplyRequest,
  ApproveReplyRequest,
  InteractionLogDto,
} from '../types/ai';
import type { MessageDto } from '../types/conversation';

export const aiReplyApi = {
  generateReply: async (request: GenerateReplyRequest): Promise<AiReplySuggestionDto> => {
    const res = await axiosClient.post<ApiResponse<AiReplySuggestionDto>>(
      API_ENDPOINTS.AI_GENERATE_REPLY,
      request
    );
    return res.data.data;
  },

  approveReply: async (request: ApproveReplyRequest): Promise<MessageDto> => {
    const res = await axiosClient.post<ApiResponse<MessageDto>>(
      API_ENDPOINTS.AI_APPROVE_REPLY,
      request
    );
    return res.data.data;
  },

  getInteractionLogs: async (): Promise<InteractionLogDto[]> => {
    const res = await axiosClient.get<ApiResponse<InteractionLogDto[]>>(API_ENDPOINTS.AI_LOGS);
    return res.data.data;
  },
};
