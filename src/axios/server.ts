'use server'

import { createBaseAxiosInstance } from "./base";
import { AxiosInstance, AxiosRequestConfig } from "axios";

export const createServerAxiosInstance = (cookies?: string): AxiosInstance => {
	const axiosInstance = createBaseAxiosInstance();

	if (cookies) {
		axiosInstance.defaults.headers.common["Cookie"] = cookies;
	}

	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config as AxiosRequestConfig & {
				_retry?: boolean;
			};

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				try {
					const response = await axiosInstance.post(
						"/api/users/auth/refresh-token"
					);
					const newAccessToken = response.data.accessToken;

					axiosInstance.defaults.headers.common[
						"Authorization"
					] = `Bearer ${newAccessToken}`;

					return axiosInstance(originalRequest);
				} catch (refreshError) {
					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
