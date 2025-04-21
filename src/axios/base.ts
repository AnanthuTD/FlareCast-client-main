import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const baseConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true, // For cookies (refresh tokens)
};

export const createBaseAxiosInstance = (): AxiosInstance => {
  return axios.create(baseConfig);
};