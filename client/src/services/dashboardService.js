import api from "./api";
export const getTotals = () => api.get("/dashboard/totals").then((r) => r.data);
export const getTopFlavors = () =>
  api.get("/dashboard/top-flavors").then((r) => r.data);
export const getTopFlavorByCity = (city) =>
  api
    .get("/dashboard/top-flavor?city=" + encodeURIComponent(city))
    .then((r) => r.data);
