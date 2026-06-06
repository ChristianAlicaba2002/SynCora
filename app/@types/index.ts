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

export type TLoginResponse = {
  jwt: string;
  message: string;
  status: number;
  user: Omit<TUsers, "password" | "confirmPassword">;
}

export type TTasks = {
  title: string,
  description: string,
  status: string,
  priority: string,
  dueDate: string,
}

export type TCreateTask = Omit<TTasks, "id">

export type TTask = TTasks & {
  id: string,
  createdAt: string,
  updatedAt: string,
}