import { UserLayout } from "@/components/main/UserLayout";
import { WorkspaceStoreProvider } from "@/providers/WorkspaceStoreProvider";
import React from "react";

function LayoutMain({ children }: { children: React.ReactNode }) {
	return (
		<>
				<WorkspaceStoreProvider>
					<UserLayout>{children}</UserLayout>
				</WorkspaceStoreProvider>
		</>
	);
}

export default LayoutMain;
