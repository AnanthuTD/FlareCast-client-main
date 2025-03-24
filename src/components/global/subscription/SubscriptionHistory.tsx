import SubscriptionPaymentModal from "./SubscriptionPaymentModal";
import SubscriptionTable from "./SubscriptionTable";
import { SubscriptionPageProps } from "./type";

const SubscriptionHistory: React.FC<
	Pick<SubscriptionPageProps, "subscriptionData" | "onSubscriptionDataChange">
> = ({ subscriptionData, onSubscriptionDataChange }) => (
	<>
		<h2 className="text-xl font-semibold text-indigo-400 mb-4">
			Subscription History
		</h2>
		{subscriptionData && (
			<SubscriptionPaymentModal
				onClose={() => onSubscriptionDataChange(null)}
				subscriptionData={subscriptionData}
				key="sub-history"
			/>
		)}
		<SubscriptionTable />
	</>
);

export default SubscriptionHistory;
