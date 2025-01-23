"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
// import "./Page.css"; 

function Player({ hslUrl, thumbnailsUrl, posterUrl }) {
	const videoRef = useRef(null);
	const playerRef = useRef(null);
	const [availableQualities, setAvailableQualities] = useState([]);

	useEffect(() => {
		const source = hslUrl;
		const video = videoRef.current;
		let hls = null; 
		let player = null;

		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(source);
			hls.attachMedia(video);

			// Handle HLS manifest parsed event
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				const levels = hls.levels.map((level) => level.height);
				setAvailableQualities(levels); // Update state with quality levels

				// Initialize Plyr
				player = new Plyr(video, {
					captions: { active: true, update: true, language: "en" },
					quality: {
						default: "auto", // Default to adaptive mode
						options: ["auto", ...levels],
						forced: true,
						onChange: (quality) => {
							if (quality === "auto") {
								hls.currentLevel = -1;
							} else {
								const levelIndex = levels.indexOf(quality);
								if (levelIndex !== -1) hls.currentLevel = levelIndex;
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
	}, []);

	return (
		<div /* className=" h-screen flex w-screen flex-col justify-center items-center" */>
			<video
				ref={videoRef}
				controls
				playsInline
				poster={posterUrl}
				className="w-full"
			></video>
		</div>
	);
}

export default Player;
