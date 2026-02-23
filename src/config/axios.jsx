/** @format */

import axios from "axios";
import { getAccessToken } from "../utils/local-storage";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.request.use(
  config => {
    if (getAccessToken()) {
      config.headers.authorization = `Bearer ${getAccessToken()}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default axios;
