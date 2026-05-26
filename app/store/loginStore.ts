import { create } from "zustand";

interface ILoginStore {
    email: string;
    setEmail: (value: string) => void;

    password: string;
    setPassword: (value: string) => void;

    showPassword: boolean;
    setShowPassword: (value: boolean) => void;

    isError: boolean;
    setIsError: (value: boolean) => void;

    emailErrorMessage: string;
    setEmailErrorMessage: (value: string) => void;

    passwordErrorMessage: string;
    setPasswordErrorMessage: (value: string) => void;

    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}

const LoginStore = create<ILoginStore>((set) => ({
    email: "",
    setEmail: (value) => set(() => ({
        email: value
    })),

    password: "",
    setPassword: (value) => set(() => ({
        password: value
    })),

    showPassword: false,
    setShowPassword: (value) => set((prev) => ({
        showPassword: value
    })),

    isError: false,
    setIsError: (value) => set(() => ({
        isError: value
    })),

    emailErrorMessage: "",
    setEmailErrorMessage: (value) => set(() => ({
        emailErrorMessage: value
    })),

    passwordErrorMessage: "",
    setPasswordErrorMessage: (value) => set(() => ({
        passwordErrorMessage: value
    })),

    isLoading: false,
    setIsLoading: (value: boolean) => set(() => ({
        isLoading: value
    }))
}))

export const useLoginStore = () => {
    const email = LoginStore((state) => state.email);
    const setEmail = LoginStore((state) => state.setEmail);
    const password = LoginStore((state) => state.password);
    const setPassword = LoginStore((state) => state.setPassword);
    const showPassword = LoginStore((state) => state.showPassword);
    const setShowPassword = LoginStore((state) => state.setShowPassword);
    const isError = LoginStore((state) => state.isError);
    const setIsError = LoginStore((state) => state.setIsError);
    const emailErrorMessage = LoginStore((state) => state.emailErrorMessage);
    const setEmailErrorMessage = LoginStore((state) => state.setEmailErrorMessage);
    const passwordErrorMessage = LoginStore((state) => state.passwordErrorMessage);
    const setPasswordErrorMessage = LoginStore((state) => state.setPasswordErrorMessage);
    const isLoading = LoginStore((state) => state.isLoading);
    const setIsLoading = LoginStore((state) => state.setIsLoading);

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        isError,
        setIsError,
        emailErrorMessage,
        setEmailErrorMessage,
        passwordErrorMessage,
        setPasswordErrorMessage,
        isLoading,
        setIsLoading,
    }
}