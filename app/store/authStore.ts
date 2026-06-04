import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
