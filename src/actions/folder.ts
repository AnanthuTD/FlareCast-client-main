import axiosInstance from "@/axios";
import { Folder, Video } from "@/types";

export const fetchFolders = async (
	workspaceId: string,
	folderId?: string
): Promise<Folder[] | never> => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/folder/${workspaceId}`,
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
			`/api/collaboration/folder/${workspaceId}`,
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
			`/api/collaboration/folder/${workspaceId}/${folderId}`
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
			`/api/collaboration/folder/${workspaceId}/${folderId}`,
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
			`/api/collaboration/folder/${workspaceId}/${folderId}/videos`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export interface FetchParentFolderRes extends Folder {
	parentFolders: Folder[];
}
export const fetchParentFolders = async (
	workspaceId: string,
	folderId: string
): Promise<FetchParentFolderRes> | never => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/folder/${workspaceId}/${folderId}/parents`
		);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
};
