import { useMutation } from "@tanstack/react-query";
import { RegisterUserAPI } from "../api/users.api";

export const useRegisterUser = () => {
    return useMutation({
        mutationKey: ["register"],
        mutationFn: RegisterUserAPI,
    })
}