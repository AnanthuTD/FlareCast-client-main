import { VideoSection } from "@/components/main/VideoSection";
import React from "react";

const videoData = {
	gettingStarted: {
		title: "Getting Started",
		videos: Array(5).fill({
			duration: "4 min",
			userName: "Moksh Garg",
			timeAgo: "2mo",
			title: "Loom Message - 31 January 2023",
			views: 3,
			comments: 0,
			shares: 0,
			thumbnailUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/0e211fdd8d570385198dc92c489ea1887e302f2bbfa3e20c297c5972bccac9da?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			userAvatarUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/d22a00db697691c85c7d72a4be44f017a90f980bdec24fba5b431c8ea84e9eb2?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		}),
	},
	newFeatures: {
		title: "New Features",
		videos: Array(5).fill({
			duration: "4 min",
			userName: "Moksh Garg",
			timeAgo: "2mo",
			title: "Loom Message - 31 January 2023",
			views: 3,
			comments: 0,
			shares: 0,
			thumbnailUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/d04b6940fee6059d569beca58082ec42acf8abaed7058502329468748a11dece?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			userAvatarUrl:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/dbea0e913516a48f4cd6c3f7eb302b5283deee6a8dbe579de8d8268fb080a9d3?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		}),
	},
};

function HomePage() {
	return (
		<>
			<VideoSection {...videoData.gettingStarted} />
		</>
	);
}

export default HomePage;
