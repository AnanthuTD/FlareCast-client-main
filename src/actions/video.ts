import axiosInstance from "@/axios";
import { TreeData } from "@/components/global/move-tree";

export async function getPreviewVideo(id: string) {
	console.log(id);
	try {
		const response = await axiosInstance.get(`/api/video/${id}/video`);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response?.data || "failed to get video";
	}
}

export async function getPreviewVideoServer(id: string) {
	try {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/${id}/video`
		);
		console.log("response: ", response);
		return response.data;
	} catch (error) {
		console.error(error);
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

// TODO: re-implement this route on the video service to handle video requests with spaceId
export async function getMyVideos(
	workspaceId: string,
	folderId?: string,
	spaceId?: string
) {
	return await axiosInstance.get(`/api/video/${workspaceId}`, {
		params: {
			limit: 10,
			skip: 0,
			folderId,
			spaceId,
		},
	});
}

export async function getVideosForSpace(
	workspaceId: string,
	spaceId: string,
	folderId: string
) {
	return await axiosInstance.get(
		`/api/video/workspace/${workspaceId}/space/${spaceId}`,
		{
			params: {
				limit: 10,
				skip: 0,
				folderId,
			},
		}
	);
}

export async function updateTitle(videoId: string, title: string) {
	return await axiosInstance.put(`/api/video/${videoId}/update/title`, {
		title,
	});
}

export async function updateDescription(videoId: string, description: string) {
	return await axiosInstance.put(`/api/video/${videoId}/update/description`, {
		description,
	});
}

export async function deleteVideo(videoId: string) {
	return await axiosInstance.delete(`/api/video/${videoId}`);
}

export async function shareVideo({
	videoId,
	destination,
}: {
	videoId: string;
	destination: { id: string; type: TreeData["type"] };
}) {
	if (destination.type === "space") {
		return await axiosInstance.post(`/api/video/${videoId}/share`, {
			spaceId: destination.id,
		});
	} else {
		alert("Work in progress. currently only support space");
	}
}
