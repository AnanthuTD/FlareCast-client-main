import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"; // shadcn Dialog
import { Button } from "@/components/ui/button"; // shadcn Button
import { Copy } from "lucide-react"; // Icon from lucide-react
import { toast } from "sonner";

interface SubscriptionData {
	subscriptionType: string;
	amount?: number;
	status: string;
	shortUrl: string;
	cancelledAt?: Date | null;
	currentEnd?: Date;
}

interface SubscriptionPaymentModalProps {
	subscriptionData: SubscriptionData;
	onClose: () => void;
}

const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({
	subscriptionData,
	onClose,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(true);

	const handleClose = () => {
		setIsModalOpen(false);
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle className="text-indigo-400 text-xl font-semibold">
						Complete Your Subscription
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 text-gray-800">
					<h4 className="text-lg font-medium">
						Subscription: {subscriptionData.subscriptionType}
					</h4>
					{subscriptionData.amount && (
						<p>
							<span className="font-semibold">Amount: </span> ₹
							{subscriptionData.amount}
						</p>
					)}
					<SubscriptionStatus subscriptionData={subscriptionData} />
				</div>
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
	);
};

interface SubscriptionStatusProps {
	subscriptionData: SubscriptionData;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
	subscriptionData,
}) => {
	const handleCopyLink = () => {
		navigator.clipboard.writeText(subscriptionData.shortUrl);
		toast.info("Payment link copied to clipboard!");
	};

	const subscriptionStatus = subscriptionData.status;
	const isCanceled = !!subscriptionData.cancelledAt;

	return (
		<div className="space-y-4">
			<p>
				<span className="font-semibold">Status: </span>
				<span
					className={
						subscriptionStatus === "pending"
							? "text-yellow-500"
							: "text-green-500"
					}
				>
					{subscriptionStatus?.charAt(0).toUpperCase() +
						subscriptionStatus?.slice(1)}
				</span>
			</p>

			{isCanceled ? (
				<p className="text-sm">
					Your subscription has been{" "}
					<span className="font-semibold">canceled</span> and will continue
					until{" "}
					<span className="font-semibold">
						{new Date(subscriptionData.currentEnd || "").toLocaleDateString()}
					</span>
					.
				</p>
			) : (
				<>
					{(subscriptionStatus === "pending" ||
						subscriptionStatus === "created") && (
						<div className="flex gap-3">
							<Button
								onClick={() => window.open(subscriptionData.shortUrl, "_blank")}
								className="bg-indigo-400 hover:bg-indigo-500 text-white"
							>
								Complete Payment
							</Button>
							<Button
								variant="outline"
								onClick={handleCopyLink}
								className="flex items-center gap-2 border-indigo-400 text-indigo-400 hover:bg-indigo-100"
							>
								<Copy className="h-4 w-4" />
								Copy Payment Link
							</Button>
						</div>
					)}
					{subscriptionStatus !== "pending" && (
						<p className="text-sm">
							Your subscription is currently{" "}
							<span className="font-semibold">{subscriptionStatus}</span>.
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default SubscriptionPaymentModal;
