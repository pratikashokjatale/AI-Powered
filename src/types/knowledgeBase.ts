export type PolicyCategory = 'RETURN' | 'REFUND' | 'SHIPPING' | 'CANCELLATION' | 'GENERAL';

export interface KnowledgeArticleDto {
  id: number;
  brandId: number;
  brandName?: string;
  category: PolicyCategory;
  title: string;
  content: string;
  keywords: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticleRequest {
  brandId: number;
  category: PolicyCategory;
  title: string;
  content: string;
  keywords: string;
  active: boolean;
}
