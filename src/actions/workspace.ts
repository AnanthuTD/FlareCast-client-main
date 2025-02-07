import axiosInstance from "@/axios";
import { Workspaces } from "@/stores/useWorkspaces";
import zod from "zod";

export const fetchWorkspaces = async (): Promise<
	| {
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

export const getMembers = async (workspaceId: string) => {
	if (!workspaceId) throw new Error("Workspace ID required");

	return await axiosInstance.get(
		`/api/collaboration/workspace/${workspaceId}/members`
	);
};

export const updateRole = async (
	workspaceId: string,
	memberId: string,
	role: string
) => {
	if (!workspaceId || !memberId || !role)
		throw new Error("All fields are required");

	return await axiosInstance.patch(
		`/api/collaboration/workspace/${workspaceId}/member/${memberId}`,
		{ role }
	);
};

export const removeMember = async (workspaceId: string, memberId: string) => {
	if (!workspaceId || !memberId) throw new Error("All fields are required");

	return await axiosInstance.delete(
		`/api/collaboration/workspace/${workspaceId}/member/${memberId}`
	);
};

export const renameWorkspace = async (workspaceId: string, name: string) => {
	if (!workspaceId || !name) throw new Error("All fields are required");

	return await axiosInstance.patch(
		`/api/collaboration/workspace/${workspaceId}`,
		{ name }
	);
};
