import api from "./api";
export const requestIngredient = (r) =>
  api.post("/ingredients", r).then((r) => r.data);
export const getRequests = () => api.get("/ingredients").then((r) => r.data);
export const updateRequest = (id, r) => 
  api.put(`/ingredients/${id}`, r).then((r) => r.data);
export const updateRequestStatus = (id, status) => 
  api.patch(`/ingredients/${id}`, { status }).then((r) => r.data);
export const deleteRequest = (id) => 
  api.delete(`/ingredients/${id}`).then((r) => r.data);
