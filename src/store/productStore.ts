import { create } from 'zustand';
import { productsApi } from '@/lib/api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductState {
  products: Product[];
  categories: string[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  searchQuery: string;
  selectedCategory: string;
  // Caching: Store list responses by page, search, and category
  cache: Record<string, { products: Product[]; total: number }>;
  fetchProducts: (options?: {
    page?: number;
    search?: string;
    category?: string;
  }) => Promise<void>;
  fetchProductById: (id: number) => Promise<Product>;
  fetchCategories: () => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

const LIMIT = 10;

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
  searchQuery: '',
  selectedCategory: '',
  cache: {},

  fetchProducts: async (options = {}) => {
    const {
      page = get().page,
      search = get().searchQuery,
      category = get().selectedCategory,
    } = options;
    const skip = page * LIMIT;
    const cacheKey = `${page}-${search}-${category}`;

    // Check cache first
    if (get().cache[cacheKey]) {
      const cached = get().cache[cacheKey];
      set({
        products: cached.products,
        total: cached.total,
        page,
        searchQuery: search,
        selectedCategory: category,
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      let response;
      if (search) {
        response = await productsApi.searchProducts(search, { limit: LIMIT, skip });
      } else if (category) {
        response = await productsApi.getProductsByCategory(category, { limit: LIMIT, skip });
      } else {
        response = await productsApi.getProducts({ limit: LIMIT, skip });
      }

      // Cache the response
      set((state) => ({
        products: response.products,
        total: response.total,
        page,
        searchQuery: search,
        selectedCategory: category,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { products: response.products, total: response.total },
        },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const product = await productsApi.getProductById(id);
      set({ loading: false });
      return product;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        loading: false,
      });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productsApi.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setPage: (page: number) => {
    set({ page });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 0, selectedCategory: '' }); // Reset to first page and clear category
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category, page: 0, searchQuery: '' }); // Reset to first page and clear search
  },
}));
