import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskAPI, getTasksAPI } from "../api/tasks.api";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasksAPI,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: createTaskAPI,
    onSuccess: () => {
      // Refresh the task list after a new task is created
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
