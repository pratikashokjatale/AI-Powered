import { axiosClient } from './axiosClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/common';
import type { BrandDto } from '../types/brand';

export const brandApi = {
  getAllBrands: async (): Promise<BrandDto[]> => {
    const res = await axiosClient.get<ApiResponse<BrandDto[]>>(API_ENDPOINTS.BRANDS);
    return res.data.data;
  },

  getBrandById: async (id: number): Promise<BrandDto> => {
    const res = await axiosClient.get<ApiResponse<BrandDto>>(API_ENDPOINTS.BRAND_BY_ID(id));
    return res.data.data;
  },
};
