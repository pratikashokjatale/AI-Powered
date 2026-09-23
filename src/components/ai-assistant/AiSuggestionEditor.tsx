import React, { useState, useEffect } from 'react';
import { Check, RotateCw, Trash2, Cpu, Edit3 } from 'lucide-react';
import type { AiReplySuggestionDto } from '../../types/ai';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface AiSuggestionEditorProps {
  suggestion: AiReplySuggestionDto;
  onApprove: (finalText: string, wasEdited: boolean) => Promise<void>;
  onRegenerate: () => Promise<void>;
  onDiscard: () => void;
  isApproving: boolean;
  isGenerating: boolean;
}

export const AiSuggestionEditor: React.FC<AiSuggestionEditorProps> = ({
  suggestion,
  onApprove,
  onRegenerate,
  onDiscard,
  isApproving,
  isGenerating,
}) => {
  const [editedText, setEditedText] = useState(suggestion.suggestedReply);
  const wasEdited = editedText.trim() !== suggestion.suggestedReply.trim();

  // Reset edited text when suggestion changes
  useEffect(() => {
    setEditedText(suggestion.suggestedReply);
  }, [suggestion]);

  const handleApprove = async () => {
    if (!editedText.trim() || isApproving) return;
    await onApprove(editedText.trim(), wasEdited);
  };

  return (
    <div className="ai-editor-card">
      <div className="ai-editor-header">
        <div className="editor-badge-group">
          <span className="editor-title">AI Suggested Response</span>
          {wasEdited ? (
            <Badge variant="warning" size="sm" className="edited-badge">
              <Edit3 size={11} />
              <span>Edited by Agent</span>
            </Badge>
          ) : (
            <Badge variant="secondary" size="sm">
              Original Draft
            </Badge>
          )}
        </div>

        <div className="model-chip" title="Model Used">
          <Cpu size={12} />
          <span>{suggestion.modelUsed || 'Claude 3.5 Sonnet'}</span>
        </div>
      </div>

      <div className="editor-textarea-wrapper">
        <textarea
          className="ai-response-textarea"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          rows={6}
          placeholder="AI response suggestion..."
        />
        <div className="editor-stats-bar">
          <span className="char-count">{editedText.length} characters</span>
          {wasEdited && (
            <button
              type="button"
              className="reset-edit-btn"
              onClick={() => setEditedText(suggestion.suggestedReply)}
            >
              Reset to original
            </button>
          )}
        </div>
      </div>

      <div className="editor-button-bar">
        <div className="left-buttons">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            disabled={isApproving || isGenerating}
            leftIcon={<Trash2 size={14} />}
          >
            Discard
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            isLoading={isGenerating}
            disabled={isApproving}
            leftIcon={<RotateCw size={14} />}
          >
            Regenerate
          </Button>
        </div>

        <Button
          type="button"
          variant="success"
          size="md"
          onClick={handleApprove}
          isLoading={isApproving}
          disabled={!editedText.trim() || isGenerating}
          leftIcon={<Check size={16} />}
        >
          Approve & Send
        </Button>
      </div>
    </div>
  );
};
