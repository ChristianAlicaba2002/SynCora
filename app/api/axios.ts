import axios from "axios";
import { useAuthStore } from "../store/authStore";

const base_url = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
