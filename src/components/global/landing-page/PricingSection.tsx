"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubscriptionPlans } from "@/actions/subscriptions";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { SubscriptionPlan } from "@/types";

const PricingSection: React.FC = () => {
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
				setError(err?.message || "Failed to load pricing plans");
				setLoading(false);
			}
		};
		fetchPlans();
	}, []);

	if (loading) {
		return (
			<section id="pricing" className="py-20 bg-gray-50">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<Skeleton className="h-10 w-64 mx-auto mb-4" />
						<Skeleton className="h-6 w-96 mx-auto" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[...Array(3)].map((_, index) => (
							<Card key={index} className="p-8 flex flex-col h-full">
								<Skeleton className="h-6 w-32 mb-2" />
								<Skeleton className="h-5 w-48 mb-6" />
								<Skeleton className="h-10 w-24 mb-6" />
								<ul className="space-y-3 mb-8 flex-grow">
									{[...Array(5)].map((_, i) => (
										<li key={i} className="flex items-start">
											<Skeleton className="h-5 w-5 mr-3" />
											<Skeleton className="h-5 w-40" />
										</li>
									))}
								</ul>
								<Skeleton className="h-10 w-full" />
							</Card>
						))}
					</div>
				</div>
			</section>
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
		<section id="pricing" className="py-20 bg-gray-50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Simple, Transparent Pricing
					</h2>
					<p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
						Choose the plan that fits your team's needs
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{plans.map((plan, index) => (
						<Card
							key={plan.id}
							className={`p-8 ${
								plan.name.toLowerCase() === "pro"
									? "border-2 border-[#6366F1] shadow-lg"
									: "border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg"
							} transition-all duration-300 flex flex-col h-full relative`}
						>
							{plan.name.toLowerCase() === "pro" && (
								<div className="absolute top-0 right-0 bg-[#6366F1] text-white px-4 py-1 text-sm font-medium">
									Most Popular
								</div>
							)}
							<h3 className="text-xl font-bold mb-2">{plan.name}</h3>
							<div className="mb-6">
								<span className="text-4xl font-bold">${plan.price}</span>
								<span className="text-gray-600">
									{plan.type === "free" ? "/month" : "/month per user"}
								</span>
							</div>
							<ul className="space-y-3 mb-8 flex-grow">
								{plan.maxVideoCount && (
									<li className="flex items-start">
										<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
										<span>
											{plan.maxVideoCount === -1
												? "Unlimited videos"
												: `${plan.maxVideoCount} videos per month`}
										</span>
									</li>
								)}
								<li className="flex items-start">
									<span className="flex">
										{plan.hasAdvancedEditing ? (
											<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
										) : (
											<X color="#ff0000" className="h-5 w-5 mt-1 mr-3" />
										)}
										Advanced editing tools
									</span>
								</li>

								<li className="flex items-start">
									<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
									<span>{plan.maxWorkspaces} Team workspaces</span>
								</li>

								<li className="flex items-start">
									<span>
										{plan.hasAiFeatures ? (
											<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
										) : (
											<X color="#ff0000" className="h-5 w-5 mt-1 mr-3" />
										)}
									</span>
									AI Feature
								</li>

								{plan.name.toLowerCase() === "enterprise" && (
									<>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
											<span>SSO & advanced security</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-[#6366F1] mt-1 mr-3" />
											<span>Dedicated support</span>
										</li>
									</>
								)}
							</ul>
							{/* <Button
								variant={
									plan.name.toLowerCase() === "pro" ? "default" : "outline"
								}
								className={`w-full ${
									plan.name.toLowerCase() === "pro"
										? "bg-[#6366F1] text-white hover:bg-[#5254cc]"
										: "border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white"
								} transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer`}
							>
								{plan.name.toLowerCase() === "enterprise"
									? "Contact Sales"
									: "Get Started"}
							</Button> */}
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default PricingSection;
