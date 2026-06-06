import axios from "axios";
import { useAuthStore } from "../store/authStore";

const base_url = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

function waitForHydration(): Promise<void> {
  return new Promise((resolve) => {
    if (useAuthStore.getState()._hasHydrated) {
      resolve();
      return;
    }
    const unsub = useAuthStore.subscribe((state) => {
      if (state._hasHydrated) {
        unsub();
        resolve();
      }
    });
  });
}

api.interceptors.request.use(async (config) => {
  await waitForHydration();
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
