import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

// Persist token and user to localStorage
const persistAuth = (token: string, user: User) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

const loadAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { token, ...user } = response;
      
      persistAuth(token, user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const { token, user } = loadAuth();
    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    }
  },
}));
