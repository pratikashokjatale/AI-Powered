import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import type { AiReplySuggestionDto } from '../../types/ai';
import { Button } from '../common/Button';
import { GuardrailBanner } from './GuardrailBanner';
import { RetrievedContextViewer } from './RetrievedContextViewer';
import { AiSuggestionEditor } from './AiSuggestionEditor';

interface AiReplyPanelProps {
  suggestion: AiReplySuggestionDto | null;
  onGenerate: (instruction?: string) => Promise<void>;
  onApprove: (finalText: string, wasEdited: boolean) => Promise<void>;
  onDiscard: () => void;
  isGenerating: boolean;
  isApproving: boolean;
  error: string | null;
  brandName: string;
  latestCustomerMessage?: string;
}

export const AiReplyPanel: React.FC<AiReplyPanelProps> = ({
  suggestion,
  onGenerate,
  onApprove,
  onDiscard,
  isGenerating,
  isApproving,
  error,
  brandName,
  latestCustomerMessage,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');

  const handleGenerateClick = () => {
    onGenerate(customInstruction.trim() || undefined);
  };

  return (
    <div className="ai-reply-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="ai-badge-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="panel-title">AI Reply Copilot</h3>
            <span className="panel-subtitle">Grounded in {brandName} Knowledge Base</span>
          </div>
        </div>

        <button
          type="button"
          className={`advanced-toggle-btn ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Toggle custom prompt steering instructions"
        >
          <SlidersHorizontal size={14} />
          <span>Steer Prompt</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="prompt-steer-box">
          <label className="steer-label">Optional Guidance / Custom Instructions:</label>
          <input
            type="text"
            className="steer-input"
            placeholder="e.g. 'Make it extra empathetic', 'Offer a discount code', etc."
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
          />
        </div>
      )}

      {error && (
        <div className="panel-error-alert">
          <p>{error}</p>
        </div>
      )}

      {/* When no suggestion exists yet */}
      {!suggestion && (
        <div className="ai-idle-state">
          <div className="idle-content">
            <div className="idle-sparkle-circle">
              <Sparkles size={28} />
            </div>
            <h4>Ready to Assist</h4>
            <p className="idle-desc">
              Click below to analyze <strong>{latestCustomerMessage ? `"${latestCustomerMessage.substring(0, 60)}..."` : 'the latest message'}</strong>, retrieve brand policies, and draft a verified response.
            </p>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleGenerateClick}
              isLoading={isGenerating}
              leftIcon={<Sparkles size={18} />}
              className="generate-main-btn"
            >
              Generate AI Reply
            </Button>
          </div>
        </div>
      )}

      {/* When a suggestion is active */}
      {suggestion && (
        <div className="ai-active-state">
          {/* Guardrail Banner */}
          <GuardrailBanner
            status={suggestion.guardrailStatus}
            notes={suggestion.guardrailNotes}
            triggered={suggestion.guardrailTriggered}
          />

          {/* AI Suggestion Editor */}
          <AiSuggestionEditor
            suggestion={suggestion}
            onApprove={onApprove}
            onRegenerate={handleGenerateClick}
            onDiscard={onDiscard}
            isApproving={isApproving}
            isGenerating={isGenerating}
          />

          {/* Retrieved Knowledge Base Context */}
          <RetrievedContextViewer
            articles={suggestion.retrievedArticles}
            rawContext={suggestion.retrievedContext}
            brandName={brandName}
          />
        </div>
      )}
    </div>
  );
};
