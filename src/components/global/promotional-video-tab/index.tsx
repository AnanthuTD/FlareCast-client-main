"use client";

import React, { useEffect, useRef, useState } from "react";
import { VideoCard } from "@/components/main/VideoCard";
import { useRouter } from "next/navigation";
import { getPromotionalVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Slider, { Settings as SliderSettings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Video } from "@/types";

type VideoResponse = {
	videos: Video[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
	hasNextPage: number;
	hasPrevPage: number;
};

export default function PromotionalVideoGrid({
	category,
	queryKey,
}: {
	category: string;
	queryKey: string;
}) {
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);
	const pageSize = 6;
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<Slider>(null);
	const [videos, setVideos] = useState<Video[]>([]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch,
	} = useInfiniteQuery<VideoResponse, Error>({
		queryKey: [queryKey],
		queryFn: async ({ pageParam = 0 }) => {
			if (!selectedWorkspace) {
				return {
					videos: [],
					totalCount: 0,
					page: 1,
					pageSize,
					totalPages: 1,
					hasNextPage: false,
					hasPrevPage: false,
				};
			}
			const response = await getPromotionalVideos(
				pageParam * pageSize,
				pageSize,
				category
			);
			return response;
		},
		initialPageParam: 0,
		enabled: !!selectedWorkspace,
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.page : undefined,
	});

	useEffect(() => {
		const videos = data?.pages.flatMap((page) => page.videos) ?? [];
		setVideos(videos);
	}, [data]);

	const handleVideoClick = (videoId: string) => {
		router.push(`/video/${videoId}`);
	};

	useEffect(() => {
		if (!hasNextPage || isFetchingNextPage || !sliderRef.current) return;

		const totalSlides = videos.length;
		const slidesToShow = 3;
		const threshold = totalSlides - slidesToShow * 2;

		if (currentSlide >= threshold) {
			fetchNextPage();
		}
	}, [
		currentSlide,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		videos.length,
	]);

	const settings: SliderSettings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
		afterChange: (current) => setCurrentSlide(current),
	};

	return (
		<div className="w-full">
			{isLoading && (
				<div className="flex justify-center py-4">
					<Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
				</div>
			)}
			{error && (
				<div
					className="flex flex-col items-center py-4 text-red-500"
					role="alert"
					aria-live="assertive"
				>
					<p>Failed to load videos. Please try again.</p>
					<Button
						onClick={() => refetch()}
						className="mt-2 bg-indigo-300 hover:bg-indigo-400 text-white"
					>
						Retry
					</Button>
				</div>
			)}
			{!isLoading && !error && videos.length === 0 && (
				<p className="text-center text-neutral-600 py-4">
					No videos available.
				</p>
			)}
			{videos.length > 0 && (
				<Slider ref={sliderRef} {...settings}>
					{videos.map((video) => (
						<div key={video.id} className="px-2">
							<VideoCard
								{...video}
								onClick={() => handleVideoClick(video.id)}
							/>
						</div>
					))}
				</Slider>
			)}
			{isFetchingNextPage && (
				<div className="flex justify-center py-4" aria-live="polite">
					<Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
				</div>
			)}
		</div>
	);
}
