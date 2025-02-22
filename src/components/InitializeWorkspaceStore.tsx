"use client";

import { fetchWorkspaces } from "@/actions/workspace";
import { Workspace } from "@/stores/useWorkspaces";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

export const getLocalStorageWorkspace = (): Workspace | null => {
	try {
		const item = localStorage.getItem("workspaces");
		return item ? (JSON.parse(item) as Workspace) : null;
	} catch {
		console.warn("Invalid localStorage data.");
		return null;
	}
};

export const setLocalStorageWorkspace = (workspace: Workspace) => {
	localStorage.setItem("workspaces", JSON.stringify(workspace));
};

export const getDefaultWorkspace = (
	member: Workspace[],
	id?: string
): Workspace => {
	return id
		? member.find((workspace) => workspace.id === id) ??
				member.find((workspace) => workspace.owned)
		: member.find((workspace) => workspace.owned);
};

export const InitializeWorkspaceStore = ({ children }) => {
	const { isConnected, onEvent } = useSocket(
		"ws://api.flarecast.com/workspace" as string,
		"/collaboration/socket.io"
	);

	useEffect(() => {
		console.log("Connected to namespace workspace");
	}, [isConnected]);

	useEffect(() => {
		onEvent("workspace:created", (data) => {
			console.log("Created workspace data: ", data);
		});
	}, [onEvent]);

	const setSelectedWorkspace = useWorkspaceStore(
		(store) => store.setSelectedWorkspace
	);
	const [initializing, setInitializing] = useState(true);
	const [creatingWorkspace, setCreatingWorkspace] = useState(false);

	// Check periodically for new workspaces
	useEffect(() => {
		const initializeWorkspaceStore = async () => {
			try {
				const { member } = await fetchWorkspaces();

				if (member.length === 0) {
					// If no workspaces found, set the "creating workspace" state
					setCreatingWorkspace(true);
					return;
				}

				const localStorageWorkspace = getLocalStorageWorkspace();
				const selectedWorkspace = getDefaultWorkspace(
					member,
					localStorageWorkspace?.id
				);

				setLocalStorageWorkspace(selectedWorkspace);
				setSelectedWorkspace(selectedWorkspace);

				// If we successfully set a workspace, mark initialization as complete
				setInitializing(false);
				setCreatingWorkspace(false);
			} catch (error) {
				console.error("Failed to initialize workspace store:", error);
			}
		};

		setInitializing(true);
		initializeWorkspaceStore();

		let interval: NodeJS.Timeout | null = null;

		if (creatingWorkspace) {
			interval = setInterval(async () => {
				await initializeWorkspaceStore();
			}, 5000); // Check every 5 seconds
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [creatingWorkspace, setSelectedWorkspace]);

	return (
		<>
			{initializing ? (
				<div>
					{creatingWorkspace ? (
						<AlertProgressInfinity />
					) : (
						<div style={{ textAlign: "center", marginTop: "20px" }}>
							<h2>Loading workspaces...</h2>
						</div>
					)}
				</div>
			) : (
				children
			)}
		</>
	);
};

import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertProgressInfinity() {
	return (
		<div className="fixed top-4 right-4 z-50 w-80">
			<Alert className="relative overflow-hidden border shadow-lg">
				<div className="flex items-center">
					<Loader2 className="h-4 w-4 animate-spin mr-2" />
					<AlertTitle>Creating workspace</AlertTitle>
				</div>
				<AlertDescription>
					Please wait while we set up your new workspace.
				</AlertDescription>
				<div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
					<div className="h-full w-full animate-infinite-progress" />
				</div>
			</Alert>
		</div>
	);
}
