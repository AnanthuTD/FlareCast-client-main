"use client";

import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"; // shadcn Card
import { Separator } from "@/components/ui/separator"; // shadcn Separator
import { Badge } from "@/components/ui/badge"; // shadcn Badge
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import ActiveSubscriptionModal from "./ActiveSubscriptionModal";
import PaynowButton from "./PaynowButton";
import SubscriptionPaymentModal from "./SubscriptionPaymentModal";
import SubscriptionTable from "./SubscriptionTable";
import { toast } from "sonner";
import {
  cancelSubscription,
	checkCanSubscribe,
	getSubscriptionPlansAuthenticated,
	subscribeToPlan,
} from "@/actions/subscriptions";
import { ActivePlan, SubscriptionData, SubscriptionPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

/* const socket: Socket = io(`/api/user/`, {
	auth: {
		token: Cookies.get("accessToken"), 
	},
	transports: ["websocket"],
}); */

function SubscriptionPage() {
	const [subscriptionData, setSubscriptionData] =
		useState<SubscriptionData | null>(null);
	const [subscriptionPlans, setSubscriptionPlans] = useState<
		SubscriptionPlan[]
	>([]);
	const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
	const {isConnected, onEvent} = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions` as string,
		"/user/socket.io"
	);

	const handleCheckCanSubscribe = async (): Promise<boolean> => {
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
	};

	const fetchSubscriptionPlans = async () => {
		try {
			const response = await getSubscriptionPlansAuthenticated();
			const { plans, activeSubscription } = response;
			setSubscriptionPlans(plans);
			setActivePlan(activeSubscription);
		} catch (err) {
			console.error(err);
			toast.error("Failed to fetch subscription plans!");
		}
	};

	useEffect(() => {
		handleCheckCanSubscribe();
		fetchSubscriptionPlans();

		onEvent("subscription:status:update", () => {
			fetchSubscriptionPlans();
		});
	}, []);

	const handleSubscription = async (planId: string) => {
		try {
			const canSubscribe = await handleCheckCanSubscribe();
			if (!canSubscribe) return;

			const response = await subscribeToPlan(planId);
			window.open(response.shortUrl, "_blank");

			setSubscriptionData(response.data);
			console.log(response);
		} catch (err: any) {
			console.error(err);
			toast.error(err.response?.data?.message || "Failed to subscribe!");
		}
	};

	const handleCancelSubscription = async () => {
		try {
			const response = await cancelSubscription();
			/* setSubscriptionData((prevData) =>
				prevData ? { ...prevData, status: "cancelled" } : null
			); */
			// setActivePlan(null);
      fetchSubscriptionPlans()
			console.log(response);
		} catch (err: any) {
			console.error(err);
			toast.error(
				err.response?.data?.message || "Failed to cancel subscription!"
			);
		}
	};

	return (
		<div className="p-6 bg-white w-full">
			<Card className="p-6 relative border-indigo-400">
				<CardContent>
					<Swiper
						slidesPerView="auto"
						spaceBetween={20}
						pagination={{ clickable: true }}
						modules={[Pagination, Navigation]}
						style={{ padding: "1rem 0" }}
					>
						{subscriptionPlans.map((plan) => (
							<SwiperSlide key={plan.planId} style={{ width: "300px" }}>
								{/* <div className="relative"> */}
								{activePlan?.planId === plan.planId && (
									<Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
										Active
									</Badge>
								)}
								<Card
									key={plan.planId}
									className={`flex flex-col min-w-[300px] max-w-[350px] snap-center border-indigo-400 ${
										plan.active ? "border-2 shadow-lg" : "border"
									} bg-white text-gray-800 hover:shadow-xl transition-shadow duration-300`}
								>
									<CardHeader>
										<CardTitle className="text-2xl font-semibold text-indigo-400">
											{plan.name}
										</CardTitle>
										<div className="text-4xl font-bold mt-2">
											₹{plan.price}
											<span className="text-base font-normal text-gray-600">
												/{plan.period}
											</span>
										</div>
										{/* 	{
											<p className="text-sm text-gray-500 mt-2">
												{plan.description}{"ss "}
											</p>
										} */}
									</CardHeader>
									<CardContent className="flex-1">
										<ul className="space-y-3">
											<li className="flex items-center gap-2">
												<Check className="h-5 w-5 text-indigo-400" />
												<span>{plan.videoPerMonth} videos/month</span>
											</li>
											<li className="flex items-center gap-2">
												<Check className="h-5 w-5 text-indigo-400" />
												<span>{plan.duration} months duration</span>
											</li>
											<li className="flex items-center gap-2">
												<Check className="h-5 w-5 text-indigo-400" />
												<span>{plan.workspace} workspace(s)</span>
											</li>
											<li className="flex items-center gap-2">
												<Check className="h-5 w-5 text-indigo-400" />
												<span>
													{plan.aiFeature
														? "AI Features Included"
														: "Basic Features"}
												</span>
											</li>
										</ul>
									</CardContent>
									<CardFooter>
										{activePlan && plan.active ? (
											<ActiveSubscriptionModal
												activePlan={activePlan}
												cancelSubscription={handleCancelSubscription}
											/>
										) : (
											<PaynowButton
												activePlan={activePlan}
												onSubscribe={handleSubscription}
												plan={plan}
											/>
										)}
									</CardFooter>
								</Card>
								{/* </div> */}
							</SwiperSlide>
						))}
					</Swiper>
				</CardContent>
			</Card>

			<Separator className="my-6 bg-indigo-400/20" />
			<h2 className="text-xl font-semibold text-indigo-400 mb-4">
				Subscription History
			</h2>

			{subscriptionData && (
				<SubscriptionPaymentModal
					onClose={() => setSubscriptionData(null)}
					subscriptionData={subscriptionData}
					key={"sub-history"}
				/>
			)}

			<SubscriptionTable />
		</div>
	);
}

export default SubscriptionPage;
