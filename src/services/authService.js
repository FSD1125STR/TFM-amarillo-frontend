import { api } from "./api";

const authService = {
  async register(userData) {
    const response = await api.post("/auth/register", userData, {
      skipGlobalErrorToast: true,
    });
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials, {
      skipGlobalErrorToast: true,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default authService;
