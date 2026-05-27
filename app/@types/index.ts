export type TUsers = {
    Id: string,
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Gender: string,
    Email: string,
    Password: string,
    ConfirmPassword?: string,
    Bio: string,
    ImageUrl: string,
    CreatedAt: string,
    UpdateddAt: string,
}

export type TRegisterUser = Pick<TUsers, "FirstName" | "LastName" | "MiddleName" | "Gender" | "Email" | "Password" | "ConfirmPassword">