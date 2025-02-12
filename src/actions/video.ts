import axiosInstance from "@/axios";

export async function getPreviewVideo(id: string) {
	console.log(id);
	try {
		const response = await axiosInstance.get(`/api/video/${id}/video`);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}

export async function postView(videoId: string) {
	try {
		await axiosInstance.patch(`/api/video/${videoId}/viewed`);
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}

export async function getMyVideos(workspaceId: string, folderId?: string) {
	return await axiosInstance.get(`/api/video/${workspaceId}`, {
		params: {
			limit: 10,
			skip: 0,
			folderId,
		},
	});
}

export async function getVideosForSpace(
	workspaceId: string,
	spaceId: string,
	folderId: string
) {
	return await axiosInstance.get(`/api/video/workspace/${workspaceId}/space/${spaceId}`, {
		params: {
			limit: 10,
			skip: 0,
			folderId,
		},
	});
}
