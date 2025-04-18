import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { createUserStore } from "@/stores/userStore";

const config: AxiosRequestConfig = {
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420",
	},
	withCredentials: true,
};

const axiosInstance: AxiosInstance = axios.create(config);
const userStore = createUserStore();

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to subscribe failed requests to wait for token refresh
const onTokenRefreshed = (token: string) => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

// Request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = userStore.getState().accessToken;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

const excludeFromAuth = [
	"/signin",
	"/signup",
	"/verification/email/success",
	"/verification/email/failure",
	"/verification/email/notify",
	"/verification/invitation",
	"/",
];

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// Wait for the new token if refresh is in progress
				return new Promise((resolve) => {
					addRefreshSubscriber((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(axiosInstance(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await axios.post("/api/users/auth/refresh-token");
				const newAccessToken = response.data.accessToken;

				userStore.getState().setAccessToken(newAccessToken);
				onTokenRefreshed(newAccessToken); // Notify all waiting requests
				isRefreshing = false;

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				userStore.getState().clearAccessToken();

				console.log("pathName: " + window.location.pathname)

				if (!excludeFromAuth.includes(window.location.pathname) && window.location.pathname !== '/') {
					window.location.href = "/signin";
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
