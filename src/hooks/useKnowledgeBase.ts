import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeArticleDto, KnowledgeArticleRequest, PolicyCategory } from '../types/knowledgeBase';
import { knowledgeBaseApi } from '../api/knowledgeBaseApi';

export function useKnowledgeBase(brandId: number | null) {
  const [articles, setArticles] = useState<KnowledgeArticleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeBaseApi.getArticlesByBrand(brandId);
      setArticles(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load knowledge articles';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const createArticle = async (req: KnowledgeArticleRequest): Promise<KnowledgeArticleDto> => {
    const created = await knowledgeBaseApi.createArticle(req);
    setArticles((prev) => [created, ...prev]);
    return created;
  };

  const updateArticle = async (id: number, req: Partial<KnowledgeArticleRequest>): Promise<KnowledgeArticleDto> => {
    const updated = await knowledgeBaseApi.updateArticle(id, req);
    setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteArticle = async (id: number): Promise<void> => {
    await knowledgeBaseApi.deleteArticle(id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const searchArticles = async (query: string): Promise<KnowledgeArticleDto[]> => {
    if (!brandId) return [];
    if (!query.trim()) {
      return articles;
    }
    return knowledgeBaseApi.searchArticles(brandId, query);
  };

  const filterByCategory = (category?: PolicyCategory) => {
    if (!category) return articles;
    return articles.filter((a) => a.category === category);
  };

  return {
    articles,
    loading,
    error,
    refreshArticles: fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    filterByCategory,
  };
}
