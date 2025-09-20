import api from "./api";
export const login = (p) => api.post("/auth/login", p).then((r) => r.data);
export const register = (p) =>
  api.post("/auth/register", p).then((r) => r.data);
