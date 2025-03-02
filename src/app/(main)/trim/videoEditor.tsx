"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Range, getTrackBackground } from "react-range";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";
import Player from "./player";

type Props = {
	videoId: string;
};

const VideoEditor = ({ videoId }: Props) => {
	const [video, setVideo] = useState<Video | null>(null);
	const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [trimmedSrc, setTrimmedSrc] = useState<string>("");
	const [cutPoints, setCutPoints] = useState<number[]>([]); // Points where to cut (sorted)
	const [videoDuration, setVideoDuration] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);

	// Fetch video metadata (optional, if you want title/description)
	const fetchVideo = useCallback(async () => {
		try {
			const response = await fetch(`/api/video/${videoId}`);
			const data = await response.json();
			setVideo(data.video);
		} catch (error) {
			console.error("Failed to fetch video details:", error);
			toast.error("Failed to load video details");
		}
	}, [videoId]);

	// Load FFmpeg
	useEffect(() => {
		const loadFfmpeg = async () => {
			const ffmpegInstance = new FFmpeg();
			await ffmpegInstance.load({
				coreURL: await toBlobURL(
					"https://unpkg.com/@ffmpeg/core@latest/dist/umd/ffmpeg-core.js",
					"text/javascript"
				),
				wasmURL: await toBlobURL(
					"https://unpkg.com/@ffmpeg/core@latest/dist/umd/ffmpeg-core.wasm",
					"application/wasm"
				),
			});
			setFfmpeg(ffmpegInstance);
		};
		loadFfmpeg();
	}, []);

	// Set video source and get duration
	useEffect(() => {
		const webmUrl = `/gcs/67be819a854f18c190256151/original.webm`;
		setVideoSrc(webmUrl);

		const checkFileSizeAndFetch = async () => {
			try {
				const response = await fetch(webmUrl);
				const contentLength = response.headers.get("Content-Length");
				if (contentLength && parseInt(contentLength, 10) > 50 * 1024 * 1024) {
					toast.error("Video is too large for client-side trimming");
					return;
				}

				const videoElement = document.createElement("video");
				videoElement.src = webmUrl;
				videoElement.onloadedmetadata = () => {
					setVideoDuration(14);
					setCutPoints([]); // Reset cut points
				};
			} catch (error) {
				console.error("Failed to fetch video:", error);
				toast.error("Could not load video—check URL or permissions");
			}
		};
		checkFileSizeAndFetch();
	}, [videoId]);

	// Add a cut point where the user clicks on the track
	const addCutPoint = (value: number) => {
		const newPoints = [...cutPoints, value].sort((a, b) => a - b);
		setCutPoints(
			newPoints.filter(
				(point, index, self) => index === self.findIndex((p) => p === point) // Remove duplicates
			)
		);
	};

	// Remove a cut point
	const removeCutPoint = (index: number) => {
		setCutPoints(cutPoints.filter((_, i) => i !== index));
	};

	// Trim and merge segments (keep portions outside cut points or between specific ones)
	const trimAndMergeVideo = async () => {
		if (
			!ffmpeg ||
			!videoSrc ||
			cutPoints.length === 0 ||
			cutPoints.length % 2 !== 0
		)
			return;

		console.log("cut points: ", cutPoints);

		setLoading(true);
		try {
			const videoData = await fetchFile(videoSrc);
			await ffmpeg.writeFile("input.webm", videoData);

			// Create segments to keep, excluding the portions at cut points
			const sortedCuts = cutPoints.sort((a, b) => a - b);
			const segments = [];

			// Start with the beginning of the video
			if (sortedCuts[0] > 0) {
				segments.push({ start: 0, duration: sortedCuts[0] });
			}

			// Add segments between cuts (if any)
			for (let i = 1; i < sortedCuts.length - 1; i = i + 2) {
				const gap = sortedCuts[i + 1] - sortedCuts[i];
				if (gap > 0.1) {
					// Skip very small gaps
					segments.push({ start: sortedCuts[i], duration: gap });
				}
			}

			// Add the end portion if there’s anything after the last cut
			if (sortedCuts[sortedCuts.length - 1] < videoDuration) {
				segments.push({
					start: sortedCuts[sortedCuts.length - 1],
					duration: videoDuration - sortedCuts[sortedCuts.length - 1],
				});
			}

			console.log("Segments to keep:", segments);

			if (segments.length === 0) {
				toast.error("No valid segments to keep");
				return;
			}

			// Create a list file for concatenation
			const listFileContent = segments
				.map(
					(segment, i) =>
						`file 'input.webm'\ninpoint ${segment.start}\noutpoint ${
							segment.start + segment.duration
						}`
				)
				.join("\n");

			await ffmpeg.writeFile("list.txt", listFileContent);

			// Use concat protocol to merge segments
			await ffmpeg.exec([
				"-f",
				"concat",
				"-safe",
				"0",
				"-i",
				"list.txt",
				"-c:v",
				"copy",
				"-c:a",
				"copy",
				"output.webm",
			]);

			const trimmedData = (await ffmpeg.readFile("output.webm")) as Uint8Array;
			const blob = new Blob([trimmedData], { type: "video/webm" });
			const url = URL.createObjectURL(blob);
			setTrimmedSrc(url);

			toast.success("Video trimmed and merged successfully!");
		} catch (error) {
			console.error("Trimming and merging failed:", error);
			toast.error("Failed to trim and merge video");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<h1 className="text-3xl font-bold mb-6">
				{video?.title || "Video Editor"}
			</h1>
			<div className="mb-6">
				<Player
					hslUrl={`/gcs/${videoId}/original.webm`}
					thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`}
					posterUrl={`/gcs/${videoId}/thumbnails/thumb00001.jpg`}
					videoId={videoId}
					trimStart={cutPoints.length > 0 ? Math.min(...cutPoints) : 0} // Show first cut
					trimEnd={
						cutPoints.length > 0 ? Math.max(...cutPoints) : videoDuration
					} // Show last cut
				/>
			</div>
			<div className="bg-gray-800 p-4 rounded-lg shadow-lg">
				<h2 className="text-xl font-semibold mb-4">Trim Video</h2>
				<div className="mb-4">
					<label className="block mb-2">
						Click on the bar to add cut points:
					</label>
					<Range
						values={[0]} // Dummy value, not used for cuts
						step={0.1}
						min={0}
						max={videoDuration}
						onChange={() => {}} // No-op for value changes
						onFinalChange={() => {}} // No-op for final value
						renderTrack={({ props, children }) => (
							<div
								{...props}
								className="h-8 rounded-full cursor-pointer" // Wider bar (h-8)
								onClick={(e) => {
									const rect = e.currentTarget.getBoundingClientRect();
									const clickPosition = e.clientX - rect.left;
									const value = (clickPosition / rect.width) * videoDuration;
									addCutPoint(value);
								}}
								style={{
									background: getTrackBackground({
										values: cutPoints,
										colors: cutPoints.map(() => "#6366F1"), // Indigo cut points
										min: 0,
										max: videoDuration,
									}),
									position: "relative",
								}}
							>
								{children}
								{cutPoints.map((point, index) => (
									<div
										key={index}
										className="absolute top-0 h-8 w-1 bg-red-500"
										style={{
											left: `${(point / videoDuration) * 100}%`,
											transform: "translateX(-50%)",
										}}
									/>
								))}
							</div>
						)}
						renderThumb={() => null} // Hide thumbs since we use clicks
					/>
					<div className="flex flex-wrap gap-2 mt-2 text-gray-300">
						{cutPoints.map((point, index) => (
							<span key={index} className="text-sm">
								Cut {index + 1}: {point.toFixed(1)}s{" "}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeCutPoint(index)}
									className="text-red-500 hover:bg-red-900 p-1 h-auto"
								>
									×
								</Button>
							</span>
						))}
					</div>
				</div>
				<Button
					onClick={trimAndMergeVideo}
					disabled={loading || cutPoints.length === 0}
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
				>
					{loading ? "Trimming..." : "Trim & Merge Video"}
				</Button>
				{trimmedSrc && (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Trimmed Video:</h3>
						<video controls src={trimmedSrc} width="100%" className="mb-4" />
						<a href={trimmedSrc} download={`trimmed-${videoId}.webm`}>
							<Button
								variant="outline"
								className="w-full border-white text-white hover:bg-gray-700"
							>
								Download Trimmed Video
							</Button>
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default VideoEditor;
