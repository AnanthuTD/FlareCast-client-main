import axiosInstance from "@/axios";
import { Workspaces } from "@/stores/useWorkspaces";

export const fetchWorkspaces = async (): Promise<{
	owned: Workspaces;
	member: Workspaces;
} | never> => {
	try {
		const response = await axiosInstance.get(`/api/collaboration/workspace`);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};
