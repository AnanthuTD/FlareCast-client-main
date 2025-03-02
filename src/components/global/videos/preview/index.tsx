"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import TabMenu from "../../tabs";
import VideoTranscript from "../../video-transcript";
import { toast } from "sonner";
import Player from "@/components/global/videos/Player";
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
	Bookmark,
	BookmarkCheck,
	BookmarkCheckIcon,
	BookmarkIcon,
	Pencil,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatBox from "../../chat-box";
import AiTools from "../../ai-tools";
import { TabsContent } from "@/components/ui/tabs";

type Props = {
	videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
	const [video, setVideo] = useState<Video | null>(null);
	const activeWorkspaceId = useWorkspaceStore(
		(state) => state.selectedWorkspace.id
	);
	const selectedSpaceId = useWorkspaceStore((state) => state.selectedSpace);

	const userId = useUserStore((state) => state.id);
	const [isEditingTitle, setEditTitle] = useState(false);
	const [isEditingDescription, setEditDescription] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const { messages, setMessages } = useSSE<Video>(
		`/api/video/${activeWorkspaceId}/events?userId=${userId}`,
		[activeWorkspaceId, userId]
	);

	const fetchPreviewVideo = useCallback(async () => {
		try {
			const { video } = await getPreviewVideo(videoId);
			setVideo(video);
			setTitle(video.title);
			setDescription(video.description);
		} catch (error) {
			toast.error("Failed to get preview video");
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
			if (!prevVideo) return prevVideo;
			return {
				...prevVideo,
				transcodeStatus:
					newMessage.transcriptionStatus === "SUCCESS"
						? "success"
						: prevVideo.transcodeStatus,
				transcription:
					newMessage.transcriptionStatus === "SUCCESS"
						? newMessage.transcription
						: prevVideo.transcription,
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

	return !video ? (
		<div>
			<p>Loading video...</p>
		</div>
	) : (
		<div className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
			<div className="flex flex-col lg:col-span-2 gap-y-6">
				<Card>
					<CardHeader>
						<div className="flex justify-between items-center">
							{isEditingTitle ? (
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									onBlur={handleTitleSave}
									autoFocus
								/>
							) : (
								<h2 className="text-2xl font-bold">{video?.title}</h2>
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
						<Player
							hslUrl={`/gcs/${videoId}/master.m3u8`}
							thumbnailsUrl={`/gcs/${videoId}/thumbnails/thumbnails.vtt`}
							posterUrl={`/gcs/${videoId}/thumbnails/thumb00001.jpg`}
							videoId={videoId}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center py-2 justify-end">
						{video?.watchLater && video.watchLater.id ? (
							<BookmarkCheckIcon
								onClick={async () => {
									const watchLater = video.watchLater;

									setVideo((prev) => ({
										...prev,
										watchLater: null,
									}));

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
					triggers={["AI Tool", "Transcript", "Activity", "asd"]}
				>
					{video.id && <AiTools videoId={video.id} trial={false} plan={"PRO"} />}

					<VideoTranscript
						transcript={video?.transcription || "Transcript not available"}
					/>

					{video?.id && <ChatBox videoId={video.id} />}
				</TabMenu>
			</div>
		</div>
	);
};

export default VideoPreview;
