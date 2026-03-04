import { create } from "zustand";
import { setAccessToken as setTokenToStorage, removeAccessToken } from "@/utils/local-storage";

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

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessExpire: null,
  accessToken: null,
  refreshExpire: null,
  refreshToken: null,
  user: null,

  loadAuth: () => {
    const authString = globalThis.localStorage.getItem(AUTH_STORE_KEY);
    if (authString) {
      const authData = JSON.parse(authString);
      set(authData);
      setTokenToStorage(authData.accessToken);
    }
  },

  setAuth: data => {
    set(data);
    globalThis.localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(data));
    if (data.accessToken) {
      setTokenToStorage(data.accessToken);
    }
  },

  setAccessToken: (token: string) => {
    const currentState = get();
    const newState = { ...currentState, accessToken: token };
    set(newState);
    globalThis.localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(newState));
    setTokenToStorage(token);
  },

  clearAuth: () => {
    set({
      accessExpire: null,
      accessToken: null,
      refreshExpire: null,
      refreshToken: null,
      user: null,
    });
    globalThis.localStorage.removeItem(AUTH_STORE_KEY);
    removeAccessToken();
  },
}));
