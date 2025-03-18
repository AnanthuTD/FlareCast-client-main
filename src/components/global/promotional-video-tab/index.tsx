"use client";

import React, { useEffect, useState } from "react";
import { VideoCard } from "@/components/main/VideoCard";
import { useRouter } from "next/navigation";
import { getPromotionalVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useSSE } from "@/hooks/useVideoSSE";
import { useUserStore } from "@/providers/UserStoreProvider";
import { Video } from "@/types";
import clsx from "clsx";
import { useQueryData } from "@/hooks/useQueryData";
import { Button } from "@/components/ui/button";

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

function PromotionalVideoTab() {
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);
	const [newVideoStatus, setNewVideoStatus] = useState<NewVideo[]>([]);
	const [page, setPage] = useState(1);
	const pageSize = 10;

	// Fetch videos with pagination
	const { data: videoResponse, refetch } = useQueryData(
		["workspace-videos", selectedWorkspace.id, page],
		() =>
			getPromotionalVideos(
				(page - 1) * pageSize,
				pageSize
			)
	);

	const videos = videoResponse?.videos || [];

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
					<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
				))}
			</div>

			{/* Pagination */}
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

export default PromotionalVideoTab;
