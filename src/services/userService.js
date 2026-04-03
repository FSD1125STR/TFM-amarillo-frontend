import { api } from "./api";

export const userService = {
  async updateUser(id, payload) {
    const response = await api.put(`/users/${id}`, payload, {
      skipGlobalErrorToast: true,
    });
    return response.data;
  },
};
