import axios from "axios";
import { useAuthStore } from "../store/authStore";

const base_url = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Returns a promise that resolves once the persist store has rehydrated.
function waitForHydration(): Promise<void> {
  return new Promise((resolve) => {
    // Already hydrated — resolve immediately
    if (useAuthStore.getState()._hasHydrated) {
      resolve();
      return;
    }
    // Wait for the hydration flag to flip
    const unsub = useAuthStore.subscribe((state) => {
      if (state._hasHydrated) {
        unsub();
        resolve();
      }
    });
  });
}

// Attach the JWT token on every request, waiting for hydration if needed.
api.interceptors.request.use(async (config) => {
  await waitForHydration();
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
