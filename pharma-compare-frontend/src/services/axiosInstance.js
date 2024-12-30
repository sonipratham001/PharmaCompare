import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001", // Fallback to localhost if no environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;