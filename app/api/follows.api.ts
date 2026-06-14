import { api } from "./axios";

export const sendFollowRequestAPI = async (receiverId: string): Promise<void> => {
  await api.post("/follows/send", { receiverId });
};

export const acceptFollowRequestAPI = async (requestId: string): Promise<void> => {
  await api.post("/follows/accept", { requestId });
};

export const unfollowAPI = async (receiverId: string): Promise<void> => {
  await api.post("/follows/unfollow", { receiverId });
};

export const cancelFollowRequestAPI = async (followeeId: string): Promise<void> => {
  await api.post("/follows/cancel", { followeeId });
};

