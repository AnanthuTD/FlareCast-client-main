import CheckAuthentication from "@/components/auth/CheckAuthentication";
import React from "react";

function LayoutMain({ children }: { children: React.ReactNode }) {
	return (
		<>
			<CheckAuthentication>{children}</CheckAuthentication>
		</>
	);
}

export default LayoutMain;
