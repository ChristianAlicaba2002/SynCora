import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserAPI, LoginUserAPI, RegisterUserAPI, updateProfileAPI } from "../api/users.api";

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

export const useCurrentUserData = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUserAPI
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateProfile"],
        mutationFn: updateProfileAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
};