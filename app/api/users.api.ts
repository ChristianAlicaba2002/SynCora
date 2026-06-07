import type { TLoginResponse, TLoginUser, TRegisterUser, TUsers } from "../@types";
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

export const updateProfileAPI = async (data: import("../@types").TUpdateProfile): Promise<TUsers> => {
  const response = await api.patch<{ data: TUsers }>("/users/me", data);
  return response.data.data;
};