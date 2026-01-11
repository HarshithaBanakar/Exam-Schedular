import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await apiRequest.post("/auth/login", { email, password });
      return res.data;
    },
    signup: async (name, email, password) => {
      const res = await apiRequest.post("/auth/signup", { name, email, password });
      return res.data;
    },
  },
  exams: {
    getAll: async () => {
      const res = await apiRequest.get("/exams");
      return res.data;
    },
    create: async (examData) => {
      const res = await apiRequest.post("/exams", examData);
      return res.data;
    },
    update: async (id, updates) => {
      const res = await apiRequest.put(`/exams/${id}`, updates);
      return res.data;
    },
    delete: async (id) => {
      const res = await apiRequest.delete(`/exams/${id}`);
      return res.data;
    },
  },
};

export default apiRequest;
