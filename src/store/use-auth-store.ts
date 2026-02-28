import { create } from "zustand";

export interface User {
  avatar: string | null;
  email: string;
  id: number;
  role: string;
  username: string;
}

export interface AuthState {
  accessExpire: number | null;
  accessToken: string | null;
  refreshExpire: number | null;
  refreshToken: string | null;
  user: User | null;
}

interface AuthStore extends AuthState {
  loadAuth: () => void;
  setAuth: (data: AuthState) => void;
  clearAuth: () => void;
}

const AUTH_STORE_KEY = "auth";

export const useAuthStore = create<AuthStore>(set => ({
  accessExpire: null,
  accessToken: null,
  refreshExpire: null,
  refreshToken: null,
  user: null,
  loadAuth: () => {
    const auth = globalThis.localStorage.getItem(AUTH_STORE_KEY);
    if (auth) {
      set(() => JSON.parse(auth));
    }
  },
  setAuth: data => {
    set(() => ({ ...data }));
    globalThis.localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(data));
  },
  clearAuth: () => {
    set(() => ({
      accessExpire: null,
      accessToken: null,
      refreshExpire: null,
      refreshToken: null,
      user: null,
    }));
    globalThis.localStorage.removeItem(AUTH_STORE_KEY);
  },
}));
