import axiosInstance from "@/axios";

export async function getSpaces(workspaceId: string) {
	try {
		const { data } = await axiosInstance.get(
			`/api/collaboration/space/workspace/${workspaceId}`
		);
		return data;
	} catch {
		return [];
	}
}

export async function createSpace(
	workspaceId: string,
	name: string,
	members: string[] = [],
	type: "CLOSED" | "OPEN" = "OPEN"
) {
	return await axiosInstance.post(`/api/collaboration/space`, {
		workspaceId,
		name,
		members,
		type,
	});
}

export async function deleteSpace(workspaceId: string, spaceId: string) {
	return await axiosInstance.delete(
		`/api/collaboration/space/${workspaceId}/${spaceId}`
	);
}

export async function renameSpace(
	workspaceId: string,
	spaceId: string,
	name: string
) {
	return await axiosInstance.patch(
		`/api/collaboration/space/${workspaceId}/${spaceId}`,
		{
			name,
		}
	);
}

interface Member {
	id: string;
	name: string;
	image: string;
	email: string;
}

export async function getSpaceMembers(
	workspaceId: string,
	spaceId: string
): Promise<Member[]> {
	try {
		const res = await axiosInstance.get(
			`/api/collaboration/space/${workspaceId}/${spaceId}/members`
		);
		return res.data.members as [];
	} catch {
		return [];
	}
}
