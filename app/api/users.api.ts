import type { TRegisterUser } from "../@types";
import { api } from "./axios";


export const RegisterUserAPI = async (data: TRegisterUser) => {
    const response = await api.post("/users/register", data);
    return response.data
}
