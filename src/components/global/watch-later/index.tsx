"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Video } from "@/types";
import { getWatchLaterVideos } from "@/actions/video";
import { VideoCard } from "@/components/global/video-card";

interface VideoTabProps {
	videosPerPage?: number; // Items to fetch per "page"
}

function WatchLaterVideoTab({ videosPerPage = 10 }: VideoTabProps) {
	const [videos, setVideos] = useState<Video[]>([]);
	const [skip, setSkip] = useState(0);
	const [totalCount, setTotalCount] = useState<number | null>(null); // null until fetched
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);

	// Fetch videos with infinite scroll
	const fetchMoreVideos = useCallback(async () => {
		if (!hasMore || isLoading) return;

		setIsLoading(true);
		try {
			const page = Math.floor(skip / videosPerPage) + 1;
			const response = await getWatchLaterVideos({
				workspaceId: selectedWorkspace.id,
				limit: videosPerPage,
				page,
			});

			setVideos((prev) => [...prev, ...response]);
			setSkip((prev) => prev + response.length);

			// If getWatchLaterVideos returns totalCount, use it; otherwise infer from response
			setTotalCount((prev) => {
				if (prev === null) return response.length; // Initial set
				return prev + response.length;
			});
			setHasMore(response.length === videosPerPage); // Fewer items than limit means no more
		} catch (error) {
			console.error("Failed to fetch watch later videos:", error);
			setHasMore(false); // Stop fetching on error
		} finally {
			setIsLoading(false);
		}
	}, [selectedWorkspace.id, skip, hasMore, isLoading, videosPerPage]);

	// Initial fetch and reset
	useEffect(() => {
		setVideos([]);
		setSkip(0);
		setTotalCount(null);
		setHasMore(true);
		fetchMoreVideos();
	}, [selectedWorkspace.id]); // Only refetch when workspace changes

	// Setup IntersectionObserver for infinite scroll
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && hasMore && !isLoading) {
				fetchMoreVideos();
			}
		},
		[fetchMoreVideos, hasMore, isLoading]
	);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "100px", // Trigger 100px before reaching the bottom
			threshold: 0,
		});

		const currentLoadMoreRef = loadMoreRef.current;
		if (currentLoadMoreRef) {
			observerRef.current.observe(currentLoadMoreRef);
		}

		return () => {
			if (observerRef.current && currentLoadMoreRef) {
				observerRef.current.unobserve(currentLoadMoreRef);
				observerRef.current.disconnect();
			}
		};
	}, [handleObserver]);

	const handleOnClick = (videoId: string) => {
		router.push("/video/" + videoId);
	};

	return (
		<div className="flex flex-col gap-5 overflow-y-auto w-full h-full">
			{/* Video Grid */}
			<div className="flex flex-wrap gap-5">
				{videos.map((v) => (
					<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
				))}
				{videos.length === 0 && !isLoading && (
					<p className="text-gray-400">Nothing to catch up!</p>
				)}
			</div>

			{/* Loading indicator and observer target */}
			{hasMore && (
				<div ref={loadMoreRef} className="flex justify-center py-4">
					{isLoading && (
						<span className="text-gray-500">Loading more videos...</span>
					)}
				</div>
			)}

			{!hasMore && videos.length > 0 && (
				<div className="flex justify-center py-4">
					<span className="text-gray-500">No more videos to load</span>
				</div>
			)}
		</div>
	);
}

export default WatchLaterVideoTab;
