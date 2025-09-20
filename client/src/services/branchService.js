// src/services/branchService.js
import api from "./api";

// Get all branches
export const getBranches = () =>
  api.get("/branches").then((res) => res.data);

// Create a new branch
export const createBranch = (branch) =>
  api.post("/branches", branch).then((res) => res.data);

// Update an existing branch
export const updateBranch = (id, branch) =>
  api.put(`/branches/${id}`, branch).then((res) => res.data);

// Delete a branch
export const deleteBranch = (id) =>
  api.delete(`/branches/${id}`).then((res) => res.data);

