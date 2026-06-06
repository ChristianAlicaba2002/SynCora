import type { TCreateTask, TTask, TTasksResponse } from "../@types";
import { api } from "./axios";

export const createTaskAPI = async (data: TCreateTask) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const getTasksAPI = async (): Promise<TTask[]> => {
  const response = await api.get<TTasksResponse>("/tasks");
  return response.data.data;
};
