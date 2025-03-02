import axiosInstance from "@/axios";

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
			`${process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL}/api/${id}/preview`
		);
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
		const { data } = await axiosInstance.get(`/api/video/search`, {
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
		const { data } = await axiosInstance.get(`/api/video/search/autocomplete`, {
			params: {
				query,
				workspaceId,
				limit,
				paginationToken,
			},
		});

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
			`/api/collaboration/folder/${workspaceId}/search`,
			{
				params: {
					query,
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
			"/api/video/watch-later",
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
			"/api/video/watch-later",
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
			`/api/video/${videoId}/watch-later`,
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
