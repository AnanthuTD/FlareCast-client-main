import axiosInstance from "@/axios";
import { ErrorResponse, SubscriptionPlan, SubscriptionResponse } from "@/types";
import { AxiosError, isAxiosError } from "axios";

const API_BASE_URL = "/api/subscriptions";

// Check if user can subscribe
export const checkCanSubscribe = async (): Promise<{
	canSubscribe: boolean;
	message?: string;
}> => {
	try {
		const response = await axiosInstance.get(`${API_BASE_URL}/eligibility`);
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
		const { data } = await axiosInstance.get(
			"/api/users/limits/upload-permission"
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) return error.response?.data;
		throw new Error("Failed to get video limit");
	}
};

export const verifyPayment = async ({
	razorpayPaymentId,
	razorpaySignature,
	razorpaySubscriptionId,
}: {
	razorpayPaymentId: string;
	razorpaySubscriptionId: string;
	razorpaySignature: string;
}): Promise<boolean> => {
	try {
		await axiosInstance.post(`${API_BASE_URL}/verify-payment`, {
			razorpayPaymentId,
			razorpaySubscriptionId,
			razorpaySignature,
		});
		return true;
	} catch (error) {
		if (isAxiosError(error)) return error.response?.data;
		console.error(error.response.data.message || "Failed to verify payment");
		return false;
	}
};

export const getSubscriptionByRazorpayId = async ({
	razorpaySubscriptionId,
}: {
	razorpaySubscriptionId: string;
}): Promise<any> => {
	try {
		const { data } = await axiosInstance.get(
			`${API_BASE_URL}/${razorpaySubscriptionId}`
		);
		return data;
	} catch (error) {
		if (isAxiosError(error)) return error.response?.data;
		console.error(error.response.data.message || "Failed to verify payment");
		return null;
	}
};
