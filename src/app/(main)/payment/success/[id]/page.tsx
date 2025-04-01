"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { getSubscriptionByRazorpayId } from "@/actions/subscriptions";

interface SubscriptionDetails {
	id: string;
	razorpaySubscriptionId: string;
	status: string;
	amount: number;
	startDate: string;
	endDate?: string;
	plan: {
		name: string;
		price: number;
		period?: string;
		maxWorkspaces?: number;
		maxVideoCount?: number;
	};
	user: {
		firstName: string;
	};
}

export default function SuccessPage({ params }: { params: { id: string } }) {
	const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { id } = use(params);

	useEffect(() => {
		const fetchSubscription = async () => {
			try {
				const data = await getSubscriptionByRazorpayId({
					razorpaySubscriptionId: id,
				});
				setSubscription(data);
			} catch (err) {
				setError((err as Error).message || "Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		fetchSubscription();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
			</div>
		);
	}

	if (error || !subscription) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="bg-white p-6 rounded-lg shadow-md text-center">
					<p className="text-red-500 text-lg font-semibold">
						{error || "Subscription not found"}
					</p>
					<button
						onClick={() => router.push("/pricing")}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
				<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Payment Successful!
				</h1>
				<p className="text-gray-600 mb-6">
					Your subscription is now active. Here are the details:
				</p>

				<div className="text-left space-y-4">
					<div>
						<span className="font-semibold text-gray-700">
							Subscription ID:
						</span>{" "}
						<span className="text-gray-600">{subscription.id}</span>
					</div>
					<div>
						<span className="font-semibold text-gray-700">
							Razorpay Subscription ID:
						</span>{" "}
						<span className="text-gray-600">
							{subscription.razorpaySubscriptionId}
						</span>
					</div>
					<div>
						<span className="font-semibold text-gray-700">Plan:</span>{" "}
						<span className="text-gray-600">{subscription.plan.name}</span>
					</div>
					<div>
						<span className="font-semibold text-gray-700">Amount:</span>{" "}
						<span className="text-gray-600">
							₹{subscription.amount.toLocaleString()}
						</span>
					</div>
					<div>
						<span className="font-semibold text-gray-700">Status:</span>{" "}
						<span className="text-gray-600 capitalize">
							{subscription.status}
						</span>
					</div>
					{/* <div>
						<span className="font-semibold text-gray-700">Start Date:</span>{" "}
						<span className="text-gray-600">
							{new Date(subscription.startDate).toLocaleDateString()}
						</span>
					</div> */}
					{subscription.endDate && (
						<div>
							<span className="font-semibold text-gray-700">End Date:</span>{" "}
							<span className="text-gray-600">
								{new Date(subscription.endDate).toLocaleDateString()}
							</span>
						</div>
					)}
					{/* <div>
						<span className="font-semibold text-gray-700">Max Workspaces:</span>{" "}
						<span className="text-gray-600">
							{subscription.plan.maxWorkspaces || "N/A"}
						</span>
					</div>
					<div>
						<span className="font-semibold text-gray-700">
							Max Video Count:
						</span>{" "}
						<span className="text-gray-600">
							{subscription.plan.maxVideoCount || "N/A"}
						</span>
					</div> */}
				</div>

				<button
					onClick={() => router.push("/library")}
					className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
				>
					Go to Library
				</button>
			</div>
		</div>
	);
}
