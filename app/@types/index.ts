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
    createdAt: string,
    updatedAt: string,
    isFollowing?: boolean,
    isRequested?: boolean,
    hasIncomingRequest?: boolean,
}

export type TFollowStatus = {
    isFollowing: boolean,
    isRequested: boolean,
    hasIncomingRequest?: boolean,
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
export type TUpdateTask = Partial<TTasks>
export type TUpdateProfile = Partial<Pick<TUsers, "firstName" | "lastName" | "middleName" | "gender" | "bio" | "imageUrl">>

export type TTask = TTasks & {
  id?: string,
  createdAt?: string,
  updatedAt?: string,
  userId?: string,
  createdFullName?: string,
  createdByFullName?: string,
  imageUrl?: string,
}

export type TTasksResponse = {
  message: string,
  status: number,
  data: TTask[],
}

export type TFollowRequestReponse = {
  id: string,
  senderId: string,
  receiverId: string,
  status: string,
  createdAt: string,
  sender: Pick<TUsers, "id" | "firstName" | "middleName" | "lastName" | "imageUrl">,
}