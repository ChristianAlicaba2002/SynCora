import type { TCreateTask, TTask, TTasksResponse, TUpdateTask } from "../@types";
import { api } from "./axios";

export const allTasksAPI = async (): Promise<TTask[]> => {
  const response = await api.get<TTasksResponse>("/tasks/all");
  return response.data.data;
};

export const createTaskAPI = async (data: TCreateTask) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const getTasksAPI = async (): Promise<TTask[]> => {
  const response = await api.get<TTasksResponse>("/tasks");
  return response.data.data;
};

export const getTaskByIdAPI = async (id: string): Promise<TTask> => {
  const response = await api.get<{ message: string; status: number; data: TTask }>(`/tasks/${id}`);
  return response.data.data;
};

export const updateTaskAPI = async ({ id, data }: { id: string; data: TUpdateTask }): Promise<TTask> => {
  const response = await api.patch<{ message: string; status: number; data: TTask }>(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTaskAPI = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
