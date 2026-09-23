import { useState } from 'react';
import type { AiReplySuggestionDto, ApproveReplyRequest } from '../types/ai';
import type { MessageDto } from '../types/conversation';
import { aiReplyApi } from '../api/aiReplyApi';

export function useAiReply() {
  const [suggestion, setSuggestion] = useState<AiReplySuggestionDto | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateReply = async (
    conversationId: number,
    customerMessage?: string,
    instruction?: string
  ): Promise<AiReplySuggestionDto | null> => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await aiReplyApi.generateReply({
        conversationId,
        customerMessage,
        customInstruction: instruction || customInstruction || undefined,
      });
      setSuggestion(res);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate AI reply';
      setError(msg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const approveReply = async (
    conversationId: number,
    finalContent: string,
    edited: boolean,
    agentName = 'Support Agent (AI-Assisted)'
  ): Promise<MessageDto | null> => {
    setIsApproving(true);
    setError(null);
    try {
      const req: ApproveReplyRequest = {
        conversationId,
        interactionLogId: suggestion?.interactionLogId,
        finalContent,
        agentName,
        edited,
      };
      const message = await aiReplyApi.approveReply(req);
      setSuggestion(null); // clear suggestion after successful approval & sending
      return message;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve reply';
      setError(msg);
      return null;
    } finally {
      setIsApproving(false);
    }
  };

  const clearSuggestion = () => {
    setSuggestion(null);
    setError(null);
  };

  return {
    suggestion,
    setSuggestion,
    isGenerating,
    isApproving,
    customInstruction,
    setCustomInstruction,
    error,
    generateReply,
    approveReply,
    clearSuggestion,
  };
}
