import axiosInstance from "@/axios";
import { Workspaces } from "@/stores/useWorkspaces";
import { Folder, Video } from "@/types";

export const fetchWorkspaces = async (): Promise<
	| {
			owned: Workspaces;
			member: Workspaces;
	  }
	| never
> => {
	try {
		const response = await axiosInstance.get(`/api/collaboration/workspace`);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchFolders = async (
	workspaceId: string
): Promise<Folder[] | never> => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace/${workspaceId}/folders`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const createFolder = async (
	workspaceId: string
): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.post(
			`/api/collaboration/workspace/${workspaceId}/folder`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const deleteFolder = async (
	workspaceId: string,
	folderId: string
): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.delete(
			`/api/collaboration/workspace/${workspaceId}/folder/${folderId}`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const renameFolder = async ({
	workspaceId,
	folderName,
}: {
	workspaceId: string;
	folderName: string;
}): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.patch(
			`/api/collaboration/workspace/${workspaceId}/folder`,
			{ name: folderName }
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchVideosInFolder = async (
	workspaceId: string,
	folderId: string
): Promise<Video> => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace/${workspaceId}/folder/${folderId}/videos`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};
