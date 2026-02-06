import axios from "axios";

// use to --> env (deploy later) 
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// better network error message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      console.error("Network error or backend down");
      return Promise.reject({
        message: "Backend not running (connection refused). Start server on port 5000.",
      });
    }
    return Promise.reject(error);
  }
);

export default api;
