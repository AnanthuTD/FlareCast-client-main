import axiosInstance from "@/axios";

export const fetchWorkspaces = async () => {
	try {
		const response = await axiosInstance.get(
			`/api/collaboration/workspace`
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};