"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";
import Player from "./player";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import axiosInstance from "@/axios";
import axios from "axios";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { useUserStore } from "@/providers/UserStoreProvider";
import EditingUpgradePrompt from "@/components/global/editing-upgrade-prompt";
import { getPreviewVideo } from "@/actions/video";

type Props = {
	videoId: string;
};

const VideoEditor = ({ videoId }: Props) => {
	const [video, setVideo] = useState<Video | null>(null);
	const [ffmpeg, setFmpeg] = useState<FFmpeg | null>(null);
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [trimmedSrc, setTrimmedSrc] = useState<string>("");
	const [cutPoints, setCutPoints] = useState<number[]>([]); // Cumulative cut points (sorted)
	const [currentCutPoints, setCurrentCutPoints] = useState<number[]>([]); // Temporary points for current cut
	const [videoDuration, setVideoDuration] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [previewTime, setPreviewTime] = useState<number>(0); // For real-time preview
	const [uploadProgress, setUploadProgress] = useState<number>(0); // Upload progress state
	const [isUploading, setIsUploading] = useState<boolean>(false); // Upload modal state
	const { hasAdvancedEditing } = useUserStore((state) => state.plan);

	// Load FFmpeg
	useEffect(() => {
		const loadFmpeg = async () => {
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
			setFmpeg(ffmpegInstance);
		};
		loadFmpeg();
	}, []);

	// Set video source and get duration
	useEffect(() => {
		const webmUrl = `/gcs/${videoId}/original.webm`;
		setVideoSrc(webmUrl);

		getPreviewVideo(videoId).then(({video}) => {
			setVideo(video);
			setVideoDuration(parseFloat(video?.duration || "14")); // Hardcoded for now, update to dynamic
		});

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
					console.log(video);
					setCutPoints([]); // Reset cumulative cut points
					setCurrentCutPoints([]); // Reset current cut points
				};
			} catch (error) {
				console.error("Failed to fetch video:", error);
				toast.error("Could not load video—check URL or permissions");
			}
		};
		checkFileSizeAndFetch();
	}, [videoId]);

	const addCutPoint = (value: number) => {
		if (currentCutPoints.length >= 2) {
			toast.error("Maximum 2 points per cut operation allowed");
			return;
		}
		const newPoints = [...currentCutPoints, value].sort((a, b) => a - b);
		setCurrentCutPoints(
			newPoints.filter(
				(point, i, self) => i === self.findIndex((p) => p === point) // Remove duplicates
			)
		);
	};

	const finalizeCut = () => {
		if (currentCutPoints.length !== 2) {
			toast.error("Please select exactly 2 points to cut");
			return;
		}

		// Check if the new cut overlaps with any existing discarded portions
		const newRange = { start: currentCutPoints[0], end: currentCutPoints[1] };
		const existingRanges = cutPoints.reduce((acc, _, i, arr) => {
			if (i % 2 === 0 && i < arr.length - 1) {
				acc.push({ start: arr[i], end: arr[i + 1] });
			}
			return acc;
		}, [] as { start: number; end: number }[]);

		const hasOverlap = existingRanges.some(
			(range) =>
				(newRange.start >= range.start && newRange.start < range.end) ||
				(newRange.end > range.start && newRange.end <= range.end) ||
				(newRange.start <= range.start && newRange.end >= range.end)
		);

		if (hasOverlap) {
			toast.error("This portion overlaps with an existing cut");
			return;
		}

		const newCutPoints = [...cutPoints, ...currentCutPoints].sort(
			(a, b) => a - b
		);
		setCutPoints(
			newCutPoints.filter(
				(point, i, self) => i === self.findIndex((p) => p === point) // Remove duplicates
			)
		);
		setCurrentCutPoints([]); // Clear for next cut
	};

	const removeCutRange = (start: number, end: number) => {
		console.log(start, end);
		console.log(cutPoints);
		const sortedCuts = cutPoints.sort((a, b) => a - b);
		const newCutPoints = sortedCuts.filter((point, i) => {
			if (point !== start && point !== end) return true;
		});
		setCutPoints(newCutPoints);
	};

	const removeCutPoints = () => {
		setCutPoints([]);
		setCurrentCutPoints([]);
	};

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

			// Create segments to keep, excluding the portions between pairs of cut points
			const sortedCuts = [...cutPoints.sort((a, b) => a - b)];
			const segments = [];

			// Keep the portion before the first cut, if any
			if (sortedCuts[0] > 0) {
				segments.push({ start: 0, duration: sortedCuts[0] });
			}

			for (let i = 1; i < sortedCuts.length - 1; i = i + 2) {
				const gap = sortedCuts[i + 1] - sortedCuts[i];
				if (gap > 0.1) {
					// Skip very small gaps
					segments.push({ start: sortedCuts[i], duration: gap });
				}
			}

			// Keep the portion after the last cut, if any
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

			await uploadEditedVideo(blob, videoId);
			toast.success("Video trimmed, merged, and uploaded successfully!");
		} catch (error) {
			console.error("Trimming and merging failed:", error);
			toast.error("Failed to trim and merge video");
		} finally {
			setLoading(false);
		}
	};

	// Real-time preview logic
	const handleDrag = (values: number[]) => {
		const draggedPoint = values[0];
		setPreviewTime(draggedPoint); // Update preview to show the dragged position
	};

	const uploadEditedVideo = async (fileBlob: Blob, videoId: string) => {
		setIsUploading(true);
		try {
			const response = await axiosInstance(
				`/api/videos/upload-presigned-url?videoId=${videoId}`
			);
			const { signedUrl, key, videoId: editedVideoId } = await response.data;

			console.log(signedUrl);

			if (!signedUrl) {
				console.error("Failed to get presigned URL");
				throw new Error("Failed to get presigned URL");
			}

			const totalSize = fileBlob.size;
			let uploadedSize = 0;

			const reader = fileBlob.stream().getReader();
			const chunks = [];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value);
				uploadedSize += value.length;
				const progress = ((uploadedSize / totalSize) * 100).toFixed(1);
				setUploadProgress(Number(progress));
			}

			try {
				const uploadResponse = await axios.put(signedUrl, new Blob(chunks), {
					headers: { "Content-Type": "video/webm" },
				});
				console.log("Upload to s3 successful", uploadResponse.status);

				try {
					await axiosInstance.post(`/api/videos/${editedVideoId}/edit-success`, {
						key,
						status: "success",
					});
					console.log("Notifying server success");
				} catch (error) {
					console.log(
						"Failed to notify server about successful video upload",
						error
					);
					await axiosInstance.post(`/api/videos/${editedVideoId}/edit-success`, {
						key,
						status: "failure",
					});
				}
			} catch (e) {
				await axiosInstance.post(`/api/videos/${editedVideoId}/edit-success`, {
					key,
					status: "failure",
				});
				console.error("Error uploading to S3:", e);
				throw new Error("Failed to upload video");
			}

			setUploadProgress(100);
			return signedUrl.split("?")[0];
		} catch (error) {
			console.error("Upload failed:", error);
			throw error;
		} finally {
			// setIsUploading(false);
			// setUploadProgress(0);
		}
	};

	return hasAdvancedEditing ? (
		<div className="min-h-screen bg-white p-6">
			{/* 			<h1 className="text-3xl font-bold mb-6 text-indigo-900">
				{video?.title || "Video Editor"}
			</h1> */}
			<Card className="mb-4 bg-white shadow-md">
				<CardContent className="flex justify-center p-3">
					<Player
						hslUrl={`/gcs/${videoId}/original.webm`}
						thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`}
						posterUrl={`/gcs/${videoId}/thumbnails/thumb00001.jpg`}
						videoId={videoId}
						trimStart={
							cutPoints.length > 0 && cutPoints.length % 2 === 0
								? Math.min(...cutPoints.filter((_, i) => i % 2 === 0))
								: 0
						} // Show start of each discarded range
						trimEnd={
							cutPoints.length > 0 && cutPoints.length % 2 === 0
								? Math.max(...cutPoints.filter((_, i) => i % 2 === 1))
								: videoDuration
						} // Show end of each discarded range
						previewTime={previewTime} // Pass preview time for real-time update
					/>
				</CardContent>
			</Card>
			<Card className="bg-white shadow-md">
				<CardHeader className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-indigo-900">Trim Video</h2>
					<Button
						onClick={finalizeCut}
						className="bg-indigo-300 hover:bg-indigo-400 text-white"
						size="sm"
						disabled={currentCutPoints.length !== 2}
					>
						<span className="mr-2">✂️</span> Scissor
					</Button>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<label className="block mb-2 text-indigo-700">
							Drag points to set cuts (discard between pairs):
						</label>
						<Range
							values={
								currentCutPoints.length > 0 ? currentCutPoints : cutPoints
							}
							step={0.1}
							min={0}
							max={videoDuration}
							onChange={(values) =>
								currentCutPoints.length > 0
									? setCurrentCutPoints(values)
									: setCutPoints(values)
							}
							onFinalChange={(values) => handleDrag(values)} // Update preview on drag
							renderTrack={({ props, children }) => (
								<div
									{...props}
									className="h-10 rounded-md cursor-pointer relative bg-gray-200"
									onClick={(e) => {
										const rect = e.currentTarget.getBoundingClientRect();
										const clickPosition = e.clientX - rect.left;
										const value = (clickPosition / rect.width) * videoDuration;
										addCutPoint(value);
									}}
									style={{
										background: getTrackBackground({
											values:
												currentCutPoints.length > 0
													? currentCutPoints
													: cutPoints,
											colors: (currentCutPoints.length > 0
												? currentCutPoints
												: cutPoints
											).map(() => "#A5B4FC"), // Indigo-300 for cuts
											min: 0,
											max: videoDuration,
										}),
										position: "relative",
									}}
								>
									{children}
									{cutPoints.length > 0 &&
										cutPoints
											.reduce((acc, _, i, arr) => {
												if (i % 2 === 0 && i < arr.length - 1) {
													acc.push({
														start: arr[i],
														end: arr[i + 1],
													});
												}
												return acc;
											}, [])
											.map((range, index) => (
												<div
													key={index}
													className="absolute top-0 h-8 bg-red-500 opacity-30"
													style={{
														left: `${(range.start / videoDuration) * 100}%`,
														width: `${
															((range.end - range.start) / videoDuration) * 100
														}%`,
													}}
													/* onMouseEnter={(e) => {
														const hoverDiv = document.createElement("div");
														hoverDiv.className =
															"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-700 text-lg cursor-pointer";
														hoverDiv.textContent = "🗑️";
														e.currentTarget.appendChild(hoverDiv);
													}}
													onMouseLeave={(e) => {
														const hoverDiv =
															e.currentTarget.querySelector("div");
														if (hoverDiv) hoverDiv.remove();
													}}
													onClick={(e) => {
														e.stopPropagation();
														removeCutRange(range.start, range.end);
													}} */
												>
													<Trash2Icon
														className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer"
														size={18}
														onClick={(e) => {
															e.stopPropagation();
															removeCutRange(range.start, range.end);
														}}
													/>
												</div>
											))}
								</div>
							)}
							renderThumb={({ props, isDragged, index }) => (
								<div
									{...props}
									className={`w-2 h-full bg-indigo-300 ${
										isDragged ? "shadow-lg" : ""
									}`}
									style={{
										...props.style,
										border: "2px solid #FFFFFF",
									}}
								/>
							)}
						/>
						<div className="flex flex-wrap gap-2 mt-2 text-indigo-600">
							{currentCutPoints.length > 0
								? currentCutPoints.map((point, index) => (
										<span key={index} className="text-sm">
											Temp Cut {index + 1}: {point.toFixed(1)}s{" "}
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setCurrentCutPoints(
														currentCutPoints.filter((_, i) => i !== index)
													)
												}
												className="text-red-500 hover:bg-red-100 p-1 h-auto"
											>
												×
											</Button>
										</span>
								  ))
								: cutPoints.map((point, index) => (
										<span key={index} className="text-sm">
											Cut {index + 1}: {point.toFixed(1)}s{" "}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeCutPoints()}
												className="text-red-500 hover:bg-red-100 p-1 h-auto"
											>
												×
											</Button>
										</span>
								  ))}
						</div>
					</div>
					<Button
						onClick={removeCutPoints}
						className="mt-4 w-full bg-white text-indigo-300 border border-indigo-300 hover:bg-indigo-50"
						variant="outline"
					>
						Re-add All Discarded Portions
					</Button>
					<Button
						onClick={trimAndMergeVideo}
						disabled={
							loading || cutPoints.length === 0 || cutPoints.length % 2 !== 0
						}
						className="mt-4 w-full bg-indigo-300 hover:bg-indigo-400 text-white"
					>
						{loading ? "Trimming..." : "Trim & Merge Video"}
					</Button>
					{trimmedSrc && (
						<div className="mt-6">
							<h3 className="text-lg font-semibold text-indigo-900 mb-2">
								Trimmed Video:
							</h3>
							<video controls src={trimmedSrc} width="100%" className="mb-4" />
							<a href={trimmedSrc} download={`trimmed-${videoId}.webm`}>
								<Button
									variant="outline"
									className="w-full border-indigo-300 text-indigo-300 hover:bg-indigo-50"
								>
									Download Trimmed Video
								</Button>
							</a>
						</div>
					)}
				</CardContent>
			</Card>
			<Dialog open={isUploading} onOpenChange={() => {}}>
				<DialogContent className="bg-white p-6 rounded-lg shadow-lg">
					<DialogHeader>
						<DialogTitle className="text-indigo-900">
							Uploading Video
						</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
						<p className="text-indigo-700">Uploading to S3...</p>
						<Progress value={uploadProgress} className="mt-2 bg-indigo-100" />
						<p className="text-indigo-600 text-sm mt-2">{uploadProgress}%</p>
					</div>

					{trimmedSrc && (
						<div className="flex gap-4">
							<Button
								onClick={() => {
									setIsUploading(false);
									setUploadProgress(0);
								}}
								className="flex-1 bg-indigo-300 hover:bg-indigo-400 text-white"
							>
								Continue Editing
							</Button>
							<Link href={"/library"}>
								<Button className="" variant="outline">
									Go Back to Library
								</Button>
							</Link>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	) : (
		<EditingUpgradePrompt />
	);
};

export default VideoEditor;
