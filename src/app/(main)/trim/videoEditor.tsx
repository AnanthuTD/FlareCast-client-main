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
	const [trimRanges, setTrimRanges] = useState<number[][]>([[]]); // Array of [start, end] ranges
	const [videoDuration, setVideoDuration] = useState<number>(0);
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
					setTrimRanges([[0, 14]]); // Default to full range
				};
			} catch (error) {
				console.error("Failed to fetch video:", error);
				toast.error("Could not load video—check URL or permissions");
			}
		};
		checkFileSizeAndFetch();
	}, [videoId]);

	// Add a new trim range
	const addTrimRange = () => {
		setTrimRanges([...trimRanges, [0, videoDuration]]);
	};

	// Remove a trim range
	const removeTrimRange = (index: number) => {
		setTrimRanges(trimRanges.filter((_, i) => i !== index));
	};

	// Trim and merge multiple ranges
	const trimAndMergeVideo = async () => {
		if (!ffmpeg || !videoSrc || trimRanges.length === 0) return;

		setLoading(true);
		try {
			const videoData = await fetchFile(videoSrc);
			await ffmpeg.writeFile("input.webm", videoData);

			// Create a list file for concatenation
			const listFileContent = trimRanges
				.sort((a, b) => a[0] - b[0]) // Sort by start time
				.map((range, i) => {
					const start = range[0];
					const duration = range[1] - range[0];
					return `file 'input.webm'\ninpoint ${start}\noutpoint ${
						start + duration
					}`;
				})
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
					hslUrl={`/gcs/${videoId}/master.m3u8`}
					thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`}
					posterUrl={`/gcs/${videoId}/thumbnails/thumb00001.jpg`}
					videoId={videoId}
					trimStart={
						trimRanges.length > 0 ? Math.min(...trimRanges.map((r) => r[0])) : 0
					} // Show first start
					trimEnd={
						trimRanges.length > 0
							? Math.max(...trimRanges.map((r) => r[1]))
							: videoDuration
					} // Show last end
				/>
			</div>
			<div className="bg-gray-800 p-4 rounded-lg shadow-lg">
				<h2 className="text-xl font-semibold mb-4">Trim Video</h2>
				{trimRanges.map((range, index) => (
					<div key={index} className="mb-4">
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-lg">Range {index + 1}</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeTrimRange(index)}
								className="text-red-500 hover:bg-red-900"
							>
								Remove
							</Button>
						</div>
						<Range
							values={range}
							step={0.1}
							min={0}
							max={videoDuration}
							onChange={(values) => {
								const newRanges = [...trimRanges];
								newRanges[index] = values;
								setTrimRanges(newRanges);
							}}
							renderTrack={({ props, children }) => (
								<div
									{...props}
									className="h-4 rounded-full"
									style={{
										background: getTrackBackground({
											values: range,
											colors: ["#4A5568", "#6366F1", "#4A5568"],
											min: 0,
											max: videoDuration,
										}),
									}}
								>
									{children}
								</div>
							)}
							renderThumb={({ props, isDragged, index: thumbIndex }) => (
								<div
									{...props}
									className={`h-6 w-6 rounded-full bg-indigo-500 ${
										isDragged ? "shadow-lg" : ""
									}`}
									style={{
										...props.style,
										border: "2px solid #FFFFFF",
									}}
								/>
							)}
						/>
						<div className="flex justify-between text-sm mt-2 text-gray-300">
							<span>Start: {range[0]?.toFixed(1)}s</span>
							<span>End: {range[1]?.toFixed(1)}s</span>
						</div>
					</div>
				))}
				<div className="mt-4 flex gap-2">
					<Button
						onClick={addTrimRange}
						className="bg-indigo-500 hover:bg-indigo-600 text-white"
					>
						Add Range
					</Button>
					<Button
						onClick={trimAndMergeVideo}
						disabled={loading || trimRanges.length === 0}
						className="bg-indigo-500 hover:bg-indigo-600 text-white"
					>
						{loading ? "Trimming..." : "Trim & Merge Video"}
					</Button>
				</div>
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
