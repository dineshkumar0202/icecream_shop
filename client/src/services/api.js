import axios from "axios";

// Update this baseURL if your backend runs on a different host/port.
// By default the Express API in this project runs on http://localhost:3005/api
const api = axios.create({
  baseURL: "http://localhost:3005/api",
});

// Add token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // Prevent invalid token
  }

  return config;
});

export default api;
