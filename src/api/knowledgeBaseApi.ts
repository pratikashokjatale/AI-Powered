import { axiosClient } from './axiosClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/common';
import type { KnowledgeArticleDto, KnowledgeArticleRequest, PolicyCategory } from '../types/knowledgeBase';

export const knowledgeBaseApi = {
  getArticlesByBrand: async (brandId: number, category?: PolicyCategory): Promise<KnowledgeArticleDto[]> => {
    const url = API_ENDPOINTS.KNOWLEDGE_BASE_BY_BRAND(brandId);
    const params = category ? { category } : {};
    const res = await axiosClient.get<ApiResponse<KnowledgeArticleDto[]>>(url, { params });
    return res.data.data;
  },

  getArticleById: async (id: number): Promise<KnowledgeArticleDto> => {
    const res = await axiosClient.get<ApiResponse<KnowledgeArticleDto>>(API_ENDPOINTS.KNOWLEDGE_BASE_BY_ID(id));
    return res.data.data;
  },

  createArticle: async (request: KnowledgeArticleRequest): Promise<KnowledgeArticleDto> => {
    const res = await axiosClient.post<ApiResponse<KnowledgeArticleDto>>(API_ENDPOINTS.KNOWLEDGE_BASE, request);
    return res.data.data;
  },

  updateArticle: async (id: number, request: Partial<KnowledgeArticleRequest>): Promise<KnowledgeArticleDto> => {
    const res = await axiosClient.put<ApiResponse<KnowledgeArticleDto>>(
      API_ENDPOINTS.KNOWLEDGE_BASE_BY_ID(id),
      request
    );
    return res.data.data;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.KNOWLEDGE_BASE_BY_ID(id));
  },

  searchArticles: async (brandId: number, query: string): Promise<KnowledgeArticleDto[]> => {
    const res = await axiosClient.get<ApiResponse<KnowledgeArticleDto[]>>(
      API_ENDPOINTS.KNOWLEDGE_BASE_SEARCH(brandId),
      { params: { q: query } }
    );
    return res.data.data;
  },
};
