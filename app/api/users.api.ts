import type { TLoginResponse, TLoginUser, TRegisterUser } from "../@types";
import { api } from "./axios";

export const LoginUserAPI = async (data: TLoginUser): Promise<TLoginResponse> => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const RegisterUserAPI = async (data: TRegisterUser) => {
  const response = await api.post("/users/register", data);
  return response.data;
};
