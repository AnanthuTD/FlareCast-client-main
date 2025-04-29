import axiosInstance from "@/axios";
import { apiRequest } from "@/axios/adapter";
import { TreeData } from "@/components/global/move-tree";

export async function getPreviewVideo(id: string) {
	try {
		const response = await axiosInstance.get(`/api/videos/${id}/video`);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response?.data || "failed to get video";
	}
}

export async function getPreviewVideoServer(id: string) {
	try {
		const response = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/${id}/preview`
		);
		return response.data;
	} catch (error) {
		console.error(error.response.data);
	}
}

export async function postView(videoId: string) {
	try {
		await axiosInstance.patch(`/api/videos/${videoId}/viewed`);
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}

// TODO: re-implement this route on the video service to handle video requests with spaceId
export async function getMyVideos(
	workspaceId: string,
	folderId?: string,
	spaceId?: string,
	skip: number = 0,
	limit: number = 10
) {
	const { data } = await axiosInstance.get(`/api/videos/${workspaceId}`, {
		params: {
			limit,
			skip,
			folderId,
			spaceId,
		},
	});

	return data;
}

export async function getPromotionalVideos(
	skip: number = 0,
	limit: number = 10,
	category: string
): Promise<{
	videos: Video[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}> {
	const { data } = await axiosInstance.get(`/api/videos/public/videos`, {
		params: {
			limit,
			skip,
			category,
		},
	});

	return data;
}

export async function getVideosForSpace(
	workspaceId: string,
	spaceId: string,
	folderId: string
) {
	return await axiosInstance.get(
		`/api/videos/workspace/${workspaceId}/space/${spaceId}`,
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
	return await axiosInstance.put(`/api/videos/${videoId}/update/title`, {
		title,
	});
}

export async function updateDescription(videoId: string, description: string) {
	return await axiosInstance.put(`/api/videos/${videoId}/update/description`, {
		description,
	});
}

export async function searchVideo({
	limit = 5,
	query,
	workspaceId,
}: {
	query: string;
	workspaceId: string;
	limit: number;
}) {
	try {
		const { data } = await axiosInstance.get(`/api/videos/search`, {
			params: {
				query,
				workspaceId,
				limit,
			},
		});

		return data?.results || [];
	} catch (e) {
		console.error(e);
		return [];
	}
}

export async function suggestVideo({
	query,
	workspaceId,
	limit = 1,
	paginationToken = "",
}: {
	query: string;
	workspaceId: string;
	limit: number;
	paginationToken?: string;
}) {
	try {
		const { data } = await axiosInstance.get(
			`/api/videos/search/autocomplete`,
			{
				params: {
					query,
					workspaceId,
					limit,
					paginationToken,
				},
			}
		);

		return (
			data || {
				results: [],
				paginationToken: "",
			}
		);
	} catch (e) {
		console.error(e);
		return {
			results: [],
			paginationToken: "",
		};
	}
}

export async function suggestFolders({
	query,
	workspaceId,
	limit = 1,
	paginationToken = "",
}: {
	query: string;
	workspaceId: string;
	limit: number;
	paginationToken?: string;
}) {
	try {
		const { data } = await axiosInstance.get(
			`/api/folders/${workspaceId}/search`,
			{
				params: {
					query,
					limit,
					paginationToken,
					workspaceId,
				},
			}
		);

		return (
			data || {
				results: [],
				paginationToken: "",
			}
		);
	} catch (e) {
		console.error(e);
		return {
			results: [],
			paginationToken: "",
		};
	}
}

export interface WatchLater {
	videoIds: string[]; // Changed from 'videos: string' to match controller response
	count: number;
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Get watch later videos with pagination
interface Video {
	id: string;
	thumbnailUrl: string;
	views: number;
	uniqueViews: number;
	comments: number;
	duration: string;
	shares: number;
	userName: string;
	timeAgo: string;
	userAvatarUrl: string | null;
	createdAt: string;
	User?: {
		fullName?: string | null;
		image?: string | null;
	};
	// Add other video fields as needed
}

// Updated WatchLater interface to match backend response
export interface WatchLater {
	videos: Video[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Fetch watch later videos with pagination
export async function getWatchLaterVideos({
	limit,
	page,
	workspaceId,
}: {
	workspaceId: string;
	page: number;
	limit: number;
}): Promise<Video[]> {
	try {
		const { data } = await axiosInstance.get<WatchLater>(
			"/api/videos/watch-later",
			{
				params: {
					limit,
					page,
					workspaceId,
				},
			}
		);

		return data.videos || []; // Return enriched video array, fallback to empty array
	} catch (e) {
		console.error("Failed to fetch watch later videos:", e);
		return [];
	}
}

// Add a video to watch later
export async function addWatchLaterVideo({
	videoId,
	workspaceId,
}: {
	videoId: string;
	workspaceId: string;
}) {
	try {
		const { data } = await axiosInstance.post<{
			message: string;
			watchLater: { id: string };
		}>(
			"/api/videos/watch-later",
			{ videoId },
			{ params: { workspaceId } } // Pass workspaceId as query param if required by your API
		);

		return {
			success: true,
			message: data.message,
			watchLater: data.watchLater,
		};
	} catch (e) {
		console.error("Failed to add video to watch later:", e);
		return { success: false, message: "Failed to add video to watch later" };
	}
}

// Remove a video from watch later
export async function removeWatchLaterVideo({
	videoId,
	workspaceId,
}: {
	videoId: string;
	workspaceId: string;
}) {
	try {
		const { data } = await axiosInstance.delete<{
			message: string;
			watchLater: null;
		}>(
			`/api/videos/${videoId}/watch-later`,
			{ params: { workspaceId } } // Pass workspaceId as query param if required by your API
		);

		return { success: true, message: data.message };
	} catch (e) {
		console.error("Failed to remove video from watch later:", e);
		return {
			success: false,
			message: "Failed to remove video from watch later",
		};
	}
}

export async function deleteVideo(videoId: string) {
	return await axiosInstance.delete(`/api/videos/${videoId}`);
}

export async function shareVideo({
	videoId,
	destination,
}: {
	videoId: string;
	destination: { id: string; type: TreeData["type"] };
}) {
	if (destination.type === "space") {
		return await axiosInstance.post(`/api/videos/${videoId}/share`, {
			spaceId: destination.id,
		});
	} else if (destination.type === "folder") {
		return await axiosInstance.post(`/api/videos/${videoId}/share`, {
			folderId: destination.id,
		});
	}
}

export async function moveVideo({
	videoId,
	destination,
}: {
	videoId: string;
	destination: { id: string; type: TreeData["type"] };
}) {
	if (destination.type === "folder") {
		return await axiosInstance.post(`/api/videos/${videoId}/move`, {
			folderId: destination.id,
		});
	}
}

export async function updateVideoVisibility({
	videoId,
	isPublic,
}: {
	videoId: string;
	isPublic: boolean;
}) {
	return await axiosInstance.patch(`/api/videos/${videoId}/visibility`, {
		videoId,
		isPublic,
	});
}

export async function getVideoCount({
	folderId,
	spaceId,
	workspaceId,
}: {
	folderId?: string;
	workspaceId?: string;
	spaceId?: string;
}) {
	if (!folderId && !workspaceId && !spaceId) {
		return { error: "Required any one of the parameters!" };
	}

	return apiRequest(
		axiosInstance.get(`/api/videos/count`, {
			params: {
				folderId,
				spaceId,
				workspaceId,
			},
		})
	);
}
