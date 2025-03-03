"use client";

import React, { useEffect, useState } from "react";
import { VideoCard } from "../main/VideoCard";
import { useRouter } from "next/navigation";
import { getMyVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useSSE } from "@/hooks/useVideoSSE";
import { useUserStore } from "@/providers/UserStoreProvider";
import { Video } from "@/types";
import clsx from "clsx";
import { useQueryData } from "@/hooks/useQueryData";
import { Button } from "@/components/ui/button"; // Import Button from Shadcn UI

interface NewVideo extends Video {
	status: boolean;
	message: string;
	event: string;
}

interface VideoResponse {
	videos: Video[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

function VideoTab({
	folderId,
	spaceId,
}: {
	folderId?: string;
	spaceId?: string;
}) {
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);
	const userId = useUserStore((state) => state.id);
	const [newVideoStatus, setNewVideoStatus] = useState<NewVideo[]>([]);
	const [page, setPage] = useState(1); // Current page
	const pageSize = 10; // Matches your controller's default limit

	// Listen for SSE events
	const { messages, setMessages } = useSSE<NewVideo>(
		`/api/video/${selectedWorkspace.id}/events?userId=${userId}`,
		[selectedWorkspace.id, userId]
	);

	const { data: videoResponse, refetch } = useQueryData<VideoResponse>(
		["workspace-videos", selectedWorkspace.id, folderId, spaceId, page],
		() =>
			getMyVideos(
				selectedWorkspace.id,
				folderId,
				spaceId,
				(page - 1) * pageSize,
				pageSize
			)
	);

	const videos = videoResponse?.videos || [];

	useEffect(() => {
		if (messages.length > 0) {
			const newMessage = messages[messages.length - 1];
			setMessages([]);

			// If transcoding is done, remove it from pending list and refetch
			if (newMessage.transcodeStatus !== "PENDING") {
				console.log("Video transcoded successfully");
				setNewVideoStatus((prev) => {
					const data = prev.filter((m) => m.id !== newMessage.id);
					console.log("update video: ", data);
					return data;
				});
				refetch();
			} else {
				// Update or add processing video status
				setNewVideoStatus((prev) => {
					const existingIndex = prev.findIndex((m) => m.id === newMessage.id);
					if (existingIndex !== -1) {
						const updatedList = [...prev];
						updatedList[existingIndex] = {
							...prev[existingIndex],
							...newMessage,
						};
						return updatedList;
					}
					return [...prev, newMessage];
				});
			}
		}
	}, [messages, setMessages, refetch]);

	const handleOnClick = (videoId: string) => {
		router.push("/video/" + videoId);
	};

	const handlePrevPage = () => {
		if (videoResponse?.hasPrev) {
			setPage((prev) => Math.max(prev - 1, 1));
		}
	};

	const handleNextPage = () => {
		if (videoResponse?.hasNext) {
			setPage((prev) => prev + 1);
		}
	};

	return (
		<div>
			<div className="flex flex-wrap gap-5">
				{/* Processing videos (greyed out, disabled cursor) */}
				{newVideoStatus.map((v) => (
					<div
						key={v.id}
						className={clsx(
							"opacity-50 cursor-not-allowed transition-opacity duration-300",
							"hover:opacity-60"
						)}
					>
						<VideoCard {...v} key={v.id} onClick={() => {}} />
					</div>
				))}

				{/* Clickable completed videos */}
				{videos.map((v) => (
					<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
				))}
			</div>

			{/* Pagination Controls */}

			{videoResponse && videoResponse.totalCount > pageSize && (
				<div className="mt-4 flex justify-center gap-4">
					<Button
						onClick={handlePrevPage}
						disabled={!videoResponse.hasPrev}
						className="bg-white text-indigo-300 border border-indigo-300 hover:bg-indigo-50"
						variant="outline"
					>
						Previous
					</Button>
					<span className="text-indigo-600">
						Page {videoResponse.page} of {videoResponse.totalPages}
					</span>
					<Button
						onClick={handleNextPage}
						disabled={!videoResponse.hasNext}
						className="bg-indigo-300 hover:bg-indigo-400 text-white"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}

export default VideoTab;
