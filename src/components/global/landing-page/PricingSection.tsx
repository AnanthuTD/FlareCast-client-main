// components/global/landing-page/PricingSection.js
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { SubscriptionPlan } from "@/types";

interface PricingSectionProps {
	plans: SubscriptionPlan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
	return (
		<section id="pricing" className="py-20 bg-gray-50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Simple, Transparent Pricing
					</h2>
					<p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
						Choose the plan that fits your team&apos;s needs
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{plans.map((plan) => (
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
                variant={plan.name.toLowerCase() === "pro" ? "default" : "outline"}
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
}
