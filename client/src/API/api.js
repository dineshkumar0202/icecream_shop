// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("🔑 Attaching token:", token);
    // Send in both formats to be safe
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["x-auth-token"] = token;
  }
  return config;
});


export const getBranches = () => API.get("/branches");
export const getSales = (branchId) => API.get("/sales", { params: branchId ? { branch: branchId } : {} });
export const createSale = (payload) => API.post("/sales", payload);
export const deleteSale = (id) => API.delete(`/sales/${id}`);
export const updateBranch = (id, payload) => API.put(`/branches/${id}`, payload);
export const deleteBranch = (id) => API.delete(`/branches/${id}`);


export default api;