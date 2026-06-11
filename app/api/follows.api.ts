import { api } from "./axios";

export const sendFollowRequestAPI = async (followeeId: string): Promise<void> => {
  await api.post("/follows/send", { followeeId });
};

export const acceptFollowRequestAPI = async (followerId: string): Promise<void> => {
  await api.post("/follows/accept", { followerId });
};

export const cancelFollowRequestAPI = async (followeeId: string): Promise<void> => {
  await api.post("/follows/cancel", { followeeId });
};
