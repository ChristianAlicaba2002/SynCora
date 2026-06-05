import { create } from "zustand";

export type Status   = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

interface CreateStore {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  titleError: string;
  descriptionError: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setStatus: (value: Status) => void;
  setPriority: (value: Priority) => void;
  setDueDate: (value: string) => void;
  setTitleError: (value: string) => void;
  setDescriptionError: (value: string) => void;
  reset: () => void;
}

const getDefaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString();
};

const initialState = {
  title: "",
  description: "",
  status: "todo" as Status,
  priority: "medium" as Priority,
  dueDate: getDefaultDueDate(),
  titleError: "",
  descriptionError: "",
};

export const useCreateStore = create<CreateStore>((set) => ({
  ...initialState,
  setTitle: (value) => set({ title: value }),
  setDescription: (value) => set({ description: value }),
  setStatus: (value) => set({ status: value }),
  setPriority: (value) => set({ priority: value }),
  setDueDate: (value) => set({ dueDate: value }),
  setTitleError: (value) => set({ titleError: value }),
  setDescriptionError: (value) => set({ descriptionError: value }),
  reset: () => set({ ...initialState, dueDate: getDefaultDueDate() }),
}));
