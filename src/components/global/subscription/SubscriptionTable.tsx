import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"; // shadcn Table
import { Button } from "@/components/ui/button"; // shadcn Button
import { Badge } from "@/components/ui/badge"; // shadcn Badge
import SubscriptionPaymentModal from "./SubscriptionPaymentModal";
import { Loader2 } from "lucide-react"; // Loading icon
import { getSubscriptions } from "@/actions/subscriptions";

const SubscriptionTable: React.FC = () => {
	const [subscriptions, setSubscriptions] = useState<Awaited<ReturnType<typeof getSubscriptions>>>([]);
	const [loading, setLoading] = useState(true);
	const [selectedSubscription, setSelectedSubscription] =
		useState<Subscription | null>(null);

	useEffect(() => {
		const fetchSubscriptions = async () => {
			try {
				const response = await getSubscriptions()
				setSubscriptions(response);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching subscriptions:", error);
				setLoading(false);
			}
		};

		fetchSubscriptions();
	}, []);

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500 hover:bg-green-600";
			case "pending":
				return "bg-orange-500 hover:bg-orange-600";
			case "canceled":
			case "expired":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-indigo-400 hover:bg-indigo-500";
		}
	};

	return (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-indigo-400">
				Subscriptions
			</h3>
			<div className="border rounded-md bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-indigo-400">User</TableHead>
							<TableHead className="text-indigo-400">
								Subscription Type
							</TableHead>
							<TableHead className="text-indigo-400">Amount (₹)</TableHead>
							<TableHead className="text-indigo-400">Status</TableHead>
							<TableHead className="text-indigo-400">Start Date</TableHead>
							<TableHead className="text-indigo-400">End Date</TableHead>
							<TableHead className="text-indigo-400">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8">
									<Loader2 className="h-6 w-6 animate-spin text-indigo-400 mx-auto" />
									<span className="text-gray-500">Loading...</span>
								</TableCell>
							</TableRow>
						) : subscriptions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8 text-gray-500"
								>
									No subscriptions found
								</TableCell>
							</TableRow>
						) : (
							subscriptions.map((subscription) => (
								<TableRow key={subscription.id}>
									<TableCell>{subscription.userId}</TableCell>
									<TableCell>{subscription.subscriptionType}</TableCell>
									<TableCell>₹{subscription.amount}</TableCell>
									<TableCell>
										<Badge
											className={`${getStatusVariant(
												subscription.status
											)} text-white`}
										>
											{subscription.status.toUpperCase()}
										</Badge>
									</TableCell>
									<TableCell>
										{new Date(subscription.startDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(subscription.endDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Button
											onClick={() => setSelectedSubscription(subscription)}
											className="bg-indigo-400 hover:bg-indigo-500 text-white"
										>
											Details
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			{selectedSubscription && (
				<SubscriptionPaymentModal
					onClose={() => setSelectedSubscription(null)}
					subscriptionData={selectedSubscription}
					key={"sub-history"}
				/>
			)}
		</div>
	);
};

export default SubscriptionTable;
