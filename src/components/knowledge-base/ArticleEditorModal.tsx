import React, { useState, useEffect } from 'react';
import type { KnowledgeArticleDto, KnowledgeArticleRequest, PolicyCategory } from '../../types/knowledgeBase';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: KnowledgeArticleRequest) => Promise<void>;
  articleToEdit: KnowledgeArticleDto | null;
  brandId: number;
  brandName: string;
}

const CATEGORIES: PolicyCategory[] = ['RETURN', 'REFUND', 'SHIPPING', 'CANCELLATION', 'GENERAL'];

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
  brandId,
  brandName,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PolicyCategory>('REFUND');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setCategory(articleToEdit.category);
      setContent(articleToEdit.content);
      setKeywords(articleToEdit.keywords || '');
      setActive(articleToEdit.active);
    } else {
      setTitle('');
      setCategory('REFUND');
      setContent('');
      setKeywords('');
      setActive(true);
    }
  }, [articleToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSave({
        brandId,
        category,
        title: title.trim(),
        content: content.trim(),
        keywords: keywords.trim(),
        active,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={articleToEdit ? 'Edit Brand Policy' : 'Create New Brand Policy'}
      subtitle={`Brand: ${brandName} — Updates are immediately reflected in AI generation.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="article-editor-form">
        <div className="form-group">
          <label className="form-label">Policy Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Aura Skincare 14-Day Return Policy"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Policy Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as PolicyCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} Policy
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Search Keywords (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. refund, return, broken, days"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Policy Guidelines & Rules (AI Context)</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Enter the full policy rules, condition windows (e.g. within 7 days of delivery), exclusions, and instructions for customer support..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Active (Eligible for AI retrieval)</span>
          </label>
        </div>

        <div className="modal-actions-right">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={saving}>
            {articleToEdit ? 'Update Policy' : 'Create Policy'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
