"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";
import { SubscriptionData, ActivePlan, SubscriptionPlan } from "@/types";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionHistory from "./SubscriptionHistory";
import {
	cancelSubscription,
	checkCanSubscribe,
	getSubscriptionPlansAuthenticated,
	subscribeToPlan,
	verifyPayment,
} from "@/actions/subscriptions";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

// Types
declare global {
	interface Window {
		Razorpay: any;
	}
}

const SubscriptionPage: React.FC = () => {
	const [subscriptionData, setSubscriptionData] =
		useState<SubscriptionData | null>(null);
	const [subscriptionPlans, setSubscriptionPlans] = useState<
		SubscriptionPlan[]
	>([]);
	const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
	const { onEvent } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions` as string,
		"/user/socket.io"
	);
	const router = useRouter();

	// Check subscription eligibility
	const checkSubscriptionEligibility =
		useCallback(async (): Promise<boolean> => {
			try {
				await checkCanSubscribe();
				return true;
			} catch (error: any) {
				console.error("Cannot subscribe:", error);
				toast.error("You cannot subscribe!", {
					description: error.message || "",
				});
				return false;
			}
		}, []);

	// Fetch subscription plans
	const fetchPlans = useCallback(async () => {
		try {
			const { plans, activeSubscription } =
				await getSubscriptionPlansAuthenticated();
			setSubscriptionPlans(plans);
			setActivePlan(activeSubscription);
		} catch (err) {
			console.error(err);
			toast.error("Failed to fetch subscription plans!");
		}
	}, []);

	// Handle subscription payment
	const handleSubscribe = async (planId: string) => {
		console.log("handleSubscribe");
		try {
			const canSubscribe = await checkSubscriptionEligibility();

			if (!canSubscribe) return;

			const subscription = await subscribeToPlan(planId);

			const razorpayOptions = {
				key: subscription.razorpayKeyId,
				subscription_id: subscription.razorpaySubscriptionId,
				name: "",
				description: `${planId} Subscription`,
				handler: async (response: {
					razorpay_payment_id: string;
					razorpay_subscription_id: string;
					razorpay_signature: string;
				}) => {
					try {
						const verificationResponse = await verifyPayment({
							razorpayPaymentId: response.razorpay_payment_id,
							razorpaySubscriptionId: response.razorpay_subscription_id,
							razorpaySignature: response.razorpay_signature,
						});

						if (verificationResponse) {
							toast.success("Payment successful!");
							// await fetchPlans();
							router.push(
								`/payment/success/${response.razorpay_subscription_id}`
							);
						} else {
							toast.error("Payment verification failed!");
							router.push(`/payment/failure`);
						}
					} catch (error) {
						console.error("Payment verification failed:", error);
						toast.error("Payment processing error!");
						router.push(`/payment/failure`);
					}
				},
				prefill: { email: subscription.notify_info?.notify_email },
				theme: { color: "#3399cc" },
			};

			const razorpay = new window.Razorpay(razorpayOptions);
			razorpay.open();
			// setSubscriptionData(subscription);
		} catch (err: any) {
			console.error(err);
			toast.error(err.response?.data?.message || "Failed to subscribe!");
		}
	};

	// Handle subscription cancellation
	const handleCancel = useCallback(async () => {
		try {
			await cancelSubscription();
			await fetchPlans();
			toast.success("Subscription cancelled successfully!");
		} catch (err: any) {
			console.error(err);
			toast.error(
				err.response?.data?.message || "Failed to cancel subscription!"
			);
		}
	}, [fetchPlans]);

	// Initial setup
	useEffect(() => {
		checkSubscriptionEligibility();
		fetchPlans();

		onEvent("subscription:status:update", fetchPlans);
	}, [checkSubscriptionEligibility, fetchPlans]);

	return (
		<div className="p-6 bg-white w-full">
			<SubscriptionPlans
				plans={subscriptionPlans}
				activePlan={activePlan}
				onSubscribe={handleSubscribe}
				onCancel={handleCancel}
			/>

			<Separator className="my-6 bg-indigo-400/20" />

			<SubscriptionHistory
				subscriptionData={subscriptionData}
				onSubscriptionDataChange={setSubscriptionData}
			/>
		</div>
	);
};

export default SubscriptionPage;
