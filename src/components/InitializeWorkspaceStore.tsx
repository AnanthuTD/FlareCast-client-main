"use client";

import { fetchWorkspaces } from "@/actions/workspace";
import { Workspace } from "@/stores/useWorkspaces";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useEffect, useState } from "react";

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
	const setSelectedWorkspace = useWorkspaceStore(
		(store) => store.setSelectedWorkspace
	);
	const [initializing, setInitializing] = useState(true);
	const [creatingWorkspace, setCreatingWorkspace] = useState(false);

	const initializeWorkspaceStore = async () => {
		try {
			const {  member } = await fetchWorkspaces();

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

	// Check periodically for new workspaces
	useEffect(() => {
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
	}, [creatingWorkspace]);

	return (
		<>
			{initializing ? (
				<div>
					{creatingWorkspace ? (
						<div style={{ textAlign: "center", marginTop: "20px" }}>
							<h2>Hang on tight, creating workspace...</h2>
						</div>
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
