/** @format */
import axios from "axios";
import { getAccessToken } from "../utils/local-storage";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.request.use(
  config => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  err => Promise.reject(err)
);

export default axios;
