"use client";
import React, { useEffect } from "react";
import TabMenu from "../../tabs";
import VideoTranscript from "../../video-transcript";
import VideoJS from "../VideoJS";
import videojs from "video.js";
import { useQueryData } from "@/hooks/useQueryData";
import { getPreviewVideo } from "@/actions/video";
import { toast } from "sonner";
import Player from "@/app/test/page";

type Props = {
	videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
	const playerRef = React.useRef(null);
	const [video, setVideo] = React.useState<Video | null>(null);

	const videoJsOptions = {
		autoplay: false,
		controls: true,
		responsive: true,
		fluid: true,
		sources: [
			{
				// src: "http://localhost:4003/video_id/master.m3u8",
				src: `/gcs/${videoId}/master.m3u8`,
				type: "application/x-mpegURL",
			},
		],
	};

	const handlePlayerReady = (player) => {
		playerRef.current = player;

		player.on("waiting", () => {
			videojs.log("player is waiting");
		});

		player.on("dispose", () => {
			videojs.log("player will dispose");
		});
	};

	useEffect(() => {
		getPreviewVideo(videoId)
			.then(({ video }) => {
				setVideo(video);
			})
			.catch(() => {
				toast.error(`Failed to get preview video`);
			});
	}, [videoId]);

	const daysAgo = Math.floor(
		(new Date().getTime() - new Date(video?.createdAt).getTime()) /
			(24 * 60 * 60 * 1000)
	);

	return (
		<div className="grid grid-cols-1 xl:grid-cols-3 overflow-y-auto gap-5 w-full">
			<div className="flex flex-col lg:col-span-2 gap-y-10">
				<div>
					<div className="flex gap-x-5 items-start justify-between">
						<h2 className="text-4xl font-bold">{video?.title}</h2>
					</div>
					<span className="flex gap-x-3 mt-2">
						<p className="text-[#9D9D9D] capitalize">
							{/* {video.User?.firstname} {video.User?.lastname} */}
						</p>
						<p className="text-[#707070]">
							{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
						</p>
					</span>
				</div>

				{/* <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> */}
				<Player hslUrl={`/gcs/${videoId}/master.m3u8`} thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`} posterUrl={`/gcs/${videoId}/thumbnails/thumb00001.jpg`}/>
				<div className="flex flex-col text-2xl gap-y-4">
					<div className="flex gap-x-5 items-center justify-between">
						<p className="text-semibold">Description</p>
					</div>
					<p className="text-lg text-medium">
						{video?.description}
					</p>
				</div>
			</div>
			<div className="lg:col-span-1 flex flex-col gap-y-16">
				<div className="flex justify-end gap-x-3 items-center">
					{/* links to copy and download */}
				</div>
				<div>
					<TabMenu
						defaultValue="Transcript"
						triggers={["Ai tools", "Transcript", "Activity"]}
					>
						<VideoTranscript
							transcript={(video?.transcription || "Transcript")}
						/>
					</TabMenu>
				</div>
			</div>
		</div>
	);
};

export default VideoPreview;
