import type { TLoginUser, TRegisterUser } from "../@types";
import { api } from "./axios";


export const LoginUserAPI = async (data: TLoginUser) => {
    const response = await api.post("/users/login", data);
    return response.data
}

export const RegisterUserAPI = async (data: TRegisterUser) => {
    const response = await api.post("/users/register", data);
    return response.data
}

