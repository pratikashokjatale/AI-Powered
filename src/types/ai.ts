import type { KnowledgeArticleDto } from './knowledgeBase';

export type GuardrailStatus = 'PASSED' | 'POLICY_VIOLATION' | 'NO_POLICY_FOUND' | 'RESTRICTED_ACTION';

export interface AiReplySuggestionDto {
  conversationId: number;
  brandId: number;
  brandName: string;
  customerMessage: string;
  suggestedReply: string;
  retrievedContext: string;
  retrievedArticles: KnowledgeArticleDto[];
  guardrailStatus: GuardrailStatus;
  guardrailNotes: string;
  guardrailTriggered: boolean;
  modelUsed: string;
  interactionLogId?: number;
}

export interface GenerateReplyRequest {
  conversationId: number;
  customInstruction?: string;
  customerMessage?: string;
}

export interface ApproveReplyRequest {
  conversationId: number;
  interactionLogId?: number;
  finalContent: string;
  agentName?: string;
  edited: boolean;
}

export interface InteractionLogDto {
  id: number;
  conversationId: number;
  brandId: number;
  customerMessage: string;
  retrievedContext: string;
  aiGeneratedResponse: string;
  agentEditedResponse?: string;
  finalResponse: string;
  wasEdited: boolean;
  guardrailStatus: GuardrailStatus;
  guardrailTriggered: boolean;
  modelUsed: string;
  createdAt: string;
}
