export type TUsers = {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    gender: string,
    email: string,
    password: string,
    confirmPassword?: string,
    bio: string,
    imageUrl: string,
    CreatedAt: string,
    updatedAt: string,
}

export type TRegisterUser = Pick<TUsers, "firstName" | "lastName" | "middleName" | "gender" | "email" | "password" | "confirmPassword">
export type TLoginUser = Pick<TUsers, "email" | "password">