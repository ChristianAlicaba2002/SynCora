import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

const TOKEN_KEY = "auth_token";

// SecureStore is native-only. On web fall back to localStorage.
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

interface AuthStore {
  token: string | null;
  _hasHydrated: boolean;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  _hasHydrated: false,

  setToken: async (token) => {
    await storage.setItem(TOKEN_KEY, token);
    set({ token });
  },

  clearToken: async () => {
    await storage.removeItem(TOKEN_KEY);
    set({ token: null });
  },

  loadToken: async () => {
    try {
      const token = await storage.getItem(TOKEN_KEY);
      // token is either a valid string or null — both are fine
      set({ token: token ?? null, _hasHydrated: true });
    } catch (e) {
      // Storage read failed — treat as unauthenticated
      console.warn("[authStore] loadToken failed:", e);
      set({ token: null, _hasHydrated: true });
    }
  },
}));
