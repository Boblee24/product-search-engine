import axios from 'axios';
import { SearchResponse, SearchFilters } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchProducts = async (
  filters: SearchFilters
): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get('/products/search', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export default apiClient;