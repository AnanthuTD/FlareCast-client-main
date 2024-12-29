import CheckAuthentication from "@/components/auth/CheckAuthentication";
import { UserLayout } from "@/components/main/UserLayout";
import React from "react";

function LayoutMain({ children }: { children: React.ReactNode }) {
	return (
		<>
			<CheckAuthentication>
				<UserLayout>{children}</UserLayout>
			</CheckAuthentication>
		</>
	);
}

export default LayoutMain;
