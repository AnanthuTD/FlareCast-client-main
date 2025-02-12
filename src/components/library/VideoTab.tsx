import React, { useEffect, useState } from "react";
import { VideoCard } from "../main/VideoCard";
import { useRouter } from "next/navigation";
import { getMyVideos } from "@/actions/video";
import { useWorkspaceStore } from "@/providers/WorkspaceStoreProvider";

function VideoTab() {
	const [videos, setVideos] = useState([]);
	const router = useRouter();
	const selectedWorkspace = useWorkspaceStore(
		(state) => state.selectedWorkspace
	);

	useEffect(() => {
		async function fetchVideos() {
			const response = await getMyVideos(selectedWorkspace.id);

			const { videos, totalCount, remainingCount } = response.data;

			setVideos(videos);
		}

		fetchVideos();
	}, [selectedWorkspace.id]);

	const handleOnClick = (videoId: string) => {
		console.log("Video clicked!");
		// Trigger the video player with the videoId or videoData from props.
		router.push("/video/" + videoId);
	};

	return (
		<div className="flex flex-wrap gap-5">
			{videos.map((v) => (
				<VideoCard {...v} key={v.id} onClick={() => handleOnClick(v.id)} />
			))}
		</div>
	);
}

export default VideoTab;
