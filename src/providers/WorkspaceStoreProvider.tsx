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
import { InitializeWorkspaceStore } from "@/components/InitializeWorkspaceStore";

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

	if (!storeRef.current) {
		storeRef.current = createWorkspaceStore();
	}

	return (
		<WorkspaceStoreContext.Provider value={storeRef.current}>
			<InitializeWorkspaceStore>{children}</InitializeWorkspaceStore>
		</WorkspaceStoreContext.Provider>
	);
};

export const useWorkspaceStore = <T,>(
	selector: (store: WorkspaceStore) => T
): T => {
	const workspaceStoreContext = useContext(WorkspaceStoreContext);

	if (!workspaceStoreContext) {
		throw new Error(
			`useWorkspaceStore must be used within WorkspaceStoreProvider`
		);
	}

	return useStore(workspaceStoreContext, selector);
};
