import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getBranches = () => API.get("/branches");
export const getSales = (branchId) => API.get("/sales", { params: branchId ? { branch: branchId } : {} });
export const createSale = (payload) => API.post("/sales", payload);
export const deleteSale = (id) => API.delete(`/sales/${id}`);
export const updateBranch = (id, payload) => API.put(`/branches/${id}`, payload);
export const deleteBranch = (id) => API.delete(`/branches/${id}`);

export default API;
