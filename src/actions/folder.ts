import axiosInstance from "@/axios";
import { Folder, Video } from "@/types";

export const fetchFolders = async (
	workspaceId: string,
	folderId?: string,
	spaceId?: string
): Promise<Folder[] | never> => {
	try {
		console.log(folderId, spaceId);
		const response = await axiosInstance.get(
			`/api/collaboration/folder/${workspaceId}`,
			{ params: { folderId, spaceId } }
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const createFolder = async (
	workspaceId: string,
	folderId?: string,
	spaceId?: string
): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.post(
			`/api/collaboration/folder/${workspaceId}`,
			{ folderId, spaceId }
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
			`/api/collaboration/folder/${folderId}`
		);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

export const renameFolder = async ({
	folderName,
	folderId,
}: {
	folderName: string;
	folderId: string;
}): Promise<Folder | never> => {
	try {
		const response = await axiosInstance.patch(
			`/api/collaboration/folder/${folderId}/rename`,
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

export const moveFolder = ({
	folderId,
	destination,
}: {
	folderId: string;
	destination: { type: "folder" | "workspace", id: "workspace" };
}) => {
	return axiosInstance.patch(
		`/api/collaboration/folder/${folderId}/move`,
		destination
	);
};
