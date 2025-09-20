import api from "./api";
export const getBranches = () => api.get("/branches").then((r) => r.data);
export const createBranch = (b) => api.post("/branches", b).then((r) => r.data);
export const updateBranch = (id, b) => api.put(`/branches/${id}`, b).then((r) => r.data);
export const deleteBranch = (id) => api.delete(`/branches/${id}`).then((r) => r.data);
