import { UserLayout } from "@/components/main/UserLayout";
import React from "react";

function LayoutMain({ children }: { children: React.ReactNode }) {
	return (
		<>
			
				<UserLayout>{children}</UserLayout>
		</>
	);
}

export default LayoutMain;
