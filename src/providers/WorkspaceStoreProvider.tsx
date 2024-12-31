"use client";

import {
	type ReactNode,
	createContext,
	useRef,
	useContext,
	useEffect,
} from "react";
import {
	createWorkspaceStore,
	Workspace,
	WorkspaceStore,
} from "@/stores/useWorkspaces";
import { useStore } from "zustand";
import { fetchWorkspaces } from "@/actions/workspace";

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

export const UserStoreContext = createContext<WorkspaceStoreApi | undefined>(
	undefined
);

export interface WorkspaceStoreProviderProps {
	children: ReactNode;
}

export const WorkspaceStoreProvider = ({
	children,
}: WorkspaceStoreProviderProps) => {
	const storeRef = useRef<WorkspaceStoreApi>();

	const initializeWorkspaceStore = async () => {
		try {
			const data = await fetchWorkspaces();

			const localStorageItem = localStorage.getItem("workspaces");
			let selectedWorkspace: Workspace;

			if (localStorageItem) {
				try {
					selectedWorkspace = JSON.parse(localStorageItem) as Workspace;
				} catch (error) {
					console.warn(
						"Invalid localStorage data, falling back to default workspace."
					);
					selectedWorkspace = data.workspaces[0];
				}
			} else {
				selectedWorkspace = data.workspaces[0];
				localStorage.setItem("workspaces", JSON.stringify(selectedWorkspace));
			}

			storeRef.current = createWorkspaceStore({
				workspaces: data.workspaces,
				selectedWorkspace,
			});
		} catch (error) {
			console.error("Failed to initialize workspace store:", error);
		}
	};

	useEffect(() => {
		if (!storeRef.current) {
			initializeWorkspaceStore();
		}
	}, []);

	return (
		<UserStoreContext.Provider value={storeRef.current}>
			{children}
		</UserStoreContext.Provider>
	);
};

export const useUserStore = <T,>(selector: (store: WorkspaceStore) => T): T => {
	const workspaceStoreContext = useContext(UserStoreContext);

	if (!workspaceStoreContext) {
		throw new Error(`workspaceStore must be used within CounterStoreProvider`);
	}

	return useStore(workspaceStoreContext, selector);
};
