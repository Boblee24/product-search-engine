export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // Decimal comes as string from API
  brand: string;
  category: string;
  stockQuantity: number;
  imageUrl: string | null;
  rating: string | null; // Decimal comes as string
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
}