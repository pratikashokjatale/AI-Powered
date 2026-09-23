import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { KnowledgeArticleDto } from '../../types/knowledgeBase';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

interface ArticleCardProps {
  article: KnowledgeArticleDto;
  onEdit: (article: KnowledgeArticleDto) => void;
  onDelete: (id: number) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onEdit, onDelete }) => {
  return (
    <div className="kb-article-card">
      <div className="article-card-header">
        <div className="card-title-group">
          <Badge variant="primary" size="sm">
            {article.category}
          </Badge>
          <h4 className="article-title">{article.title}</h4>
        </div>

        <div className="card-action-group">
          <button
            type="button"
            className="action-icon-btn"
            onClick={() => onEdit(article)}
            aria-label="Edit policy"
            title="Edit policy article"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={() => onDelete(article.id)}
            aria-label="Delete policy"
            title="Delete policy article"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="article-content-text">{article.content}</p>

      {article.keywords && (
        <div className="article-keywords-row">
          <span className="keywords-label">Keywords:</span>
          {article.keywords.split(',').map((kw, i) => (
            <span key={i} className="keyword-tag">
              {kw.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="article-footer-meta">
        <span>Updated: {formatDate(article.updatedAt)}</span>
        <span>Status: {article.active ? 'Active' : 'Inactive'}</span>
      </div>
    </div>
  );
};
