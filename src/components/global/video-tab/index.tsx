"use client";

import React, { useEffect, useState } from "react";
import { VideoCard } from "../video-card";
import { useRouter } from "next/navigation";
import { getMyVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useSSE } from "@/hooks/useVideoSSE";
import { useUserStore } from "@/providers/UserStoreProvider";
import { Video } from "@/types";
import clsx from "clsx";
import { useQueryData } from "@/hooks/useQueryData";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

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
	movingVideos,
}: {
	folderId?: string;
	spaceId?: string;
	movingVideos: Set<string>;
}) {
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);
	const userId = useUserStore((state) => state.id);
	const [newVideoStatus, setNewVideoStatus] = useState<NewVideo[]>([]);
	const [page, setPage] = useState(1);
	const pageSize = 10;

	// SSE for real-time video events
	const { messages, setMessages } = useSSE<NewVideo>(
		`/api/videos/${selectedWorkspace.id}/events?userId=${userId}&spaceId=${
			spaceId ?? ""
		}`,
		[selectedWorkspace.id, userId]
	);

	// Fetch videos with pagination
	const {
		data: videoResponse,
		refetch,
		isFetching,
		isPending,
		isFetched,
	} = useQueryData(
		[
			`videos`,
			"workspace-videos",
			selectedWorkspace.id,
			folderId,
			spaceId,
			page,
		],
		() =>
			getMyVideos(
				selectedWorkspace.id,
				folderId,
				spaceId,
				(page - 1) * pageSize,
				pageSize
			)
	);

	useEffect(() => {
		refetch();
	}, [folderId, spaceId, selectedWorkspace?.id, refetch]);

	const videos = videoResponse?.videos || [];

	useEffect(() => {
		if (messages.length === 0) return;

		const newMessage = messages[messages.length - 1];
		if (
			(folderId ?? "") !== (newMessage.folderId ?? "") ||
			(spaceId ?? "") !== (newMessage.spaceId ?? "")
		)
			return;

		setMessages([]);

		refetch({});
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

	return isFetching && !videos.length ? (
		<Loader state={true} size="lg" color="gray-300" className="min-h-screen" />
	) : (
		<div>
			<div className="flex flex-wrap gap-5">
				{/* Pending videos (greyed out) */}
				{newVideoStatus.map((v) => (
					<div
						key={v.id}
						className={clsx(
							"opacity-50 cursor-not-allowed transition-opacity duration-300",
							"hover:opacity-60"
						)}
					>
						<VideoCard {...v} onClick={() => {}} />
					</div>
				))}

				{/* Completed videos */}
				{videos.map((v) => (
					<VideoCard
						hide={movingVideos.has(v.id)}
						{...v}
						key={v.id}
						onClick={() => handleOnClick(v.id)}
					/>
				))}
			</div>

			{/* Pagination */}

			{videoResponse && (
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
