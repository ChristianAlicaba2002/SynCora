import type { TFollowRequestReponse, TLoginResponse, TLoginUser, TRegisterUser, TUsers } from "../@types";
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