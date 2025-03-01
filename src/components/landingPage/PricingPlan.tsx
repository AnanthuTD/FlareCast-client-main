"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { getSubscriptionPlans } from "@/actions/subscriptions";
import { SubscriptionPlan } from "@/types";

const PricingPlan: React.FC = () => {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const { plans } = await getSubscriptionPlans();
				setPlans(plans);
				setLoading(false);
			} catch (err) {
				setError(err?.message);
				setLoading(false);
			}
		};
		fetchPlans();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-indigo-400 animate-pulse">Loading plans...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px] text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div className="w-full px-4 py-8 bg-white">
			<h2 className="text-3xl font-bold text-center text-indigo-400 mb-8">
				Choose Your Subscription Plan
			</h2>
			<div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:flex-wrap lg:overflow-x-visible lg:justify-center">
				{plans.map((plan) => (
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
								${plan.price}
								<span className="text-base font-normal text-gray-600">
									/{plan.period}
								</span>
							</div>
							{plan.description && (
								<p className="text-sm text-gray-500 mt-2">{plan.description}</p>
							)}
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
										{plan.aiFeature ? "AI Features Included" : "Basic Features"}
									</span>
								</li>
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className={`w-full ${
									plan.active
										? "bg-indigo-400 hover:bg-indigo-500"
										: "bg-white text-indigo-400 border-indigo-400 border-2 hover:bg-indigo-100"
								}`}
								variant={plan.active ? "default" : "outline"}
								disabled={plan.active}
							>
								{plan.active ? "Current Plan" : "Get Started"}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
};

export default PricingPlan;
