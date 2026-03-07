import axios from "axios";

const API = axios.create({
  baseURL: "https://pixel-vault-kd40.onrender.com/api"
});

// token automatically attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
