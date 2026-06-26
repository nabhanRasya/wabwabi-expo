import axios from "axios";

const BASE_URL = "https://www.sankavollerei.web.id/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data?.message || "Server Error");
    }
    throw new Error("Network error. Cek koneksi internet kamu.");
  },
);
