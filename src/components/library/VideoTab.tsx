import React, { useEffect, useState } from "react";
import { VideoCard } from "../main/VideoCard";
import { useRouter } from "next/navigation";
import { getMyVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";
import { useSSE } from "@/hooks/useVideoSSE";
import { useUserStore } from "@/providers/UserStoreProvider";
import { Video } from "@/types";
import clsx from "clsx";

interface NewVideo extends Video {
	status: boolean;
	message: string;
	event: string;
}

function VideoTab({
	folderId,
	spaceId,
}: {
	folderId?: string;
	spaceId?: string;
}) {
	const [videos, setVideos] = useState<Video[]>([]);
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);
	const userId = useUserStore((state) => state.id);
	const [newVideoStatus, setNewVideoStatus] = useState<NewVideo[]>([]);
	const [refetch, setRefetch] = useState(false);

	// Listen for SSE events
	const { messages, setMessages } = useSSE<NewVideo>(
		`/api/video/${selectedWorkspace.id}/events?userId=${userId}`,
		[selectedWorkspace.id, userId]
	);

	useEffect(() => {
		if (messages.length > 0) {
			const newMessage = messages[messages.length - 1];
			setMessages([]);

			// If transcoding is done, remove it from pending list and refetch
			if (newMessage.transcodeStatus !== "PENDING") {
				console.log("Video transcoded successfully");
				setNewVideoStatus((prev) => {
					const data = prev.filter((m) => m.id !== newMessage.id);
					console.log("update video: ", data);
					return data;
				});
				setRefetch((prev) => !prev);
			} else {
				// Update or add processing video status
				setNewVideoStatus((prev) => {
					const existingIndex = prev.findIndex((m) => m.id === newMessage.id);
					if (existingIndex !== -1) {
						const updatedList = [...prev];
						updatedList[existingIndex] = {
							...prev[existingIndex],
							...newMessage,
						};
						return updatedList;
					}
					return [...prev, newMessage];
				});
			}
		}
	}, [messages, setMessages]);

	// Fetch existing videos
	useEffect(() => {
		async function fetchVideos() {
			const response = await getMyVideos(
				selectedWorkspace.id,
				folderId,
				spaceId
			);
			const { videos } = response.data;
			setVideos(videos);
		}
		fetchVideos();
	}, [folderId, selectedWorkspace.id, refetch, spaceId]);

	const handleOnClick = (videoId: string) => {
		router.push("/video/" + videoId);
	};

	return (
		<div className="flex flex-wrap gap-5">
			{/* Processing videos (greyed out, disabled cursor) */}
			{newVideoStatus.map((v) => (
				<div
					key={v.id}
					className={clsx(
						"opacity-50 cursor-not-allowed transition-opacity duration-300",
						"hover:opacity-60"
					)}
				>
					<VideoCard {...v} key={v.id} onClick={() => {}} />
				</div>
			))}

			{/* Clickable completed videos */}
			{videos.map((v) => (
				<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
			))}
		</div>
	);
}

export default VideoTab;
