import { createStore } from "zustand/vanilla";

enum WORKSPACE_TYPE {
	PERSONAL,
	PUBLIC,
}

export interface Workspace {
	name: string;
	id: string;
	memberCount: number;
	type: WORKSPACE_TYPE;
	owned: boolean;
}

export type Workspaces = Workspace[];

export type CombinedWorkspaces = {
	member: Workspaces;
};

export type WorkspaceState = {
	workspaces: CombinedWorkspaces;
	selectedWorkspace: Workspace;
	selectedSpace?: string;
};

export type WorkspaceActions = {
	setWorkspaces: (workspaces: CombinedWorkspaces) => void;
	setSelectedWorkspace: (workspace: Workspace) => void;
	setSelectedSpace: (spaceId: string) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const defaultInitState: WorkspaceState = {
	workspaces: {
		member: [],
	},
};

export const createWorkspaceStore = (
	initState: WorkspaceState = defaultInitState
) => {
	return createStore<WorkspaceStore>()((set) => ({
		...initState,
		setWorkspaces: (workspaces) => set({ workspaces }),
		setSelectedWorkspace(workspace) {
			set({ selectedWorkspace: workspace });
		},
		setSelectedSpace(spaceId) {
			set({ selectedSpace: spaceId });
		},
	}));
};
