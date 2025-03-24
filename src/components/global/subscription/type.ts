import { ActivePlan, SubscriptionData, SubscriptionPlan } from "@/types";

export interface SubscriptionPageProps {
	plans: SubscriptionPlan[];
	activePlan: ActivePlan | null;
	subscriptionData: SubscriptionData | null;
	onSubscribe: (planId: string) => Promise<void>;
	onCancel: () => Promise<void>;
	onSubscriptionDataChange: (data: SubscriptionData | null) => void;
}