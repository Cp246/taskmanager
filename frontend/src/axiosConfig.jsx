import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001", // or 5000 depending on your backend
});

export default axiosInstance;
