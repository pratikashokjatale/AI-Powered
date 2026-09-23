import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { KnowledgeArticleDto } from '../../types/knowledgeBase';
import { Badge } from '../common/Badge';

interface RetrievedContextViewerProps {
  articles: KnowledgeArticleDto[];
  rawContext: string;
  brandName: string;
}

export const RetrievedContextViewer: React.FC<RetrievedContextViewerProps> = ({
  articles,
  rawContext,
  brandName,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showRawContext, setShowRawContext] = useState(false);

  return (
    <div className="retrieved-context-container">
      <div className="context-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="context-title-group">
          <Database size={15} className="text-indigo-400" />
          <span className="context-title">Retrieved Brand Knowledge ({articles.length} Source{articles.length === 1 ? '' : 's'})</span>
          <Badge variant="primary" size="sm">
            {brandName}
          </Badge>
        </div>
        <button type="button" className="expand-toggle-btn" aria-label="Toggle context visibility">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="context-body">
          {articles.length === 0 ? (
            <div className="context-empty">
              <p>No matching knowledge base articles found for this inquiry.</p>
            </div>
          ) : (
            <div className="articles-context-list">
              {articles.map((art) => (
                <div key={art.id} className="article-context-card">
                  <div className="art-card-top">
                    <span className="art-title">{art.title}</span>
                    <Badge variant="info" size="sm">
                      {art.category}
                    </Badge>
                  </div>
                  <p className="art-snippet">{art.content}</p>
                </div>
              ))}
            </div>
          )}

          {rawContext && (
            <div className="raw-context-section">
              <button
                type="button"
                className="view-raw-btn"
                onClick={() => setShowRawContext(!showRawContext)}
              >
                <ExternalLink size={12} />
                <span>{showRawContext ? 'Hide Raw Prompt Context' : 'Inspect Raw LLM Context'}</span>
              </button>

              {showRawContext && (
                <pre className="raw-context-pre">{rawContext}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
