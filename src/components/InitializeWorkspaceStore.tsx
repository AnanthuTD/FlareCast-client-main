'use client'

import {fetchWorkspaces} from "@/actions/workspace";
import {Workspace} from "@/stores/useWorkspaces";
import {useWorkspaceStore} from "@/providers/WorkspaceStoreProvider";
import {useEffect} from "react";

export const getLocalStorageWorkspace = (): Workspace | null => {
    try {
        const item = localStorage.getItem("workspaces");
        return item ? JSON.parse(item) as Workspace : null;
    } catch {
        console.warn("Invalid localStorage data.");
        return null;
    }
};

export const setLocalStorageWorkspace = (workspace: Workspace) => {
    localStorage.setItem("workspaces", JSON.stringify(workspace));
};

export const getDefaultWorkspace = (owned: Workspace[], member: Workspace[], id?: string): Workspace => {
    return id
        ? [...owned, ...member].find((workspace) => workspace.id === id) ?? owned[0]
        : owned[0];
};

export const InitializeWorkspaceStore = ()=>{

    const setSelectedWorkspace = useWorkspaceStore(store => store.setSelectedWorkspace)

    const initializeWorkspaceStore = async () => {
        try {
            const { owned, member } = await fetchWorkspaces();
            if (owned.length === 0) {
                throw new Error("No workspaces found.");
            }

            const localStorageWorkspace = getLocalStorageWorkspace();
            const selectedWorkspace = getDefaultWorkspace(
                owned,
                member,
                localStorageWorkspace?.id
            );

            setLocalStorageWorkspace(selectedWorkspace);

            setSelectedWorkspace(selectedWorkspace);
        } catch (error) {
            console.error("Failed to initialize workspace store:", error);
        }
    };

    useEffect(() => {
    initializeWorkspaceStore();
    })

    return null;
}