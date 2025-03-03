"use client";

import * as React from "react";
import Image from "next/image";
import { VideoCardProps } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Eye, MessageCircle } from "lucide-react";
import DropdownVideo from "../global/video-library/DropdownVideo";

export const VideoCard: React.FC<VideoCardProps> = ({
	duration,
	userName,
	timeAgo,
	title,
	views,
	comments,
	shares,
	thumbnailUrl,
	userAvatarUrl,
	onClick,
	transcodeStatus = true,
	id,
	spaceId,
}) => {
	const isClickable = transcodeStatus;

	return (
		<Card
			className={`w-[350px] rounded-xl overflow-hidden transition-opacity ${
				isClickable ? "opacity-100" : "opacity-50"
			}`}
			onClick={isClickable ? onClick : undefined}
			style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
		>
			<CardHeader>
				<div
					className={`relative w-full h-48 rounded-2xl overflow-hidden ${
						thumbnailUrl ? "" : "bg-black"
					}`}
				>
					{/* Video Thumbnail */}
					{thumbnailUrl && (
						<Image
							src={thumbnailUrl}
							alt="Video thumbnail"
							fill
							className="object-cover"
						/>
					)}

					{/* Duration Badge */}
					<div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
						{duration}
					</div>
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
								<span>{views}</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageCircle />
								<span>{comments}</span>
							</div>
							<div className="flex items-center gap-1">
								<ExternalLink />
								<DropdownVideo
									sourceId={id}
									type={"video"}
									canShare={!spaceId}
								/>
								<span>{shares}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
