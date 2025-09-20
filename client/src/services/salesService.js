import api from "./api";
export const getSales = (q) =>
  api.get("/sales", { params: q }).then((r) => r.data);
export const addSale = (s) => api.post("/sales", s).then((r) => r.data);
// export const updateSale = (id, s) => api.put(`/sales/${id}`, s).then((r) => r.data);
export const deleteSale = (id) => api.delete(`/sales/${id}`).then((r) => r.data);
export const updateSale = (id, sale) => api.put(`/sales/${id}`, sale);
