"use client";

import {
	type ReactNode,
	createContext,
	useRef,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	createWorkspaceStore,
	Workspace,
	WorkspaceStore,
} from "@/stores/useWorkspaces";
import { useStore } from "zustand";
import { fetchWorkspaces } from "@/actions/workspace";

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

export const WorkspaceStoreContext = createContext<
	WorkspaceStoreApi | undefined
>(undefined);

export interface WorkspaceStoreProviderProps {
	children: ReactNode;
}

export const WorkspaceStoreProvider = ({
	children,
}: WorkspaceStoreProviderProps) => {
	const storeRef = useRef<WorkspaceStoreApi>();
	const [isStoreReady, setIsStoreReady] = useState(false);

	const initializeWorkspaceStore = async () => {
		try {
			const { owned, member } = await fetchWorkspaces();
			if (owned.length === 0) {
				alert("No workspace found for the user!");
				throw new Error("No workspaces found.");
			}

			const localStorageItem = localStorage.getItem("workspaces");
			let selectedWorkspace: Workspace;

			if (localStorageItem) {
				try {
					selectedWorkspace = JSON.parse(localStorageItem) as Workspace;
					if (selectedWorkspace.id) {
						selectedWorkspace =
							[...owned, ...member].find((workspace) => workspace.id === selectedWorkspace.id) ??
							owned[0];
					}

					localStorage.setItem("workspaces", JSON.stringify(selectedWorkspace));
				} catch (error) {
					console.warn(
						"Invalid localStorage data, falling back to default workspace."
					);
					selectedWorkspace = owned[0];
				}
			} else {
				selectedWorkspace = owned[0];
				localStorage.setItem("workspaces", JSON.stringify(selectedWorkspace));
			}

			console.log("Workspace", selectedWorkspace);

			storeRef.current = createWorkspaceStore({
				workspaces: {owned, member},
				selectedWorkspace,
			});
			setIsStoreReady(true); // Mark the store as ready
		} catch (error) {
			console.error("Failed to initialize workspace store:", error);
		}
	};

	useEffect(() => {
		if (!storeRef.current) {
			initializeWorkspaceStore();
		}
	}, []);

	if (!isStoreReady) return null; // Optionally, render a loader

	return (
		<WorkspaceStoreContext.Provider value={storeRef.current}>
			{children}
		</WorkspaceStoreContext.Provider>
	);
};

export const useWorkspaceStore = <T,>(
	selector: (store: WorkspaceStore) => T
): T => {
	const workspaceStoreContext = useContext(WorkspaceStoreContext);

	if (!workspaceStoreContext) {
		throw new Error(
			`workspaceStore must be used within WorkspaceStoreProvider`
		);
	}

	return useStore(workspaceStoreContext, selector);
};
