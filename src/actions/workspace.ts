import axiosInstance from "@/axios";
import { Workspaces } from "@/stores/useWorkspaces";

export const fetchWorkspaces = async () => {
	try {
		const response = await axiosInstance.get(`/api/collaboration/workspace`);
		return response.data as { workspaces: Workspaces };
	} catch (error) {
		throw error.response.data;
	}
};
