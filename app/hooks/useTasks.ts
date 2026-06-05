import { useMutation } from "@tanstack/react-query";
import { createTaskAPI } from "../api/tasks.api";

export const useCreateTask = () => {
    return useMutation({
        mutationKey: ["tasks"],
        mutationFn: createTaskAPI
    })
}