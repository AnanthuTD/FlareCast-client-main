import axiosInstance from "@/axios";
import { apiRequest } from "@/axios/adapter";
import { Workspaces } from "@/stores/useWorkspaces";
import zod from "zod";

export const fetchWorkspaces = async (): Promise<
	| {
			member: Workspaces;
	  }
	| never
> => {
	try {
		const response = await axiosInstance.get(`/api/workspaces`);
		return response.data;
	} catch (error) {
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

	return await axiosInstance.post(`/api/workspaces`, {
		name: data.name,
		members: emails,
	});
};

export const getMembers = async (workspaceId: string) => {
	if (!workspaceId) throw new Error("Workspace ID required");

	const { data, error } = await apiRequest(
		axiosInstance.get(`/api/workspaces/${workspaceId}/members`)
	);
	console.log("Workspace data: ", data)

	if (!error) return data;

	throw new Error(error);
};

export const updateRole = async (
	workspaceId: string,
	memberId: string,
	role: string
) => {
	if (!workspaceId || !memberId || !role)
		throw new Error("All fields are required");

	return await axiosInstance.patch(
		`/api/workspaces/${workspaceId}/member/${memberId}`,
		{ role }
	);
};

export const removeMember = async (workspaceId: string, memberId: string) => {
	if (!workspaceId || !memberId) throw new Error("All fields are required");

	return await axiosInstance.delete(
		`/api/workspaces/${workspaceId}/member/${memberId}`
	);
};

export const renameWorkspace = async (workspaceId: string, name: string) => {
	if (!workspaceId || !name) throw new Error("All fields are required");

	return await axiosInstance.patch(`/api/workspaces/${workspaceId}`, { name });
};

export const searchMembers = async ({
	workspaceId,
	query = "",
	spaceId,
}: {
	workspaceId: string;
	query: string;
	spaceId?: string;
}) => {
	try {
		const res = await axiosInstance.get(
			`/api/workspaces/${workspaceId}/search`,
			{
				params: {
					q: query,
					spaceId,
				},
			}
		);
		return res.data.members;
	} catch {
		return [];
	}
};
