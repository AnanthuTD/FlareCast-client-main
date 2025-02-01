"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { postView } from "@/actions/video";

interface PlayerProps {
	hslUrl: string;
	thumbnailsUrl: string;
	posterUrl: string;
	videoId: string;
}

function Player({ hslUrl, thumbnailsUrl, posterUrl, videoId }: PlayerProps) {
	console.log(thumbnailsUrl);

	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<Plyr | null>(null);

	useEffect(() => {
		const source = hslUrl;
		const video = videoRef.current;
		let hls: Hls | null = null;
		let player: Plyr | null = null;

		if (!video) return; // Ensure video element exists

		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(source);
			hls.attachMedia(video);

			// Handle HLS manifest parsed event
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				const levels = hls?.levels.map((level) => level.height) || [];

				// Initialize Plyr
				player = new Plyr(video, {
					captions: { active: true, update: true, language: "en" },
					quality: {
						default: "auto", // Default to adaptive mode
						options: ["auto", ...levels],
						forced: true,
						onChange: (quality: string | number) => {
							if (quality === "auto") {
								hls!.currentLevel = -1;
							} else {
								const levelIndex = levels.indexOf(quality as number);
								if (levelIndex !== -1) hls!.currentLevel = levelIndex;
							}
						},
					},
					previewThumbnails: {
						enabled: true,
						src: thumbnailsUrl,
					},
				});

				playerRef.current = player;
			});
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			// For browsers like Safari
			video.src = source;
			player = new Plyr(video, {
				captions: { active: true, update: true, language: "en" },
			});
			playerRef.current = player;
		}

		// Cleanup Hls and Plyr instances on unmount
		return () => {
			if (hls) hls.destroy();
			if (player) player.destroy();
		};
	}, [hslUrl, thumbnailsUrl]);

	return (
		<div>
			<video
				ref={videoRef}
				controls
				playsInline
				poster={posterUrl}
				className="w-full"
				onPlay={() => postView(videoId)}
			></video>
		</div>
	);
}

export default Player;
