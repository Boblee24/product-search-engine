'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import FilterBar from '@/components/search/FilterBar';
import ProductCard from '@/components/search/ProductCard';
import { searchProducts } from '@/lib/api';
import { Product, SearchFilters } from '@/types/product';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    page: 1,
    sortBy: 'relevance',
  });

  // Perform search
  const performSearch = async (newFilters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchProducts(newFilters);
      setProducts(response.products);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to fetch products. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search when filters change
  useEffect(() => {
    if (filters.query) {
      performSearch(filters);
    }
  }, [filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Product Search Engine
          </h1>
          <p className="text-gray-600">
            Search through 1,000+ products with advanced filtering
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} initialValue={filters.query} />
        </div>

        {/* Filters */}
        {filters.query && (
          <div className="mb-6">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Results Count */}
        {filters.query && !loading && (
          <div className="mb-4 text-gray-600">
            Found {total} product{total !== 1 ? 's' : ''}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filters.query && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found for &quot;{filters.query}&quot;
            </p>
            <p className="text-gray-400 mt-2">
              Try different keywords or filters
            </p>
          </div>
        )}

        {/* Initial State */}
        {!filters.query && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Start by searching for a product
            </p>
            <p className="text-gray-400 mt-2">
              Try: &quot;Nike&quot;, &quot;Apple&quot;, &quot;Laptop&quot;, &quot;Shoes&quot;
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
