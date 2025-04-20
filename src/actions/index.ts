"use server";

import axios, { AxiosError } from "axios";
import { ErrorResponse, SubscriptionPlan, SubscriptionResponse } from "@/types";

const GATEWAY_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

// Get available subscription plans
export const getSubscriptionPlans = async (): Promise<{
	plans: SubscriptionPlan[];
	activeSubscription: SubscriptionResponse | null;
}> => {
	try {
		const response = await axios.get(`${GATEWAY_API_URL}/subscriptions/public/plans`);
		return response.data;
	} catch (error) {
		console.error(error);

		const axiosError = error as AxiosError<ErrorResponse>;
		throw new Error(
			axiosError.response?.data.message || "Failed to fetch subscription plans"
		);
	}
};
