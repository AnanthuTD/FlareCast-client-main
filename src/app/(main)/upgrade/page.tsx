import SubscriptionPage from "@/components/global/subscription/SubscriptionPage";
import Script from "next/script";
import React from "react";

function Page() {
	return (
		<>
			<Script
				src="https://checkout.razorpay.com/v1/checkout.js"
				// onLoad={() => setIsRazorpayLoaded(true)}
				strategy="beforeInteractive"
			/>
			<SubscriptionPage />;
		</>
	);
}

export default Page;
