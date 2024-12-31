import { createStore } from "zustand/vanilla";

enum WORKSPACE_TYPE {
	PERSONAL,
	PUBLIC,
}

interface Workspace {
	name: string;
	id: string;
	memberCount: number;
	type: WORKSPACE_TYPE;
}

type Workspaces = Workspace[];

export type WorkspaceState = {
	workspaces: Workspaces;
	selectedWorkspace: Workspace;
};

export type WorkspaceActions = {
	setWorkspaces: (workspaces: Workspaces) => void;
	setSelectedWorkspace: (workspace: Workspace) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const defaultInitState: WorkspaceState = {
	selectedWorkspace: {
		id: "workspace_id",
		memberCount: 0,
		name: "Initial workspace",
		type: WORKSPACE_TYPE.PERSONAL,
	},
	workspaces: [],
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
	}));
};
