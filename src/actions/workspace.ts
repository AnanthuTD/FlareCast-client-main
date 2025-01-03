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
	workspaceId: string,
	folderId?: string
): Promise<Folder[] | never> => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace/${workspaceId}/folders`,
			{ params: { folderId } }
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const createFolder = async (
	workspaceId: string,
	folderId?: string
): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.post(
			`/api/collaboration/workspace/${workspaceId}/folder`,
			{ folderId }
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
	folderId,
}: {
	workspaceId: string;
	folderName: string;
	folderId: string;
}): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.patch(
			`/api/collaboration/workspace/${workspaceId}/folder/${folderId}`,
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

export interface FetchParentFolderRes extends Folder {
	parentFolders: Folder[]
}
export const fetchParentFolders = async (workspaceId: string, folderId: string): Promise<FetchParentFolderRes> | never => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace/${workspaceId}/folder/${folderId}/parents`
		);
		return response.data;
	} catch (error) {
		console.error(error)
		throw error.response.data;
	}
}