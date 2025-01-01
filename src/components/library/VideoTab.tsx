import React from "react";
import { VideoCard } from "../main/VideoCard";
import { VideoCardProps } from "@/types";

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
	return (
		<>
			<VideoCard {...videoData} />
		</>
	);
}

export default VideoTab;
