import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn Button
import { Loader2 } from "lucide-react"; // Loading icon from lucide-react

interface Plan {
	planId: string;
	active: boolean;
}

interface PaynowButtonProps {
	plan: Plan;
	onSubscribe: (planId: string) => Promise<void>;
	activePlan: Plan | null;
}

const PaynowButton: React.FC<PaynowButtonProps> = ({
	plan,
	onSubscribe,
	activePlan,
}) => {
	const [isSubscribingToPlan, setIsSubscribingToPlan] = useState(false);

	const handleSubscription = async (planId: string) => {
		setIsSubscribingToPlan(true);
		try {
			await onSubscribe(planId);
		} finally {
			setIsSubscribingToPlan(false);
		}
	};

	return (
		<Button
			onClick={() => handleSubscription(plan.planId)}
			disabled={!!(activePlan && activePlan.type !== "free") && !plan.active}
			className={`w-full ${
				isSubscribingToPlan
					? "bg-indigo-300"
					: "bg-indigo-400 hover:bg-indigo-500"
			} text-white transition-colors`}
		>
			{isSubscribingToPlan ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Subscribing...
				</>
			) : (
				"Pay Now"
			)}
		</Button>
	);
};

export default PaynowButton;
