import { create } from "zustand";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

interface RegisterStore {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: Gender;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setMiddleName: (value: string) => void;
  setGender: (value: Gender) => void;
  setEmailOrPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  setShowConfirmPassword: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "Male" as Gender,
  emailOrPhone: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
};

export const useRegisterStore = create<RegisterStore>((set) => ({
  ...initialState,
  setFirstName: (value) => set({ firstName: value }),
  setLastName: (value) => set({ lastName: value }),
  setMiddleName: (value) => set({ middleName: value }),
  setGender: (value) => set({ gender: value }),
  setEmailOrPhone: (value) => set({ emailOrPhone: value }),
  setPassword: (value) => set({ password: value }),
  setConfirmPassword: (value) => set({ confirmPassword: value }),
  setShowPassword: (value) => set({ showPassword: value }),
  setShowConfirmPassword: (value) => set({ showConfirmPassword: value }),
  reset: () => set(initialState),
}));
