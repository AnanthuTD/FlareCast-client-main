import axiosInstance from "@/axios";
import { Workspaces } from "@/stores/useWorkspaces";
import { Folder, Video } from "@/types";
import zod from "zod";

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
	parentFolders: Folder[];
}
export const fetchParentFolders = async (
	workspaceId: string,
	folderId: string
): Promise<FetchParentFolderRes> | never => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace/${workspaceId}/folder/${folderId}/parents`
		);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
};

interface CreateWorkspaceProps {
	name: string;
	members: string;
}
export const createWorkspace = async (data: CreateWorkspaceProps) => {
	if (!data.name) {
		throw new Error("Name and members are required");
	}

	const emails = data.members.split(" ");
	emails.forEach((email) => {
		const isValidEmail = zod.object({
			email: zod.string().email("Invalid email address"),
		});

		if (!isValidEmail.safeParse({ email }).success) {
			throw new Error(`Invalid email: ${email}`);
		}
	});

	return await axiosInstance.post(`/api/collaboration/workspace`, {
		name: data.name,
		members: emails,
	});
};
