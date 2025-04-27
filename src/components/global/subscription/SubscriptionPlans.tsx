import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Check, X } from "lucide-react";
import { SubscriptionPageProps } from "./type";
import PaynowButton from "./PaynowButton";
import ActiveSubscriptionModal from "./ActiveSubscriptionModal";
import { cn } from "@/lib/utils";

const PlanFeature: React.FC<{ enabled: boolean; text: string }> = ({
	enabled,
	text,
}) => (
	<li
		className={cn(
			"flex items-center gap-2",
			enabled ? "text-gray-800" : "text-gray-400"
		)}
	>
		{enabled ? (
			<Check className="h-5 w-5 text-indigo-400" />
		) : (
			<X className="h-5 w-5 text-gray-400" />
		)}
		<span>{text}</span>
	</li>
);

const SubscriptionPlans: React.FC<SubscriptionPageProps> = ({
	plans,
	activePlan,
	onSubscribe,
	onCancel,
  subscriptionData
}) => {
	const renderPlanFeatures = (plan: SubscriptionPageProps["plans"][0]) => (
		<ul className="space-y-3">
			<PlanFeature
				enabled={true}
				text={`Max Recording: ${plan.maxRecordingDuration} min`}
			/>
			<PlanFeature
				enabled={plan.hasAiFeatures}
				text={`AI Features: ${plan.hasAiFeatures ? "Yes" : "No"}`}
			/>
			<PlanFeature
				enabled={plan.hasAdvancedEditing}
				text={`Advanced Editing: ${plan.hasAdvancedEditing ? "Yes" : "No"}`}
			/>
			{plan.maxMembers && (
				<PlanFeature enabled={true} text={`Max Members: ${plan.maxMembers}`} />
			)}
			{plan.maxVideoCount && (
				<PlanFeature
					enabled={true}
					text={`Max Videos: ${plan.maxVideoCount}`}
				/>
			)}
			{plan.maxWorkspaces && (
				<PlanFeature
					enabled={true}
					text={`Max Workspaces: ${plan.maxWorkspaces}`}
				/>
			)}
		</ul>
	);

	const renderPlanPrice = (plan: SubscriptionPageProps["plans"][0]) => (
		<div className="text-4xl font-bold mt-2">
			₹{plan.price}
			{plan.type === "paid" && plan.period && (
				<span className="text-base font-normal text-gray-600">
					/{plan.period}
				</span>
			)}
		</div>
	);

	return (
		<Card className="p-6 relative border-indigo-400">
			<Swiper
				slidesPerView="auto"
				spaceBetween={20}
				pagination={{ clickable: true }}
				modules={[Pagination, Navigation]}
				style={{ padding: "1rem 0" }}
			>
				{plans.map((plan) => {
					const isActivePlan = activePlan?.planId === plan.planId;

					return (
						<SwiperSlide key={plan.id} style={{ width: "300px" }}>
							<div className="relative">
								{isActivePlan && (
									<Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600">
										Active
									</Badge>
								)}
								<Card
									className={cn(
										"flex flex-col min-w-[300px] max-w-[350px] snap-center border-indigo-400 bg-white text-gray-800",
										"hover:shadow-xl transition-shadow duration-300",
										plan.isActive && "border-2 shadow-lg"
									)}
								>
									<CardHeader>
										<CardTitle className="text-2xl font-semibold text-indigo-400">
											{plan.name}
										</CardTitle>
										{renderPlanPrice(plan)}
									</CardHeader>
									<CardContent className="flex-1">
										{renderPlanFeatures(plan)}
									</CardContent>
									{plan.type !== "free" && (
										<CardFooter>
											{isActivePlan ? (
												<ActiveSubscriptionModal
													activePlan={plan.subscriptionData}
													cancelSubscription={onCancel}
												/>
											) : (
												<PaynowButton
													activePlan={activePlan}
													onSubscribe={() =>
														onSubscribe(plan.id)
													}
													plan={plan}
												/>
											)}
										</CardFooter>
									)}
								</Card>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</Card>
	);
};

export default SubscriptionPlans;
