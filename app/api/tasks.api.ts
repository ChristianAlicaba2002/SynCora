import type { TCreateTask } from "../@types";
import { useAuthStore } from "../store/authStore";
import { api } from "./axios";

export const createTaskAPI = async (data: TCreateTask) => {
  const state = useAuthStore.getState();
  console.log("[createTask] _hasHydrated:", state._hasHydrated);
  console.log("[createTask] token:", state.token ? `${state.token.slice(0, 30)}...` : "NULL");
  console.log("[createTask] axios default header:", api.defaults.headers.common["Authorization"] ?? "NOT SET");
  const response = await api.post("/tasks", data);
  return response.data;
};

// export const getTasksAPI = async (): Promise<TTask[]> => {
//   const response = await api.get("/tasks");
//   return response.data;
// };
