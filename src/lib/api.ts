// API helper for DummyJSON endpoints
const BASE_URL = 'https://dummyjson.com';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    return fetchApi<{
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      gender: string;
      image: string;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Users API
export const usersApi = {
  getUsers: async (params: { limit?: number; skip?: number } = {}) => {
    const { limit = 10, skip = 0 } = params;
    return fetchApi<{
      users: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/users?limit=${limit}&skip=${skip}`);
  },

  searchUsers: async (query: string, params: { limit?: number; skip?: number } = {}) => {
    const { limit = 10, skip = 0 } = params;
    return fetchApi<{
      users: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  },

  getUserById: async (id: number) => {
    return fetchApi<any>(`/users/${id}`);
  },
};

// Products API
export const productsApi = {
  getProducts: async (params: { limit?: number; skip?: number } = {}) => {
    const { limit = 10, skip = 0 } = params;
    return fetchApi<{
      products: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/products?limit=${limit}&skip=${skip}`);
  },

  searchProducts: async (query: string, params: { limit?: number; skip?: number } = {}) => {
    const { limit = 10, skip = 0 } = params;
    return fetchApi<{
      products: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  },

  getProductsByCategory: async (category: string, params: { limit?: number; skip?: number } = {}) => {
    const { limit = 10, skip = 0 } = params;
    return fetchApi<{
      products: any[];
      total: number;
      skip: number;
      limit: number;
    }>(`/products/category/${category}?limit=${limit}&skip=${skip}`);
  },

  getProductById: async (id: number) => {
    return fetchApi<any>(`/products/${id}`);
  },

  getCategories: async () => {
    return fetchApi<string[]>('/products/categories');
  },
};
