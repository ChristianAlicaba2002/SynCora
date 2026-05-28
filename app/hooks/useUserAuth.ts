import { useMutation } from "@tanstack/react-query";
import { LoginUserAPI, RegisterUserAPI } from "../api/users.api";

export const useLoginUser = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: LoginUserAPI
    })
}

export const useRegisterUser = () => {
    return useMutation({
        mutationKey: ["register"],
        mutationFn: RegisterUserAPI,
    })
}