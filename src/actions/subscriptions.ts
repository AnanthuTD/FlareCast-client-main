import axiosInstance from "@/axios";
import { SubscriptionPlan } from "@/types";
import axios, { AxiosError, isAxiosError } from "axios";

const API_BASE_URL = "/api/user/subscriptions";

// Interface for error response
interface ErrorResponse {
	error?: string;
	message: string;
}

// Interface for subscription response (based on controller response)
interface SubscriptionResponse {
	id?: string;
	userId: string;
	planId: string;
	status: string;
	razorpayKeyId: string;
	shortUrl: string;
	subscriptionType: string;
	amount: number;
	[key: string]: any;
}

// Check if user can subscribe
export const checkCanSubscribe = async (): Promise<{
	canSubscribe: boolean;
	message?: string;
}> => {
	try {
		const response = await axiosInstance.get(`${API_BASE_URL}/canSubscribe`);
		return { canSubscribe: true, message: response.data.message };
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message ||
				"Failed to check subscription eligibility"
		);
	}
};

// Subscribe to a plan
export const subscribeToPlan = async (
	planId: string
): Promise<SubscriptionResponse> => {
	try {
		const response = await axiosInstance.post(`${API_BASE_URL}/subscribe`, {
			planId,
		});
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to create subscription"
		);
	}
};

// Get user's subscriptions
export const getSubscriptions = async (): Promise<SubscriptionResponse[]> => {
	try {
		const response = await axiosInstance.get(`${API_BASE_URL}/`);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to fetch subscriptions"
		);
	}
};

// Get available subscription plans
export const getSubscriptionPlansAuthenticated = async (): Promise<{
	plans: SubscriptionPlan[];
	activeSubscription: SubscriptionResponse | null;
}> => {
	try {
		const response = await axiosInstance.get(`${API_BASE_URL}/plans`);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to fetch subscription plans"
		);
	}
};

// Get available subscription plans
export const getSubscriptionPlans = async (): Promise<{
	plans: SubscriptionPlan[];
	activeSubscription: SubscriptionResponse | null;
}> => {
	try {
		const response = await axios.get(`/api/user/subscription-plans`);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to fetch subscription plans"
		);
	}
};

// Cancel subscription
export const cancelSubscription = async (): Promise<{
	message: string;
	status: string;
	razorpaySubscriptionId?: string;
}> => {
	try {
		const response = await axiosInstance.post(`${API_BASE_URL}/cancel`);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to cancel subscription"
		);
	}
};

export const getVideoLimit = async (): Promise<{
	message: string;
	permission: "granted" | "denied";
	maxVideoCount: number | null;
	totalVideoUploaded: number;
}> => {
	try {
		const { data } = await axiosInstance.get("/api/user/upload-permission");
		return data;
	} catch (error) {
		if (isAxiosError(error)) return error.response?.data;
		throw new Error("Failed to get video limit");
	}
};
