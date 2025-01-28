import { UserLayout } from "@/components/main/UserLayout";
import { WorkspaceStoreProvider } from "@/providers/WorkspaceStoreProvider";
import React from "react";
import FCMProvider from "./fcmProvider";

function LayoutMain({ children }: { children: React.ReactNode }) {
	return (
		<>
			<FCMProvider>
				<WorkspaceStoreProvider>
					<UserLayout>{children}</UserLayout>
				</WorkspaceStoreProvider>
			</FCMProvider>
		</>
	);
}

export default LayoutMain;
