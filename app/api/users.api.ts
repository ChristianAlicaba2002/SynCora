import type { TFollowRequestReponse, TLoginResponse, TLoginUser, TRegisterUser, TUserFollowersCountResponse, TUsers } from "../@types";
import { api } from "./axios";

export const LoginUserAPI = async (data: TLoginUser): Promise<TLoginResponse> => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const RegisterUserAPI = async (data: TRegisterUser) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

export const getCurrentUserAPI = async (): Promise<TUsers> => {
  const response = await api.get<{ data: TUsers }>(`/users/me`);
  return response.data.data;
};

export const getUserByIdAPI = async (id: string): Promise<TUsers> => {
  const response = await api.get<{ data: TUsers }>(`/users/${id}`);
  return response.data.data;
};

export const updateProfileAPI = async ({ userId, data }: { userId: string; data: import("../@types").TUpdateProfile }): Promise<TUsers> => {
  const response = await api.patch<{ data: TUsers }>(`/users/${userId}`, data);
  return response.data.data;
};

export const searchUserAPI = async (query: string): Promise<TUsers[]> => {
  const response = await api.get<{ data: TUsers[] }>("/users/search", {
    params: { searchQuery: query },
  });
  return response.data.data;
};

export const getUserFollowRequestAPI = async (): Promise<TFollowRequestReponse[]> => {
  const response = await api.get<{ data: TFollowRequestReponse[] }>("/follows");
  return response.data.data;
}

function extractFollowCount(payload: TUserFollowersCountResponse | number): number {
  return typeof payload === "number" ? payload : payload.data;
}

export const getUserFollowersCountAPI = async (userId?: string): Promise<number> => {
  const url = userId ? `/users/${userId}/followers-count` : "/users/followers-count";
  const response = await api.get<{ data: TUserFollowersCountResponse | number }>(url);
  return extractFollowCount(response.data.data);
};

export const getUserFollowingCountAPI = async (userId?: string): Promise<number> => {
  const url = userId ? `/users/${userId}/following-count` : "/users/following-count";
  const response = await api.get<{ data: TUserFollowersCountResponse | number }>(url);
  return extractFollowCount(response.data.data);
};