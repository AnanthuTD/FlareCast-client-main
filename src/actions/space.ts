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

interface Member {
	id: string;
	name: string;
	role?: string;
	createdAt?: string;
}

interface ApiResponse<T> {
	data: T;
	message?: string;
}

// Add Member to Space
export async function addMemberToSpace({
	memberId,
	spaceId,
}: {
	memberId: string;
	spaceId: string;
}): Promise<ApiResponse<Member>> {
	// alert('adding member to space')
	try {
		const response = await axiosInstance.post<ApiResponse<Member>>(
			`/api/collaboration/space/${spaceId}/member`,
			{ memberId }
		);
		return response.data.member; // Extract data
	} catch (error) {
		console.error(
			`Failed to add member ${memberId} to space ${spaceId}:`,
			error
		);
		throw error; // Let caller handle (e.g., TanStack Query)
	}
}

// Remove Member from Space
export async function removeMemberFromSpace({
	memberId,
	spaceId,
}: {
	memberId: string;
	spaceId: string;
}): Promise<ApiResponse<void>> {
	try {
		const response = await axiosInstance.delete<ApiResponse<void>>(
			`/api/collaboration/space/${spaceId}/member/${memberId}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Failed to remove member ${memberId} from space ${spaceId}:`,
			error
		);
		throw error;
	}
}

// Fetch Existing Members
export async function fetchExistingMembers({
	spaceId,
}: {
	spaceId: string;
}): Promise<ApiResponse<Member[]>> {
	try {
		const response = await axiosInstance.get<ApiResponse<Member[]>>(
			`/api/collaboration/space/${spaceId}/members`
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch members for space ${spaceId}:`, error);
		throw error;
	}
}
