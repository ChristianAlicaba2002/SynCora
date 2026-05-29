import { create } from "zustand";

interface LoginStore {
  email: string;
  password: string;
  showPassword: boolean;
  isError: boolean;
  errorMessage: string;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  setEmailErrorMessage: (value: string) => void;
  setPasswordErrorMessage: (value: string) => void;
  setIsLoading: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  email: "",
  password: "",
  showPassword: false,
  isError: false,
  errorMessage: "",
  emailErrorMessage: "",
  passwordErrorMessage: "",
  isLoading: false,
};

export const useLoginStore = create<LoginStore>((set) => ({
  ...initialState,
  setEmail: (value) => set({ email: value }),
  setPassword: (value) => set({ password: value }),
  setShowPassword: (value) => set({ showPassword: value }),
  setIsError: (value) => set({ isError: value }),
  setErrorMessage: (value) => set({errorMessage: value}),
  setEmailErrorMessage: (value) => set({ emailErrorMessage: value }),
  setPasswordErrorMessage: (value) => set({ passwordErrorMessage: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  reset: () => set(initialState),
}));
