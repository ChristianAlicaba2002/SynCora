import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TFollowStatus } from "../@types";
import { acceptFollowRequestAPI, cancelFollowRequestAPI, sendFollowRequestAPI, unfollowAPI } from "../api/follows.api";
import { getCurrentUserAPI, getUserByIdAPI, getUserFollowersCountAPI, getUserFollowingCountAPI, getUserFollowRequestAPI, LoginUserAPI, RegisterUserAPI, searchUserAPI, updateProfileAPI } from "../api/users.api";

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

export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserByIdAPI(id),
        enabled: !!id,
    });
};

async function getFollowStatusFromUser(userId: string): Promise<TFollowStatus> {
    const user = await getUserByIdAPI(userId);
    return {
        isFollowing: user.isFollowing ?? false,
        isRequested: user.isRequested ?? false,
        hasIncomingRequest: user.hasIncomingRequest ?? false,
    };
}

export const useFollowStatus = (userId: string) => {
    return useQuery({
        queryKey: ["followStatus", userId],
        queryFn: () => getFollowStatusFromUser(userId),
        enabled: !!userId,
        retry: false,
    });
};

export const useSendFollowRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["sendFollowRequest"],
        mutationFn: sendFollowRequestAPI,
        onSuccess: (_, receiverId) => {
            queryClient.setQueryData(["followStatus", receiverId], {
                isFollowing: false,
                isRequested: true,
                hasIncomingRequest: false,
            });
            queryClient.invalidateQueries({ queryKey: ["user", receiverId] });
            queryClient.invalidateQueries({ queryKey: ["userFollowingCount"] });
        },
    });
};

export const useAcceptFollowRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["acceptFollowRequest"],
        mutationFn: ({ requestId }: { requestId: string; senderId: string }) =>
            acceptFollowRequestAPI(requestId),
        onSuccess: (_, { senderId }) => {
            queryClient.setQueryData(["followStatus", senderId], {
                isFollowing: true,
                isRequested: false,
                hasIncomingRequest: false,
            });
            queryClient.invalidateQueries({ queryKey: ["user", senderId] });
            queryClient.invalidateQueries({ queryKey: ["userFollowRequest"] });
            queryClient.invalidateQueries({ queryKey: ["userFollowersCount"] });
            queryClient.invalidateQueries({ queryKey: ["userFollowingCount"] });
        },
    });
};

export const useCancelFollowRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["cancelFollowRequest"],
        mutationFn: cancelFollowRequestAPI,
        onSuccess: (_, followeeId) => {
            queryClient.setQueryData(["followStatus", followeeId], {
                isFollowing: false,
                isRequested: false,
                hasIncomingRequest: false,
            });
            queryClient.invalidateQueries({ queryKey: ["user", followeeId] });
            queryClient.invalidateQueries({ queryKey: ["userFollowRequest"] });
            queryClient.invalidateQueries({ queryKey: ["userFollowersCount"] });
            queryClient.invalidateQueries({ queryKey: ["userFollowingCount"] });
        },
    });
};

export const useUnfollow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["unfollow"],
        mutationFn: unfollowAPI,
        onSuccess: (_, userId) => {
            queryClient.setQueryData(["followStatus", userId], {
                isFollowing: false,
                isRequested: false,
                hasIncomingRequest: false,
            });
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
            queryClient.invalidateQueries({ queryKey: ["userFollowersCount"] });
            queryClient.invalidateQueries({ queryKey: ["userFollowingCount"] });
        },
    });
};

export const useSearchUser = (query: string) => {
    const trimmed = query.trim();
    return useQuery({
        queryKey: ["searchUser", trimmed],
        queryFn: () => searchUserAPI(trimmed),
        enabled: trimmed.length >= 2,
    });
};

export const useGetUserFollowRequest = () => {
    return useQuery({
        queryKey: ["userFollowRequest"],
        queryFn: getUserFollowRequestAPI,
    });
};

export const useGetUserFollowersCount = (userId?: string) => {
    return useQuery({
        queryKey: userId ? ["userFollowersCount", userId] : ["userFollowersCount"],
        queryFn: () => getUserFollowersCountAPI(userId),
        enabled: userId ? !!userId : true,
    });
};

export const useGetUserFollowingCount = (userId?: string) => {
    return useQuery({
        queryKey: userId ? ["userFollowingCount", userId] : ["userFollowingCount"],
        queryFn: () => getUserFollowingCountAPI(userId),
        enabled: userId ? !!userId : true,
    });
};