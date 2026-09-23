import React, { useState } from 'react';
import { Plus, Search, BookOpen, Layers } from 'lucide-react';
import type { BrandDto } from '../../types/brand';
import type { KnowledgeArticleDto, KnowledgeArticleRequest, PolicyCategory } from '../../types/knowledgeBase';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ArticleCard } from './ArticleCard';
import { ArticleEditorModal } from './ArticleEditorModal';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: BrandDto[];
  activeBrandId: number;
  onSelectBrand: (id: number) => void;
  articles: KnowledgeArticleDto[];
  onCreateArticle: (req: KnowledgeArticleRequest) => Promise<KnowledgeArticleDto>;
  onUpdateArticle: (id: number, req: Partial<KnowledgeArticleRequest>) => Promise<KnowledgeArticleDto>;
  onDeleteArticle: (id: number) => Promise<void>;
}

const CATEGORY_TABS: (PolicyCategory | 'ALL')[] = ['ALL', 'RETURN', 'REFUND', 'SHIPPING', 'CANCELLATION'];

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  brands,
  activeBrandId,
  onSelectBrand,
  articles,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<KnowledgeArticleDto | null>(null);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setArticleToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (article: KnowledgeArticleDto) => {
    setArticleToEdit(article);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = async (req: KnowledgeArticleRequest) => {
    if (articleToEdit) {
      await onUpdateArticle(articleToEdit.id, req);
    } else {
      await onCreateArticle(req);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this policy article?')) {
      await onDeleteArticle(id);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Brand Knowledge Base Manager"
        subtitle="Manage brand-specific policies (Return, Refund, Shipping, Cancellation). Edit policies to immediately test AI behavior."
        maxWidth="xl"
      >
        <div className="kb-modal-content">
          {/* Brand Switcher Tabs */}
          <div className="kb-brand-tabs">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`kb-brand-tab ${b.id === activeBrandId ? 'active' : ''}`}
                onClick={() => onSelectBrand(b.id)}
              >
                <Layers size={14} />
                <span>{b.name}</span>
                <span className="kb-code-tag">({b.code})</span>
              </button>
            ))}
          </div>

          {/* Brand Tone Description */}
          {activeBrand && (
            <div className="brand-tone-callout">
              <strong>Brand Tone & Voice:</strong> {activeBrand.toneGuidelines}
            </div>
          )}

          {/* Controls Bar: Search, Category Filters, and Add Button */}
          <div className="kb-controls-bar">
            <div className="kb-search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search policies by keyword, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="kb-category-pills">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} />}
              onClick={handleOpenCreate}
            >
              Add Policy
            </Button>
          </div>

          {/* Articles List */}
          <div className="kb-articles-grid">
            {filteredArticles.length === 0 ? (
              <div className="kb-empty-state">
                <BookOpen size={36} className="text-gray-500" />
                <h4>No policies found</h4>
                <p>Create a new policy article for {activeBrand?.name || 'this brand'} or clear search filters.</p>
              </div>
            ) : (
              filteredArticles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Create / Edit Article Modal */}
      <ArticleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
        brandId={activeBrandId}
        brandName={activeBrand?.name || ''}
      />
    </>
  );
};
