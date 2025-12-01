import { create } from 'zustand';
import { usersApi } from '@/lib/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  image: string;
  company: {
    name: string;
    title: string;
  };
}

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  searchQuery: string;
  // Caching: Store list responses by page and search query to avoid redundant API calls
  cache: Record<string, { users: User[]; total: number }>;
  fetchUsers: (options?: { page?: number; search?: string }) => Promise<void>;
  fetchUserById: (id: number) => Promise<User>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
}

const LIMIT = 10;

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
  searchQuery: '',
  cache: {},

  fetchUsers: async (options = {}) => {
    const { page = get().page, search = get().searchQuery } = options;
    const skip = page * LIMIT;
    const cacheKey = `${page}-${search}`;

    // Check cache first
    if (get().cache[cacheKey]) {
      const cached = get().cache[cacheKey];
      set({ users: cached.users, total: cached.total, page, searchQuery: search });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = search
        ? await usersApi.searchUsers(search, { limit: LIMIT, skip })
        : await usersApi.getUsers({ limit: LIMIT, skip });

      // Cache the response
      set((state) => ({
        users: response.users,
        total: response.total,
        page,
        searchQuery: search,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { users: response.users, total: response.total },
        },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false,
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const user = await usersApi.getUserById(id);
      set({ loading: false });
      return user;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loading: false,
      });
      throw error;
    }
  },

  setPage: (page: number) => {
    set({ page });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, page: 0 }); // Reset to first page on search
  },
}));
