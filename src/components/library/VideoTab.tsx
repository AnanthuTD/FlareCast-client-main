import React, { useEffect, useState } from "react";
import { VideoCard } from "../main/VideoCard";
import { VideoCardProps } from "@/types";
import axiosInstance from "@/axios";
import { useRouter } from "next/navigation";

const videoData: VideoCardProps = {
	duration: "4 min",
	comments: 5,
	shares: 10,
	title: "Loom Message - 31 January 2023",
	views: 300,
	userName: "Moksh Garg",
	timeAgo: "2mo",
	thumbnailUrl:
		"https://cdn.builder.io/api/v1/image/assets/TEMP/0e211fdd8d570385198dc92c489ea1887e302f2bbfa3e20c297c5972bccac9da?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
	userAvatarUrl: "/vercel.svg",
};

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
