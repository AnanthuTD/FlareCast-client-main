"use client";

import * as React from "react";
import { VideoCardProps } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Eye, Video } from "lucide-react";
import DropdownVideo from "../global/video-library/DropdownVideo";

export const VideoCard: React.FC<VideoCardProps> = ({
	duration,
	userName,
	timeAgo,
	title,
	totalViews,
	comments,
	shares,
	thumbnailUrl,
	userAvatarUrl,
	onClick,
	transcodeStatus = "SUCCESS",
	thumbnailStatus = "SUCCESS",
	id,
	spaceId,
	type = "VOD",
}) => {
	const isLive = type === "LIVE";
	const isClickable = isLive || transcodeStatus === "SUCCESS";
	const hasThumbnail = !!thumbnailUrl && thumbnailStatus === "SUCCESS";

	// Determine fallback content based on type and thumbnail status
	const renderThumbnailFallback = () => {
		if (isLive) {
			return (
				<div className="flex items-center justify-center h-full  text-white text-sm">
					<Video className="w-6 h-6 mr-2" />
					<span>Streaming Live</span>
				</div>
			);
		}
		if (thumbnailStatus === "PENDING") {
			return (
				<div className="flex items-center justify-center h-full  text-gray-600 text-sm">
					<span>Processing...</span>
				</div>
			);
		}
		return (
			<div className="flex items-center justify-center h-full  text-gray-600 text-sm">
				<span>No Thumbnail</span>
			</div>
		);
	};

	return (
		<Card
			className={`w-[350px] rounded-xl overflow-hidden transition-opacity ${
				isClickable ? "opacity-100" : "opacity-50"
			}`}
		>
			<CardHeader>
				<div className="relative w-full h-48 rounded-2xl overflow-hidden">
					{/* Video Thumbnail or Fallback */}
					<Avatar
						onClick={isClickable ? onClick : undefined}
						className="object-cover w-full h-full rounded-none"
						style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
					>
						<AvatarImage src={hasThumbnail ? thumbnailUrl : ""} />
						<AvatarFallback className="rounded-none">
							{renderThumbnailFallback()}
						</AvatarFallback>
					</Avatar>

					{/* Live Stream Indicator (only if thumbnail exists) */}
					{isLive && (
						<div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
							<Video className="w-4 h-4" />
							<span>LIVE</span>
						</div>
					)}

					{/* Duration Badge (VOD only, if thumbnail exists) */}
					{!isLive && hasThumbnail && (
						<div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
							{duration}
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent>
				<div className="flex gap-2 items-start">
					{/* Avatar */}
					<Avatar className="w-8 h-8">
						<AvatarImage src={userAvatarUrl} />
						<AvatarFallback>
							<div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full">
								{userName?.[0]}
							</div>
						</AvatarFallback>
					</Avatar>

					{/* Video Info */}
					<div className="flex flex-col w-full">
						<div className="flex justify-between text-xs text-gray-500">
							<span className="font-medium text-neutral-800">{userName}</span>
							<span>・{timeAgo}</span>
						</div>

						{/* Video Title */}
						<div className="mt-2 text-sm font-medium text-neutral-800 line-clamp-2">
							{title}
						</div>

						{/* Video Stats */}
						<div className="flex gap-4 mt-3 text-xs text-gray-500">
							<div className="flex items-center gap-1">
								<Eye />
								<span>{totalViews}</span>
							</div>
							{/* <div className="flex items-center gap-1">
								<MessageCircle />
								<span>{comments}</span>
							</div> */}
							<div className="flex items-center gap-1">
								<ExternalLink />
								<DropdownVideo
									sourceId={id}
									type="video"
									canShare={!spaceId}
									// canDelete={category === "PROMOTIONAL"}
								/>
								{/* <span>{shares}</span> */}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
