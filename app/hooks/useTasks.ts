import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allTasksAPI, createTaskAPI, deleteTaskAPI, getTaskByIdAPI, getTasksAPI, updateTaskAPI } from "../api/tasks.api";

export const useAllTasks = () => {
  return useQuery({
    queryKey: ["allTasks"],
    queryFn: allTasksAPI,
  });
};

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasksAPI,
  });
};

export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTaskByIdAPI(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: createTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({queryKey: ["allTasks"]});
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTask"],
    mutationFn: updateTaskAPI,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({queryKey: ["allTasks"]});
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: deleteTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({queryKey: ["allTasks"]});
    },
  });
};
