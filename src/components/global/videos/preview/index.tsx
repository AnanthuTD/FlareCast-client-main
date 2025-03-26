"use client";

import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	Suspense,
} from "react";
import TabMenu from "../../tabs";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useSSE } from "@/hooks/useVideoSSE";
import { Video } from "@/types";
import {
	getPreviewVideo,
	updateTitle,
	updateDescription,
	removeWatchLaterVideo,
	addWatchLaterVideo,
} from "@/actions/video";
import {
	BookmarkCheckIcon,
	BookmarkIcon,
	Download,
	Pencil,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CopyLink from "../copy-link";
import RichLink from "../rich-link";
import { truncateString } from "@/lib/utils";
import TrimButton from "../../trim-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Loader from "@/components/loader";

// Lazy load heavy components
const Player = React.lazy(() => import("@/components/global/videos/Player"));
const AiTools = React.lazy(() => import("../../ai-tools"));
const VideoTranscript = React.lazy(() => import("../../video-transcript"));
const ChatBox = React.lazy(() => import("../../chat-box"));

type Props = {
	videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
	const [video, setVideo] = useState<Video | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const userId = useUserStore((state) => state.id);
	const [isEditingTitle, setEditTitle] = useState(false);
	const [isEditingDescription, setEditDescription] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const user = useUserStore((state) => state);

	const { messages, setMessages } = useSSE<Video>(
		`/api/video/${activeWorkspaceId}/events?userId=${userId}`,
		[activeWorkspaceId, userId]
	);

	const fetchPreviewVideo = useCallback(async () => {
		try {
			const { video } = await getPreviewVideo(videoId);
			if (!video) {
				setErrorMessage("The requested video could not be found.");
				return;
			}
			setVideo(video);
			setTitle(video.title || "Untitled Video");
			setDescription(video.description || "No Summary");
		} catch (error) {
			setErrorMessage(
				error.message || "Failed to load the video. Please try again later."
			);
			toast.error(error.message || "Failed to get preview video");
		}
	}, [videoId]);

	useEffect(() => {
		fetchPreviewVideo();
	}, [fetchPreviewVideo]);

	useEffect(() => {
		if (!messages.length) return;
		const newMessage = messages[messages.length - 1];
		setMessages([]);
		setVideo((prevVideo) => {
			if (!prevVideo || prevVideo.id !== newMessage.id) return prevVideo;
			return {
				...prevVideo,
				transcodeStatus:
					newMessage.transcodeStatus || prevVideo.transcodeStatus,
				transcription:
					newMessage.transcriptionStatus === "SUCCESS"
						? newMessage.transcription
						: prevVideo.transcription,
				liveStreamStatus:
					newMessage.liveStreamStatus || prevVideo.liveStreamStatus,
				type: newMessage.type || prevVideo.type,
			};
		});
	}, [messages, setMessages]);

	const daysAgo = useMemo(() => {
		if (!video?.createdAt) return "";
		const days = Math.floor(
			(Date.now() - new Date(video.createdAt).getTime()) / (24 * 60 * 60 * 1000)
		);
		return days === 0 ? "Today" : `${days}d ago`;
	}, [video?.createdAt]);

	const handleTitleSave = async () => {
		setEditTitle(false);
		if (video?.title !== title) {
			try {
				await updateTitle(videoId, title);
				setVideo((prev) => prev && { ...prev, title });
				toast.success("Title updated successfully");
			} catch {
				toast.error("Failed to update title");
			}
		}
	};

	const handleDescriptionSave = async () => {
		setEditDescription(false);
		if (video?.description !== description) {
			try {
				await updateDescription(videoId, description);
				setVideo((prev) => prev && { ...prev, description });
				toast.success("Description updated successfully");
			} catch {
				toast.error("Failed to update description");
			}
		}
	};

	const pageUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`;
	const thumbnailUrl = `/gcs/${videoId}/thumbnails/thumb00001.jpg`;
	const hlsUrl = `/gcs/${videoId}/master.m3u8`;

	return (
		<div className="max-w-7xl mx-auto py-6">
			{video ? (
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
					<div className="flex flex-col lg:col-span-2 gap-y-6">
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									{isEditingTitle ? (
										<Input
											value={title || "Untitled Video"}
											onChange={(e) => setTitle(e.target.value)}
											onBlur={handleTitleSave}
											autoFocus
										/>
									) : (
										<h2 className="text-2xl font-bold">
											{video?.title || "Untitled Video"}
										</h2>
									)}
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setEditTitle(!isEditingTitle)}
									>
										<Pencil className="w-4 h-4" />
									</Button>
								</div>
								<p className="text-sm text-gray-500">{daysAgo}</p>
							</CardHeader>
							<CardContent>
								<Suspense
									fallback={
										<Loader
											state={true}
											size="lg"
											color="gray-300"
											className="h-64"
										/>
									}
								>
									<Player
										hslUrl={hlsUrl}
										thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`}
										posterUrl={thumbnailUrl}
										videoId={videoId}
										type={video.type}
									/>
								</Suspense>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex items-center py-2 justify-end gap-4">
								<TrimButton
									trim={!!user.plan?.trim || true}
									videoId={videoId}
								/>
								<CopyLink videoId={videoId} isPublic={video.isPublic} />
								<RichLink
									description={truncateString(video.description as string, 150)}
									id={videoId}
									source={`${videoId}/master.m3u8`}
									title={video.title as string}
								/>
								<Download className="text-[#4d4c4c]" />
								{video?.watchLater && video.watchLater.id ? (
									<BookmarkCheckIcon
										onClick={async () => {
											const watchLater = video.watchLater;
											setVideo((prev) => ({ ...prev, watchLater: null }));
											const { success } = await removeWatchLaterVideo({
												videoId: video.id,
												workspaceId: video.workspaceId,
											});
											setVideo((prev) => ({
												...prev,
												watchLater: success ? null : watchLater,
											}));
										}}
									/>
								) : (
									<BookmarkIcon
										onClick={async () => {
											setVideo((prev) => ({
												...prev,
												watchLater: { id: "temp-id" },
											}));
											const { watchLater } = await addWatchLaterVideo({
												videoId: video.id,
												workspaceId: video.workspaceId,
											});
											setVideo((prev) => ({ ...prev, watchLater }));
										}}
									/>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<p className="text-lg font-semibold">Description</p>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setEditDescription(!isEditingDescription)}
									>
										<Pencil className="w-4 h-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{isEditingDescription ? (
									<Textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										onBlur={handleDescriptionSave}
										autoFocus
									/>
								) : (
									<p className="text-md text-gray-700">
										{video?.description || "No description available"}
									</p>
								)}
							</CardContent>
						</Card>
					</div>
					<div className="lg:col-span-1">
						<TabMenu
							defaultValue="AI Tool"
							triggers={["AI Tool", "Transcript", "Activity"]}
						>
							<Suspense
								fallback={<Loader state={true} size="md" color="gray-300" />}
							>
								{video.id && (
									<AiTools videoId={video.id} trial={false} plan={user.plan} />
								)}
								<VideoTranscript
									transcript={
										video?.transcription || "Transcript not available"
									}
								/>
								{video?.id && video.workspaceId && video.userId && (
									<ChatBox videoId={video.id} />
								)}
							</Suspense>
						</TabMenu>
					</div>
				</div>
			) : errorMessage ? (
				<Alert variant="destructive" className="max-w-2xl mx-auto">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Video Not Found</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			) : (
				<Loader
					state={true}
					size="lg"
					color="gray-300"
					className="min-h-screen"
				/>
			)}
		</div>
	);
};

export default VideoPreview;
