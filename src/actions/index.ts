"use server";

import axios, { AxiosError } from "axios";
import {
	ErrorResponse,
	GitHubRelease,
	SubscriptionPlan,
	SubscriptionResponse,
} from "@/types";
import { cache } from "react";

const GATEWAY_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";

// Get available subscription plans
export const getSubscriptionPlans = cache(
	async (): Promise<{
		plans: SubscriptionPlan[];
		activeSubscription: SubscriptionResponse | null;
	} | null> => {
		try {
			const response = await axios.get(
				`${GATEWAY_API_URL}/subscriptions/public/plans`
			);
			return response.data;
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			console.error(
				axiosError.response?.data.message ||
					"Failed to fetch subscription plans"
			);
			return null;
		}
	}
);

// fetch latest release of app from github
export const fetchLatestRelease = cache(async () => {
	try {
		const response = await fetch(
			"https://api.github.com/repos/AnanthuTD/FlareCast-Electron/releases/latest",
			{
				headers: {
					Accept: "application/vnd.github.v3+json",
				},
			}
		);
		if (!response.ok) {
			throw new Error("Failed to fetch release information");
		}
		const data = (await response.json()) as GitHubRelease;
		return data;
	} catch (err: any) {
		console.error(err);
		return null;
	}
});
