import type { TRegisterUser } from "../@types";
import { api } from "./axios";


export const RegisterUser = async (data: TRegisterUser) => {
    const response = await api.post("/users", data);

    return response.data
}