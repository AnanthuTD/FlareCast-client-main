import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn Button
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"; // shadcn Dialog (replaces Modal)
import { Card, CardContent } from "@/components/ui/card"; // shadcn Card
import { Separator } from "@/components/ui/separator"; // shadcn Separator (replaces Divider)
import { ActivePlan } from "./SubscriptionPage";

interface ActiveSubscriptionModalProps {
	activePlan: ActivePlan | null;
	cancelSubscription: () => void;
}

const ActiveSubscriptionModal: React.FC<ActiveSubscriptionModalProps> = ({
	activePlan,
	cancelSubscription,
}) => {
	const [open, setOpen] = useState(false);

	const showModal = () => setOpen(true);
	const handleClose = () => setOpen(false);

	console.log("active plan", activePlan)
	return (
		<>
			<Button
				onClick={showModal}
				className="bg-indigo-400 hover:bg-indigo-500 text-white"
			>
				View Subscription Details
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px] bg-white">
					<DialogHeader>
						<DialogTitle className="text-indigo-400 text-xl font-semibold">
							Active Subscription Details
						</DialogTitle>
					</DialogHeader>
					<Card className="border-none shadow-none">
						<CardContent className="p-6">
							<SubscriptionDetails
								activePlan={activePlan}
								cancelSubscription={cancelSubscription}
							/>
						</CardContent>
					</Card>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={handleClose}
							className="border-indigo-400 text-indigo-400 hover:bg-indigo-100"
						>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

interface SubscriptionDetailsProps {
	activePlan: ActivePlan | null;
	cancelSubscription: () => void;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
	activePlan,
	cancelSubscription,
}) => {
	if (!activePlan) return null;

	const isCanceled = !!activePlan.cancelledAt;

	return (
		<div className="space-y-4 text-gray-800">
			<p className="text-sm text-gray-500">
				Status:{" "}
				<span className={isCanceled ? "text-red-500" : "text-indigo-400"}>
					{isCanceled ? "Canceled" : activePlan.status}
				</span>
			</p>
			<Separator className="bg-indigo-400/20" />
			<div className="space-y-2">
				<p>
					<strong className="font-semibold">Start Date:</strong>{" "}
					{new Date(activePlan.startDate).toLocaleDateString()}
				</p>
				<p>
					<strong className="font-semibold">End Date:</strong>{" "}
					{new Date(activePlan.endDate).toLocaleDateString()}
				</p>
			</div>
			<Separator className="bg-indigo-400/20" />
			<div className="space-y-2">
				<p>
					<strong className="font-semibold">Amount:</strong> ₹{" "}
					{activePlan.amount} per billing cycle
				</p>
				<p>
					<strong className="font-semibold">Next Billing Date:</strong>{" "}
					{new Date(activePlan.chargeAt).toLocaleDateString()}
				</p>
			</div>
			<Separator className="bg-indigo-400/20" />
			<p>
				<strong className="font-semibold">Remaining Billing Cycles:</strong>{" "}
				{isCanceled
					? "N/A"
					: `${activePlan.remainingCount} / ${activePlan.totalCount}`}
			</p>
			<Separator className="bg-indigo-400/20" />

			{isCanceled ? (
				<p className="text-sm">
					Your subscription has been{" "}
					<span className="font-semibold">canceled</span> and will continue
					until{" "}
					<span className="font-semibold">
						{new Date(activePlan.currentEnd || "").toLocaleDateString()}
					</span>
					.
				</p>
			) : (
				<div className="flex gap-4 mt-4">
					<Button
						onClick={() => window.open(activePlan.shortUrl, "_blank")}
						disabled={!activePlan.shortUrl}
						className="bg-indigo-400 hover:bg-indigo-500 text-white"
					>
						Update Payment
					</Button>
					<Button
						onClick={cancelSubscription}
						variant="destructive"
						className="bg-red-500 hover:bg-red-600 text-white"
					>
						Cancel Subscription
					</Button>
				</div>
			)}
		</div>
	);
};

export default ActiveSubscriptionModal;
