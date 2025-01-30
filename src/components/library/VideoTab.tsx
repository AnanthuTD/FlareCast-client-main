import React, { useEffect, useState } from "react";
import { VideoCard } from "../main/VideoCard";
import { VideoCardProps } from "@/types";
import axiosInstance from "@/axios";
import { useRouter } from "next/navigation";

function VideoTab() {
	const [videos, setVideos] = useState([]);
	const router = useRouter();

	useEffect(() => {
		async function fetchVideos() {
			const response = await axiosInstance.get("/api/video-service/videos", {
				params: {
					limit: 10,
					skip: 0,
				},
			});

			const { videos, totalCount, remainingCount } = response.data;

			setVideos(videos);
		}

		fetchVideos();
	}, []);

	const handleOnClick = (videoId: string) => {
		console.log("Video clicked!");
		// Trigger the video player with the videoId or videoData from props.
		router.push("/video/" + videoId);
	};

	return (
		<div className="flex flex-wrap gap-5">
			{videos.map((v) => (
				<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
			))}
		</div>
	);
}

export default VideoTab;
